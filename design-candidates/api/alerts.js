/* Vercel 서버리스 함수 — 공지 메일 알림(구독·발송).

   학사 일정의 QR 를 찍으면 subscribe.html 이 열리고, 이메일을 넣으면
   확인 메일 → 링크 클릭(이중 확인) → 구독 확정. 스튜디오에서 공지를 「게시」하면
   구독자 전원에게 새 공지 메일이 나간다. 해지 링크는 모든 메일 하단에 붙는다.

   publish.js 와 같은 원칙 — 비밀(토큰·키)은 전부 서버 env 에만 두고,
   브라우저에는 아무것도 내려가지 않는다. npm 의존성도 쓰지 않는다.

   필요한 환경변수 (Vercel Project Settings → Environment Variables):
     UPSTASH_REDIS_REST_URL    구독자 저장소 (Vercel Marketplace → Upstash Redis)
     UPSTASH_REDIS_REST_TOKEN    〃  (KV_REST_API_URL/KV_REST_API_TOKEN 이름도 인식)
     RESEND_API_KEY            (택1) Resend 발송 키 — 도메인 인증 후 아무에게나 발송 가능
     ALERTS_FROM               (Resend 일 때) 보내는 주소, 예: 기계공학부 <alerts@도메인>
     SMTP_USER · SMTP_PASS     (택1) SMTP 발송 — Gmail 은 앱 비밀번호. 데모에 권장
     SMTP_HOST · SMTP_PORT     (선택) 기본 smtp.gmail.com : 465
     ALERTS_SECRET             (선택) 구독 링크 서명 키 — 없으면 PUBLISH_PASSCODE 를 쓴다
     PUBLISH_PASSCODE          notify(발송) 호출 인증 — 스튜디오 공용 암호와 같다
     SITE_ORIGIN               (선택) 메일 속 링크의 기준 주소. 기본은 요청 호스트

   요청:
     POST { op:'join', email }                          → { ok }  (확인 메일 발송)
     GET  ?op=ok&e=<b64url(email)>&t=<hmac>             → 302 subscribe.html?state=done
     GET  ?op=bye&e=<b64url(email)>&t=<hmac>            → 302 subscribe.html?state=bye
     POST { op:'notify', passcode, items:[{kind,title,date,url}] }
                                                        → { ok, total, sent, failed }
*/

var crypto = require('crypto');
var tls = require('tls');
var net = require('net');

var RL_MAX = 5;            // 같은 IP 가 1분에 시도할 수 있는 구독 신청 수
var COOLDOWN_S = 300;      // 같은 주소로 확인 메일을 다시 보내기까지의 간격(초)
var MAX_RECIPIENTS = 500;  // 한 번의 notify 가 발송할 최대 인원(안전 상한)
var SUBS_KEY = 'ysme:subs';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  var env = process.env;
  var R_URL = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  var R_TOKEN = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  var SECRET = env.ALERTS_SECRET || env.PUBLISH_PASSCODE;
  var PASSCODE = env.PUBLISH_PASSCODE;

  var origin = String(env.SITE_ORIGIN || '').replace(/\/+$/, '') ||
    'https://' + (req.headers['x-forwarded-host'] || req.headers.host || 'yonsei-me-homepage.vercel.app');

  function fail(code, msg) { res.status(code).json({ error: msg }); }
  function back(state) {
    res.setHeader('Location', origin + '/subscribe.html?state=' + state);
    res.status(302).end();
  }

  /* ── Upstash Redis — REST 한 명령 = POST 본문의 JSON 배열 ── */
  async function redis(cmd) {
    var r = await fetch(R_URL, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + R_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd)
    });
    var d = null;
    try { d = await r.json(); } catch (e) { d = null; }
    if (!r.ok || !d || d.error) throw new Error('저장소 오류: ' + ((d && d.error) || r.status));
    return d.result;
  }

  /* ── 구독 링크 서명 — 상태 없는 HMAC. 메일 주인만 링크를 가진다 ── */
  function tokenOf(email) {
    return crypto.createHmac('sha256', String(SECRET)).update('ysme-alert|' + email).digest('hex').slice(0, 32);
  }
  function b64u(s) { return Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(s) {
    try { return Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); }
    catch (e) { return ''; }
  }
  function normEmail(v) {
    var e = String(v == null ? '' : v).trim().toLowerCase();
    if (e.length < 6 || e.length > 254) return '';
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(e)) return '';
    return e;
  }
  try {
    var body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};
    var q = req.query || {};
    var op = String((req.method === 'GET' ? q.op : body.op) || '');

    /* ── ok / bye : 메일 속 링크 (GET) ── */
    if (req.method === 'GET' && (op === 'ok' || op === 'bye')) {
      if (!R_URL || !R_TOKEN || !SECRET) { back('err'); return; }
      var em = normEmail(unb64u(q.e));
      if (!em || !safeEqual(String(q.t || ''), tokenOf(em))) { back('bad'); return; }
      await redis([op === 'ok' ? 'SADD' : 'SREM', SUBS_KEY, em]);
      back(op === 'ok' ? 'done' : 'bye');
      return;
    }

    if (req.method !== 'POST') { fail(405, 'POST 요청만 허용됩니다.'); return; }

    /* ── join : 구독 신청 → 확인 메일 ── */
    if (op === 'join') {
      if (!R_URL || !R_TOKEN || !SECRET || !mailerReady(env)) {
        fail(500, '메일 알림 서버 설정이 아직 완료되지 않았습니다. 관리자에게 알려 주세요.');
        return;
      }
      var email = normEmail(body.email);
      if (!email) { fail(400, '이메일 주소를 확인해 주세요.'); return; }

      // 같은 IP 의 남용 방지 — 1분 창
      var ip = String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || '?').split(',')[0].trim();
      var bucket = Math.floor(Date.now() / 60000);
      var rlKey = 'ysme:rl:' + ip + ':' + bucket;
      var hits = await redis(['INCR', rlKey]);
      if (hits === 1) await redis(['EXPIRE', rlKey, '90']);
      if (hits > RL_MAX) { fail(429, '잠시 후 다시 시도해 주세요.'); return; }

      // 같은 주소로의 반복 발송 방지 — 쿨다운 안이면 조용히 성공 처리
      var cd = await redis(['SET', 'ysme:cd:' + email, '1', 'NX', 'EX', String(COOLDOWN_S)]);
      if (cd === 'OK') {
        var t = tokenOf(email);
        var okUrl = origin + '/api/alerts?op=ok&e=' + b64u(email) + '&t=' + t;
        var byeUrl = origin + '/api/alerts?op=bye&e=' + b64u(email) + '&t=' + t;
        await sendMail(env, [{
          to: email,
          subject: '[연세대 기계공학부] 공지 메일 알림 — 구독 확인',
          html: confirmHtml(okUrl, byeUrl)
        }]);
      }
      res.status(200).json({ ok: true });
      return;
    }

    /* ── notify : 스튜디오 「게시」 뒤 새 공지 발송 ── */
    if (op === 'notify') {
      if (!PASSCODE) { fail(500, '서버 설정이 완료되지 않았습니다(PUBLISH_PASSCODE).'); return; }
      if (!body.passcode || !safeEqual(String(body.passcode), String(PASSCODE))) {
        await sleep(400);
        fail(401, '공용 암호가 올바르지 않습니다.');
        return;
      }
      if (!R_URL || !R_TOKEN || !SECRET || !mailerReady(env)) {
        fail(500, '메일 알림 서버 설정이 아직 완료되지 않았습니다(저장소 또는 발송 키).');
        return;
      }

      var items = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
      var clean = [];
      for (var i = 0; i < items.length; i++) {
        var it = items[i] || {};
        var title = String(it.title == null ? '' : it.title).trim().slice(0, 300);
        if (!title) continue;
        var url = String(it.url == null ? '' : it.url).trim().slice(0, 500);
        if (url && !/^https?:\/\//i.test(url)) url = '';
        clean.push({
          kind: it.kind === 'grad' ? 'grad' : 'ug',
          title: title,
          date: String(it.date == null ? '' : it.date).trim().slice(0, 40),
          url: url
        });
      }
      if (!clean.length) { fail(400, '보낼 공지가 없습니다.'); return; }

      var subs = await redis(['SMEMBERS', SUBS_KEY]) || [];
      if (subs.length > MAX_RECIPIENTS) subs = subs.slice(0, MAX_RECIPIENTS);
      if (!subs.length) { res.status(200).json({ ok: true, total: 0, sent: 0, failed: 0 }); return; }

      var subject = clean.length === 1
        ? '[연세대 기계공학부] 새 공지 — ' + clean[0].title
        : '[연세대 기계공학부] 새 공지 ' + clean.length + '건';

      var msgs = [];
      for (var j = 0; j < subs.length; j++) {
        var to = normEmail(subs[j]);
        if (!to) continue;
        var tk = tokenOf(to);
        msgs.push({
          to: to,
          subject: subject,
          html: noticeHtml(clean, origin, origin + '/api/alerts?op=bye&e=' + b64u(to) + '&t=' + tk)
        });
      }
      var out = await sendMail(env, msgs);
      res.status(200).json({ ok: true, total: msgs.length, sent: out.sent, failed: out.failed });
      return;
    }

    fail(400, '알 수 없는 op: ' + op);
  } catch (err) {
    fail(502, (err && err.message) || '서버 오류가 발생했습니다.');
  }
};

/* ═══════════════ 메일 본문 — 지면과 같은 결(네이비·헤어라인·여백) ═══════════════ */

var BRAND = '연세대학교 기계공학부';
var NAVY = '#1a3d75', INK = '#0f1b30', LINE = '#e2ddd2', SUB = '#41506b', DIM = '#6b7688';

function shell(inner) {
  return '<div style="margin:0;padding:28px 16px;background:#f7f6f2">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ' + LINE + ';padding:28px 26px;' +
    'font-family:\'Apple SD Gothic Neo\',Pretendard,system-ui,sans-serif;color:' + INK + ';line-height:1.7">' +
    '<p style="margin:0;font-size:11px;letter-spacing:.22em;color:' + DIM + '">YONSEI MECHANICAL ENGINEERING</p>' +
    '<p style="margin:6px 0 0;font-size:18px;font-weight:800;color:' + NAVY + '">' + BRAND + '</p>' +
    '<hr style="border:none;border-top:1px solid ' + INK + ';margin:14px 0 18px">' +
    inner +
    '</div></div>';
}

function confirmHtml(okUrl, byeUrl) {
  return shell(
    '<p style="margin:0 0 6px;font-size:15px;font-weight:700">공지 메일 알림 구독 확인</p>' +
    '<p style="margin:0 0 18px;font-size:13.5px;color:' + SUB + '">아래 버튼을 누르면 구독이 시작됩니다. ' +
    '학부·대학원 새 공지가 올라올 때 이 주소로 알려 드립니다.</p>' +
    '<p style="margin:0 0 20px"><a href="' + esc2(okUrl) + '" ' +
    'style="display:inline-block;background:' + NAVY + ';color:#ffffff;text-decoration:none;' +
    'font-size:14px;font-weight:700;padding:11px 22px">구독 시작하기</a></p>' +
    '<p style="margin:0 0 4px;font-size:12px;color:' + DIM + '">버튼이 눌리지 않으면 이 주소를 브라우저에 붙여 넣으세요.</p>' +
    '<p style="margin:0 0 18px;font-size:12px;word-break:break-all"><a href="' + esc2(okUrl) + '" style="color:' + NAVY + '">' + esc2(okUrl) + '</a></p>' +
    '<hr style="border:none;border-top:1px solid ' + LINE + ';margin:0 0 12px">' +
    '<p style="margin:0;font-size:12px;color:' + DIM + '">본인이 신청하지 않았다면 이 메일은 무시하셔도 됩니다. ' +
    '이미 구독 중이라면 <a href="' + esc2(byeUrl) + '" style="color:' + DIM + '">여기서 해지</a>할 수 있습니다.</p>'
  );
}

function noticeHtml(items, origin, byeUrl) {
  var rows = '';
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var badge = it.kind === 'grad' ? '대학원' : '학부';
    var href = it.url || (origin + '/G-news.html#notice-' + (it.kind === 'grad' ? 'grad' : 'ug'));
    rows +=
      '<div style="border-top:1px solid ' + LINE + ';padding:12px 0">' +
      '<p style="margin:0 0 3px;font-size:11px;letter-spacing:.14em;color:' + NAVY + ';font-weight:700">' + badge + ' 공지' +
      (it.date ? '<span style="color:' + DIM + ';font-weight:500;letter-spacing:0"> · ' + esc2(it.date) + '</span>' : '') + '</p>' +
      '<p style="margin:0;font-size:14.5px;font-weight:700;line-height:1.5">' +
      '<a href="' + esc2(href) + '" style="color:' + INK + ';text-decoration:none">' + esc2(it.title) + '</a></p>' +
      '</div>';
  }
  return shell(
    '<p style="margin:0 0 14px;font-size:15px;font-weight:700">새 공지가 올라왔습니다</p>' +
    rows +
    '<p style="margin:16px 0 0"><a href="' + origin + '/G-news.html" ' +
    'style="font-size:13px;color:' + NAVY + ';font-weight:700;text-decoration:none">소식 페이지에서 전체 보기 →</a></p>' +
    '<hr style="border:none;border-top:1px solid ' + LINE + ';margin:18px 0 12px">' +
    '<p style="margin:0;font-size:12px;color:' + DIM + '">이 메일은 학사 일정 화면에서 신청하신 공지 알림입니다. ' +
    '<a href="' + esc2(byeUrl) + '" style="color:' + DIM + '">수신 해지</a></p>'
  );
}

function esc2(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ═══════════════ 발송 — Resend(REST) 우선, 없으면 SMTP(Gmail) ═══════════════ */

function mailerReady(env) {
  return !!(env.RESEND_API_KEY || (env.SMTP_USER && env.SMTP_PASS));
}

async function sendMail(env, msgs) {
  if (env.RESEND_API_KEY) return sendResend(env, msgs);
  return sendSmtp(env, msgs);
}

async function sendResend(env, msgs) {
  var from = env.ALERTS_FROM || (BRAND + ' <onboarding@resend.dev>');
  var sent = 0, failed = 0;
  for (var i = 0; i < msgs.length; i++) {
    var m = msgs[i];
    var r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: from, to: [m.to], subject: m.subject, html: m.html })
    });
    if (r.status === 429) {           // 속도 제한 — 한 번 쉬고 다시
      await sleep(900);
      r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from, to: [m.to], subject: m.subject, html: m.html })
      });
    }
    if (r.ok) sent++; else failed++;
    if (msgs.length > 2) await sleep(550);   // Resend 기본 2req/s 준수
  }
  if (!sent && failed) throw new Error('메일 발송에 실패했습니다(Resend). 키·발신 주소를 확인해 주세요.');
  return { sent: sent, failed: failed };
}

/* SMTP — 의존성 없는 최소 클라이언트.
   본문을 base64 로 보내므로(줄이 . 으로 시작할 수 없는 알파벳) dot-stuffing 이 필요 없다.
   연결 하나로 여러 통을 이어 보낸다(수신자마다 해지 링크가 달라 통은 각각이다). */
function sendSmtp(env, msgs) {
  var host = env.SMTP_HOST || 'smtp.gmail.com';
  var port = parseInt(env.SMTP_PORT, 10) || 465;
  var user = env.SMTP_USER, pass = env.SMTP_PASS;
  // 검사 전용 평문 모드 — 배포 환경(VERCEL)에서는 절대 켜지지 않는다
  var plain = env.ALERTS_SMTP_PLAIN === '1' && !env.VERCEL;

  return new Promise(function (resolve, reject) {
    var sock = plain
      ? net.connect({ host: host, port: port })
      : tls.connect({ host: host, port: port, servername: host });
    var buf = '', waiters = [];
    var done = false;
    function bail(msg) {
      if (done) return;
      done = true;
      try { sock.destroy(); } catch (e) {}
      reject(new Error(msg));
    }
    sock.setTimeout(20000, function () { bail('메일 서버 응답이 없습니다(시간 초과).'); });
    sock.on('error', function (e) { bail('메일 서버 연결 실패: ' + (e && e.code || e.message)); });
    sock.on('data', function (d) {
      buf += d.toString('utf8');
      var lines = buf.split('\r\n');
      buf = lines.pop();
      for (var i = 0; i < lines.length; i++) {
        var m = /^(\d{3})([ -])/.exec(lines[i]);
        if (m && m[2] === ' ' && waiters.length) waiters.shift()(parseInt(m[1], 10), lines[i]);
      }
    });
    function expect(codes) {
      return new Promise(function (res2, rej2) {
        waiters.push(function (code, line) {
          if (codes.indexOf(code) >= 0) res2(code);
          else rej2(new Error('메일 서버 거절(' + code + '): ' + line.slice(0, 120)));
        });
      });
    }
    function send(line) { sock.write(line + '\r\n'); }

    (async function () {
      await expect([220]);
      send('EHLO ysme-alerts'); await expect([250]);
      send('AUTH LOGIN'); await expect([334]);
      send(Buffer.from(user, 'utf8').toString('base64')); await expect([334]);
      send(Buffer.from(pass, 'utf8').toString('base64')); await expect([235]);
      var sent = 0, failed = 0;
      for (var i = 0; i < msgs.length; i++) {
        var m = msgs[i];
        try {
          send('MAIL FROM:<' + user + '>'); await expect([250]);
          send('RCPT TO:<' + m.to + '>'); await expect([250, 251]);
          send('DATA'); await expect([354]);
          sock.write(mime(user, m.to, m.subject, m.html) + '\r\n.\r\n');
          await expect([250]);
          sent++;
        } catch (e) {
          failed++;
          // 한 통이 거절돼도 다음 수신자는 계속 — RSET 으로 트랜잭션을 씻는다
          try { send('RSET'); await expect([250]); } catch (e2) { throw e; }
        }
      }
      if (!sent && failed) throw new Error('메일 발송에 실패했습니다(SMTP). 계정·앱 비밀번호를 확인해 주세요.');
      send('QUIT');
      done = true;
      try { sock.end(); } catch (e) {}
      resolve({ sent: sent, failed: failed });
    })().catch(function (e) { bail(e.message); });
  });
}

function mime(fromAddr, to, subject, html) {
  function b64(s) { return Buffer.from(s, 'utf8').toString('base64'); }
  function wrap76(s) { return s.replace(/(.{76})/g, '$1\r\n'); }
  var id = crypto.randomBytes(9).toString('hex');
  return [
    'From: =?UTF-8?B?' + b64(BRAND) + '?= <' + fromAddr + '>',
    'To: <' + to + '>',
    'Subject: =?UTF-8?B?' + b64(subject) + '?=',
    'Date: ' + new Date().toUTCString(),
    'Message-ID: <' + id + '@ysme-alerts>',
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(b64(html))
  ].join('\r\n');
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
// 상수시간 비교 — publish.js 와 같은 구현
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var d = 0;
  for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
