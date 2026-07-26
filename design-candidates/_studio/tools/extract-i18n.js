#!/usr/bin/env node
/* YSME 사전 추출기 — 8개 HTML 원문에서 번역 대상 문장을 뽑아 assets/i18n/en.json 에 병합한다.

   설계 원칙
     · 의존성 0. Node 만 있으면 돈다(빌드 도구·파서 라이브러리 없음).
     · 사전 키(msgid)는 **한국어 원문**이다(gettext 규약, STUDIO_SPEC 5절).
       그래서 한글이 한 자도 없는 문자열은 뽑지 않는다 — 영문 킥커("Research & News")나
       숫자·기호는 번역 대상이 아니다.
     · 키는 공백을 한 칸으로 접은 형태로 정규화한다. HTML 원문에서 긴 문장은 여러 줄에
       걸쳐 있는데, 브라우저(assets/i18n.js)도 같은 정규화를 하므로 양쪽 키가 일치한다.
     · 이미 있는 en.json 은 절대 덮어쓰지 않는다. 새 문장만 값 "" 로 추가한다(미번역 표시).
       원문에서 사라진 항목도 지우지 않는다(오탈자 수정 중일 수 있다 — 사람이 판단할 몫).

   제외 영역 — 브라우저 런타임의 제외 규칙과 짝을 맞춘다.
     script · style · noscript · template · textarea · title · svg 내부
     [data-i18n] (홈 인라인 사전이 관리)
     .cta 와 <footer> (nav.js 가 DOM 에서 제거하는 유령 노드)

   사용법:  node _studio/tools/extract-i18n.js
*/
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..', '..');
var DICT = path.join(ROOT, 'assets', 'i18n', 'en.json');
var PAGES = [
  'H-academic.html', 'G-about.html', 'G-people.html', 'G-research.html',
  'G-academics.html', 'G-graduate.html', 'G-news.html', 'G-admissions.html'
];
var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];

/* 파일에는 한 덩어리로 있지만 화면에서는 조각으로 나타나는 문구.
   nav.js 가 breadcrumb(`p.bc`) 를 "홈 › <섹션> › <탭>" 링크 구조로 **다시 그리기** 때문에
   원문의 "홈 › 학부소개" 는 런타임에 "홈" / "학부소개" 두 텍스트 노드로 갈라진다.
   런타임은 텍스트 노드 완전일치로만 치환하므로 조각 단위 키가 따로 필요하다.
   (헤더·탭바·푸터 자체는 번역 제외 영역이므로 여기에 넣지 않는다.) */
var EXTRA = [
  '홈',
  '학부소개', '구성원', '연구', '학사', '대학원', '소식', '입학',
  '학과장 인사말', '비전 · 교육철학', '조직 · 행정', '주요 연혁', '연락처 · 오시는 길',
  '교수진', '교직원',
  '연구 비전', '연구 분야', '연구실 전체', '연구실 홍보영상',
  '교육과정 개관', '이수 체계도', '졸업 요건', '전공 교과', '대학원 교과', '동아리·학생활동',
  '입학 안내', '교과목 소개', '대학원 연구실',
  '학부 공지', '대학원 공지', '뉴스 · 연구성과', '세미나 · 행사',
  '학부 입학', '대학원 진학', '장학 안내', '취업 정보', '진로 안내',
  /* 몰입 구역 커서 라벨(data-cursor) — 링 안에 뜨는 말. 속성 스캔 대상이 아니라 여기 적는다. */
  '분야 보기', '자세히 보기'
];

/* ── 태그 분류 ── */
var VOID = {
  area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1,
  meta: 1, param: 1, source: 1, track: 1, wbr: 1
};
var RAW = { script: 1, style: 1, textarea: 1, title: 1 };
var SKIP_TAG = { script: 1, style: 1, noscript: 1, template: 1, textarea: 1, title: 1, svg: 1 };

var HANGUL = /[가-힣㄰-㆏ᄀ-ᇿ]/;

/* ── 엔티티 해석 (원문에 실제로 쓰인 것들 + 숫자 참조) ── */
var ENT = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'",
  middot: '·', hellip: '…', mdash: '—', ndash: '–',
  rarr: '→', larr: '←', times: '×', deg: '°',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  bull: '•', copy: '©', reg: '®', trade: '™', ensp: ' ', emsp: ' '
};
function decodeEntities(s) {
  return String(s).replace(/&(#[0-9]+|#[xX][0-9A-Fa-f]+|[A-Za-z][A-Za-z0-9]*);/g, function (m, name) {
    if (name.charAt(0) === '#') {
      var num = name.charAt(1) === 'x' || name.charAt(1) === 'X'
        ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      if (isNaN(num) || num < 0 || num > 0x10FFFF) return m;
      try { return String.fromCodePoint(num); } catch (e) { return m; }
    }
    var v = ENT[name];
    return v == null ? m : v;
  });
}

/* 사전 키 정규화 — 브라우저 런타임과 **반드시 같은 규칙**이어야 한다 */
function normKey(s) {
  return decodeEntities(s).replace(/\s+/g, ' ').trim();
}

function usable(s) {
  return s.length >= 2 && HANGUL.test(s);
}

/* ── 아주 작은 HTML 토크나이저 ──
   여는 태그 스택을 들고, 제외 대상 요소에 들어가면 그 요소가 닫힐 때까지 텍스트를 버린다. */
function scanPage(src) {
  var texts = [], attrs = [];
  var stack = [];          // [{tag, skip}]
  var skipDepth = 0;
  var i = 0, n = src.length;

  function pushText(raw) {
    if (skipDepth > 0) return;
    var k = normKey(raw);
    if (usable(k)) texts.push(k);
  }

  while (i < n) {
    var lt = src.indexOf('<', i);
    if (lt < 0) { pushText(src.slice(i)); break; }
    if (lt > i) pushText(src.slice(i, lt));

    var c = src.charAt(lt + 1);

    if (c === '!') {                                   // 주석 · doctype
      if (src.substr(lt, 4) === '<!--') { var ce = src.indexOf('-->', lt + 4); i = ce < 0 ? n : ce + 3; }
      else { var g = src.indexOf('>', lt); i = g < 0 ? n : g + 1; }
      continue;
    }
    if (c === '/') {                                   // 닫는 태그
      var mc = /^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/.exec(src.slice(lt, lt + 80));
      if (!mc) { i = lt + 1; continue; }
      var cname = mc[1].toLowerCase(), found = -1, k;
      for (k = stack.length - 1; k >= 0; k--) { if (stack[k].tag === cname) { found = k; break; } }
      if (found >= 0) {
        for (k = stack.length - 1; k >= found; k--) if (stack[k].skip) skipDepth--;
        stack.length = found;
      }
      i = lt + mc[0].length;
      continue;
    }

    var mo = /^<([A-Za-z][A-Za-z0-9:-]*)/.exec(src.slice(lt, lt + 60));
    if (!mo) { i = lt + 1; continue; }                 // 태그가 아닌 '<'
    var tag = mo[1].toLowerCase();

    /* 속성 구간 끝(인용부호 안의 '>' 는 무시) */
    var j = lt + mo[0].length, q = '';
    while (j < n) {
      var ch = src.charAt(j);
      if (q) { if (ch === q) q = ''; j++; continue; }
      if (ch === '"' || ch === "'") { q = ch; j++; continue; }
      if (ch === '>') break;
      j++;
    }
    if (j >= n) break;
    var openEnd = j + 1;
    var attrSrc = src.slice(lt + mo[0].length, src.charAt(j - 1) === '/' ? j - 1 : j);
    var selfClose = src.charAt(j - 1) === '/';

    var a = parseAttrs(attrSrc);
    var skip = !!SKIP_TAG[tag] ||
      a['data-i18n'] != null ||
      tag === 'footer' ||
      hasClass(a['class'], 'cta');

    if (!skip && skipDepth === 0) {
      for (var t = 0; t < ATTRS.length; t++) {
        var v = a[ATTRS[t]];
        if (v == null) continue;
        var kk = normKey(v);
        if (usable(kk)) attrs.push(kk);
      }
    }

    if (RAW[tag]) {                                    // 원시 텍스트 요소는 통째로 건너뛴다
      var re = new RegExp('</' + tag + '\\s*>', 'i');
      var mm = re.exec(src.slice(openEnd));
      i = mm ? openEnd + mm.index + mm[0].length : n;
      continue;
    }
    if (VOID[tag] || selfClose) { i = openEnd; continue; }

    stack.push({ tag: tag, skip: skip });
    if (skip) skipDepth++;
    i = openEnd;
  }

  return { texts: texts, attrs: attrs };
}

function parseAttrs(s) {
  var out = {}, i = 0, n = s.length;
  while (i < n) {
    while (i < n && /[\s/]/.test(s.charAt(i))) i++;
    var ns = i;
    while (i < n && !/[\s=/]/.test(s.charAt(i))) i++;
    var name = s.slice(ns, i).toLowerCase();
    if (!name) { i++; continue; }
    while (i < n && /\s/.test(s.charAt(i))) i++;
    if (s.charAt(i) === '=') {
      i++;
      while (i < n && /\s/.test(s.charAt(i))) i++;
      var q = s.charAt(i);
      if (q === '"' || q === "'") {
        var e = s.indexOf(q, i + 1); if (e < 0) e = n;
        out[name] = s.slice(i + 1, e); i = e + 1;
      } else {
        var vs = i;
        while (i < n && !/\s/.test(s.charAt(i))) i++;
        out[name] = s.slice(vs, i);
      }
    } else if (out[name] == null) {
      out[name] = '';
    }
  }
  return out;
}

function hasClass(cls, want) {
  if (!cls) return false;
  var parts = String(cls).split(/\s+/);
  for (var i = 0; i < parts.length; i++) if (parts[i] === want) return true;
  return false;
}

/* ── 실행 ── */
function main() {
  var found = Object.create(null);       // 키 → [페이지…]
  var perPage = [];

  for (var p = 0; p < PAGES.length; p++) {
    var file = path.join(ROOT, PAGES[p]);
    if (!fs.existsSync(file)) { console.log('  (없음) ' + PAGES[p]); continue; }
    var res = scanPage(fs.readFileSync(file, 'utf8'));
    var all = res.texts.concat(res.attrs), fresh = 0;
    for (var i = 0; i < all.length; i++) {
      var k = all[i];
      if (!found[k]) { found[k] = []; fresh++; }
      if (found[k].indexOf(PAGES[p]) < 0) found[k].push(PAGES[p]);
    }
    perPage.push({ page: PAGES[p], total: all.length, texts: res.texts.length, attrs: res.attrs.length, fresh: fresh });
  }

  var extraFresh = 0;
  for (var x = 0; x < EXTRA.length; x++) {
    var ek = normKey(EXTRA[x]);
    if (!ek) continue;
    if (!found[ek]) { found[ek] = []; extraFresh++; }
    if (found[ek].indexOf('(런타임)') < 0) found[ek].push('(런타임)');
  }
  perPage.push({ page: '(런타임 조각)', total: EXTRA.length, texts: EXTRA.length, attrs: 0, fresh: extraFresh });

  /* ── data.js 에서 이미 짝이 있는 번역 가져오기 ──
     공지·뉴스 제목 같은 실데이터는 번역하지 않는다(원문 대조가 안 되므로).
     하지만 분야명·인명·연구실명처럼 **데이터 안에 국문과 영문이 나란히 있는 것**은
     화면 라벨이므로 영어 화면에서 한국어로 남으면 안 된다. 그 쌍만 사전에 옮긴다. */
  var PAIRS = [['ko', 'en'], ['rank', 'titleEn']];
  var dataPairs = {};
  var dataFile = path.join(ROOT, 'assets', 'js', 'data.js');
  if (fs.existsSync(dataFile)) {
    var ds = fs.readFileSync(dataFile, 'utf8');
    var root = null;
    try { root = JSON.parse(ds.slice(ds.indexOf('{'), ds.lastIndexOf('}') + 1)); }
    catch (e) { console.log('  (data.js 를 해석하지 못해 건너뜁니다: ' + e.message + ')'); }
    (function walk(v) {
      if (!v || typeof v !== 'object') return;
      if (v instanceof Array) { for (var i = 0; i < v.length; i++) walk(v[i]); return; }
      for (var p2 = 0; p2 < PAIRS.length; p2++) {
        var kk = v[PAIRS[p2][0]], ee = v[PAIRS[p2][1]];
        if (typeof kk === 'string' && typeof ee === 'string') {
          var nk = normKey(kk);
          /* 국문 쪽에 한글이 있고, 영문 쪽은 한글이 없어야 진짜 번역 쌍이다 */
          if (nk && /[가-힣]/.test(nk) && !/[가-힣]/.test(ee) && ee.trim()) dataPairs[nk] = ee.trim();
        }
      }
      var ks = Object.keys(v);
      for (var j = 0; j < ks.length; j++) walk(v[ks[j]]);
    })(root);
  }
  var dpKeys = Object.keys(dataPairs);
  for (var q = 0; q < dpKeys.length; q++) {
    if (!found[dpKeys[q]]) found[dpKeys[q]] = [];
    if (found[dpKeys[q]].indexOf('(data.js)') < 0) found[dpKeys[q]].push('(data.js)');
  }
  perPage.push({ page: '(data.js 국·영 쌍)', total: dpKeys.length, texts: dpKeys.length, attrs: 0, fresh: dpKeys.length });

  var prev = {};
  if (fs.existsSync(DICT)) {
    try { prev = JSON.parse(fs.readFileSync(DICT, 'utf8')) || {}; }
    catch (e) { console.error('en.json 을 읽을 수 없습니다 — 병합을 중단합니다: ' + e.message); process.exit(1); }
  }

  var keys = Object.keys(found), added = 0, orphan = 0, filled = 0;
  var merged = {};
  for (var a = 0; a < keys.length; a++) {
    var key = keys[a];
    if (Object.prototype.hasOwnProperty.call(prev, key) && prev[key]) {
      merged[key] = prev[key];                       // 사람이 넣은 번역이 우선
    } else if (dataPairs[key]) {
      merged[key] = dataPairs[key];                  // data.js 가 이미 갖고 있던 영문
      if (!Object.prototype.hasOwnProperty.call(prev, key)) added++; else filled++;
    } else if (Object.prototype.hasOwnProperty.call(prev, key)) {
      merged[key] = prev[key];
    } else { merged[key] = ''; added++; }
  }
  var pk = Object.keys(prev);
  for (var b = 0; b < pk.length; b++) {
    if (!Object.prototype.hasOwnProperty.call(merged, pk[b])) { merged[pk[b]] = prev[pk[b]]; orphan++; }
  }

  var sorted = Object.keys(merged).sort(function (x, y) { return x < y ? -1 : x > y ? 1 : 0; });
  var out = {};
  var done = 0;
  for (var c = 0; c < sorted.length; c++) {
    out[sorted[c]] = merged[sorted[c]];
    if (merged[sorted[c]]) done++;
  }

  var dir = path.dirname(DICT);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DICT, JSON.stringify(out, null, 2).replace(/\r\n/g, '\n') + '\n', 'utf8');

  /* ── 보고 ── */
  console.log('페이지별 추출 (텍스트 / 속성)');
  for (var d = 0; d < perPage.length; d++) {
    var r = perPage[d];
    console.log('  ' + pad(r.page, 20) + ' ' + pad(String(r.texts), 5) + ' / ' + pad(String(r.attrs), 4) +
      '   신규 키 ' + r.fresh);
  }
  console.log('');
  console.log('사전: ' + path.relative(ROOT, DICT).replace(/\\/g, '/'));
  console.log('  전체   ' + sorted.length + '개');
  console.log('  번역됨 ' + done + '개 (' + Math.round(done / Math.max(1, sorted.length) * 100) + '%)');
  console.log('  미번역 ' + (sorted.length - done) + '개');
  console.log("  이번에 추가 " + added + "개 · data.js 번역으로 채운 기존 키 " + filled + "개 · 원문에서 사라진 키 " + orphan + "개(보존)");
}

function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }

main();
