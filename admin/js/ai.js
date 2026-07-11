/* ai.js — Gemini 챗 패널. window.Admin.ai 에 부착.
   classic script(ES 모듈 금지). core/store/editor/versions/bus 계약은 SPEC 참조.

   v2: 대화를 페이지별로 IndexedDB(settings)에 영속화 → 새로고침 후 복원·이어가기.
       각 모델 응답의 초안마다 미리보기/적용/비교 액션 제공(최신뿐 아니라 전체). */
(function () {
  'use strict';

  window.Admin = window.Admin || {};

  // Gemini REST 엔드포인트 상수(키는 쿼리스트링으로만 사용, 로그/감사에 남기지 않음)
  var API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
  var DEFAULT_MODEL = 'gemini-2.5-flash';

  // 첫 user 턴에 실리는 시스템 성격 프리앰블(SPEC 3항 요지, 한국어)
  var PREAMBLE = [
    '너는 연세대학교 기계공학부 웹사이트의 편집 어시스턴트다.',
    '사용자의 요청을 반영한 "완전한 수정본 HTML 문서 전체"를 항상 하나의 ```html 코드펜스 안에 담아 응답한다.',
    '코드펜스 앞에는 무엇을 바꿨는지 한국어로 3줄 이내의 변경 요약을 적는다.',
    '',
    '반드시 지킬 규칙:',
    '- 색·간격·타이포 등은 기존 디자인 토큰(CSS 변수)만 사용하고 새 색상값을 임의로 만들지 않는다.',
    '- 외부 JS 라이브러리나 ES 모듈(import/export)을 추가하지 않는다.',
    '- 기존 문서 구조와 클래스 체계를 유지한다. 요소에 data-eid 속성이 있으면 그대로 보존한다.',
    '- 이미지·링크 등 상대경로를 그대로 유지한다.',
    '- 모든 콘텐츠 텍스트는 한국어로 작성한다.',
    '- 문서 전체(<!DOCTYPE ...>부터 </html>까지)를 빠짐없이 반환한다. 일부만 반환하지 않는다.'
  ].join('\n');

  // ── 모듈 상태 ──
  var els = null;              // 캐시된 DOM 참조
  var apiKey = '';            // 메모리 보관(감사/버전에 절대 기록 안 함)
  var modelName = DEFAULT_MODEL;

  // 대화 상태 — 페이지별로 IndexedDB(settings)에 영속화
  //   history : Gemini contents 배열 {role, parts:[{text}]} (API 이어가기용)
  //   turns   : 표시용 대화록 [{role:'user'|'model', text, ver}] (ver>0이면 초안 보유)
  var convo = { path: null, history: [], turns: [], draftVersion: 0 };
  var draftsByVer = {};       // ver(number) → 초안 HTML
  var latestDraft = null;     // 하단 초안 바가 가리키는 최신 초안

  var pendingElement = null;  // 다음 전송 1회에 첨부할 요소 컨텍스트
  var sending = false;        // 중복 전송 방지
  var wired = false;          // 이벤트 배선 1회 보장
  var skipNextReset = false;  // 초안 적용 직후의 page:loaded 는 대화 복원 대상이 아님

  function esc(s) { return Admin.util.escapeHtml(String(s == null ? '' : s)); }

  function byId(id) { return document.getElementById(id); }

  function cacheEls() {
    els = {
      panel: byId('panelAI'),
      setup: byId('aiSetup'),
      keyInput: byId('aiKeyInput'),
      modelSelect: byId('aiModelSelect'),
      btnKeySave: byId('btnAiKeySave'),
      setupErr: byId('aiSetupErr'),
      chat: byId('aiChat'),
      messages: byId('aiMessages'),
      input: byId('aiInput'),
      btnSend: byId('btnAiSend'),
      keyChange: byId('aiKeyChange'),
      ctxChip: byId('aiCtxChip'),
      draftBar: byId('aiDraftBar'),
      btnPreview: byId('btnDraftPreview'),
      btnApply: byId('btnDraftApply'),
      btnDiscard: byId('btnDraftDiscard')
    };
    return !!(els.panel && els.chat && els.messages && els.input);
  }

  // ── 뷰 토글 ──
  function showSetup() {
    if (els.setupErr) els.setupErr.textContent = '';
    if (els.keyInput) els.keyInput.value = '';           // 키를 DOM에 남기지 않음
    if (els.modelSelect) els.modelSelect.value = modelName;
    if (els.setup) els.setup.hidden = false;
    if (els.chat) els.chat.hidden = true;
  }
  function showChat() {
    if (els.setup) els.setup.hidden = true;
    if (els.chat) els.chat.hidden = false;
  }

  function hasKey() { return !!apiKey; }

  function getPageHtml() {
    try {
      if (Admin.editor && typeof Admin.editor.getCleanHtml === 'function') {
        return Admin.editor.getCleanHtml() || '';
      }
    } catch (e) { /* 편집기 미준비 시 빈 문서로 진행 */ }
    return '';
  }

  // ── 영속화 ──
  function siteName() {
    try {
      return (Admin.fs && Admin.fs.siteName && Admin.fs.siteName()) ||
        (Admin.state && Admin.state.sitePath) || '';
    } catch (e) { return ''; }
  }
  function convoKey(path) { return 'ai-conv:' + siteName() + ':' + (path || ''); }

  function persist() {
    if (!convo.path) return;
    try {
      Admin.store.setSetting(convoKey(convo.path), {
        history: convo.history,
        turns: convo.turns,
        draftVersion: convo.draftVersion,
        drafts: draftsByVer
      });
    } catch (e) { /* 저장 실패는 대화를 막지 않음 */ }
  }

  // ── 메시지 렌더 ──
  function scrollBottom() {
    if (els.messages) els.messages.scrollTop = els.messages.scrollHeight;
  }

  function textToHtml(s) {
    return esc(s).replace(/\r?\n/g, '<br>');
  }

  function appendMsg(variant, bodyHtml, extraClass) {
    var wrap = document.createElement('div');
    wrap.className = 'ai-msg ai-msg--' + variant + (extraClass ? ' ' + extraClass : '');
    var body = document.createElement('div');
    body.className = 'ai-msg-body';
    body.innerHTML = bodyHtml;
    wrap.appendChild(body);
    els.messages.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function renderUser(text) {
    appendMsg('user', textToHtml(text));
  }

  function appendSystem(text) {
    // 시스템 안내는 model 버블에 --system 보조 클래스로 표시(영속화 대상 아님).
    appendMsg('model', textToHtml(text), 'ai-msg--system');
  }

  function renderPending() {
    return appendMsg('model', '<span class="ai-dot" aria-hidden="true"></span>', 'ai-msg--pending');
  }

  // 모델 본문 표시: ```html 펜스는 .ai-code-chip 로 치환, 나머지는 escape 후 줄바꿈만 <br>.
  function renderModelBody(rawText, versionNum) {
    var re = /```html[ \t]*\r?\n[\s\S]*?(?:\r?\n```|$)/gi;
    var out = '';
    var last = 0;
    var m;
    while ((m = re.exec(rawText)) !== null) {
      out += textToHtml(rawText.slice(last, m.index));
      out += '<span class="ai-code-chip mono">' + esc('HTML 초안 v' + versionNum) + '</span>';
      last = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++; // 0길이 매치 방지
    }
    out += textToHtml(rawText.slice(last));
    return out;
  }

  function finalizeModel(node, rawText, versionNum) {
    node.className = 'ai-msg ai-msg--model';
    var body = node.querySelector('.ai-msg-body');
    if (body) body.innerHTML = renderModelBody(rawText, versionNum);
    scrollBottom();
  }

  function finalizeError(node, message) {
    node.className = 'ai-msg ai-msg--model ai-msg--error';
    var body = node.querySelector('.ai-msg-body');
    if (body) body.innerHTML = textToHtml(message);
    scrollBottom();
  }

  // ── 초안 추출/바 ──
  // 마지막 ```html 펜스 추출. 닫는 펜스가 없으면(잘림 등) 문서 끝까지.
  function extractLastHtmlFence(text) {
    if (!text) return null;
    var re = /```html[ \t]*\r?\n([\s\S]*?)(?:\r?\n```|$)/gi;
    var m, found = null;
    while ((m = re.exec(text)) !== null) {
      found = m[1];
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    if (found == null || !found.trim()) return null;
    return found;
  }

  function showDraftBar() {
    if (!els.draftBar) return;
    var chip = els.draftBar.querySelector('.draft-chip');
    if (chip) chip.textContent = '최신 AI 초안 v' + convo.draftVersion + ' 준비됨';
    els.draftBar.hidden = false;
  }
  function hideDraftBar() {
    if (els.draftBar) els.draftBar.hidden = true;
  }

  // ── 대화별 초안 액션(각 모델 메시지에 부착) ──
  function attachDraftActions(node, ver) {
    if (!node || draftsByVer[ver] == null) return;
    var body = node.querySelector('.ai-msg-body') || node;
    if (body.querySelector('.ai-draft-acts')) return;   // 중복 방지
    var row = document.createElement('div');
    row.className = 'ai-draft-acts';
    row.innerHTML =
      '<button type="button" class="ai-act" data-a="preview">미리보기</button>' +
      '<button type="button" class="ai-act" data-a="apply">적용</button>' +
      '<button type="button" class="ai-act" data-a="diff">비교</button>';
    body.appendChild(row);
    row.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.ai-act') : null;
      if (b) draftAction(b.getAttribute('data-a'), ver);
    });
  }

  function draftAction(a, ver) {
    var html = draftsByVer[ver];
    if (html == null) return;
    if (a === 'preview') {
      if (Admin.editor && typeof Admin.editor.previewDraft === 'function') {
        Admin.editor.previewDraft(html, { label: 'AI 초안 v' + ver });
      }
    } else if (a === 'apply') {
      if (Admin.editor && Admin.editor.currentPath && Admin.editor.currentPath()) skipNextReset = true;
      Admin.bus.emit('ai:applyDraft', { html: html });
      hideDraftBar();
    } else if (a === 'diff') {
      if (Admin.versions && typeof Admin.versions.showDiff === 'function') {
        Admin.versions.showDiff(getPageHtml(), html, 'AI 초안 v' + ver + ' ↔ 현재 페이지');
      } else if (Admin.toast) {
        Admin.toast('비교 기능을 사용할 수 없습니다.', 'err');
      }
    }
  }

  // ── 요소 스코프 컨텍스트 칩 ──
  function showCtx(info) {
    if (!els.ctxChip) return;
    els.ctxChip.innerHTML =
      '<span class="ctx-label">선택 요소: &lt;' + esc(info.tag) + '&gt; #' + esc(info.eid) + '</span>' +
      '<button type="button" class="ctx-clear" aria-label="선택 요소 해제">해제</button>';
    els.ctxChip.hidden = false;
    var btn = els.ctxChip.querySelector('.ctx-clear');
    if (btn) btn.addEventListener('click', clearCtx);
  }
  function clearCtx() {
    pendingElement = null;
    if (els.ctxChip) { els.ctxChip.hidden = true; els.ctxChip.innerHTML = ''; }
  }

  // ── 전송 상태 ──
  function setSending(on) {
    sending = on;
    if (els.btnSend) els.btnSend.disabled = on;
    if (els.input) els.input.setAttribute('aria-busy', on ? 'true' : 'false');
  }

  // ── Gemini 호출 ──
  function statusMessage(status) {
    if (status === 400) return '요청 형식 오류이거나 API 키가 올바르지 않습니다. 키를 다시 확인하세요. (400)';
    if (status === 401 || status === 403) return 'API 키가 거부되었습니다. 키 값과 권한을 확인하세요. (' + status + ')';
    if (status === 404) return '선택한 모델을 찾을 수 없습니다. 모델을 변경해 보세요. (404)';
    if (status === 429) return '무료 사용량 한도(쿼터)를 초과했습니다. 잠시 후 다시 시도하세요. (429)';
    if (status >= 500) return 'Gemini 서버 오류입니다. 잠시 후 다시 시도하세요. (' + status + ')';
    return '요청에 실패했습니다. (HTTP ' + status + ')';
  }

  function extractReplyText(data) {
    if (data && data.promptFeedback && data.promptFeedback.blockReason) {
      throw new Error('요청이 안전 필터로 차단되었습니다. (사유: ' + data.promptFeedback.blockReason + ')');
    }
    var cand = data && data.candidates && data.candidates[0];
    if (!cand) throw new Error('모델이 응답을 반환하지 않았습니다. 다시 시도해 주세요.');
    var text = '';
    var parts = cand.content && cand.content.parts;
    if (parts && parts.length) {
      for (var i = 0; i < parts.length; i++) {
        if (parts[i] && typeof parts[i].text === 'string') text += parts[i].text;
      }
    }
    if (!text) {
      if (cand.finishReason === 'MAX_TOKENS') {
        throw new Error('응답이 최대 토큰 한도에 도달해 내용이 비었습니다. 요청 범위를 좁혀 다시 시도하세요.');
      }
      throw new Error('빈 응답을 받았습니다. 다시 시도해 주세요.');
    }
    return text;
  }

  async function callGemini() {
    // URL에 키가 포함되므로 이 문자열은 절대 로그/감사/에러메시지에 노출하지 않는다.
    var url = API_BASE + encodeURIComponent(modelName) + ':generateContent?key=' + encodeURIComponent(apiKey);
    var body = {
      contents: convo.history,
      generationConfig: { temperature: 0.4, maxOutputTokens: 65536 }
    };
    var res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {
      throw new Error('네트워크 오류로 요청에 실패했습니다. 연결 상태를 확인하세요.');
    }
    if (!res.ok) {
      throw new Error(statusMessage(res.status));
    }
    var data;
    try { data = await res.json(); }
    catch (e) { throw new Error('응답을 해석하지 못했습니다. 다시 시도해 주세요.'); }
    return extractReplyText(data);
  }

  // ── 전송 파이프라인 ──
  async function send() {
    if (sending) return;
    if (!els.input) return;
    var text = els.input.value.trim();
    if (!text) return;
    if (!hasKey()) { showSetup(); return; }

    var first = convo.history.length === 0;

    // API용 메시지 조립(표시는 사용자가 입력한 text만, 프리앰블/HTML/요소컨텍스트는 API에만).
    var pieces = [];
    if (first) pieces.push(PREAMBLE);
    if (pendingElement) {
      pieces.push('이번 요청은 다음 요소를 중심으로 수정해 주세요. 대상 요소의 현재 outerHTML:\n' + pendingElement.outerHTML +
        '\n(문서 전체를 반환하되 이 요소를 중심으로 반영)');
    }
    if (first) {
      pieces.push('현재 페이지의 전체 HTML입니다:\n' + getPageHtml());
    }
    pieces.push('요청: ' + text);
    var apiText = pieces.join('\n\n');

    // 요소 컨텍스트는 1회 사용 후 해제
    if (pendingElement) clearCtx();

    els.input.value = '';
    renderUser(text);
    convo.turns.push({ role: 'user', text: text });
    convo.history.push({ role: 'user', parts: [{ text: apiText }] });
    persist();

    var pend = renderPending();
    setSending(true);
    try {
      var reply = await callGemini();
      convo.history.push({ role: 'model', parts: [{ text: reply }] });
      var extracted = extractLastHtmlFence(reply);
      var ver = 0;
      if (extracted != null) {
        ver = ++convo.draftVersion;
        draftsByVer[ver] = extracted;
        latestDraft = extracted;
        showDraftBar();
      }
      convo.turns.push({ role: 'model', text: reply, ver: ver });
      finalizeModel(pend, reply, ver);
      if (ver) attachDraftActions(pend, ver);
      persist();
    } catch (e) {
      // 실패한 user 턴을 이력·대화록에서 되돌려 role 교대 규칙 유지(영속화도 정합 유지)
      convo.history.pop();
      convo.turns.pop();
      persist();
      finalizeError(pend, (e && e.message) ? e.message : '요청에 실패했습니다.');
    } finally {
      setSending(false);
    }
  }

  // ── 키 저장 ──
  async function saveKey() {
    if (!els.keyInput) return;
    var k = els.keyInput.value.trim();
    var m = (els.modelSelect && els.modelSelect.value) || DEFAULT_MODEL;
    if (!k) {
      if (els.setupErr) els.setupErr.textContent = 'API 키를 입력하세요.';
      return;
    }
    if (els.setupErr) els.setupErr.textContent = '';
    try {
      await Admin.store.setSetting('gemini-key', k);
      await Admin.store.setSetting('gemini-model', m);
    } catch (e) {
      if (els.setupErr) els.setupErr.textContent = '설정을 저장하지 못했습니다.';
      return;
    }
    apiKey = k;
    modelName = m;
    els.keyInput.value = '';            // 저장 후 DOM에서 즉시 제거
    showChat();
    Admin.toast('Gemini 연결이 저장되었습니다.', 'ok');
    if (els.input) els.input.focus();
  }

  // ── 대화 렌더(turns 로부터 재구성) ──
  function renderConvo() {
    if (!els.messages) return;
    els.messages.innerHTML = '';
    for (var i = 0; i < convo.turns.length; i++) {
      var t = convo.turns[i];
      if (t.role === 'user') {
        renderUser(t.text);
      } else if (t.role === 'model') {
        var node = appendMsg('model', renderModelBody(t.text, t.ver || 0));
        if (t.ver && draftsByVer[t.ver] != null) attachDraftActions(node, t.ver);
      }
    }
    scrollBottom();
  }

  function welcomeText(path) {
    var name = '';
    try { name = path && Admin.util.basename ? Admin.util.basename(path) : (path || ''); } catch (e) {}
    return name
      ? '「' + name + '」 페이지입니다. 요청을 입력하면 페이지 전체를 반영한 수정본을 제안합니다.'
      : '요청을 입력하면 페이지 전체를 반영한 수정본을 제안합니다.';
  }

  // ── 페이지별 대화 로드/복원 ──
  async function loadConvo(path) {
    convo.path = path;
    convo.history = [];
    convo.turns = [];
    convo.draftVersion = 0;
    draftsByVer = {};
    latestDraft = null;

    var saved = null;
    try { saved = await Admin.store.getSetting(convoKey(path)); } catch (e) { saved = null; }
    if (saved && (saved.turns || saved.history)) {
      convo.history = saved.history || [];
      convo.turns = saved.turns || [];
      convo.draftVersion = saved.draftVersion || 0;
      draftsByVer = saved.drafts || {};
    }

    if (els.messages) els.messages.innerHTML = '';
    clearCtx();
    if (convo.turns.length) {
      renderConvo();
      appendSystem('이전 대화를 불러왔습니다. 이어서 요청하면 대화가 계속됩니다. (각 초안의 미리보기·적용·비교 버튼은 그대로 사용할 수 있습니다.)');
      if (convo.draftVersion && draftsByVer[convo.draftVersion] != null) {
        latestDraft = draftsByVer[convo.draftVersion];
        showDraftBar();
      } else {
        hideDraftBar();
      }
    } else {
      hideDraftBar();
      appendSystem(welcomeText(path));
    }
  }

  // ── 배선 ──
  function wire() {
    if (wired) return;
    wired = true;

    if (els.btnKeySave) els.btnKeySave.addEventListener('click', saveKey);
    if (els.keyInput) {
      els.keyInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); saveKey(); }
      });
    }
    if (els.keyChange) els.keyChange.addEventListener('click', function () { showSetup(); });

    if (els.btnSend) els.btnSend.addEventListener('click', send);
    if (els.input) {
      // Enter 전송 / Shift+Enter 줄바꿈. 전송 중이면 무시.
      els.input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (!sending) send();
        }
      });
    }

    // 하단 초안 바 = 최신 초안 빠른 실행
    if (els.btnPreview) els.btnPreview.addEventListener('click', function () {
      if (latestDraft && Admin.editor && typeof Admin.editor.previewDraft === 'function') {
        Admin.editor.previewDraft(latestDraft, { label: 'AI 초안 v' + convo.draftVersion });
      }
    });
    if (els.btnApply) els.btnApply.addEventListener('click', function () {
      if (!latestDraft) return;
      if (Admin.editor && Admin.editor.currentPath && Admin.editor.currentPath()) skipNextReset = true;
      Admin.bus.emit('ai:applyDraft', { html: latestDraft });
      hideDraftBar();
    });
    if (els.btnDiscard) els.btnDiscard.addEventListener('click', function () {
      if (Admin.editor && typeof Admin.editor.exitDraft === 'function') Admin.editor.exitDraft();
      hideDraftBar();
    });

    // 요소 스코프: 다음 전송 1회에 outerHTML 컨텍스트 첨부
    Admin.bus.on('ai:editElement', function (info) {
      if (!info || !info.eid) return;
      pendingElement = { eid: info.eid, tag: info.tag || '', outerHTML: info.outerHTML || '' };
      showCtx(pendingElement);
      if (els.input) els.input.focus();
    });

    // 페이지 로드 시 해당 페이지 대화 복원(초안 적용 직후 1회는 유지)
    Admin.bus.on('page:loaded', function (data) {
      if (skipNextReset) {
        skipNextReset = false;
        hideDraftBar();
        appendSystem('초안이 페이지에 적용되었습니다. 이어서 피드백을 주시면 적용된 상태를 기준으로 다시 제안합니다.');
        return;
      }
      loadConvo(data && data.path);
    });
  }

  // ── 공개 API ──
  var api = {
    init: async function () {
      if (!cacheEls()) return;         // AI 패널 DOM 부재 시 안전 종료
      wire();
      try {
        var k = await Admin.store.getSetting('gemini-key');
        var m = await Admin.store.getSetting('gemini-model');
        if (k) apiKey = k;
        if (m) modelName = m;
      } catch (e) { /* 저장소 미준비 시 설정 뷰로 진행 */ }
      if (hasKey()) showChat(); else showSetup();
      // 이미 페이지가 열려 있으면(패널 지연 초기화 등) 현재 페이지 대화 복원
      try {
        if (Admin.editor && Admin.editor.currentPath && Admin.editor.currentPath()) {
          loadConvo(Admin.editor.currentPath());
        }
      } catch (e) {}
    },
    hasDraft: function () { return !!latestDraft; }
  };

  Admin.ai = api;
})();
