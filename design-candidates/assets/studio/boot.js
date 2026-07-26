/* YSME In-Place Studio — 부트스트랩 (STUDIO_SPEC 1·9절)

   하는 일은 네 가지다.
     1) 모듈을 정해진 순서대로 동적 로드한다(앞 모듈의 전역을 뒤 모듈이 참조하므로 순차 보장).
        아직 없는 모듈(404)은 "선택적"으로 취급하고 이름만 알린다 — 나머지는 그대로 동작한다.
     2) 세션이 없으면 게이트(공용 암호 + 편집자 이름)를 띄우고 auth 로 검증한다.
     3) 세션이 있으면 게이트 없이 곧바로 부팅한다:
        engine.open(현재 페이지) → engine.bindLive(document, window) → hud.mount().
     4) 'session:invalid' 를 받으면 세션을 지우고 게이트를 다시 띄운다.

   세션은 sessionStorage 에 남으므로 페이지를 이동하면 nav.js 로더가 이 파일을 다시 붙이고
   같은 흐름이 반복된다 — 이것이 "이동해도 편집이 유지된다"의 전부다.
   이동 직전 초안 저장은 engine.js 가 pagehide 로 처리하므로 여기서 중복 구현하지 않는다.

   window.YSME_STUDIO_API 는 core.js 가 로드 시점에 읽는다. 그래서 여기서는 그 값을
   **건드리지 않고**, core 가 올라온 뒤에 한 번 더 반영(로컬 테스트에서 나중에 설정된 경우)만 한다.
*/
(function () {
  'use strict';

  var Y = window.YStudio = window.YStudio || {};
  if (Y.boot) return;                       // 중복 부팅 방지(로더가 두 번 붙은 경우)
  Y.boot = { state: 'loading' };

  /* 모바일 렌더 모드의 프레임 안에서는 부팅하지 않는다.
     프레임 문서는 상위 창의 mobile.js 가 같은 엔진에 붙인다(HUD 2개가 생기면 안 된다). */
  var inFrame = false;
  try { inFrame = window.top !== window.self; } catch (e) { inFrame = true; }
  if (inFrame || /[?&]ysstudio=frame(&|$)/.test(location.search)) { Y.boot.state = 'frame'; return; }

  var UI = 'data-ys-ui';
  var ZBASE = 2147483000;                   // = Y.config.Z (core 로드 전에도 필요해 상수로 둔다)
  var AUTHOR_KEY = 'ysme-studio-author';    // 편집자 이름만 기억한다(암호는 절대 저장하지 않는다)

  /* 로드 순서 — req:true 는 없으면 편집이 불가능한 코어 */
  var MODULES = [
    { name: 'core', req: true },
    { name: 'net', req: true },
    { name: 'source', req: true },
    { name: 'align', req: true },
    { name: 'engine', req: true },
    { name: 'diff', req: false },
    { name: 'changes', req: false },
    { name: 'pagedict', req: false },
    { name: 'hud', req: false },
    { name: 'versions', req: false },
    { name: 'ai', req: false },
    { name: 'i18n-edit', req: false },
    { name: 'mobile', req: false },
    { name: 'datamap', req: false },
    { name: 'posts', req: false }
  ];

  var loaded = [], failed = [], coreDead = false;
  var gate = null, gateKey = null, hudMounted = false, stopped = false;

  /* ── 자기 위치에서 모듈 경로를 구한다(쿼리는 버전 문자열로 물려준다) ── */
  function self() {
    var s = document.currentScript, src = s && s.src ? s.src : '';
    if (!src) {
      var list = document.getElementsByTagName('script');
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].src && /studio\/boot\.js(\?|$)/.test(list[i].src)) { src = list[i].src; break; }
      }
    }
    if (!src) return { dir: 'assets/studio/', ver: '' };
    var q = src.indexOf('?');
    return {
      dir: (q < 0 ? src : src.slice(0, q)).replace(/[^/]*$/, ''),
      ver: q < 0 ? '' : src.slice(q)
    };
  }
  var HERE = self();

  /* ── 게이트 스타일 ──
     studio.css 는 hud 담당의 파일이고, 게이트는 그 CSS 가 아직(또는 끝내) 없어도 반드시 보여야
     하는 유일한 화면이다. 그래서 게이트 전용 스타일만 여기서 주입하고, studio.css 는 이 뒤에
     붙여 같은 선택자를 덮어쓸 수 있게 한다. 다른 UI 의 색·간격은 전부 studio.css 에만 둔다. */
  var KR = '"Apple SD Gothic Neo","Noto Sans KR","Pretendard Variable","Pretendard",system-ui,sans-serif';
  var GATE_CSS = [
    '.ys-gate{position:fixed;top:0;left:0;right:0;bottom:0;z-index:' + (ZBASE + 40) + ';' +
      'display:flex;align-items:center;justify-content:center;padding:1.2rem;' +
      'background:rgba(9,18,34,.62);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);' +
      'font-family:' + KR + ';color:#0f1b30}',
    '.ys-gate-card{width:min(23rem,92vw);background:#fff;border-radius:.9rem;padding:1.5rem 1.4rem 1.2rem;' +
      'box-shadow:0 24px 60px rgba(8,18,36,.4);display:flex;flex-direction:column;gap:.75rem}',
    '.ys-gate-h{font-size:1.06rem;font-weight:800;letter-spacing:-.01em}',
    '.ys-gate-p{font-size:.82rem;line-height:1.6;color:#5e6b82;margin-bottom:.2rem}',
    '.ys-gate-f{display:flex;flex-direction:column;gap:.3rem}',
    '.ys-gate-l{font-size:.72rem;font-weight:700;letter-spacing:.04em;color:#5e6b82}',
    '.ys-gate-in{font-family:inherit;font-size:.92rem;color:#0f1b30;background:#f6f7f9;' +
      'border:1px solid #dfe3ea;border-radius:.5rem;padding:.55rem .7rem;width:100%;box-sizing:border-box}',
    '.ys-gate-in:focus{outline:2px solid #1a3d75;outline-offset:1px;background:#fff}',
    '.ys-gate-msg{display:none;font-size:.78rem;line-height:1.5;color:#5e6b82}',
    '.ys-gate-msg.is-on{display:block}',
    '.ys-gate-msg.is-err{color:#a8321f;font-weight:700}',
    '.ys-gate-act{display:flex;gap:.5rem;justify-content:flex-end;margin-top:.25rem}',
    '.ys-gate-b{font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;' +
      'border:1px solid #dfe3ea;background:#fff;color:#5e6b82;border-radius:.5rem;padding:.5rem .9rem}',
    '.ys-gate-b.is-primary{background:#12294f;border-color:#12294f;color:#fff}',
    '.ys-gate-b[disabled]{opacity:.55;cursor:default}',
    '.ys-gate-note{font-size:.7rem;line-height:1.55;color:#8b96a9;border-top:1px solid #eef0f4;padding-top:.6rem}',
    '.ys-gate-raw{position:fixed;left:50%;bottom:1.4rem;transform:translateX(-50%);z-index:' + (ZBASE + 60) + ';' +
      'font:600 .84rem/1.45 ' + KR + ';color:#fff;background:#a8321f;padding:.55rem .9rem;border-radius:.5rem;' +
      'max-width:min(30rem,86vw);box-shadow:0 8px 24px rgba(10,26,51,.28)}'
  ].join('');

  function injectGateCss() {
    var st = document.createElement('style');
    st.setAttribute(UI, '');
    st.setAttribute('data-ys-gate-css', '');
    st.textContent = GATE_CSS;
    var head = document.head || document.documentElement;
    head.insertBefore(st, head.firstChild);   // studio.css 가 뒤에 오도록 맨 앞에 넣는다
  }

  /* core 가 없을 때(=Y.toast 도 없을 때)의 최소 알림 */
  function rawNote(msg) {
    if (window.console) console.error('[studio] ' + msg);
    try {
      var d = document.createElement('div');
      d.setAttribute(UI, '');
      d.className = 'ys-gate-raw';
      d.textContent = msg;
      (document.body || document.documentElement).appendChild(d);
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 6500);
    } catch (e) {}
  }
  function note(msg, kind, ms) {
    if (Y.toast) Y.toast(msg, kind || null, ms || (kind === 'error' ? 6500 : 3200));
    else rawNote(msg);
  }

  /* ── 순차 로더 ── */
  function loadScript(url) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = url;
      s.async = false;                        // 삽입 순서대로 실행
      s.setAttribute(UI, '');
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error(url)); };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function loadCss() {
    try {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = HERE.dir + 'studio.css' + HERE.ver;
      l.setAttribute(UI, '');
      (document.head || document.documentElement).appendChild(l);
    } catch (e) {}
  }

  function loadModules() {
    var chain = Promise.resolve();
    MODULES.forEach(function (m) {
      chain = chain.then(function () {
        if (coreDead) return;                 // 코어가 죽었으면 뒤는 의미가 없다
        return loadScript(HERE.dir + m.name + '.js' + HERE.ver).then(function () {
          loaded.push(m.name);
        }, function () {
          failed.push(m.name);
          if (m.req) coreDead = true;
        });
      });
    });
    return chain;
  }

  /* ── 게이트 ── */
  function openGate() {
    if (gate || stopped) return;
    var wrap = document.createElement('div');
    wrap.className = 'ys-gate';
    wrap.setAttribute(UI, '');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'YSME 스튜디오 인증');
    wrap.innerHTML =
      '<form class="ys-gate-card" novalidate>' +
        '<div class="ys-gate-h">YSME 스튜디오</div>' +
        '<div class="ys-gate-p">사이트를 화면에서 직접 편집합니다. 공용 암호와 편집자 이름을 입력하세요.</div>' +
        '<label class="ys-gate-f"><span class="ys-gate-l">공용 암호</span>' +
          '<input class="ys-gate-in" type="password" data-f="pc" autocomplete="current-password" spellcheck="false"></label>' +
        '<label class="ys-gate-f"><span class="ys-gate-l">편집자 이름</span>' +
          '<input class="ys-gate-in" type="text" data-f="au" autocomplete="off" spellcheck="false" maxlength="40" placeholder="예: 홍길동"></label>' +
        '<div class="ys-gate-msg" role="status" aria-live="polite"></div>' +
        '<div class="ys-gate-act">' +
          '<button class="ys-gate-b" type="button" data-a="cancel">취소(Esc)</button>' +
          '<button class="ys-gate-b is-primary" type="submit" data-a="ok">편집 시작</button>' +
        '</div>' +
        '<div class="ys-gate-note">암호는 이 탭에만 보관되며(탭을 닫으면 사라진다), ' +
          '모든 게시는 편집자 이름과 함께 커밋 이력에 남습니다.</div>' +
      '</form>';
    (document.body || document.documentElement).appendChild(wrap);

    var form = wrap.querySelector('form');
    var pcEl = wrap.querySelector('[data-f="pc"]');
    var auEl = wrap.querySelector('[data-f="au"]');
    var msgEl = wrap.querySelector('.ys-gate-msg');
    var okEl = wrap.querySelector('[data-a="ok"]');
    try { auEl.value = localStorage.getItem(AUTHOR_KEY) || ''; } catch (e) {}

    function msg(text, isErr) {
      msgEl.textContent = text || '';
      msgEl.className = 'ys-gate-msg' + (text ? ' is-on' : '') + (isErr ? ' is-err' : '');
    }
    function busy(on) {
      okEl.disabled = !!on;
      okEl.textContent = on ? '확인 중…' : '편집 시작';
    }

    function submit() {
      var pc = pcEl.value, au = (auEl.value || '').trim();
      if (!pc) { msg('공용 암호를 입력하세요.', true); pcEl.focus(); return; }
      if (!au) { msg('편집자 이름을 입력하세요. 커밋 이력에 남습니다.', true); auEl.focus(); return; }
      busy(true); msg('서버에 암호를 확인하는 중입니다.', false);
      Y.net.auth(pc).then(function (r) {
        try { localStorage.setItem(AUTHOR_KEY, au); } catch (e) {}
        Y.session.set({
          passcode: pc, author: au, ts: Date.now(),
          headSha: (r && r.headSha) || null, branch: (r && r.branch) || null
        });
        if (r && r.headSha) Y.engine.setHeadSha(r.headSha);
        closeGate();
        note(au + '님, 편집 세션을 시작합니다.');
        mountAll();
      }, function (err) {
        busy(false);
        var st = err && err.status;
        msg(st === 401 ? '암호가 올바르지 않습니다. 다시 입력하세요.'
          : st === 0 ? '서버에 연결할 수 없습니다. 네트워크를 확인하세요.'
          : ((err && err.message) || '인증에 실패했습니다.'), true);
        try { pcEl.select(); } catch (e2) {}
      });
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    wrap.querySelector('[data-a="cancel"]').addEventListener('click', function () { exitStudio(); });
    /* 사이트(nav.js 오버레이 등)의 Esc 처리와 겹치지 않게 캡처 단계에서 가로챈다 */
    gateKey = function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); e.stopPropagation(); exitStudio(); }
    };
    document.addEventListener('keydown', gateKey, true);

    gate = wrap;
    setTimeout(function () { try { (pcEl.value ? auEl : pcEl).focus(); } catch (e) {} }, 30);
  }

  function closeGate() {
    if (!gate) return;
    if (gateKey) { try { document.removeEventListener('keydown', gateKey, true); } catch (e) {} gateKey = null; }
    if (gate.parentNode) gate.parentNode.removeChild(gate);
    gate = null;
  }

  /* 게이트를 Esc·취소로 닫으면 스튜디오를 종료한다(방문자 상태로 돌아간다) */
  function exitStudio() {
    stopped = true;
    closeGate();
    try { Y.session.clear(); } catch (e) {}
    cleanUrl();
    note('스튜디오를 종료했습니다. 다시 열려면 주소 끝에 ?studio=1 을 붙이세요.');
  }

  function cleanUrl() {
    try {
      if (!/[?&]studio=1(&|$)/.test(location.search)) return;
      var q = location.search.replace(/([?&])studio=1(&|$)/, function (m, a, b) { return b ? a : ''; });
      if (q === '?') q = '';
      history.replaceState(null, '', location.pathname + q + location.hash);
    } catch (e) {}
  }

  /* ── 본 부팅 ── */
  function mountHud() {
    if (!Y.hud || !Y.hud.mount) {
      note('편집 UI(hud.js)를 불러오지 못해 도구 막대를 표시할 수 없습니다.', 'error');
      return false;
    }
    if (!hudMounted) {
      try { Y.hud.mount(); hudMounted = true; }
      catch (e) { note('편집 UI 초기화 실패: ' + (e && e.message), 'error'); return false; }
    }
    try {
      Y.hud.setStatus({
        page: Y.engine.path() || Y.util.pagePath(),
        author: Y.session.author()
      });
    } catch (e2) {}
    return true;
  }

  function mountAll() {
    if (stopped) return Promise.resolve();
    var path = Y.util.pagePath();
    var s = Y.session.get();
    if (s && s.headSha) Y.engine.setHeadSha(s.headSha);

    return Y.engine.open(path).then(function () {
      try { Y.engine.bindLive(document, window); }
      catch (e) { note('화면 대응(align) 실패: ' + (e && e.message), 'error'); }
      mountHud();
      if (!Y.engine.mapped()) {
        note('이 페이지는 원문 대응 검증 실패로 편집할 수 없습니다(' +
          (Y.engine.reason() || '사유 불명') + '). 읽기 전용으로 엽니다.', 'error');
        try { if (Y.hud.setEditing) Y.hud.setEditing(false); } catch (e2) {}
        try { if (Y.hud.setStatus) Y.hud.setStatus({ mode: '읽기 전용' }); } catch (e3) {}
      }
    }, function (err) {
      if (err && err.status === 401) return;      // session:invalid 가 게이트를 다시 띄운다
      note('페이지 원문을 불러오지 못했습니다: ' + ((err && err.message) || '알 수 없는 오류'), 'error');
      mountHud();                                 // 게시·버전 기능은 계속 쓸 수 있게 HUD 는 띄운다
      try { if (Y.hud && Y.hud.setStatus) Y.hud.setStatus({ mode: '원문 없음' }); } catch (e) {}
    });
  }

  function start() {
    Y.bus.on('session:invalid', function () {
      if (stopped || gate) return;
      try { Y.session.clear(); } catch (e) {}
      note('세션이 만료되었거나 암호가 바뀌었습니다. 다시 인증하세요.', 'warn');
      openGate();
    });

    Y.boot.state = 'ready';
    Y.boot.gate = openGate;
    Y.boot.exit = exitStudio;
    Y.boot.mount = mountAll;
    Y.boot.loaded = loaded;
    Y.boot.failed = failed;

    var s = Y.session.get();
    if (s && s.passcode) mountAll(); else openGate();
  }

  injectGateCss();
  loadCss();
  loadModules().then(function () {
    if (coreDead || !Y.core || !Y.engine) {
      Y.boot.state = 'dead';
      rawNote('스튜디오 코어를 불러오지 못했습니다: ' + (failed.join(', ') || '알 수 없는 오류'));
      return;
    }
    /* 로컬 테스트에서 API 주소를 갈아끼우는 경우(core 로드 뒤에 설정됐을 수 있다) */
    if (window.YSME_STUDIO_API) Y.config.api = window.YSME_STUDIO_API;
    if (failed.length) note('불러오지 못한 모듈: ' + failed.join(', '), 'warn', 5200);
    start();
  });
})();
