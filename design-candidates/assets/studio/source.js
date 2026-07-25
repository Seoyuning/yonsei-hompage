/* YSME In-Place Studio — HTML 원문 스캐너 + 오프셋 편집 원시연산

   왜 필요한가: `documentElement.outerHTML` 로 저장하면 브라우저가 표기를 정규화해
   (`<meta … />` → `<meta …>`, 속성 인용부호·불리언 속성·엔티티 등) **아무것도 고치지 않아도
   파일 전체가 바뀐 것처럼** 보인다. 이 도구는 원문 문자열을 진실로 두고, 편집을
   해당 요소의 소스 구간만 갈아끼우는 방식으로 반영한다.
     · 무편집 저장  → 바이트 동일
     · 텍스트 1건 수정 → diff 1줄

   scan() 은 여는 태그를 만난 순서대로 요소를 담으므로 결과 배열이 곧 **문서 전순회(pre-order)**
   이고, DOMParser 로 만든 트리의 전순회와 1:1 로 대응한다(zip() 이 태그명으로 검증한다).
   대응이 깨지면(암묵 태그 삽입 등) 편집을 거부한다 — 저장본을 망가뜨리지 않는 것이 최우선이다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.source) return;

  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 };
  var RAW = { script: 1, style: 1, textarea: 1, title: 1 };
  var NBSP = String.fromCharCode(160);   // 원문의 &nbsp; 를 되살리기 위한 상수(리터럴로 두면 눈에 안 보인다)

  /* ── 1. 스캔 ── */
  function scan(src) {
    var els = [], stack = [], i = 0, n = src.length, err = null;
    while (i < n) {
      var lt = src.indexOf('<', i);
      if (lt < 0) break;
      var c = src.charAt(lt + 1);

      if (c === '!') {                                  // 주석 · doctype
        if (src.substr(lt, 4) === '<!--') { var ce = src.indexOf('-->', lt + 4); i = ce < 0 ? n : ce + 3; }
        else { var g = src.indexOf('>', lt); i = g < 0 ? n : g + 1; }
        continue;
      }
      if (c === '?') { var g2 = src.indexOf('>', lt); i = g2 < 0 ? n : g2 + 1; continue; }

      if (c === '/') {                                  // 닫는 태그
        var mc = /^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/.exec(src.slice(lt, lt + 80));
        if (!mc) { i = lt + 1; continue; }
        var cname = mc[1].toLowerCase(), endStart = lt, endEnd = lt + mc[0].length, found = -1, k;
        for (k = stack.length - 1; k >= 0; k--) { if (stack[k].tag === cname) { found = k; break; } }
        if (found < 0) { i = endEnd; continue; }         // 짝 없는 닫는 태그 → 무시
        for (k = stack.length - 1; k > found; k--) {     // 암묵적으로 종료된 요소
          var im = stack[k];
          im.innerEnd = endStart; im.endStart = endStart; im.endEnd = endStart; im.implicit = true;
        }
        var ce2 = stack[found];
        ce2.innerEnd = endStart; ce2.endStart = endStart; ce2.endEnd = endEnd;
        stack.length = found;
        i = endEnd;
        continue;
      }

      var mo = /^<([A-Za-z][A-Za-z0-9:-]*)/.exec(src.slice(lt, lt + 60));
      if (!mo) { i = lt + 1; continue; }                // 태그가 아닌 '<'
      var tag = mo[1].toLowerCase();
      var j = lt + mo[0].length, q = '';
      while (j < n) {                                   // 속성 구간 — 인용부호 안의 '>' 무시
        var ch = src.charAt(j);
        if (q) { if (ch === q) q = ''; j++; continue; }
        if (ch === '"' || ch === "'") { q = ch; j++; continue; }
        if (ch === '>') break;
        j++;
      }
      if (j >= n) { err = '태그가 닫히지 않았습니다: <' + tag; break; }
      var openEnd = j + 1, selfClose = src.charAt(j - 1) === '/';
      var el = { tag: tag, openStart: lt, openEnd: openEnd, innerStart: openEnd, innerEnd: -1, endStart: -1, endEnd: -1 };
      els.push(el);

      if (VOID[tag] || selfClose) {
        el.innerEnd = openEnd; el.endStart = openEnd; el.endEnd = openEnd; el.empty = true;
        i = openEnd; continue;
      }
      if (RAW[tag]) {                                   // 원시 텍스트 요소는 통째로 건너뛴다
        var re = new RegExp('</' + tag + '\\s*>', 'i');
        var mm = re.exec(src.slice(openEnd));
        if (!mm) { el.innerEnd = n; el.endStart = n; el.endEnd = n; el.unclosed = true; i = n; continue; }
        var rc = openEnd + mm.index;
        el.innerEnd = rc; el.endStart = rc; el.endEnd = rc + mm[0].length; el.raw = true;
        i = el.endEnd; continue;
      }
      stack.push(el);
      i = openEnd;
    }
    for (var s = 0; s < stack.length; s++) {
      var u = stack[s]; u.innerEnd = n; u.endStart = n; u.endEnd = n; u.unclosed = true;
    }
    return { ok: !err, error: err, els: els };
  }

  /* ── 2. DOM 전순회와 대응 검증 ── */
  function preorder(root) {
    var out = [];
    (function walk(el) {
      out.push(el);
      var kids = el.children;
      for (var i = 0; i < kids.length; i++) walk(kids[i]);
    })(root);
    return out;
  }

  /** doc(DOMParser 결과)과 scan() 결과를 짝짓는다.
   *  성공: {ok:true, els, nodes}  — 같은 인덱스가 같은 요소(= eid)
   *  실패: {ok:false, reason}     — 이 페이지는 오프셋 편집을 쓰지 않는다 */
  function zip(doc, scanned) {
    if (!scanned.ok) return { ok: false, reason: scanned.error };
    var nodes = preorder(doc.documentElement);
    var els = scanned.els;
    // 스캐너는 <html> 부터, DOM 전순회도 <html> 부터 시작한다.
    if (els.length !== nodes.length) {
      return { ok: false, reason: '요소 수 불일치 (원문 ' + els.length + ' / DOM ' + nodes.length + ')' };
    }
    for (var i = 0; i < els.length; i++) {
      var a = els[i].tag, b = nodes[i].tagName.toLowerCase();
      if (a !== b) return { ok: false, reason: i + '번째 요소 불일치 (원문 <' + a + '> / DOM <' + b + '>)' };
    }
    return { ok: true, els: els, nodes: nodes };
  }

  /* ── 3. 속성 토큰화 ── */
  function attrList(src, el) {
    var s = src.slice(el.openStart, el.openEnd), out = [], i = 1, base = el.openStart;
    while (i < s.length && /[A-Za-z0-9:-]/.test(s.charAt(i))) i++;      // 태그명 통과
    while (i < s.length) {
      while (i < s.length && /\s/.test(s.charAt(i))) i++;
      var ch = s.charAt(i);
      if (!ch || ch === '>') break;
      if (ch === '/') { i++; continue; }
      var ns = i;
      while (i < s.length && !/[\s=>/]/.test(s.charAt(i))) i++;
      var name = s.slice(ns, i);
      if (!name) { i++; continue; }
      var rec = {
        name: name.toLowerCase(), raw: name,
        nameStart: base + ns, nameEnd: base + i,
        value: null, valStart: -1, valEnd: -1, quote: ''
      };
      var save = i;
      while (i < s.length && /\s/.test(s.charAt(i))) i++;
      if (s.charAt(i) === '=') {
        i++;
        while (i < s.length && /\s/.test(s.charAt(i))) i++;
        var q = s.charAt(i);
        if (q === '"' || q === "'") {
          var e = s.indexOf(q, i + 1); if (e < 0) e = s.length;
          rec.quote = q; rec.valStart = base + i + 1; rec.valEnd = base + e; rec.value = s.slice(i + 1, e);
          i = e + 1;
        } else {
          var vs = i;
          while (i < s.length && !/[\s>]/.test(s.charAt(i))) i++;
          rec.valStart = base + vs; rec.valEnd = base + i; rec.value = s.slice(vs, i);
        }
      } else { i = save; }
      out.push(rec);
    }
    return out;
  }
  function findAttr(src, el, name) {
    var list = attrList(src, el), lc = String(name).toLowerCase();
    for (var i = 0; i < list.length; i++) if (list[i].name === lc) return list[i];
    return null;
  }

  /* ── 4. 편집 원시연산 (모두 새 문자열을 반환. 이후 재스캔이 필요하다) ── */
  function splice(src, start, end, ins) { return src.slice(0, start) + ins + src.slice(end); }

  function decodeEntities(s) {
    var t = document.createElement('textarea');
    t.innerHTML = String(s == null ? '' : s);
    return t.value;
  }
  function encodeText(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .split(NBSP).join('&nbsp;');
  }
  function encodeAttr(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .split(NBSP).join('&nbsp;');
  }

  var api = Y.source = {
    scan: scan,
    zip: zip,
    attrList: attrList,
    decodeEntities: decodeEntities,
    encodeText: encodeText,
    encodeAttr: encodeAttr,

    outer: function (src, el) { return src.slice(el.openStart, el.endEnd); },
    inner: function (src, el) { return src.slice(el.innerStart, el.innerEnd); },
    openTag: function (src, el) { return src.slice(el.openStart, el.openEnd); },

    /** 요소의 표시용 텍스트(엔티티 해석). 텍스트 리프에서만 의미가 있다. */
    text: function (src, el) { return decodeEntities(src.slice(el.innerStart, el.innerEnd)); },

    /** 텍스트 리프의 내용 교체 */
    setText: function (src, el, text) {
      return splice(src, el.innerStart, el.innerEnd, encodeText(text));
    },

    setInner: function (src, el, html) { return splice(src, el.innerStart, el.innerEnd, html); },
    setOuter: function (src, el, html) { return splice(src, el.openStart, el.endEnd, html); },

    getAttr: function (src, el, name) {
      var a = findAttr(src, el, name);
      return a ? (a.value == null ? '' : decodeEntities(a.value)) : null;
    },

    /** 속성 설정. value 가 null/undefined 면 속성을 제거한다. */
    setAttr: function (src, el, name, value) {
      var a = findAttr(src, el, name);
      if (value == null) {
        if (!a) return src;
        var st = a.nameStart, en = (a.valEnd >= 0 ? a.valEnd + (a.quote ? 1 : 0) : a.nameEnd);
        while (st > el.openStart + 1 && /\s/.test(src.charAt(st - 1))) st--;   // 앞 공백까지 제거
        return splice(src, st, en, '');
      }
      var enc = encodeAttr(value);
      if (a) {
        if (a.valStart >= 0) return splice(src, a.valStart, a.valEnd, enc);
        return splice(src, a.nameEnd, a.nameEnd, '="' + enc + '"');            // 불리언 속성 → 값 부여
      }
      var at = el.openEnd - 1;                                                  // '>' 앞
      if (src.charAt(at - 1) === '/') at -= 1;                                  // '<meta … />' 의 '/' 앞
      var pre = /\s/.test(src.charAt(at - 1)) ? '' : ' ';
      return splice(src, at, at, pre + name + '="' + enc + '"');
    },

    /** 요소가 놓인 줄의 들여쓰기 문자열 */
    indentOf: function (src, el) {
      var nl = src.lastIndexOf('\n', el.openStart);
      var head = src.slice(nl + 1, el.openStart);
      return /^\s*$/.test(head) ? head : '';
    },

    /** 요소 삭제 — 그 요소만 있던 줄이면 줄까지 함께 지워 diff 를 깔끔하게 유지 */
    remove: function (src, el) {
      var st = el.openStart, en = el.endEnd;
      var nl = src.lastIndexOf('\n', st);
      var head = src.slice(nl + 1, st);
      var onlyOnLine = /^\s*$/.test(head);
      var after = src.slice(en);
      if (onlyOnLine && /^[ \t]*\r?\n/.test(after)) {
        st = nl < 0 ? 0 : nl;
        en = en + /^[ \t]*\r?\n/.exec(after)[0].length;
        if (nl < 0) return splice(src, st, en, '');
        return splice(src, st, en - 1, '');    // 줄바꿈 하나는 남긴다
      }
      return splice(src, st, en, '');
    },

    /** 요소 바로 뒤에 마크업 삽입 (들여쓰기 유지) */
    insertAfter: function (src, el, html) {
      var ind = api.indentOf(src, el);
      return splice(src, el.endEnd, el.endEnd, '\n' + ind + html);
    },

    /** 요소 복제 */
    duplicate: function (src, el) {
      return api.insertAfter(src, el, api.outer(src, el));
    },

    /** 같은 부모 안에서 형제와 순서 교환 (dir: -1 위 / +1 아래) — nodes 는 zip 의 DOM 배열 */
    swapSibling: function (src, els, nodes, index, dir) {
      var node = nodes[index], parent = node.parentNode;
      if (!parent) return null;
      var sibs = [], i;
      for (i = 0; i < nodes.length; i++) if (nodes[i].parentNode === parent) sibs.push(i);
      var at = sibs.indexOf(index), to = at + dir;
      if (at < 0 || to < 0 || to >= sibs.length) return null;
      var a = els[index], b = els[sibs[to]];
      var first = a.openStart < b.openStart ? a : b, second = first === a ? b : a;
      var firstTxt = api.outer(src, first), secondTxt = api.outer(src, second);
      var mid = src.slice(first.endEnd, second.openStart);
      return src.slice(0, first.openStart) + secondTxt + mid + firstTxt + src.slice(second.endEnd);
    }
  };
})();
