/* ── 부드러운 스크롤 (Lenis) — 로컬에서만 ──
   flim.ai 느낌의 큰 몫이 이 「관성 있는 스크롤」이다. 다만 우리 메인에는
   스크롤에 물린 것이 셋 있어(히어로 패럴랙스 · 문장 진행 · sticky 형제바)
   먼저 로컬에서만 켜 두고 눈으로 확인한 뒤 배포 여부를 정한다.

   Lenis 는 실제 창을 스크롤하므로 pageYOffset 과 scroll 이벤트가 그대로 유효하다 —
   우리 기존 스크롤 코드는 손대지 않아도 된다.
   Lenis v1.1.20 · MIT · https://github.com/darkroomengineering/lenis */
(function () {
  'use strict';

  var host = location.hostname;
  var LOCAL = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';
  /* ?smooth=0 으로 끄고, ?smooth=1 로 배포본에서도 잠깐 켜 볼 수 있다 */
  var q = (location.search.match(/[?&]smooth=([01])/) || [])[1];
  if (q === '0') return;
  if (!LOCAL && q !== '1') return;

  try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
  if (!window.Lenis) return;

  /* 우리 CSS 의 scroll-behavior:smooth 와 겹치면 두 번 미끄러진다 */
  document.documentElement.style.scrollBehavior = 'auto';

  var lenis = new window.Lenis({
    /* 관성이 남는 길이. 1.2 를 넘으면 「따라오지 않는」 느낌이 나고,
       0.8 아래로 내리면 관성이 거의 사라져 그냥 기본 스크롤처럼 된다.
       1.05 에서 한 단계만 당겼다. */
    duration: 0.92,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    /* 휴대폰은 손가락 스크롤이 이미 관성을 갖는다. 여기서 또 얹으면
       두 관성이 어긋나 오히려 무겁게 느껴지고, 프레임도 더 먹는다. */
    smoothTouch: false,
    touchMultiplier: 1.6
  });

  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  /* 같은 쪽 안의 앵커(#…)는 Lenis 로 옮긴다 — 형제바 높이만큼 비켜 세운다 */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    var off = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ys-stick')) || 96;
    lenis.scrollTo(el, { offset: -off });
  });

  window.__lenis = lenis;
})();
