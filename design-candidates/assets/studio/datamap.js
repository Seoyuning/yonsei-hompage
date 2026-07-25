/* YSME In-Place Studio — data.js 소유 영역 판별 + JSON 소스 오프셋 편집 (STUDIO_SPEC 4.3)

   사이트의 카드·목록 상당수는 `assets/js/data.js`(window.YSME = {…순수 JSON…}) 를 읽어
   런타임에 innerHTML 로 그린다. 그 안의 요소는 파일(HTML)에 존재하지 않으므로 화면에서
   고쳐도 다음 로드에 사라진다 → 이 모듈이 "그 텍스트는 어느 데이터 필드인가"를 찾아
   data.js 쪽을 고치도록 라우팅한다.

   편집 방식: **소스 오프셋 치환**. JSON 을 직접 스캔해 각 값의 [start,end) 를 기록하고
   그 구간만 갈아끼운다. JSON.parse → JSON.stringify 로 재직렬화하면 165KB 전체가
   diff 로 잡히므로 금지(들여쓰기·키 순서·수 표기가 전부 달라진다).
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.datamap) return;
  var U = Y.util;

  var DATA_PATH = 'assets/js/data.js';
  var STYLE_ID = 'ys-dm-style';

  /* ── 1. 컨테이너 id → 데이터 경로 (SPEC 4.3 표) ── */
  var MAP = {
    /* H-academic (홈) */
    newsGrid: { page: 'H-academic.html', colls: ['newsList'], label: 'newsList[]' },
    ntList: { page: 'H-academic.html', colls: ['noticesUG', 'noticesGrad'], label: 'noticesUG[] + noticesGrad[]' },
    smList: { page: 'H-academic.html', colls: ['seminars'], label: 'seminars[]' },
    areaGrid: { page: 'H-academic.html', colls: ['clusters'], label: 'clusters[]' },
    pGrid: { page: 'H-academic.html', colls: ['professors'], label: 'professors[] (화면 순서는 무작위 셔플)' },
    /* G-people */
    rows: { page: 'G-people.html', colls: ['professors'], label: 'professors[]' },
    cChips: { page: 'G-people.html', colls: ['clusters'], label: 'clusters[]' },
    /* G-research */
    fieldGrid: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]' },
    clusterBlocks: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]' },
    statRow: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]' },
    lvGroups: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]' },
    internSum: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]' },
    /* G-news */
    newsRows: { page: 'G-news.html', colls: ['newsList'], label: 'newsList[]' },
    semRows: { page: 'G-news.html', colls: ['seminars'], label: 'seminars[]' },
    evtRows: { page: 'G-news.html', colls: ['events'], label: 'events[]' },
    /* G-graduate */
    gradClusterBlocks: { page: 'G-graduate.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]' },
    /* G-admissions */
    schInternal: { page: 'G-admissions.html', colls: ['scholarshipsInternal'], label: 'scholarshipsInternal[]' }
  };
  /* 표에는 없지만 같은 방식으로 data.js 가 그리는 컨테이너(조사 결과 보강) */
  MAP.eagleStage = { page: 'G-research.html', colls: ['clusters'], label: 'clusters[]' };
  MAP.eagleList = { page: 'G-research.html', colls: ['clusters'], label: 'clusters[]' };

  /* ── 2. JSON 소스 스캐너 ──
     노드: {type,start,end}
       object → props{키:노드}, keys[], keyPos{키:[nameStart,nameEnd]}
       array  → items[]
       string/number/boolean/null → value
     start/end 는 값 전체 구간(문자열은 인용부호 포함)이다. */
  function scanJson(src, from) {
    var i = from, n = src.length;

    function fail(msg) {
      var e = new Error('data.js JSON 해석 실패: ' + msg + ' (오프셋 ' + i + ')');
      e.offset = i;
      throw e;
    }
    function ws() {
      while (i < n) {
        var c = src.charAt(i);
        if (c === ' ' || c === '\n' || c === '\t' || c === '\r') i++;
        else break;
      }
    }
    function str() {
      var start = i, out = '';
      i++;                                     // 여는 인용부호
      while (i < n) {
        var c = src.charAt(i);
        if (c === '\\') {
          var e = src.charAt(i + 1);
          if (e === 'u') { out += String.fromCharCode(parseInt(src.substr(i + 2, 4), 16)); i += 6; }
          else {
            out += ({ n: '\n', t: '\t', r: '\r', b: '\b', f: '\f' })[e] || e;
            i += 2;
          }
          continue;
        }
        if (c === '"') { i++; return { type: 'string', start: start, end: i, value: out }; }
        out += c; i++;
      }
      fail('문자열이 닫히지 않았습니다');
    }
    function num() {
      var start = i;
      if (src.charAt(i) === '-') i++;
      while (i < n && /[0-9.eE+\-]/.test(src.charAt(i))) i++;
      return { type: 'number', start: start, end: i, value: Number(src.slice(start, i)) };
    }
    function arr() {
      var start = i, items = [];
      i++;                                     // '['
      ws();
      if (src.charAt(i) === ']') { i++; return { type: 'array', start: start, end: i, items: items }; }
      while (i < n) {
        items.push(value());
        ws();
        var c = src.charAt(i);
        if (c === ',') { i++; ws(); continue; }
        if (c === ']') { i++; return { type: 'array', start: start, end: i, items: items }; }
        fail('배열에서 , 또는 ] 를 기대했습니다');
      }
      fail('배열이 닫히지 않았습니다');
    }
    function obj() {
      var start = i, props = {}, keys = [], keyPos = {};
      i++;                                     // '{'
      ws();
      if (src.charAt(i) === '}') { i++; return { type: 'object', start: start, end: i, props: props, keys: keys, keyPos: keyPos }; }
      while (i < n) {
        ws();
        if (src.charAt(i) !== '"') fail('객체 키를 기대했습니다');
        var k = str();
        ws();
        if (src.charAt(i) !== ':') fail('키 뒤에 : 를 기대했습니다');
        i++;
        var v = value();
        props[k.value] = v; keys.push(k.value); keyPos[k.value] = [k.start, k.end];
        ws();
        var c = src.charAt(i);
        if (c === ',') { i++; continue; }
        if (c === '}') { i++; return { type: 'object', start: start, end: i, props: props, keys: keys, keyPos: keyPos }; }
        fail('객체에서 , 또는 } 를 기대했습니다');
      }
      fail('객체가 닫히지 않았습니다');
    }
    function value() {
      ws();
      var c = src.charAt(i), start = i;
      if (c === '{') return obj();
      if (c === '[') return arr();
      if (c === '"') return str();
      if (c === '-' || (c >= '0' && c <= '9')) return num();
      if (src.substr(i, 4) === 'true') { i += 4; return { type: 'boolean', start: start, end: i, value: true }; }
      if (src.substr(i, 5) === 'false') { i += 5; return { type: 'boolean', start: start, end: i, value: false }; }
      if (src.substr(i, 4) === 'null') { i += 4; return { type: 'null', start: start, end: i, value: null }; }
      fail('알 수 없는 값 시작 문자 "' + c + '"');
    }

    return value();
  }

  /** `window.YSME = ` 뒤의 JSON 루트를 찾아 스캔한다. */
  function parseRoot(src) {
    var m = /window\s*\.\s*YSME\s*=\s*/.exec(src);
    if (!m) throw new Error('data.js 에서 window.YSME 대입을 찾지 못했습니다.');
    return scanJson(src, m.index + m[0].length);
  }

  function nodeByPath(root, path) {
    var cur = root;
    for (var i = 0; i < path.length && cur; i++) {
      var k = path[i];
      if (cur.type === 'object') cur = cur.props[k];
      else if (cur.type === 'array') cur = cur.items[k];
      else return null;
    }
    return cur || null;
  }

  /** 노드를 평범한 JS 값으로 되살린다(항목 단위로만 쓴다 — 전체에 쓰지 말 것). */
  function plain(node) {
    if (!node) return null;
    if (node.type === 'object') {
      var o = {};
      for (var i = 0; i < node.keys.length; i++) o[node.keys[i]] = plain(node.props[node.keys[i]]);
      return o;
    }
    if (node.type === 'array') {
      var a = [];
      for (var j = 0; j < node.items.length; j++) a.push(plain(node.items[j]));
      return a;
    }
    return node.value;
  }

  /* ── 3. 원문 상태 (초안 우선) ── */
  var state = null;        // {src, origSrc, baseSha, root}
  var loading = null;
  var draftFlag = false;

  function reparse() {
    state.root = parseRoot(state.src);
  }

  function ensure() {
    if (state && state.root) return Promise.resolve(state);
    if (loading) return loading;
    loading = Y.store.get('drafts', DATA_PATH).then(function (d) {
      if (d && typeof d.src === 'string') {
        return { src: d.src, origSrc: d.origSrc == null ? d.src : d.origSrc, baseSha: d.baseSha || null };
      }
      return Y.net.read(DATA_PATH).then(function (r) {
        var base = (Y.engine && Y.engine.headSha && Y.engine.headSha()) || r.ref || null;
        return { src: r.content, origSrc: r.content, baseSha: base };
      });
    }).then(function (o) {
      state = o;
      reparse();
      draftFlag = state.src !== state.origSrc;
      loading = null;
      return state;
    }, function (e) { loading = null; state = null; throw e; });
    return loading;
  }

  function emitDirty() { Y.bus.emit('draft:change', { path: DATA_PATH, dirty: draftFlag }); }

  function persist() {
    draftFlag = state.src !== state.origSrc;
    if (!draftFlag) return Y.store.del('drafts', DATA_PATH).then(emitDirty);
    return Y.store.put('drafts', {
      path: DATA_PATH, src: state.src, origSrc: state.origSrc,
      baseSha: state.baseSha, ts: Date.now(), author: Y.session.author()
    }).then(emitDirty);
  }

  /** edits: [{path:[…], kind:'string'|'number', value}] — 뒤에서부터 치환해 오프셋을 보존한다. */
  function applyEdits(edits) {
    var list = [], i;
    for (i = 0; i < edits.length; i++) {
      var node = nodeByPath(state.root, edits[i].path);
      if (!node) throw new Error('데이터 경로를 찾을 수 없습니다: ' + edits[i].path.join('.'));
      var lit;
      if (edits[i].kind === 'number') {
        var v = Number(String(edits[i].value).trim());
        if (!isFinite(v)) throw new Error('숫자 필드에 숫자가 아닌 값이 들어왔습니다: ' + edits[i].path.join('.'));
        lit = String(v);
      } else {
        lit = JSON.stringify(String(edits[i].value));
      }
      if (state.src.slice(node.start, node.end) === lit) continue;      // 변경 없음
      list.push({ start: node.start, end: node.end, lit: lit });
    }
    if (!list.length) return 0;
    list.sort(function (a, b) { return b.start - a.start; });    // 뒤에서부터 → 앞 구간 오프셋 유지
    var src = state.src, before = state.src;
    for (i = 0; i < list.length; i++) src = src.slice(0, list[i].start) + list[i].lit + src.slice(list[i].end);
    state.src = src;
    try { reparse(); }
    catch (e) { state.src = before; reparse(); throw e; }        // 깨졌으면 되돌린다(초안 오염 방지)
    return list.length;
  }

  /* ── 4. 소유 판별 ── */
  function ownerOf(el) {
    var cur = el;
    while (cur && cur.nodeType === 1) {
      var id = cur.id;
      if (id && MAP[id]) {
        return { containerId: id, dataPath: MAP[id].label, colls: MAP[id].colls, page: MAP[id].page, container: cur };
      }
      cur = cur.parentElement;
    }
    return null;
  }

  /* ── 5. 클릭한 텍스트 → 데이터 항목 찾기 ── */
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

  /** 컨테이너의 직계 자식(= 카드·행 하나)까지 올라간다. */
  function itemRootOf(el, container) {
    var cur = el;
    while (cur && cur.parentElement && cur.parentElement !== container) cur = cur.parentElement;
    return (cur && cur.parentElement === container) ? cur : el;
  }

  /** 항목의 편집 가능한 필드 목록(문자열·숫자, 중첩 객체는 1단계까지) */
  function fieldsOf(item, prefix, depth, out) {
    out = out || [];
    if (!item || typeof item !== 'object') return out;
    var keys = Object.keys(item);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], v = item[k], p = prefix ? prefix + '.' + k : k;
      if (typeof v === 'string') out.push({ key: p, path: p.split('.'), kind: 'string', value: v });
      else if (typeof v === 'number') out.push({ key: p, path: p.split('.'), kind: 'number', value: v });
      else if (v && typeof v === 'object' && !(v instanceof Array) && depth < 1) fieldsOf(v, p, depth + 1, out);
    }
    return out;
  }

  function itemLabel(item, coll, index) {
    var t = item && (item.title || item.ko || item.name || item.label || item.code || item.no);
    t = norm(t);
    if (!t) t = coll + '[' + index + ']';
    return t.length > 70 ? t.slice(0, 70) + '…' : t;
  }

  /** 클릭 텍스트·항목 텍스트와 가장 잘 맞는 항목을 고른다. */
  function findItem(colls, clickText, itemText) {
    var best = null;
    for (var c = 0; c < colls.length; c++) {
      var arrNode = state.root.props[colls[c]];
      if (!arrNode || arrNode.type !== 'array') continue;
      for (var k = 0; k < arrNode.items.length; k++) {
        var item = plain(arrNode.items[k]);
        if (!item || typeof item !== 'object') continue;
        var fs = fieldsOf(item, '', 0, []), score = 0, hit = null;
        for (var f = 0; f < fs.length; f++) {
          if (fs[f].kind !== 'string') continue;
          var v = norm(fs[f].value);
          if (v.length < 2) continue;
          if (clickText && v === clickText) { score += 6; if (!hit) hit = fs[f].key; }
          else if (clickText && v.length >= 4 && clickText.indexOf(v) >= 0) { score += 2; if (!hit) hit = fs[f].key; }
          if (itemText && v.length >= 3 && itemText.indexOf(v) >= 0) score += 1 + Math.min(3, Math.floor(v.length / 14));
        }
        if (score > 0 && (!best || score > best.score)) best = { coll: colls[c], index: k, item: item, score: score, hit: hit };
      }
    }
    return (best && best.score >= 3) ? best : null;
  }

  /* ── 6. UI ── */
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      '.ys-dm{display:flex;flex-direction:column;gap:.5rem;font:400 .82rem/1.5 "Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif}',
      '.ys-dm-head{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}',
      '.ys-dm-tag{font:700 .68rem/1 inherit;letter-spacing:.06em;text-transform:uppercase;',
      'background:#12294f;color:#fff;border-radius:.28rem;padding:.24rem .38rem}',
      '.ys-dm-path{color:#4a5a74}',
      '.ys-dm-note{color:#5b6b85;font-size:.76rem;margin:0}',
      '.ys-dm-item{display:flex;align-items:center;justify-content:space-between;gap:.4rem;',
      'border-top:1px solid #dfe5ef;padding-top:.4rem}',
      '.ys-dm-f{display:flex;flex-direction:column;gap:.16rem}',
      '.ys-dm-f>span{font-size:.72rem;color:#5b6b85}',
      '.ys-dm-f input,.ys-dm-f textarea,.ys-dm-filter{font:400 .82rem/1.45 inherit;color:#0d1b2f;',
      'border:1px solid #c6d0e0;border-radius:.34rem;padding:.34rem .44rem;background:#fff;width:100%;box-sizing:border-box}',
      '.ys-dm-f textarea{min-height:4.4rem;resize:vertical}',
      '.ys-dm-f.is-hit>span{color:#0d5c3a;font-weight:700}',
      '.ys-dm-act{display:flex;gap:.35rem;flex-wrap:wrap}',
      '.ys-dm-btn{font:600 .78rem/1 inherit;cursor:pointer;border:1px solid #c6d0e0;background:#eef2f9;',
      'color:#12294f;border-radius:.34rem;padding:.4rem .56rem}',
      '.ys-dm-btn:hover{background:#fff}',
      '.ys-dm-btn.is-primary{background:#12294f;border-color:#12294f;color:#fff}',
      '.ys-dm-list{display:flex;flex-direction:column;gap:.16rem;max-height:16rem;overflow:auto}',
      '.ys-dm-list h5{margin:.3rem 0 .1rem;font-size:.72rem;color:#5b6b85}',
      '.ys-dm-pick{text-align:left;font:400 .8rem/1.4 inherit;cursor:pointer;border:0;background:transparent;',
      'color:#12294f;padding:.22rem .3rem;border-radius:.28rem}',
      '.ys-dm-pick:hover{background:#eef2f9}'
    ].join('');
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = css;
    var head = document.head || document.documentElement;
    head.insertBefore(st, head.firstChild);
  }

  function shell(host, owner) {
    ensureStyle();
    var d = host.ownerDocument || document;
    host.innerHTML = '';
    var root = d.createElement('div');
    root.className = 'ys-dm';
    root.setAttribute(Y.config.uiAttr, '');
    root.innerHTML =
      '<div class="ys-dm-head"><span class="ys-dm-tag">data.js</span>' +
      '<span class="ys-dm-path">#' + U.esc(owner.containerId) + ' · ' + U.esc(owner.dataPath) + '</span></div>' +
      '<p class="ys-dm-note">이 영역은 assets/js/data.js 가 그립니다. 화면에서 직접 고칠 수 없으니 아래 값을 고치세요.</p>' +
      '<div class="ys-dm-body"></div>';
    host.appendChild(root);
    return root.querySelector('.ys-dm-body');
  }

  /** 항목 선택 목록 */
  function renderList(host, owner, onPick) {
    var body = shell(host, owner), d = host.ownerDocument || document;
    var filter = d.createElement('input');
    filter.className = 'ys-dm-filter';
    filter.type = 'search';
    filter.placeholder = '항목 검색';
    var list = d.createElement('div');
    list.className = 'ys-dm-list';
    body.appendChild(filter);
    body.appendChild(list);

    var rows = [];
    for (var c = 0; c < owner.colls.length; c++) {
      var coll = owner.colls[c], arrNode = state.root.props[coll];
      if (!arrNode || arrNode.type !== 'array') continue;
      var h = d.createElement('h5');
      h.textContent = coll + '[] · ' + arrNode.items.length + '개';
      list.appendChild(h);
      for (var k = 0; k < arrNode.items.length; k++) {
        var item = plain(arrNode.items[k]);
        if (!item || typeof item !== 'object') continue;
        var b = d.createElement('button');
        b.type = 'button';
        b.className = 'ys-dm-pick';
        b.textContent = itemLabel(item, coll, k);
        b.setAttribute('data-coll', coll);
        b.setAttribute('data-index', String(k));
        list.appendChild(b);
        rows.push(b);
      }
    }
    list.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.ys-dm-pick') : null;
      if (!b) return;
      onPick(b.getAttribute('data-coll'), Number(b.getAttribute('data-index')));
    });
    filter.addEventListener('input', function () {
      var q = norm(filter.value).toLowerCase();
      for (var i = 0; i < rows.length; i++) {
        rows[i].hidden = !!q && rows[i].textContent.toLowerCase().indexOf(q) < 0;
      }
    });
    if (!rows.length) {
      var p = d.createElement('p');
      p.className = 'ys-dm-note';
      p.textContent = '이 컨테이너에 대응하는 데이터 항목이 없습니다.';
      body.appendChild(p);
    }
  }

  /** 항목 필드 편집 폼 */
  function renderForm(host, owner, coll, index, hitKey) {
    var arrNode = state.root.props[coll];
    var itemNode = arrNode && arrNode.type === 'array' ? arrNode.items[index] : null;
    if (!itemNode) { renderList(host, owner, function (c, i) { renderForm(host, owner, c, i, null); }); return; }

    var item = plain(itemNode);
    var body = shell(host, owner), d = host.ownerDocument || document;

    var head = d.createElement('div');
    head.className = 'ys-dm-item';
    head.innerHTML = '<b>' + U.esc(coll) + '[' + index + ']</b>';
    var alt = d.createElement('button');
    alt.type = 'button';
    alt.className = 'ys-dm-btn';
    alt.textContent = '다른 항목 선택';
    alt.addEventListener('click', function () {
      renderList(host, owner, function (c, i) { renderForm(host, owner, c, i, null); });
    });
    head.appendChild(alt);
    body.appendChild(head);

    var fs = fieldsOf(item, '', 0, []), inputs = [];
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      var lab = d.createElement('label');
      lab.className = 'ys-dm-f' + (hitKey && f.key === hitKey ? ' is-hit' : '');
      var sp = d.createElement('span');
      sp.textContent = f.key + (f.kind === 'number' ? ' (숫자)' : '');
      var inp;
      if (f.kind === 'string' && String(f.value).length > 90) {
        inp = d.createElement('textarea');
      } else {
        inp = d.createElement('input');
        inp.type = 'text';
      }
      inp.value = String(f.value);
      lab.appendChild(sp);
      lab.appendChild(inp);
      body.appendChild(lab);
      inputs.push({ f: f, inp: inp, was: String(f.value) });
    }
    if (!fs.length) {
      var none = d.createElement('p');
      none.className = 'ys-dm-note';
      none.textContent = '이 항목에는 편집할 문자열 필드가 없습니다.';
      body.appendChild(none);
    }

    var act = d.createElement('div');
    act.className = 'ys-dm-act';
    var save = d.createElement('button');
    save.type = 'button';
    save.className = 'ys-dm-btn is-primary';
    save.textContent = '데이터 저장';
    var reset = d.createElement('button');
    reset.type = 'button';
    reset.className = 'ys-dm-btn';
    reset.textContent = '입력 되돌리기';
    act.appendChild(save);
    act.appendChild(reset);
    body.appendChild(act);

    reset.addEventListener('click', function () {
      for (var j = 0; j < inputs.length; j++) inputs[j].inp.value = inputs[j].was;
    });

    save.addEventListener('click', function () {
      var edits = [], j;
      for (j = 0; j < inputs.length; j++) {
        var v = inputs[j].inp.value;
        if (v === inputs[j].was) continue;
        edits.push({ path: [coll, index].concat(inputs[j].f.path), kind: inputs[j].f.kind, value: v });
      }
      if (!edits.length) { Y.toast('바뀐 값이 없습니다.', 'warn'); return; }
      save.disabled = true;
      var n = 0;
      try { n = applyEdits(edits); }
      catch (e) { save.disabled = false; Y.toast(e.message, 'error'); return; }
      persist().then(function () {
        save.disabled = false;
        for (j = 0; j < inputs.length; j++) inputs[j].was = inputs[j].inp.value;
        Y.toast('data.js 초안에 ' + n + '개 값을 저장했습니다. 이 영역은 새로고침 후 반영됩니다.');
      }, function (e) {
        save.disabled = false;
        Y.toast(e && e.message ? e.message : '초안 저장 실패', 'error');
      });
    });
  }

  /* ── 7. 공개 API ── */
  var api = Y.datamap = {
    PATH: DATA_PATH,
    MAP: MAP,

    /** 라이브 요소가 data.js 소유 영역 안인가 */
    ownerOf: function (liveEl) {
      var o = ownerOf(liveEl);
      return o ? { containerId: o.containerId, dataPath: o.dataPath, colls: o.colls, page: o.page } : null;
    },

    /** 미저장 data.js 초안이 있는가 */
    hasDraft: function () { return !!draftFlag; },

    /** 원문 확보 (HUD 등이 미리 데워 둘 때) */
    load: function () { return ensure(); },

    /** data.js 초안 버리기 */
    discardDraft: function () {
      return Y.store.del('drafts', DATA_PATH).then(function () {
        if (state) { state.src = state.origSrc; reparse(); }
        draftFlag = false;
        emitDirty();
      });
    },

    /**
     * hostEl 에 필드 편집 UI 를 그린다.
     * @returns Promise<boolean> — data.js 소유가 아니면 false(호스트를 건드리지 않는다)
     */
    openFor: function (liveEl, hostEl) {
      var owner = ownerOf(liveEl);
      if (!owner || !hostEl) return Promise.resolve(false);
      var pub = { containerId: owner.containerId, dataPath: owner.dataPath, colls: owner.colls, page: owner.page };

      var clickText = norm(liveEl.textContent).slice(0, 200);
      var root = itemRootOf(liveEl, owner.container);
      var itemText = norm(root && root.textContent).slice(0, 600);

      hostEl.textContent = 'data.js 를 불러오는 중…';
      return ensure().then(function () {
        var found = findItem(owner.colls, clickText, itemText);
        if (found) renderForm(hostEl, pub, found.coll, found.index, found.hit);
        else renderList(hostEl, pub, function (c, i) { renderForm(hostEl, pub, c, i, null); });
        return true;
      }, function (e) {
        hostEl.textContent = '';
        Y.toast(e && e.message ? e.message : 'data.js 를 불러올 수 없습니다.', 'error');
        return false;
      });
    }
  };

  /* 초안 유무를 미리 알아 둔다(버튼 배지·게시 요약용) */
  Y.store.get('drafts', DATA_PATH).then(function (d) {
    if (d && typeof d.src === 'string' && d.src !== d.origSrc) { draftFlag = true; emitDirty(); }
  }, function () {});
})();
