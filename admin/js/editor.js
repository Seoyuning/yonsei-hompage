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
  // 안전망: 관리 UI 노드(선택 박스·태그 칩)는 라이브 DOM 전용이라 원본에 있을 수 없지만,
  // 미러링 사고로 유입되면 저장본이 오염된다 → 저장 경계에서 한 번 더 걷어낸다.
  var ui = clone.querySelectorAll('[data-admin-ui]');
  for (var u = 0; u < ui.length; u++) ui[u].remove();
  var all = clone.querySelectorAll('[data-eid],[contenteditable],[spellcheck]');
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

  // 리다이렉트 무력화: index.html 스텁의 meta refresh·location.replace 가
  // srcdoc 프레임에서는 admin 오리진 기준으로 풀려 캔버스를 404 로 끌고 간다
  var metas = doc.querySelectorAll('meta[http-equiv]');
  for (i = 0; i < metas.length; i++) {
    if (/^refresh$/i.test(metas[i].getAttribute('http-equiv')) && metas[i].parentNode) {
      metas[i].parentNode.removeChild(metas[i]);
    }
  }
  var inlines = doc.querySelectorAll('script:not([src])');
  for (i = 0; i < inlines.length; i++) {
    if (/location\.(replace|assign)\s*\(/.test(inlines[i].textContent) && inlines[i].parentNode) {
      inlines[i].parentNode.removeChild(inlines[i]);
    }
  }

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

var CHIP_H = 15;   // 칩 높이(px) — 박스 위에 얹는 오프셋

/* 요소 라벨: tag + (#id 또는 .첫클래스). 태그 칩·브레드크럼 공용.
   body/html 은 사이트 JS가 상태 클래스를 붙이므로 태그명으로 고정한다. */
function elLabel(el) {
  if (!el || !el.tagName) return '';
  var t = el.tagName.toLowerCase();
  if (t === 'body' || t === 'html') return t;
  if (el.id) return t + '#' + el.id;
  if (el.classList && el.classList.length) return t + '.' + el.classList[0];
  return t;
}

/* 박스 + 라벨 칩 한 쌍 생성.
   칩은 iframe 내부 요소라 admin.css 가 닿지 않는다 → 인라인 스타일로만 꾸민다.
   둘 다 data-admin-ui + body 직속 — 미러링·저장 시 스크럽 대상이 된다. */
function makeBox(doc, color, dashed, chipColor) {
  var b = doc.createElement('div');
  b.setAttribute('data-admin-ui', '');
  b.style.cssText =
    'position:absolute;z-index:2147483000;pointer-events:none;display:none;' +
    'border:' + (dashed ? '1.5px dashed ' : '2px solid ') + color + ';' +
    'border-radius:2px;box-sizing:border-box;';
  doc.body.appendChild(b);

  // 칩은 사이트 CSS 상속을 타지 않도록 글꼴·자간까지 전부 명시
  var c = doc.createElement('div');
  c.setAttribute('data-admin-ui', '');
  c.style.cssText =
    'position:absolute;z-index:2147483001;pointer-events:none;display:none;' +
    'margin:0;padding:1px 5px;border-radius:2px 2px 0 0;' +
    'background:' + chipColor + ';color:#fff;' +
    'font-family:"IBM Plex Mono",monospace;font-size:11px;line-height:1.3;font-weight:500;' +
    'letter-spacing:0;text-transform:none;white-space:nowrap;';
  doc.body.appendChild(c);

  b._chip = c;
  return b;
}

/* 박스와 칩을 요소 위치에 맞춘다.
   칩은 박스 좌상단 바깥 위 — 화면 위쪽에 자리가 없으면 박스 안쪽 위로 넣는다. */
function positionBox(box, el, win) {
  if (!box || !el || !el.getBoundingClientRect) return;
  var r = el.getBoundingClientRect();
  box.style.display = 'block';
  box.style.left = (r.left + win.scrollX) + 'px';
  box.style.top = (r.top + win.scrollY) + 'px';
  box.style.width = r.width + 'px';
  box.style.height = r.height + 'px';

  var c = box._chip;
  if (!c) return;
  var label = elLabel(el);
  if (c._label !== label) { c.textContent = label; c._label = label; }   // 리플로우 최소화
  c.style.display = 'block';
  c.style.left = (r.left + win.scrollX) + 'px';
  c.style.top = (r.top + win.scrollY - (r.top < 16 ? 0 : CHIP_H)) + 'px';
}

/* 박스를 숨기면 칩도 같이 숨긴다 (칩만 남아 떠다니면 안 된다) */
function hideBox(box) {
  if (!box) return;
  box.style.display = 'none';
  if (box._chip) box._chip.style.display = 'none';
}

function liveEl(eid) {
  var f = getFrame();
  try { return f.contentDocument.querySelector('[data-eid="' + eid + '"]'); }
  catch (e) { return null; }
}

function pristineEl(eid) {
  return pristineDoc ? pristineDoc.querySelector('[data-eid="' + eid + '"]') : null;
}

/* ── 캔버스 키 처리 ──
   "지금 캔버스에서 글자를 입력 중인가" 판정. 이 판정이 틀리면 Backspace 가 글자 지우기
   대신 요소 삭제로 발동한다 → 반드시 포커스 기준으로 본다.
   · select() 는 "선택"만으로 contenteditable 을 부여하므로 속성 유무로 판정하면 안 된다.
     (단순 선택 상태에서는 Delete 가 요소 삭제로 동작해야 한다)
   · 캐럿이 편집 영역 안에 들어가야 비로소 activeElement 가 그 편집 호스트가 된다.
   · 사이트의 입력 필드(문의 폼 등)에 포커스가 있을 때도 타이핑으로 본다 —
     여기서 1~4 를 모드 전환으로 넘기면 글자가 안 써진다. */
function isTypingInCanvas(doc) {
  var a = doc && doc.activeElement;
  if (!a) return false;
  var t = (a.tagName || '').toLowerCase();
  if (t === 'input' || t === 'textarea' || t === 'select') return true;
  return a.isContentEditable === true;
}

/* 요소 단축키 (편집 모드 전용). 처리했으면 true → 부모로 전달하지 않는다.
   타이핑 중에는 어떤 요소 단축키도 발동시키지 않는다. */
function handleElementKey(e, typing) {
  var k = e.key;
  var mod = e.ctrlKey || e.metaKey;
  var isDup = mod && !e.altKey && (k === 'd' || k === 'D');

  if (k === 'Escape') { select(null); return true; }
  if (!selectedEid) return false;

  if (typing) {
    // 타이핑 중 Ctrl+D 는 브라우저 북마크 대화상자만 막고 복제는 하지 않는다
    if (isDup) { e.preventDefault(); return true; }
    return false;
  }

  if (k === 'Delete' || k === 'Backspace') {
    e.preventDefault();
    doAction(selectedEid, 'del');
    return true;
  }
  if (isDup) {
    e.preventDefault();
    doAction(selectedEid, 'dup');
    return true;
  }
  if (e.altKey && (k === 'ArrowUp' || k === 'ArrowDown')) {
    e.preventDefault();
    doAction(selectedEid, k === 'ArrowUp' ? 'up' : 'down');
    return true;
  }
  return false;
}

/* editor.js 가 처리하지 않은 앱 단축키를 부모로 전달.
   iframe 내부 keydown 은 부모 document 리스너에 도달하지 않으므로 버스가 유일한 통로다.
   실제 동작 여부는 app.js 의 handleShortcut 이 판단한다. */
function forwardCanvasKey(e, typing) {
  var k = e.key;
  var mod = e.ctrlKey || e.metaKey;
  var low = (typeof k === 'string' && k.length === 1) ? k.toLowerCase() : k;
  var send = false, prevent = false;

  if (mod && low === 's') {
    send = true; prevent = true;                // 브라우저 "페이지 저장" 차단
  } else if (mod && (low === 'z' || low === 'y')) {
    // 취소/재실행: 타이핑 중이면 브라우저 기본 undo 가 살아 있어야 하므로 막지 않는다
    // (contenteditable 의 undo 는 input 이벤트를 발생시켜 원본에 미러링된다)
    send = true; prevent = !typing;
  } else if (!mod && !e.altKey && !typing && (k === '?' || /^[1-4]$/.test(k))) {
    send = true;                                // 모드 전환·도움말은 글자 입력 중이면 전달 금지
  }
  if (!send) return;
  if (prevent) e.preventDefault();

  Admin.bus.emit('canvas:key', {
    key: k, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
    shiftKey: e.shiftKey, altKey: e.altKey, inEditable: typing
  });
}

function attachKeyBridge(doc, interactive) {
  doc.addEventListener('keydown', function (e) {
    var typing = isTypingInCanvas(doc);
    if (interactive && handleElementKey(e, typing)) return;
    forwardCanvasKey(e, typing);
  }, true);
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
    // 미리보기 중에도 앱 단축키(1~4 등)는 살아 있어야 한다 — 요소 단축키는 제외
    attachKeyBridge(doc, false);
    return;
  }

  hoverBox = makeBox(doc, 'rgba(26,91,176,.9)', true, '#1a5bb0');
  selBox = makeBox(doc, '#c9a227', false, '#c9a227');

  doc.addEventListener('mousemove', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-eid]') : null;
    if (!t || t.tagName === 'HTML' || t.tagName === 'BODY') {
      hideBox(hoverBox);
      return;
    }
    if (selectedEid && t.getAttribute('data-eid') === selectedEid) {
      hideBox(hoverBox);
      return;
    }
    positionBox(hoverBox, t, win);
  }, true);

  doc.addEventListener('mouseleave', function () {
    hideBox(hoverBox);
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

  // 요소 단축키(Esc·Del·Ctrl+D·Alt+↑↓) + 나머지 키는 부모로 전달
  attachKeyBridge(doc, true);

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
        if (el) positionBox(selBox, el, win);   // 선택 박스·칩이 함께 따라간다
      }
      hideBox(hoverBox);
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
    hideBox(selBox);
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
  // body/html: 브레드크럼으로 선택은 되지만 통째로 contenteditable 이 되면
  // 사이트 JS가 만든 DOM이 전부 원본에 미러링된다 → 텍스트 편집은 절대 금지.
  if (/^(html|body|script|style|iframe|svg|img|input|select|textarea|video|audio)$/i.test(el.tagName)) return false;
  // 하위 요소 중 data-eid 없는 것 = 사이트 JS가 생성 → 미러링 시 원본 오염 위험
  var kids = el.querySelectorAll('*');
  for (var i = 0; i < kids.length; i++) {
    if (!kids[i].hasAttribute('data-eid') && !kids[i].hasAttribute('data-admin-ui')) return false;
    if (/^(script|iframe)$/i.test(kids[i].tagName)) return false;
  }
  return true;
}

/* 선택 요소의 조상 경로 — pristine 기준(라이브는 사이트 JS가 감싼 노드가 섞일 수 있다).
   BODY 까지 거슬러 올라간 뒤 바깥→안쪽 순으로 뒤집어 반환. 8개 초과 시 안쪽 8개만. */
var CRUMB_MAX = 8;

function ancestorList() {
  if (!selectedEid) return [];
  var cur = pristineEl(selectedEid);
  if (!cur) return [];
  var out = [];
  while (cur && cur.tagName && cur.tagName !== 'HTML') {
    var eid = cur.getAttribute('data-eid');
    // eid 없는 조상(미러링 사고분)은 선택 대상이 못 되므로 건너뛰고 계속 올라간다
    if (eid) {
      out.push({
        eid: eid,
        tag: cur.tagName.toLowerCase(),
        label: elLabel(cur),
        current: eid === selectedEid
      });
    }
    if (cur.tagName === 'BODY') break;
    cur = cur.parentElement;
  }
  out.reverse();
  if (out.length > CRUMB_MAX) out = out.slice(out.length - CRUMB_MAX);
  return out;
}

/* 클릭 가능한 요소 경로 브레드크럼 */
function crumbsHtml() {
  var list = ancestorList();
  if (!list.length) return '';
  var parts = [];
  list.forEach(function (a, i) {
    if (i) parts.push('<span class="insp-crumb-sep" aria-hidden="true">›</span>');
    parts.push('<button type="button" class="insp-crumb mono' + (a.current ? ' is-current' : '') +
      '" data-crumb="' + U.escapeHtml(a.eid) + '"' + (a.current ? ' aria-current="true"' : '') + '>' +
      U.escapeHtml(a.label) + '</button>');
  });
  return '<nav class="insp-crumbs" aria-label="요소 경로">' + parts.join('') + '</nav>';
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
var WEIGHT_TOKENS = [
  ['', '기본(변경 없음)'],
  ['400', '보통 (400)'],
  ['500', '약간 굵게 (500)'],
  ['600', '중간 굵게 (600)'],
  ['700', '굵게 (700)'],
  ['800', '아주 굵게 (800)']
];

/* ═══════════ 블록 삽입 팔레트 ═══════════
   선택 요소 '바로 뒤'에 삽입할 템플릿. 클래스는 사이트 마크업(post-row·
   article-card 등)에 맞춘다. 삽입 후 새 eid 부여·pushHistory·자동 선택은
   doAction('dup') 흐름을 그대로 따른다. */
var BLOCK_TEMPLATES = [
  { id: 'notice', label: '공지 행',
    html: '<a class="post-row" href="news.html">' +
      '<span class="post-cat">학부</span>' +
      '<span class="post-title">새 공지 제목을 입력하세요</span>' +
      '<time class="post-date" datetime="2026-01-01">2026.01.01</time></a>' },
  { id: 'article', label: '기사 카드',
    html: '<a class="article-card" href="news.html">' +
      '<div class="ph ph--4x3"><span class="ph-tag">뉴스</span></div>' +
      '<div class="article-body">' +
      '<span class="article-cat">Research News</span>' +
      '<h3 class="article-title">새 기사 제목을 입력하세요</h3>' +
      '<time class="article-date" datetime="2026-01-01">2026.01.01</time>' +
      '</div></a>' },
  { id: 'section', label: '제목+단락 섹션',
    html: '<section>' +
      '<h2>새 섹션 제목</h2>' +
      '<p>여기에 단락 내용을 입력하세요.</p>' +
      '</section>' },
  { id: 'hr', label: '구분 헤어라인',
    html: '<hr />' },
  { id: 'buttons', label: '버튼 2개 행',
    html: '<div class="btn-row">' +
      '<a class="btn" href="#">첫 번째 버튼</a>' +
      '<a class="btn" href="#">두 번째 버튼</a>' +
      '</div>' }
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

  h += crumbsHtml();

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
  if (tag === 'img') {
    h += '<div class="insp-field">' +
      '<button type="button" class="insp-btn" id="inspImgReplace">이미지 교체…</button>' +
      '<input type="file" id="inspImgFile" accept="image/*" hidden />' +
      '<p class="insp-note">선택한 파일은 사이트의 assets/img/ 폴더에 저장됩니다.</p>' +
      '</div>';
  }
  h += '</div>';

  /* 스타일 (토큰 한정) */
  function optHtml(tokens, cur) {
    return tokens.map(function (t) {
      return '<option value="' + U.escapeHtml(t[0]) + '"' + (cur === t[0] ? ' selected' : '') + '>' +
        U.escapeHtml(t[1]) + '</option>';
    }).join('');
  }
  var st = (pris && pris.style) ? pris.style : { color: '', backgroundColor: '', textAlign: '', display: '' };
  /* 글자 크기: 인라인 px 값이 있으면 그 값, 없으면 계산된 크기를 placeholder로 */
  var fsMatch = /^([\d.]+)px$/.exec(st.fontSize || '');
  var fsVal = fsMatch ? Math.round(parseFloat(fsMatch[1])) : '';
  var fsPh = '';
  /* 행간: 인라인이 단위 없는 배수면 그 값, placeholder 는 계산값을 배수로 환산 */
  var lhMatch = /^([\d.]+)$/.exec(st.lineHeight || '');
  var lhVal = lhMatch ? parseFloat(lhMatch[1]).toFixed(2) : '';
  var lhPh = '';
  try {
    var elWin = el.ownerDocument.defaultView;
    var cs = elWin.getComputedStyle(el);
    fsPh = Math.round(parseFloat(cs.fontSize)) || '';
    if (cs.lineHeight === 'normal') lhPh = '1.40';
    else {
      var lhPx = parseFloat(cs.lineHeight), fsPx = parseFloat(cs.fontSize);
      if (lhPx && fsPx) lhPh = (lhPx / fsPx).toFixed(2);
    }
  } catch (e) {}
  h += '<div class="insp-sec"><p class="insp-sec-title">스타일 (디자인 토큰)</p>' +
    '<div class="insp-field"><label>글자 색</label><select class="insp-select" data-style="color">' +
    optHtml(COLOR_TOKENS, st.color || '') + '</select></div>' +
    '<div class="insp-field"><label>배경 색</label><select class="insp-select" data-style="backgroundColor">' +
    optHtml(BG_TOKENS, st.backgroundColor || '') + '</select></div>' +
    '<div class="insp-field"><label>굵기</label><select class="insp-select" data-style="fontWeight">' +
    optHtml(WEIGHT_TOKENS, st.fontWeight || '') + '</select></div>' +
    '<div class="insp-field"><label>글자 크기 (px)</label>' +
    '<div class="insp-fs-row">' +
    '<button type="button" class="insp-btn" data-fs="-1" aria-label="글자 크기 1px 줄이기">−</button>' +
    '<input class="insp-input" id="inspFontSize" type="number" min="8" max="200" step="1" value="' + fsVal + '" placeholder="' + fsPh + '" aria-label="글자 크기(px)" />' +
    '<button type="button" class="insp-btn" data-fs="1" aria-label="글자 크기 1px 키우기">＋</button>' +
    '<button type="button" class="insp-btn" data-fs="reset">기본</button>' +
    '</div>' +
    '<p class="insp-note">비우거나 「기본」을 누르면 원래 크기' + (fsPh ? '(현재 ' + fsPh + 'px)' : '') + '를 따릅니다.</p></div>' +
    '<div class="insp-field"><label>행간 (배수)</label>' +
    '<div class="insp-fs-row">' +
    '<button type="button" class="insp-btn" data-lh="-1" aria-label="행간 0.05 줄이기">−</button>' +
    '<input class="insp-input" id="inspLineHeight" type="number" min="0.9" max="3" step="0.05" value="' + lhVal + '" placeholder="' + lhPh + '" aria-label="행간(배수)" />' +
    '<button type="button" class="insp-btn" data-lh="1" aria-label="행간 0.05 키우기">＋</button>' +
    '<button type="button" class="insp-btn" data-lh="reset">기본</button>' +
    '</div>' +
    '<p class="insp-note">글자 크기의 배수(0.9~3.0)입니다. 비우거나 「기본」을 누르면 원래 행간' + (lhPh ? '(현재 ' + lhPh + ')' : '') + '을 따릅니다.</p></div>' +
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
    '<div class="insp-field insp-block-insert">' +
    '<label for="inspBlockInsert">블록 삽입 (선택 요소 뒤에)</label>' +
    '<div class="insp-row">' +
    '<select class="insp-select" id="inspBlockInsert" aria-label="삽입할 블록 선택">' +
    '<option value="">블록 선택…</option>' +
    BLOCK_TEMPLATES.map(function (t) {
      return '<option value="' + U.escapeHtml(t.id) + '">' + U.escapeHtml(t.label) + '</option>';
    }).join('') +
    '</select>' +
    '<button type="button" class="insp-btn" id="inspBlockInsertBtn">삽입</button>' +
    '</div></div>' +
    '<div class="insp-row">' +
    '<button type="button" class="insp-btn insp-btn--ai" data-act="ai">AI로 이 요소 수정</button>' +
    '</div></div>';

  body.innerHTML = h;
  wireInspector(el.getAttribute('data-eid'), editable);
}

function wireInspector(eid, editable) {
  var body = document.getElementById('inspBody');
  if (!body) return;

  /* 브레드크럼: 클릭 → 그 조상 선택, 호버 → 캔버스에서 하이라이트 */
  body.querySelectorAll('[data-crumb]').forEach(function (btn) {
    var target = btn.getAttribute('data-crumb');
    btn.addEventListener('click', function () {
      // select() 가 인스펙터를 다시 그려 이 버튼을 없애므로 mouseleave 가 안 온다 → 먼저 정리
      hideBox(hoverBox);
      select(target);
    });
    btn.addEventListener('mouseenter', function () {
      if (!hoverBox || target === selectedEid) return;
      var f = getFrame(), live = liveEl(target);
      if (live && f && f.contentWindow) positionBox(hoverBox, live, f.contentWindow);
    });
    btn.addEventListener('mouseleave', function () { hideBox(hoverBox); });
  });

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

  /* 글자 크기: 입력·스테퍼·기본 복원 → 인라인 font-size(px) */
  var fsInput = body.querySelector('#inspFontSize');
  function applyFontSize(v) {
    var live = liveEl(eid), pris = pristineEl(eid);
    if (!live || !pris) return;
    if (v === '' || v == null || isNaN(v)) {
      live.style.fontSize = '';
      pris.style.fontSize = '';
    } else {
      v = Math.min(200, Math.max(8, Math.round(v)));
      if (fsInput) fsInput.value = v;
      live.style.fontSize = v + 'px';
      pris.style.fontSize = v + 'px';
    }
    syncStyleAttr(live, pris);
    pushHistoryDebounced();
    var f = getFrame();
    if (selBox && f) positionBox(selBox, live, f.contentWindow);
  }
  if (fsInput) {
    fsInput.addEventListener('input', U.debounce(function () {
      applyFontSize(fsInput.value === '' ? '' : parseFloat(fsInput.value));
    }, 250));
    body.querySelectorAll('[data-fs]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var d = btn.getAttribute('data-fs');
        if (d === 'reset') { fsInput.value = ''; applyFontSize(''); return; }
        var cur = parseFloat(fsInput.value);
        if (isNaN(cur)) cur = parseFloat(fsInput.placeholder) || 16;
        applyFontSize(cur + parseInt(d, 10));
      });
    });
  }

  /* 행간: 입력·스테퍼·기본 복원 → 인라인 line-height(단위 없는 배수) */
  var lhInput = body.querySelector('#inspLineHeight');
  function applyLineHeight(v) {
    var live = liveEl(eid), pris = pristineEl(eid);
    if (!live || !pris) return;
    if (v === '' || v == null || isNaN(v)) {
      live.style.lineHeight = '';
      pris.style.lineHeight = '';
    } else {
      v = Math.min(3, Math.max(0.9, v)).toFixed(2);
      if (lhInput) lhInput.value = v;
      live.style.lineHeight = v;
      pris.style.lineHeight = v;
    }
    syncStyleAttr(live, pris);
    pushHistoryDebounced();
    var f = getFrame();
    if (selBox && f) positionBox(selBox, live, f.contentWindow);
  }
  if (lhInput) {
    lhInput.addEventListener('input', U.debounce(function () {
      applyLineHeight(lhInput.value === '' ? '' : parseFloat(lhInput.value));
    }, 250));
    body.querySelectorAll('[data-lh]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var d = btn.getAttribute('data-lh');
        if (d === 'reset') { lhInput.value = ''; applyLineHeight(''); return; }
        var cur = parseFloat(lhInput.value);
        if (isNaN(cur)) cur = parseFloat(lhInput.placeholder) || 1.4;
        applyLineHeight(cur + parseInt(d, 10) * 0.05);
      });
    });
  }

  /* 이미지 교체: 파일 선택 → assets/img/ 저장 → src 갱신 */
  var imgBtn = body.querySelector('#inspImgReplace');
  var imgFile = body.querySelector('#inspImgFile');
  if (imgBtn && imgFile) {
    imgBtn.addEventListener('click', function () { imgFile.click(); });
    imgFile.addEventListener('change', function () {
      var file = imgFile.files && imgFile.files[0];
      imgFile.value = '';
      if (file) replaceImage(eid, file);
    });
  }

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

  /* 블록 삽입: 선택 요소 바로 뒤에 템플릿 삽입 */
  var blockSel = body.querySelector('#inspBlockInsert');
  var blockBtn = body.querySelector('#inspBlockInsertBtn');
  if (blockSel && blockBtn) {
    blockBtn.addEventListener('click', function () {
      insertBlock(eid, blockSel.value);
    });
  }
}

/* style="" 빈 껍데기 제거 */
function syncStyleAttr(live, pris) {
  [live, pris].forEach(function (el) {
    if (el.getAttribute('style') === '') el.removeAttribute('style');
  });
}

/* ═══════════ 이미지 교체 업로드 ═══════════ */

/* 파일명 정리: 소문자화, 공백·한글 등 비안전문자 → '-', 확장자 유지 */
function sanitizeFileName(name) {
  var dot = String(name).lastIndexOf('.');
  var base = dot > 0 ? name.slice(0, dot) : String(name);
  var ext = dot > 0 ? name.slice(dot + 1) : '';
  base = base.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  if (!base) base = 'image';
  ext = ext.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ext ? base + '.' + ext : base;
}

/* assets/img/ 안에서 충돌 없는 경로 확보 (동일 이름 존재 시 -2, -3 …) */
async function uniqueImagePath(fileName) {
  var dot = fileName.lastIndexOf('.');
  var base = dot > 0 ? fileName.slice(0, dot) : fileName;
  var ext = dot > 0 ? fileName.slice(dot) : '';
  var cand = fileName;
  var n = 2;
  while (await Admin.fs.exists('assets/img/' + cand)) {
    cand = base + '-' + n + ext;
    n += 1;
  }
  return 'assets/img/' + cand;
}

async function replaceImage(eid, file) {
  var live = liveEl(eid), pris = pristineEl(eid);
  if (!live || !pris) return;
  if (!Admin.fs.isReady()) { Admin.toast('먼저 사이트 폴더를 여세요.', 'err'); return; }
  if (!/^image\//i.test(file.type || '')) { Admin.toast('이미지 파일만 업로드할 수 있습니다.', 'err'); return; }
  var rel;
  try {
    rel = await uniqueImagePath(sanitizeFileName(file.name));
    await Admin.fs.writeBinary(rel, file);
  } catch (e) {
    Admin.toast('이미지 저장 실패: ' + (e && e.message ? e.message : e), 'err');
    return;
  }
  // 자산 캐시에 등록 → 재렌더 시 pristine 의 상대경로가 같은 blob URL 로 해석된다.
  // (sandbox 미리보기의 data: 캐시는 저장된 실제 파일에서 그때 생성)
  var burl = URL.createObjectURL(file);
  assetCache.set(rel, burl);
  live.setAttribute('src', burl);
  pris.setAttribute('src', rel);
  var srcInput = document.querySelector('#inspBody [data-attr="src"]');
  if (srcInput) srcInput.value = rel;
  pushHistory();
  Admin.audit.log('asset:upload', rel, '원본 파일: ' + file.name);
  Admin.toast('이미지는 assets/img/에 즉시 저장됩니다 — 페이지 반영은 저장(Ctrl+S) 시 적용됩니다.', 'info');
  if (!(pris.getAttribute('alt') || '').trim()) {
    Admin.toast('대체 텍스트(alt)가 비어 있습니다. 접근성을 위해 입력을 권장합니다.', 'info');
  }
  var f = getFrame();
  if (selBox && f) positionBox(selBox, live, f.contentWindow);
}

/* 블록 삽입: 선택 요소 '바로 뒤'에 템플릿 삽입.
   doAction('dup') 의 pristine 미러링·eid 부여·pushHistory·자동 선택을 그대로 따른다. */
function insertBlock(eid, templateId) {
  if (!templateId) { Admin.toast('삽입할 블록을 선택하세요.', 'info'); return; }
  var pris = pristineEl(eid);
  if (!pris) { Admin.toast('먼저 캔버스에서 요소를 선택하세요.', 'info'); return; }
  var tpl = null;
  for (var i = 0; i < BLOCK_TEMPLATES.length; i++) {
    if (BLOCK_TEMPLATES[i].id === templateId) { tpl = BLOCK_TEMPLATES[i]; break; }
  }
  if (!tpl) return;

  // 템플릿 HTML → 요소 노드(현재 pristineDoc 소유). 첫 요소만 삽입 대상으로 사용.
  var holder = pristineDoc.createElement('div');
  holder.innerHTML = tpl.html;
  var node = holder.firstElementChild;
  if (!node) return;

  // 삽입 서브트리에 새 eid 부여(복제와 동일 규약)
  var nodes = [node].concat(Array.prototype.slice.call(node.querySelectorAll('*')));
  nodes.forEach(function (n) {
    eidSeq += 1;
    n.setAttribute('data-eid', 'e' + eidSeq);
  });

  pris.after(node);
  var newEid = node.getAttribute('data-eid');
  pushHistory();
  renderCanvas({ keepScroll: true }).then(function () {
    select(newEid);   // 삽입 요소 자동 선택
  });
}

async function doAction(eid, act) {
  var pris = pristineEl(eid);
  if (!pris) return;

  // 브레드크럼은 BODY 를 선택할 수 있다(계약서 6-1) → 캔버스 click 핸들러의 BODY/HTML
  // 가드를 우회한다. 골격 요소에 순서 이동·삭제·복제가 닿으면 pristineDoc 이 깨진
  // 채로 그대로 파일에 저장된다(head/body 뒤집힘, 본문 소실). 여기서 한 번 막으면
  // 인스펙터 버튼과 요소 단축키(handleElementKey) 경로가 함께 닫힌다.
  if (act !== 'ai' && /^(html|head|body)$/i.test(pris.tagName)) {
    Admin.toast('페이지 골격 요소에는 적용할 수 없습니다.', 'info');
    return;
  }

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

  /* 임의 HTML을 자산 인라인 포함 독립 렌더용 문서로 변환(시각 비교 iframe용, 비파괴).
     sandbox 프레임에서 렌더되므로 CSS/JS는 인라인(inline:true)으로 삽입한다. */
  buildStandaloneHtml: async function (html) {
    var doc = parseHtml(html == null ? '' : html);
    return await buildRenderHtml(doc, { inline: true });
  },

  /* 보드 프레임용 렌더 HTML. 편집 캔버스와 동일하게 blob: 자산 치환(inline:false) →
     자산 캐시를 프레임 15개가 공유한다. sandbox 프레임이 아니므로 blob: 로드 가능. */
  buildBoardHtml: async function (html) {
    var doc = parseHtml(html == null ? '' : html);
    return await buildRenderHtml(doc, { inline: false });
  },

  /* 인스펙터 브레드크럼에서 조상 요소를 선택 */
  selectByEid: function (eid) { select(eid); },

  /* 선택 요소의 조상 경로 (가장 바깥 → 선택 요소 순). BODY 포함, 최대 8개. */
  ancestors: function () { return ancestorList(); },

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
