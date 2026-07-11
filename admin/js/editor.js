/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — editor.js (핵심 엔진)

   설계 원칙: "라이브 DOM은 화면, 원본(pristine) DOM이 진실".
   · 파일 HTML → DOMParser → 모든 요소에 data-eid 태깅 → pristineDoc 보관.
   · iframe에는 pristine 사본을 자산(blob URL) 치환 후 srcdoc으로 렌더.
     사이트 스크립트(main.js/data.js)가 그대로 실행되어 실제 모습을 보여준다.
   · 모든 편집은 eid로 pristine에 미러링. 저장 시 data-eid만 제거해 직렬화.
     → JS가 런타임에 주입한 클래스·노드는 원본에 섞이지 않는다.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin;
var U = Admin.util;

/* ── 상태 ── */
var pristineDoc = null;     // Document (data-eid 포함)
var path = null;            // 현재 파일 경로
var eidSeq = 0;
var history = [];           // pristine 직렬화 스냅샷 (eid 포함)
var hIndex = -1;
var dirty = false;
var mode = 'edit';          // 'edit' | 'preview'
var selectedEid = null;
var draftHtml = null;       // 미리보기 중인 임시 HTML (null=없음)
var assetCache = new Map();     // 상대경로 → blob URL (편집 캔버스, same-origin)
var assetTextCache = new Map(); // 상대경로 → 텍스트 (sandbox 미리보기 인라인용)
var assetDataCache = new Map(); // 상대경로 → data: URL (sandbox 미리보기 미디어용)
var frame = null;           // iframe 엘리먼트 (lazy)

var HISTORY_MAX = 80;
var savedSnap = null;       // 마지막 저장 시점의 스냅샷 (dirty 판정 기준)

function getFrame() {
  if (!frame) frame = document.getElementById('canvasFrame');
  return frame;
}

/* ═══════════ 태깅 · 직렬화 ═══════════ */

function tagDoc(doc) {
  var all = doc.querySelectorAll('*');
  for (var i = 0; i < all.length; i++) {
    if (!all[i].hasAttribute('data-eid')) {
      eidSeq += 1;
      all[i].setAttribute('data-eid', 'e' + eidSeq);
    }
  }
}

function serialize(doc) {
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

function parseHtml(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/* 저장용: data-eid 및 편집 잔여물 제거 */
function cleanClone() {
  var clone = pristineDoc.cloneNode(true);
  var all = clone.querySelectorAll('[data-eid]');
  for (var i = 0; i < all.length; i++) {
    all[i].removeAttribute('data-eid');
    all[i].removeAttribute('contenteditable');
    all[i].removeAttribute('spellcheck');
  }
  // 안전망: 런타임 리빌 클래스·딜레이 스타일이 미러링으로 유입됐다면 제거
  var revs = clone.querySelectorAll('.reveal.in');
  for (var j = 0; j < revs.length; j++) revs[j].classList.remove('in');
  var styled = clone.querySelectorAll('[style]');
  for (var k = 0; k < styled.length; k++) {
    styled[k].style.removeProperty('--reveal-delay');
    if (styled[k].getAttribute('style') === '') styled[k].removeAttribute('style');
  }
  return clone;
}

/* ═══════════ 히스토리 ═══════════ */

function pushHistory() {
  if (!pristineDoc) return;
  var snap = serialize(pristineDoc);
  if (hIndex >= 0 && history[hIndex] === snap) return;
  history = history.slice(0, hIndex + 1);
  history.push(snap);
  if (history.length > HISTORY_MAX) history.shift();
  hIndex = history.length - 1;
  setDirty(snap !== savedSnap);
  emitHistoryState();
}
var pushHistoryDebounced = U.debounce(pushHistory, 700);

function emitHistoryState() {
  Admin.bus.emit('editor:history', { canUndo: hIndex > 0, canRedo: hIndex < history.length - 1 });
}

function setDirty(v) {
  if (dirty === v) return;
  dirty = v;
  Admin.state.dirty = v;
  Admin.bus.emit('editor:dirty', { dirty: v });
}

/* ═══════════ 자산 치환 (iframe 렌더용) ═══════════ */

function isRelative(url) {
  return url && !/^(https?:|data:|blob:|#|mailto:|tel:|\/\/)/i.test(url);
}

async function assetUrl(rel, asText) {
  // 'assets/css/main.css' 형태만 지원 (사이트 규약이 전부 상대경로)
  var key = rel.replace(/^\.\//, '').split('#')[0].split('?')[0];
  if (assetCache.has(key)) return assetCache.get(key);
  var url = null;
  try {
    if (asText) {
      var txt = await Admin.fs.readFile(key);
      var type = /\.css$/i.test(key) ? 'text/css' : 'text/javascript';
      url = URL.createObjectURL(new Blob([txt], { type: type }));
    } else {
      url = await Admin.fs.fileUrl(key);
    }
  } catch (e) { url = null; }
  if (url) assetCache.set(key, url);
  return url;
}

/* 자산 텍스트(캐시). sandbox 미리보기에서 blob 대신 인라인 삽입할 때 사용 */
function assetKeyOf(rel) {
  return rel.replace(/^\.\//, '').split('#')[0].split('?')[0];
}
async function assetText(rel) {
  var key = assetKeyOf(rel);
  if (assetTextCache.has(key)) return assetTextCache.get(key);
  var txt = null;
  try { txt = await Admin.fs.readFile(key); } catch (e) { txt = null; }
  if (txt != null) assetTextCache.set(key, txt);
  return txt;
}
/* 바이너리 자산 → data: URL(캐시). sandbox 프레임은 부모 blob URL을 못 읽으므로 */
async function assetDataUrl(rel) {
  var key = assetKeyOf(rel);
  if (assetDataCache.has(key)) return assetDataCache.get(key);
  var durl = null;
  try {
    var burl = await Admin.fs.fileUrl(key);
    if (burl) {
      var blob = await fetch(burl).then(function (r) { return r.blob(); });
      try { URL.revokeObjectURL(burl); } catch (e) {}
      durl = await new Promise(function (res) {
        var fr = new FileReader();
        fr.onload = function () { res(fr.result); };
        fr.onerror = function () { res(null); };
        fr.readAsDataURL(blob);
      });
    }
  } catch (e) { durl = null; }
  if (durl) assetDataCache.set(key, durl);
  return durl;
}

/* pristine 사본의 상대 자산 참조를 렌더용으로 치환한 HTML 생성.
   opts.inline=true(초안·버전 미리보기): sandbox(opaque origin) 프레임은 부모가
   만든 blob: URL을 로드할 수 없으므로 CSS/JS는 인라인, 미디어는 data: URL로 삽입.
   opts.inline=false(편집 캔버스, same-origin): 종전대로 blob: URL 치환(빠름·저메모리). */
async function buildRenderHtml(sourceDoc, opts) {
  var inline = !!(opts && opts.inline);
  var doc = sourceDoc.cloneNode(true);
  var i, el, u;

  // 캔버스 부트스트랩: 사이트 JS의 언어 상태가 편집 세션에 끼어들지 않도록
  // (EN 상태로 렌더되면 i18n 텍스트가 원본에 미러링될 수 있음 — 항상 KO로 렌더)
  var boot = doc.createElement('script');
  boot.textContent = "try{localStorage.removeItem('ysme-lang');}catch(e){}";
  if (doc.head) doc.head.insertBefore(boot, doc.head.firstChild);

  var links = doc.querySelectorAll('link[rel="stylesheet"][href]');
  for (i = 0; i < links.length; i++) {
    el = links[i];
    var href = el.getAttribute('href');
    if (!isRelative(href)) continue;
    if (inline) {
      var css = await assetText(href);
      if (css != null && el.parentNode) {
        var styleEl = doc.createElement('style');
        var mediaAttr = el.getAttribute('media');
        if (mediaAttr) styleEl.setAttribute('media', mediaAttr);
        styleEl.textContent = css;
        el.parentNode.replaceChild(styleEl, el);
      }
    } else {
      u = await assetUrl(href, true);
      if (u) el.setAttribute('href', u);
    }
  }
  var scripts = doc.querySelectorAll('script[src]');
  for (i = 0; i < scripts.length; i++) {
    el = scripts[i];
    var ssrc = el.getAttribute('src');
    if (!isRelative(ssrc)) continue;
    if (inline) {
      var js = await assetText(ssrc);
      if (js != null && el.parentNode) {
        var scriptEl = doc.createElement('script');
        var stype = el.getAttribute('type');
        if (stype) scriptEl.setAttribute('type', stype);
        // 직렬화 시 </script> 로 조기 종료되는 것 방지(문자열 리터럴 내 등장 대비)
        scriptEl.textContent = String(js).replace(/<\/(script)/gi, '<\\/$1');
        el.parentNode.replaceChild(scriptEl, el);
      }
    } else {
      u = await assetUrl(ssrc, true);
      if (u) el.setAttribute('src', u);
    }
  }
  var media = doc.querySelectorAll('img[src], source[src], video[src], audio[src]');
  for (i = 0; i < media.length; i++) {
    el = media[i];
    var msrc = el.getAttribute('src');
    if (!isRelative(msrc)) continue;
    if (inline) {
      var d = await assetDataUrl(msrc);
      if (d) el.setAttribute('src', d);
    } else {
      u = await assetUrl(msrc, false);
      if (u) el.setAttribute('src', u);
    }
  }
  return serialize(doc);
}

/* ═══════════ 캔버스 렌더 ═══════════ */

var renderToken = 0;   // 연속 렌더 경합 방지

async function renderCanvas(opts) {
  // opts: {keepScroll}
  var f = getFrame();
  if (!f) return;
  var token = ++renderToken;

  var scrollY = 0;
  if (opts && opts.keepScroll) {
    try { scrollY = f.contentWindow ? f.contentWindow.scrollY : 0; } catch (e) {}
  }

  var src = draftHtml != null ? parseHtml(draftHtml) : pristineDoc;
  if (!src) return;

  // 초안(AI 응답·버전 미리보기)은 신뢰할 수 없는 입력 → null-origin sandbox 로 격리.
  // 스크립트는 실행되지만 admin 오리진의 IndexedDB(API 키·계정)에 접근할 수 없다.
  // sandbox 프레임은 부모 blob: URL을 못 읽으므로 자산을 인라인으로 삽입(inline:true).
  var sandboxed = draftHtml != null;
  var html = await buildRenderHtml(src, { inline: sandboxed });
  if (token !== renderToken) return;   // 그 사이 새 렌더 요청됨
  if (sandboxed) f.setAttribute('sandbox', 'allow-scripts');
  else f.removeAttribute('sandbox');

  await new Promise(function (resolve) {
    function onload() {
      f.removeEventListener('load', onload);
      resolve();
    }
    f.addEventListener('load', onload);
    f.srcdoc = html;
  });
  if (token !== renderToken) return;

  if (sandboxed) return;   // 격리 프레임은 상호작용·스크롤 제어 불가(의도됨)

  try {
    attachInteraction(f.contentDocument, f.contentWindow);
    if (scrollY) f.contentWindow.scrollTo(0, scrollY);
  } catch (e) {
    console.error('[editor] iframe 접근 실패', e);
  }
}

/* ═══════════ iframe 상호작용 ═══════════ */

var hoverBox = null, selBox = null;

function makeBox(doc, color, dashed) {
  var b = doc.createElement('div');
  b.setAttribute('data-admin-ui', '');
  b.style.cssText =
    'position:absolute;z-index:2147483000;pointer-events:none;display:none;' +
    'border:' + (dashed ? '1.5px dashed ' : '2px solid ') + color + ';' +
    'border-radius:2px;box-sizing:border-box;';
  doc.body.appendChild(b);
  return b;
}

function positionBox(box, el, win) {
  if (!box || !el || !el.getBoundingClientRect) return;
  var r = el.getBoundingClientRect();
  box.style.display = 'block';
  box.style.left = (r.left + win.scrollX) + 'px';
  box.style.top = (r.top + win.scrollY) + 'px';
  box.style.width = r.width + 'px';
  box.style.height = r.height + 'px';
}

function liveEl(eid) {
  var f = getFrame();
  try { return f.contentDocument.querySelector('[data-eid="' + eid + '"]'); }
  catch (e) { return null; }
}

function pristineEl(eid) {
  return pristineDoc ? pristineDoc.querySelector('[data-eid="' + eid + '"]') : null;
}

function attachInteraction(doc, win) {
  if (!doc || !doc.body) return;
  hoverBox = null; selBox = null;

  var interactive = (mode === 'edit') && draftHtml == null;

  if (!interactive) {
    // 미리보기/초안 모드: 내부 페이지 링크만 가로채 앱 내 탐색으로
    doc.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (/^#/.test(href)) return;                       // 앵커는 그대로
      e.preventDefault();
      if (/\.html?(\?|#|$)/i.test(href) && isRelative(href)) {
        Admin.bus.emit('canvas:navigate', { href: href.split('#')[0] });
      }
      // 외부 링크는 편집 도구 안에서는 이동하지 않음
    }, true);
    return;
  }

  hoverBox = makeBox(doc, 'rgba(26,91,176,.9)', true);
  selBox = makeBox(doc, '#c9a227', false);

  doc.addEventListener('mousemove', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-eid]') : null;
    if (!t || t.tagName === 'HTML' || t.tagName === 'BODY') {
      hoverBox.style.display = 'none';
      return;
    }
    if (selectedEid && t.getAttribute('data-eid') === selectedEid) {
      hoverBox.style.display = 'none';
      return;
    }
    positionBox(hoverBox, t, win);
  }, true);

  doc.addEventListener('mouseleave', function () {
    if (hoverBox) hoverBox.style.display = 'none';
  });

  doc.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-eid]') : null;
    // 텍스트 편집 중인 요소 내부 클릭은 캐럿 이동으로 허용
    if (selectedEid && t) {
      var sel = liveEl(selectedEid);
      if (sel && sel.isContentEditable && sel.contains(t)) {
        if (t.closest('a')) e.preventDefault();   // 링크 이동만 차단
        return;
      }
    }
    e.preventDefault();
    e.stopPropagation();
    if (!t || t.tagName === 'HTML' || t.tagName === 'BODY') { select(null); return; }
    select(t.getAttribute('data-eid'));
  }, true);

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') select(null);
  }, true);

  // 텍스트 편집 미러링
  doc.addEventListener('input', function (e) {
    if (!selectedEid) return;
    var el = liveEl(selectedEid);
    if (!el || !el.isContentEditable) return;
    if (e.target !== el && !el.contains(e.target)) return;
    mirrorInnerHtml(selectedEid);
    positionBox(selBox, el, win);
    pushHistoryDebounced();
  }, true);

  ['scroll', 'resize'].forEach(function (evt) {
    win.addEventListener(evt, function () {
      if (selectedEid) {
        var el = liveEl(selectedEid);
        if (el) positionBox(selBox, el, win);
      }
      if (hoverBox) hoverBox.style.display = 'none';
    }, { passive: true });
  });

  // 렌더 직후 기존 선택 복원
  if (selectedEid) {
    var el = liveEl(selectedEid);
    if (el) positionBox(selBox, el, win);
    else select(null);
  }
}

/* 라이브 요소 → pristine 미러 (런타임 오염 제거)
   사이트 JS(main.js)가 라이브 DOM에 주입하는 상태는 원본에 섞이면 안 된다:
   .reveal 의 in 클래스 / --reveal-delay 인라인 스타일 / 토글류 aria·data 속성. */
var SYNC_ATTRS = ['aria-expanded', 'aria-pressed', 'aria-selected',
  'aria-activedescendant', 'data-open', 'hidden'];

function mirrorInnerHtml(eid) {
  var live = liveEl(eid), pris = pristineEl(eid);
  if (!live || !pris) return;
  var clone = live.cloneNode(true);
  // 관리 UI 노드 제거(이론상 body 직속이지만 방어)
  var uiNodes = clone.querySelectorAll('[data-admin-ui]');
  for (var i = 0; i < uiNodes.length; i++) uiNodes[i].remove();
  // 사이트 JS가 주입하는 상태 클래스/속성 제거
  var revs = clone.querySelectorAll('.reveal.in');
  for (var j = 0; j < revs.length; j++) revs[j].classList.remove('in');
  var ce = clone.querySelectorAll('[contenteditable]');
  for (var k = 0; k < ce.length; k++) {
    ce[k].removeAttribute('contenteditable');
    ce[k].removeAttribute('spellcheck');
  }
  // eid 보유 하위 요소: 런타임 스타일 제거 + 토글 속성은 원본(pristine) 값으로 복원
  var kids = clone.querySelectorAll('[data-eid]');
  for (var m = 0; m < kids.length; m++) {
    var el = kids[m];
    if (el.style) {
      el.style.removeProperty('--reveal-delay');
      if (el.getAttribute('style') === '') el.removeAttribute('style');
    }
    var pk = pris.querySelector('[data-eid="' + el.getAttribute('data-eid') + '"]');
    if (pk) {
      for (var a = 0; a < SYNC_ATTRS.length; a++) {
        var name = SYNC_ATTRS[a];
        if (pk.hasAttribute(name)) el.setAttribute(name, pk.getAttribute(name));
        else el.removeAttribute(name);
      }
    }
  }
  pris.innerHTML = clone.innerHTML;
}

/* ═══════════ 선택 · 인스펙터 ═══════════ */

function select(eid) {
  // 이전 선택 정리
  if (selectedEid) {
    var prev = liveEl(selectedEid);
    if (prev) {
      prev.removeAttribute('contenteditable');
      prev.removeAttribute('spellcheck');
    }
  }
  selectedEid = eid || null;

  var f = getFrame();
  if (!selectedEid) {
    if (selBox) selBox.style.display = 'none';
    renderInspector(null);
    Admin.bus.emit('editor:selected', null);
    return;
  }
  var el = liveEl(selectedEid);
  if (!el) { selectedEid = null; renderInspector(null); return; }

  // 텍스트 편집 가능 여부: 하위에 JS 생성 노드(무 eid)가 섞여 있으면 비활성
  var editable = isTextEditable(el);
  if (editable) {
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('spellcheck', 'false');
  }
  if (selBox) positionBox(selBox, el, f.contentWindow);
  renderInspector(el, editable);
  Admin.bus.emit('editor:selected', { eid: selectedEid, tag: el.tagName.toLowerCase() });
}

function isTextEditable(el) {
  if (/^(script|style|iframe|svg|img|input|select|textarea|video|audio)$/i.test(el.tagName)) return false;
  // 하위 요소 중 data-eid 없는 것 = 사이트 JS가 생성 → 미러링 시 원본 오염 위험
  var kids = el.querySelectorAll('*');
  for (var i = 0; i < kids.length; i++) {
    if (!kids[i].hasAttribute('data-eid') && !kids[i].hasAttribute('data-admin-ui')) return false;
    if (/^(script|iframe)$/i.test(kids[i].tagName)) return false;
  }
  return true;
}

function elPath(el) {
  var parts = [];
  var cur = el;
  var depth = 0;
  while (cur && cur.tagName && cur.tagName !== 'BODY' && depth < 4) {
    var s = cur.tagName.toLowerCase();
    if (cur.id) s += '#' + cur.id;
    else if (cur.classList && cur.classList.length) s += '.' + cur.classList[0];
    parts.unshift(s);
    cur = cur.parentElement;
    depth += 1;
  }
  return parts.join(' › ');
}

/* 토큰 선택지 (사이트 디자인 시스템과 동일) */
var COLOR_TOKENS = [
  ['', '기본(변경 없음)'],
  ['var(--text)', '본문 텍스트'],
  ['var(--text-2)', '보조 텍스트'],
  ['var(--brand)', '브랜드 네이비'],
  ['var(--link)', '링크 블루'],
  ['var(--accent-gold)', '골드(절제)'],
  ['#ffffff', '흰색(네이비 위)']
];
var BG_TOKENS = [
  ['', '기본(변경 없음)'],
  ['var(--bg)', '페이지 배경'],
  ['var(--surface)', '카드 표면'],
  ['var(--surface-2)', '교차 배경'],
  ['var(--brand)', '브랜드 네이비'],
  ['transparent', '투명']
];

function renderInspector(el, editable) {
  var empty = document.getElementById('inspEmpty');
  var body = document.getElementById('inspBody');
  if (!empty || !body) return;

  if (!el) {
    empty.hidden = false;
    body.hidden = true;
    body.innerHTML = '';
    return;
  }
  empty.hidden = true;
  body.hidden = false;

  var pris = pristineEl(el.getAttribute('data-eid'));
  var tag = el.tagName.toLowerCase();
  var h = '';

  h += '<p class="insp-elpath mono">' + U.escapeHtml(elPath(el)) + '</p>';

  /* 텍스트 */
  h += '<div class="insp-sec"><p class="insp-sec-title">텍스트</p>';
  if (editable) {
    h += '<p class="insp-note">캔버스에서 직접 입력하거나 아래에서 수정하세요.</p>' +
      '<div class="insp-field"><textarea class="insp-textarea" id="inspText" rows="3">' +
      U.escapeHtml(el.textContent) + '</textarea></div>';
  } else {
    h += '<p class="insp-note">이 영역의 콘텐츠는 사이트 스크립트(data.js)가 생성하거나 편집 불가 요소를 포함합니다. 데이터는 코드 모드에서 assets/js/data.js 를 수정하세요.</p>';
  }
  h += '</div>';

  /* 속성 */
  var attrs = [];
  if (tag === 'a') attrs.push(['href', '링크 (href)']);
  if (tag === 'img') { attrs.push(['src', '이미지 경로 (src)']); attrs.push(['alt', '대체 텍스트 (alt)']); }
  if (tag === 'time') attrs.push(['datetime', '기계용 날짜 (datetime)']);
  attrs.push(['title', '툴팁 (title)']);
  h += '<div class="insp-sec"><p class="insp-sec-title">속성</p>';
  attrs.forEach(function (a) {
    h += '<div class="insp-field"><label>' + U.escapeHtml(a[1]) + '</label>' +
      '<input class="insp-input" data-attr="' + a[0] + '" value="' +
      U.escapeHtml(el.getAttribute(a[0]) || '') + '" /></div>';
  });
  h += '</div>';

  /* 스타일 (토큰 한정) */
  function optHtml(tokens, cur) {
    return tokens.map(function (t) {
      return '<option value="' + U.escapeHtml(t[0]) + '"' + (cur === t[0] ? ' selected' : '') + '>' +
        U.escapeHtml(t[1]) + '</option>';
    }).join('');
  }
  var st = (pris && pris.style) ? pris.style : { color: '', backgroundColor: '', textAlign: '', display: '' };
  h += '<div class="insp-sec"><p class="insp-sec-title">스타일 (디자인 토큰)</p>' +
    '<div class="insp-field"><label>글자 색</label><select class="insp-select" data-style="color">' +
    optHtml(COLOR_TOKENS, st.color || '') + '</select></div>' +
    '<div class="insp-field"><label>배경 색</label><select class="insp-select" data-style="backgroundColor">' +
    optHtml(BG_TOKENS, st.backgroundColor || '') + '</select></div>' +
    '<div class="insp-field"><label>정렬</label><select class="insp-select" data-style="textAlign">' +
    '<option value=""' + (!st.textAlign ? ' selected' : '') + '>기본(좌측)</option>' +
    '<option value="center"' + (st.textAlign === 'center' ? ' selected' : '') + '>중앙</option>' +
    '<option value="right"' + (st.textAlign === 'right' ? ' selected' : '') + '>우측</option></select></div>' +
    '<div class="insp-field"><label class="insp-check"><input type="checkbox" id="inspHide"' +
    (st.display === 'none' ? ' checked' : '') + ' /> 이 요소 숨기기</label></div>' +
    '</div>';

  /* 동작 */
  h += '<div class="insp-sec"><p class="insp-sec-title">동작</p>' +
    '<div class="insp-row">' +
    '<button type="button" class="insp-btn" data-act="up">위로</button>' +
    '<button type="button" class="insp-btn" data-act="down">아래로</button>' +
    '<button type="button" class="insp-btn" data-act="dup">복제</button>' +
    '<button type="button" class="insp-btn insp-btn--danger" data-act="del">삭제</button>' +
    '</div>' +
    '<div class="insp-row">' +
    '<button type="button" class="insp-btn insp-btn--ai" data-act="ai">AI로 이 요소 수정</button>' +
    '</div></div>';

  body.innerHTML = h;
  wireInspector(el.getAttribute('data-eid'), editable);
}

function wireInspector(eid, editable) {
  var body = document.getElementById('inspBody');
  if (!body) return;

  var txt = body.querySelector('#inspText');
  if (txt && editable) {
    txt.addEventListener('input', U.debounce(function () {
      var live = liveEl(eid), pris = pristineEl(eid);
      if (!live || !pris) return;
      live.textContent = txt.value;
      pris.textContent = txt.value;
      pushHistoryDebounced();
      var f = getFrame();
      if (selBox && f) positionBox(selBox, live, f.contentWindow);
    }, 250));
  }

  body.querySelectorAll('[data-attr]').forEach(function (input) {
    input.addEventListener('change', function () {
      var live = liveEl(eid), pris = pristineEl(eid);
      if (!live || !pris) return;
      var name = input.getAttribute('data-attr');
      var v = input.value.trim();
      if (v === '') { live.removeAttribute(name); pris.removeAttribute(name); }
      else { live.setAttribute(name, v); pris.setAttribute(name, v); }
      pushHistory();
    });
  });

  body.querySelectorAll('[data-style]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      var live = liveEl(eid), pris = pristineEl(eid);
      if (!live || !pris) return;
      var prop = sel.getAttribute('data-style');
      live.style[prop] = sel.value;
      pris.style[prop] = sel.value;
      syncStyleAttr(live, pris);
      pushHistory();
    });
  });

  var hide = body.querySelector('#inspHide');
  if (hide) {
    hide.addEventListener('change', function () {
      var live = liveEl(eid), pris = pristineEl(eid);
      if (!live || !pris) return;
      live.style.display = hide.checked ? 'none' : '';
      pris.style.display = hide.checked ? 'none' : '';
      syncStyleAttr(live, pris);
      pushHistory();
      var f = getFrame();
      if (selBox && f) positionBox(selBox, live, f.contentWindow);
    });
  }

  body.querySelectorAll('[data-act]').forEach(function (btn) {
    btn.addEventListener('click', function () { doAction(eid, btn.getAttribute('data-act')); });
  });
}

/* style="" 빈 껍데기 제거 */
function syncStyleAttr(live, pris) {
  [live, pris].forEach(function (el) {
    if (el.getAttribute('style') === '') el.removeAttribute('style');
  });
}

async function doAction(eid, act) {
  var pris = pristineEl(eid);
  if (!pris) return;

  if (act === 'ai') {
    var live = liveEl(eid);
    Admin.bus.emit('ai:editElement', {
      eid: eid,
      tag: pris.tagName.toLowerCase(),
      outerHTML: pris.outerHTML
    });
    Admin.toast('우측 AI 어시스턴트 탭에 요소가 연결되었습니다.', 'info');
    return;
  }

  if (act === 'del') {
    var okDel = await Admin.confirm('선택한 요소를 삭제할까요?\n(저장 전까지는 실행 취소로 되돌릴 수 있습니다)');
    if (!okDel) return;
    pris.remove();
    select(null);
    pushHistory();
    renderCanvas({ keepScroll: true });
    return;
  }

  if (act === 'dup') {
    var copy = pris.cloneNode(true);
    // 복제본 서브트리에 새 eid 부여
    var nodes = [copy].concat(Array.prototype.slice.call(copy.querySelectorAll('*')));
    nodes.forEach(function (n) {
      eidSeq += 1;
      n.setAttribute('data-eid', 'e' + eidSeq);
    });
    pris.after(copy);
    pushHistory();
    renderCanvas({ keepScroll: true });
    return;
  }

  if (act === 'up' || act === 'down') {
    var sib = act === 'up' ? pris.previousElementSibling : pris.nextElementSibling;
    if (!sib || sib.hasAttribute('data-admin-ui')) {
      Admin.toast(act === 'up' ? '이미 맨 위입니다.' : '이미 맨 아래입니다.', 'info');
      return;
    }
    if (act === 'up') sib.before(pris);
    else sib.after(pris);
    pushHistory();
    renderCanvas({ keepScroll: true });
    return;
  }
}

/* ═══════════ 공개 API ═══════════ */

Admin.editor = {

  loadPage: async function (p, html, opts) {
    opts = opts || {};
    path = p;
    Admin.state.currentPath = p;
    draftHtml = null;
    selectedEid = null;
    pristineDoc = parseHtml(html);
    tagDoc(pristineDoc);
    history = [serialize(pristineDoc)];
    hIndex = 0;
    savedSnap = opts.markDirty ? null : history[0];
    dirty = !!opts.markDirty;
    Admin.state.dirty = dirty;
    Admin.bus.emit('editor:dirty', { dirty: dirty });
    emitHistoryState();
    renderInspector(null);
    hideDraftBanner();
    await renderCanvas({});
    Admin.bus.emit('page:loaded', { path: p });
  },

  getCleanHtml: function () {
    if (!pristineDoc) return '';
    return serialize(cleanClone());
  },

  currentPath: function () { return path; },

  setMode: function (m) {
    if (m !== 'edit' && m !== 'preview') return;
    if (mode === m) return;
    mode = m;
    Admin.state.mode = m;
    select(null);
    renderCanvas({ keepScroll: true });
  },

  setViewport: function (vp) {
    var wrap = document.getElementById('canvasWrap');
    if (wrap) {
      wrap.dataset.vp = vp;                                // admin.css 훅
      wrap.classList.toggle('is-mobile', vp === 'mobile'); // 보조 훅
    }
    // 뷰포트 전환 후 선택 박스 위치 재계산
    if (selectedEid) {
      var f = getFrame(), el = liveEl(selectedEid);
      if (el && f && selBox) setTimeout(function () { positionBox(selBox, el, f.contentWindow); }, 350);
    }
  },

  previewDraft: function (html, opts) {
    draftHtml = html;
    select(null);
    showDraftBanner((opts && opts.label) || '미리보기');
    renderCanvas({});
  },

  exitDraft: function () {
    if (draftHtml == null) return;
    draftHtml = null;
    hideDraftBanner();
    renderCanvas({ keepScroll: true });
  },

  isDraft: function () { return draftHtml != null; },

  undo: function () {
    if (hIndex <= 0) return;
    hIndex -= 1;
    restoreFromHistory();
  },
  redo: function () {
    if (hIndex >= history.length - 1) return;
    hIndex += 1;
    restoreFromHistory();
  },
  canUndo: function () { return hIndex > 0; },
  canRedo: function () { return hIndex < history.length - 1; },

  isDirty: function () { return dirty; },
  markSaved: function () {
    savedSnap = pristineDoc ? serialize(pristineDoc) : null;
    setDirty(false);
  },

  selectedInfo: function () {
    if (!selectedEid) return null;
    var pris = pristineEl(selectedEid);
    if (!pris) return null;
    return { eid: selectedEid, tag: pris.tagName.toLowerCase(), outerHTML: pris.outerHTML };
  },

  /* 저장 후 자산 캐시 무효화용 */
  invalidateAssets: function () {
    assetCache.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} });
    assetCache.clear();
    assetTextCache.clear();
    assetDataCache.clear();
  },

  rerender: function () { return renderCanvas({ keepScroll: true }); }
};

function restoreFromHistory() {
  pristineDoc = parseHtml(history[hIndex]);
  // eidSeq 를 최대값 이후로 보정 (복원 후 복제 시 충돌 방지)
  var all = pristineDoc.querySelectorAll('[data-eid]');
  for (var i = 0; i < all.length; i++) {
    var n = parseInt(String(all[i].getAttribute('data-eid')).slice(1), 10);
    if (n && n > eidSeq) eidSeq = n;
  }
  setDirty(history[hIndex] !== savedSnap);
  select(null);
  emitHistoryState();
  renderCanvas({ keepScroll: true });
}

function showDraftBanner(label) {
  var b = document.getElementById('draftBanner');
  var t = document.getElementById('draftLabelTxt');
  if (t) t.textContent = label;
  if (b) b.hidden = false;
}
function hideDraftBanner() {
  var b = document.getElementById('draftBanner');
  if (b) b.hidden = true;
}

/* 자산 파일이 저장되면 캐시 갱신 */
document.addEventListener('DOMContentLoaded', function () {
  Admin.bus.on('file:saved', function (d) {
    if (d && d.path && /\.(css|js)$/i.test(d.path)) {
      Admin.editor.invalidateAssets();
      if (pristineDoc) renderCanvas({ keepScroll: true });
    }
  });
  var exitBtn = document.getElementById('btnDraftExit');
  if (exitBtn) exitBtn.addEventListener('click', function () {
    Admin.editor.exitDraft();
    Admin.bus.emit('draft:exited', {});
  });
});

})();
