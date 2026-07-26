/* YSME In-Place Studio — 두 시점의 "사람이 읽는 변경 목록"

   시점 비교를 줄 단위 코드 diff 로 보여 주면 조교 사용자는 읽을 수 없다.
   이 모듈은 옛 원문과 지금 원문을 받아 **무엇이 · 어디서 · 어떻게** 바뀌었는지를
   문장으로 뽑아낸다.

   HTML: 두 문서를 align.js 로 짝지어(구조가 바뀌어도 LCS 로 따라간다) 짝별로
         텍스트·스타일·속성을 비교한다. 짝이 없으면 추가/삭제.
   data.js: window.YSME 의 순수 JSON 을 파싱해 배열 항목을 제목으로 짝지어 비교한다.
   en.json: 사전 키(한국어 원문) 기준으로 비교한다.

   반환하는 각 변경 기록은 versions.js 가 카드로 그린다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.changes) return;

  /* ── 사람 말 사전 ── */
  var ROLE = {
    h1: '큰 제목', h2: '제목', h3: '소제목', h4: '소제목', h5: '소제목', h6: '소제목',
    p: '문단', a: '링크', li: '목록 항목', td: '표 칸', th: '표 머리',
    button: '버튼', label: '입력 라벨', figcaption: '사진 설명',
    strong: '강조 글자', b: '강조 글자', em: '기울임 글자', span: '글자',
    img: '이미지', div: '영역', section: '구역', dt: '항목 이름', dd: '항목 설명'
  };
  var STYLE_LABEL = {
    'font-size': '글자 크기', 'font-weight': '굵기', 'line-height': '행간',
    'text-align': '정렬', 'color': '글자 색', 'background-color': '배경색',
    'margin': '바깥 여백', 'padding': '안쪽 여백', 'letter-spacing': '자간'
  };
  var ATTR_LABEL = {
    href: '링크 주소', src: '이미지 주소', alt: '대체 텍스트',
    title: '툴팁', 'aria-label': '읽기 라벨', 'data-count': '카운트 숫자'
  };
  var WATCH_ATTRS = ['href', 'src', 'alt', 'title', 'aria-label', 'data-count'];

  var DATA_LABEL = {
    noticesUG: '학부 공지', noticesGrad: '대학원 공지', newsList: '연구 소식',
    seminars: '세미나', events: '행사', professors: '교수', labs: '연구실',
    clusters: '연구 분야', courses: '교과목', coursesUG: '학부 교과목',
    coursesGrad: '대학원 교과목', jobs: '채용', posts: '게시글',
    scholarshipsInternal: '교내 장학', scholarshipsExternal: '교외 장학',
    curriculum: '교육과정', history: '연혁', pages: '페이지', site: '사이트 기본값'
  };
  var FIELD_LABEL = {
    no: '번호', title: '제목', date: '날짜', url: '링크', att: '첨부',
    thumb: '썸네일', name: '이름', rank: '직위', email: '이메일', tel: '전화',
    room: '호실', lab: '연구실', cluster: '분야', desc: '설명', ko: '한국어', en: '영어'
  };

  function roleOf(tag) { return ROLE[tag] || tag; }
  function fieldLabel(k) { return FIELD_LABEL[k] || k; }
  function collLabel(k) { return DATA_LABEL[k] || k; }
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function clip(s, n) { s = norm(s); return s.length > n ? s.slice(0, n) + '…' : s; }

  /* ── HTML: 문서 → 전위 순회 요소 배열 (source.zip 과 같은 순서) ── */
  function preorder(root) {
    var out = [], stack = [root];
    while (stack.length) {
      var el = stack.pop();
      out.push(el);
      for (var i = el.children.length - 1; i >= 0; i--) stack.push(el.children[i]);
    }
    return out;
  }

  function parseDoc(src) {
    try { return new DOMParser().parseFromString(String(src), 'text/html'); }
    catch (e) { return null; }
  }

  function isLeaf(el) {
    if (el.children.length) return false;
    return !/^(script|style|textarea|title|img|br|hr|input|meta|link|source|track|iframe|svg|canvas|video|audio|use|path)$/
      .test(el.tagName.toLowerCase());
  }

  /** 요소 위치를 사람 말로 — 그 앞에 나온 가장 가까운 제목을 쓴다. */
  function whereIndex(nodes) {
    var heads = [];
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].tagName.toLowerCase();
      if (/^h[1-3]$/.test(t)) {
        var txt = norm(nodes[i].textContent);
        if (txt) heads.push({ i: i, text: clip(txt, 24) });
      }
    }
    return function (idx) {
      /* 바뀐 것이 제목 자신이면 바로 앞 제목(= 다른 구역)을 가리키면 안 된다.
         자기 텍스트로 자기 구역을 가리킨다. */
      var el2 = nodes[idx];
      if (el2 && /^h[1-3]$/.test(el2.tagName.toLowerCase())) {
        var own = clip(norm(el2.textContent), 24);
        return own ? '「' + own + '」 구역' : '구역 제목';
      }
      var best = '';
      for (var k = 0; k < heads.length; k++) {
        if (heads[k].i < idx) best = heads[k].text; else break;
      }
      return best ? '「' + best + '」 부근' : '페이지 위쪽';
    };
  }

  function styleMap(text) {
    var m = {}, parts = String(text || '').split(';');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim(); if (!p) continue;
      var c = p.indexOf(':'); if (c < 0) continue;
      m[p.slice(0, c).trim().toLowerCase()] = p.slice(c + 1).trim();
    }
    return m;
  }

  /**
   * HTML 두 판본의 차이.
   * @returns [{type,where,role,label,before,after,idxNew,idxOld}]
   */
  function htmlChanges(oldSrc, newSrc) {
    var da = parseDoc(oldSrc), db = parseDoc(newSrc);
    if (!da || !db || !da.documentElement || !db.documentElement) return null;
    var A = preorder(da.documentElement);
    var map;
    try { map = Y.align(A, db.documentElement); }
    catch (e) { return null; }
    if (!map) return null;

    var B = preorder(db.documentElement);
    var whereA = whereIndex(A), whereB = whereIndex(B);
    var bIndexOf = new Map();
    for (var n = 0; n < B.length; n++) bIndexOf.set(B[n], n);

    var out = [], paired = new Set(), i;

    for (i = 0; i < A.length; i++) {
      var ea = A[i], eb = map.liveOf(i);
      var tag = ea.tagName.toLowerCase();
      if (!eb) {
        if (isLeaf(ea) && norm(ea.textContent)) {
          out.push({
            type: 'del', where: whereA(i), role: roleOf(tag), label: roleOf(tag) + ' 삭제',
            before: clip(ea.textContent, 120), after: '', idxNew: null
          });
        }
        continue;
      }
      var bi = bIndexOf.has(eb) ? bIndexOf.get(eb) : null;
      paired.add(eb);

      /* 텍스트 */
      if (isLeaf(ea) && isLeaf(eb)) {
        var ta = norm(ea.textContent), tb = norm(eb.textContent);
        if (ta !== tb) {
          out.push({
            type: 'text', where: whereB(bi == null ? i : bi), role: roleOf(tag),
            label: roleOf(tag) + ' 글 수정', before: clip(ta, 160), after: clip(tb, 160), idxNew: bi
          });
        }
      }

      /* 인라인 스타일 */
      var sa = styleMap(ea.getAttribute('style')), sb = styleMap(eb.getAttribute('style'));
      var props = {}, k;
      for (k in sa) props[k] = 1;
      for (k in sb) props[k] = 1;
      for (k in props) {
        if (sa[k] === sb[k]) continue;
        out.push({
          type: 'style', where: whereB(bi == null ? i : bi), role: roleOf(tag),
          label: (STYLE_LABEL[k] || k) + ' 변경',
          before: sa[k] || '(기본값)', after: sb[k] || '(기본값으로 되돌림)', idxNew: bi
        });
      }

      /* 눈에 띄는 속성 */
      for (var w = 0; w < WATCH_ATTRS.length; w++) {
        var an = WATCH_ATTRS[w];
        var va = ea.getAttribute(an), vb = eb.getAttribute(an);
        if ((va || '') === (vb || '')) continue;
        out.push({
          type: 'attr', where: whereB(bi == null ? i : bi), role: roleOf(tag),
          label: (ATTR_LABEL[an] || an) + ' 변경',
          before: clip(va || '(없음)', 90), after: clip(vb || '(없음)', 90), idxNew: bi
        });
      }
    }

    /* 새로 생긴 요소 */
    for (i = 0; i < B.length; i++) {
      if (paired.has(B[i])) continue;
      var e2 = B[i], t2 = e2.tagName.toLowerCase();
      if (!isLeaf(e2) || !norm(e2.textContent)) continue;
      /* 부모도 새로 생겼으면 부모 하나만 보고한다 */
      if (e2.parentElement && !paired.has(e2.parentElement) && e2.parentElement !== db.documentElement) continue;
      out.push({
        type: 'add', where: whereB(i), role: roleOf(t2), label: roleOf(t2) + ' 추가',
        before: '', after: clip(e2.textContent, 120), idxNew: i
      });
    }
    return out;
  }

  /* ── data.js ── */
  function parseYsme(src) {
    var s = String(src || '');
    var a = s.indexOf('{');
    var b = s.lastIndexOf('}');
    if (a < 0 || b <= a) return null;
    try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
  }

  function itemKey(it) {
    if (!it || typeof it !== 'object') return null;
    return norm(it.title || it.name || it.ko || it.label || it.code || '') || null;
  }

  /** 키 순서에 무관한 표준 문자열 — 항목이 "똑같은지"를 판정하는 기준 */
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (v instanceof Array) {
      var a = [];
      for (var i = 0; i < v.length; i++) a.push(canon(v[i]));
      return '[' + a.join(',') + ']';
    }
    var ks = Object.keys(v).sort(), o = [];
    for (var j = 0; j < ks.length; j++) o.push(JSON.stringify(ks[j]) + ':' + canon(v[ks[j]]));
    return '{' + o.join(',') + '}';
  }

  function dataChanges(oldSrc, newSrc) {
    var A = parseYsme(oldSrc), B = parseYsme(newSrc);
    if (!A || !B) return null;
    var out = [], keys = {}, k;
    for (k in A) keys[k] = 1;
    for (k in B) keys[k] = 1;

    for (k in keys) {
      var va = A[k] || [], vb = B[k] || [];
      if (!(va instanceof Array) || !(vb instanceof Array)) continue;
      var i;

      /* 1) 완전히 같은 항목끼리 먼저 상쇄한다.
            제목만으로 짝지으면 제목이 겹치는 서로 다른 항목(교과목 등)이 엮여
            바뀌지도 않은 필드가 "수정"으로 잡힌다. */
      var poolA = new Map();
      for (i = 0; i < va.length; i++) {
        var ca = canon(va[i]);
        if (!poolA.has(ca)) poolA.set(ca, []);
        poolA.get(ca).push(va[i]);
      }
      var leftB = [];
      for (i = 0; i < vb.length; i++) {
        var cb = canon(vb[i]);
        var bucket = poolA.get(cb);
        if (bucket && bucket.length) bucket.pop();
        else leftB.push(vb[i]);
      }
      var leftA = [];
      poolA.forEach(function (arr) { for (var n = 0; n < arr.length; n++) leftA.push(arr[n]); });
      if (!leftA.length && !leftB.length) continue;

      /* 2) 남은 것끼리 제목으로 짝짓는다. 제목이 겹치면 짝짓지 않는다(누가 누군지 알 수 없다). */
      var byTitle = new Map();
      for (i = 0; i < leftA.length; i++) {
        var ka = itemKey(leftA[i]);
        if (!ka) continue;
        byTitle.set(ka, byTitle.has(ka) ? null : leftA[i]);
      }
      var used = new Set();

      for (i = 0; i < leftB.length; i++) {
        var it = leftB[i], key = itemKey(it);
        var prev = key ? byTitle.get(key) : null;
        if (!prev || used.has(prev)) {
          out.push({
            type: 'data-add', where: collLabel(k), role: collLabel(k),
            label: collLabel(k) + ' 새 글', before: '', after: clip(key || '(제목 없음)', 120)
          });
          continue;
        }
        used.add(prev);
        var f;
        for (f in it) {
          if (it[f] && typeof it[f] === 'object') continue;
          if (String(prev[f]) === String(it[f])) continue;
          out.push({
            type: 'data-edit', where: collLabel(k) + ' · ' + clip(key, 40), role: collLabel(k),
            label: fieldLabel(f) + ' 수정',
            before: clip(prev[f] == null ? '(없음)' : prev[f], 90),
            after: clip(it[f] == null ? '(없음)' : it[f], 90)
          });
        }
      }
      for (i = 0; i < leftA.length; i++) {
        if (used.has(leftA[i])) continue;
        out.push({
          type: 'data-del', where: collLabel(k), role: collLabel(k),
          label: collLabel(k) + ' 글 삭제', before: clip(itemKey(leftA[i]) || '(제목 없음)', 120), after: ''
        });
      }
    }
    return out;
  }

  /* ── en.json ── */
  function i18nChanges(oldSrc, newSrc) {
    var A, B;
    try { A = JSON.parse(oldSrc || '{}'); B = JSON.parse(newSrc || '{}'); }
    catch (e) { return null; }
    var out = [], k, keys = {};
    for (k in A) keys[k] = 1;
    for (k in B) keys[k] = 1;
    for (k in keys) {
      var a = A[k], b = B[k];
      if (a === b) continue;
      if (a === undefined) {
        out.push({ type: 'i18n', where: '영어 번역', role: '번역',
          label: '「' + clip(k, 40) + '」 번역 추가', before: '', after: clip(b, 120) });
      } else if (b === undefined) {
        out.push({ type: 'i18n', where: '영어 번역', role: '번역',
          label: '「' + clip(k, 40) + '」 번역 삭제', before: clip(a, 120), after: '' });
      } else {
        out.push({ type: 'i18n', where: '영어 번역', role: '번역',
          label: '「' + clip(k, 40) + '」 번역 수정', before: clip(a, 120), after: clip(b, 120) });
      }
    }
    return out;
  }

  /* ── 공개 API ── */
  Y.changes = {
    /**
     * 경로에 맞는 방식으로 두 판본의 변경을 뽑는다.
     * @returns {{ok:boolean, list:Array, reason?:string}}
     *   ok=false 면 의미 비교에 실패한 것이므로 호출부가 원문 비교로 물러선다.
     */
    of: function (path, oldSrc, newSrc) {
      if (oldSrc === newSrc) return { ok: true, list: [] };
      var p = String(path || '');
      var list = null;
      if (/\.html?$/i.test(p)) list = htmlChanges(oldSrc, newSrc);
      else if (/data\.js$/i.test(p)) list = dataChanges(oldSrc, newSrc);
      else if (/\.json$/i.test(p)) list = i18nChanges(oldSrc, newSrc);
      if (!list) return { ok: false, list: [], reason: '이 파일은 항목별로 비교할 수 없어 원문으로 보여 드립니다.' };
      return { ok: true, list: list };
    },

    /** 목록을 한 문장으로 — "글 3건 · 모양 1건 · 새 글 1건" */
    summarize: function (list) {
      var n = { text: 0, style: 0, attr: 0, add: 0, del: 0, data: 0, i18n: 0 };
      for (var i = 0; i < list.length; i++) {
        var t = list[i].type;
        if (t === 'text') n.text++;
        else if (t === 'style') n.style++;
        else if (t === 'attr') n.attr++;
        else if (t === 'add') n.add++;
        else if (t === 'del') n.del++;
        else if (t === 'i18n') n.i18n++;
        else n.data++;
      }
      var s = [];
      if (n.text) s.push('글 ' + n.text + '건');
      if (n.style) s.push('모양 ' + n.style + '건');
      if (n.attr) s.push('링크·속성 ' + n.attr + '건');
      if (n.add) s.push('추가 ' + n.add + '건');
      if (n.del) s.push('삭제 ' + n.del + '건');
      if (n.data) s.push('목록 데이터 ' + n.data + '건');
      if (n.i18n) s.push('영어 번역 ' + n.i18n + '건');
      return s.length ? s.join(' · ') : '바뀐 내용이 없습니다.';
    },

    _html: htmlChanges,
    _data: dataChanges,
    _i18n: i18nChanges
  };
})();
