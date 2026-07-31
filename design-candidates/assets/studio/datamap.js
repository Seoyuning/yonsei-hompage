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
    newsGrid: { page: 'H-academic.html', colls: ['newsList'], label: 'newsList[]', human: '연구 소식 목록' },
    ntList: { page: 'H-academic.html', colls: ['noticesUG', 'noticesGrad'], label: 'noticesUG[] + noticesGrad[]', human: '공지사항 목록' },
    smList: { page: 'H-academic.html', colls: ['seminars'], label: 'seminars[]', human: '세미나 목록' },
    areaGrid: { page: 'H-academic.html', colls: ['clusters'], label: 'clusters[]', human: '연구 분야 카드' },
    pGrid: { page: 'H-academic.html', colls: ['professors'], label: 'professors[] (화면 순서는 무작위 셔플)', human: '교수진 카드' },
    /* G-people */
    rows: { page: 'G-people.html', colls: ['professors'], label: 'professors[]', human: '교수진 목록' },
    cChips: { page: 'G-people.html', colls: ['clusters'], label: 'clusters[]', human: '연구 분야 고르기' },
    /* G-research */
    fieldGrid: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]', human: '연구 분야·연구실' },
    clusterBlocks: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]', human: '연구 분야·연구실' },
    statRow: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]', human: '연구 분야·연구실' },
    lvGroups: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]', human: '연구 분야·연구실' },
    internSum: { page: 'G-research.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]', human: '연구 분야·연구실' },
    /* G-news */
    newsRows: { page: 'G-news.html', colls: ['newsList'], label: 'newsList[]', human: '연구 소식 목록' },
    semRows: { page: 'G-news.html', colls: ['seminars'], label: 'seminars[]', human: '세미나 목록' },
    evtRows: { page: 'G-news.html', colls: ['events'], label: 'events[]', human: '행사 목록' },
    /* G-graduate */
    gradClusterBlocks: { page: 'G-graduate.html', colls: ['clusters', 'labs'], label: 'clusters[] + labs[]', human: '연구 분야·연구실' },
    /* G-admissions */
    schInternal: { page: 'G-admissions.html', colls: ['scholarshipsInternal'], label: 'scholarshipsInternal[]', human: '교내 장학 목록' }
  };
  /* 표에는 없지만 같은 방식으로 data.js 가 그리는 컨테이너(조사 결과 보강) */
  MAP.eagleStage = { page: 'G-research.html', colls: ['clusters'], label: 'clusters[]', human: '연구 분야' };
  MAP.eagleList = { page: 'G-research.html', colls: ['clusters'], label: 'clusters[]', human: '연구 분야' };

  function humanOf(id) { return (MAP[id] && MAP[id].human) || '목록'; }
  function collName(k) { return Y.labels ? Y.labels.collOf(k) : k; }
  function fieldName(k) { return Y.labels ? Y.labels.fieldOf(k) : k; }

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
      if (!node) throw new Error('저장할 위치를 찾지 못했습니다. 화면을 새로고침한 뒤 다시 시도해 주세요.');
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

  /* ── 3-2. 배열 항목 추가·삭제 (공지·소식 등록) ──
     새 항목도 재직렬화 없이 **원문에 텍스트를 끼워 넣는** 방식으로 만든다.
     들여쓰기는 파일에서 읽어 내 그대로 흉내 낸다 → diff 가 새 항목만 잡힌다. */

  function arrayOf(coll) {
    var arr = state.root.props[coll];
    if (!arr || arr.type !== 'array') throw new Error('데이터 배열을 찾을 수 없습니다: ' + coll);
    return arr;
  }

  /** 배열의 들여쓰기 규칙을 원문에서 읽어 낸다. */
  function arrayStyle(arr) {
    var src = state.src;
    var lineM = /\n([ \t]*)[^\n]*$/.exec(src.slice(0, arr.start));
    var baseIndent = lineM ? lineM[1] : '';
    if (arr.items.length) {
      var sep = src.slice(arr.start + 1, arr.items[0].start);
      var im = /\n([ \t]*)$/.exec(sep);
      var itemIndent = im ? im[1] : baseIndent + ' ';
      var fm = /\n([ \t]*)/.exec(src.slice(arr.items[0].start, arr.items[0].end));
      return {
        sep: im ? sep : '\n' + itemIndent,
        itemIndent: itemIndent,
        fieldIndent: fm ? fm[1] : itemIndent + ' ',
        baseIndent: baseIndent
      };
    }
    return {
      sep: '\n' + baseIndent + ' ',
      itemIndent: baseIndent + ' ',
      fieldIndent: baseIndent + '  ',
      baseIndent: baseIndent
    };
  }

  /** 객체를 원문 스타일의 JSON 리터럴로 만든다. */
  function objLiteral(obj, style) {
    var keys = Object.keys(obj), lines = [];
    for (var i = 0; i < keys.length; i++) {
      var v = obj[keys[i]];
      var lit = (typeof v === 'number' || typeof v === 'boolean' || v === null)
        ? JSON.stringify(v) : JSON.stringify(String(v));
      lines.push(style.fieldIndent + JSON.stringify(keys[i]) + ': ' + lit);
    }
    if (!lines.length) return '{}';
    return '{\n' + lines.join(',\n') + '\n' + style.itemIndent + '}';
  }

  /** 원문을 바꾸고 다시 파싱한다. 깨지면 되돌린다(초안 오염 방지). */
  function spliceSrc(from, to, text) {
    var before = state.src;
    state.src = before.slice(0, from) + text + before.slice(to);
    try { reparse(); }
    catch (e) { state.src = before; reparse(); throw e; }
  }

  function insertItem(coll, obj, atFront) {
    var arr = arrayOf(coll), style = arrayStyle(arr);
    var lit = objLiteral(obj, style);
    if (!arr.items.length) {
      spliceSrc(arr.start + 1, arr.start + 1, '\n' + style.itemIndent + lit + '\n' + style.baseIndent);
      return 0;
    }
    if (atFront === false) {
      var last = arr.items[arr.items.length - 1];
      spliceSrc(last.end, last.end, ',' + style.sep + lit);
      return arr.items.length;
    }
    spliceSrc(arr.items[0].start, arr.items[0].start, lit + ',' + style.sep);
    return 0;
  }

  function deleteItem(coll, index) {
    var arr = arrayOf(coll), it = arr.items[index];
    if (!it) throw new Error('삭제할 항목이 없습니다: ' + coll + '[' + index + ']');
    var from, to;
    if (arr.items.length === 1) { from = arr.start + 1; to = arr.end - 1; }
    else if (index < arr.items.length - 1) { from = it.start; to = arr.items[index + 1].start; }
    else { from = arr.items[index - 1].end; to = it.end; }
    spliceSrc(from, to, '');
  }

  /* ── 4. 소유 판별 ── */
  function ownerOf(el) {
    var cur = el;
    while (cur && cur.nodeType === 1) {
      var id = cur.id;
      if (id && MAP[id]) {
        return { containerId: id, dataPath: MAP[id].label, human: MAP[id].human, colls: MAP[id].colls, page: MAP[id].page, container: cur };
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
      '<div class="ys-dm-head"><span class="ys-dm-tag">목록</span>' +
      '<span class="ys-dm-path">' + U.esc(owner.human || humanOf(owner.containerId)) + '</span></div>' +
      '<p class="ys-dm-note">여러 페이지가 함께 쓰는 목록입니다. 아래에서 고치면 이 목록이 나오는 모든 곳에 같이 바뀝니다.</p>' +
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
    filter.placeholder = '글 제목으로 찾기';
    var list = d.createElement('div');
    list.className = 'ys-dm-list';
    body.appendChild(filter);
    body.appendChild(list);

    var rows = [];
    for (var c = 0; c < owner.colls.length; c++) {
      var coll = owner.colls[c], arrNode = state.root.props[coll];
      if (!arrNode || arrNode.type !== 'array') continue;
      var h = d.createElement('h5');
      h.textContent = collName(coll) + ' · ' + arrNode.items.length + '개';
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
      p.textContent = '이 목록에는 아직 등록된 글이 없습니다.';
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
    head.innerHTML = '<b>' + U.esc(collName(coll) + ' · ' + itemLabel(item, coll, index)) + '</b>';
    var alt = d.createElement('button');
    alt.type = 'button';
    alt.className = 'ys-dm-btn';
    alt.textContent = '다른 글 고르기';
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
      /* 중첩 필드(a.b)는 단계마다 옮긴다 — 화면에 내부 키가 남지 않게 */
      var parts = String(f.key).split('.'), human = [];
      for (var pi = 0; pi < parts.length; pi++) human.push(fieldName(parts[pi]));
      sp.textContent = human.join(' › ') + (f.kind === 'number' ? ' (숫자)' : '');
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
      none.textContent = '이 글에는 고칠 수 있는 칸이 없습니다.';
      body.appendChild(none);
    }

    var act = d.createElement('div');
    act.className = 'ys-dm-act';
    var save = d.createElement('button');
    save.type = 'button';
    save.className = 'ys-dm-btn is-primary';
    save.textContent = '저장';
    var reset = d.createElement('button');
    reset.type = 'button';
    reset.className = 'ys-dm-btn';
    reset.textContent = '되돌리기';
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
      if (!edits.length) { Y.toast('바뀐 내용이 없습니다.', 'warn'); return; }
      save.disabled = true;
      var n = 0;
      try { n = applyEdits(edits); }
      catch (e) { save.disabled = false; Y.toast(e.message, 'error'); return; }
      persist().then(function () {
        save.disabled = false;
        for (j = 0; j < inputs.length; j++) inputs[j].was = inputs[j].inp.value;
        Y.toast(n + '개 항목을 저장했습니다. 「게시」를 눌러야 사이트에 반영됩니다.');
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
      return o ? { containerId: o.containerId, dataPath: o.dataPath, human: o.human, colls: o.colls, page: o.page } : null;
    },

    /** 미저장 data.js 초안이 있는가 */
    hasDraft: function () { return !!draftFlag; },

    /** 원문 확보 (HUD 등이 미리 데워 둘 때) */
    load: function () { return ensure(); },

    /** 배열 항목 목록 — [{index, item, pending}] (ensure() 뒤에 부를 것)
        pending = 아직 게시되지 않은 항목. 삽입은 원문 텍스트를 그대로 끼워 넣으므로
        그 조각이 게시본(origSrc)에 없으면 새 항목이다. */
    items: function (coll) {
      var arr = state && state.root && state.root.props[coll];
      if (!arr || arr.type !== 'array') return [];
      var out = [], orig = state.origSrc || '';
      for (var i = 0; i < arr.items.length; i++) {
        var lit = state.src.slice(arr.items[i].start, arr.items[i].end);
        out.push({ index: i, item: plain(arr.items[i]), pending: orig.indexOf(lit) < 0 });
      }
      return out;
    },

    /** 첫 항목에서 필드 모양을 읽어 낸다 — [{key, kind}] */
    /* 첫 항목 하나만 보면 그 글에 없는 칸은 등록 폼에 아예 안 나온다 —
       예를 들어 학부 공지 1번 글에 attName 이 없으면 첨부 파일명을 적을 칸이 사라진다.
       앞쪽 여러 항목의 키를 합쳐, 이 목록이 실제로 쓰는 칸을 모두 보여 준다.
       차례는 먼저 나온 키를 앞에 둔다(첫 글의 순서가 곧 사람들이 아는 순서다). */
    shapeOf: function (coll) {
      var arr = state && state.root && state.root.props[coll];
      if (!arr || arr.type !== 'array' || !arr.items.length) return [];
      var out = [], seen = {};
      var n = Math.min(arr.items.length, 24);
      for (var j = 0; j < n; j++) {
        var o = plain(arr.items[j]) || {}, keys = Object.keys(o);
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i], v = o[k];
          if (seen[k]) continue;
          if (v && typeof v === 'object') continue;           // 중첩은 등록 폼에서 다루지 않는다
          seen[k] = 1;
          out.push({ key: k, kind: typeof v === 'boolean' ? 'bool' : (typeof v === 'number' ? 'number' : 'string') });
        }
      }
      return out;
    },

    /** 새 항목 등록 — 기본은 맨 앞(최신) */
    addItem: function (coll, obj, atFront) {
      return ensure().then(function () {
        var at = insertItem(coll, obj, atFront);
        return persist().then(function () { return at; });
      });
    },

    /** 항목 삭제 */
    removeItem: function (coll, index) {
      return ensure().then(function () {
        deleteItem(coll, index);
        return persist();
      });
    },

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
      var pub = { containerId: owner.containerId, dataPath: owner.dataPath, human: owner.human, colls: owner.colls, page: owner.page };

      var clickText = norm(liveEl.textContent).slice(0, 200);
      var root = itemRootOf(liveEl, owner.container);
      var itemText = norm(root && root.textContent).slice(0, 600);

      hostEl.textContent = '목록을 불러오는 중…';
      return ensure().then(function () {
        var found = findItem(owner.colls, clickText, itemText);
        if (found) renderForm(hostEl, pub, found.coll, found.index, found.hit);
        else renderList(hostEl, pub, function (c, i) { renderForm(hostEl, pub, c, i, null); });
        return true;
      }, function (e) {
        hostEl.textContent = '';
        Y.toast(e && e.message ? e.message : '목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 'error');
        return false;
      });
    }
  };

  /* 초안 유무를 미리 알아 둔다(버튼 배지·게시 요약용) */
  Y.store.get('drafts', DATA_PATH).then(function (d) {
    if (d && typeof d.src === 'string' && d.src !== d.origSrc) { draftFlag = true; emitDirty(); }
  }, function () {});

  /* 게시가 끝나면 지금 내용이 새 기준선이다. 이걸 갱신하지 않으면 다음 data.js 편집 때
     이미 게시된 변경까지 초안에 다시 실려 diff 가 부풀고 되돌리기 기준이 어긋난다. */
  Y.bus.on('publish:done', function (info) {
    if (!state) { draftFlag = false; return; }
    state.origSrc = state.src;
    if (info && info.sha) state.baseSha = info.sha;
    draftFlag = false;
    emitDirty();
  });
})();
