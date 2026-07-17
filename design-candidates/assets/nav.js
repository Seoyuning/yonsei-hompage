/* ═══════════════════════════════════════════════════════════════
   관제(G) 공용 상단 navbar — 전 페이지 고정/통일
   레이아웃: [좌] 연세대 로고 + 연세대학교 기계공학부 · [중앙] 메뉴(호버 드롭다운) · [우] 현재 섹터
   - 기존 페이지의 .hud-top 헤더를 제거하고 이 컴포넌트로 교체
   - 홈(G-console): 우측 = 스크롤 섹션 스파이 / 내부 페이지: 우측 = 현재 페이지명
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. 스타일 주입(구 헤더 숨김 + 새 navbar) ── */
  var css =
    '.hud-top{display:none!important}' +
    '.ynav{position:fixed;top:0;left:0;right:0;z-index:40;display:grid;grid-template-columns:1fr auto 1fr;' +
      'align-items:center;gap:1rem;padding:.75rem clamp(1.2rem,.6rem + 2vw,2.6rem);' +
      'background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-bottom:1px solid rgba(0,0,0,.08);' +
      'font-family:var(--mono,ui-monospace,monospace)}' +
    '.ynav-brand{justify-self:start;display:flex;align-items:center;gap:.6rem;pointer-events:auto}' +
    '.ynav-logo{display:inline-block;width:34px;height:34px;flex:0 0 auto;' +
      'background:url(assets/yonsei-logo.png) no-repeat left center;background-size:auto 34px}' +
    '.ynav-brand .dept{font-family:var(--kr);font-weight:800;font-size:1.04rem;color:#1a3d75;letter-spacing:.01em;white-space:nowrap}' +
    '.ynav-menu{justify-self:center;display:flex;gap:1.7rem;align-items:center;pointer-events:auto}' +
    '.ynav-item{position:relative}' +
    '.ynav-top{font-family:var(--kr);font-size:1rem;font-weight:600;color:#41506a;transition:color .15s;padding:.3rem 0;display:inline-block}' +
    '.ynav-item:hover .ynav-top,.ynav-top.active{color:#1a3d75}' +
    '.ynav-top.join{color:#41506a}' +
    '.ynav-drop{position:absolute;top:calc(100% + .55rem);left:50%;transform:translateX(-50%) translateY(-6px);' +
      'min-width:12rem;background:rgba(255,255,255,.98);backdrop-filter:blur(10px);border:1px solid rgba(0,0,0,.1);box-shadow:0 10px 28px rgba(10,26,51,.14);' +
      'padding:.45rem 0;opacity:0;visibility:hidden;transition:opacity .16s,transform .16s,visibility .16s;' +
      'display:flex;flex-direction:column;z-index:41}' +
    '.ynav-drop::before{content:"";position:absolute;top:-.6rem;left:0;right:0;height:.6rem}' +
    '.ynav-item:hover .ynav-drop,.ynav-item:focus-within .ynav-drop{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}' +
    '.ynav-drop a{font-family:var(--kr);font-size:.86rem;color:#5c6b85;padding:.55rem 1.2rem;white-space:nowrap;transition:color .12s,background .12s}' +
    '.ynav-drop a:hover{color:#1a3d75;background:rgba(26,61,117,.08)}' +
    '.ynav-spy{justify-self:end;text-align:right;pointer-events:auto}' +
    '.ynav-spy .lab{display:block;font-size:.58rem;letter-spacing:.24em;color:#9aa3b0;text-transform:uppercase}' +
    '.ynav-spy .val{display:block;font-family:var(--kr);font-size:.96rem;font-weight:600;color:#1a3d75;margin-top:.15rem;transition:opacity .2s}' +
    '[id]{scroll-margin-top:5.5rem}' +
    '@media(max-width:920px){.ynav-menu,.ynav-spy{display:none}.ynav{grid-template-columns:1fr}}' +
    /* ── 모바일 햄버거 + 풀스크린 오버레이(≤920px) ── */
    '.ynav-burger{display:none;justify-self:end;width:44px;height:44px;align-items:center;justify-content:center;' +
      'flex-direction:column;gap:5px;background:none;border:0;padding:0;cursor:pointer;pointer-events:auto}' +
    '.ynav-burger span{display:block;width:22px;height:2px;background:#1a3d75;border-radius:1px}' +
    '.ynav-ovl{position:fixed;inset:0;z-index:60;background:#fff;display:flex;flex-direction:column;' +
      'overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:var(--mono,ui-monospace,monospace);' +
      'opacity:0;visibility:hidden;transition:opacity .18s,visibility 0s .18s}' +
    '.ynav-ovl.open{opacity:1;visibility:visible;transition:opacity .18s,visibility 0s}' +
    '.ynav-ovl-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex:0 0 auto;' +
      'padding:.75rem clamp(1.2rem,.6rem + 2vw,2.6rem);border-bottom:1px solid rgba(0,0,0,.08)}' +
    '.ynav-ovl-close{width:44px;height:44px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;' +
      'background:none;border:0;padding:0;cursor:pointer;font-size:1.35rem;line-height:1;color:#1a3d75}' +
    '.ynav-ovl-body{display:flex;flex-direction:column;padding:.6rem clamp(1.2rem,.6rem + 2vw,2.6rem) 3rem}' +
    '.ynav-ovl-top{display:block;font-family:var(--kr);font-size:1.12rem;font-weight:800;color:#1a3d75;' +
      'padding:.85rem 0 .4rem;margin-top:.5rem;border-bottom:1px solid rgba(0,0,0,.06)}' +
    '.ynav-ovl-sub{display:block;font-family:var(--kr);font-size:.95rem;color:#5c6b85;padding:.55rem 0 .55rem 1.1rem}' +
    '@media(max-width:920px){.ynav{grid-template-columns:1fr auto}.ynav-burger{display:inline-flex}}' +
    '@media(min-width:921px){.ynav-ovl{display:none!important}}' +
    '@media(prefers-reduced-motion:reduce){.ynav-ovl,.ynav-ovl.open{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── 2. 메뉴 정의 ── */
  var MENU = [
    { t: '소개', h: 'G-about.html', key: 'about', sub: [['학과장 인사말', 'G-about.html#greeting'], ['비전 · 교육철학', 'G-about.html#vision'], ['조직 · 행정', 'G-about.html#organization'], ['주요 연혁', 'G-about.html#history'], ['연락처 · 오시는 길', 'G-about.html#location']] },
    { t: '교육', h: 'G-academics.html', key: 'academics', sub: [['교육과정 개관', 'G-academics.html#curriculum'], ['이수 체계도', 'G-academics.html#roadmap'], ['전공 교과', 'G-academics.html#courses'], ['대학원 교과', 'G-academics.html#grad']] },
    { t: '연구', h: 'G-research.html', key: 'research', sub: [['여섯 개 분야', 'G-research.html#clusters'], ['연구실 전체', 'G-research.html#clusterBlocks']] },
    { t: '구성원', h: 'G-people.html', key: 'people', sub: [['교수진 디렉토리', 'G-people.html']] },
    { t: '소식', h: 'G-news.html', key: 'news', sub: [['공지사항', 'G-news.html#feed'], ['뉴스 · 연구 성과', 'G-news.html#hi'], ['세미나 · 행사', 'G-news.html#sched']] },
    { t: '입학', h: 'G-admissions.html', key: 'admissions', join: true, sub: [['학부 입학', 'G-admissions.html#undergraduate'], ['대학원 진학', 'G-admissions.html#graduate'], ['장학 안내', 'G-admissions.html#scholarships'], ['취업 정보', 'G-admissions.html#jobs'], ['진로 안내', 'G-admissions.html#careers']] }
  ];
  var path = (location.pathname.split('/').pop() || '').toLowerCase();
  var pageName = { 'g-about.html': '소개', 'g-academics.html': '교육', 'g-research.html': '연구', 'g-people.html': '구성원', 'g-news.html': '소식', 'g-admissions.html': '입학' };
  var isHome = (path === '' || path === 'g-console.html' || path === 'index.html');
  var curKey = null;
  MENU.forEach(function (m) { if (path === 'g-' + m.key + '.html') curKey = m.key; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ── 3. navbar 마크업 ── */
  var menuHtml = MENU.map(function (m) {
    var subs = m.sub.map(function (s) { return '<a href="' + s[1] + '">' + esc(s[0]) + '</a>'; }).join('');
    var active = (m.key === curKey) ? ' active' : '';
    return '<div class="ynav-item"><a class="ynav-top' + (m.join ? ' join' : '') + active + '" href="' + m.h + '">' + esc(m.t) + '</a>' +
      '<div class="ynav-drop">' + subs + '</div></div>';
  }).join('');
  var spyDefault = isHome ? '연세대학교 기계공학부' : (pageName[path] || '');
  var nav = document.createElement('header');
  nav.className = 'ynav';
  nav.innerHTML =
    '<a class="ynav-brand" href="G-console.html" aria-label="연세대학교 기계공학부 홈">' +
      '<span class="ynav-logo" role="img" aria-label="연세대학교"></span>' +
      '<span class="dept">연세대학교 기계공학부</span></a>' +
    '<nav class="ynav-menu" aria-label="주메뉴">' + menuHtml + '</nav>' +
    '<div class="ynav-spy" aria-live="polite"><span class="lab">SECTION</span>' +
      '<span class="val" id="ynavSpy">' + esc(spyDefault) + '</span></div>';

  function mount() {
    var old = document.querySelector('.hud-top'); if (old) old.remove();
    document.body.insertBefore(nav, document.body.firstChild);
    /* ── 모바일 햄버거 버튼 + 풀스크린 오버레이 메뉴(≤920px) ── */
    var burger = document.createElement('button');
    burger.className = 'ynav-burger'; burger.type = 'button';
    burger.setAttribute('aria-label', '메뉴 열기');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'ynavOvl');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);
    var ovl = document.createElement('div');
    ovl.className = 'ynav-ovl'; ovl.id = 'ynavOvl';
    ovl.setAttribute('role', 'dialog');
    ovl.setAttribute('aria-modal', 'true');
    ovl.setAttribute('aria-label', '모바일 메뉴');
    ovl.innerHTML =
      '<div class="ynav-ovl-head">' +
        '<a class="ynav-brand" href="G-console.html" aria-label="연세대학교 기계공학부 홈">' +
          '<span class="ynav-logo" role="img" aria-label="연세대학교"></span>' +
          '<span class="dept">연세대학교 기계공학부</span></a>' +
        '<button class="ynav-ovl-close" type="button" aria-label="메뉴 닫기">✕</button></div>' +
      '<nav class="ynav-ovl-body" aria-label="모바일 주메뉴">' +
        MENU.map(function (m) {
          var subs = m.sub.map(function (s) { return '<a class="ynav-ovl-sub" href="' + s[1] + '">' + esc(s[0]) + '</a>'; }).join('');
          return '<a class="ynav-ovl-top" href="' + m.h + '">' + esc(m.t) + '</a>' + subs;
        }).join('') + '</nav>';
    document.body.appendChild(ovl);
    var ovlClose = ovl.querySelector('.ynav-ovl-close');
    var prevOverflow = '';
    var openOvl = function () {
      if (ovl.classList.contains('open')) return;
      ovl.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      prevOverflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
      var first = ovl.querySelector('.ynav-ovl-body a'); if (first) first.focus();
    };
    var closeOvl = function () {
      if (!ovl.classList.contains('open')) return;
      ovl.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = prevOverflow;
      burger.focus();
    };
    burger.addEventListener('click', function () { if (ovl.classList.contains('open')) closeOvl(); else openOvl(); });
    if (ovlClose) ovlClose.addEventListener('click', closeOvl);
    ovl.addEventListener('click', function (e) {
      var a = (e.target && e.target.closest) ? e.target.closest('a') : null;
      if (a) closeOvl();
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && ovl.classList.contains('open')) closeOvl();
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 920) closeOvl(); });
    if (isHome) {
      var spy = document.getElementById('ynavSpy');
      var secs = [].slice.call(document.querySelectorAll('.stage,.doc .sec,.cta'));
      if (spy && secs.length && 'IntersectionObserver' in window) {
        var labelOf = function (el) {
          if (el.classList.contains('stage')) return '연세대학교 기계공학부';
          if (el.classList.contains('cta')) return '입학';
          var k = el.querySelector('.sec-kick'); return k ? k.textContent.trim() : '';
        };
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { var l = labelOf(e.target); if (l) spy.textContent = l; } });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        secs.forEach(function (s) { io.observe(s); });
      }
    }
    /* 앵커(#섹션)로 진입 시 — JS로 렌더되는 섹션 대응해 콘텐츠 렌더 후 재스크롤 */
    if (location.hash && location.hash.length > 1) {
      var reScroll = function () {
        var t = null;
        try { t = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
        if (t) {
          var y = t.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 76;
          try { window.scrollTo({ top: y, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); }
        }
      };
      [120, 350, 700].forEach(function (d) { setTimeout(reScroll, d); });
      window.addEventListener('load', function () { setTimeout(reScroll, 100); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
