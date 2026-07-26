/* YSME In-Place Studio — 페이지 내장 한/영 사전(var I18N = {ko:{…}, en:{…}}) 편집

   홈(H-academic.html)은 인라인 스크립트의 I18N 객체를 읽어 [data-i18n] 요소의
   textContent 를 통째로 덮어쓴다(applyI18n). 그래서 화면에서 문장을 고쳐도
   새로고침하면 사전 값으로 되돌아간다 — 편집을 막는 대신 **사전 자체를 고친다.**

   방식: JS 객체 리터럴을 직접 스캔해 문자열 값의 [start,end) 를 기록하고 그
   구간만 갈아끼운다. JSON.parse → stringify 로 재직렬화하면 따옴표·줄바꿈·키
   순서가 전부 달라져 파일 전체가 diff 로 잡히므로 금지(datamap.js 와 같은 원칙).
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.pagedict) return;
  var S = Y.source;

  var VAR_RE = /(?:^|[^\w$.])(?:var|let|const)\s+I18N\s*=\s*\{/;

  /* ── 1. JS 리터럴 스캐너 ── */

  function skip(src, i) {
    for (;;) {
      while (i < src.length && /\s/.test(src.charAt(i))) i++;
      if (src.charAt(i) === '/' && src.charAt(i + 1) === '/') {
        while (i < src.length && src.charAt(i) !== '\n') i++;
        continue;
      }
      if (src.charAt(i) === '/' && src.charAt(i + 1) === '*') {
        var e = src.indexOf('*/', i + 2);
        i = e < 0 ? src.length : e + 2;
        continue;
      }
      return i;
    }
  }

  function readString(src, i) {
    var q = src.charAt(i), start = i, out = '';
    i++;
    while (i < src.length) {
      var c = src.charAt(i);
      if (c === '\\') {
        var n = src.charAt(i + 1);
        if (n === 'n') { out += '\n'; i += 2; }
        else if (n === 't') { out += '\t'; i += 2; }
        else if (n === 'r') { out += '\r'; i += 2; }
        else if (n === 'b') { out += '\b'; i += 2; }
        else if (n === 'f') { out += '\f'; i += 2; }
        else if (n === 'v') { out += '\v'; i += 2; }
        else if (n === '0' && !/\d/.test(src.charAt(i + 2))) { out += '\0'; i += 2; }
        else if (n === 'x') { out += String.fromCharCode(parseInt(src.substr(i + 2, 2), 16)); i += 4; }
        else if (n === 'u' && src.charAt(i + 2) === '{') {
          var close = src.indexOf('}', i + 3);
          out += String.fromCodePoint(parseInt(src.slice(i + 3, close), 16));
          i = close + 1;
        } else if (n === 'u') { out += String.fromCharCode(parseInt(src.substr(i + 2, 4), 16)); i += 6; }
        else if (n === '\n') { i += 2; }                       // 줄 이어쓰기
        else { out += n; i += 2; }
        continue;
      }
      if (c === q) { i++; return { type: 'string', start: start, end: i, quote: q, value: out }; }
      if (c === '\n') throw new Error('사전 문자열이 줄 안에서 닫히지 않았습니다.');
      out += c;
      i++;
    }
    throw new Error('사전 문자열이 닫히지 않았습니다.');
  }

  function readKey(src, i) {
    var c = src.charAt(i);
    if (c === '"' || c === '\'') { var s = readString(src, i); return { name: s.value, end: s.end }; }
    var m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i, i + 80));
    if (!m) throw new Error('사전 키를 읽을 수 없습니다(위치 ' + i + ').');
    return { name: m[0], end: i + m[0].length };
  }

  function readValue(src, i) {
    i = skip(src, i);
    var c = src.charAt(i);
    if (c === '"' || c === '\'') return readString(src, i);
    if (c === '{') return readObject(src, i);
    if (c === '[') return readArray(src, i);
    /* 그 밖(숫자·true·false·null·식별자·함수)은 값 구간만 잡아 둔다 */
    var start = i, depth = 0;
    while (i < src.length) {
      var ch = src.charAt(i);
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') { if (depth === 0) break; depth--; }
      else if (ch === ',' && depth === 0) break;
      else if (ch === '"' || ch === '\'') { i = readString(src, i).end; continue; }
      i++;
    }
    return { type: 'other', start: start, end: i };
  }

  function readArray(src, i) {
    var start = i;
    i++;
    var items = [];
    for (;;) {
      i = skip(src, i);
      if (src.charAt(i) === ']') return { type: 'array', start: start, end: i + 1, items: items };
      if (i >= src.length) throw new Error('사전 배열이 닫히지 않았습니다.');
      var v = readValue(src, i);
      items.push(v);
      i = skip(src, v.end);
      if (src.charAt(i) === ',') i++;
    }
  }

  function readObject(src, i) {
    var start = i;
    i++;
    var props = {}, keys = [];
    for (;;) {
      i = skip(src, i);
      if (src.charAt(i) === '}') return { type: 'object', start: start, end: i + 1, props: props, keys: keys };
      if (i >= src.length) throw new Error('사전 객체가 닫히지 않았습니다.');
      var k = readKey(src, i);
      i = skip(src, k.end);
      if (src.charAt(i) !== ':') throw new Error('사전에서 ":" 를 찾지 못했습니다(키 ' + k.name + ').');
      var v = readValue(src, i + 1);
      props[k.name] = v;
      keys.push(k.name);
      i = skip(src, v.end);
      if (src.charAt(i) === ',') i++;
    }
  }

  /* 줄 종결자로 취급되는 유니코드 문자 — 리터럴 안에 날것으로 두면 구문 오류가 난다.
     소스에 직접 적으면 눈에 보이지 않아 실수하기 쉬우므로 코드포인트로 만든다. */
  var LS = String.fromCharCode(0x2028);
  var PS = String.fromCharCode(0x2029);

  /** 값을 원문과 같은 따옴표 스타일의 JS 문자열 리터럴로 만든다. */
  function encode(value, quote) {
    var q = quote === '"' ? '"' : '\'';
    var s = String(value == null ? '' : value)
      .split('\\').join('\\\\')
      .split(q).join('\\' + q)
      .split('\r').join('\\r')
      .split('\n').join('\\n')
      .split(LS).join(String.fromCharCode(92)+'u2028')
      .split(PS).join(String.fromCharCode(92)+'u2029');
    return q + s + q;
  }

  /* ── 2. 파싱(원문 문자열 기준 캐시) ── */

  var cache = { src: null, res: null };

  function parseFrom(src) {
    if (cache.src === src) return cache.res;
    var res;
    var m = VAR_RE.exec(src);
    if (!m) {
      res = { ok: false, error: '이 페이지에는 내장 한/영 사전(var I18N)이 없습니다.' };
    } else {
      var open = src.indexOf('{', m.index + m[0].length - 1);
      try {
        var root = readObject(src, open);
        var dict = {}, langs = [];
        for (var i = 0; i < root.keys.length; i++) {
          var lang = root.keys[i], node = root.props[lang];
          if (!node || node.type !== 'object') continue;
          var entries = {};
          for (var j = 0; j < node.keys.length; j++) {
            var key = node.keys[j], vn = node.props[key];
            if (vn && vn.type === 'string') entries[key] = vn;
          }
          dict[lang] = entries;
          langs.push(lang);
        }
        res = langs.length
          ? { ok: true, root: root, dict: dict, langs: langs }
          : { ok: false, error: '사전에서 언어 묶음을 찾지 못했습니다.' };
      } catch (e) {
        res = { ok: false, error: e && e.message ? e.message : '사전을 해석하지 못했습니다.' };
      }
    }
    cache = { src: src, res: res };
    return res;
  }

  /* ── 3. 라이브 반영 ── */

  function liveLang() {
    var d = Y.engine && Y.engine.liveDoc();
    var l = d && d.documentElement && d.documentElement.lang;
    return l === 'en' ? 'en' : 'ko';
  }

  /* ── 4. 공개 API ── */

  var api = Y.pagedict = {
    /** 현재 버퍼에 내장 사전이 있는가 */
    available: function () {
      var src = Y.engine && Y.engine.src();
      return !!src && parseFrom(src).ok;
    },
    reason: function () {
      var src = Y.engine && Y.engine.src();
      var p = src ? parseFrom(src) : null;
      return p && !p.ok ? p.error : '';
    },
    /** 사전이 가진 언어 코드 목록 */
    langs: function () {
      var src = Y.engine && Y.engine.src();
      var p = src ? parseFrom(src) : null;
      return p && p.ok ? p.langs.slice() : [];
    },
    /** 화면이 지금 보여 주는 언어 */
    liveLang: liveLang,

    /** 사전 값 조회 — 없으면 null */
    get: function (key, lang) {
      var src = Y.engine && Y.engine.src();
      var p = src ? parseFrom(src) : null;
      if (!p || !p.ok) return null;
      var n = p.dict[lang] && p.dict[lang][key];
      return n ? n.value : null;
    },

    /** key 를 가진 언어별 값 묶음 — {ko:'…', en:'…'} */
    values: function (key) {
      var src = Y.engine && Y.engine.src();
      var p = src ? parseFrom(src) : null;
      if (!p || !p.ok) return null;
      var out = null;
      for (var i = 0; i < p.langs.length; i++) {
        var l = p.langs[i], n = p.dict[l] && p.dict[l][key];
        if (!n) continue;
        (out = out || {})[l] = n.value;
      }
      return out;
    },

    /**
     * 사전 값을 고친다. idx 를 주면 HTML 폴백 텍스트와 화면도 함께 맞춘다.
     * @param {string} key   data-i18n 키
     * @param {string} lang  'ko' | 'en'
     * @param {string} value 새 문장
     * @param {number} [idx] 해당 요소의 eid — 주면 HTML 원문 텍스트도 같이 갱신
     * @returns {boolean} 실제로 원문이 바뀌었는가
     */
    set: function (key, lang, value, idx) {
      var src0 = Y.engine.src();
      if (src0 == null) return false;
      var buf = Y.engine.current();
      var el = (idx != null && buf && buf.mapped && buf.els) ? buf.els[idx] : null;

      /* 1) HTML 폴백 텍스트 — 사전의 기본 언어(첫 언어)일 때만 같이 맞춘다.
            applyI18n 이 없어도(JS 실패) 같은 문장이 보이도록 유지하는 것이 목적이다. */
      var p0 = parseFrom(src0);
      if (!p0.ok) { Y.toast(p0.error, 'error'); return false; }
      var baseLang = p0.langs[0];
      var src1 = src0;
      if (el && lang === baseLang) {
        try { src1 = S.setText(src0, el, value); } catch (e) { src1 = src0; }
      }

      /* 2) 사전 값 — 오프셋이 밀렸을 수 있으므로 1) 결과 위에서 다시 찾는다 */
      var p1 = parseFrom(src1);
      if (!p1.ok) { Y.toast(p1.error, 'error'); return false; }
      var node = p1.dict[lang] && p1.dict[lang][key];
      if (!node) { Y.toast('사전에 ' + lang + '.' + key + ' 항목이 없습니다.', 'error'); return false; }
      var lit = encode(value, node.quote);
      var src2 = src1.slice(0, node.start) + lit + src1.slice(node.end);
      if (src2 === src0) return false;

      var ok = Y.engine.applyRawSrc(src2, 'dict');
      if (!ok) return false;

      /* 3) 화면 — resyncLive 는 런타임 관리 요소를 건너뛰므로 직접 넣는다 */
      if (idx != null && lang === liveLang()) {
        var lv = Y.engine.map() && Y.engine.map().liveOf(idx);
        if (lv && lv.textContent !== value) lv.textContent = value;
      }
      Y.bus.emit('pagedict:change', { key: key, lang: lang, value: value });
      return true;
    },

    /** 사전이 관리하는 모든 항목 — 한/영 편집 패널이 쓴다. [{key, ko, en}] */
    entries: function () {
      var src = Y.engine && Y.engine.src();
      var p = src ? parseFrom(src) : null;
      if (!p || !p.ok) return [];
      var seen = {}, out = [], i, j;
      for (i = 0; i < p.langs.length; i++) {
        var keys = Object.keys(p.dict[p.langs[i]]);
        for (j = 0; j < keys.length; j++) if (!seen[keys[j]]) { seen[keys[j]] = 1; out.push(keys[j]); }
      }
      return out.map(function (k) {
        var row = { key: k };
        for (var n = 0; n < p.langs.length; n++) {
          var v = p.dict[p.langs[n]][k];
          row[p.langs[n]] = v ? v.value : null;
        }
        return row;
      });
    },

    /* 테스트용 — 순수 함수 노출 */
    _parse: parseFrom,
    _encode: encode
  };

  return api;
})();
