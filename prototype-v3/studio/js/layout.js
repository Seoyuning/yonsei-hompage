/* layout.js — 워크스페이스 패널 리사이즈 + 접기/펼치기.
   좌 사이드바·우 패널의 폭을 드래그로 조절하고, 각각 접어 중앙 캔버스만 볼 수 있다.
   상태(폭·접힘)는 localStorage 에 영속. classic script(ES 모듈 금지). */
(function () {
  'use strict';

  var LS_KEY = 'ysme-admin-layout';
  var MIN = 160;                 // 패널 최소 폭(px)
  var HARD_MAX = 560;            // 패널 최대 폭 상한(px)
  var DEFAULT_SIDE = 240, DEFAULT_RIGHT = 320;

  var grid, splitLeft, splitRight, btnLeft, btnRight;
  var state = { side: DEFAULT_SIDE, right: DEFAULT_RIGHT, leftCollapsed: false, rightCollapsed: false };

  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        if (typeof s.side === 'number') state.side = s.side;
        if (typeof s.right === 'number') state.right = s.right;
        state.leftCollapsed = !!s.leftCollapsed;
        state.rightCollapsed = !!s.rightCollapsed;
      }
    } catch (e) { /* 손상된 값은 기본값 사용 */ }
  }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // 패널 최대 폭: 캔버스가 뭉개지지 않도록 그리드 폭의 42%와 상한 중 작은 값.
  // 로그인 전 등 그리드가 숨겨져 clientWidth=0 이면 창 너비로 폴백(초기 폭이
  // 최소값으로 잘못 클램프되는 것 방지).
  function maxWidth() {
    var w = (grid && grid.clientWidth) ? grid.clientWidth : window.innerWidth;
    return Math.max(MIN, Math.min(HARD_MAX, Math.round(w * 0.42)));
  }
  function clampW(v) { return Math.max(MIN, Math.min(maxWidth(), Math.round(v))); }

  function apply() {
    if (!grid) return;
    grid.style.setProperty('--side-w', (state.leftCollapsed ? 0 : state.side) + 'px');
    grid.style.setProperty('--right-w', (state.rightCollapsed ? 0 : state.right) + 'px');
    grid.classList.toggle('left-collapsed', state.leftCollapsed);
    grid.classList.toggle('right-collapsed', state.rightCollapsed);
    if (btnLeft) btnLeft.setAttribute('aria-pressed', String(state.leftCollapsed));
    if (btnRight) btnRight.setAttribute('aria-pressed', String(state.rightCollapsed));
  }

  function pointerX(e) {
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    return e.clientX;
  }

  function startDrag(which, ev) {
    if (which === 'left' && state.leftCollapsed) return;
    if (which === 'right' && state.rightCollapsed) return;
    ev.preventDefault();
    var splitter = which === 'left' ? splitLeft : splitRight;
    if (splitter) splitter.classList.add('dragging');
    var rect = grid.getBoundingClientRect();

    function move(e) {
      var x = pointerX(e);
      if (which === 'left') state.side = clampW(x - rect.left);
      else state.right = clampW(rect.right - x);
      apply();
    }
    function up() {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
      if (splitter) splitter.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      save();
    }
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up);
  }

  function toggleLeft() { state.leftCollapsed = !state.leftCollapsed; apply(); save(); }
  function toggleRight() { state.rightCollapsed = !state.rightCollapsed; apply(); save(); }

  // 키보드 리사이즈(접근성): 스플리터에 포커스 후 좌우 화살표로 16px 조절
  function keyResize(which, e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    var d = (e.key === 'ArrowLeft' ? -16 : 16);
    if (which === 'left') state.side = clampW(state.side + d);
    else state.right = clampW(state.right - d);
    apply(); save();
  }

  function init() {
    grid = document.getElementById('workGrid');
    if (!grid) return;
    splitLeft = document.getElementById('wgSplitLeft');
    splitRight = document.getElementById('wgSplitRight');
    btnLeft = document.getElementById('btnToggleLeft');
    btnRight = document.getElementById('btnToggleRight');

    load();
    state.side = clampW(state.side);
    state.right = clampW(state.right);
    apply();

    if (splitLeft) {
      splitLeft.addEventListener('mousedown', function (e) { startDrag('left', e); });
      splitLeft.addEventListener('touchstart', function (e) { startDrag('left', e); }, { passive: false });
      splitLeft.addEventListener('dblclick', function () { state.side = DEFAULT_SIDE; apply(); save(); });
      splitLeft.addEventListener('keydown', function (e) { keyResize('left', e); });
    }
    if (splitRight) {
      splitRight.addEventListener('mousedown', function (e) { startDrag('right', e); });
      splitRight.addEventListener('touchstart', function (e) { startDrag('right', e); }, { passive: false });
      splitRight.addEventListener('dblclick', function () { state.right = DEFAULT_RIGHT; apply(); save(); });
      splitRight.addEventListener('keydown', function (e) { keyResize('right', e); });
    }
    if (btnLeft) btnLeft.addEventListener('click', toggleLeft);
    if (btnRight) btnRight.addEventListener('click', toggleRight);

    // 창 크기 변화 시 폭 상한 재보정
    window.addEventListener('resize', function () {
      state.side = clampW(state.side);
      state.right = clampW(state.right);
      apply();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
