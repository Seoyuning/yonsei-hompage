/* api/alerts.js 검사기 — 서버 없이 핸들러를 직접 부른다.
   저장소(Upstash)는 가짜 fetch 로, 메일은 로컬 가짜 SMTP 서버로 갈아 끼운다.
   실행:  node _studio/tools/t-alerts-api.mjs                (배포되지 않는다) */
import { createRequire } from 'node:module';
import netMod from 'node:net';

const require = createRequire(import.meta.url);

/* ── env — 핸들러가 읽는 값 전부 ── */
process.env.UPSTASH_REDIS_REST_URL = 'http://fake-redis.local/';
process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token';
process.env.SMTP_HOST = '127.0.0.1';
process.env.SMTP_PORT = '2525';
process.env.SMTP_USER = 'tester@example.com';
process.env.SMTP_PASS = 'app-password';
process.env.ALERTS_SMTP_PLAIN = '1';
process.env.PUBLISH_PASSCODE = 'pass123!';
process.env.SITE_ORIGIN = 'https://example.test';
delete process.env.RESEND_API_KEY;
delete process.env.VERCEL;

const handler = require('../../api/alerts.js');

/* ── 가짜 Redis — 명령 배열을 그대로 해석한다 ── */
const kv = new Map();   // key → value
const sets = new Map(); // key → Set
function redisExec(cmd) {
  const [op, key, ...rest] = cmd.map(String);
  if (op === 'INCR') { const n = (parseInt(kv.get(key), 10) || 0) + 1; kv.set(key, String(n)); return n; }
  if (op === 'EXPIRE') return 1;
  if (op === 'SET') {
    if (rest.includes('NX') && kv.has(key)) return null;
    kv.set(key, rest[0]); return 'OK';
  }
  if (op === 'SADD') { if (!sets.has(key)) sets.set(key, new Set()); sets.get(key).add(rest[0]); return 1; }
  if (op === 'SREM') { const s = sets.get(key); if (s) s.delete(rest[0]); return 1; }
  if (op === 'SMEMBERS') return [...(sets.get(key) || [])];
  throw new Error('가짜 Redis 가 모르는 명령: ' + op);
}
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  if (String(url).startsWith('http://fake-redis.local')) {
    const cmd = JSON.parse(opts.body);
    return { ok: true, status: 200, json: async () => ({ result: redisExec(cmd) }) };
  }
  throw new Error('예상 밖의 외부 요청: ' + url);
};

/* ── 가짜 SMTP 서버 ── */
const mails = [];   // {to, data}
const smtp = netMod.createServer((sock) => {
  let inData = false, cur = { to: '', data: '' };
  sock.write('220 fake ESMTP\r\n');
  sock.on('data', (d) => {
    for (const line of d.toString('utf8').split('\r\n')) {
      if (!line && !inData) continue;
      if (inData) {
        if (line === '.') {
          inData = false;
          mails.push({ to: cur.to, data: cur.data });
          cur = { to: '', data: '' };
          sock.write('250 OK queued\r\n');
        } else cur.data += line + '\n';
        continue;
      }
      const up = line.toUpperCase();
      if (up.startsWith('EHLO')) sock.write('250-fake\r\n250 AUTH LOGIN\r\n');
      else if (up === 'AUTH LOGIN') sock.write('334 VXNlcm5hbWU6\r\n');
      else if (line === Buffer.from(process.env.SMTP_USER).toString('base64')) sock.write('334 UGFzc3dvcmQ6\r\n');
      else if (line === Buffer.from(process.env.SMTP_PASS).toString('base64')) sock.write('235 ok\r\n');
      else if (up.startsWith('MAIL FROM')) sock.write('250 ok\r\n');
      else if (up.startsWith('RCPT TO')) {
        cur.to = line.replace(/^.*<|>.*$/g, '');
        if (cur.to === 'reject@example.com') sock.write('550 no such user\r\n');
        else sock.write('250 ok\r\n');
      }
      else if (up === 'DATA') { inData = true; sock.write('354 go\r\n'); }
      else if (up === 'RSET') sock.write('250 flushed\r\n');
      else if (up === 'QUIT') { sock.write('221 bye\r\n'); sock.end(); }
      else if (line) sock.write('250 ok\r\n');
    }
  });
});
await new Promise((r) => smtp.listen(2525, '127.0.0.1', r));

/* ── 가짜 req/res ── */
function call({ method = 'POST', body = null, query = {}, ip = '9.9.9.9' }) {
  return new Promise((resolve) => {
    const req = {
      method, body, query,
      headers: { host: 'example.test', 'x-forwarded-for': ip },
      socket: { remoteAddress: ip }
    };
    const out = { status: 0, json: null, headers: {} };
    const res = {
      setHeader(k, v) { out.headers[k.toLowerCase()] = v; },
      status(c) { out.status = c; return res; },
      json(o) { out.json = o; resolve(out); },
      end() { resolve(out); }
    };
    handler(req, res);
  });
}

/* 메일 본문(base64 MIME)을 도로 문자열로 */
function bodyOf(mail) {
  const parts = mail.data.split('\n\n');
  return Buffer.from(parts.slice(1).join(''), 'base64').toString('utf8');
}
function subjectOf(mail) {
  const m = /Subject: =\?UTF-8\?B\?(.+?)\?=/.exec(mail.data);
  return m ? Buffer.from(m[1], 'base64').toString('utf8') : '';
}

let fails = 0;
function ok(cond, name, extra) {
  console.log((cond ? '  ok   ' : ' FAIL  ') + name + (extra ? ' — ' + extra : ''));
  if (!cond) fails++;
}

/* ═══ 1. 신청 — 잘못된 주소 ═══ */
let r = await call({ body: { op: 'join', email: '이상한 값' } });
ok(r.status === 400, '잘못된 이메일은 400');

/* ═══ 2. 신청 — 확인 메일 발송 ═══ */
r = await call({ body: { op: 'join', email: 'Prof.Kim@Yonsei.AC.KR' }, ip: '1.1.1.1' });
ok(r.status === 200 && r.json && r.json.ok, '정상 신청은 ok');
ok(mails.length === 1 && mails[0].to === 'prof.kim@yonsei.ac.kr', '확인 메일 1통, 소문자 정규화', mails.map(m => m.to).join());
const confirmBody = bodyOf(mails[0]);
const okLink = /https:\/\/example\.test\/api\/alerts\?op=ok&amp;e=([A-Za-z0-9_-]+)&amp;t=([0-9a-f]{32})/.exec(confirmBody);
ok(!!okLink, '확인 링크(op=ok, HMAC 32자리)가 본문에 있다');
ok(confirmBody.includes('op=bye'), '해지 링크도 함께 있다');
ok(subjectOf(mails[0]).includes('구독 확인'), '제목에 「구독 확인」');

/* ═══ 3. 같은 주소 재신청 — 쿨다운 안이면 메일을 다시 보내지 않는다 ═══ */
r = await call({ body: { op: 'join', email: 'prof.kim@yonsei.ac.kr' }, ip: '1.1.1.1' });
ok(r.status === 200 && mails.length === 1, '쿨다운: 두 번째 메일은 나가지 않는다');

/* ═══ 4. 확인 링크 클릭 → 구독 확정 ═══ */
r = await call({ method: 'GET', query: { op: 'ok', e: okLink[1], t: okLink[2] } });
ok(r.status === 302 && String(r.headers.location).endsWith('state=done'), '확인 → 302 state=done', JSON.stringify(r.headers));
ok((sets.get('ysme:subs') || new Set()).has('prof.kim@yonsei.ac.kr'), '구독자 집합에 들어갔다');

/* ═══ 5. 토큰 위조 ═══ */
r = await call({ method: 'GET', query: { op: 'ok', e: okLink[1], t: 'f'.repeat(32) } });
ok(r.status === 302 && String(r.headers.location).endsWith('state=bad'), '위조 토큰 → state=bad');

/* ═══ 6. notify — 암호 틀림 ═══ */
r = await call({ body: { op: 'notify', passcode: 'wrong', items: [{ title: 'x' }] } });
ok(r.status === 401, 'notify 잘못된 암호는 401');

/* ═══ 7. notify — 발송 ═══ */
mails.length = 0;
r = await call({
  body: {
    op: 'notify', passcode: 'pass123!',
    items: [
      { kind: 'ug', title: '<b>2학기</b> 수강신청 안내', date: '2026.08.03' },
      { kind: 'grad', title: '논문 제출 일정', url: 'https://example.org/p/1' }
    ]
  }
});
ok(r.status === 200 && r.json.total === 1 && r.json.sent === 1 && r.json.failed === 0,
  'notify 발송 집계 total1/sent1', JSON.stringify(r.json));
const notice = bodyOf(mails[0]);
ok(subjectOf(mails[0]).includes('새 공지 2건'), '제목: 새 공지 2건');
ok(notice.includes('&lt;b&gt;2학기&lt;/b&gt;'), '제목의 HTML 이 이스케이프된다');
ok(notice.includes('https://example.org/p/1'), '원문 링크가 들어간다');
ok(notice.includes('G-news.html#notice-ug'), '링크 없는 공지는 소식 페이지로');
ok(notice.includes('op=bye'), '해지 링크가 붙는다');
ok(notice.includes('대학원') && notice.includes('학부'), '학부/대학원 딱지');

/* ═══ 8. 해지 ═══ */
r = await call({ method: 'GET', query: { op: 'bye', e: okLink[1], t: okLink[2] } });
ok(r.status === 302 && String(r.headers.location).endsWith('state=bye'), '해지 → state=bye');
ok(!(sets.get('ysme:subs') || new Set()).has('prof.kim@yonsei.ac.kr'), '구독자 집합에서 빠졌다');

/* ═══ 9. 구독자 0명일 때 notify ═══ */
r = await call({ body: { op: 'notify', passcode: 'pass123!', items: [{ title: '테스트' }] } });
ok(r.status === 200 && r.json.total === 0 && r.json.sent === 0, '구독자 0명이면 total0/sent0');

/* ═══ 10. IP 속도 제한 ═══ */
let last = null;
for (let i = 0; i < 6; i++) last = await call({ body: { op: 'join', email: 'p' + i + '@x.co' }, ip: '2.2.2.2' });
ok(last.status === 429, '같은 IP 6번째 신청은 429', String(last.status));

/* ═══ 11. 수신 거절 섞임 — 다음 수신자는 계속 ═══ */
sets.set('ysme:subs', new Set(['reject@example.com', 'good@example.com']));
mails.length = 0;
r = await call({ body: { op: 'notify', passcode: 'pass123!', items: [{ title: '섞임 검사' }] } });
ok(r.status === 200 && r.json.sent === 1 && r.json.failed === 1,
  '한 명이 거절돼도 나머지는 발송(sent1/failed1)', JSON.stringify(r.json));
ok(mails.length === 1 && mails[0].to === 'good@example.com', '실제로 좋은 주소에만 도착');

smtp.close();
globalThis.fetch = realFetch;
console.log(fails ? '\nFAILED — 실패 ' + fails + '건' : '\nPASSED — 실패 0건');
process.exit(fails ? 1 : 0);
