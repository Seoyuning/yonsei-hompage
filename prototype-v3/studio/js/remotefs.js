/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — remotefs.js
   온라인 모드 파일 레이어. 호스팅 페이지가 window.YSME_ONLINE 를 설정했거나
   URL 에 ?online 파라미터가 있으면 활성화되어, 로컬 File System Access 대신
   서버 함수(api/publish)로 파일을 읽고/쓰도록 Admin.fs 를 교체한다.
   · 로컬 모드(플래그 없음)에서는 아무 것도 하지 않는다 → Admin.fs 그대로.
   · 인터페이스는 fs.js 의 Admin.fs 와 동일해 board/editor/findreplace/qa/
     versions 의 Admin.fs.* 호출이 수정 없이 그대로 원격을 쓴다.
   classic script (fs.js 뒤에 로드). ES 모듈 금지.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin = window.Admin || {};

/* ── 온라인 설정 해석: 호스팅 플래그 우선, 없으면 ?online 파라미터(로컬 테스트용) ── */
function resolveCfg() {
  if (window.YSME_ONLINE && typeof window.YSME_ONLINE === 'object') return window.YSME_ONLINE;
  try {
    var p = new URLSearchParams(location.search);
    if (p.has('online')) {
      return {
        endpoint: p.get('endpoint') || 'https://prototype-v3-nine.vercel.app/api/publish',
        siteBase: p.get('siteBase') || 'https://prototype-v3-nine.vercel.app/',
        siteName: p.get('siteName') || '온라인 · prototype-v3'
      };
    }
  } catch (e) { /* URL 파싱 불가 → 로컬 취급 */ }
  return null;
}

var cfg = resolveCfg();
if (!cfg) return;                 // 로컬 모드 → 손대지 않음(Admin.fs 는 fs.js 것)
window.YSME_ONLINE = cfg;         // auth.js·online.js 가 참조하도록 정규화

var endpoint = cfg.endpoint || '/api/publish';
var siteBase = cfg.siteBase || '/';
var SESSION_KEY = 'ysme-online-session';

var passcode = '', author = '', ready = false;
var pageEntries = [], assetEntries = [];

function loadSession() {
  try {
    var s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (s && s.passcode) { passcode = s.passcode; author = s.author || ''; }
  } catch (e) { /* 무시 */ }
}
function saveSession() {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ passcode: passcode, author: author })); } catch (e) { /* 무시 */ }
}

function call(payload) {
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ passcode: passcode }, payload))
  });
}
async function errText(res, fallback) {
  var d = null;
  try { d = await res.json(); } catch (e) { /* 본문 없음 */ }
  return (d && d.error) || fallback;
}

async function fetchList() {
  var res = await call({ action: 'list' });
  if (res.status === 401) throw new Error('공용 암호가 올바르지 않습니다.');
  if (!res.ok) throw new Error(await errText(res, '목록 조회 실패 (' + res.status + ')'));
  var d = await res.json();
  pageEntries = d.pages || [];
  assetEntries = d.assets || [];
}

function siteName() {
  if (cfg.siteName) return cfg.siteName;
  try { return '온라인 · ' + new URL(endpoint, location.href).host; } catch (e) { return '온라인'; }
}
function announceOpened() {
  Admin.state = Admin.state || {};
  Admin.state.sitePath = siteName();
  Admin.bus.emit('site:opened', { name: siteName(), pages: pageEntries.slice(), assets: assetEntries.slice() });
}

/* Blob → base64(문자열만, data URL 접두 제거) */
function blobToB64(blob) {
  return new Promise(function (resolve, reject) {
    var fr = new FileReader();
    fr.onload = function () { var s = String(fr.result); resolve(s.slice(s.indexOf(',') + 1)); };
    fr.onerror = function () { reject(new Error('파일을 읽을 수 없습니다.')); };
    fr.readAsDataURL(blob);
  });
}

var remote = {
  isOnline: true,
  supported: function () { return true; },
  isReady: function () { return ready; },
  siteName: siteName,
  pages: function () { return pageEntries.slice(); },
  assets: function () { return assetEntries.slice(); },

  /* 온라인 세션(암호) 관련 — online.js 게이트가 사용 */
  hasSession: function () { return !!passcode; },
  author: function () { return author; },
  setAuthor: function (n) { author = String(n == null ? '' : n).trim(); saveSession(); },

  /* 암호+이름으로 접속(검증) → 성공 시 페이지 로드 + site:opened */
  connectWith: async function (pc, name) {
    passcode = String(pc == null ? '' : pc).trim();
    author = String(name == null ? '' : name).trim();
    if (!passcode) throw new Error('공용 암호를 입력하세요.');
    await fetchList();              // 401 이면 throw → 게이트가 표시
    ready = true;
    saveSession();
    announceOpened();
    return true;
  },
  disconnect: function () {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* 무시 */ }
    passcode = ''; author = ''; ready = false; pageEntries = []; assetEntries = [];
  },

  /* 앱의 재연결 경로(저장된 세션 암호로 조용히 재연결). 인자는 무시 */
  reconnect: async function () {
    if (!passcode) return false;
    try { await fetchList(); ready = true; announceOpened(); return true; }
    catch (e) { return false; }
  },
  openSite: async function () { return remote.reconnect(); },

  readFile: async function (path) {
    var res = await call({ action: 'read', path: path });
    if (!res.ok) throw new Error(await errText(res, '읽기 실패 (' + res.status + ')'));
    var d = await res.json();
    return d && d.content != null ? d.content : '';
  },

  /* 이미지 등 바이너리: 배포된 사이트의 실제 URL 을 그대로 제공(iframe 렌더용).
     아직 커밋되지 않은 신규 업로드의 로컬 미리보기는 지원하지 않는다. */
  fileUrl: async function (path) {
    return siteBase.replace(/\/+$/, '') + '/' + String(path == null ? '' : path).replace(/^\/+/, '');
  },

  exists: async function (path) {
    var res = await call({ action: 'read', path: path });
    return res.ok;                 // 404 → false
  },

  writeFile: async function (path, content) {
    var res = await call({ action: 'publish', path: path, content: content, author: author || '온라인 편집자' });
    if (!res.ok) throw new Error(await errText(res, '저장 실패 (' + res.status + ')'));
    return true;
  },

  writeBinary: async function (path, blob) {
    var b64 = await blobToB64(blob);
    var res = await call({ action: 'publish', path: path, content: b64, author: author || '온라인 편집자', encoding: 'base64' });
    if (!res.ok) throw new Error(await errText(res, '업로드 실패 (' + res.status + ')'));
    return true;
  }
};

loadSession();
Admin.fs = remote;         // ★ 로컬 fs 를 원격으로 교체 → 모든 Admin.fs.* 호출이 원격 사용
Admin.remotefs = remote;   // online.js 게이트가 참조

})();
