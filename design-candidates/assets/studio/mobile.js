/* YSME In-Place Studio — 모바일 렌더 모드 (STUDIO_SPEC 6절)

   왜 프레임인가: 폭만 줄이는 "가짜 모바일"은 사이트가 실제로 쓰는 미디어쿼리(@media
   max-width:920px) 를 재현하지 못한다. 같은 오리진 <iframe> 에 **현재 페이지 URL 그대로**
   를 로드하면 자산 상대경로가 그대로 동작하고, iframe 은 자기 뷰포트를 가지므로 폭 390px
   에서 햄버거 메뉴가 진짜로 나타난다.

   프레임 안에서 스튜디오가 다시 뜨면 안 된다(같은 탭이라 sessionStorage 를 공유한다).
   그래서 세 겹으로 막는다.
     1) URL 쿼리 `?ysstudio=frame`         — boot.js 가 이 값이면 부팅하지 않는다.
     2) window.name = 'ysme-studio-frame'  — 프레임 안에서 링크로 이동해도 살아남는다.
     3) window.YSME_STUDIO_DISABLED = true — 로드 직후 폴링으로 주입(사이트 JS 실행 전 목표).
   그래도 뚫렸을 때를 대비해 load 마다 프레임 안의 [data-ys-ui] 노드를 걷어낸다.

   pointer 에뮬레이션 한계(고지): matchMedia 를 프레임 문서의 첫 스크립트보다 먼저 덮을
   확실한 방법은 없다(src 로드 방식의 대가다). 여기서는 src 지정 직후부터 짧은 주기로
   폴링해 가능한 이른 시점에 덮는다. 로드 시점에 이미 평가된 분기는 되돌릴 수 없으나,
   사이트의 pointer 분기는 대부분 이벤트 시점에 matchMedia 를 호출하므로 실효가 있다.
   폭 기반 분기(CSS 미디어쿼리·햄버거)는 프레임 뷰포트 자체가 390px 이므로 항상 정확하다. */
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.mobile) return;
  var U = Y.util;

  var FRAME_NAME = 'ysme-studio-frame';
  var WIDTH = 390;
  var STYLE_ID = 'ys-mob-style';

  var wrap = null;        // 오버레이 루트
  var iframe = null;
  var poll = null;        // matchMedia 주입 폴링
  var fdoc = null;        // 리스너를 붙여 둔 프레임 document

  /* ── 스타일 (studio.css 가 나중에 로드되어 덮을 수 있게 head 최상단에 넣는다) ── */
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var z = Y.config.Z - 10;
    var css = [
      '.ys-mob{position:fixed;left:0;top:0;right:0;bottom:0;z-index:' + z + ';display:flex;',
      'flex-direction:column;align-items:center;gap:.6rem;padding:.7rem 0 1rem;',
      'background:rgba(8,16,30,.74);font:400 .84rem/1.5 "Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif}',
      '.ys-mob-bar{display:flex;align-items:center;gap:.5rem;color:#eaf0fa;max-width:min(96vw,34rem)}',
      '.ys-mob-title{font-weight:700;letter-spacing:.01em}',
      '.ys-mob-hint{color:#b9c6db;font-size:.74rem}',
      '.ys-mob-btn{font:600 .78rem/1 inherit;color:#0d2143;background:#e9eefa;border:0;border-radius:.4rem;',
      'padding:.42rem .62rem;cursor:pointer}',
      '.ys-mob-btn:hover{background:#fff}',
      '.ys-mob-device{width:' + WIDTH + 'px;max-width:96vw;flex:1 1 auto;min-height:0;',
      'background:#000;border:6px solid #10192c;border-radius:1.6rem;box-shadow:0 24px 60px rgba(4,10,22,.55);',
      'overflow:hidden;display:flex}',
      '.ys-mob-frame{width:100%;height:100%;border:0;background:#fff;display:block}',
      '.ys-mob-lock,.ys-mob-lock body{overflow:hidden!important}'
    ].join('');
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = css;
    var head = document.head || document.documentElement;
    head.insertBefore(st, head.firstChild);
  }

  /* ── 프레임 URL — 현재 페이지 그대로 + 프레임 표시 쿼리 ── */
  function frameUrl(href) {
    var u = String(href || location.href), hash = '';
    var h = u.indexOf('#');
    if (h >= 0) { hash = u.slice(h); u = u.slice(0, h); }
    if (!/[?&]ysstudio=frame(&|$)/.test(u)) u += (u.indexOf('?') >= 0 ? '&' : '?') + 'ysstudio=frame';
    return u + hash;
  }

  /* ── matchMedia 에뮬레이션 ── */
  /** 모바일에서의 참값. null 이면 프레임의 실제 평가(폭 등)를 그대로 쓴다. */
  function forcedFor(query) {
    var q = String(query || '').toLowerCase().replace(/\s+/g, '');
    if (q.indexOf('pointer:fine') >= 0) return false;          // any-pointer:fine 도 포함
    if (q.indexOf('pointer:coarse') >= 0) return true;
    if (q.indexOf('hover:hover') >= 0) return false;
    if (q.indexOf('hover:none') >= 0) return true;
    return null;
  }

  /** MediaQueryList 흉내 — matches 만 고정하고 리스너는 실물에 위임한다. */
  function fakeMql(real, media, forced) {
    var fake = {
      media: media,
      matches: forced,
      onchange: null,
      addListener: function (fn) { if (real && real.addListener) real.addListener(fn); },
      removeListener: function (fn) { if (real && real.removeListener) real.removeListener(fn); },
      addEventListener: function (t, fn) { if (real && real.addEventListener) real.addEventListener(t, fn); },
      removeEventListener: function (t, fn) { if (real && real.removeEventListener) real.removeEventListener(t, fn); },
      dispatchEvent: function (e) { return real && real.dispatchEvent ? real.dispatchEvent(e) : false; }
    };
    return fake;
  }

  function patchMM(win) {
    if (!win) return false;
    try {
      if (win.__ysMobPatched) return true;
      var native = win.matchMedia;
      if (typeof native !== 'function') return false;
      win.__ysMobPatched = true;
      win.matchMedia = function (q) {
        var real = null;
        try { real = native.call(win, q); } catch (e) { real = null; }
        var forced = forcedFor(q);
        if (forced === null) return real;
        return fakeMql(real, String(q), forced);
      };
      return true;
    } catch (e) { return false; }   // 아직 about:blank → 다음 폴링에서 재시도
  }

  /** src 지정 직후부터 계속 돌며, 새 문서가 뜨는 즉시 플래그·matchMedia 를 주입한다. */
  function startPoll() {
    if (poll) clearInterval(poll);
    poll = setInterval(function () {
      if (!iframe || !iframe.parentNode) return;
      var w = null;
      try { w = iframe.contentWindow; } catch (e) { w = null; }
      if (!w) return;
      try { w.YSME_STUDIO_DISABLED = true; } catch (e) {}
      patchMM(w);
    }, 16);
  }

  function frameWin() { try { return iframe && iframe.contentWindow; } catch (e) { return null; } }
  function frameDoc() { try { return iframe && (iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document)); } catch (e) { return null; } }

  /** 가드가 뚫려 프레임 안에 스튜디오 UI 가 생겼다면 걷어낸다. */
  function cleanUi(d) {
    if (!d || !d.querySelectorAll) return;
    var ns = d.querySelectorAll('[' + Y.config.uiAttr + ']');
    for (var i = 0; i < ns.length; i++) if (ns[i].parentNode) ns[i].parentNode.removeChild(ns[i]);
  }

  /* ── 프레임 문서 리스너 (Esc · 선택 전달) ── */
  function onFrameKey(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); api.close(); }
  }
  function onFrameClick(e) {
    /* hud.js 가 이미 이 문서에 위임 리스너를 걸었다면(문서에 표식이 있다) 건드리지 않는다. */
    if (!Y.hud || !Y.hud.editing || !Y.hud.editing()) return;
    var d = fdoc;
    if (d && d.documentElement && d.documentElement.hasAttribute('data-ys-hud-bound')) return;
    var t = e.target;
    if (!t || t.nodeType !== 1 || U.isUi(t)) return;
    var near = Y.engine.nearestFromLive(t);
    if (near && typeof Y.hud.select === 'function') Y.hud.select(near.index);
  }
  function attachFrameDoc(d) {
    detachFrameDoc();
    if (!d) return;
    fdoc = d;
    d.addEventListener('keydown', onFrameKey, true);
    d.addEventListener('click', onFrameClick, true);
  }
  function detachFrameDoc() {
    if (!fdoc) return;
    try {
      fdoc.removeEventListener('keydown', onFrameKey, true);
      fdoc.removeEventListener('click', onFrameClick, true);
    } catch (e) {}
    fdoc = null;
  }

  function onTopKey(e) {
    if (!wrap) return;
    if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); api.close(); }
  }

  /* ── 엔진 붙이기 ── */
  function bindTo(d, w) {
    Y.engine.bindLive(d, w);
    try { Y.engine.resyncLive(); } catch (e) {}      // 초안 편집분을 프레임 화면에 반영
    if (Y.hud && Y.hud.setStatus) Y.hud.setStatus({ page: U.pagePath(w.location), mode: '모바일' });
    Y.bus.emit('mobile:change', { open: true, doc: d, win: w });
  }

  function onFrameLoad() {
    var w = frameWin(), d = frameDoc();
    if (!w || !d) return;
    patchMM(w);
    cleanUi(d);
    attachFrameDoc(d);
    var p = U.pagePath(w.location);
    if (Y.engine.path() === p) { bindTo(d, w); return; }
    /* 프레임 안에서 링크로 이동한 경우 — 그 페이지 원문을 열고 다시 붙인다 */
    var stop = (Y.hud && Y.hud.busy) ? Y.hud.busy('원문 불러오는 중') : null;
    Y.engine.open(p).then(function () {
      if (stop) stop();
      if (wrap) bindTo(d, w);
    }, function (err) {
      if (stop) stop();
      Y.toast(err && err.message ? err.message : '원문을 불러올 수 없습니다.', 'error');
    });
  }

  /* ── 오버레이 ── */
  function build() {
    ensureStyle();
    wrap = document.createElement('div');
    wrap.className = 'ys-mob';
    wrap.setAttribute(Y.config.uiAttr, '');
    wrap.innerHTML =
      '<div class="ys-mob-bar">' +
        '<span class="ys-mob-title">모바일 렌더 ' + WIDTH + 'px</span>' +
        '<span class="ys-mob-hint">터치 환경으로 보고합니다 · 편집은 그대로 동작</span>' +
        '<button type="button" class="ys-mob-btn" data-act="reload">새로고침</button>' +
        '<button type="button" class="ys-mob-btn" data-act="close">닫기 (Esc)</button>' +
      '</div>' +
      '<div class="ys-mob-device"><iframe class="ys-mob-frame" title="모바일 렌더"></iframe></div>';

    wrap.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'close') api.close();
      else if (act === 'reload' && iframe) iframe.src = frameUrl(location.href);
    });

    iframe = wrap.querySelector('.ys-mob-frame');
    iframe.setAttribute('name', FRAME_NAME);          // 프레임 안 window.name — 이동해도 유지된다
    iframe.addEventListener('load', onFrameLoad);
    document.body.appendChild(wrap);
    iframe.src = frameUrl(location.href);
    startPoll();
  }

  var api = Y.mobile = {
    FRAME_NAME: FRAME_NAME,
    WIDTH: WIDTH,

    /** boot.js 등이 "여기는 프레임인가"를 판별할 때 쓴다. */
    isFrame: function (win) {
      var w = win || window;
      try {
        if (/[?&]ysstudio=frame(&|$)/.test(w.location.search)) return true;
        if (w.name === FRAME_NAME) return true;
        if (w.YSME_STUDIO_DISABLED) return true;
      } catch (e) {}
      return false;
    },

    isOpen: function () { return !!wrap; },

    open: function () {
      if (wrap) return false;
      if (api.isFrame(window)) return false;           // 프레임 안에서 또 열지 않는다
      if (Y.hud && Y.hud.clearSelection) Y.hud.clearSelection();
      document.documentElement.classList.add('ys-mob-lock');
      document.addEventListener('keydown', onTopKey, true);
      build();
      return true;
    },

    close: function () {
      if (!wrap) return false;
      detachFrameDoc();
      if (poll) { clearInterval(poll); poll = null; }
      document.removeEventListener('keydown', onTopKey, true);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      wrap = null; iframe = null;
      document.documentElement.classList.remove('ys-mob-lock');
      if (Y.hud && Y.hud.clearSelection) Y.hud.clearSelection();

      var p = U.pagePath(location);
      function finish() {
        Y.engine.bindLive(document, window);
        try { Y.engine.resyncLive(); } catch (e) {}
        if (Y.hud && Y.hud.setStatus) Y.hud.setStatus({ page: p, mode: null });
        Y.bus.emit('mobile:change', { open: false, doc: document, win: window });
      }
      /* 프레임에서 다른 페이지로 이동한 뒤 닫았다면, 원래 페이지 원문으로 되돌린다 */
      if (Y.engine.path() !== p) {
        Y.engine.open(p).then(finish, function (err) {
          Y.toast(err && err.message ? err.message : '원문을 불러올 수 없습니다.', 'error');
          finish();
        });
      } else finish();
      return true;
    },

    toggle: function () { return wrap ? api.close() : api.open(); }
  };

  /* 페이지를 떠나면 오버레이도 사라진다 — 엔진은 다음 로드에서 새로 붙는다 */
  window.addEventListener('pagehide', function () { if (wrap) api.close(); });
})();
