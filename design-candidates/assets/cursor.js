/* YSME — 몰입 구역 전용 커서 (절제 도입)

   한화에어로스페이스의 제품 소개 구역처럼, **일부 영역에서만** 커서가 바뀐다.
   구조는 두 겹이다: 즉시 따라오는 점(dot) + 관성으로 늦게 따라오는 링(ring).

   설계 원칙
     · 기본 커서를 전역으로 없애지 않는다. `cursor:none` 은 **JS 가 성공했을 때만**
       붙는 클래스(.ycur-live)로 걸어, 스크립트가 죽어도 커서가 사라지지 않는다.
     · 켜지는 조건이 까다롭다 — 터치·호버 불가·모션 최소화 선호·좁은 화면에서는 아예 안 만든다.
     · 편집 스튜디오가 편집 모드일 때는 스스로 물러난다(선택 상자와 싸우면 안 된다).
     · 만드는 DOM 은 전부 data-ys-ui — 스튜디오의 편집 대상·번역 대상에서 빠진다.

   쓰는 법 (HTML 쪽)
     구역:   <section data-cursor-zone> … </section>
     대상:   <a data-cursor="분야 보기"> … </a>     ← 링 안에 이 말이 뜬다
*/
(function () {
  'use strict';
  if (window.YSME_CURSOR) return;

  var ZONE = '[data-cursor-zone]';
  var LIVE = 'ycur-live';

  function mq(q) { return window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: null }; }

  /** 켤 수 있는 환경인가 — 하나라도 아니면 만들지 않는다. */
  function allowed() {
    if (!window.matchMedia || !window.requestAnimationFrame) return false;
    if (mq('(pointer: coarse)').matches) return false;         // 터치 기기
    if (mq('(hover: none)').matches) return false;
    if (mq('(prefers-reduced-motion: reduce)').matches) return false;
    if (window.innerWidth < 900) return false;
    return true;
  }

  /** 편집 스튜디오가 편집 모드인가 — 그때는 물러난다. */
  function studioEditing() {
    var Y = window.YStudio;
    try { return !!(Y && Y.hud && Y.hud.editing && Y.hud.editing()); }
    catch (e) { return false; }
  }

  /** 라벨을 현재 언어로 — 사전이 있으면 영어로 바꾼다. */
  function label(s) {
    if (!s) return '';
    var I = window.YSME_I18N;
    try {
      if (!I || !I.isEn || !I.isEn()) return s;
      var d = I.dict ? I.dict() : null;
      var k = I.norm ? I.norm(s) : s;
      return (d && d[k]) || s;
    } catch (e) { return s; }
  }

  if (!allowed()) return;

  /* ── 스타일 (자기 것을 스스로 넣는다 — 페이지마다 CSS 를 고칠 필요가 없다) ── */
  var CSS = [
    '.ycur{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;',
    'z-index:2147482000;opacity:0;transition:opacity .18s ease}',
    '.ycur.is-on{opacity:1}',
    /* 점 — 포인터를 정확히 따라간다 */
    '.ycur-dot{position:fixed;left:0;top:0;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;',
    'border-radius:50%;background:#fff;box-shadow:0 0 0 1.5px rgba(10,26,51,.45);will-change:transform}',
    /* 링 — 바깥은 위치만(JS 가 transform 을 쓴다), 안쪽이 모양을 맡는다 */
    '.ycur-ring{position:fixed;left:0;top:0;width:0;height:0;will-change:transform}',
    '.ycur-ring-i{position:absolute;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;',
    'border-radius:50%;border:1.5px solid rgba(255,255,255,.9);background:rgba(255,255,255,.10);',
    'display:grid;place-items:center;',
    'transition:width .24s cubic-bezier(.22,.61,.36,1),height .24s cubic-bezier(.22,.61,.36,1),',
    'margin .24s cubic-bezier(.22,.61,.36,1),background .2s ease,border-color .2s ease,transform .12s ease}',
    '.ycur.is-target .ycur-ring-i{width:88px;height:88px;margin:-44px 0 0 -44px;',
    'background:rgba(255,255,255,.94);border-color:transparent;box-shadow:0 6px 20px rgba(10,26,51,.18)}',
    '.ycur.is-down .ycur-ring-i{transform:scale(.88)}',
    '.ycur.is-target .ycur-dot{opacity:0}',
    '.ycur-dot{transition:opacity .16s ease}',
    '.ycur-lb{font-family:"Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;',
    'font-size:.72rem;font-weight:700;letter-spacing:-.01em;color:#12294f;white-space:nowrap;',
    'opacity:0;transform:translateY(3px);transition:opacity .16s ease .04s,transform .16s ease .04s}',
    '.ycur.is-target .ycur-lb{opacity:1;transform:none}',
    /* 기본 커서 숨김 — JS 가 성공했을 때만 붙는 클래스 아래에서만 적용된다 */
    'html.ycur-live [data-cursor-zone],html.ycur-live [data-cursor-zone] *{cursor:none}'
  ].join('');

  function ensureStyle() {
    if (document.getElementById('ycur-style')) return;
    var st = document.createElement('style');
    st.id = 'ycur-style';
    st.setAttribute('data-ys-ui', '');
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ── DOM ── */
  var root = document.createElement('div');
  root.className = 'ycur';
  root.setAttribute('data-ys-ui', '');
  root.setAttribute('aria-hidden', 'true');
  var dot = document.createElement('span');
  dot.className = 'ycur-dot';
  var ring = document.createElement('span');
  ring.className = 'ycur-ring';
  var ringIn = document.createElement('span');
  ringIn.className = 'ycur-ring-i';
  var lb = document.createElement('span');
  lb.className = 'ycur-lb';
  ringIn.appendChild(lb);
  ring.appendChild(ringIn);
  root.appendChild(ring);
  root.appendChild(dot);

  function mount() {
    if (!document.body || root.parentNode) return;
    ensureStyle();
    document.body.appendChild(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();

  /* ── 상태 ── */
  var tx = -100, ty = -100;      // 실제 포인터
  var rx = -100, ry = -100;      // 링(지연)
  var inZone = false, curTarget = null, raf = 0, running = false;

  function setLive(on) {
    var h = document.documentElement;
    if (on) h.classList.add(LIVE); else h.classList.remove(LIVE);
  }

  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    root.classList.remove('is-on', 'is-target');
    setLive(false);
    inZone = false;
    curTarget = null;
  }

  function tick() {
    if (!running) return;
    /* 편집 중이면 즉시 물러난다 */
    if (studioEditing()) { stop(); return; }
    /* 링은 점을 0.18 비율로 따라간다 — 관성이 생긴다 */
    rx += (tx - rx) * 0.18;
    ry += (ty - ry) * 0.18;
    dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  /* ── 포인터 ── */
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    tx = e.clientX;
    ty = e.clientY;

    if (studioEditing()) { if (inZone) stop(); return; }

    var zone = e.target && e.target.closest ? e.target.closest(ZONE) : null;
    if (!zone) {
      if (inZone) {
        inZone = false;
        curTarget = null;
        root.classList.remove('is-on', 'is-target');
        setLive(false);
      }
      return;
    }
    if (!inZone) {
      inZone = true;
      rx = tx; ry = ty;                       // 들어올 때 링을 붙여 놓고 시작(뒤에서 날아오지 않게)
      root.classList.add('is-on');
      setLive(true);
      start();
    }
    var t = e.target.closest('[data-cursor]');
    if (t !== curTarget) {
      curTarget = t;
      if (t) {
        lb.textContent = label(t.getAttribute('data-cursor'));
        root.classList.add('is-target');
      } else {
        lb.textContent = '';
        root.classList.remove('is-target');
      }
    }
  }, { passive: true });

  document.addEventListener('pointerdown', function () {
    if (inZone) root.classList.add('is-down');
  }, { passive: true });
  document.addEventListener('pointerup', function () {
    root.classList.remove('is-down');
  }, { passive: true });

  /* 창을 벗어나거나 탭이 숨으면 정리 */
  document.addEventListener('pointerleave', function () { if (inZone) stop(); }, { passive: true });
  window.addEventListener('blur', function () { if (inZone) stop(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && inZone) stop(); });

  /* 환경이 바뀌면(모션 최소화 켬·창 축소) 즉시 끈다 */
  var rm = mq('(prefers-reduced-motion: reduce)');
  if (rm.addEventListener) rm.addEventListener('change', function (e) { if (e.matches) stop(); });
  window.addEventListener('resize', function () { if (window.innerWidth < 900 && inZone) stop(); }, { passive: true });

  window.YSME_CURSOR = {
    /** 강제로 끄기 — 스튜디오가 편집 모드로 들어갈 때 등 */
    off: stop,
    isOn: function () { return inZone; }
  };
})();
