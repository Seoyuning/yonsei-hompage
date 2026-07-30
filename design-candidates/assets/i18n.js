/* YSME 방문자용 한/영 런타임 — 스튜디오와 무관하게 항상 로드된다.

   원칙 (STUDIO_SPEC 5절)
     · **한국어가 파일의 진실**이다. localStorage['ysme-lang'] 이 'en' 일 때만 화면을 덮어쓴다.
       기본 상태에서는 사전조차 내려받지 않는다 — 방문자 경험에 비용을 주지 않는다.
     · 사전은 assets/i18n/en.json = { "한국어 원문": "English" } (gettext 의 msgid 규약).
     · 치환은 **텍스트 노드 단위 완전일치**만 한다. 부분 문자열 치환은 오역·중복 치환을
       부르므로 절대 하지 않는다. 공백만 한 칸으로 접어 비교한다(HTML 원문의 줄바꿈 흡수).
     · 번역이 없거나 값이 빈 문자열이면 한국어를 그대로 둔다(스튜디오가 「미번역」으로 표시).

   제외 영역 — nav.js 가 만드는 공용 헤더·탭바·푸터·맨위로 버튼, 스튜디오 UI,
   그리고 홈의 인라인 사전이 관리하는 [data-i18n] (이중 번역 금지).

   되돌리기: 바꾼 값의 원문을 전부 들고 있으므로 KO 로 전환할 때 **새로고침 없이** 복원한다.
*/
(function () {
  'use strict';
  if (window.YSME_I18N) return;

  var KEY = 'ysme-lang';
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  /* 예전에는 nav.js 가 그리는 헤더·서브탭·푸터(.ynv/.ysub/.ytop/.ynv-ovl/footer.yft)를 통째로 건너뛰었다.
     그 바람에 주메뉴 7개·드롭다운 34개·푸터 41개 링크가 — 번역문이 사전에 이미 다 있는데도 —
     ENG 에서 한국어로 남았다. 이제 훑는다. 번역하면 안 되는 것(언어 전환 버튼)에는 data-no-i18n 을 단다. */
  var SKIP = '[data-ys-ui], [data-i18n],' +
    ' script, style, noscript, template, textarea, [data-no-i18n]';

  var dict = null;          // 사전 (null = 아직 없음)
  var loading = null;       // 진행 중인 fetch Promise
  var on = false;           // EN 적용 중인가
  var mine = new WeakSet(); // 우리가 손댄 노드 — 자기 변경을 다시 훑지 않기 위한 표식
  var rawText = new WeakMap();  // 텍스트 노드 → 한국어 원문 (EN 적용 중에도 원문을 잃지 않는다)
  var rawAttr = new WeakMap();  // 요소 → {속성명: 한국어 원문}
  var textLog = [];         // [{node, raw}]   되돌리기용 원문 (순서 보존)
  var attrLog = [];         // [{el, name, raw}]
  var mo = null, pending = [], timer = null;

  /* ── 경로 ── */
  /* 사전 주소에 이 파일의 버전 쿼리를 그대로 물려준다.
     예전에는 ?v=NN 을 떼고 요청해서, 사전을 새로 채워도 브라우저가 캐시에 있는
     옛 사전을 계속 썼다 — 「번역이 아직도 안 된다」의 진짜 원인이 이것이었다.
     nav.js 가 i18n.js 를 붙일 때 자기 버전을 넘겨주므로, 그 버전만 올리면 사전도 함께 새로 받는다. */
  function dictUrl() {
    if (window.YSME_I18N_URL) return window.YSME_I18N_URL;
    var s = document.currentScript;
    if (s && s.src) {
      var q = (s.src.match(/[?][^#]*/) || [''])[0];
      return s.src.replace(/[?#].*$/, '').replace(/i18n\.js$/, 'i18n/en.json') + q;
    }
    return 'assets/i18n/en.json';
  }
  var URL_ = dictUrl();

  /* ── 사전 키 정규화 — _studio/tools/extract-i18n.js 와 **같은 규칙** ── */
  function normKey(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

  function lookup(s) {
    if (!dict) return null;
    var k = normKey(s);
    if (!k) return null;
    var v = Object.prototype.hasOwnProperty.call(dict, k) ? dict[k] : null;
    return v ? v : null;                       // 빈 문자열 = 미번역
  }

  function load() {
    if (dict) return Promise.resolve(dict);
    if (loading) return loading;
    loading = fetch(URL_, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('사전을 불러올 수 없습니다 (' + r.status + ')');
      return r.json();
    }).then(function (d) {
      dict = d && typeof d === 'object' ? d : {};
      return dict;
    })['catch'](function () {
      loading = null;                          // file:// 등 — 조용히 포기하고 한국어를 유지
      return null;
    });
    return loading;
  }

  /* ── 적용 ── */
  function inSkip(el) { return !!(el && el.closest && el.closest(SKIP)); }

  function applyText(node) {
    var raw = node.nodeValue;
    if (!raw || !/\S/.test(raw)) return;
    if (mine.has(node)) return;                // 이미 우리가 바꾼 노드
    var en = lookup(raw);
    if (!en) return;
    var lead = /^\s*/.exec(raw)[0], tail = /\s*$/.exec(raw)[0];
    textLog.push({ node: node, raw: raw });
    mine.add(node);
    rawText.set(node, raw);
    node.nodeValue = lead + en + tail;
  }

  function applyAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      if (!el.hasAttribute(name)) continue;
      var raw = el.getAttribute(name);
      var en = lookup(raw);
      if (!en || en === raw) continue;
      attrLog.push({ el: el, name: name, raw: raw });
      var bag = rawAttr.get(el);
      if (!bag) { bag = {}; rawAttr.set(el, bag); }
      bag[name] = raw;
      el.setAttribute(name, en);
    }
  }

  /* ── 원문 조회 — EN 적용 중에도 "이 자리의 한국어"를 되찾는다 (스튜디오 편집용) ── */
  function origText(node) {
    if (!node) return '';
    if (node.nodeType === 1) {                 // 요소 → 첫 텍스트 자식
      var n = node.firstChild;
      while (n) { if (n.nodeType === 3 && /\S/.test(n.nodeValue)) return origText(n); n = n.nextSibling; }
      return '';
    }
    if (node.nodeType !== 3) return '';
    var r = rawText.has(node) ? rawText.get(node) : node.nodeValue;
    return normKey(r);
  }
  function origAttr(el, name) {
    var bag = el && rawAttr.get(el);
    if (bag && bag[name] != null) return normKey(bag[name]);
    return el && el.getAttribute ? normKey(el.getAttribute(name)) : '';
  }

  /** 현재 문서에 실제로 등장하는 번역 대상 목록(한국어 원문 기준, 문서 순서, 중복 제거).
   *  스튜디오의 한/영 패널이 「이 페이지의 문장」을 뽑는 유일한 경로다. */
  function survey(root) {
    var out = [], seen = Object.create(null);
    function push(text, kind, el, attr) {
      if (!text || text.length < 1) return;
      /* 사전의 키는 '한국어 원문'이다(gettext 의 msgid 규약). 한글이 없는 조각
         — 숫자 33·연도 1962·'SCROLL'·전화번호·BK21 같은 영문 약어 — 은 번역 대상이 아니므로
         조사 결과에 넣지 않는다. 넣으면 편집 패널의 '미번역' 수만 부풀어 실제 문장이 묻힌다.
         (번역 적용 경로는 사전 키와 정확히 일치할 때만 치환하므로 여기 필터와 무관하다.) */
      if (!/[가-힣]/.test(text)) return;
      if (seen[text]) { seen[text].count++; return; }
      var rec = { text: text, kind: kind, el: el, attr: attr || null, count: 1 };
      seen[text] = rec;
      out.push(rec);
    }
    (function scan(el) {
      if (el.matches && el.matches(SKIP)) return;
      for (var i = 0; i < ATTRS.length; i++) {
        if (el.hasAttribute && el.hasAttribute(ATTRS[i])) push(origAttr(el, ATTRS[i]), 'attr', el, ATTRS[i]);
      }
      var n = el.firstChild;
      while (n) {
        if (n.nodeType === 3) push(origText(n), 'text', el, null);
        else if (n.nodeType === 1) scan(n);
        n = n.nextSibling;
      }
    })(root || document.body);
    return out;
  }

  /* 요소 하위를 훑는다. 제외 대상 요소는 그 자리에서 가지째 접는다. */
  function walk(el) {
    if (el.matches && el.matches(SKIP)) return;
    applyAttrs(el);
    var n = el.firstChild;
    while (n) {
      var next = n.nextSibling;
      if (n.nodeType === 3) applyText(n);
      else if (n.nodeType === 1) walk(n);
      n = next;
    }
  }

  /** 임의의 노드(요소·텍스트)에서 시작해 적용한다 — MutationObserver 진입점. */
  function applyNode(node) {
    if (!node) return;
    if (node.nodeType === 3) { if (!inSkip(node.parentElement)) applyText(node); return; }
    if (node.nodeType !== 1) return;
    if (inSkip(node)) return;
    walk(node);
  }

  /* <head> 는 body 순회에 잡히지 않아 브라우저 탭 제목이 한국어로 남았다 — 따로 바꾼다 */
  var rawHead = null;
  function applyHead() {
    if (!dict) return;
    var meta = document.querySelector('meta[name="description"]');
    if (rawHead === null) rawHead = { title: document.title, desc: meta ? meta.getAttribute('content') : null };
    var t = lookup(rawHead.title); if (t) document.title = t;
    if (meta && rawHead.desc) { var d = lookup(rawHead.desc); if (d) meta.setAttribute('content', d); }
  }
  function restoreHead() {
    if (rawHead === null) return;
    document.title = rawHead.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && rawHead.desc !== null) meta.setAttribute('content', rawHead.desc);
  }

  function applyAll() {
    if (!dict || !document.body) return;
    walk(document.body);
    applyHead();
  }

  function restore() {
    var i;
    restoreHead();
    for (i = textLog.length - 1; i >= 0; i--) {
      var t = textLog[i];
      try { t.node.nodeValue = t.raw; } catch (e) {}
      mine['delete'](t.node);
      rawText['delete'](t.node);
    }
    for (i = attrLog.length - 1; i >= 0; i--) {
      var a = attrLog[i];
      try { a.el.setAttribute(a.name, a.raw); } catch (e2) {}
      rawAttr['delete'](a.el);
    }
    textLog = [];
    attrLog = [];
  }

  /* ── 사이트 JS 가 나중에 그리는 영역(data.js 렌더 등) 따라가기 ──
     추가된 노드에만 다시 적용한다. 우리가 바꾸는 것은 텍스트 노드 값과 속성뿐이고
     childList 만 관찰하므로 자기 변경이 관찰기를 다시 깨우는 고리가 생기지 않는다. */
  function observe() {
    if (mo || !window.MutationObserver || !document.body) return;
    mo = new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var added = recs[i].addedNodes;
        for (var j = 0; j < added.length; j++) pending.push(added[j]);
      }
      if (pending.length && timer == null) timer = setTimeout(flush, 30);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  function unobserve() {
    if (mo) { mo.disconnect(); mo = null; }
    if (timer != null) { clearTimeout(timer); timer = null; }
    pending = [];
  }
  function flush() {
    timer = null;
    var list = pending;
    pending = [];
    if (!on || !dict) return;
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (n && n.isConnected !== false) applyNode(n);
    }
  }

  /* ── 켜기 / 끄기 ── */
  function enable() {
    return load().then(function (d) {
      if (!d) return false;                    // 사전 없음 → 한국어 유지
      on = true;
      document.documentElement.lang = 'en';
      applyAll();
      observe();
      return true;
    });
  }
  function disable() {
    unobserve();
    restore();
    on = false;
    document.documentElement.lang = 'ko';
    return Promise.resolve(true);
  }

  function stored() {
    try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'ko'; } catch (e) { return 'ko'; }
  }

  function setLang(l) {
    l = l === 'en' ? 'en' : 'ko';
    try { localStorage.setItem(KEY, l); } catch (e) {}
    return l === 'en' ? (on ? refresh() : enable()) : disable();
  }

  /** 사전이 바뀐 뒤(스튜디오 편집 등) 화면을 다시 맞춘다. */
  function refresh() {
    if (!on) return stored() === 'en' ? enable() : Promise.resolve(false);
    unobserve();
    restore();
    applyAll();
    observe();
    return Promise.resolve(true);
  }

  /* ── 언어 버튼 위임 ──
     nav.js 의 #ynvKo/#ynvEn 은 localStorage 만 바꾼다. 버튼 id 로 목표 언어를 직접 읽어
     핸들러 실행 순서와 무관하게 **새로고침 없이** 적용/해제한다. */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('#ynvKo,#ynvEn,#langKo,#langEn') : null;
    if (!t) return;
    setLang(/En$/.test(t.id) ? 'en' : 'ko');
  });

  /* ── 시작 ── */
  function boot() { if (stored() === 'en') enable(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.YSME_I18N = {
    url: URL_,
    lang: function () { return on ? 'en' : 'ko'; },
    isEn: function () { return on; },
    stored: stored,
    setLang: setLang,
    refresh: refresh,
    apply: applyNode,
    load: load,
    norm: normKey,
    /** 라이브 노드의 한국어 원문(= 사전 키) */
    origText: origText,
    origAttr: origAttr,
    /** 이 페이지의 번역 대상 목록 — [{text, kind, el, attr, count}] */
    survey: survey,
    dict: function () { return dict; },
    /** 스튜디오가 초안 사전을 미리보기로 밀어 넣을 때 사용한다. */
    setDict: function (d) {
      dict = d && typeof d === 'object' ? d : {};
      return refresh();
    }
  };
})();
