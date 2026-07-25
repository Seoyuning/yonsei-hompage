/* YSME In-Place Studio — HUD · 인스펙터 (STUDIO_SPEC 7절)

   이 파일이 도구의 얼굴이다. 다른 모듈(versions·ai·i18n-edit·mobile·datamap)은
   여기서 공개하는 계약만 보고 붙는다.

     Y.hud.mount()
     Y.hud.registerPanel({id,title,icon,order,render(hostEl),onOpen,onClose})
     Y.hud.openPanel(id) / closePanel() / isOpen(id)
     Y.hud.setStatus(patch)            // {page,drafts,author,lang,mode,saved}
     Y.hud.selection() / select(idx) / clearSelection() / revealIdx(idx)
     Y.hud.modal({title,body,okLabel,onOk,cancelLabel,wide}) -> {close}
     Y.hud.confirm(message) -> Promise<boolean>
     Y.hud.busy(label) -> stop()
     Y.hud.editing() / setEditing(on)
     Y.hud.publish()

   설계 메모
   · 편집 모드를 끄면 방문자와 완전히 같다 — 라이브 문서에 붙인 리스너를 전부 떼어낸다.
   · 하이라이트 박스는 "라이브 문서"의 body 에 position:absolute 로 붙인다(문서 좌표계).
     그래서 스크롤과 함께 움직이고, 모바일 프레임(iframe) 문서에도 같은 방식으로 붙는다.
     좌표는 layer 의 rect 를 원점으로 빼서 구한다(= scrollX/Y 보정과 같고, body 여백·
     position 지정에도 흔들리지 않는다).
   · nav.js 가 만든 화면 요소(.ynv/.ysub/.ytop/.ynv-ovl/footer.yft)는 파일에 없다.
     편집 모드에서도 클릭을 가로채지 않는다 — 편집 중 페이지 이동에 그대로 쓴다.
   · 색·간격은 studio.css 에만 둔다. 예외는 하이라이트 박스·토스트처럼
     "CSS 가 아직 없는 문서(프레임)에서도 보여야 하는" 최소 인라인 스타일이다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.hud) return;

  var U = Y.util, UIA = Y.config.uiAttr, D = document;
  /* 자기 파일 URL — studio.css 를 같은 폴더에서 찾는다 */
  var SELF = (D.currentScript && D.currentScript.src) || '';

  /* ── 상태 ── */
  var mounted = false;
  var root = null, stackEl = null, statusEl = null;
  var panelEl = null, panelTitleEl = null, panelBodyEl = null;
  var panels = {}, panelIds = [], curPanel = null;
  var editing = false;
  var sel = null;                      // {idx, live, clicked, self}
  var status = { page: '', drafts: 0, author: '', lang: '', mode: '보기', saved: '' };
  var layer = null, layerDoc = null, hoverBox = null, selBox = null, tgtBox = null;
  var hoverEl = null, tgtEl = null, tgtTimer = null;
  var bound = null;                    // 편집 리스너가 붙은 {doc, win}
  var keyDoc = null;                   // 프레임 문서 단축키 리스너
  var busyEl = null, busyN = 0;
  var modalStack = [];
  var bannerEl = null;
  var publishing = false;
  var btns = {};
  var rafPend = false;
  var insp = { host: null, undoB: null, redoB: null, dirtyEl: null };

  /* ── 아이콘 (정적 마크업. 외부 자원 없음) ── */
  var ICONS = {
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4z"/><path d="M13.6 6.9l3.5 3.5"/></svg>',
    hist: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2"/><path d="M12 7.4V12l3.2 2.1"/></svg>',
    ai: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3.5l1.7 4.3 4.3 1.7-4.3 1.7L10 15.5 8.3 11.2 4 9.5l4.3-1.7z"/><path d="M17.6 14.2l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/></svg>',
    mob: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.8" y="3" width="10.4" height="18" rx="2.2"/><path d="M10.6 17.9h2.8"/></svg>',
    lang: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2"/><path d="M3.8 12h16.4"/><path d="M12 3.8c2.6 2.6 2.6 13 0 16.4-2.6-3.4-2.6-13.8 0-16.4z"/></svg>',
    pub: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.6V5.4"/><path d="M7.2 10.2L12 5.4l4.8 4.8"/><path d="M5 19.6h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 12S6.6 6.4 12 6.4 21.2 12 21.2 12 17.4 17.6 12 17.6 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.6"/></svg>'
  };

  /* ── DOM 헬퍼 ── */
  function mk(tag, cls, txt) {
    var n = D.createElement(tag);
    if (tag === 'button') n.type = 'button';
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function ico(name) { var s = mk('span', 'ys-ic'); s.innerHTML = ICONS[name] || ''; return s; }
  function hint(txt) { return mk('p', 'ys-hint', txt); }
  function warnBox(txt) { return mk('p', 'ys-warn', txt); }
  function noteBox(txt) { return mk('p', 'ys-note', txt); }
  function sect(title) {
    var s = mk('section', 'ys-sec');
    if (title) s.appendChild(mk('h4', 'ys-sec-t', title));
    return s;
  }
  function fieldRow(label) {
    var f = mk('div', 'ys-f');
    f.appendChild(mk('span', 'ys-f-l', label));
    return f;
  }
  function act(label, cls, fn) {
    var b = mk('button', 'ys-act' + (cls ? ' ' + cls : ''), label);
    b.addEventListener('click', fn);
    return b;
  }
  function scrollTo(el) {
    if (!el || !el.scrollIntoView) return;
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    catch (e) { try { el.scrollIntoView(); } catch (e2) {} }
  }
  function inDoc(el) {
    if (!el) return false;
    var d = el.ownerDocument;
    return !!(d && d.documentElement && d.documentElement.contains(el));
  }
  function focusInPanel() {
    var a = D.activeElement;
    return !!(a && panelEl && panelEl.contains(a));
  }

  /* ── studio.css 보장 (프레임 문서에도 붙인다) ── */
  function cssHref() {
    if (SELF) return SELF.replace(/[^/]*$/, 'studio.css');
    var s = D.getElementsByTagName('script');
    for (var i = 0; i < s.length; i++) {
      var u = s[i].src || '';
      if (u.indexOf('studio/hud.js') >= 0 || u.indexOf('studio/boot.js') >= 0 || u.indexOf('studio/core.js') >= 0) {
        return u.replace(/[^/]*$/, 'studio.css');
      }
    }
    return '/assets/studio/studio.css';
  }
  function ensureCss(doc) {
    if (!doc || !doc.querySelector) return;
    if (doc.querySelector('link[data-ys-css]')) return;
    var l = doc.createElement('link');
    l.rel = 'stylesheet';
    l.href = cssHref();
    l.setAttribute('data-ys-css', '');
    l.setAttribute(UIA, '');
    (doc.head || doc.documentElement).appendChild(l);
  }

  /* ══════════════════════════════════════════════════════════
     1. 마운트 — 버튼 스택 · 상태바 · 사이드 패널
     ══════════════════════════════════════════════════════════ */
  var STACK = [
    { key: 'edit', label: '편집', icon: 'edit', kind: 'toggle', name: '편집 모드' },
    { key: 'versions', label: '버전', icon: 'hist', kind: 'panel', panel: 'versions', name: '버전 관리' },
    { key: 'ai', label: 'AI', icon: 'ai', kind: 'panel', panel: 'ai', name: 'AI 수정' },
    { key: 'mobile', label: '모바일', icon: 'mob', kind: 'mobile', name: '모바일 모드' },
    { key: 'i18n', label: '한·영', icon: 'lang', kind: 'panel', panel: 'i18n', name: '한/영 편집' },
    { key: 'publish', label: '게시', icon: 'pub', kind: 'publish', name: '게시' }
  ];

  function mount() {
    if (mounted) return root;
    if (!D.body) {                                  // 아주 이른 로드 — body 가 생긴 뒤 다시 시도
      D.addEventListener('DOMContentLoaded', function () { mount(); });
      return null;
    }
    mounted = true;
    ensureCss(D);

    root = mk('div', 'ys-root');
    root.setAttribute(UIA, '');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', '사이트 편집 도구');

    /* 상태바 */
    statusEl = mk('div', 'ys-status');
    statusEl.setAttribute('aria-live', 'polite');
    root.appendChild(statusEl);

    /* 버튼 스택 */
    stackEl = mk('div', 'ys-stack');
    for (var i = 0; i < STACK.length; i++) stackEl.appendChild(makeStackBtn(STACK[i]));
    root.appendChild(stackEl);

    /* 사이드 패널 */
    panelEl = mk('aside', 'ys-panel');
    panelEl.setAttribute('aria-hidden', 'true');
    var head = mk('div', 'ys-panel-head');
    panelTitleEl = mk('h3', 'ys-panel-t', '패널');
    var close = mk('button', 'ys-panel-x');
    close.setAttribute('aria-label', '패널 닫기');
    close.appendChild(ico('x'));
    close.addEventListener('click', function () { closePanel(); });
    head.appendChild(panelTitleEl);
    head.appendChild(close);
    panelBodyEl = mk('div', 'ys-panel-body');
    panelEl.appendChild(head);
    panelEl.appendChild(panelBodyEl);
    root.appendChild(panelEl);

    D.body.appendChild(root);

    /* 인스펙터는 HUD 자신이 등록한다 */
    registerPanel({
      id: 'inspect', title: '요소 편집', order: 10,
      render: function (host) { renderInspect(host); },
      onOpen: function () { renderInspect(panels.inspect.host); }
    });

    /* 전역 리스너 */
    D.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onScroll, true);
    window.addEventListener('scroll', onScroll, true);

    /* 버스 */
    Y.bus.on('draft:change', function () { refreshDraftsSoon(); });
    Y.bus.on('buffer:change', onBufferChange);
    Y.bus.on('buffer:open', onBufferOpen);
    Y.bus.on('align:change', onAlignChange);
    Y.bus.on('live:stale', onStale);
    Y.bus.on('session:change', function () { setStatus({ author: Y.session.author() }); });

    setStatus({ page: U.pagePath(), author: Y.session.author(), mode: '보기' });
    refreshDrafts();
    loadLastPublish();
    syncKeyDoc();
    nudgeSiteTop(0);
    return root;
  }

  function makeStackBtn(def) {
    var b = mk('button', 'ys-btn' + (def.kind === 'publish' ? ' is-pub' : ''));
    b.appendChild(ico(def.icon));
    b.appendChild(mk('span', 'ys-btn-tx', def.label));
    b.title = def.name + (def.kind === 'toggle' ? ' (E)' : def.kind === 'publish' ? ' (Ctrl+Shift+P)' : '');
    b.setAttribute('aria-label', def.name);
    b.addEventListener('click', function () { onStackClick(def); });
    btns[def.key] = b;
    return b;
  }

  function onStackClick(def) {
    if (def.kind === 'toggle') { setEditing(!editing); return; }
    if (def.kind === 'publish') { publish(); return; }
    if (def.kind === 'mobile') {
      if (Y.mobile && typeof Y.mobile.toggle === 'function') { Y.mobile.toggle(); syncButtons(); }
      else Y.toast('모바일 모드는 준비 중입니다.', 'warn');
      return;
    }
    if (def.kind === 'panel') {
      if (!panels[def.panel]) { Y.toast(def.name + ' 기능은 준비 중입니다.', 'warn'); return; }
      if (curPanel === def.panel) closePanel(); else openPanel(def.panel);
    }
  }

  function syncButtons() {
    if (!mounted) return;
    for (var i = 0; i < STACK.length; i++) {
      var def = STACK[i], b = btns[def.key];
      if (!b) continue;
      if (def.kind === 'toggle') {
        b.classList.toggle('is-on', editing);
        b.setAttribute('aria-pressed', editing ? 'true' : 'false');
      } else if (def.kind === 'panel') {
        b.classList.toggle('is-off', !panels[def.panel]);
        b.classList.toggle('is-on', curPanel === def.panel);
      } else if (def.kind === 'mobile') {
        var on = false, m = Y.mobile;
        if (m) on = typeof m.active === 'function' ? !!m.active() : !!m.active;
        b.classList.toggle('is-off', !m);
        b.classList.toggle('is-on', on);
      }
    }
  }

  /* 사이트의 위로가기 버튼(.ytop)이 스택에 가리지 않게 살짝 올린다.
     .ytop 은 nav.js 가 라이브에만 만드는 요소라 저장본과 무관하다. */
  function nudgeSiteTop(tries) {
    var t = D.querySelector('.ytop');
    if (!t) {
      if ((tries || 0) < 3) setTimeout(function () { nudgeSiteTop((tries || 0) + 1); }, 400);
      return;
    }
    var h = (stackEl ? stackEl.offsetHeight : 0) + (statusEl ? statusEl.offsetHeight : 0) + 34;
    t.classList.add('ys-nudge');
    t.style.setProperty('--ys-lift', h + 'px');
  }

  /* ══════════════════════════════════════════════════════════
     2. 상태바
     ══════════════════════════════════════════════════════════ */
  function langLabel() {
    var v = 'ko';
    try { v = localStorage.getItem('ysme-lang') || 'ko'; } catch (e) {}
    return v === 'en' ? 'EN' : 'KO';
  }

  function setStatus(patch) {
    if (patch) for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) status[k] = patch[k];
    renderStatus();
  }

  function renderStatus() {
    if (!statusEl) return;
    statusEl.innerHTML = '';
    var items = [
      { t: status.page || U.pagePath(), c: 'is-page' },
      { t: status.drafts ? '미저장 ' + status.drafts + '건' : '초안 없음', c: status.drafts ? 'is-dirty' : '' },
      { t: status.author || Y.session.author(), c: '' },
      { t: (status.mode || '보기') + ' 모드', c: editing ? 'is-edit' : '' },
      { t: status.lang || langLabel(), c: '' }
    ];
    if (status.saved) items.push({ t: '게시 ' + status.saved, c: '' });
    for (var i = 0; i < items.length; i++) {
      if (i) statusEl.appendChild(mk('span', 'ys-dot', '·'));
      statusEl.appendChild(mk('span', 'ys-st-i' + (items[i].c ? ' ' + items[i].c : ''), items[i].t));
    }
  }

  var refreshDraftsSoon = U.debounce(function () { refreshDrafts(); }, 250);
  function refreshDrafts() {
    return Y.store.all('drafts').then(function (list) {
      var n = 0;
      list = list || [];
      for (var i = 0; i < list.length; i++) {
        var d = list[i];
        if (d && typeof d.src === 'string' && d.src !== d.origSrc) n++;
      }
      setStatus({ drafts: n });
      return list;
    }, function () { return []; });
  }
  function loadLastPublish() {
    Y.store.get('meta', 'lastPublish').then(function (r) {
      if (r && r.ts) setStatus({ saved: U.fmtTime(r.ts) });
    }, function () {});
  }

  /* ══════════════════════════════════════════════════════════
     3. 패널
     ══════════════════════════════════════════════════════════ */
  function registerPanel(p) {
    if (!p || !p.id) return null;
    var rec = {
      id: p.id,
      title: p.title || p.id,
      icon: p.icon || '',
      order: p.order == null ? 50 : p.order,
      render: p.render, onOpen: p.onOpen, onClose: p.onClose,
      host: null, built: false
    };
    panels[rec.id] = rec;
    if (panelIds.indexOf(rec.id) < 0) panelIds.push(rec.id);
    panelIds.sort(function (a, b) { return (panels[a].order - panels[b].order) || (a < b ? -1 : 1); });
    syncButtons();
    return rec;
  }

  function openPanel(id) {
    if (!mounted) mount();
    var p = panels[id];
    if (!p) { Y.toast('아직 준비되지 않은 패널입니다.', 'warn'); return; }
    if (curPanel && curPanel !== id) {
      var old = panels[curPanel];
      curPanel = null;
      try { if (old && old.onClose) old.onClose(); } catch (e) {}
    }
    curPanel = id;
    panelTitleEl.textContent = p.title;
    if (!p.host) {
      p.host = mk('div', 'ys-panel-host');
      p.host.setAttribute('data-ys-panel', id);
      panelBodyEl.appendChild(p.host);
    }
    for (var i = 0; i < panelIds.length; i++) {
      var q = panels[panelIds[i]];
      if (q && q.host) q.host.style.display = (q === p ? '' : 'none');
    }
    if (!p.built) {
      p.built = true;
      try { if (p.render) p.render(p.host); }
      catch (e) { p.host.appendChild(warnBox('패널을 그리는 중 오류가 발생했습니다.')); }
    }
    panelEl.classList.add('is-open');
    panelEl.setAttribute('aria-hidden', 'false');
    root.classList.add('is-panel');
    panelBodyEl.scrollTop = 0;
    syncButtons();
    try { if (p.onOpen) p.onOpen(); } catch (e) {}
  }

  function closePanel() {
    if (!curPanel) return;
    var p = panels[curPanel];
    curPanel = null;
    panelEl.classList.remove('is-open');
    panelEl.setAttribute('aria-hidden', 'true');
    root.classList.remove('is-panel');
    syncButtons();
    try { if (p && p.onClose) p.onClose(); } catch (e) {}
  }

  function isOpen(id) { return id == null ? !!curPanel : curPanel === id; }

  function renderPanelIfOpen(id) {
    var p = panels[id];
    if (!p || curPanel !== id || !p.host) return;
    if (p.id === 'inspect') { renderInspect(p.host); return; }
    if (p.onOpen) { try { p.onOpen(); } catch (e) {} }
  }

  /* ══════════════════════════════════════════════════════════
     4. 모달 · 진행 표시 · 배너
     ══════════════════════════════════════════════════════════ */
  function modal(o) {
    o = o || {};
    if (!mounted) mount();
    var back = mk('div', 'ys-modal-back');
    back.setAttribute(UIA, '');
    var box = mk('div', 'ys-modal' + (o.wide ? ' is-wide' : ''));
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');

    var head = mk('div', 'ys-modal-h');
    head.appendChild(mk('h3', 'ys-modal-t', o.title || '확인'));
    var x = mk('button', 'ys-modal-x');
    x.setAttribute('aria-label', '닫기');
    x.appendChild(ico('x'));
    head.appendChild(x);

    var body = mk('div', 'ys-modal-b');
    if (o.body && o.body.nodeType) body.appendChild(o.body);
    else if (o.body != null) body.innerHTML = String(o.body);

    var foot = mk('div', 'ys-modal-f');
    var okB = null;
    if (o.cancelLabel !== null) foot.appendChild(act(o.cancelLabel || '취소', '', function () { api.close(); }));
    if (o.okLabel !== null) {
      okB = act(o.okLabel || '확인', 'is-pri', function () {
        var r = true;
        try { if (o.onOk) r = o.onOk(); } catch (e) { r = true; }
        if (r !== false) api.close();
      });
      foot.appendChild(okB);
    }

    box.appendChild(head); box.appendChild(body); box.appendChild(foot);
    back.appendChild(box);
    root.appendChild(back);

    var prevFocus = D.activeElement;
    var closed = false;
    var api = {
      el: box,
      close: function () {
        if (closed) return;
        closed = true;
        var i = modalStack.indexOf(api);
        if (i >= 0) modalStack.splice(i, 1);
        if (back.parentNode) back.parentNode.removeChild(back);
        try { if (o.onClose) o.onClose(); } catch (e) {}
        try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
      }
    };
    x.addEventListener('click', function () { api.close(); });
    back.addEventListener('mousedown', function (e) { if (e.target === back) api.close(); });
    modalStack.push(api);
    setTimeout(function () {
      var f = box.querySelector('input,textarea,select') || okB || x;
      if (f && f.focus) { try { f.focus(); } catch (e) {} }
    }, 20);
    return api;
  }

  function confirmBox(message) {
    return new Promise(function (res) {
      var done = false;
      modal({
        title: '확인',
        body: mk('p', 'ys-modal-p', String(message == null ? '' : message)),
        okLabel: '확인', cancelLabel: '취소',
        onOk: function () { done = true; res(true); },
        onClose: function () { if (!done) res(false); }
      });
    });
  }

  function busy(label) {
    if (!mounted) mount();
    busyN++;
    if (!busyEl) {
      busyEl = mk('div', 'ys-busy');
      busyEl.setAttribute(UIA, '');
      busyEl.appendChild(mk('span', 'ys-spin'));
      busyEl.appendChild(mk('span', 'ys-busy-t', ''));
      root.appendChild(busyEl);
    }
    busyEl.querySelector('.ys-busy-t').textContent = label || '처리 중…';
    busyEl.classList.add('is-on');
    var done = false;
    return function stop() {
      if (done) return;
      done = true;
      busyN = Math.max(0, busyN - 1);
      if (!busyN && busyEl) busyEl.classList.remove('is-on');
    };
  }

  /* 화면과 원문이 어긋났을 때 (구조 편집·되돌리기 직후) */
  function onStale() {
    if (!mounted || bannerEl) return;
    bannerEl = mk('div', 'ys-banner');
    bannerEl.setAttribute(UIA, '');
    var tx = mk('div', 'ys-banner-tx');
    tx.appendChild(mk('strong', 'ys-banner-t', '화면과 원문이 어긋났습니다.'));
    tx.appendChild(mk('span', 'ys-banner-d',
      '구조가 바뀌어 화면이 원문을 그대로 보여 주지 못합니다. 초안은 이미 저장돼 있으니 새로고침해도 편집 내용은 남습니다.'));
    bannerEl.appendChild(tx);
    var row = mk('div', 'ys-banner-r');
    row.appendChild(act('새로고침', 'is-pri', reloadSafe));
    row.appendChild(act('닫기', '', function () { hideBanner(); }));
    bannerEl.appendChild(row);
    root.appendChild(bannerEl);
  }
  function hideBanner() {
    if (bannerEl && bannerEl.parentNode) bannerEl.parentNode.removeChild(bannerEl);
    bannerEl = null;
  }
  function reloadSafe() {
    var stop = busy('초안을 저장하고 새로고침합니다…');
    Promise.resolve(Y.engine.flush()).then(function () { stop(); location.reload(); },
      function () { stop(); location.reload(); });
  }

  /* ══════════════════════════════════════════════════════════
     5. 편집 모드 · 선택 오버레이
     ══════════════════════════════════════════════════════════ */
  function setEditing(on) {
    on = !!on;
    if (!mounted) mount();
    if (editing === on) { syncButtons(); return; }
    editing = on;
    if (on) {
      if (!Y.engine.current()) Y.toast('페이지 원문을 아직 불러오지 못했습니다. 편집 내용이 저장되지 않을 수 있습니다.', 'warn');
      attachLive();
    } else {
      detachLive();
      clearSelection();
      setHover(null);
    }
    root.classList.toggle('is-editing', on);
    setStatus({ mode: on ? '편집' : '보기' });
    syncButtons();
    Y.bus.emit('hud:editing', on);
  }

  function attachLive() {
    var doc = Y.engine.liveDoc() || D;
    var win = Y.engine.liveWin() || (doc.defaultView || window);
    if (bound && bound.doc === doc) return;
    detachLive();
    bound = { doc: doc, win: win };
    doc.addEventListener('mousemove', onMove, true);
    doc.addEventListener('mouseout', onOut, true);
    doc.addEventListener('click', onClick, true);
    win.addEventListener('scroll', onScroll, true);
    win.addEventListener('resize', onScroll, true);
    ensureLayer(doc);
  }
  function detachLive() {
    if (!bound) return;
    var doc = bound.doc, win = bound.win;
    doc.removeEventListener('mousemove', onMove, true);
    doc.removeEventListener('mouseout', onOut, true);
    doc.removeEventListener('click', onClick, true);
    if (win) {
      win.removeEventListener('scroll', onScroll, true);
      win.removeEventListener('resize', onScroll, true);
    }
    bound = null;
  }
  /* 모바일 프레임처럼 라이브 문서가 바뀌면 리스너·레이어를 옮긴다 */
  function onAlignChange() {
    syncKeyDoc();
    if (editing) attachLive();
    var doc = Y.engine.liveDoc() || D;
    if (layerDoc && layerDoc !== doc) { setHover(null); ensureLayer(doc); }
    resolveSelection();
    recalcBoxes();
  }
  function syncKeyDoc() {
    var doc = Y.engine.liveDoc();
    var want = (doc && doc !== D) ? doc : null;
    if (keyDoc === want) return;
    if (keyDoc) keyDoc.removeEventListener('keydown', onKey, true);
    keyDoc = want;
    if (keyDoc) keyDoc.addEventListener('keydown', onKey, true);
  }

  /* nav.js 가 만든 화면 요소 + 스튜디오 UI — 편집 대상이 아니다 */
  function isChrome(el) {
    if (!el || !el.closest) return false;
    try { return !!el.closest(Y.align.INJECTED); } catch (e) { return false; }
  }

  function liveLabel(el) {
    if (!el || !el.tagName) return '?';
    var out = el.tagName.toLowerCase();
    if (el.id) out += '#' + el.id;
    var c = el.getAttribute && el.getAttribute('class');
    if (c) {
      var parts = c.trim().split(/\s+/);
      for (var i = 0; i < parts.length; i++) {
        if (parts[i] && !Y.align.RUNTIME_CLASS[parts[i]]) { out += '.' + parts[i]; break; }
      }
    }
    return out;
  }

  function onMove(e) {
    if (!editing) return;
    var t = e.target;
    if (!t || t.nodeType !== 1 || U.isUi(t) || isChrome(t)) { setHover(null); return; }
    var near = Y.engine.nearestFromLive(t);
    if (!near) { setHover(t, '파일에 없는 요소'); return; }
    if (!near.self) { setHover(t, '데이터 영역 · ' + liveLabel(t)); return; }
    setHover(t, liveLabel(t));
  }
  function onOut(e) { if (!e.relatedTarget) setHover(null); }

  function onClick(e) {
    if (!editing) return;
    var t = e.target;
    if (!t || t.nodeType !== 1) return;
    if (U.isUi(t)) return;                       // 스튜디오 UI 는 그대로 동작
    if (isChrome(t)) return;                     // 헤더·탭·푸터 = 이동에 쓴다
    if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;   // 원래 동작(링크 이동 등)
    e.preventDefault();
    e.stopPropagation();
    var near = Y.engine.nearestFromLive(t);
    if (!near) {
      Y.toast('이 요소는 파일에서 찾을 수 없습니다. 사이트 스크립트가 만든 화면 요소입니다.', 'warn');
      return;
    }
    applySelection(near.index, t, near.self);
  }

  function onScroll() {
    if (rafPend) return;
    rafPend = true;
    var w = (bound && bound.win) || window;
    var raf = w.requestAnimationFrame || window.requestAnimationFrame;
    var run = function () { rafPend = false; recalcBoxes(); };
    if (raf) raf.call(w, run); else setTimeout(run, 16);
  }

  /* ── 하이라이트 레이어 (라이브 문서의 문서 좌표계) ── */
  var BOX_BASE = 'position:absolute;display:none;pointer-events:none;box-sizing:border-box;border-radius:3px;';
  var BOX_STYLE = {
    'ys-hl': BOX_BASE + 'outline:2px solid rgba(26,61,117,.62);background:rgba(26,61,117,.06)',
    'ys-selbox': BOX_BASE + 'outline:2px solid #12294f;background:rgba(18,41,79,.10)',
    'ys-tgt': BOX_BASE + 'outline:3px solid #c9a227;background:rgba(201,162,39,.16)'
  };
  var TAG_STYLE = 'position:absolute;left:0;top:-1.35rem;font:700 11px/1.25 "Apple SD Gothic Neo",' +
    '"Noto Sans KR","Pretendard",system-ui,sans-serif;background:#12294f;color:#fff;padding:2px 6px;' +
    'border-radius:4px;white-space:nowrap;max-width:70vw;overflow:hidden;text-overflow:ellipsis';

  function mkBox(doc, cls) {
    var b = doc.createElement('div');
    b.className = cls;
    b.setAttribute(UIA, '');
    b.style.cssText = BOX_STYLE[cls];
    var tag = doc.createElement('span');
    tag.className = 'ys-tag';
    tag.style.cssText = TAG_STYLE;
    b.appendChild(tag);
    return b;
  }

  function ensureLayer(doc) {
    doc = doc || Y.engine.liveDoc() || D;
    if (layer && layerDoc === doc && inDoc(layer)) return layer;
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    /* 문서가 바뀌면 이전 문서의 요소를 가리키던 박스 대상은 버린다 */
    hoverEl = null;
    tgtEl = null;
    if (tgtTimer) { clearTimeout(tgtTimer); tgtTimer = null; }
    layerDoc = doc;
    layer = doc.createElement('div');
    layer.className = 'ys-layer';
    layer.setAttribute(UIA, '');
    layer.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;z-index:' + (Y.config.Z - 5);
    (doc.body || doc.documentElement).appendChild(layer);
    hoverBox = mkBox(doc, 'ys-hl');
    selBox = mkBox(doc, 'ys-selbox');
    tgtBox = mkBox(doc, 'ys-tgt');
    layer.appendChild(hoverBox);
    layer.appendChild(selBox);
    layer.appendChild(tgtBox);
    ensureCss(doc);
    return layer;
  }

  /* box 와 layer 는 같은 문서에 있으므로 rect 차이만으로 문서 좌표가 나온다
     (scrollX/Y 보정과 동일하고 body 여백·position 지정에도 안전하다) */
  function place(box, target, label) {
    if (!box) return;
    if (!target || !inDoc(target) || !target.getBoundingClientRect) { box.style.display = 'none'; return; }
    var r = target.getBoundingClientRect();
    if (!r.width && !r.height) { box.style.display = 'none'; return; }
    var o = layer.getBoundingClientRect();
    box.style.display = 'block';
    box.style.left = (r.left - o.left) + 'px';
    box.style.top = (r.top - o.top) + 'px';
    box.style.width = r.width + 'px';
    box.style.height = r.height + 'px';
    var tag = box.firstChild;
    if (tag) {
      if (label == null) tag.style.display = 'none';
      else {
        tag.style.display = 'block';
        tag.textContent = label;
        /* 화면 위쪽에 붙은 요소는 이름표를 안쪽 아래로 */
        tag.style.top = r.top < 26 ? '2px' : '-1.35rem';
      }
    }
  }

  function setHover(el, label) {
    if (!el) {
      hoverEl = null;
      if (hoverBox) hoverBox.style.display = 'none';
      return;
    }
    ensureLayer(el.ownerDocument);
    hoverEl = el;
    if (sel && sel.live === el) { hoverBox.style.display = 'none'; return; }
    place(hoverBox, el, label);
  }
  function placeSel() {
    if (!sel || !sel.live) { if (selBox) selBox.style.display = 'none'; return; }
    ensureLayer(sel.live.ownerDocument);
    place(selBox, sel.live, liveLabel(sel.live) + (sel.self ? '' : ' · 데이터'));
  }
  function recalcBoxes() {
    if (!layer) return;
    if (editing && hoverEl) place(hoverBox, hoverEl, hoverBox.firstChild ? hoverBox.firstChild.textContent : null);
    else if (hoverBox) hoverBox.style.display = 'none';
    if (sel && sel.live) placeSel(); else if (selBox) selBox.style.display = 'none';
    if (tgtEl) place(tgtBox, tgtEl, null); else if (tgtBox) tgtBox.style.display = 'none';
  }

  /* ── 선택 ── */
  function applySelection(idx, clicked, isSelf) {
    var info = Y.engine.info(idx);
    if (!info) { Y.toast('선택한 요소를 원문에서 찾지 못했습니다.', 'warn'); return; }
    sel = {
      idx: idx,
      live: info.live || clicked || null,
      clicked: clicked || info.live || null,
      self: isSelf !== false
    };
    placeSel();
    if (curPanel === 'inspect') renderInspect(panels.inspect.host);
    else openPanel('inspect');
    Y.bus.emit('hud:select', { idx: idx, self: sel.self });
  }

  function clearSelection() {
    if (!sel) return;
    sel = null;
    if (selBox) selBox.style.display = 'none';
    if (curPanel === 'inspect') renderInspect(panels.inspect.host);
    Y.bus.emit('hud:select', { idx: null, self: false });
  }

  /* 구조가 바뀌면 인덱스가 밀린다 — 라이브 요소로 다시 찾는다 */
  function resolveSelection() {
    if (!sel) return;
    if (!sel.live) return;               // 화면에 짝이 없는 요소(nav.js 가 지운 .cta 등) — 그대로 둔다
    if (!inDoc(sel.live)) { clearSelection(); return; }
    var idx = Y.engine.indexFromLive(sel.live);
    if (idx == null) {
      var near = Y.engine.nearestFromLive(sel.live);
      if (!near) { clearSelection(); return; }
      idx = near.index;
      sel.self = near.self;
    }
    if (idx !== sel.idx) {
      sel.idx = idx;
      if (curPanel === 'inspect') renderInspect(panels.inspect.host);
    }
  }

  function revealIdx(idx) {
    var info = Y.engine.info(idx);
    var lv = info && info.live;
    if (!lv || !inDoc(lv)) { Y.toast('화면에서 그 요소를 찾을 수 없습니다.', 'warn'); return; }
    scrollTo(lv);
    ensureLayer(lv.ownerDocument);
    tgtEl = lv;
    place(tgtBox, lv, null);
    if (tgtTimer) clearTimeout(tgtTimer);
    tgtTimer = setTimeout(function () {
      tgtEl = null;
      if (tgtBox) tgtBox.style.display = 'none';
    }, 3000);
  }

  /* ══════════════════════════════════════════════════════════
     6. 인스펙터
     ══════════════════════════════════════════════════════════ */
  var ATTRS = ['href', 'src', 'alt', 'title', 'aria-label', 'id', 'class'];

  function attrRelevant(tag, name, attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, name)) return true;
    if (name === 'href') return /^(a|area|link)$/.test(tag);
    if (name === 'src') return /^(img|iframe|script|source|video|audio|embed|track)$/.test(tag);
    if (name === 'alt') return /^(img|area|input)$/.test(tag);
    return true;
  }

  function computedOf(idx, prop) {
    var info = Y.engine.info(idx);
    var lv = info && info.live;
    if (!lv || !lv.ownerDocument) return '';
    var w = lv.ownerDocument.defaultView || window;
    try { return w.getComputedStyle(lv)[prop] || ''; } catch (e) { return ''; }
  }
  /* 계산된 px 값. 브라우저는 항상 px 로 주지만, px 가 아니면 "모른다"로 다룬다 */
  function computedPx(idx, prop) {
    var v = computedOf(idx, prop);
    return /px\s*$/.test(v) ? parseFloat(v) : NaN;
  }
  function hex2(n) { n = Math.max(0, Math.min(255, Math.round(n))); return (n < 16 ? '0' : '') + n.toString(16); }
  function toHex(v) {
    v = String(v || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(v)) return ('#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toLowerCase();
    var m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(v);
    if (m) return '#' + hex2(+m[1]) + hex2(+m[2]) + hex2(+m[3]);
    return '';
  }

  function renderInspect(host) {
    if (!host) return;
    insp.host = host;
    insp.undoB = insp.redoB = insp.dirtyEl = null;
    host.innerHTML = '';

    if (!Y.engine.current()) {
      host.appendChild(hint('페이지 원문을 불러오는 중입니다. 잠시 뒤 다시 열어 주세요.'));
      return;
    }
    if (!Y.engine.mapped()) {
      host.appendChild(warnBox('이 페이지는 원문과 화면의 대응 검증에 실패해 직접 편집을 막았습니다.' +
        (Y.engine.reason() ? ' (' + Y.engine.reason() + ')' : '')));
      host.appendChild(hint('버전 관리에서 이전 시점으로 복원하거나, 파일을 손으로 고친 뒤 다시 시도하세요.'));
      return;
    }

    if (!sel) {
      host.appendChild(hint(editing
        ? '화면에서 고칠 요소를 클릭하세요. 헤더·탭바·푸터는 nav.js 가 만드는 부분이라 편집 대상이 아니며, 편집 모드에서도 페이지 이동에 그대로 쓸 수 있습니다. Alt+클릭 은 원래 동작(링크 이동)입니다.'
        : '「편집」 버튼(단축키 E)을 켜고 화면의 요소를 클릭하면 여기서 고칠 수 있습니다.'));
      host.appendChild(historySection());
      host.appendChild(shortcutNote());
      return;
    }

    var idx = sel.idx;
    var info = Y.engine.info(idx);
    if (!info) {
      host.appendChild(warnBox('선택한 요소를 원문에서 찾지 못했습니다. 다시 선택해 주세요.'));
      return;
    }

    host.appendChild(crumbBar(idx));
    host.appendChild(headBar(info));

    if (!sel.self) {
      host.appendChild(warnBox('이 부분은 사이트 스크립트(data.js)가 화면에서 만든 요소입니다. ' +
        'HTML 을 고쳐도 다음 로드에 사라지므로, 아래 데이터 편집으로 고쳐야 합니다.'));
      var slot = mk('div', 'ys-dm');
      host.appendChild(slot);
      if (Y.datamap && typeof Y.datamap.openFor === 'function') {
        try { Y.datamap.openFor(sel.clicked || sel.live, slot); }
        catch (e) { slot.appendChild(warnBox('데이터 편집기를 여는 중 오류가 발생했습니다.')); }
      } else {
        slot.appendChild(hint('데이터 편집(data.js) 모듈이 아직 준비되지 않았습니다.'));
      }
      host.appendChild(noteBox('아래 항목은 이 데이터를 담고 있는 "파일 소유" 컨테이너(' + info.label + ')를 고치는 칸입니다.'));
    }

    if (info.isLeaf) host.appendChild(textSection(idx, info));
    host.appendChild(attrSection(idx, info));
    host.appendChild(styleSection(idx));
    host.appendChild(actionSection(idx, info));
    host.appendChild(historySection());
    host.appendChild(shortcutNote());
  }

  function crumbBar(idx) {
    var wrap = mk('nav', 'ys-crumb');
    wrap.setAttribute('aria-label', '요소 경로');
    var list = Y.engine.breadcrumb(idx) || [];
    for (var i = 0; i < list.length; i++) {
      if (i) wrap.appendChild(mk('span', 'ys-crumb-s', '›'));
      var it = list[i];
      var b = mk('button', 'ys-crumb-b' + (it.idx === idx ? ' is-cur' : ''), it.label);
      b.title = it.label;
      (function (target) {
        b.addEventListener('click', function () { applySelection(target, null, true); revealIdx(target); });
      })(it.idx);
      wrap.appendChild(b);
    }
    return wrap;
  }

  function headBar(info) {
    var row = mk('div', 'ys-head');
    row.appendChild(mk('span', 'ys-chip', '<' + info.tag + '>'));
    row.appendChild(mk('span', 'ys-chip is-dim', 'eid ' + info.idx));
    if (info.runtime) row.appendChild(mk('span', 'ys-chip is-warn', info.runtime === 'count' ? '카운트업' : '홈 사전'));
    var eye = mk('button', 'ys-icon-b');
    eye.title = '화면에서 이 요소 보기';
    eye.setAttribute('aria-label', '화면에서 이 요소 보기');
    eye.appendChild(ico('eye'));
    eye.addEventListener('click', function () { revealIdx(info.idx); });
    row.appendChild(eye);
    return row;
  }

  /* ── 텍스트 ── */
  function textSection(idx, info) {
    var s = sect('텍스트');
    if (info.runtime === 'count') {
      s.appendChild(warnBox('이 숫자는 카운트업 애니메이션이 덮어씁니다 — 아래 data-count 속성을 고치세요.'));
      var ta0 = mk('textarea', 'ys-ta');
      ta0.value = info.text == null ? '' : info.text;
      ta0.disabled = true;
      s.appendChild(ta0);
      return s;
    }
    if (info.runtime === 'i18n') {
      s.appendChild(warnBox('이 문장은 홈 전용 한/영 사전(applyI18n)이 관리합니다. 화면에서 고치면 새로고침 때 되돌아갑니다.'));
      var ta1 = mk('textarea', 'ys-ta');
      ta1.value = info.text == null ? '' : info.text;
      ta1.disabled = true;
      s.appendChild(ta1);
      s.appendChild(hint('사전 항목(data-i18n="' + (info.attrs['data-i18n'] || '') + '")은 한/영 편집 패널에서 고칩니다.'));
      return s;
    }
    var ta = mk('textarea', 'ys-ta');
    ta.value = info.text == null ? '' : info.text;
    ta.rows = Math.min(10, Math.max(2, Math.ceil((ta.value.length || 1) / 34)));
    ta.spellcheck = false;
    var push = U.debounce(function () {
      if (Y.engine.setText(idx, ta.value)) refreshSoft();
    }, 300);
    ta.addEventListener('input', push);
    ta.addEventListener('blur', function () { Y.engine.setText(idx, ta.value); });
    s.appendChild(ta);
    return s;
  }

  /* ── 속성 ── */
  function attrSection(idx, info) {
    var s = sect('속성');
    var names = [], i;
    for (i = 0; i < ATTRS.length; i++) if (attrRelevant(info.tag, ATTRS[i], info.attrs)) names.push(ATTRS[i]);
    if (Object.prototype.hasOwnProperty.call(info.attrs, 'data-count')) names.push('data-count');

    for (i = 0; i < names.length; i++) s.appendChild(attrRow(idx, names[i], info));

    if (info.attrs.href) {
      var open = act('이 링크 열기', '', function () { openLink(info.attrs.href); });
      var row = mk('div', 'ys-row');
      row.appendChild(open);
      s.appendChild(row);
      s.appendChild(hint('편집 모드에서는 링크 클릭이 선택으로 바뀝니다. 이동은 이 버튼이나 Alt+클릭 으로 하세요.'));
    }
    return s;
  }

  function attrRow(idx, name, info) {
    var f = fieldRow(name);
    var cur = info.attrs[name];
    var inp = mk('input', 'ys-in');
    inp.type = 'text';
    inp.value = cur == null ? '' : cur;
    inp.spellcheck = false;
    inp.placeholder = cur == null ? '(없음)' : '';
    var apply = function () {
      var v = inp.value;
      /* alt 는 빈 값도 뜻이 있다(장식 이미지) — 나머지는 비우면 속성을 지운다 */
      var next = (v === '' && name !== 'alt') ? null : v;
      if (Y.engine.setAttr(idx, name, next)) refreshSoft();
    };
    inp.addEventListener('change', apply);
    inp.addEventListener('input', U.debounce(apply, 400));
    f.appendChild(inp);
    return f;
  }

  function openLink(href) {
    href = String(href || '').trim();
    if (!href || /^javascript:/i.test(href)) { Y.toast('열 수 없는 링크입니다.', 'warn'); return; }
    var doc = Y.engine.liveDoc() || D;
    if (href.charAt(0) === '#') {
      var t = null;
      try { t = doc.querySelector(href); } catch (e) {}
      if (t) { scrollTo(t); return; }
      Y.toast('그 위치를 찾을 수 없습니다.', 'warn');
      return;
    }
    var a = doc.createElement('a');
    a.href = href;
    var abs = a.href;
    var stop = busy('초안을 저장하고 이동합니다…');
    Promise.resolve(Y.engine.flush()).then(function () { stop(); location.href = abs; },
      function () { stop(); location.href = abs; });
  }

  /* ── 스타일 ── */
  function styleSection(idx) {
    var s = sect('스타일');
    s.appendChild(sizeRow(idx));
    s.appendChild(weightRow(idx));
    s.appendChild(lineRow(idx));
    s.appendChild(alignRow(idx));
    s.appendChild(colorRow(idx));
    s.appendChild(hint('칸을 비우면 인라인 스타일이 지워지고 원래 CSS 값으로 돌아갑니다.'));
    return s;
  }

  function sizeRow(idx) {
    var f = fieldRow('글자 크기');
    var g = mk('div', 'ys-num');
    var cur = Y.engine.getStyleProp(idx, 'font-size');
    var inp = mk('input', 'ys-in ys-num-i');
    inp.type = 'text';
    inp.value = /^[\d.]+px$/.test(cur) ? String(parseFloat(cur)) : (cur || '');
    var cpx = computedPx(idx, 'fontSize');
    inp.placeholder = isNaN(cpx) ? '예: 18' : Math.round(cpx) + ' (현재)';
    function write(v) {
      var val = String(v == null ? inp.value : v).trim();
      var next = val === '' ? '' : (/^[\d.]+$/.test(val) ? val + 'px' : val);
      if (Y.engine.setStyleProp(idx, 'font-size', next)) refreshSoft();
    }
    function bump(d) {
      var base = parseFloat(inp.value);
      if (isNaN(base)) base = computedPx(idx, 'fontSize');
      if (isNaN(base)) base = 16;
      base = Math.max(6, Math.min(200, Math.round(base) + d));
      inp.value = String(base);
      write(base);
    }
    var minus = mk('button', 'ys-num-b', '−');
    minus.title = '1px 작게';
    minus.addEventListener('click', function () { bump(-1); });
    var plus = mk('button', 'ys-num-b', '+');
    plus.title = '1px 크게';
    plus.addEventListener('click', function () { bump(1); });
    inp.addEventListener('change', function () { write(); });
    inp.addEventListener('input', U.debounce(function () { write(); }, 400));
    g.appendChild(minus); g.appendChild(inp); g.appendChild(plus);
    g.appendChild(mk('span', 'ys-unit', 'px'));
    f.appendChild(g);
    return f;
  }

  function weightRow(idx) {
    var f = fieldRow('굵기');
    var sl = mk('select', 'ys-select');
    var cur = Y.engine.getStyleProp(idx, 'font-weight');
    if (cur === 'bold') cur = '700';
    if (cur === 'normal') cur = '400';
    var vals = [['', '기본'], ['400', '400 보통'], ['500', '500'], ['600', '600'], ['700', '700 굵게'], ['800', '800 아주 굵게']];
    for (var i = 0; i < vals.length; i++) {
      var o = D.createElement('option');
      o.value = vals[i][0]; o.textContent = vals[i][1];
      if (String(cur || '') === vals[i][0]) o.selected = true;
      sl.appendChild(o);
    }
    sl.addEventListener('change', function () {
      if (Y.engine.setStyleProp(idx, 'font-weight', sl.value)) refreshSoft();
    });
    f.appendChild(sl);
    return f;
  }

  function lineRow(idx) {
    var f = fieldRow('행간(배수)');
    var inp = mk('input', 'ys-in');
    inp.type = 'text';
    inp.value = Y.engine.getStyleProp(idx, 'line-height') || '';
    var cs = computedPx(idx, 'lineHeight'), fs = computedPx(idx, 'fontSize');
    inp.placeholder = (cs && fs) ? (Math.round((cs / fs) * 100) / 100) + ' (현재)' : '예: 1.6';
    var apply = function () {
      if (Y.engine.setStyleProp(idx, 'line-height', inp.value.trim())) refreshSoft();
    };
    inp.addEventListener('change', apply);
    inp.addEventListener('input', U.debounce(apply, 400));
    f.appendChild(inp);
    return f;
  }

  function alignRow(idx) {
    var f = fieldRow('정렬');
    var g = mk('div', 'ys-seg');
    var cur = Y.engine.getStyleProp(idx, 'text-align');
    var vals = [['', '기본'], ['left', '왼쪽'], ['center', '가운데'], ['right', '오른쪽']];
    var made = [];
    for (var i = 0; i < vals.length; i++) {
      (function (v, label) {
        var b = mk('button', 'ys-seg-b' + (String(cur || '') === v ? ' is-on' : ''), label);
        b.addEventListener('click', function () {
          Y.engine.setStyleProp(idx, 'text-align', v);
          for (var k = 0; k < made.length; k++) made[k].classList.remove('is-on');
          b.classList.add('is-on');
          refreshSoft();
        });
        made.push(b);
        g.appendChild(b);
      })(vals[i][0], vals[i][1]);
    }
    f.appendChild(g);
    return f;
  }

  function colorRow(idx) {
    var f = fieldRow('글자 색');
    var g = mk('div', 'ys-num');
    var cur = Y.engine.getStyleProp(idx, 'color');
    var ci = mk('input', 'ys-color');
    ci.type = 'color';
    ci.value = toHex(cur) || toHex(computedOf(idx, 'color')) || '#12294f';
    var tx = mk('input', 'ys-in ys-hex');
    tx.type = 'text';
    tx.value = cur || '';
    tx.placeholder = toHex(computedOf(idx, 'color')) || '#12294f';
    ci.addEventListener('input', U.debounce(function () {
      tx.value = ci.value;
      if (Y.engine.setStyleProp(idx, 'color', ci.value)) refreshSoft();
    }, 120));
    var apply = function () {
      var v = tx.value.trim();
      if (Y.engine.setStyleProp(idx, 'color', v)) refreshSoft();
      if (toHex(v)) ci.value = toHex(v);
    };
    tx.addEventListener('change', apply);
    var clr = act('지우기', '', function () {
      tx.value = '';
      Y.engine.setStyleProp(idx, 'color', '');
      refreshSoft();
    });
    g.appendChild(ci); g.appendChild(tx); g.appendChild(clr);
    f.appendChild(g);
    return f;
  }

  /* ── 동작 ── */
  function actionSection(idx, info) {
    var s = sect('동작');
    var row = mk('div', 'ys-row');
    row.appendChild(act('위로', '', function () {
      var lv = sel && sel.live;
      if (Y.engine.moveEl(idx, -1)) { afterStructural(lv); Y.toast('위로 옮겼습니다.'); }
      else Y.toast('더 올릴 수 없습니다.', 'warn');
    }));
    row.appendChild(act('아래로', '', function () {
      var lv = sel && sel.live;
      if (Y.engine.moveEl(idx, 1)) { afterStructural(lv); Y.toast('아래로 옮겼습니다.'); }
      else Y.toast('더 내릴 수 없습니다.', 'warn');
    }));
    row.appendChild(act('복제', '', function () {
      if (Y.engine.duplicateEl(idx)) { Y.toast('바로 아래에 복제했습니다.'); afterStructural(sel && sel.live); }
      else Y.toast('복제할 수 없는 요소입니다.', 'warn');
    }));
    row.appendChild(act('삭제', 'is-danger', function () {
      confirmBox('<' + info.tag + '> ' + (info.label || '') + ' 요소를 삭제할까요? 되돌리기(Ctrl+Z)로 취소할 수 있습니다.')
        .then(function (ok) {
          if (!ok) return;
          if (Y.engine.removeEl(idx)) { clearSelection(); Y.toast('삭제했습니다.'); }
          else Y.toast('이 요소는 삭제할 수 없습니다.', 'warn');
        });
    }));
    s.appendChild(row);
    return s;
  }

  function afterStructural(liveEl) {
    if (liveEl && inDoc(liveEl)) {
      var i = Y.engine.indexFromLive(liveEl);
      if (i != null) { sel.idx = i; sel.live = liveEl; }
    }
    if (curPanel === 'inspect') renderInspect(panels.inspect.host);
    recalcBoxes();
  }

  function historySection() {
    var s = sect('되돌리기');
    var row = mk('div', 'ys-row');
    insp.undoB = act('되돌리기', '', function () { doUndo(); });
    insp.redoB = act('다시 실행', '', function () { doRedo(); });
    insp.undoB.title = 'Ctrl+Z';
    insp.redoB.title = 'Ctrl+Y';
    insp.undoB.disabled = !Y.engine.canUndo();
    insp.redoB.disabled = !Y.engine.canRedo();
    row.appendChild(insp.undoB);
    row.appendChild(insp.redoB);
    row.appendChild(act('초안 저장', '', function () { saveNow(); }));
    s.appendChild(row);
    insp.dirtyEl = mk('p', 'ys-note', '');
    s.appendChild(insp.dirtyEl);
    var row2 = mk('div', 'ys-row');
    row2.appendChild(act('이 페이지 초안 버리기', 'is-danger', function () {
      confirmBox('이 페이지의 초안을 버리고 게시된 원문으로 되돌릴까요? 되돌릴 수 없습니다.').then(function (ok) {
        if (!ok) return;
        Y.engine.discardDraft().then(function () {
          clearSelection();
          Y.toast('초안을 버렸습니다.');
          refreshDrafts();
        });
      });
    }));
    s.appendChild(row2);
    refreshSoft();
    return s;
  }

  function shortcutNote() {
    var p = mk('p', 'ys-keys',
      'E 편집 · Ctrl+S 초안 저장 · Ctrl+Shift+P 게시 · Ctrl+Z / Ctrl+Y 되돌리기 · Esc 선택 해제');
    return p;
  }

  function refreshSoft() {
    if (insp.undoB) insp.undoB.disabled = !Y.engine.canUndo();
    if (insp.redoB) insp.redoB.disabled = !Y.engine.canRedo();
    if (insp.dirtyEl) {
      insp.dirtyEl.textContent = Y.engine.dirty()
        ? '이 페이지에 저장되지 않은 변경이 있습니다 (초안은 자동 저장됩니다).'
        : '변경 없음 — 게시된 원문과 같습니다.';
    }
  }

  function doUndo() {
    if (!Y.engine.undo()) { Y.toast('더 되돌릴 수 없습니다.', 'warn'); return; }
    Y.toast('되돌렸습니다.');
  }
  function doRedo() {
    if (!Y.engine.redo()) { Y.toast('다시 실행할 것이 없습니다.', 'warn'); return; }
    Y.toast('다시 실행했습니다.');
  }
  function saveNow() {
    var stop = busy('초안 저장 중…');
    Promise.resolve(Y.engine.flush()).then(function () {
      stop(); Y.toast('초안을 저장했습니다.'); refreshDrafts();
    }, function () {
      stop(); Y.toast('초안 저장에 실패했습니다.', 'error');
    });
  }

  /* ══════════════════════════════════════════════════════════
     7. 버스 반응
     ══════════════════════════════════════════════════════════ */
  function onBufferOpen(d) {
    setStatus({ page: (d && d.path) || U.pagePath() });
    clearSelection();
    refreshDrafts();
    if (curPanel === 'inspect') renderInspect(panels.inspect.host);
  }

  function onBufferChange(d) {
    refreshDraftsSoon();
    var lbl = d && d.label;
    if (d && d.structural) { resolveSelection(); recalcBoxes(); refreshSoft(); return; }
    if (!focusInPanel() && (lbl === 'undo' || lbl === 'redo' || lbl === 'discard' || lbl === 'published' || lbl === 'raw')) {
      renderPanelIfOpen('inspect');
    }
    refreshSoft();
    recalcBoxes();
    renderStatus();
  }

  /* ══════════════════════════════════════════════════════════
     8. 단축키
     ══════════════════════════════════════════════════════════ */
  function onKey(e) {
    if (!mounted) return;
    var t = e.target || {};
    var tag = (t.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable === true;
    var meta = e.ctrlKey || e.metaKey;
    var key = String(e.key || '').toLowerCase();
    var code = e.code || '';

    if (key === 'escape' || code === 'Escape') {
      if (modalStack.length) { modalStack[modalStack.length - 1].close(); e.preventDefault(); return; }
      if (typing && t.blur) { t.blur(); e.preventDefault(); return; }
      if (sel) { clearSelection(); e.preventDefault(); return; }
      if (curPanel) { closePanel(); e.preventDefault(); }
      return;
    }
    if (meta && (key === 's' || code === 'KeyS') && !e.shiftKey) { e.preventDefault(); saveNow(); return; }
    if (meta && e.shiftKey && (key === 'p' || code === 'KeyP')) { e.preventDefault(); publish(); return; }
    if (meta && (key === 'z' || code === 'KeyZ')) {
      if (typing) return;                        // 입력칸 안에서는 브라우저 되돌리기를 쓴다
      e.preventDefault();
      if (e.shiftKey) doRedo(); else doUndo();
      return;
    }
    if (meta && (key === 'y' || code === 'KeyY')) {
      if (typing) return;
      e.preventDefault(); doRedo(); return;
    }
    if (typing || meta || e.altKey) return;
    if (key === 'e' || code === 'KeyE') { e.preventDefault(); setEditing(!editing); }
  }

  /* ══════════════════════════════════════════════════════════
     9. 게시 — 초안 전체를 1커밋으로
     ══════════════════════════════════════════════════════════ */
  function publish() {
    if (!mounted) mount();
    if (publishing) { Y.toast('이미 게시를 진행하고 있습니다.', 'warn'); return; }
    var stop = busy('초안을 모으는 중…');
    Promise.resolve(Y.engine.flush()).then(function () {
      return Y.store.all('drafts');
    }).then(function (list) {
      stop();
      var recs = [], i;
      list = list || [];
      for (i = 0; i < list.length; i++) {
        var d = list[i];
        if (!d || typeof d.src !== 'string' || !d.path) continue;
        if (d.src === d.origSrc) continue;
        recs.push(d);
      }
      recs.sort(function (a, b) { return a.path < b.path ? -1 : 1; });
      if (!recs.length) { Y.toast('게시할 변경이 없습니다.'); return; }
      askPublish(recs);
    }, function (err) {
      stop();
      Y.toast((err && err.message) || '초안을 읽지 못했습니다.', 'error');
    });
  }

  function askPublish(recs) {
    var body = mk('div', 'ys-pub');
    body.appendChild(mk('p', 'ys-modal-p',
      '초안 ' + recs.length + '개 파일을 커밋 1개로 게시합니다. 배포가 끝나면 사이트에 바로 반영됩니다.'));
    var listEl = mk('div', 'ys-flist');
    for (var i = 0; i < recs.length; i++) {
      var d = recs[i];
      var row = mk('div', 'ys-frow');
      row.appendChild(mk('span', 'ys-frow-p', d.path));
      var dl = (d.src.length - (d.origSrc ? d.origSrc.length : 0));
      row.appendChild(mk('span', 'ys-frow-d', (dl > 0 ? '+' : '') + dl + '자'));
      var lb = d.src.split('\n').length, la = (d.origSrc || '').split('\n').length;
      if (lb !== la) row.appendChild(mk('span', 'ys-frow-d', la + '줄 → ' + lb + '줄'));
      row.appendChild(mk('span', 'ys-frow-a', (d.author || '') + (d.ts ? ' · ' + U.ago(d.ts) : '')));
      listEl.appendChild(row);
    }
    body.appendChild(listEl);

    var f = fieldRow('커밋 메시지');
    var msg = mk('input', 'ys-in');
    msg.type = 'text';
    msg.placeholder = '비우면 자동으로 만듭니다';
    f.appendChild(msg);
    body.appendChild(f);
    body.appendChild(noteBox('게시는 GitHub 커밋 1개로 기록됩니다. 문제가 생기면 버전 관리에서 이전 시점으로 되돌릴 수 있습니다.'));

    modal({
      title: '게시', wide: true, body: body, okLabel: recs.length + '개 파일 게시', cancelLabel: '취소',
      onOk: function () { doCommit(recs, msg.value.trim()); }
    });
  }

  function doCommit(recs, message) {
    publishing = true;
    var files = [], i;
    for (i = 0; i < recs.length; i++) files.push({ path: recs[i].path, content: recs[i].src });
    var stop = busy('게시 중… ' + files.length + '개 파일');
    Y.net.commit({
      message: message || undefined,
      files: files,
      author: Y.session.author(),
      baseSha: Y.engine.headSha() || undefined
    }).then(function (r) {
      stop();
      publishing = false;
      var sha = (r && r.headSha) || null;
      var url = r && r.commit && (r.commit.html_url || r.commit.url);
      if (sha) Y.engine.setHeadSha(sha);
      var cur = Y.engine.path();
      var chain = Promise.resolve();
      for (var k = 0; k < files.length; k++) {
        (function (p) {
          chain = chain.then(function () {
            return p === cur ? Y.engine.markPublished(sha) : Y.store.del('drafts', p);
          });
        })(files[k].path);
      }
      chain.then(function () {
        return Y.store.put('meta', {
          key: 'lastPublish', ts: Date.now(), sha: sha,
          files: files.length, author: Y.session.author()
        });
      }).then(function () {
        setStatus({ saved: U.fmtTime(Date.now()) });
        refreshDrafts();
        hideBanner();
        var t = Y.toast('게시 완료 — ' + files.length + '개 파일', null, 9000);
        if (url && t) {
          t.style.pointerEvents = 'auto';
          var a = D.createElement('a');
          a.className = 'ys-toast-link';
          a.href = url; a.target = '_blank'; a.rel = 'noopener';
          a.textContent = '커밋 보기';
          a.style.cssText = 'color:#fff;text-decoration:underline;margin-left:.5rem';
          t.appendChild(a);
        }
        Y.bus.emit('publish:done', { sha: sha, url: url, files: files.length });
      });
    }, function (err) {
      stop();
      publishing = false;
      if (err && err.status === 409) { conflictModal(err); return; }
      Y.toast((err && err.message) || '게시에 실패했습니다.', 'error');
    });
  }

  function conflictModal(err) {
    var body = mk('div', '');
    body.appendChild(mk('p', 'ys-modal-p', '다른 사람이 먼저 게시했습니다. 새로고침 후 다시 시도하세요.'));
    body.appendChild(noteBox('초안은 그대로 남아 있습니다. 새로고침하면 최신 원문을 기준으로 다시 게시할 수 있습니다.' +
      ((err && err.data && err.data.headSha) ? ' (최신 커밋 ' + String(err.data.headSha).slice(0, 7) + ')' : '')));
    modal({
      title: '게시 충돌', body: body, okLabel: '새로고침', cancelLabel: '닫기',
      onOk: function () { reloadSafe(); }
    });
  }

  /* ══════════════════════════════════════════════════════════
     10. 공개 계약
     ══════════════════════════════════════════════════════════ */
  Y.hud = {
    mount: mount,
    registerPanel: registerPanel,
    openPanel: openPanel,
    closePanel: closePanel,
    isOpen: isOpen,
    setStatus: setStatus,
    selection: function () { return sel ? sel.idx : null; },
    select: function (idx) { applySelection(idx, null, true); },
    clearSelection: clearSelection,
    revealIdx: revealIdx,
    modal: modal,
    confirm: confirmBox,
    busy: busy,
    editing: function () { return editing; },
    setEditing: setEditing,
    publish: publish,
    /* 부가 — 다른 모듈이 쓰면 편한 것들 */
    root: function () { return root; },
    refresh: function () { refreshDrafts(); renderStatus(); syncButtons(); recalcBoxes(); },
    selectionInfo: function () { return sel ? { idx: sel.idx, live: sel.live, clicked: sel.clicked, self: sel.self } : null; }
  };
})();
