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
  var pubFootEl = null, pubFootCntEl = null, pubBarEl = null;
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
    post: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.4"/><path d="M8 9.2h8M8 13h8M8 16.4h4.6"/></svg>',
    photo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.4"/><circle cx="9.2" cy="9.4" r="1.6"/><path d="M4.6 16.6l4.4-4.2 3.4 3.2 3-2.8 4 3.8"/></svg>',
    git: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="6" r="2.2"/><circle cx="7" cy="18" r="2.2"/><circle cx="17" cy="8.5" r="2.2"/><path d="M7 8.2v7.6"/><path d="M17 10.7c0 3.2-3.6 3.8-10 4.6"/></svg>',
    out: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 8V5.5H5v13h9.5V16"/><path d="M10 12h10.4"/><path d="M17.2 8.6l3.4 3.4-3.4 3.4"/></svg>',
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
  /* 대부분의 사용자는 볼 일이 없는 안내 — 눈에 덜 띄게 */
  function advBox(txt) { return mk('p', 'ys-adv', txt); }

  /* ── 사람 말 이름표 ──
     쓰는 사람은 학과 조교다. 화면에 태그명·CSS 선택자·내부 번호를 내보내지 않는다. */
  var ROLE_KO = {
    html: '문서', body: '본문', main: '본문', header: '머리말', footer: '꼬리말', nav: '메뉴',
    section: '구역', article: '글', aside: '곁단', div: '영역', span: '글자',
    h1: '큰 제목', h2: '제목', h3: '소제목', h4: '소제목', h5: '소제목', h6: '소제목',
    p: '문단', a: '링크', ul: '목록', ol: '번호 목록', li: '목록 항목',
    table: '표', thead: '표 머리', tbody: '표 몸통', tr: '표 줄', td: '표 칸', th: '표 제목칸',
    caption: '표 설명', img: '이미지', figure: '그림', figcaption: '그림 설명',
    button: '버튼', form: '입력폼', input: '입력칸', label: '입력 이름',
    select: '선택칸', textarea: '긴 입력칸', option: '선택지',
    strong: '강조 글자', b: '굵은 글자', em: '기울임 글자', i: '기울임 글자',
    small: '작은 글자', mark: '형광 글자', time: '날짜', code: '코드',
    dl: '설명 목록', dt: '항목 이름', dd: '항목 설명', blockquote: '인용', hr: '구분선'
  };
  function roleKo(tag) { return ROLE_KO[String(tag).toLowerCase()] || tag; }

  var ATTR_KO = {
    href: '링크 주소', src: '이미지 주소', alt: '대체 설명', title: '마우스 올렸을 때 설명',
    'aria-label': '읽어 주는 이름', id: '고유 이름(고급)', class: '스타일 이름(고급)',
    'data-count': '최종 숫자'
  };
  function attrKo(name) { return ATTR_KO[name] || name; }
  var DEV_ATTRS = { id: 1, 'class': 1 };
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
    { key: 'post', label: '글등록', icon: 'post', kind: 'panel', panel: 'post', name: '공지·소식 등록' },
    { key: 'photos', label: '사진', icon: 'photo', kind: 'panel', panel: 'photos', name: '머리 사진' },
    { key: 'versions', label: '버전', icon: 'hist', kind: 'panel', panel: 'versions', name: '버전 관리' },
    { key: 'ai', label: 'AI', icon: 'ai', kind: 'panel', panel: 'ai', name: 'AI 수정' },
    { key: 'mobile', label: '모바일', icon: 'mob', kind: 'mobile', name: '모바일 모드' },
    { key: 'i18n', label: '한·영', icon: 'lang', kind: 'panel', panel: 'lang', name: '한/영 편집' },
    /* 게시 버튼은 패널 하단 고정 푸터로 옮겼다(글을 쓰는 자리에서 바로 게시).
       빈 자리에는 게시가 어느 저장소로 커밋되는지 보는 「깃헙 관리」를 둔다. */
    { key: 'github', label: '깃헙', icon: 'git', kind: 'panel', panel: 'github', name: '깃헙 관리' },
    { key: 'exit', label: '종료', icon: 'out', kind: 'exit', name: '편집 종료' }
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

    /* 패널 하단 고정 게시 버튼 — 글을 쓰는 사이드바 그 자리에서 게시까지 끝낸다.
       (예전에는 화면 오른쪽 버튼 스택 맨 아래라 등록 버튼과 헷갈렸다.) */
    var foot = mk('div', 'ys-panel-foot');
    pubFootEl = mk('button', 'ys-pubfoot');
    pubFootEl.title = '게시 (Ctrl+Shift+P)';
    pubFootEl.appendChild(ico('pub'));
    pubFootEl.appendChild(mk('span', 'ys-pubfoot-t', '게시'));
    pubFootCntEl = mk('span', 'ys-pubfoot-c', '');
    pubFootEl.appendChild(pubFootCntEl);
    pubFootEl.addEventListener('click', function () { publish(); });
    foot.appendChild(pubFootEl);
    panelEl.appendChild(foot);
    root.appendChild(panelEl);

    /* 화면 하단 가운데 게시 버튼 — 패널 없이 화면에서 바로 고친 요소·문구도
       「게시」를 눌러야 나간다는 걸 버튼 자체로 알린다. 미게시 초안이 있고
       패널이 닫혀 있을 때만 뜬다(패널이 열리면 패널 푸터가 그 역할). */
    pubBarEl = mk('button', 'ys-pubbar');
    pubBarEl.title = '게시 (Ctrl+Shift+P)';
    pubBarEl.addEventListener('click', function () { publish(); });
    root.appendChild(pubBarEl);

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
    /* 모바일 모드는 Esc 나 프레임 안 「닫기」 로도 꺼진다. 그때도 버튼 불이 꺼져야 한다 —
       버튼을 눌러 끈 경우에만 맞추면 상태 표시와 버튼이 어긋난다. */
    Y.bus.on('mobile:change', function () { syncButtons(); });

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
    if (def.kind === 'exit') { exitStudio(); return; }
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
        if (m) on = typeof m.isOpen === 'function' ? !!m.isOpen()
          : (typeof m.active === 'function' ? !!m.active() : !!m.active);
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
  /* 값을 주면 그것을, 안 주면 저장된 언어를 표기로 바꾼다.
     i18n-edit 는 'ko'/'en' 소문자를 넘기므로 여기서 표기를 통일해야
     화면마다 KO / ko 가 섞이지 않는다. */
  function langLabel(v) {
    if (v == null || v === '') {
      try { v = localStorage.getItem('ysme-lang') || 'ko'; } catch (e) { v = 'ko'; }
    }
    return String(v).toLowerCase() === 'en' ? 'EN' : 'KO';
  }

  function setStatus(patch) {
    if (patch) for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) status[k] = patch[k];
    renderStatus();
  }

  function renderStatus() {
    if (pubFootCntEl) {
      pubFootCntEl.textContent = status.drafts ? '미게시 초안 ' + status.drafts + '건' : '변경 없음';
      pubFootEl.classList.toggle('is-dirty', !!status.drafts);
    }
    if (pubBarEl) {
      var showBar = !!status.drafts && !curPanel;
      if (showBar) {
        pubBarEl.innerHTML = '';
        pubBarEl.appendChild(ico('pub'));
        pubBarEl.appendChild(mk('span', null, '게시'));
        pubBarEl.appendChild(mk('span', 'ys-pubbar-c', '미게시 초안 ' + status.drafts + '건'));
      }
      pubBarEl.classList.toggle('is-on', showBar);
    }
    if (!statusEl) return;
    statusEl.innerHTML = '';
    var items = [
      { t: status.page || U.pagePath(), c: 'is-page' },
      { t: status.drafts ? '미저장 ' + status.drafts + '건' : '초안 없음', c: status.drafts ? 'is-dirty' : '' },
      { t: status.author || Y.session.author(), c: '' },
      { t: (status.mode || '보기') + ' 모드', c: editing ? 'is-edit' : '' },
      { t: langLabel(status.lang), c: '' }
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
    renderStatus();                      // 하단 게시 버튼 — 패널 푸터와 겹치지 않게
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
    renderStatus();
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
      /* 진행 표시도 쪽 옮김 로딩 판과 같은 마스코트 독수리(부품 그림)의 축소판.
         경로는 studio.css 위치에서 구한다 — 하위 경로 문서(하니스 등)에서도 맞다. */
      var sp = mk('span', 'ys-spin');
      var eagleBase = cssHref().replace(/studio\/studio\.css.*$/, 'loader/');
      sp.innerHTML = ['tail', 'lw', 'rw', 'body', 'talons', 'head'].map(function (n) {
        var cls = n === 'lw' ? ' class="w-l"' : n === 'rw' ? ' class="w-r"' : '';
        return '<img' + cls + ' src="' + eagleBase + 'e-' + n + '.png?v=1" alt="">';
      }).join('');
      busyEl.appendChild(sp);
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

  /**
   * 목록 컨테이너 **안쪽**은 런타임이 innerHTML 로 통째로 다시 그린다.
   * 그런데 파일에도 같은 클래스의 자리표시자가 들어 있어(예: #newsGrid 의
   * `<a class="nrow">학부 뉴스 보기</a>`) 정렬기가 실제 목록의 첫 항목을 그 자리표시자와
   * 짝지어 버린다. 그대로 두면 "파일 소유"로 보여 편집을 허용하는데, 고쳐 봐야
   * 아무도 못 보는 자리표시자만 바뀌고 다음 로드에 사라진다.
   * → 컨테이너 자신이 아닌 그 안쪽 요소는 무조건 목록(데이터) 편집으로 보낸다.
   */
  function listBoxOf(liveEl) {
    if (!liveEl || !Y.datamap || !Y.datamap.ownerOf) return null;
    var o = Y.datamap.ownerOf(liveEl);
    if (!o) return null;
    var d = liveEl.ownerDocument;
    var box = d ? d.getElementById(o.containerId) : null;
    return (box && box !== liveEl) ? box : null;   // 컨테이너 자신은 파일 소유가 맞다
  }

  function applySelection(idx, clicked, isSelf, keepPanel) {
    var self = isSelf !== false;
    var box = listBoxOf(clicked || (Y.engine.info(idx) || {}).live);
    if (box) {
      /* 목록 안쪽이다. HTML 편집 칸이 자리표시자를 겨냥하지 않도록 대상을 목록 상자로 옮긴다
         — 그래야 「바깥 틀을 고치는 칸」이라는 안내가 실제와 맞는다. */
      self = false;
      var bi = Y.engine.indexFromLive(box);
      if (bi != null) idx = bi;
    }
    var info = Y.engine.info(idx);
    if (!info) { Y.toast('선택한 요소를 원문에서 찾지 못했습니다.', 'warn'); return; }
    sel = {
      idx: idx,
      live: info.live || clicked || null,
      clicked: clicked || info.live || null,
      self: self
    };
    placeSel();
    /* keepPanel — 「이동」처럼 보고 있던 목록을 잃으면 안 되는 경우에는 패널을 바꾸지 않는다 */
    if (curPanel === 'inspect') renderInspect(panels.inspect.host);
    else if (!keepPanel) openPanel('inspect');
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

  /**
   * 그 요소로 데려간다.
   * opts.select — 선택까지 한다(테두리가 남아 무엇을 고칠지 눈에 계속 보인다).
   *               보고 있던 패널은 그대로 둔다 — 「이동」 뒤에 곳 목록이 사라지면 안 된다.
   * opts.label  — 표시 상자에 붙일 이름표(무엇을 찾았는지 화면에서 바로 읽히게).
   * opts.hold   — 표시 상자를 몇 ms 띄울지.
   *
   * 오른쪽 패널이 화면의 한 자락을 덮으므로, 화면 한가운데가 아니라 **패널을 뺀
   * 나머지 폭의 가운데**로 올린다. 그러지 않으면 "이동했는데 안 보인다"가 된다.
   */
  /* 다른 패널에서 「이동」으로 건너왔을 때 돌아갈 길.
     idx 를 함께 기억해, **그 요소를 골랐을 때만** 돌아가기 줄을 보여 준다
     (다른 요소를 클릭했는데 엉뚱한 목록으로 돌아가는 버튼이 남아 있으면 안 된다). */
  var backLink = null;
  function setReturn(rec) {
    backLink = (rec && rec.label && typeof rec.fn === 'function') ? rec : null;
  }
  function backLinkFor(idx) {
    if (!backLink) return null;
    if (backLink.idx != null && backLink.idx !== idx) return null;
    return backLink;
  }

  function revealIdx(idx, opts) {
    opts = opts || {};
    var info = Y.engine.info(idx);
    var lv = info && info.live;
    if (!lv || !inDoc(lv)) { Y.toast('화면에서 그 요소를 찾을 수 없습니다.', 'warn'); return false; }

    scrollTo(lv);
    /* opts.arm — **위치만** 보여 준다. 편집 모드는 켜 두어, 사람이 그 자리를
       클릭하면 그때 편집 패널이 열리게 한다. 보고 있던 목록은 지킨다.
       (패널을 곧바로 갈아 끼우면 무엇을 고르러 왔는지 맥락이 끊긴다) */
    if (opts.arm) {
      setReturn(opts.back ? { idx: idx, label: opts.back.label, fn: opts.back.fn } : null);
      if (!editing) setEditing(true);
      applySelection(idx, null, true, true);           // 패널은 그대로
    } else if (opts.select) {
      applySelection(idx, null, true, true);
    }

    ensureLayer(lv.ownerDocument);
    tgtEl = lv;
    place(tgtBox, lv, opts.label == null ? null : opts.label);

    /* 애니메이션을 처음부터 다시 — 연달아 누르면 같은 자리에서도 한 번 더 번쩍여야 한다 */
    if (tgtBox) {
      tgtBox.classList.remove('is-hit');
      void tgtBox.offsetWidth;
      tgtBox.classList.add('is-hit');
    }
    if (tgtTimer) clearTimeout(tgtTimer);
    tgtTimer = setTimeout(function () {
      tgtEl = null;
      if (tgtBox) { tgtBox.style.display = 'none'; tgtBox.classList.remove('is-hit'); }
    }, opts.hold || 6000);
    return true;
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

    /* 「이동」으로 찍어 둔 그 요소를 열었을 때만 — 돌아갈 길을 맨 위에 둔다.
       고치고 나서 목록을 다시 찾아 헤매게 하면 안 된다. */
    var bl = backLinkFor(idx);
    if (bl) {
      var back = mk('div', 'ys-insp-back');
      back.appendChild(act('← ' + bl.label, '', function () {
        var fn = bl.fn;
        setReturn(null);
        if (typeof fn === 'function') fn();
      }));
      host.appendChild(back);
    }

    host.appendChild(crumbBar(idx));
    host.appendChild(headBar(info));

    if (!sel.self) {
      /* 오류가 아니라 정상 경로다 — 목록에서 온 글이므로 그 글의 원본을 바로 열어 준다.
         빨간 경고로 보여 주면 조교 사용자는 실패한 줄 안다. */
      var owner = (Y.datamap && Y.datamap.ownerOf) ? Y.datamap.ownerOf(sel.clicked || sel.live) : null;
      var areaName = (owner && owner.human) || '목록';
      host.appendChild(noteBox('여기는 ' + areaName + '에서 자동으로 그려지는 자리입니다. ' +
        '아래에서 이 글의 내용을 바로 고칠 수 있습니다.'));
      var slot = mk('div', 'ys-dm');
      host.appendChild(slot);
      if (Y.datamap && typeof Y.datamap.openFor === 'function') {
        try { Y.datamap.openFor(sel.clicked || sel.live, slot); }
        catch (e) { slot.appendChild(warnBox('목록 편집기를 여는 중 문제가 생겼습니다. 새로고침 후 다시 시도해 주세요.')); }
      } else {
        slot.appendChild(hint('목록 편집 기능을 준비하는 중입니다. 잠시 후 다시 눌러 주세요.'));
      }
      host.appendChild(advBox('아래 칸은 이 목록을 담고 있는 바깥 틀을 고치는 곳입니다. ' +
        '글 내용이 아니라 배치·여백을 바꿀 때만 쓰세요.'));
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
    wrap.setAttribute('aria-label', '선택한 곳의 위치');
    var list = Y.engine.breadcrumb(idx) || [];

    /* `div#ntList.blist` 같은 CSS 선택자 대신 사람 말 이름을 쓴다.
       아는 목록(#ntList 등)이면 그 목록 이름을 그대로 보여 준다. */
    function labelOf(raw) {
      var m = /^([A-Za-z0-9]+)(?:#([^.\s]+))?/.exec(String(raw)) || [];
      var id = m[2] || '';
      if (id && Y.datamap && Y.datamap.MAP && Y.datamap.MAP[id] && Y.datamap.MAP[id].human) {
        return Y.datamap.MAP[id].human;
      }
      return roleKo(m[1] || raw);
    }

    var prev = null;
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var name = labelOf(it.label);
      /* '영역 › 영역 › 영역' 처럼 같은 이름이 이어지면 중간을 접는다 — 마지막은 항상 남긴다 */
      if (name === prev && it.idx !== idx) continue;
      prev = name;
      if (wrap.childNodes.length) wrap.appendChild(mk('span', 'ys-crumb-s', '›'));
      var b = mk('button', 'ys-crumb-b' + (it.idx === idx ? ' is-cur' : ''), name);
      b.title = it.label;                       // 개발자는 여기서 원래 선택자를 볼 수 있다
      (function (target) {
        b.addEventListener('click', function () { applySelection(target, null, true); revealIdx(target); });
      })(it.idx);
      wrap.appendChild(b);
    }
    return wrap;
  }

  function headBar(info) {
    var row = mk('div', 'ys-head');
    /* 태그명과 내부 번호는 개발자 정보다 — 이름표는 사람 말로, 원래 값은 툴팁에 둔다 */
    var chip = mk('span', 'ys-chip', roleKo(info.tag));
    chip.title = '<' + info.tag + '> · 내부 번호 ' + info.idx;
    row.appendChild(chip);
    if (info.runtime) {
      row.appendChild(mk('span', 'ys-chip is-warn',
        info.runtime === 'count' ? '세어 올라가는 숫자' : '한/영 함께 관리'));
    }
    var eye = mk('button', 'ys-icon-b');
    eye.title = '화면에서 이 요소 보기';
    eye.setAttribute('aria-label', '화면에서 이 요소 보기');
    eye.appendChild(ico('eye'));
    eye.addEventListener('click', function () { revealIdx(info.idx); });
    row.appendChild(eye);
    return row;
  }

  /* ── 텍스트 ── */

  var LANG_LABEL = { ko: '한국어', en: 'English' };

  /** 화면에 보이는 글자를 즉시 맞춘다(런타임 관리 요소는 resyncLive 가 건너뛴다). */
  function pushLive(idx, text) {
    var m = Y.engine.map();
    var lv = m && m.liveOf(idx);
    if (lv && lv.textContent !== text) lv.textContent = text;
  }

  /** 홈 내장 사전(var I18N) 한 언어분 입력 칸 */
  function dictBox(idx, key, lang, value, curLang) {
    var wrap = mk('div', 'ys-dict-f' + (lang === curLang ? ' is-cur' : ''));
    var lab = mk('span', 'ys-f-l', LANG_LABEL[lang] || lang);
    if (lang === curLang) lab.appendChild(mk('em', 'ys-dict-cur', '지금 화면'));
    var ta = mk('textarea', 'ys-ta');
    ta.value = value == null ? '' : value;
    ta.rows = Math.min(8, Math.max(2, Math.ceil((ta.value.length || 1) / 34)));
    ta.spellcheck = false;
    function commit() {
      if (Y.pagedict.set(key, lang, ta.value, idx)) refreshSoft();
    }
    ta.addEventListener('input', U.debounce(commit, 350));
    ta.addEventListener('blur', commit);
    wrap.appendChild(lab);
    wrap.appendChild(ta);
    return wrap;
  }

  function textSection(idx, info) {
    var s = sect('글 내용');

    /* 카운트업 — 화면 숫자는 애니메이션이 0부터 다시 쓰므로 목표값(data-count)을 고친다 */
    if (info.runtime === 'count') {
      s.appendChild(noteBox('스크롤할 때 0부터 세어 올라가는 숫자입니다. 최종 값을 여기서 고치세요.'));
      var row = fieldRow('최종 숫자');
      var num = mk('input', 'ys-in');
      num.type = 'text';
      num.inputMode = 'numeric';
      num.value = info.attrs['data-count'] == null ? '' : info.attrs['data-count'];
      var numWarn = mk('p', 'ys-hint', '');
      function pushNum() {
        var v = num.value.trim();
        if (!/^-?\d+(?:\.\d+)?$/.test(v)) { numWarn.textContent = '숫자만 넣을 수 있습니다.'; return; }
        numWarn.textContent = '';
        if (Y.engine.setAttr(idx, 'data-count', v)) { pushLive(idx, v); refreshSoft(); }
      }
      num.addEventListener('input', U.debounce(pushNum, 300));
      num.addEventListener('blur', pushNum);
      row.appendChild(num);
      s.appendChild(row);
      s.appendChild(numWarn);
      return s;
    }

    /* 홈 내장 사전 — 사전 값을 직접 고쳐 새로고침 뒤에도 남게 한다 */
    if (info.runtime === 'i18n') {
      var key = info.attrs['data-i18n'] || '';
      var vals = (Y.pagedict && Y.pagedict.available()) ? Y.pagedict.values(key) : null;
      var have = vals ? Object.keys(vals) : [];
      if (have.length) {
        var cur = Y.pagedict.liveLang();
        s.appendChild(noteBox('홈 한/영 사전이 관리하는 문장입니다 — 두 언어를 여기서 바로 고칩니다. ' +
          '저장하면 화면과 파일에 함께 반영됩니다.'));
        for (var li = 0; li < have.length; li++) {
          s.appendChild(dictBox(idx, key, have[li], vals[have[li]], cur));
        }
        s.appendChild(hint('사전 키 ' + key + ' · 한/영 패널에서 전체 목록을 볼 수 있습니다.'));
        return s;
      }
      s.appendChild(warnBox('이 문장은 홈 한/영 사전이 관리하는데 사전을 읽지 못했습니다.' +
        (Y.pagedict && Y.pagedict.reason() ? ' (' + Y.pagedict.reason() + ')' : '')));
      var ta1 = mk('textarea', 'ys-ta');
      ta1.value = info.text == null ? '' : info.text;
      ta1.disabled = true;
      s.appendChild(ta1);
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
    var s = sect('링크 · 설명');
    var names = [], i;
    for (i = 0; i < ATTRS.length; i++) if (attrRelevant(info.tag, ATTRS[i], info.attrs)) names.push(ATTRS[i]);
    /* data-count 는 텍스트 칸(「최종 숫자」)이 이미 갖고 있다 — 같은 값을 두 칸에 두면
       한쪽을 고쳐도 다른 쪽이 옛 값을 보여 준다. 텍스트 칸이 없을 때만 여기서 낸다. */
    if (Object.prototype.hasOwnProperty.call(info.attrs, 'data-count') && !info.isLeaf) names.push('data-count');

    var plain = [], dev = [];
    for (i = 0; i < names.length; i++) (DEV_ATTRS[names[i]] ? dev : plain).push(names[i]);
    for (i = 0; i < plain.length; i++) s.appendChild(attrRow(idx, plain[i], info));
    if (dev.length) {
      /* id·class 는 화면에 보이지 않는 개발자 정보다 — 접어 둔다 */
      var det = D.createElement('details');
      det.className = 'ys-advfold';
      det.setAttribute(UIA, '');
      var sm = D.createElement('summary');
      sm.textContent = '고급 설정';
      det.appendChild(sm);
      for (i = 0; i < dev.length; i++) det.appendChild(attrRow(idx, dev[i], info));
      s.appendChild(det);
    }

    if (info.attrs.href) {
      var open = act('이 링크 열기', '', function () { openLink(info.attrs.href); });
      var row = mk('div', 'ys-row');
      row.appendChild(open);
      s.appendChild(row);
      s.appendChild(hint('편집 중에는 링크를 눌러도 이동하지 않고 선택만 됩니다. 이동하려면 이 버튼을 누르거나 Alt 를 누른 채 클릭하세요.'));
    }
    return s;
  }

  function attrRow(idx, name, info) {
    var f = fieldRow(attrKo(name));
    if (f.firstChild) f.firstChild.title = name;
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
    var s = sect('모양 꾸미기');
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
    var s = sect('순서 · 복제 · 삭제');
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

  /** 같은 말이 여러 곳에서 한꺼번에 바뀌면 정렬기가 짝을 놓치고, 멀쩡히 남아 있는 요소가
      「삭제」로 분류된다. 요소 수가 그대로인데 삭제·추가가 잡혔다면 그 요약은 믿을 수 없다 —
      게시 직전 화면의 「삭제 5건」은 사람을 잘못 멈춰 세운다. */
  function suspectSummary(path, orig, src, list) {
    if (!/\.html?$/i.test(String(path || ''))) return false;
    var phantom = 0;
    for (var i = 0; i < list.length; i++) if (list[i].type === 'del' || list[i].type === 'add') phantom++;
    if (!phantom) return false;
    try {
      var P = new DOMParser();
      var a = P.parseFromString(orig, 'text/html').querySelectorAll('*').length;
      var b = P.parseFromString(src, 'text/html').querySelectorAll('*').length;
      return a === b;                       // 요소가 하나도 안 늘고 안 줄었다 = 삭제·추가가 아니다
    } catch (e) { return false; }
  }

  /** 줄 단위로 정직하게 센다 — 분류가 못 미더울 때의 기준선 */
  function lineSummary(orig, src) {
    var la = orig.split('\n'), lb = src.split('\n');
    if (la.length !== lb.length) return la.length + '줄 → ' + lb.length + '줄';
    var n = 0;
    for (var i = 0; i < la.length; i++) if (la[i] !== lb[i]) n++;
    return n ? n + '줄 바뀜' : '내용 바뀜';
  }

  /** 초안 하나를 사람 말로 요약한다 — "글 13건" · 못 미더우면 줄 수로 물러선다. */
  function describeDraft(d) {
    /* 사진 초안(base64)은 글자 비교가 무의미하다 — 용량으로 말한다 */
    if (d.encoding === 'base64') {
      var bytes = d.bytes || Math.round(String(d.src || '').length * 3 / 4);
      return (d.note || '사진 교체') + ' (' + Math.max(1, Math.round(bytes / 1024)) + 'KB)';
    }
    var orig = d.origSrc == null ? '' : d.origSrc;
    if (Y.changes && Y.changes.of) {
      try {
        var r = Y.changes.of(d.path, orig, d.src);
        if (r && r.ok && r.list && r.list.length && !suspectSummary(d.path, orig, d.src, r.list)) {
          return Y.changes.summarize(r.list);
        }
      } catch (e) { /* 아래로 물러선다 */ }
    }
    return lineSummary(orig, d.src);
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
      /* 글자 수 차이는 "무엇이 바뀌었나" 를 말해 주지 못한다.
         '연세대학교'→'고려대학교' 처럼 길이가 같은 치환은 「0자」로 보여
         아무것도 안 바뀐 것처럼 읽힌다. 항목별 요약을 우선 쓴다. */
      row.appendChild(mk('span', 'ys-frow-d', describeDraft(d)));
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
    for (i = 0; i < recs.length; i++) {
      files.push({ path: recs[i].path, content: recs[i].src, encoding: recs[i].encoding || undefined });
    }
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
        Y.bus.emit('publish:done', {
          sha: sha, url: url, files: files.length,
          // 어떤 파일이 나갔는지 — 공지 메일 알림(posts)이 data.js 포함 여부를 본다
          paths: files.map(function (f) { return f.path; })
        });
      });
    }, function (err) {
      stop();
      publishing = false;
      if (err && err.status === 409) { conflictModal(err); return; }
      Y.toast((err && err.message) || '게시에 실패했습니다.', 'error');
    });
  }

  /* ── 편집 종료 — 세션을 지우고 방문자 화면으로 돌아간다 ──
     초안(IndexedDB)은 남는다: 다음에 다시 로그인하면 이어서 편집할 수 있다. */
  function exitStudio() {
    confirmBox('편집을 종료하고 방문자 화면으로 돌아갑니다.\n\n' +
      '저장하지 않은 초안은 남아 있다가 다음 편집 때 이어집니다. ' +
      '게시하지 않은 변경은 사이트에 나가지 않습니다. 계속할까요?').then(function (ok) {
      if (!ok) return;
      try { Y.session.clear(); } catch (e) {}
      try {
        var q = location.search.replace(/([?&])studio=1(&|$)/, function (m, a, b) { return b ? a : ''; });
        if (q === '?') q = '';
        history.replaceState(null, '', location.pathname + q + location.hash);
      } catch (e2) {}
      reloadSafe();
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
    setReturn: setReturn,
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
