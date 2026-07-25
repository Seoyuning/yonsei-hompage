/* YSME In-Place Studio — 라인 디프 (STUDIO_SPEC 10-6절)

   두 텍스트를 줄 단위로 비교한다. DOM 에 의존하는 상태가 없는 순수 모듈이며,
   render() 만 DocumentFragment 를 만든다(호출자가 원하는 곳에 붙인다).

   알고리즘: 공통 prefix/suffix 를 먼저 잘라내고 남은 구간만 LCS DP(Uint32Array)로 푼다.
   트리밍 후에도 n*m 이 LCS_CAP 을 넘으면 DP 를 포기하고 전량 교체(del 전부 → add 전부)로
   폴백한다 — 165KB 급 파일을 통째로 갈아낀 경우 메모리를 지키기 위한 방어선이다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.diff) return;

  var LCS_CAP = 4000000;      // n*m 상한 (초과 시 전량 교체 폴백)

  function split(s) { return String(s == null ? '' : s).split('\n'); }

  /* 남은 구간의 LCS → [{type:'same'|'add'|'del', text}] */
  function lcsOps(a, b) {
    var n = a.length, m = b.length, i, j, out = [];
    if (!n && !m) return out;
    if (!n) { for (j = 0; j < m; j++) out.push({ type: 'add', text: b[j] }); return out; }
    if (!m) { for (i = 0; i < n; i++) out.push({ type: 'del', text: a[i] }); return out; }

    if (n * m > LCS_CAP) {                       // 너무 크다 — 전량 교체로 본다
      for (i = 0; i < n; i++) out.push({ type: 'del', text: a[i] });
      for (j = 0; j < m; j++) out.push({ type: 'add', text: b[j] });
      return out;
    }

    /* dp[i][j] = a[i..], b[j..] 의 LCS 길이 (평탄화한 1차원 배열) */
    var w = m + 1, dp = new Uint32Array((n + 1) * w);
    for (i = n - 1; i >= 0; i--) {
      var base = i * w, next = base + w, ai = a[i];
      for (j = m - 1; j >= 0; j--) {
        dp[base + j] = (ai === b[j])
          ? dp[next + j + 1] + 1
          : Math.max(dp[next + j], dp[base + j + 1]);
      }
    }

    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
      else if (dp[(i + 1) * w + j] >= dp[i * w + (j + 1)]) { out.push({ type: 'del', text: a[i] }); i++; }
      else { out.push({ type: 'add', text: b[j] }); j++; }
    }
    while (i < n) { out.push({ type: 'del', text: a[i] }); i++; }
    while (j < m) { out.push({ type: 'add', text: b[j] }); j++; }
    return out;
  }

  var diff = Y.diff = {
    /**
     * 줄 단위 비교 결과.
     * @return [{type:'same'|'add'|'del', text, oldNo, newNo}]
     *         oldNo = 예전 본의 줄번호(add 면 null), newNo = 새 본의 줄번호(del 면 null)
     */
    lines: function (oldText, newText) {
      var a = split(oldText), b = split(newText);
      var aLen = a.length, bLen = b.length, i;

      var start = 0, maxPre = Math.min(aLen, bLen);
      while (start < maxPre && a[start] === b[start]) start++;

      var aEnd = aLen, bEnd = bLen;
      while (aEnd > start && bEnd > start && a[aEnd - 1] === b[bEnd - 1]) { aEnd--; bEnd--; }

      var rows = [], oldNo = 0, newNo = 0;
      function push(type, text) {
        if (type === 'add') { newNo++; rows.push({ type: 'add', text: text, oldNo: null, newNo: newNo }); }
        else if (type === 'del') { oldNo++; rows.push({ type: 'del', text: text, oldNo: oldNo, newNo: null }); }
        else { oldNo++; newNo++; rows.push({ type: 'same', text: text, oldNo: oldNo, newNo: newNo }); }
      }

      for (i = 0; i < start; i++) push('same', a[i]);
      var mid = lcsOps(a.slice(start, aEnd), b.slice(start, bEnd));
      for (i = 0; i < mid.length; i++) push(mid[i].type, mid[i].text);
      for (i = aEnd; i < aLen; i++) push('same', a[i]);
      return rows;
    },

    /** 추가·삭제 줄 수 */
    summary: function (rows) {
      var add = 0, del = 0;
      for (var i = 0; i < (rows || []).length; i++) {
        if (rows[i].type === 'add') add++;
        else if (rows[i].type === 'del') del++;
      }
      return { add: add, del: del };
    },

    /**
     * 변경부 주변 ±context 줄만 남긴 디프 화면.
     * @param opts {context:2}
     * @return DocumentFragment
     */
    render: function (rows, opts) {
      opts = opts || {};
      var CTX = opts.context == null ? 2 : Math.max(0, opts.context | 0);
      rows = rows || [];
      var n = rows.length, i, j;

      var frag = document.createDocumentFragment();
      var box = document.createElement('div');
      box.className = 'ys-diff';
      box.setAttribute(Y.config.uiAttr, '');
      /* 줄바꿈·공백 보존과 등폭 글꼴은 디프의 의미 자체라 여기서 최소한만 고정한다 */
      box.style.whiteSpace = 'pre-wrap';
      box.style.fontFamily = 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
      frag.appendChild(box);

      var changed = false;
      for (i = 0; i < n; i++) { if (rows[i].type !== 'same') { changed = true; break; } }
      if (!changed) {
        var none = document.createElement('p');
        none.className = 'ys-diff-none';
        none.textContent = n ? '두 내용이 완전히 같습니다 (변경 없음).' : '비교할 내용이 없습니다.';
        box.appendChild(none);
        return frag;
      }

      /* 남길 줄 표시 — 변경 줄과 그 주변 CTX 줄 */
      var keep = new Array(n);
      for (i = 0; i < n; i++) keep[i] = false;
      for (i = 0; i < n; i++) {
        if (rows[i].type === 'same') continue;
        var lo = Math.max(0, i - CTX), hi = Math.min(n - 1, i + CTX);
        for (j = lo; j <= hi; j++) keep[j] = true;
      }

      var SIGN = { same: ' ', add: '+', del: '-' };
      i = 0;
      while (i < n) {
        if (keep[i]) {
          var r = rows[i];
          var line = document.createElement('div');
          line.className = 'ys-diff-row ys-diff--' + r.type;
          line.appendChild(cell('ys-diff-no', r.oldNo == null ? '' : String(r.oldNo)));
          line.appendChild(cell('ys-diff-no ys-diff-no--new', r.newNo == null ? '' : String(r.newNo)));
          line.appendChild(cell('ys-diff-sign', SIGN[r.type] || ' '));
          line.appendChild(cell('ys-diff-txt', r.text));
          box.appendChild(line);
          i++;
        } else {
          var c = 0;
          while (i < n && !keep[i]) { c++; i++; }
          var skip = document.createElement('div');
          skip.className = 'ys-diff-skip';
          skip.textContent = '… ' + c + '줄 생략';
          box.appendChild(skip);
        }
      }
      return frag;
    },

    /** 편의: 두 텍스트를 바로 화면 조각으로 (요약 포함) */
    renderTexts: function (oldText, newText, opts) {
      var rows = diff.lines(oldText, newText);
      var s = diff.summary(rows);
      var frag = document.createDocumentFragment();
      var head = document.createElement('div');
      head.className = 'ys-diff-sum';
      head.setAttribute(Y.config.uiAttr, '');
      head.textContent = s.add || s.del
        ? ('추가 ' + s.add + '줄 · 삭제 ' + s.del + '줄')
        : '변경 없음';
      frag.appendChild(head);
      frag.appendChild(diff.render(rows, opts));
      return frag;
    },

    LCS_CAP: LCS_CAP
  };

  function cell(cls, text) {
    var s = document.createElement('span');
    s.className = cls;
    s.textContent = text == null ? '' : text;
    return s;
  }
})();
