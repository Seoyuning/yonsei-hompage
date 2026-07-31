/* YSME In-Place Studio — 찾아 바꾸기 (결정론적)

   왜 따로 만드는가.
   "연세대학교를 고려대학교로 바꿔" 를 AI 에게 시키면 아웃라인에 오른 요소만 하나씩
   열거하게 된다. 그런데 아웃라인은 **텍스트 리프 요소**만 담는다 — <title>, <meta>,
   속성값, 인라인 사전은 통째로 빠진다. H-academic.html 의 '연세대학교' 13곳 중
   아웃라인에 오르는 건 <h1> 하나뿐이다. 게다가 계획 항목 수에 상한(10)이 걸려 있다.
   그래서 "한 곳만 바뀌는" 일이 생긴다.

   기계적 치환은 기계가 해야 한다. 여기서는 원문을 직접 훑어 **사람이 읽는 글자만**
   골라 바꾼다. AI 는 「무엇을 무엇으로」 라는 의도만 정하고, 빠짐없이 찾는 일은 이 모듈이 한다.

   바꾸는 곳
     · 텍스트 노드
     · 사람에게 보이는 속성값 (alt·title·aria-label·placeholder·meta content …)
     · 인라인 <script> 안의 **문자열 리터럴** (opts.scripts — i18n 사전이 여기 산다)

   건드리지 않는 곳
     · 태그 이름 · 속성 이름
     · class·id·href·src·data-i18n 같은 기계가 읽는 값
     · 주석 · <style> 안 · 스크립트의 코드 부분(문자열 밖)

   plan(src, find, replace, opts) → { newSrc, hits, counts, changed }
   원문을 바꾸지 않고 결과만 돌려준다. 적용 여부는 부르는 쪽이 정한다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.replace) return;
  var S = Y.source;

  /* 값이 사람 눈에 보이는 속성만 연다. 나머지는 기계용이라 건드리면 사이트가 깨진다. */
  var TEXT_ATTRS = {
    alt: 1, title: 1, placeholder: 1, label: 1, summary: 1,
    'aria-label': 1, 'aria-description': 1, 'aria-placeholder': 1,
    'aria-roledescription': 1, 'aria-valuetext': 1
  };
  /* 태그를 봐야 판단이 서는 것들 */
  function attrAllowed(tag, name) {
    if (name === 'content') return tag === 'meta';          // <meta name=description content="…">
    if (name === 'value') return tag === 'input' || tag === 'option';
    return !!TEXT_ATTRS[name];
  }

  /* 내용을 태그로 파싱하면 안 되는 요소 */
  var RAW = { script: 1, style: 1, textarea: 1 };

  /* ── 원문 훑기 ──
     구간을 종류별로 넘겨준다. 태그 안의 '>' 가 따옴표에 싸여 있어도 속지 않는다. */
  function walk(src, cb) {
    var i = 0, n = src.length, inHead = false;
    while (i < n) {
      var lt = src.indexOf('<', i);
      if (lt < 0) { cb.text(i, n, inHead); return; }
      if (lt > i) cb.text(i, lt, inHead);

      if (src.substr(lt, 4) === '<!--') {                    // 주석 — 통째로 지나간다
        var ce = src.indexOf('-->', lt + 4);
        i = ce < 0 ? n : ce + 3;
        continue;
      }
      if (src.charAt(lt + 1) === '!' || src.charAt(lt + 1) === '?') {   // doctype 등
        var de = src.indexOf('>', lt);
        i = de < 0 ? n : de + 1;
        continue;
      }

      var m = /^<\/?([A-Za-z][A-Za-z0-9:-]*)/.exec(src.slice(lt, lt + 64));
      if (!m) { cb.text(lt, lt + 1); i = lt + 1; continue; }  // '<' 가 그냥 글자였다

      var closing = src.charAt(lt + 1) === '/';
      var tag = m[1].toLowerCase();
      /* <head> 안의 글자(<title> 등)는 화면에 그려지지 않는다 —
         화면 글자와 같은 종류로 묶으면 「이동」을 눌러도 아무 일이 없어 고장으로 보인다. */
      if (tag === 'head') inHead = !closing;
      else if (tag === 'body' && !closing) inHead = false;

      var j = lt + m[0].length, q = '';
      while (j < n) {
        var c = src.charAt(j);
        if (q) { if (c === q) q = ''; }
        else if (c === '"' || c === "'") q = c;
        else if (c === '>') break;
        j++;
      }
      var gt = (j < n) ? j : n - 1;                          // '>' 의 위치
      if (!closing) cb.tag(lt, gt + 1, tag);
      i = gt + 1;

      if (!closing && RAW[tag] && src.charAt(gt - 1) !== '/') {
        var mm = new RegExp('</' + tag + '\\s*>', 'i').exec(src.slice(i));
        var bodyEnd = mm ? i + mm.index : n;
        cb.raw(i, bodyEnd, tag);
        i = mm ? bodyEnd + mm[0].length : n;
      }
    }
  }

  /* ── 스크립트 안의 문자열 리터럴 구간 ──
     주석을 건너뛰고 따옴표 쌍만 집는다. 코드 부분은 절대 손대지 않는다. */
  function stringSpans(body, base) {
    var out = [], i = 0, n = body.length;
    while (i < n) {
      var c = body.charAt(i);
      if (c === '/' && body.charAt(i + 1) === '/') {
        var e1 = body.indexOf('\n', i); i = e1 < 0 ? n : e1 + 1; continue;
      }
      if (c === '/' && body.charAt(i + 1) === '*') {
        var e2 = body.indexOf('*/', i + 2); i = e2 < 0 ? n : e2 + 2; continue;
      }
      if (c === '"' || c === "'" || c === '`') {
        var quote = c, j = i + 1, closed = false;
        while (j < n) {
          var d = body.charAt(j);
          if (d === '\\') { j += 2; continue; }
          if (d === quote) { closed = true; break; }
          if (quote !== '`' && d === '\n') break;      // 문자열이 아니었다 — 빠져나간다
          j++;
        }
        if (closed) { out.push({ s: base + i + 1, e: base + j, quote: quote }); i = j + 1; }
        else i = i + 1;
        continue;
      }
      i++;
    }
    return out;
  }

  /* 문자열 리터럴 안에 넣을 때의 이스케이프 */
  function escJs(text, quote) {
    var s = String(text == null ? '' : text)
      .replace(/\\/g, '\\\\')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n');
    if (quote === '"') s = s.replace(/"/g, '\\"');
    else if (quote === "'") s = s.replace(/'/g, "\\'");
    else s = s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return s;
  }

  function lineAt(src, idx) {
    var n = 1;
    for (var i = 0; i < idx && i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
    return n;
  }
  /* 문맥은 **그 곳이 속한 구간 안쪽으로만** 자른다.
     구간 밖까지 퍼 오면 `1.0" /> <title>…</title> <meta na…` 처럼 태그가 섞여
     사람이 어디를 고치는지 알아볼 수 없다. */
  function snippet(src, s, e, lo, hi, pad) {
    pad = pad || 28;
    if (lo == null) lo = 0;
    if (hi == null) hi = src.length;
    var a = Math.max(lo, s - pad), b = Math.min(hi, e + pad);
    var text = src.slice(a, b).replace(/\s+/g, ' ').trim();
    return (a > lo ? '…' : '') + text + (b < hi ? '…' : '');
  }

  /* ── 본체 ── */
  function plan(src, find, replace, opts) {
    opts = opts || {};
    src = String(src == null ? '' : src);
    find = String(find == null ? '' : find);
    replace = String(replace == null ? '' : replace);

    var wantAttrs = opts.attrs !== false;
    var wantScripts = opts.scripts !== false;      // i18n 사전이 여기 있어 기본으로 연다
    var empty = { newSrc: src, hits: [], counts: { text: 0, head: 0, attr: 0, script: 0 }, changed: 0, applied: [] };
    if (!find || find === replace) return empty;

    var edits = [];

    /* 한 구간 안에서 find 를 모두 찾아 치환 목록에 넣는다.
       needle 은 그 구간의 표기법(원문 그대로/엔티티)에 맞춘 검색어다. */
    function collect(s, e, kind, needle, ins, label) {
      if (!needle || s >= e) return;
      var hay = src.slice(s, e), at = hay.indexOf(needle);
      while (at >= 0) {
        var abs = s + at;
        edits.push({
          s: abs, e: abs + needle.length, ins: ins,
          kind: kind, label: label || '',
          rs: s, re: e                      // 이 곳이 속한 구간 — 문맥을 여기 안쪽으로만 잘라 보여 준다
        });
        at = hay.indexOf(needle, at + needle.length);
      }
    }

    /* 텍스트 구간: 원문에 엔티티로 적혀 있을 수도 있으니 두 표기를 모두 본다. */
    var findText = find, findTextEnc = S.encodeText(find);
    var insText = S.encodeText(replace);
    var findAttrEnc = S.encodeAttr(find);
    var insAttr = S.encodeAttr(replace);

    walk(src, {
      text: function (s, e, inHead) {
        var kind = inHead ? 'head' : 'text';
        collect(s, e, kind, findText, insText, inHead ? '탭·검색 제목' : '');
        if (findTextEnc !== findText) collect(s, e, kind, findTextEnc, insText, inHead ? '탭·검색 제목' : '');
      },
      tag: function (s, e, tag) {
        if (!wantAttrs) return;
        var list = S.attrList(src, { openStart: s, openEnd: e });
        for (var i = 0; i < list.length; i++) {
          var a = list[i];
          if (a.valStart < 0 || !attrAllowed(tag, a.name)) continue;
          collect(a.valStart, a.valEnd, 'attr', find, insAttr, tag + ' ' + a.name);
          if (findAttrEnc !== find) collect(a.valStart, a.valEnd, 'attr', findAttrEnc, insAttr, tag + ' ' + a.name);
        }
      },
      raw: function (s, e, tag) {
        if (!wantScripts || tag !== 'script') return;
        var spans = stringSpans(src.slice(s, e), s);
        for (var i = 0; i < spans.length; i++) {
          collect(spans[i].s, spans[i].e, 'script', find, escJs(replace, spans[i].quote), '스크립트 문자열');
        }
      }
    });

    if (!edits.length) return empty;

    /* 고를 곳만 고르기 — opts.only 는 hit 번호(0부터) 목록이다.
       주지 않으면 전부 바꾼다(종전 동작). */
    var only = null;
    if (opts.only && typeof opts.only.length === 'number') {
      only = {};
      for (var q = 0; q < opts.only.length; q++) only[opts.only[q]] = true;
    }

    /* 겹치는 편집을 걸러내고(있을 수 없지만 방어) 앞에서부터 이어 붙인다 */
    edits.sort(function (a, b) { return a.s - b.s; });

    var outParts = [], last = 0, hits = [], counts = { text: 0, head: 0, attr: 0, script: 0 };
    var applied = [], hitNo = 0, delta = 0;
    /* 줄 번호는 앞에서부터 한 번만 세면 된다 — 곳마다 처음부터 세면 파일이 클수록 느려진다 */
    var lineCur = 1, linePos = 0;

    for (var i = 0; i < edits.length; i++) {
      var ed = edits[i];
      if (ed.s < last) continue;                              // 겹침 — 건너뛴다

      while (linePos < ed.s) { if (src.charCodeAt(linePos) === 10) lineCur++; linePos++; }

      var idx = hitNo++;
      var take = !only || !!only[idx];
      var from = src.slice(ed.s, ed.e);
      var ctx = snippet(src, ed.s, ed.e, ed.rs, ed.re);
      hits.push({
        index: idx,
        kind: ed.kind,
        label: ed.label,
        at: ed.s,                       // 원문에서의 위치 — 「이 위치로 이동」이 이걸 쓴다
        line: lineCur,
        before: ctx,
        after: ctx.split(from).join(replace),
        applied: take
      });
      if (!take) continue;                                    // 고르지 않은 곳은 원문 그대로 둔다

      outParts.push(src.slice(last, ed.s), ed.ins);
      counts[ed.kind]++;
      /* 되돌리기용 — **바뀐 뒤** 원문 기준 위치를 적어 둔다 */
      applied.push({ at: ed.s + delta, from: from, to: ed.ins });
      delta += ed.ins.length - (ed.e - ed.s);
      last = ed.e;
    }
    outParts.push(src.slice(last));

    return {
      newSrc: outParts.join(''),
      hits: hits,                 // 후보 전체(고르지 않은 것 포함)
      counts: counts,
      changed: applied.length,    // 실제로 바꾼 개수
      applied: applied            // 되돌리기 정보
    };
  }

  /* ── 되돌리기 ──
     plan() 이 준 applied 를 **뒤에서부터** 되감는다(뒤부터 해야 앞쪽 위치가 안 밀린다).
     그 사이 사람이 같은 자리를 또 고쳤다면 글자가 맞지 않으므로 그 곳은 건너뛰고 센다 —
     남의 편집을 조용히 덮어쓰지 않는 것이 먼저다. */
  function revert(src, applied) {
    var out = String(src == null ? '' : src);
    if (!applied || !applied.length) return { src: out, ok: 0, miss: 0 };
    var ok = 0, miss = 0;
    for (var i = applied.length - 1; i >= 0; i--) {
      var a = applied[i];
      if (out.substr(a.at, a.to.length) !== a.to) { miss++; continue; }
      out = out.slice(0, a.at) + a.from + out.slice(a.at + a.to.length);
      ok++;
    }
    return { src: out, ok: ok, miss: miss };
  }

  /* 미리 세어만 본다 */
  function count(src, find, opts) {
    var r = plan(src, find, find + ' ', opts);   // 반드시 달라지는 값으로 세기만 한다
    return r.changed;
  }

  /* ── 화면(라이브 DOM)에도 같은 치환을 한다 ──
     원문만 고치면 화면이 그대로다. engine.resyncLive() 는 data-i18n 처럼 런타임이
     덮어쓰는 요소를 일부러 건너뛰고, 헤더·푸터는 nav.js 가 다시 그리기 때문이다.
     그래서 "85곳 바꿨습니다" 라고 해 놓고 화면에는 옛 글자가 남는다.
     여기서는 눈에 보이는 글자만 갈아 끼운다 — 진실은 어디까지나 초안(원문)이다. */
  function live(doc, find, replace) {
    if (!doc || !find || find === replace) return 0;
    var uiAttr = (Y.config && Y.config.uiAttr) || 'data-ys-ui';
    var root = doc.body || doc.documentElement;
    if (!root) return 0;

    var nodes = [], n = 0;
    try {
      var w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      while (w.nextNode()) nodes.push(w.currentNode);
    } catch (e) { return 0; }

    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i], p = t.parentNode;
      if (!p || !t.nodeValue || t.nodeValue.indexOf(find) < 0) continue;
      var tag = (p.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'textarea') continue;
      /* 스튜디오 자신의 화면은 절대 건드리지 않는다 */
      if (p.closest && p.closest('[' + uiAttr + ']')) continue;
      t.nodeValue = t.nodeValue.split(find).join(replace);
      n++;
    }

    /* 눈에 보이는 속성값과 탭 제목도 맞춘다 */
    var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
    for (var a = 0; a < ATTRS.length; a++) {
      var list;
      try { list = root.querySelectorAll('[' + ATTRS[a] + ']'); } catch (e2) { continue; }
      for (var k = 0; k < list.length; k++) {
        var elx = list[k];
        if (elx.closest && elx.closest('[' + uiAttr + ']')) continue;
        var v = elx.getAttribute(ATTRS[a]);
        if (v && v.indexOf(find) >= 0) { elx.setAttribute(ATTRS[a], v.split(find).join(replace)); n++; }
      }
    }
    try {
      if (doc.title && doc.title.indexOf(find) >= 0) { doc.title = doc.title.split(find).join(replace); n++; }
    } catch (e3) {}

    return n;
  }

  Y.replace = {
    plan: plan,
    revert: revert,
    count: count,
    live: live,
    /* 검사·설명용으로 열어 둔다 */
    _walk: walk,
    _stringSpans: stringSpans
  };
})();
