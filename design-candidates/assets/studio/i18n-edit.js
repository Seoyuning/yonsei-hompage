/* YSME In-Place Studio — 한/영 편집 모드 (STUDIO_SPEC 5절)

   규칙
     · 한국어는 **HTML 파일의 진실**이다. KO 모드 편집 = pristine 원문 수정(engine 담당).
     · EN 모드 편집 = **사전만 수정**한다. HTML 은 손대지 않는다.
       사전 초안은 다른 초안과 같은 스토어·같은 경로(`assets/i18n/en.json`)에 쌓이므로
       HUD 의 게시 로직(초안 전체를 1커밋)에 자동으로 함께 실려 나간다.
     · KO 원문이 바뀌면 그 문장의 영어 항목을 **새 원문으로 이관**한다(rekey).
       'buffer:change' 만으로는 어떤 문장이 어떻게 바뀌었는지 알 수 없으므로,
       편집 전후의 「이 페이지 문장 목록」을 비교해 1:1 로 대응되면 자동 이관하고,
       모호하면 새 원문을 미번역으로 남기고 패널에 알린다.

   방문자 런타임(assets/i18n.js)이 사전을 실제로 적용하는 유일한 주체다.
   이 모듈은 그 런타임의 survey()/origText()/setDict() 만 통해 화면과 대화한다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.i18nEdit) return;
  var U = Y.util;

  var DICT_PATH = 'assets/i18n/en.json';
  var LANG_KEY = 'ysme-lang';
  var MAX_ROWS = 400;

  var map = null;          // 사전(초안 반영본)
  var baseSrc = null;      // 커밋된 en.json 원문 — 초안 여부 판정 기준
  var loadP = null;
  var isDirty = false;
  var savedAt = 0;
  var saving = false;

  var root = null, els = {}, opened = false;
  var query = '', todoOnly = false;
  var lastList = null;     // 자동 이관용 문장 스냅샷 (문장 → 등장 횟수)
  var notes = [];

  /* ── 런타임(방문자용 i18n.js) 손잡이 ── */
  function liveDoc() {
    var d = Y.engine && Y.engine.liveDoc ? Y.engine.liveDoc() : null;
    return d || document;
  }
  function runtime() {
    var d = liveDoc();
    var w = d && d.defaultView;
    return (w && w.YSME_I18N) || window.YSME_I18N || null;
  }
  function norm(s) {
    var R = runtime();
    if (R && R.norm) return R.norm(s);
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }

  /* ── 사전 직렬화 — _studio/tools/extract-i18n.js 와 같은 형식(정렬·2칸·LF·끝 개행) ── */
  function serialize(m) {
    var keys = Object.keys(m).sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; });
    var out = {};
    for (var i = 0; i < keys.length; i++) out[keys[i]] = m[keys[i]];
    return JSON.stringify(out, null, 2) + '\n';
  }
  function parse(src) {
    try { var o = JSON.parse(src); return o && typeof o === 'object' ? o : null; }
    catch (e) { return null; }
  }

  /* ── 사전 확보 ──
     기준 원문(baseSrc)은 **반드시** 확보해야 한다. 기준 없이 저장하면 사전 전체가
     편집한 몇 줄로 덮여 나머지 번역이 사라진다. 그래서 서버(read) → 정적 파일(fetch)
     두 경로로 시도하고, 둘 다 실패하면 편집을 잠근다(locked). */
  var locked = false;

  function readBase() {
    return Y.net.read(DICT_PATH).then(function (r) {
      return r && typeof r.content === 'string' ? r.content : null;
    })['catch'](function () {
      var R = runtime();
      var u = (R && R.url) || DICT_PATH;
      return fetch(u, { cache: 'no-cache' }).then(function (r) {
        return r.ok ? r.text() : null;
      })['catch'](function () { return null; });
    });
  }

  function ensure() {
    if (loadP) return loadP;
    loadP = readBase().then(function (src) {
      baseSrc = src;
      return Y.store.get('drafts', DICT_PATH);
    }).then(function (d) {
      var src = d && typeof d.src === 'string' ? d.src : null;
      if (src != null && baseSrc != null && src === baseSrc) {
        src = null;                                    // 게시 뒤 남은 초안 — 자동 정리
        Y.store.del('drafts', DICT_PATH);
      }
      var m = parse(src != null ? src : baseSrc);
      locked = !m;
      map = m || {};
      isDirty = !!(src != null && baseSrc != null && src !== baseSrc);
      if (locked) Y.toast('사전 파일(' + DICT_PATH + ')을 읽지 못해 한/영 편집을 잠갔습니다.', 'error');
      return map;
    });
    return loadP;
  }

  /* ── 저장(초안) ── */
  var schedule = U.debounce(function () { flush(); }, 700);

  /** 두 사전 원문이 **내용상** 같은가 (표기 차이는 무시한다) */
  function sameDict(a, b) {
    var x = parse(a), y = parse(b);
    if (!x || !y) return false;
    var kx = Object.keys(x), ky = Object.keys(y);
    if (kx.length !== ky.length) return false;
    for (var i = 0; i < kx.length; i++) {
      var k = kx[i];
      if (!Object.prototype.hasOwnProperty.call(y, k)) return false;
      if (x[k] !== y[k]) return false;
    }
    return true;
  }

  function flush() {
    if (!map || locked) return Promise.resolve();
    var src = serialize(map);
    saving = true;
    status();
    var done = function () {
      saving = false;
      savedAt = Date.now();
      Y.bus.emit('draft:change', { path: DICT_PATH, dirty: isDirty });
      status();
      pushToScreen();
    };
    /* 표기가 원문과 조금 달라도(들여쓰기·키 순서·마지막 줄바꿈) 내용이 같으면 바뀐 게 아니다.
       문자열만 비교하면 한/영 패널을 **열기만 해도** 사전이 「미저장」으로 잡혀
       게시 목록에 아무 내용 없는 파일이 끼어든다. */
    if (baseSrc != null && (src === baseSrc || sameDict(src, baseSrc))) {
      isDirty = false;
      return Y.store.del('drafts', DICT_PATH).then(done, done);
    }
    isDirty = true;
    return Y.store.put('drafts', {
      path: DICT_PATH,
      src: src,
      origSrc: baseSrc == null ? src : baseSrc,
      baseSha: Y.engine && Y.engine.headSha ? Y.engine.headSha() : null,
      ts: Date.now(),
      author: Y.session.author()
    }).then(done, done);
  }

  /** 초안 사전을 화면 런타임에 밀어 넣어 EN 모드에서 즉시 보이게 한다. */
  function pushToScreen() {
    var R = runtime();
    if (!R || !map) return;
    if (!isEnMode()) return;
    R.setDict(parse(JSON.stringify(map)) || {});
  }

  /* ── 공개 API ── */
  function isEnMode() {
    var R = runtime();
    if (R && R.stored) return R.stored() === 'en';
    try { return localStorage.getItem(LANG_KEY) === 'en'; } catch (e) { return false; }
  }

  function setTranslation(koText, enText) {
    var k = norm(koText);
    if (!k) return Promise.resolve(false);
    return ensure().then(function () {
      if (locked) return false;
      var v = enText == null ? '' : String(enText);
      if (map[k] === v) return false;
      map[k] = v;
      schedule();
      if (opened) renderList();
      return true;
    });
  }

  function translationOf(koText) {
    var k = norm(koText);
    if (!map || !k) return '';
    return Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || '') : '';
  }

  /** 라이브 요소가 담고 있는 한국어 원문(= 사전 키). EN 모드에서도 원문을 되찾는다. */
  function keyFor(liveEl, attr) {
    var R = runtime();
    if (!R || !liveEl) return '';
    return attr ? R.origAttr(liveEl, attr) : R.origText(liveEl);
  }

  /** KO 원문 수정에 따른 사전 키 이관.
   *  이전 원문이 화면에 **아직 남아 있으면**(같은 문구가 목차·breadcrumb 등에 또 쓰이는 경우)
   *  옮기지 않고 복사한다 — 지워 버리면 남은 자리가 번역을 잃는다. */
  function rekey(oldKo, newKo) {
    var a = norm(oldKo), b = norm(newKo);
    return ensure().then(function () {
      if (locked || !b || a === b) return false;
      var had = Object.prototype.hasOwnProperty.call(map, a);
      var val = had ? map[a] : '';
      var stillHere = (counts(survey())[a] || 0) > 0;
      if (had && !stillHere) delete map[a];
      if (!Object.prototype.hasOwnProperty.call(map, b) || (!map[b] && val)) map[b] = val;
      schedule();
      note(!val ? '새 원문을 미번역으로 등록했습니다 — ' + cut(b)
        : stillHere ? '번역을 새 원문에 복사했습니다(이전 원문이 화면에 남아 있음) — ' + cut(b)
          : '원문이 바뀌어 번역을 이관했습니다 — ' + cut(b));
      if (opened) renderList();
      return true;
    });
  }

  /* ── 이 페이지의 문장 목록 ──
     원칙적으로 방문자 런타임의 survey() 를 쓴다(EN 적용 중에도 한국어 원문을 돌려준다).
     런타임이 아직 페이지에 없을 때만 같은 규칙으로 직접 훑는다. */
  var SKIP = '.ynv, .ysub, .ytop, .ynv-ovl, footer.yft, [' + Y.config.uiAttr + '], [data-i18n],' +
    ' script, style, noscript, template, textarea, [data-no-i18n]';
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];

  function survey() {
    var d = liveDoc();
    var body = d.body || d.documentElement;
    if (!body) return [];
    var R = runtime();
    if (R && R.survey) return R.survey(body);
    return localSurvey(body);
  }

  function localSurvey(rootEl) {
    var out = [], seen = Object.create(null);
    function push(text, kind, owner, attr) {
      text = norm(text);
      if (!text) return;
      /* 사전의 키는 '한국어 원문'이다. 한글이 없는 조각(숫자 33·연도 1962·'SCROLL'·
         전화번호·BK21 같은 영문 약어)은 번역 대상이 아니므로 목록에 올리지 않는다.
         이걸 걸러 내지 않으면 미번역 개수만 부풀어 실제로 번역이 필요한 문장이 묻힌다. */
      if (!/[가-힣]/.test(text)) return;
      if (seen[text]) { seen[text].count++; return; }
      var rec = { text: text, kind: kind, el: owner, attr: attr || null, count: 1 };
      seen[text] = rec;
      out.push(rec);
    }
    (function scan(node) {
      if (node.matches && node.matches(SKIP)) return;
      for (var i = 0; i < ATTRS.length; i++) {
        if (node.hasAttribute && node.hasAttribute(ATTRS[i])) push(node.getAttribute(ATTRS[i]), 'attr', node, ATTRS[i]);
      }
      var n = node.firstChild;
      while (n) {
        if (n.nodeType === 3) push(n.nodeValue, 'text', node, null);
        else if (n.nodeType === 1) scan(n);
        n = n.nextSibling;
      }
    })(rootEl);
    return out;
  }
  /** 문장 → 등장 횟수. 같은 문구가 여러 자리에 쓰이는 페이지가 흔하므로
   *  단순 존재 여부가 아니라 **횟수**로 비교해야 원문 1건 수정을 잡아낼 수 있다. */
  function counts(list) {
    var m = Object.create(null);
    for (var i = 0; i < list.length; i++) m[list[i].text] = (m[list[i].text] || 0) + (list[i].count || 1);
    return m;
  }

  /* ── KO 원문 편집 감지 → 자동 이관 ── */
  var checkDiff = U.debounce(function () {
    if (isEnMode()) return;                            // EN 모드에서는 HTML 텍스트를 고치지 않는다
    var now = counts(survey());
    if (!lastList) { lastList = now; return; }
    var prev = lastList, k, d;
    var lost = [], gained = [];
    for (k in prev) { d = (now[k] || 0) - prev[k]; if (d < 0) lost.push({ k: k, n: -d }); }
    for (k in now) { d = now[k] - (prev[k] || 0); if (d > 0) gained.push({ k: k, n: d }); }
    lastList = now;
    if (!lost.length && !gained.length) return;
    if (lost.length === 1 && gained.length === 1 && lost[0].n === 1 && gained[0].n === 1) {
      rekey(lost[0].k, gained[0].k);
      return;
    }
    if (gained.length) {
      note('원문 ' + gained.length + '건이 바뀌었지만 이전 문장과 1:1 로 짝지을 수 없어 미번역으로 남겼습니다.');
      ensure().then(function () {
        var changed = false;
        for (var j = 0; j < gained.length; j++) {
          if (!Object.prototype.hasOwnProperty.call(map, gained[j].k)) { map[gained[j].k] = ''; changed = true; }
        }
        if (changed) schedule();
        if (opened) renderList();
      });
    } else if (opened) renderList();
  }, 500);

  /* ── 일괄 치환 전용 경로 ──
     checkDiff 는 "잃은 문장 1건 : 얻은 문장 1건" 일 때만 키를 이관한다.
     찾아 바꾸기는 한 번에 수십 건을 바꾸므로 그 짝짓기가 무너지고, 옛 키를 남긴 채
     새 키를 미번역으로 덧붙여 사전이 두 벌이 된다.
     여기서는 무엇이 무엇으로 바뀌었는지 이미 알고 있으니 키를 그대로 갈아 끼운다. */
  var bulk = 0;
  /** 키 안의 말을 바꾼다. **무엇을 무엇으로 바꿨는지 쌍을 돌려준다** —
      되돌릴 때 그 쌍만 정확히 되돌리기 위해서다(renameKeys). */
  function replaceInKeys(find, replace) {
    var a = String(find == null ? '' : find), b = String(replace == null ? '' : replace);
    if (!a || a === b) return Promise.resolve({ n: 0, pairs: [] });
    return ensure().then(function () {
      if (locked) return { n: 0, pairs: [] };
      var keys = Object.keys(map), pairs = [];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k.indexOf(a) < 0) continue;
        var nk = norm(k.split(a).join(b));
        if (!nk || nk === k) continue;
        /* 값이 비어 있는 새 키가 이미 있으면 덮어써도 잃을 것이 없다 */
        if (!Object.prototype.hasOwnProperty.call(map, nk) || (!map[nk] && map[k])) map[nk] = map[k];
        delete map[k];
        pairs.push({ from: k, to: nk });
      }
      if (pairs.length) { schedule(); if (opened) renderList(); }
      return { n: pairs.length, pairs: pairs };
    });
  }

  /** 기록해 둔 쌍을 그대로 되돌린다.
      되돌리기를 다시 문자열 치환으로 하면 **원래부터 그 말이 있던 키까지** 바꿔 버린다
      (사전에는 「고려대학교 기계공학과 강용태 교수」 같은 남의 학교 이름이 실제로 들어 있다).
      그래서 반드시 바꾼 쌍만 되돌린다. */
  function renameKeys(pairs) {
    if (!pairs || !pairs.length) return Promise.resolve(0);
    return ensure().then(function () {
      if (locked) return 0;
      var n = 0;
      for (var i = pairs.length - 1; i >= 0; i--) {
        var p = pairs[i];
        if (!Object.prototype.hasOwnProperty.call(map, p.to)) continue;   // 그 사이 사라졌다
        if (!Object.prototype.hasOwnProperty.call(map, p.from) || !map[p.from]) map[p.from] = map[p.to];
        delete map[p.to];
        n++;
      }
      if (n) { schedule(); if (opened) renderList(); }
      return n;
    });
  }
  /** 치환 중에는 추측 기반 감지를 재운다. 끝나면 현재 화면을 새 기준으로 삼는다. */
  function suspend(fn) {
    bulk++;
    return Promise.resolve()
      .then(fn)
      .then(function (v) { return finish().then(function () { return v; }); },
        function (e) { return finish().then(function () { throw e; }); });
    function finish() {
      bulk--;
      if (bulk <= 0) {
        bulk = 0;
        try { lastList = isEnMode() ? lastList : counts(survey()); } catch (e2) {}
      }
      return Promise.resolve();
    }
  }

  Y.bus.on('buffer:change', function (e) {
    if (!e) return;
    if (bulk > 0) return;                       // 일괄 치환이 스스로 사전을 맞춘다
    if (e.label === 'attr' || e.label === 'style') return;
    checkDiff();
  });
  Y.bus.on('buffer:open', function () {
    lastList = null;
    setTimeout(function () { if (!isEnMode()) lastList = counts(survey()); }, 500);
  });
  Y.bus.on('align:change', function () { if (opened) status(); });

  function note(msg) {
    notes.unshift({ ts: Date.now(), msg: msg });
    if (notes.length > 4) notes.length = 4;
    if (opened) renderNotes();
    Y.toast(msg, 'warn');
  }
  function cut(s) { s = String(s); return s.length > 40 ? s.slice(0, 40) + '…' : s; }

  /* ── 언어 전환 ── */
  function setLang(l) {
    l = l === 'en' ? 'en' : 'ko';
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    var R = runtime();
    if (!R) Y.toast('assets/i18n.js 가 이 페이지에 없어 화면 언어는 바뀌지 않습니다(설정만 저장).', 'warn');
    var p = R ? R.setLang(l) : Promise.resolve(false);
    return Promise.resolve(p).then(function () {
      if (l === 'en') pushToScreen();
      if (Y.hud && Y.hud.setStatus) Y.hud.setStatus({ lang: l });
      Y.bus.emit('i18n:lang', l);
      if (l === 'ko') lastList = counts(survey());
      syncToggle();
      if (opened) renderList();
      return l;
    });
  }

  /* 헤더(#ynvKo/#ynvEn)로 바꿔도 패널 상태를 맞춘다 */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('#ynvKo,#ynvEn,#langKo,#langEn') : null;
    if (!t) return;
    setTimeout(function () {
      if (Y.hud && Y.hud.setStatus) Y.hud.setStatus({ lang: isEnMode() ? 'en' : 'ko' });
      syncToggle();
      if (opened) renderList();
    }, 60);
  });

  /* ── 패널 UI ─────────────────────────────────────────────────────────
     색·간격의 최종 권한은 studio.css 에 있다. 아래 스타일 블록은 studio.css 가
     이 패널을 아직 모를 때를 대비한 **레이아웃 최소치**이며, <head> 맨 앞에 넣어
     studio.css 의 같은 선택자가 항상 이긴다. */
  function baseCss() {
    if (document.getElementById('ysI18nCss')) return;
    var st = document.createElement('style');
    st.id = 'ysI18nCss';
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = [
      '.ys-i18n{display:flex;flex-direction:column;gap:.5rem;min-height:0}',
      '.ys-i18n-top,.ys-i18n-tools{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}',
      '.ys-i18n-q{flex:1 1 8rem;min-width:6rem}',
      '.ys-i18n-list{overflow:auto;max-height:52vh;display:flex;flex-direction:column;gap:.35rem}',
      '.ys-i18n-row{display:grid;grid-template-columns:1fr;gap:.2rem;padding:.4rem .45rem;border-radius:.35rem}',
      '.ys-i18n-ko{margin:0;font-size:.78rem;line-height:1.5;word-break:break-word}',
      '.ys-i18n-en{width:100%;box-sizing:border-box;font:inherit;font-size:.78rem;line-height:1.5;resize:vertical}',
      '.ys-i18n-meta{display:flex;gap:.4rem;align-items:center;font-size:.68rem;opacity:.75}',
      '.ys-i18n-row.is-todo{outline:1px solid rgba(200,140,20,.55)}',
      '.ys-i18n-note{font-size:.7rem;line-height:1.5;opacity:.85}',
      '.ys-i18n-empty{font-size:.75rem;opacity:.7;padding:.6rem 0}'
    ].join('');
    var h = document.head;
    if (h.firstChild) h.insertBefore(st, h.firstChild); else h.appendChild(st);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function btn(cls, text) {
    var b = el('button', cls, text);
    b.type = 'button';
    return b;
  }

  function render(hostEl) {
    baseCss();
    if (root && root.parentNode === hostEl) { refresh(); return; }
    hostEl.textContent = '';
    root = el('div', 'ys-i18n');
    root.setAttribute(Y.config.uiAttr, '');

    var top = el('div', 'ys-i18n-top');
    els.ko = btn('ys-btn ys-i18n-lang', '한국어');
    els.en = btn('ys-btn ys-i18n-lang', 'English');
    els.ko.addEventListener('click', function () { setLang('ko'); });
    els.en.addEventListener('click', function () { setLang('en'); });
    els.stat = el('span', 'ys-i18n-stat', '');
    top.appendChild(els.ko);
    top.appendChild(els.en);
    top.appendChild(els.stat);
    root.appendChild(top);

    var tools = el('div', 'ys-i18n-tools');
    els.q = el('input', 'ys-in ys-i18n-q');
    els.q.type = 'search';
    els.q.placeholder = '문장 검색';
    els.q.addEventListener('input', U.debounce(function () {
      query = els.q.value || '';
      renderList();
    }, 180));
    var lab = el('label', 'ys-i18n-only');
    els.only = document.createElement('input');
    els.only.type = 'checkbox';
    els.only.addEventListener('change', function () { todoOnly = !!els.only.checked; renderList(); });
    lab.appendChild(els.only);
    lab.appendChild(document.createTextNode(' 미번역만'));
    els.save = btn('ys-btn ys-i18n-save', '지금 저장');
    els.save.addEventListener('click', function () { flush(); });
    tools.appendChild(els.q);
    tools.appendChild(lab);
    tools.appendChild(els.save);
    root.appendChild(tools);

    els.notes = el('div', 'ys-i18n-note');
    root.appendChild(els.notes);

    els.list = el('div', 'ys-i18n-list');
    root.appendChild(els.list);

    hostEl.appendChild(root);
    refresh();
  }

  function refresh() {
    syncToggle();
    renderNotes();
    ensure().then(function () { renderList(); status(); }, function () { status(); });
  }

  function syncToggle() {
    if (!els.ko) return;
    var en = isEnMode();
    els.ko.classList.toggle('is-on', !en);
    els.en.classList.toggle('is-on', en);
    els.ko.setAttribute('aria-pressed', en ? 'false' : 'true');
    els.en.setAttribute('aria-pressed', en ? 'true' : 'false');
  }

  function renderNotes() {
    if (!els.notes) return;
    els.notes.textContent = '';
    for (var i = 0; i < notes.length; i++) {
      els.notes.appendChild(el('p', null, U.ago(notes[i].ts) + ' · ' + notes[i].msg));
    }
  }

  function renderList() {
    if (!els.list) return;
    var list = survey();
    var q = query.trim().toLowerCase();
    els.list.textContent = '';
    var shown = 0, todo = 0, total = list.length;

    for (var i = 0; i < list.length; i++) {
      var rec = list[i], ko = rec.text;
      var has = map && Object.prototype.hasOwnProperty.call(map, ko);
      var en = has ? (map[ko] || '') : '';
      if (!en) todo++;
      if (todoOnly && en) continue;
      if (q && ko.toLowerCase().indexOf(q) < 0 && en.toLowerCase().indexOf(q) < 0) continue;
      if (shown >= MAX_ROWS) continue;
      shown++;
      els.list.appendChild(row(rec, en, has));
    }

    if (!shown) {
      els.list.appendChild(el('p', 'ys-i18n-empty',
        total ? '조건에 맞는 문장이 없습니다.' : '이 페이지에서 번역 대상 문장을 찾지 못했습니다.'));
    } else if (shown >= MAX_ROWS) {
      els.list.appendChild(el('p', 'ys-i18n-empty',
        '문장이 많아 ' + MAX_ROWS + '개만 표시했습니다 — 검색으로 좁혀 주세요.'));
    }
    stats = { total: total, todo: todo };
    status();
  }

  var stats = { total: 0, todo: 0 };

  function row(rec, en, has) {
    var r = el('div', 'ys-i18n-row' + (en ? '' : ' is-todo'));
    r.appendChild(el('p', 'ys-i18n-ko', rec.text));

    var ta = el('textarea', 'ys-i18n-en');
    ta.rows = rec.text.length > 60 ? 3 : 1;
    ta.value = en;
    ta.placeholder = '영어 번역 (비우면 미번역)';
    ta.addEventListener('input', U.debounce(function () {
      setTranslation(rec.text, ta.value).then(function () {
        r.classList.toggle('is-todo', !ta.value.trim());
      });
    }, 400));
    r.appendChild(ta);

    var meta = el('div', 'ys-i18n-meta');
    meta.appendChild(el('span', null,
      (has ? (en ? '번역됨' : '미번역') : '새 문장') +
      (rec.kind === 'attr' ? ' · ' + rec.attr : '') +
      (rec.count > 1 ? ' · ' + rec.count + '곳' : '')));
    var find = btn('ys-btn ys-i18n-find', '찾기');
    find.addEventListener('click', function () { reveal(rec); });
    meta.appendChild(find);
    r.appendChild(meta);
    return r;
  }

  function reveal(rec) {
    var target = rec && rec.el;
    if (!target) return;
    var idx = null;
    if (Y.engine && Y.engine.indexFromLive) idx = Y.engine.indexFromLive(target);
    if (idx == null && Y.engine && Y.engine.nearestFromLive) {
      var n = Y.engine.nearestFromLive(target);
      idx = n ? n.index : null;
    }
    if (idx != null && Y.hud && Y.hud.revealIdx) { Y.hud.revealIdx(idx); return; }
    if (target.scrollIntoView) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function status() {
    var s = (isEnMode() ? 'EN 편집' : 'KO 편집') +
      ' · 문장 ' + stats.total + ' · 미번역 ' + stats.todo +
      ' · ' + (saving ? '저장 중…' : isDirty ? ('초안 있음' + (savedAt ? ' (' + U.ago(savedAt) + ' 저장)' : '')) : '초안 없음');
    if (els.stat) els.stat.textContent = s;
    if (Y.hud && Y.hud.setStatus) Y.hud.setStatus({ lang: isEnMode() ? 'en' : 'ko' });
  }

  /* ── HUD 등록 ── */
  var tries = 0;
  function registerPanel() {
    if (!Y.hud || !Y.hud.registerPanel) {
      if (tries++ > 60) return;
      setTimeout(registerPanel, 150);
      return;
    }
    Y.hud.registerPanel({
      id: 'lang',
      title: '한/영',
      icon: '文',
      order: 40,
      render: render,
      onOpen: function () { opened = true; refresh(); },
      onClose: function () { opened = false; flush(); }
    });
  }
  registerPanel();

  Y.i18nEdit = {
    path: DICT_PATH,
    isEnMode: isEnMode,
    setLang: setLang,
    setTranslation: setTranslation,
    translationOf: translationOf,
    keyFor: keyFor,
    rekey: rekey,
    replaceInKeys: replaceInKeys,
    renameKeys: renameKeys,
    suspend: suspend,
    survey: survey,
    dict: function () { return map; },
    dirty: function () { return isDirty; },
    load: ensure,
    save: flush,
    /** 게시 직후 — 지금 원문을 새 기준으로 삼는다(초안 정리는 HUD 가 한다). */
    markPublished: function () {
      if (!map) return Promise.resolve();
      baseSrc = serialize(map);
      isDirty = false;
      return Y.store.del('drafts', DICT_PATH).then(function () { status(); });
    }
  };

  Y.bus.on('publish:done', function () { Y.i18nEdit.markPublished(); });
})();
