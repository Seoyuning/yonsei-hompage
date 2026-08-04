/* YSME In-Place Studio — 원본(pristine) DOM ↔ 라이브 DOM 정렬

   라이브 문서는 이미 사이트 JS 가 변형시킨 상태다(헤더·푸터 주입, 카드 innerHTML 생성,
   클래스 토글 등). 그래서 라이브 DOM 에 식별자를 심으면 "파일에 있던 요소"와 1:1 로
   대응되지 않는다. 여기서는 **파일에서 파싱한 트리를 기준**으로 두고, 라이브 트리와
   자식 목록 LCS 로 짝을 찾는다.

   결과:
     i2l[idx]  = 라이브 요소 (없으면 null — 사이트 JS 가 지운 요소)
     l2i.get(el) = 원본 인덱스 (없으면 사이트 JS 가 만든 요소 → 파일 편집 대상 아님)

   idx 는 source.zip() 의 전순회 인덱스 = 이 도구의 eid 다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.align) return;

  /* 파일에도 존재하지만 런타임에 붙었다 떨어지는(토글) 클래스 — 양쪽 키에서 모두 제외한다.
     파일에 아예 없는 클래스(예: 홈의 sfade, drag)는 목록에 넣을 필요가 없다 —
     아래 "원본 클래스 어휘" 규칙이 자동으로 걸러 낸다.

     is-on 은 반드시 여기 있어야 한다: 홈 연구분야(fx-t·fx-dot·fx-s)는 파일에서
     0번에만 is-on 이 붙고 런타임엔 스크롤 위치의 형제로 옮겨 다닌다. 키에 남기면
     같은 키의 형제 열이 어긋나 LCS 짝이 한 칸씩 밀리고, 화면에서 고른 카드가
     원문의 **다른** 카드로 매핑된다(실제로 이 어긋난 삭제가 게시돼 홈 연구분야가
     통째로 지워진 사고가 있었다). */
  var RUNTIME_CLASS = {
    'in': 1, 'vis': 1, 'fade': 1, 'ttl-on': 1, 'ysub-hide': 1, 'on': 1, 'cur': 1,
    'open': 1, 'min': 1, 'show': 1, 'dim-others': 1, 'has-ysub': 1, 'is-open': 1,
    'is-on': 1, 'active': 1, 'drag': 1, 'ys-sel': 1, 'ys-hover': 1, 'ys-target': 1
  };
  /* 사이트 JS 가 라이브에 주입하는 노드 — 원본에는 없다 */
  var INJECTED = '.ynv, .ysub, .ytop, .ynv-ovl, footer.yft, [data-ys-ui], [data-ys-injected]';
  /* nav.js 가 라이브에서 제거하는 노드 — 원본에만 있다 (nav.js mount()/buildFooter() 참조) */
  var GHOST = '.cta, footer:not(.yft), .hud-top, .ynav-ph';

  /** 정렬 키. vocab 이 주어지면(라이브 쪽) **원본 파일에 실제로 등장하는 클래스만** 남긴다.
   *  사이트 JS 가 새로 붙인 클래스(sfade 등)를 일일이 열거하지 않아도 자동으로 무시된다. */
  function keyOf(el, vocab) {
    var cls = (el.getAttribute && el.getAttribute('class')) || '';
    var parts = cls.split(/\s+/), keep = [];
    for (var i = 0; i < parts.length; i++) {
      var c = parts[i];
      if (!c || RUNTIME_CLASS[c]) continue;
      if (vocab && !vocab[c]) continue;          // 파일에 없는 클래스 = 런타임 산물
      keep.push(c);
    }
    keep.sort();
    return el.tagName.toLowerCase() + '#' + (el.id || '') + '.' + keep.join('.');
  }

  /** 원본 문서에 class 속성으로 등장하는 모든 클래스 이름 집합 */
  function classVocab(pNodes) {
    var v = Object.create(null);
    for (var i = 0; i < pNodes.length; i++) {
      var cls = pNodes[i].getAttribute && pNodes[i].getAttribute('class');
      if (!cls) continue;
      var parts = cls.split(/\s+/);
      for (var j = 0; j < parts.length; j++) if (parts[j]) v[parts[j]] = 1;
    }
    return v;
  }

  function kids(el, skipSel) {
    var out = [], k = el.children;
    for (var i = 0; i < k.length; i++) {
      var c = k[i];
      if (skipSel && c.matches && c.matches(skipSel)) continue;
      out.push(c);
    }
    return out;
  }

  /* 두 키 배열의 LCS → 짝지어진 인덱스 쌍 목록 */
  function lcsPairs(a, b) {
    var n = a.length, m = b.length, i, j;
    if (!n || !m) return [];
    if (n * m > 400000) {                       // 병리적으로 큰 목록 — 위치 기준으로 근사
      var out0 = [], lim = Math.min(n, m);
      for (i = 0; i < lim; i++) if (a[i] === b[i]) out0.push([i, i]);
      return out0;
    }
    var w = m + 1, dp = new Uint32Array((n + 1) * w);
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        dp[i * w + j] = a[i] === b[j]
          ? dp[(i + 1) * w + (j + 1)] + 1
          : Math.max(dp[(i + 1) * w + j], dp[i * w + (j + 1)]);
      }
    }
    var out = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { out.push([i, j]); i++; j++; }
      else if (dp[(i + 1) * w + j] >= dp[i * w + (j + 1)]) i++;
      else j++;
    }
    return out;
  }

  /**
   * @param pNodes  source.zip() 의 nodes (전순회 배열, index = eid)
   * @param liveRoot 라이브 document.documentElement
   */
  Y.align = function (pNodes, liveRoot) {
    var idxOf = new Map(), vocab = classVocab(pNodes);
    for (var i = 0; i < pNodes.length; i++) idxOf.set(pNodes[i], i);

    var i2l = new Array(pNodes.length), l2i = new Map();
    var stats = { paired: 0, unpairedLive: 0, unpairedPristine: 0 };

    function bind(p, l) {
      var idx = idxOf.get(p);
      if (idx != null) { i2l[idx] = l; l2i.set(l, idx); stats.paired++; }
      walk(p, l);
    }
    function walk(p, l) {
      var pk = kids(p, GHOST), lk = kids(l, INJECTED);
      if (!pk.length || !lk.length) {
        stats.unpairedPristine += pk.length;
        stats.unpairedLive += lk.length;
        return;
      }
      var pairs = lcsPairs(
        pk.map(function (e) { return keyOf(e, null); }),
        lk.map(function (e) { return keyOf(e, vocab); })
      );
      stats.unpairedPristine += pk.length - pairs.length;
      stats.unpairedLive += lk.length - pairs.length;
      for (var t = 0; t < pairs.length; t++) bind(pk[pairs[t][0]], lk[pairs[t][1]]);
    }

    if (pNodes.length && liveRoot) bind(pNodes[0], liveRoot);

    return {
      i2l: i2l,
      l2i: l2i,
      stats: stats,
      /** 라이브 요소 → 원본 인덱스 (자기 자신이 없으면 null) */
      indexOf: function (el) { var v = l2i.get(el); return v == null ? null : v; },
      /** 라이브 요소에서 가장 가까운 "파일 소유" 조상의 인덱스와 요소 */
      nearest: function (el) {
        var cur = el;
        while (cur && cur.nodeType === 1) {
          var v = l2i.get(cur);
          if (v != null) return { index: v, live: cur, self: cur === el };
          cur = cur.parentElement;
        }
        return null;
      },
      liveOf: function (idx) { return i2l[idx] || null; }
    };
  };

  Y.align.keyOf = keyOf;
  Y.align.classVocab = classVocab;
  Y.align.RUNTIME_CLASS = RUNTIME_CLASS;
  Y.align.INJECTED = INJECTED;
  Y.align.GHOST = GHOST;
})();
