/* Vercel 서버리스 함수 — YSME In-Place Studio AI 프록시.

   왜 프록시인가: 편집 오버레이는 **공개된 사이트 페이지** 위에서 돌아간다.
   브라우저가 AI 제공자를 직접 호출하면 (1) API 키가 URL 쿼리에 실려 나가고
   (2) 사이트 페이지에 외부 호출을 허용하는 CSP 구멍을 뚫어야 한다.
   여기서 중계하면 페이지는 동일 오리진만 호출하면 된다.

   API 키는 요청 본문으로만 받고 **저장·로그·에코하지 않는다.**
   오픈 프록시가 되지 않도록 편집자 공용 암호(PUBLISH_PASSCODE)를 요구한다.

   요청 (POST JSON):
     { passcode, provider:'gemini'|'claude', model, apiKey,
       system?, messages:[{role:'user'|'assistant', content}],
       json?:true, schema?, temperature?, maxOutputTokens? }
   응답:
     { text }                     일반 응답
     { text, data }               json:true 이고 파싱 성공 시 data 포함
     { error, status }            실패
*/

var GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
var CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST 요청만 허용됩니다.' }); return; }

  var PASSCODE = process.env.PUBLISH_PASSCODE;
  if (!PASSCODE) { res.status(500).json({ error: '서버 설정이 완료되지 않았습니다(PUBLISH_PASSCODE).' }); return; }

  var body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  if (!body.passcode || !safeEqual(String(body.passcode), String(PASSCODE))) {
    await sleep(400);
    res.status(401).json({ error: '공용 암호가 올바르지 않습니다.' });
    return;
  }

  var provider = String(body.provider || 'gemini');
  var model = String(body.model || '');
  var apiKey = String(body.apiKey || '');
  if (!/^[A-Za-z0-9._:-]{1,80}$/.test(model)) { res.status(400).json({ error: '모델 이름이 올바르지 않습니다.' }); return; }
  if (apiKey.length < 8 || apiKey.length > 400) { res.status(400).json({ error: 'API 키를 확인하세요.' }); return; }

  var messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) { res.status(400).json({ error: '보낼 메시지가 없습니다.' }); return; }
  var totalChars = 0;
  for (var i = 0; i < messages.length; i++) totalChars += String((messages[i] && messages[i].content) || '').length;
  if (totalChars > 900000) { res.status(413).json({ error: '요청이 너무 큽니다. 편집 범위를 좁혀 주세요.' }); return; }

  var wantJson = !!body.json;
  var temperature = numOr(body.temperature, 0.3, 0, 2);
  var maxOut = Math.round(numOr(body.maxOutputTokens, provider === 'claude' ? 8192 : 16384, 256, 65536));

  try {
    var out;
    if (provider === 'gemini') out = await callGemini();
    else if (provider === 'claude') out = await callClaude();
    else { res.status(400).json({ error: '지원하지 않는 provider: ' + provider }); return; }

    if (out.error) { res.status(out.status || 502).json({ error: out.error }); return; }

    var payload = { text: out.text };
    if (wantJson) {
      var parsed = parseJsonLoose(out.text);
      if (parsed == null) {
        res.status(502).json({ error: 'AI 응답을 JSON 으로 해석할 수 없습니다. 다시 시도하거나 요청을 더 구체적으로 적어 주세요.', text: out.text.slice(0, 2000) });
        return;
      }
      payload.data = parsed;
    }
    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({ error: 'AI 호출 중 오류가 발생했습니다.' });
  }

  /* ── Gemini ── */
  async function callGemini() {
    var contents = messages.map(function (m) {
      return { role: (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user', parts: [{ text: String(m.content || '') }] };
    });
    var gen = { temperature: temperature, maxOutputTokens: maxOut };
    if (wantJson) {
      gen.responseMimeType = 'application/json';
      if (body.schema && typeof body.schema === 'object') gen.responseSchema = body.schema;
    }
    var reqBody = { contents: contents, generationConfig: gen };
    if (body.system) reqBody.systemInstruction = { parts: [{ text: String(body.system) }] };

    var r = await fetch(GEMINI_BASE + encodeURIComponent(model) + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(reqBody)
    });
    var d = await r.json().catch(function () { return null; });
    if (!r.ok) return { error: geminiMsg(r.status, d), status: r.status };

    if (d && d.promptFeedback && d.promptFeedback.blockReason) {
      return { error: 'AI 가 요청을 거부했습니다 (' + d.promptFeedback.blockReason + ').', status: 400 };
    }
    var cand = d && d.candidates && d.candidates[0];
    var text = '';
    if (cand && cand.content && Array.isArray(cand.content.parts)) {
      text = cand.content.parts.map(function (p) { return p && p.text ? p.text : ''; }).join('');
    }
    if (cand && cand.finishReason === 'MAX_TOKENS') {
      // 잘린 응답을 그대로 넘기면 패치가 깨진 상태로 적용된다 — 실패로 처리한다.
      return { error: '응답이 최대 길이에서 잘렸습니다. 수정 범위를 좁혀 다시 요청하세요.', status: 502 };
    }
    if (!text) return { error: 'AI 응답이 비어 있습니다.', status: 502 };
    return { text: text };
  }

  /* ── Claude ── */
  async function callClaude() {
    var sys = body.system ? String(body.system) : '';
    if (wantJson) sys += (sys ? '\n\n' : '') + '반드시 유효한 JSON 하나만 출력한다. 설명·코드펜스·주석을 붙이지 않는다.';
    var msgs = messages.map(function (m) {
      return { role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') };
    });
    var r = await fetch(CLAUDE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: model, max_tokens: maxOut, temperature: temperature, system: sys || undefined, messages: msgs })
    });
    var d = await r.json().catch(function () { return null; });
    if (!r.ok) {
      var m2 = d && d.error && d.error.message ? d.error.message : '';
      return { error: 'AI 호출 실패 (' + r.status + ')' + (m2 ? ' — ' + m2 : ''), status: r.status };
    }
    var text2 = '';
    if (d && Array.isArray(d.content)) {
      text2 = d.content.map(function (b) { return b && b.type === 'text' && b.text ? b.text : ''; }).join('');
    }
    if (d && d.stop_reason === 'max_tokens') {
      return { error: '응답이 최대 길이에서 잘렸습니다. 수정 범위를 좁혀 다시 요청하세요.', status: 502 };
    }
    if (!text2) return { error: 'AI 응답이 비어 있습니다.', status: 502 };
    return { text: text2 };
  }
};

function geminiMsg(status, d) {
  var detail = d && d.error && d.error.message ? ' — ' + d.error.message : '';
  if (status === 400) return 'API 키 또는 요청 형식이 올바르지 않습니다.' + detail;
  if (status === 401 || status === 403) return 'API 키가 거부되었습니다. 키가 활성 상태인지 확인하세요.' + detail;
  if (status === 404) return '모델을 찾을 수 없습니다. 다른 모델을 선택하세요.' + detail;
  if (status === 429) return '무료 사용량을 초과했습니다. 잠시 후 다시 시도하거나 더 가벼운 모델을 쓰세요.';
  if (status >= 500) return 'AI 서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도하세요.';
  return 'AI 호출 실패 (' + status + ')' + detail;
}

// 코드펜스가 섞여 오는 경우까지 관용적으로 JSON 을 뽑는다.
function parseJsonLoose(text) {
  var s = String(text == null ? '' : text).trim();
  try { return JSON.parse(s); } catch (e) {}
  var fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1].trim()); } catch (e) {} }
  var a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch (e) {} }
  return null;
}
function numOr(v, dflt, lo, hi) {
  var n = parseFloat(v);
  if (!isFinite(n)) return dflt;
  return Math.max(lo, Math.min(hi, n));
}
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var d = 0;
  for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
