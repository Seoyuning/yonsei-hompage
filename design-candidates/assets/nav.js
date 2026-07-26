/* ═══════════════════════════════════════════════════════════════
   서브페이지(G) 공용 상단 헤더 — 메인(H-academic)과 동일한 바로 통일.
   구성: [다크 유틸바] 외부 링크 + 한/영 토글  ·  [흰 헤더] 씰 브랜드 + 드롭다운 메뉴.
   폰트는 Pretendard 단일(모노 제거). 고정 헤더, 스크롤 시 유틸바 접힘.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var NAVY = '#1a3d75', NAVYD = '#12294f', INK = '#0f1b30',
      PAPER = '#f1f2f5', LINE = '#e2ddd2', DIM = '#8b96a9', MUTED = '#5e6b82';
  var KR = '"Apple SD Gothic Neo","Noto Sans KR","Pretendard Variable","Pretendard",system-ui,sans-serif';
  var E = 'cubic-bezier(.16,1,.3,1)';

  /* ── 1. 스타일 주입 ── */
  var css = [
    '.hud-top{display:none!important}',
    '.ynav-ph{display:none!important}',
    '.ynv{position:fixed;top:0;left:0;right:0;z-index:50;font-family:' + KR + '}',
    '.ynv-w{max-width:72rem;margin:0 auto;padding:0 clamp(1.1rem,4vw,2rem)}',
    /* 유틸 바 */
    '.ynv-top{background:' + INK + ';color:#c6d2e6;font-size:.74rem;overflow:hidden;max-height:2.3rem;' +
      'transition:max-height .4s ' + E + ',opacity .3s ease}',
    '.ynv-top .ynv-w{display:flex;align-items:center;justify-content:flex-end;gap:1.4rem;padding:.42rem clamp(1.1rem,4vw,2rem)}',
    '.ynv-top a{color:#c6d2e6;text-decoration:none;transition:color .15s}',
    '.ynv-top a:hover{color:#fff}',
    '.ynv.min .ynv-top{max-height:0;opacity:0}',
    '.ynv-lang{display:flex;gap:.1rem;margin-left:.5rem;border:1px solid rgba(255,255,255,.28);border-radius:99px;padding:.12rem}',
    '.ynv-lang button{font-family:inherit;font-size:.66rem;font-weight:700;letter-spacing:.08em;color:#c6d2e6;' +
      'background:none;border:0;border-radius:99px;padding:.16rem .62rem;cursor:pointer;transition:background .12s,color .12s}',
    '.ynv-lang button.on{background:#fff;color:' + NAVYD + '}',
    /* 흰 헤더 */
    '.ynv-hdr{background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid ' + LINE + '}',
    '.ynv-hdr .ynv-w{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;padding-top:.85rem;padding-bottom:.85rem}',
    '.ynv-brand{display:flex;align-items:center;gap:.7rem;min-width:0;text-decoration:none}',
    '.ynv-brand img{height:2.4rem;width:auto;display:block}',
    '.ynv-brand .bko{font-weight:800;font-size:1.06rem;letter-spacing:-.01em;color:' + NAVY + ';line-height:1.25}',
    '.ynv-brand .ben{display:block;font-size:.62rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:' + DIM + '}',
    '.ynv-menu{display:flex;gap:clamp(2rem,3.8vw,3.6rem);font-weight:600;font-size:.98rem;white-space:nowrap}',
    '.ynv-i{position:relative}',
    '.ynv-i>a{position:relative;display:inline-block;padding:.55rem 0;color:' + INK + ';text-decoration:none;transition:color .2s}',
    '.ynv-i>a::after{content:"";position:absolute;left:0;right:0;bottom:.2rem;height:2px;background:' + NAVY + ';' +
      'transform:scaleX(0);transform-origin:right;transition:transform .45s ' + E + '}',
    '.ynv-i:hover>a,.ynv-i>a.cur{color:' + NAVY + '}',
    '.ynv-i:hover>a::after,.ynv-i>a.cur::after{transform:scaleX(1);transform-origin:left}',
    /* 드롭다운 */
    '.ynv-d{position:absolute;top:calc(100% + .35rem);left:50%;min-width:12.5rem;background:#fff;' +
      'border:1px solid ' + LINE + ';border-top:2px solid ' + NAVY + ';box-shadow:0 22px 48px rgba(15,27,48,.14);' +
      'padding:.55rem 0;display:flex;flex-direction:column;opacity:0;visibility:hidden;transform:translate(-50%,14px);z-index:60;' +
      'transition:opacity .35s ' + E + ',transform .5s ' + E + ',visibility .35s}',
    '.ynv-d::before{content:"";position:absolute;top:-1rem;left:0;right:0;height:1rem}',
    '.ynv-i:hover .ynv-d,.ynv-i:focus-within .ynv-d{opacity:1;visibility:visible;transform:translate(-50%,4px)}',
    '.ynv-d a{padding:.52rem 1.25rem;font-size:.87rem;font-weight:500;color:' + MUTED + ';text-decoration:none;' +
      'opacity:0;transform:translateY(7px);transition:opacity .4s ease,transform .5s ' + E + ',color .15s,background .15s,padding .3s ' + E + '}',
    '.ynv-i:hover .ynv-d a,.ynv-i:focus-within .ynv-d a{opacity:1;transform:none}',
    '.ynv-d a:nth-child(2){transition-delay:.04s}.ynv-d a:nth-child(3){transition-delay:.08s}',
    '.ynv-d a:nth-child(4){transition-delay:.12s}.ynv-d a:nth-child(5){transition-delay:.16s}',
    '.ynv-d a:hover{color:' + NAVY + ';background:' + PAPER + ';padding-left:1.6rem}',
    '[id]{scroll-margin-top:5rem}',
    'body.has-ysub [id]{scroll-margin-top:7.6rem}',
    /* breadcrumb 링크 */
    '.bc a{color:rgba(255,255,255,.82);text-decoration:none;transition:color .15s}',
    '.bc a:hover{color:#fff}',
    '.bc a.bc-cur,.bc .bc-tab{color:#fff;font-weight:600}',
    '.bc span{color:rgba(255,255,255,.5)}',
    /* 하위페이지 탭 바 — 유일한 형제 내비(뷰 전환), 히어로 아래 sticky, 크고 잘 보이게 */
    '.ysub{position:sticky;top:4.35rem;z-index:38;background:#fff;border-bottom:1px solid ' + LINE + ';' +
      'box-shadow:0 6px 18px rgba(15,27,48,.06)}',
    '.ysub-w{max-width:72rem;margin:0 auto;padding:0 clamp(1.1rem,4vw,2rem);' +
      'display:flex;gap:.15rem;align-items:stretch;overflow-x:auto;scrollbar-width:none}',
    '.ysub-w::-webkit-scrollbar{display:none}',
    '.ysub-tab{flex:0 0 auto;font-family:' + KR + ';font-size:1rem;font-weight:700;color:' + MUTED + ';' +
      'background:none;border:0;border-bottom:3px solid transparent;cursor:pointer;padding:1rem 1.15rem .85rem;' +
      'white-space:nowrap;letter-spacing:-.01em;transition:color .18s,border-color .2s ' + E + ',background .18s}',
    '.ysub-tab:hover{color:' + NAVY + ';background:' + PAPER + '}',
    '.ysub-tab.cur{color:' + NAVY + ';border-bottom-color:' + NAVY + '}',
    '.ysub-hide{display:none!important}',
    '@media(max-width:920px){.ysub{top:3.7rem}.ysub-tab{font-size:.92rem;padding:.85rem .9rem .7rem}}',
    '@media(prefers-reduced-motion:reduce){.ysub-tab{transition:color .18s,border-color .18s,background .18s}}',
    /* 맨 위로 버튼 */
    '.ytop{position:fixed;right:1.4rem;bottom:1.4rem;z-index:45;width:2.9rem;height:2.9rem;border-radius:50%;' +
      'background:#fff;border:1px solid rgba(10,26,51,.15);box-shadow:0 6px 18px rgba(10,26,51,.15);' +
      'color:' + NAVY + ';display:grid;place-items:center;cursor:pointer;opacity:0;visibility:hidden;transform:translateY(8px);' +
      'transition:opacity .2s,transform .2s,visibility .2s}',
    '.ytop.show{opacity:1;visibility:visible;transform:none}',
    '.ytop:hover{border-color:' + NAVY + '}',
    /* 모바일 햄버거 + 오버레이 */
    '.ynv-burger{display:none;width:44px;height:44px;align-items:center;justify-content:center;flex-direction:column;gap:5px;' +
      'background:none;border:0;padding:0;cursor:pointer}',
    '.ynv-burger span{display:block;width:22px;height:2px;background:' + NAVY + ';border-radius:1px}',
    '.ynv-ovl{position:fixed;inset:0;z-index:70;background:#fff;display:flex;flex-direction:column;overflow-y:auto;' +
      '-webkit-overflow-scrolling:touch;font-family:' + KR + ';opacity:0;visibility:hidden;transition:opacity .18s,visibility 0s .18s}',
    '.ynv-ovl.open{opacity:1;visibility:visible;transition:opacity .18s,visibility 0s}',
    '.ynv-ovl-head{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex:0 0 auto;' +
      'padding:.75rem clamp(1.2rem,.6rem + 2vw,2.6rem);border-bottom:1px solid ' + LINE + '}',
    '.ynv-ovl-close{width:44px;height:44px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;' +
      'background:none;border:0;padding:0;cursor:pointer;font-size:1.35rem;line-height:1;color:' + NAVY + '}',
    '.ynv-ovl-body{display:flex;flex-direction:column;padding:.6rem clamp(1.2rem,.6rem + 2vw,2.6rem) 3rem}',
    '.ynv-ovl-top{display:block;font-family:' + KR + ';font-size:1.12rem;font-weight:800;color:' + NAVY + ';' +
      'padding:.85rem 0 .4rem;margin-top:.5rem;border-bottom:1px solid rgba(0,0,0,.06)}',
    '.ynv-ovl-sub{display:block;font-family:' + KR + ';font-size:.95rem;color:' + MUTED + ';padding:.55rem 0 .55rem 1.1rem;text-decoration:none}',
    '@media(max-width:920px){.ynv-menu{display:none}.ynv-burger{display:inline-flex}}',
    '@media(min-width:921px){.ynv-ovl{display:none!important}}',
    '@media(prefers-reduced-motion:reduce){.ynv-top,.ynv-d,.ynv-d a,.ynv-i>a::after{transition:none}}',
    /* ── 사이트맵 정보 푸터 (파란 CTA·간이 푸터 대체) ── */
    '.yft{background:' + INK + ';color:#c6d2e6;font-family:' + KR + '}',
    '.yft-w{max-width:80rem;margin:0 auto;padding:clamp(2.6rem,1.8rem + 2.5vw,4rem) clamp(1.2rem,4vw,2.4rem) 2.2rem;' +
      'display:grid;grid-template-columns:minmax(0,16.5rem) 1fr;gap:clamp(2rem,1rem + 3vw,4.5rem)}',
    '.yft-logo{display:block;font-weight:800;font-size:1.08rem;color:#fff;letter-spacing:-.01em;line-height:1.3;text-decoration:none}',
    '.yft-logo span{display:block;font-size:.6rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#7f90ad;margin-top:.3rem}',
    '.yft-addr{font-size:.82rem;line-height:1.75;color:#a9b6cd;margin-top:1.25rem}',
    '.yft-tel{font-size:.82rem;line-height:1.7;color:#a9b6cd;margin-top:.55rem}',
    '.yft-ext{display:flex;flex-wrap:wrap;gap:.45rem .55rem;margin-top:1.3rem}',
    '.yft-ext a{font-size:.78rem;color:#c6d2e6;text-decoration:none;border:1px solid rgba(255,255,255,.18);' +
      'padding:.36rem .8rem;border-radius:99px;transition:background .15s,border-color .15s,color .15s}',
    '.yft-ext a:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.42);color:#fff}',
    '.yft-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.2rem,1fr));gap:1.7rem 1.1rem}',
    '.yft-h{display:inline-block;font-weight:700;font-size:.92rem;color:#fff;text-decoration:none;margin-bottom:.95rem;transition:color .15s}',
    '.yft-h:hover{color:#9db4d8}',
    '.yft-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.52rem}',
    '.yft-col li a{font-size:.82rem;color:#93a2bd;text-decoration:none;transition:color .15s}',
    '.yft-col li a:hover{color:#fff;text-decoration:underline;text-underline-offset:3px}',
    '.yft-base{border-top:1px solid rgba(255,255,255,.1);padding:1.25rem 1rem;font-size:.72rem;' +
      'letter-spacing:.03em;color:#7f90ad;text-align:center}',
    '.yft-base a{color:#93a2bd;text-decoration:none}.yft-base a:hover{color:#fff}',
    '@media(max-width:720px){.yft-w{grid-template-columns:1fr;gap:2.4rem}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── 2. 메뉴 정의 (메인 H-academic 순서·라벨과 동일) ── */
  var MENU = [
    { t: '학부소개', h: 'G-about.html', key: 'about', sub: [['학과장 인사말', 'G-about.html#greeting', ['greeting']], ['비전 · 교육철학', 'G-about.html#vision', ['vision']], ['조직 · 행정', 'G-about.html#organization', ['organization']], ['주요 연혁', 'G-about.html#history', ['history']], ['연락처 · 오시는 길', 'G-about.html#location', ['location']]] },
    { t: '구성원', h: 'G-people.html', key: 'people', sub: [['교수진', 'G-people.html#faculty', ['faculty', 'dir']], ['교직원', 'G-people.html#staff', ['staff']]] },
    { t: '연구', h: 'G-research.html', key: 'research', sub: [['연구 비전', 'G-research.html#vision', ['vision']], ['연구 분야', 'G-research.html#fields', ['fields', 'fieldsDetail']], ['연구실 전체', 'G-research.html#clusters', ['clusters']], ['연구실 홍보영상', 'G-research.html#labvideos', ['labvideos']]] },
    { t: '학사', h: 'G-academics.html', key: 'academics', sub: [['교육과정 개관', 'G-academics.html#curriculum', ['curriculum', 'requirements', 'abeek']], ['이수 체계도', 'G-academics.html#roadmap', ['roadmap']], ['졸업 요건', 'G-academics.html#graduation', ['graduation']], ['전공 교과', 'G-academics.html#courses', ['mechanics', 'courses']], ['대학원 교과', 'G-academics.html#grad', ['grad']], ['동아리·학생활동', 'G-academics.html#clubs', ['clubs']]] },
    { t: '대학원', h: 'G-graduate.html', key: 'graduate', sub: [['입학 안내', 'G-graduate.html#grad-admission', ['grad-admission']], ['졸업 요건', 'G-graduate.html#grad-req', ['grad-req']], ['교과목 소개', 'G-graduate.html#grad-courses', ['grad-courses']], ['대학원 연구실', 'G-graduate.html#grad-labs', ['grad-labs']], ['BK21 FOUR', 'G-graduate.html#bk21', ['bk21']]] },
    { t: '소식', h: 'G-news.html', key: 'news', sub: [['학부 공지', 'G-news.html#notice-ug', ['notice-ug']], ['대학원 공지', 'G-news.html#notice-grad', ['notice-grad']], ['뉴스 · 연구성과', 'G-news.html#hi', ['hi']], ['세미나 · 행사', 'G-news.html#sched', ['sched']], ['학위논문심사', 'G-news.html#thesis', ['thesis']], ['자료실', 'G-news.html#archive', ['archive']], ['취업 정보', 'G-news.html#jobs', ['jobs']]] },
    { t: '입학', h: 'G-admissions.html', key: 'admissions', sub: [['학부 입학', 'G-admissions.html#undergraduate', ['undergraduate']], ['대학원 진학', 'G-admissions.html#graduate', ['graduate']], ['장학 안내', 'G-admissions.html#scholarships', ['scholarships']], ['진로 안내', 'G-admissions.html#careers', ['careers', 'alumni', 'faq']]] }
  ];
  var path = (location.pathname.split('/').pop() || '').toLowerCase();
  var curKey = null;
  MENU.forEach(function (m) { if (path === 'g-' + m.key + '.html') curKey = m.key; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ── 3. 마크업 ── */
  var menuHtml = MENU.map(function (m) {
    var subs = m.sub.map(function (s) { return '<a href="' + s[1] + '">' + esc(s[0]) + '</a>'; }).join('');
    var cur = (m.key === curKey) ? ' class="cur"' : '';
    return '<div class="ynv-i"><a' + cur + ' href="' + m.h + '">' + esc(m.t) + '</a>' +
      '<div class="ynv-d">' + subs + '</div></div>';
  }).join('');

  var brand =
    '<a class="ynv-brand" href="H-academic.html" aria-label="연세대학교 기계공학부 홈">' +
      '<img src="assets/yonsei-seal-t.png" alt="" />' +
      '<span class="bko">연세대학교 기계공학부<span class="ben">School of Mechanical Engineering</span></span></a>';

  var nav = document.createElement('div');
  nav.className = 'ynv';
  nav.innerHTML =
    '<div class="ynv-top"><div class="ynv-w">' +
      '<a href="https://www.yonsei.ac.kr" target="_blank" rel="noopener">연세대학교</a>' +
      '<a href="https://engineering.yonsei.ac.kr" target="_blank" rel="noopener">공과대학</a>' +
      '<a href="https://me.yonsei.ac.kr" target="_blank" rel="noopener">기계공학부 현행 홈</a>' +
      '<div class="ynv-lang" role="group" aria-label="언어 선택">' +
        '<button type="button" id="ynvKo" class="on">한국어</button>' +
        '<button type="button" id="ynvEn">ENG</button></div>' +
    '</div></div>' +
    '<header class="ynv-hdr"><div class="ynv-w">' + brand +
      '<nav class="ynv-menu" aria-label="주메뉴">' + menuHtml + '</nav>' +
      '<button class="ynv-burger" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="ynvOvl"><span></span><span></span><span></span></button>' +
    '</div></header>';

  /* ── 하위페이지 서브내비 + breadcrumb 링크화 (섹션 페이지 공용) ── */
  function buildSubnav() {
    if (!curKey) return;
    var m = null; MENU.forEach(function (x) { if (x.key === curKey) m = x; });
    if (!m) return;
    var bc = document.querySelector('.bc');
    function setBreadcrumb(tabLabel) {
      if (!bc) return;
      var html = '<a class="bc-home" href="H-academic.html">홈</a> <span aria-hidden="true">›</span> ' +
        '<a class="bc-cur" href="' + m.h + '">' + esc(m.t) + '</a>';
      if (tabLabel) html += ' <span aria-hidden="true">›</span> <span class="bc-tab">' + esc(tabLabel) + '</span>';
      bc.innerHTML = html;
    }
    setBreadcrumb(null);
    /* 탭 바 — 하위 2개 이상일 때만(구성원 포함, 이제 2개라 표시) */
    if (!m.sub || m.sub.length < 2) return;
    var phero = document.querySelector('.phero');
    if (!phero) return;
    document.body.classList.add('has-ysub');
    var bar = document.createElement('nav');
    bar.className = 'ysub'; bar.setAttribute('role', 'tablist'); bar.setAttribute('aria-label', m.t + ' 하위 메뉴');
    bar.innerHTML = '<div class="ysub-w">' + m.sub.map(function (s, i) {
      return '<button type="button" role="tab" class="ysub-tab" data-i="' + i + '">' + esc(s[0]) + '</button>';
    }).join('') + '</div>';
    phero.parentNode.insertBefore(bar, phero.nextSibling);

    /* sticky top = 흰 헤더 높이(유틸바 접힘 후 nav 높이) 동적 */
    var hdr = nav.querySelector('.ynv-hdr');
    function fitTop() { if (hdr) { var h = Math.round(hdr.getBoundingClientRect().height); if (h > 20) bar.style.top = h + 'px'; } }
    fitTop(); addEventListener('resize', fitTop); addEventListener('load', fitTop);

    /* 각 탭이 제어하는 섹션(managed = 어느 탭이든 제어하는 모든 섹션). 비관리 콘텐츠(히어로·CTA)는 항상 표시 */
    var tabs = [].slice.call(bar.querySelectorAll('.ysub-tab'));
    var managed = [];
    m.sub.forEach(function (s) { (s[2] || []).forEach(function (id) { var el = document.getElementById(id); if (el && managed.indexOf(el) < 0) managed.push(el); }); });
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(idx, doScroll) {
      var s = m.sub[idx]; if (!s) return;
      var ids = s[2] || [];
      /* 활성 탭 섹션만 노출, 다른 탭 섹션 숨김 — '각 하위 메뉴 = 각 탭' 뷰 분리 */
      managed.forEach(function (el) { el.classList.toggle('ysub-hide', ids.indexOf(el.id) < 0); });
      tabs.forEach(function (t, i) { t.classList.toggle('cur', i === idx); t.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
      setBreadcrumb(s[0]);
      try { history.replaceState(null, '', '#' + (s[1].split('#')[1] || '')); } catch (_) {}
      if (doScroll) {
        /* 형제 탭 클릭 — 탭 바가 화면 맨 위(헤더 바로 아래)에 붙도록 부드럽게 이동 */
        var y = bar.getBoundingClientRect().top + (pageYOffset || 0) - Math.round(hdr ? hdr.getBoundingClientRect().height : 62);
        try { scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); } catch (_) { scrollTo(0, y); }
        /* 새로 보이는 뷰의 글자 등장 애니메이션(.ys-view-in — transition.css) */
        if (!reduce) managed.forEach(function (el) {
          if (ids.indexOf(el.id) >= 0) { el.classList.remove('ys-view-in'); void el.offsetWidth; el.classList.add('ys-view-in'); }
        });
      }
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(i, true); }); });

    /* 초기 탭 = 해시 매칭 or 첫 탭 */
    var initial = 0, hash = (location.hash || '').slice(1), isTabHash = false;
    if (hash) m.sub.forEach(function (s, i) { if ((s[2] || []).indexOf(hash) >= 0 || s[1].split('#')[1] === hash) { initial = i; isTabHash = true; } });
    show(initial, false);

    /* 메뉴로 페이지에 들어올 때(탭 해시)는 앵커 위치가 아니라 맨 위(히어로 화면)에서 시작.
       탭이 아닌 깊은 앵커(연구실 id 등)는 기존 스크롤 유지 */
    if (isTabHash) {
      var toTop = function () { try { scrollTo({ top: 0, behavior: 'instant' }); } catch (_) { scrollTo(0, 0); } };
      toTop();
      addEventListener('load', function () { setTimeout(toTop, 0); });
      setTimeout(toTop, 120);
    }

    /* 같은 페이지의 탭 해시 링크(드롭다운·푸터·모바일 메뉴) — 리로드 없이 탭 전환 + 애니메이션 */
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank') return;
      var href = a.getAttribute('href') || '';
      var hi = href.indexOf('#'); if (hi < 0) return;
      var page = href.slice(0, hi).split('?')[0];
      if (page && page.toLowerCase() !== path) return;   /* 다른 페이지는 그대로(페이지 전환 담당) */
      var h = href.slice(hi + 1), idx = -1;
      m.sub.forEach(function (s, i) { if ((s[2] || []).indexOf(h) >= 0 || s[1].split('#')[1] === h) idx = i; });
      if (idx < 0) return;
      e.preventDefault();
      try { history.replaceState(null, '', '#' + h); } catch (_) {}
      show(idx, true);
    });
  }

  /* ── 사이트맵 정보 푸터 주입(파란 CTA·간이 푸터 제거 후 교체) ── */
  function buildFooter() {
    [].forEach.call(document.querySelectorAll('.cta'), function (el) { el.parentNode && el.parentNode.removeChild(el); });
    [].forEach.call(document.querySelectorAll('footer'), function (el) { if (!el.classList.contains('yft')) el.parentNode && el.parentNode.removeChild(el); });
    if (document.querySelector('footer.yft')) return;
    var cols = MENU.map(function (m) {
      var items = m.sub.map(function (s) { return '<li><a href="' + s[1] + '">' + esc(s[0]) + '</a></li>'; }).join('');
      return '<div class="yft-col"><a class="yft-h" href="' + m.h + '">' + esc(m.t) + '</a><ul>' + items + '</ul></div>';
    }).join('');
    var ft = document.createElement('footer');
    ft.className = 'yft'; ft.setAttribute('role', 'contentinfo');
    ft.innerHTML =
      '<div class="yft-w">' +
        '<div class="yft-brand">' +
          '<a class="yft-logo" href="H-academic.html">연세대학교 기계공학부<span>School of Mechanical Engineering</span></a>' +
          '<p class="yft-addr">(03722) 서울특별시 서대문구 연세로 50<br>연세대학교 공과대학 제3공학관</p>' +
          '<p class="yft-tel">대표전화 02-2123-4426 (학부) · 02-2123-2810 (대학원)</p>' +
          '<div class="yft-ext">' +
            '<a href="https://www.yonsei.ac.kr" target="_blank" rel="noopener">연세대학교 ↗</a>' +
            '<a href="https://engineering.yonsei.ac.kr" target="_blank" rel="noopener">공과대학 ↗</a>' +
            '<a href="https://me.yonsei.ac.kr" target="_blank" rel="noopener">현행 홈 ↗</a>' +
            '<a href="../admin/index.html">관리자</a>' +
          '</div>' +
        '</div>' +
        '<nav class="yft-cols" aria-label="사이트맵">' + cols + '</nav>' +
      '</div>' +
      '<div class="yft-base">© 2026 Yonsei University · School of Mechanical Engineering &nbsp;·&nbsp; 공모전 출품 시안(비공식)</div>';
    document.body.appendChild(ft);
  }

  function mount() {
    var old = document.querySelector('.hud-top'); if (old) old.remove();
    var ph = document.querySelector('.ynav-ph'); if (ph) ph.remove();
    document.body.insertBefore(nav, document.body.firstChild);
    buildSubnav();
    buildFooter();

    /* 스크롤 시 유틸바 접힘 */
    var min = false;
    addEventListener('scroll', function () {
      var m = (pageYOffset || 0) > 40;
      if (m !== min) { min = m; nav.classList.toggle('min', m); }
    }, { passive: true });

    /* 한/영 토글 — 서브페이지는 선호도만 저장(홈에서 반영). 시각 상태 동기화 */
    var ko = nav.querySelector('#ynvKo'), en = nav.querySelector('#ynvEn');
    function setLang(l) {
      try { localStorage.setItem('ysme-lang', l); } catch (e) {}
      if (ko) ko.classList.toggle('on', l === 'ko');
      if (en) en.classList.toggle('on', l === 'en');
    }
    var stored = 'ko';
    try { stored = localStorage.getItem('ysme-lang') === 'en' ? 'en' : 'ko'; } catch (e) {}
    setLang(stored);
    if (ko) ko.addEventListener('click', function () { setLang('ko'); });
    if (en) en.addEventListener('click', function () { setLang('en'); });

    /* 맨 위로 버튼 */
    var topBtn = document.createElement('button');
    topBtn.type = 'button'; topBtn.className = 'ytop'; topBtn.setAttribute('aria-label', '맨 위로');
    topBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(topBtn);
    topBtn.addEventListener('click', function () {
      var smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    });
    var topVis = false;
    addEventListener('scroll', function () {
      var s = (pageYOffset || 0) > 400;
      if (s !== topVis) { topVis = s; topBtn.classList.toggle('show', s); }
    }, { passive: true });

    /* 모바일 오버레이 */
    var ovl = document.createElement('div');
    ovl.className = 'ynv-ovl'; ovl.id = 'ynvOvl';
    ovl.setAttribute('role', 'dialog'); ovl.setAttribute('aria-modal', 'true'); ovl.setAttribute('aria-label', '모바일 메뉴');
    ovl.innerHTML =
      '<div class="ynv-ovl-head">' + brand +
        '<button class="ynv-ovl-close" type="button" aria-label="메뉴 닫기">✕</button></div>' +
      '<nav class="ynv-ovl-body" aria-label="모바일 주메뉴">' +
        MENU.map(function (m) {
          var subs = m.sub.map(function (s) { return '<a class="ynv-ovl-sub" href="' + s[1] + '">' + esc(s[0]) + '</a>'; }).join('');
          return '<a class="ynv-ovl-top" href="' + m.h + '">' + esc(m.t) + '</a>' + subs;
        }).join('') + '</nav>';
    document.body.appendChild(ovl);
    var burger = nav.querySelector('.ynv-burger');
    var ovlClose = ovl.querySelector('.ynv-ovl-close');
    var prevOverflow = '';
    function openOvl() {
      if (ovl.classList.contains('open')) return;
      ovl.classList.add('open'); burger.setAttribute('aria-expanded', 'true');
      prevOverflow = document.body.style.overflow || ''; document.body.style.overflow = 'hidden';
      var first = ovl.querySelector('.ynv-ovl-body a'); if (first) first.focus();
    }
    function closeOvl() {
      if (!ovl.classList.contains('open')) return;
      ovl.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = prevOverflow; burger.focus();
    }
    if (burger) burger.addEventListener('click', function () { ovl.classList.contains('open') ? closeOvl() : openOvl(); });
    if (ovlClose) ovlClose.addEventListener('click', closeOvl);
    ovl.addEventListener('click', function (e) { var a = e.target && e.target.closest ? e.target.closest('a') : null; if (a) closeOvl(); });
    addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.key === 'Esc') && ovl.classList.contains('open')) closeOvl(); });
    addEventListener('resize', function () { if (innerWidth > 920) closeOvl(); });

    /* 앵커(#섹션) 진입 — JS 렌더 섹션 대응 재스크롤 */
    if (location.hash && location.hash.length > 1 && !document.body.classList.contains('has-ysub')) {
      var reScroll = function () {
        var t = null;
        try { t = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
        if (t) {
          var y = t.getBoundingClientRect().top + (pageYOffset || document.documentElement.scrollTop) - (document.body.classList.contains('has-ysub') ? 118 : 80);
          try { scrollTo({ top: y, behavior: 'instant' }); } catch (e) { scrollTo(0, y); }
        }
      };
      [120, 350, 700].forEach(function (d) { setTimeout(reScroll, d); });
      addEventListener('load', function () { setTimeout(reScroll, 100); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();

/* ═══════════════════════════════════════════════════════════════
   런타임 로더 — 위 헤더 코드와 무관한 부착 블록. (STUDIO_SPEC 1·9절)
     (1) 방문자용 한/영 적용 런타임(assets/i18n.js) — 항상 붙인다. 파일이 없으면 조용히 넘어간다.
     (2) 관리자 스튜디오(assets/studio/boot.js) — 세션 또는 ?studio=1 플래그가 있을 때만 붙인다.
         플래그가 없으면 **요청조차 하지 않는다**(방문자 경험 무영향이 불변식이다).
   두 블록 모두 try/catch 로 감싸 실패해도 사이트가 죽지 않게 한다.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* nav.js 자신의 위치에서 assets/ 디렉터리를 구한다(?v=38 같은 버전 쿼리는 그대로 물려준다) */
  function here() {
    var s = document.currentScript, src = s && s.src ? s.src : '';
    if (!src) return { dir: 'assets/', ver: '' };
    var q = src.indexOf('?');
    return {
      dir: (q < 0 ? src : src.slice(0, q)).replace(/[^/]*$/, ''),
      ver: q < 0 ? '' : src.slice(q)
    };
  }
  var H = here();

  function add(file, mark) {
    if (document.querySelector('script[' + mark + ']')) return;
    var el = document.createElement('script');
    el.setAttribute(mark, '');
    el.setAttribute('data-ys-ui', '');   // 편집 도구가 이 노드를 편집 대상으로 오인하지 않게
    el.src = H.dir + file + H.ver;
    el.defer = true;
    el.async = false;                 // 삽입 순서대로 실행
    el.onerror = function () {};      // 파일이 없어도 사이트는 그대로 동작한다
    (document.head || document.documentElement).appendChild(el);
  }

  /* (1) 방문자용 i18n 런타임 */
  try { add('i18n.js', 'data-ysme-i18n'); } catch (e) {}

  /* (1-b) 몰입 구역 커서 — 스스로 환경을 보고 안 되면 아무것도 만들지 않는다 */
  try { add('cursor.js', 'data-ysme-cursor'); } catch (e1b) {}

  /* (2) 스튜디오 로더 */
  try {
    var on = false;
    try { on = !!sessionStorage.getItem('ysme-studio'); } catch (e2) {}
    if (!on && /[?&]studio=1(&|$)/.test(location.search)) on = true;
    if (on) add('studio/boot.js', 'data-ysme-studio');
  } catch (e3) {}
})();
