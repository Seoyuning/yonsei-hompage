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
      'background:rgba(10,26,51,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line-soft,rgba(255,255,255,.07));' +
      'font-family:var(--mono,ui-monospace,monospace)}' +
    '.ynav-brand{justify-self:start;display:flex;align-items:center;gap:.6rem;pointer-events:auto}' +
    '.ynav-logo{display:inline-block;width:34px;height:34px;flex:0 0 auto;' +
      'background:url(assets/yonsei-logo.png) no-repeat left center;background-size:auto 34px;' +
      'filter:brightness(0) invert(1)}' +
    '.ynav-brand .dept{font-family:var(--kr);font-weight:800;font-size:1.04rem;color:#fff;letter-spacing:.01em;white-space:nowrap}' +
    /* "기계공학부" 호버 강조 — Cover 효과 바닐라 이식(블루 빔+글로우) */
    '.ynav-brand .cover{position:relative;display:inline-block;padding:.04em .3em;border-radius:3px;overflow:hidden;transition:background .2s,color .2s,text-shadow .2s}' +
    '.ynav-brand .cover:hover{background:rgba(59,130,246,.16);color:#fff;text-shadow:0 0 10px rgba(59,130,246,.7)}' +
    '.ynav-brand .cover::before,.ynav-brand .cover::after{content:"";position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--coral,#3b82f6),transparent);opacity:0;transform:translateX(-100%);pointer-events:none}' +
    '.ynav-brand .cover:hover::before{top:24%;animation:ynbeam 1.05s linear infinite}' +
    '.ynav-brand .cover:hover::after{bottom:24%;animation:ynbeam 1.35s linear infinite .28s}' +
    '@keyframes ynbeam{0%{opacity:0;transform:translateX(-110%)}12%{opacity:1}88%{opacity:1}100%{opacity:0;transform:translateX(110%)}}' +
    '@media(prefers-reduced-motion:reduce){.ynav-brand .cover:hover::before,.ynav-brand .cover:hover::after{animation:none}}' +
    '.ynav-menu{justify-self:center;display:flex;gap:1.7rem;align-items:center;pointer-events:auto}' +
    '.ynav-item{position:relative}' +
    '.ynav-top{font-family:var(--kr);font-size:1rem;font-weight:600;color:var(--txt,#cbced4);transition:color .15s;padding:.3rem 0;display:inline-block}' +
    '.ynav-item:hover .ynav-top,.ynav-top.active{color:#fff}' +
    '.ynav-top.join{color:var(--coral,#3b82f6)}' +
    '.ynav-drop{position:absolute;top:calc(100% + .55rem);left:50%;transform:translateX(-50%) translateY(-6px);' +
      'min-width:12rem;background:rgba(10,12,17,.97);backdrop-filter:blur(10px);border:1px solid var(--line,rgba(255,255,255,.14));' +
      'padding:.45rem 0;opacity:0;visibility:hidden;transition:opacity .16s,transform .16s,visibility .16s;' +
      'display:flex;flex-direction:column;z-index:41}' +
    '.ynav-drop::before{content:"";position:absolute;top:-.6rem;left:0;right:0;height:.6rem}' +
    '.ynav-item:hover .ynav-drop,.ynav-item:focus-within .ynav-drop{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}' +
    '.ynav-drop a{font-family:var(--kr);font-size:.86rem;color:var(--dim,#6a6f78);padding:.55rem 1.2rem;white-space:nowrap;transition:color .12s,background .12s}' +
    '.ynav-drop a:hover{color:#fff;background:rgba(59,130,246,.14)}' +
    '.ynav-spy{justify-self:end;text-align:right;pointer-events:auto}' +
    '.ynav-spy .lab{display:block;font-size:.58rem;letter-spacing:.24em;color:var(--dimmer,#484d55);text-transform:uppercase}' +
    '.ynav-spy .val{display:block;font-family:var(--kr);font-size:.96rem;font-weight:600;color:var(--coral,#3b82f6);margin-top:.15rem;transition:opacity .2s}' +
    '[id]{scroll-margin-top:5.5rem}' +
    '@media(max-width:920px){.ynav-menu,.ynav-spy{display:none}.ynav{grid-template-columns:1fr}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── 2. 메뉴 정의 ── */
  var MENU = [
    { t: '소개', h: 'G-about.html', key: 'about', sub: [['학과장 인사말', 'G-about.html#greeting'], ['비전 · 교육철학', 'G-about.html#vision'], ['조직 · 행정', 'G-about.html#organization'], ['주요 연혁', 'G-about.html#history']] },
    { t: '교육', h: 'G-academics.html', key: 'academics', sub: [['교육과정 개관', 'G-academics.html#curriculum'], ['이수 체계도', 'G-academics.html#roadmap'], ['전공 교과', 'G-academics.html#courses'], ['대학원 교과', 'G-academics.html#grad']] },
    { t: '연구', h: 'G-research.html', key: 'research', sub: [['여섯 개 분야', 'G-research.html#clusters'], ['연구실 전체', 'G-research.html#clusterBlocks']] },
    { t: '구성원', h: 'G-people.html', key: 'people', sub: [['교수진 디렉토리', 'G-people.html']] },
    { t: '소식', h: 'G-news.html', key: 'news', sub: [['공지사항', 'G-news.html#feed'], ['세미나 · 행사', 'G-news.html#sched'], ['연구 성과', 'G-news.html#hi']] },
    { t: '입학', h: 'G-admissions.html', key: 'admissions', join: true, sub: [['학부 입학', 'G-admissions.html#undergraduate'], ['대학원 진학', 'G-admissions.html#graduate'], ['장학 안내', 'G-admissions.html#scholarships'], ['취업 정보', 'G-admissions.html#jobs']] }
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
      '<span class="dept">연세대학교 <span class="cover">기계공학부</span></span></a>' +
    '<nav class="ynav-menu" aria-label="주메뉴">' + menuHtml + '</nav>' +
    '<div class="ynav-spy" aria-live="polite"><span class="lab">SECTION</span>' +
      '<span class="val" id="ynavSpy">' + esc(spyDefault) + '</span></div>';

  function mount() {
    var old = document.querySelector('.hud-top'); if (old) old.remove();
    document.body.insertBefore(nav, document.body.firstChild);
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
