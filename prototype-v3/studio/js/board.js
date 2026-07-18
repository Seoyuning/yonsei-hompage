/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — board.js
   보드 모드: 사이트의 모든 페이지를 실제 렌더된 프레임으로 무한 캔버스에
   펼쳐 놓고, 팬·줌으로 훑다가 더블클릭하면 그 페이지를 편집 모드로 연다.

   설계 원칙
   · 프레임 HTML 은 editor.js 의 렌더 파이프라인을 그대로 쓴다
     (buildBoardHtml → blob: 자산 치환). 자산 캐시를 모든 프레임이 공유한다.
     srcdoc 프레임에 sandbox 를 붙이면 blob: 자산을 못 읽어 빈 화면이 된다 — 붙이지 않는다.
   · 15개를 한꺼번에 렌더하면 브라우저가 멈춘다 → IntersectionObserver 로
     화면 근처 프레임만 큐에 넣고 동시 2개로 제한해 순차 처리한다.
   · 라벨·테두리는 --bz(1/zoom) 역보정으로 화면상 크기를 고정한다(A2 의 CSS 가 소비).
   · 보드는 읽기 전용 뷰다. 편집은 board:open 을 통해 app.js 가 연다.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin;
var U = Admin.util;

/* ═══════════ 상수 (계약서 5절 「치수」) ═══════════ */

var FRAME_W_DESKTOP = 1280, FRAME_W_MOBILE = 390;
var FRAME_H_MIN = 600, FRAME_H_MAX = 4200, FRAME_H_DEFAULT = 1400;
/* 커버 높이 — 기본 모드에서 모든 프레임이 쓰는 고정 높이(데스크톱 1화면 분량).
   페이지 전체 높이(수천 px, 페이지마다 10배씩 차이)로 15장을 늘어놓으면 「전체 맞춤」이
   4% 까지 내려가 아무것도 안 보인다. 높이를 고정하면 페이지끼리 서로 비교 가능한
   썸네일이 되고 맞춤 배율이 12% 안팎으로 올라온다 — 이게 「한눈에 보기」의 핵심이다.
   전체 높이가 필요하면 툴바의 「전체 높이」로 전환한다. */
var FRAME_H_COVER = 900;
var GAP_X = 80, GAP_Y = 240;        // 월드 좌표 기준 프레임 간격 (라벨 자리 포함)
/* 라벨(18px)+아래 여백(6px)=24px 를 --bz(1/zoom) 로 역보정하면 월드 높이가 24/zoom 이라
   GAP_Y 를 넘으면 위 프레임을 덮는다(라벨이 cursor:pointer 라 오클릭 띠까지 생긴다)
   → 라벨 전용 역보정 --bzl 의 상한. 테두리·포커스 링은 --bz 를 그대로 쓴다.
   GAP_Y=240 이면 상한 10 → 기본 맞춤 배율(~12%)에서 라벨이 12 화면px 로 읽힌다. */
var BZL_MAX = GAP_Y / 24;           // = 10
var PAD = 40;                       // fit() 시 뷰포트 여백 (화면 px)
var ZOOM_MIN = 0.04, ZOOM_MAX = 2, ZOOM_STEP = 1.2;

var RENDER_MAX = 2;                 // 동시 렌더 상한 — 넘기면 브라우저가 멈춘다
var REMEASURE_MS = 350;             // 사이트 리빌 애니메이션이 끝난 뒤 1회 재측정
var LOAD_TIMEOUT = 8000;            // load 가 오지 않아도 렌더 큐가 멈추지 않도록
var CLICK_SLOP = 4;                 // 이 거리 이하의 드래그는 클릭으로 취급 (px)
var ZOOM_WHEEL_K = 0.0018;          // 휠 1 틱당 줌 배율 지수

/* ═══════════ 상태 ═══════════ */

var inited = false;
var active = false;                 // 보드 모드 활성 여부
var mobile = false;                 // 프레임 폭 390 / 1280
var fullHeight = false;             // false=커버(고정 높이) / true=페이지 실측 전체 높이
var zoom = 1, panX = 0, panY = 0;
var fitted = false;                 // 사이트당 최초 1회만 자동 fit
/* 최초 fit 은 측정 전 placeholder(1400) 높이로 계산될 수밖에 없다(지연 렌더 설계상
   show() 시점엔 높이가 미지) → 실측 높이가 들어오는 동안 doLayout() 이 fit 을 따라
   갱신하도록 켜 두고, 사용자가 팬·줌하는 순간 끈다. */
var autoFit = false;
var query = '';                     // 검색어 (소문자)
var pagesSig = null;                // 프레임 목록 동기화용 페이지 경로 서명

var frames = [];                    // 프레임 레코드 (페이지 순서)
var byPath = Object.create(null);   // path → 프레임 레코드

var io = null;                      // IntersectionObserver
var queue = [];                     // 렌더 대기 프레임
var activeRenders = 0;
var layoutRaf = 0;                  // 배치 병합용 rAF 핸들
var needsObserve = false;           // 배치 후 재관찰 필요 여부
var spaceDown = false;
var suppressClick = false;          // 팬 드래그 직후의 click 무시

var wrap = null, viewport = null, world = null, emptyEl = null, countEl = null;

function $(id) { return document.getElementById(id); }

function frameW() { return mobile ? FRAME_W_MOBILE : FRAME_W_DESKTOP; }

/* 화면에 그릴 높이. fr.h 는 실측값(전체 높이 모드·툴바 전환용)이고, 커버 모드는
   그것과 무관하게 고정 높이를 쓴다. 레이아웃·fit 은 반드시 이 함수를 거친다. */
function frameH(fr) { return fullHeight ? fr.h : FRAME_H_COVER; }

/* 페이지 한국어 이름. PAGE_NAMES 표는 app.js 소유이고 board.js 는 app.js 보다
   먼저 로드되므로, 런타임에만 방어적으로 참조한다 (계약서 5절). */
function titleOf(name) {
  return U.pageTitle ? U.pageTitle(name) : String(name).replace(/\.html?$/i, '');
}

function visible() {
  var out = [];
  for (var i = 0; i < frames.length; i++) if (!frames[i].hidden) out.push(frames[i]);
  return out;
}

function frameOf(node) {
  var el = (node && node.closest) ? node.closest('.bframe') : null;
  return el ? (byPath[el.getAttribute('data-path')] || null) : null;
}

/* 입력 요소에 포커스가 있으면 스페이스는 글자 입력이므로 팬 모드로 가로채지
   않는다 (계약서 5절). 버튼은 제외 대상이 아니다 — 「보드」 버튼을 눌러 들어온
   직후에도 스페이스+드래그가 바로 먹어야 하기 때문. .bframe-hit 의 Enter/Space 는
   onWorldKeyDown 이 stopPropagation 으로 먼저 가져간다. */
function isTypingTarget(el) {
  if (!el) return false;
  var t = (el.tagName || '').toLowerCase();
  return t === 'input' || t === 'textarea' || t === 'select' || el.isContentEditable === true;
}

/* ═══════════ 프레임 DOM ═══════════ */

function frameInnerHtml(title, file) {
  var t = U.escapeHtml(title), f = U.escapeHtml(file);
  return '<div class="bframe-label">' +
      '<span class="bframe-name">' + t + '</span>' +
      '<span class="bframe-file mono">' + f + '</span>' +
      '<span class="bframe-badge mono">미저장</span>' +
    '</div>' +
    '<div class="bframe-box">' +
      '<iframe class="bframe-frame" title="' + t + ' 미리보기" loading="lazy" tabindex="-1"></iframe>' +
      '<div class="bframe-hit" role="button" tabindex="0" aria-label="' + t + ' — ' + f + ' 편집 열기"></div>' +
      '<div class="bframe-skel"><span class="mono">불러오는 중…</span></div>' +
    '</div>';
}

function signature(pages) {
  return pages.map(function (p) { return p.path; }).join('\n');
}

/* 프레임 목록 전면 재구성 (= 전체 무효화). site:opened 마다 호출된다. */
function buildFrames(pages) {
  // 진행 중 렌더가 버려질 DOM 을 건드리지 않도록 먼저 무효화
  for (var i = 0; i < frames.length; i++) frames[i].epoch += 1;
  stopObserving();
  queue.length = 0;
  world.innerHTML = '';
  frames = [];
  byPath = Object.create(null);
  fitted = false;                    // 새 사이트는 다시 전체 맞춤
  autoFit = false;

  pages.forEach(function (p) {
    var title = titleOf(p.name);
    var el = document.createElement('div');
    el.className = 'bframe';
    el.setAttribute('data-path', p.path);
    el.innerHTML = frameInnerHtml(title, p.name);
    world.appendChild(el);
    var fr = {
      path: p.path,
      name: p.name,
      title: title,
      el: el,
      box: el.querySelector('.bframe-box'),
      frame: el.querySelector('.bframe-frame'),
      skel: el.querySelector('.bframe-skel'),
      h: FRAME_H_DEFAULT,            // 측정 전 placeholder (실측 후 클램프된 높이)
      raw: 0,                        // 실측 원본 높이 — 페이드/「잘림」 판정용
      x: 0, y: 0,
      hidden: false,
      rendered: false,
      rendering: false,
      queued: false,
      measured: false,
      fromEditor: false,             // 편집기 버퍼(미저장 편집분)로 렌더된 프레임인가
      epoch: 0                       // 프레임별 렌더 경합 방지 토큰
    };
    frames.push(fr);
    byPath[p.path] = fr;
  });

  pagesSig = signature(pages);
  applyFilterFlags();
  needsObserve = true;
  layoutNow();
  updateEmpty();
  updateCount();
  updateCurrent();
}

/* show() 진입 시 페이지 목록과 프레임 DOM 을 맞춘다.
   목록이 그대로면 재구성하지 않는다 — 이미 렌더된 프레임을 버리지 않기 위해. */
function syncFrames() {
  var pages = (Admin.fs && Admin.fs.isReady()) ? Admin.fs.pages() : [];
  if (signature(pages) === pagesSig) return;
  buildFrames(pages);
}

/* ═══════════ 배치 (메이슨리) ═══════════ */

/* 연속 호출(높이 측정 콜백이 프레임마다 터진다)을 rAF 로 1회에 병합 */
function relayout() {
  if (layoutRaf) return;
  layoutRaf = requestAnimationFrame(function () {
    layoutRaf = 0;
    doLayout();
  });
}

/* fit() 처럼 좌표가 당장 필요할 때는 동기 배치 */
function layoutNow() {
  if (layoutRaf) { cancelAnimationFrame(layoutRaf); layoutRaf = 0; }
  doLayout();
}

/* 열 수 — 「전체 맞춤」 배율이 가장 커지는 값을 고른다.
   ceil(sqrt(n)) 같은 고정 heuristic 은 뷰포트 가로세로비를 무시한다: 15장을 4열로
   깔면 4행이 되어 세로가 병목이 되고, 넓고 낮은 캔버스에서 배율이 깎인다. 후보를
   실제로 packing 해 배율을 비교하면 그 손해가 사라진다(15장 → 5열 3행).
   zoom 이 아니라 뷰포트 크기만 보므로 doFit 과 되먹임이 생기지 않는다. */
function bestCols(vis, W) {
  var n = vis.length;
  if (n <= 1) return 1;
  var vw = viewport ? viewport.clientWidth : 0;
  var vh = viewport ? viewport.clientHeight : 0;
  var fallback = Math.min(n, Math.max(2, Math.min(6, Math.ceil(Math.sqrt(n)))));
  if (!vw || !vh) return fallback;      // 숨김 상태 → 계산 불가

  var bestC = 0, bestZ = -1, i;
  for (var c = 1; c <= Math.min(6, n); c++) {
    var colH = [];
    for (i = 0; i < c; i++) colH.push(0);
    for (i = 0; i < n; i++) {
      var b = 0;
      for (var k = 1; k < c; k++) if (colH[k] < colH[b]) b = k;
      colH[b] += frameH(vis[i]) + GAP_Y;
    }
    var used = 0;
    for (i = 0; i < c; i++) if (colH[i] > 0) used++;
    var bw = used * W + Math.max(0, used - 1) * GAP_X;
    var bh = Math.max.apply(null, colH) - GAP_Y;   // 마지막 프레임 뒤 간격은 제외
    if (!(bw > 0) || !(bh > 0)) continue;
    var z = Math.min((vw - 2 * PAD) / bw, (vh - 2 * PAD) / bh);
    if (z > bestZ) { bestZ = z; bestC = c; }
  }
  return bestC || fallback;
}

function doLayout() {
  var W = frameW();
  var vis = visible();
  var i;

  var cols = bestCols(vis, W);
  var colH = [];
  for (i = 0; i < cols; i++) colH.push(0);

  for (i = 0; i < vis.length; i++) {
    var fr = vis[i];
    var h = frameH(fr);
    // 가장 짧은 열 (동률이면 왼쪽 열이 유지된다 — 엄격 비교라 인덱스가 안 밀림)
    var best = 0;
    for (var c = 1; c < cols; c++) if (colH[c] < colH[best]) best = c;
    fr.x = best * (W + GAP_X);
    fr.y = colH[best];
    fr.el.style.left = fr.x + 'px';
    fr.el.style.top = fr.y + 'px';
    fr.el.style.width = W + 'px';
    fr.box.style.height = h + 'px';
    colH[best] += h + GAP_Y;
  }

  // 배치가 끝난 좌표로 교차 판정을 다시 받는다 (숨김 해제·폭 변경 후)
  if (needsObserve) {
    needsObserve = false;
    if (active) startObserving();
  }

  // 최초 fit 은 placeholder 높이로 잡혔다 → 실측 높이가 들어와 좌표가 확정된 지금
  // 다시 맞춘다. 레이아웃은 zoom 에 의존하지 않으므로(GAP_Y 고정) 되먹임이 없다.
  if (autoFit && active) doFit();
}

/* ═══════════ 줌 · 팬 ═══════════ */

function applyTransform() {
  world.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + zoom + ')';
  // 라벨·테두리 화면 크기 고정: A2 의 CSS 가 calc(12px * var(--bz)) 식으로 역보정
  world.style.setProperty('--bz', String(1 / zoom));
  // 라벨만은 GAP_Y 를 넘지 못하게 상한을 둔다 (BZL_MAX 주석 참고)
  world.style.setProperty('--bzl', String(Math.min(1 / zoom, BZL_MAX)));
}

function emitZoom() {
  Admin.bus.emit('board:zoom', { zoom: zoom });
}

/* cx,cy = #boardViewport 기준 좌표(px). 커서 아래 월드 좌표가 제자리에 남는다. */
function zoomAt(z, cx, cy) {
  var vw = viewport.clientWidth, vh = viewport.clientHeight;
  if (cx == null) cx = vw / 2;
  if (cy == null) cy = vh / 2;
  var nz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
  if (!isFinite(nz) || nz === zoom) return;
  autoFit = false;                   // 사용자가 뷰를 잡았다 → 자동 재맞춤 중단
  var k = nz / zoom;
  panX = cx - (cx - panX) * k;
  panY = cy - (cy - panY) * k;
  zoom = nz;
  applyTransform();
  emitZoom();
}

/* 맞춤에 성공했으면 true. show() 가 이 값으로만 「최초 1회」 래치를 세운다 —
   실행되지 않은 fit 이 1회 기회를 삼키면 안 된다. */
function doFit() {
  var vis = visible();
  if (!vis.length) return false;
  var vw = viewport.clientWidth, vh = viewport.clientHeight;
  if (!vw || !vh) return false;      // 숨김 상태에서 불리면 계산 불가
  var W = frameW();
  var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  vis.forEach(function (fr) {
    if (fr.x < minX) minX = fr.x;
    if (fr.y < minY) minY = fr.y;
    if (fr.x + W > maxX) maxX = fr.x + W;
    if (fr.y + frameH(fr) > maxY) maxY = fr.y + frameH(fr);
  });
  var bw = maxX - minX, bh = maxY - minY;
  if (!(bw > 0) || !(bh > 0)) return false;
  var z = Math.min(Math.max(1, vw - 2 * PAD) / bw, Math.max(1, vh - 2 * PAD) / bh);
  z = Math.max(ZOOM_MIN, Math.min(1, z));    // 전체 맞춤은 100% 를 넘기지 않는다
  zoom = z;
  panX = vw / 2 - (minX + bw / 2) * z;
  panY = vh / 2 - (minY + bh / 2) * z;
  applyTransform();
  emitZoom();
  return true;
}

function doReset100() {
  autoFit = false;                   // 사용자가 뷰를 잡았다
  var vw = viewport.clientWidth, vh = viewport.clientHeight;
  var cur = Admin.editor.currentPath();
  var fr = (cur && byPath[cur] && !byPath[cur].hidden) ? byPath[cur] : visible()[0];
  zoom = 1;
  if (fr && vw && vh) {
    panX = vw / 2 - (fr.x + frameW() / 2);
    panY = vh / 2 - (fr.y + frameH(fr) / 2);
  }
  applyTransform();
  emitZoom();
}

/* 휠 델타를 픽셀로 정규화 (줄·페이지 단위로 보고하는 마우스 대응) */
function wheelDelta(e) {
  var m = e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? 100 : 1);
  return { x: e.deltaX * m, y: e.deltaY * m };
}

function onWheel(e) {
  if (!active) return;
  e.preventDefault();                // 브라우저 페이지 줌·스크롤 차단 (passive:false 필수)
  var d = wheelDelta(e);
  if (e.ctrlKey || e.metaKey) {
    // 트랙패드 핀치도 ctrlKey 휠로 들어온다
    var r = viewport.getBoundingClientRect();
    var f = Math.exp(-d.y * ZOOM_WHEEL_K);
    zoomAt(zoom * Math.max(0.2, Math.min(5, f)), e.clientX - r.left, e.clientY - r.top);
    return;
  }
  // shift+휠을 브라우저가 이미 deltaX 로 바꿔 주는 경우가 있어 두 축을 합산한다
  autoFit = false;                   // 사용자가 뷰를 잡았다
  if (e.shiftKey) panX -= (d.x + d.y);
  else { panX -= d.x; panY -= d.y; }
  applyTransform();
}

function onMouseDown(e) {
  if (!active) return;
  suppressClick = false;
  var middle = e.button === 1;
  if (!middle && e.button !== 0) return;
  // 팬 조건: (1) 빈 배경 드래그 (2) 가운데 버튼 (3) 스페이스바 누른 채 드래그
  if (!middle && !spaceDown && frameOf(e.target)) return;   // 프레임 위 좌클릭은 선택/열기 몫
  e.preventDefault();                // 가운데 버튼 자동 스크롤·텍스트 선택 차단
  startPan(e);
}

function startPan(e) {
  var sx = e.clientX, sy = e.clientY;
  var ox = panX, oy = panY;
  var moved = 0;
  viewport.classList.add('is-panning');

  function move(ev) {
    var dx = ev.clientX - sx, dy = ev.clientY - sy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > moved) moved = dist;
    autoFit = false;                 // 사용자가 뷰를 잡았다
    panX = ox + dx;
    panY = oy + dy;
    applyTransform();
  }
  function up() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    viewport.classList.remove('is-panning');
    // 4px 초과로 움직였으면 드래그 → 뒤따라오는 click 은 무시한다
    suppressClick = moved > CLICK_SLOP;
  }
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
}

function onDocKeyDown(e) {
  if (!active || spaceDown) return;
  if (e.key !== ' ' && e.key !== 'Spacebar' && e.code !== 'Space') return;
  if (isTypingTarget(document.activeElement)) return;
  // 모달이 떠 있으면 백드롭(#modalRoot)이 뷰포트를 덮어 팬 드래그 자체가 불가능하다
  // → 여기서 스페이스를 가로채면 포커스된 「닫기」 버튼만 죽는다. 문서 레벨 키 처리는
  // 모달 뒤에서 물러난다는 app.js 의 modalOpen() 규약과 같다.
  var mr = document.getElementById('modalRoot');
  if (mr && !mr.hidden) return;
  e.preventDefault();                // 페이지 스크롤·포커스된 버튼 눌림 방지
  spaceDown = true;
  viewport.classList.add('is-space');
}

function onDocKeyUp(e) {
  if (e.key !== ' ' && e.key !== 'Spacebar' && e.code !== 'Space') return;
  releaseSpace();
}

function releaseSpace() {
  if (!spaceDown) return;
  spaceDown = false;
  if (viewport) viewport.classList.remove('is-space');
}

/* ═══════════ 선택 · 열기 ═══════════ */

/* 동시에 하나만 선택된다 — .is-selected 클래스가 선택 상태의 진실 */
function selectFrame(fr) {
  for (var i = 0; i < frames.length; i++) {
    frames[i].el.classList.toggle('is-selected', frames[i] === fr);
  }
}

function openFrame(fr) {
  if (!fr) return;
  selectFrame(fr);
  Admin.bus.emit('board:open', { path: fr.path });
}

function onWorldClick(e) {
  if (suppressClick) return;
  var t = e.target;
  if (!t || !t.closest) return;
  if (t.closest('.bframe-label')) { openFrame(frameOf(t)); return; }   // 라벨 클릭 → 열기
  if (!t.closest('.bframe-hit')) return;
  selectFrame(frameOf(t));                                            // 단일 클릭 → 선택
}

function onWorldDblClick(e) {
  var t = e.target;
  if (!t || !t.closest || !t.closest('.bframe-hit')) return;
  openFrame(frameOf(t));
}

function onWorldKeyDown(e) {
  var t = e.target;
  if (!t || !t.closest || !t.closest('.bframe-hit')) return;
  var space = (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space');
  if (e.key !== 'Enter' && !space) return;
  e.preventDefault();
  e.stopPropagation();               // 문서 레벨 스페이스(팬 모드) 진입 방지
  openFrame(frameOf(t));
}

/* 빈 배경 클릭 → 선택 해제 */
function onViewportClick(e) {
  if (!active || suppressClick) return;
  if (frameOf(e.target)) return;
  selectFrame(null);
}

/* ═══════════ 렌더 큐 (지연 렌더) ═══════════ */

function startObserving() {
  stopObserving();
  if (typeof IntersectionObserver !== 'function') {
    // 폴백: 전부 큐에 넣되 동시 렌더 상한은 그대로 지킨다
    for (var i = 0; i < frames.length; i++) enqueue(frames[i]);
    return;
  }
  io = new IntersectionObserver(onIntersect, { root: viewport, rootMargin: '600px' });
  for (var j = 0; j < frames.length; j++) io.observe(frames[j].el);
}

function stopObserving() {
  if (io) { io.disconnect(); io = null; }
}

function onIntersect(entries) {
  for (var i = 0; i < entries.length; i++) {
    if (!entries[i].isIntersecting) continue;
    var fr = byPath[entries[i].target.getAttribute('data-path')];
    if (fr) enqueue(fr);
  }
}

function enqueue(fr) {
  if (!active) return;
  if (byPath[fr.path] !== fr) return;          // buildFrames 로 버려진 프레임
  if (fr.hidden || fr.rendered || fr.rendering || fr.queued) return;
  fr.queued = true;
  queue.push(fr);
  pump();
}

function pump() {
  while (active && activeRenders < RENDER_MAX && queue.length) {
    var fr = queue.shift();
    fr.queued = false;
    if (fr.hidden || fr.rendered || fr.rendering) continue;
    renderFrame(fr);                 // activeRenders 는 첫 await 전에 증가한다
  }
}

/* 렌더 소스: 편집 중 페이지는 미저장 편집분이 보드에 그대로 보이도록
   편집기 원본을 쓰고, 없으면 파일로 폴백한다 (계약서 5절).
   fromEditor 는 「파일에 없는 휘발성 편집분으로 렌더했는가」 — 편집분이 폐기·되돌림
   되면 프레임을 버려야 하므로 show() 가 이 표시를 본다. clean 상태의 버퍼는 파일과
   같은 내용이므로(dirty 불변식) false 로 둔다 → 불필요한 재렌더 방지. */
async function sourceHtml(p) {
  if (p === Admin.editor.currentPath()) {
    var clean = Admin.editor.getCleanHtml();
    if (clean) return { html: clean, fromEditor: Admin.editor.isDirty() };
  }
  return { html: await Admin.fs.readFile(p), fromEditor: false };
}

/* 렌더용 변환은 editor.js 소유(계약서 6-1). 아직 배포되지 않은 환경에서도
   보드가 빈 화면이 되지 않도록 자산 인라인 API 로 폴백한다(무겁지만 결과는 같다). */
async function buildBoardHtml(html) {
  var E = Admin.editor;
  if (E.buildBoardHtml) return await E.buildBoardHtml(html);
  if (E.buildStandaloneHtml) return await E.buildStandaloneHtml(html);
  return html;
}

/* srcdoc 주입 + load 대기. sandbox 속성은 절대 붙이지 않는다 —
   붙이면 부모가 만든 blob: 자산을 못 읽어 빈 화면이 된다 (계약서 5절). */
function inject(fr, html) {
  return new Promise(function (resolve) {
    var f = fr.frame, done = false, timer = 0;
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      f.removeEventListener('load', finish);
      resolve();
    }
    f.addEventListener('load', finish);
    timer = setTimeout(finish, LOAD_TIMEOUT);   // load 가 안 와도 큐가 멈추지 않도록
    f.srcdoc = html;
  });
}

async function renderFrame(fr) {
  var epoch = fr.epoch;
  fr.rendering = true;
  activeRenders += 1;
  try {
    var src = await sourceHtml(fr.path);
    if (fr.epoch !== epoch) return;
    var out = await buildBoardHtml(src.html);
    if (fr.epoch !== epoch) return;
    await inject(fr, out);
    if (fr.epoch !== epoch) return;
    fr.rendered = true;
    fr.fromEditor = src.fromEditor;
    fr.skel.hidden = true;
    if (active) {
      measure(fr);
      scheduleRemeasure(fr, epoch);
    } else {
      fr.measured = false;           // 숨김 중엔 높이를 잴 수 없다 → show() 에서 재측정
    }
  } catch (e) {
    if (fr.epoch === epoch) {
      console.error('[board] 프레임 렌더 실패 — ' + fr.path, e);
      fr.skel.innerHTML = '<span class="mono">' + U.escapeHtml('불러오지 못했습니다') + '</span>';
      fr.skel.hidden = false;
    }
  } finally {
    fr.rendering = false;
    activeRenders -= 1;
    // 렌더 도중 무효화된 프레임은, 재관찰 시점에 rendering=true 라서 enqueue() 가
    // 걸러냈을 수 있다. 여기서 다시 넣지 않으면 영영 스켈레톤에 남는다
    // (연속 setMobile / 렌더 중 .css 저장에서 실제로 발생).
    if (fr.epoch !== epoch && !fr.rendered) enqueue(fr);
    pump();
  }
}

/* ═══════════ 높이 측정 ═══════════ */

/* 루트의 scrollHeight 는 명세상 max(뷰포트 높이, 스크롤 영역 높이)인데, 그 뷰포트
   높이가 바로 board.js 가 .bframe-box 에 박아 둔 fr.h 다 → raw >= fr.h 가 항상 성립해
   높이가 커지기만 하고 절대 줄지 않는다(모바일 폭 ON→OFF 후 흰 여백이 영구 잔존,
   FRAME_H_MIN 도 도달 불가). body 는 사이트 CSS 에 height/min-height 가 없어 콘텐츠
   높이를 그대로 준다 → 자기참조를 끊으려면 body 를 재야 한다. */
function measure(fr) {
  var raw = 0;
  try {
    var d = fr.frame.contentDocument;
    if (!d || !d.documentElement) return;
    raw = d.body ? d.body.scrollHeight : d.documentElement.scrollHeight;
  } catch (e) { return; }            // 접근 예외 → FRAME_H_DEFAULT 유지
  if (!raw) return;
  fr.measured = true;
  fr.raw = raw;
  var h = Math.min(FRAME_H_MAX, Math.max(FRAME_H_MIN, raw));
  var changed = Math.abs(h - fr.h) >= 1;
  fr.h = h;
  markClip(fr);
  if (changed && fullHeight) relayout();   // 커버 모드는 표시 높이가 고정 — 재배치 불필요
}

/* 페이드(.is-clipped)는 「아래로 더 있다」는 신호, 「잘림」 배지(.is-truncated)는
   전체 높이 모드에서 상한(FRAME_H_MAX)에 실제로 걸렸을 때만. 커버 모드는 잘리는 게
   기본값이라 배지를 달면 15장 전부에 붙어 소음만 된다. */
function markClip(fr) {
  if (!fr.measured) return;
  var shown = frameH(fr);
  fr.box.classList.toggle('is-clipped', fr.raw > shown + 1);
  fr.box.classList.toggle('is-truncated', fullHeight && fr.raw > FRAME_H_MAX);
}

/* 사이트 JS 의 리빌 애니메이션 때문에 load 직후 높이가 덜 잡힌다 → 1회 재측정 */
function scheduleRemeasure(fr, epoch) {
  setTimeout(function () {
    if (!active || fr.epoch !== epoch || !fr.rendered) return;
    measure(fr);
  }, REMEASURE_MS);
}

/* ═══════════ 무효화 ═══════════ */

function invalidate(fr) {
  fr.epoch += 1;                     // 진행 중 렌더 취소
  var qi = queue.indexOf(fr);
  if (qi >= 0) queue.splice(qi, 1);  // 큐 중복 방지
  fr.queued = false;
  fr.rendered = false;
  fr.measured = false;
  fr.fromEditor = false;
  if (fr.skel) {
    fr.skel.innerHTML = '<span class="mono">불러오는 중…</span>';
    fr.skel.hidden = false;
  }
  try { fr.frame.removeAttribute('srcdoc'); } catch (e) {}
}

function invalidateAll() {
  for (var i = 0; i < frames.length; i++) invalidate(frames[i]);
  queue.length = 0;
}

/* ═══════════ 상태 표시 ═══════════ */

/* 보이는 집합이 실제로 바뀌었으면 true — filter() 가 뷰 보정 여부를 이걸로 정한다 */
function applyFilterFlags() {
  var changed = false;
  for (var i = 0; i < frames.length; i++) {
    var fr = frames[i];
    var hit = !query ||
      fr.path.toLowerCase().indexOf(query) >= 0 ||
      fr.title.toLowerCase().indexOf(query) >= 0;
    var wasHidden = fr.hidden;
    fr.hidden = !hit;
    fr.el.hidden = !hit;
    if (wasHidden !== fr.hidden) changed = true;
  }
  return changed;
}

/* 빈 캔버스에는 반드시 이유를 적는다. 사이트 미개방과 「검색 0건」은 화면상 똑같이
   텅 빈 격자라, 안내가 없으면 사용자는 보드가 고장난 것으로 읽는다. */
function updateEmpty() {
  if (!emptyEl) return;
  if (!frames.length) {
    emptyEl.textContent = '사이트 폴더를 열면 모든 페이지가 여기에 펼쳐집니다.';
    emptyEl.hidden = false;
    return;
  }
  if (!visible().length) {
    emptyEl.textContent = '「' + query + '」와 일치하는 페이지가 없습니다.';
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
}

function updateCount() {
  if (!countEl) return;
  var total = frames.length;
  if (!total) { countEl.textContent = ''; return; }
  var vis = visible().length;
  countEl.textContent = (vis === total) ? (total + '개 페이지') : (vis + ' / ' + total + '개 페이지');
}

function updateCurrent() {
  var cur = Admin.editor.currentPath();
  for (var i = 0; i < frames.length; i++) {
    frames[i].el.classList.toggle('is-current', frames[i].path === cur);
  }
  updateDirty(Admin.editor.isDirty());
}

/* .is-dirty 는 「미저장 변경이 있는 현재 페이지」에만 (계약서 5절) */
function updateDirty(d) {
  var cur = Admin.editor.currentPath();
  for (var i = 0; i < frames.length; i++) {
    frames[i].el.classList.toggle('is-dirty', !!d && frames[i].path === cur);
  }
}

/* ═══════════ 배선 ═══════════ */

function wireDom() {
  // 휠은 passive:false 로 등록해야 preventDefault 가 먹는다(브라우저 페이지 줌 방지)
  viewport.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('mousedown', onMouseDown);
  viewport.addEventListener('click', onViewportClick);
  // overflow:hidden 도 스크롤 컨테이너다 → Tab 으로 화면 밖 .bframe-hit 에 포커스가 가면
  // 브라우저가 뷰포트를 스크롤해 버려, 화면 위치를 transform 만으로 관리하는 panX/panY
  // 모델과 어긋난다(줌 앵커·100% 가 스크롤량만큼 튀고 되돌아오지 않는다). 즉시 원복한다.
  viewport.addEventListener('scroll', function () {
    if (viewport.scrollLeft) viewport.scrollLeft = 0;
    if (viewport.scrollTop) viewport.scrollTop = 0;
  });
  // .bframe-frame 은 pointer-events:none(A2) 이라 프레임 내부 클릭은 .bframe-hit 이 받는다
  world.addEventListener('click', onWorldClick);
  world.addEventListener('dblclick', onWorldDblClick);
  world.addEventListener('keydown', onWorldKeyDown);
  document.addEventListener('keydown', onDocKeyDown);
  document.addEventListener('keyup', onDocKeyUp);
  window.addEventListener('blur', releaseSpace);   // 스페이스 눌린 채 창을 떠나도 안 잠기게
}

function wireBus() {
  // 프레임 목록 재구성 (전체 무효화)
  Admin.bus.on('site:opened', function (d) {
    if (!inited) return;
    buildFrames((d && d.pages) ? d.pages : []);
  });

  // 자산(.css/.js)이 바뀌면 모든 프레임이 영향을 받는다.
  // editor.js 의 file:saved 핸들러가 먼저 등록되어 있어 자산 캐시가 비워진 뒤 여기에 온다.
  Admin.bus.on('file:saved', function (d) {
    if (!d || !d.path) return;
    if (/\.(css|js)$/i.test(d.path)) Admin.board.refresh(null);
    else Admin.board.refresh(d.path);
  });

  Admin.bus.on('page:loaded', function () { updateCurrent(); });

  Admin.bus.on('editor:dirty', function (d) {
    updateDirty(d && typeof d.dirty === 'boolean' ? d.dirty : Admin.editor.isDirty());
  });
}

function ensureDom() {
  if (!inited) Admin.board.init();
  return !!(wrap && viewport && world);
}

/* ═══════════ 공개 API ═══════════ */

Admin.board = {

  init: function () {
    if (inited) return;
    wrap = $('boardWrap');
    viewport = $('boardViewport');
    world = $('boardWorld');
    emptyEl = $('boardEmpty');
    countEl = $('boardCount');
    if (!wrap || !viewport || !world) return;   // 셸 DOM 미배포 → 조용히 비활성
    inited = true;
    applyTransform();
    wireDom();
    wireBus();
    updateEmpty();
  },

  show: async function () {
    if (!ensureDom()) return;
    active = true;
    syncFrames();
    updateEmpty();
    updateCount();
    updateCurrent();
    if (!frames.length) return;      // 사이트 미개방 — #boardEmpty 안내만 남긴다

    var cur = Admin.editor.currentPath();
    var dirtyNow = Admin.editor.isDirty();

    // 편집기 버퍼로 렌더된 프레임이 더 이상 「현재 페이지 && 더티」가 아니면, 그 내용은
    // 파일에도 편집기에도 없다(폐기·되돌리기 경로엔 무효화 트리거가 하나도 없어 낡은
    // 프레임이 세션 내내 남는다 — .is-dirty 배지까지 떨어져 저장된 파일인 척한다).
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      if (f.rendered && f.fromEditor && !(f.path === cur && dirtyNow)) invalidate(f);
    }
    // 미저장 편집분이 보드에 반영되도록 현재 페이지 프레임만 다시 렌더
    if (cur && byPath[cur] && byPath[cur].rendered && dirtyNow) invalidate(byPath[cur]);

    // 숨김 상태에서 끝난 렌더는 높이를 못 쟀다 → 보이는 지금 다시 잰다
    for (var j = 0; j < frames.length; j++) if (frames[j].rendered) measure(frames[j]);
    layoutNow();                     // fit() 이 좌표를 필요로 하므로 동기 배치

    // 래치는 fit 이 실제로 성공했을 때만 — 뷰포트가 0 이라 조기 반환한 fit 이 1회
    // 기회를 삼키면 안 된다. autoFit 은 실측 높이가 들어오면 doLayout() 이 재맞춤한다.
    if (!fitted && doFit()) { fitted = true; autoFit = true; }
    else applyTransform();
    emitZoom();
    startObserving();
  },

  hide: function () {
    active = false;
    autoFit = false;                 // 자동 맞춤은 「최초 1회」 — 보드를 떠나면 끝난다
    stopObserving();
    queue.length = 0;
    for (var i = 0; i < frames.length; i++) frames[i].queued = false;
    releaseSpace();
    if (viewport) viewport.classList.remove('is-panning');
  },

  isActive: function () { return active; },

  refresh: function (p) {
    if (!inited) return;
    if (p == null) {
      invalidateAll();
    } else {
      var fr = byPath[p];
      if (!fr) return;
      invalidate(fr);
    }
    if (active) startObserving();    // 교차 중인 프레임 렌더 재시작
  },

  zoomIn: function () { if (ensureDom()) zoomAt(zoom * ZOOM_STEP); },

  zoomOut: function () { if (ensureDom()) zoomAt(zoom / ZOOM_STEP); },

  zoomTo: function (z, cx, cy) { if (ensureDom()) zoomAt(z, cx, cy); },

  fit: function () {
    if (!ensureDom()) return;
    layoutNow();
    doFit();
  },

  reset100: function () {
    if (!ensureDom()) return;
    layoutNow();
    doReset100();
  },

  filter: function (q) {
    if (!ensureDom()) return;
    query = String(q == null ? '' : q).trim().toLowerCase();
    var changed = applyFilterFlags();
    updateCount();
    updateEmpty();                   // 0건이면 안내를 띄운다
    needsObserve = true;             // 새로 보이게 된 프레임 렌더 트리거
    if (!changed) { relayout(); return; }
    // 보이는 집합이 바뀌면 메이슨리가 월드 (0,0) 부터 다시 쌓는데 줌·팬은 그대로다
    // → 줌인·팬 상태에서 검색하면 결과가 화면 밖에 놓여 캔버스가 텅 빈 것처럼 보인다
    // (#boardViewport 는 overflow:hidden 이라 스크롤로 찾아갈 수도 없다). 다시 맞춘다.
    layoutNow();
    if (visible().length) doFit();
  },

  setMobile: function (v) {
    if (!ensureDom()) return;
    v = !!v;
    if (v === mobile) return;
    mobile = v;
    // 사이트 JS 는 로드 시점 폭 기준으로 UI 를 만든다 → 폭이 바뀌면 전체 재렌더
    invalidateAll();
    needsObserve = true;
    layoutNow();
  },

  /* 커버(고정 높이) ↔ 페이지 전체 높이. 재렌더는 필요 없다 — 내용은 그대로고
     .bframe-box 높이만 바뀐다(사이트가 vh 레이아웃을 쓰지 않아 되먹임 없음).
     프레임이 커지면 사이트의 reveal IntersectionObserver 가 리사이즈로 재평가되어
     아래쪽 요소도 나타난다. */
  setFullHeight: function (v) {
    if (!ensureDom()) return;
    v = !!v;
    if (v === fullHeight) return;
    fullHeight = v;
    for (var i = 0; i < frames.length; i++) markClip(frames[i]);
    layoutNow();
    doFit();                          // 높이 체계가 통째로 바뀌었다 → 배율 재계산
  }
};

/* app.js 가 init() 을 호출하지만(계약서 7-3), 배선이 늦어도 보드가 죽지 않도록
   자체 초기화 안전망을 둔다. init() 은 멱등이라 중복 호출은 무해하다.
   editor.js 의 DOMContentLoaded 핸들러가 먼저 등록되어 있으므로, 여기서 거는
   file:saved 리스너는 항상 editor.js 의 자산 캐시 무효화 뒤에 실행된다. */
document.addEventListener('DOMContentLoaded', function () { Admin.board.init(); });

})();
