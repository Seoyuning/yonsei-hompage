/* ═══════════════════════════════════════════════════════════════
   서브페이지(G) 공용 상단 헤더 — 메인(H-academic)과 동일한 바로 통일.
   구성: [다크 유틸바] 외부 링크 + 한/영 토글  ·  [흰 헤더] 씰 브랜드 + 드롭다운 메뉴.
   폰트는 Pretendard 단일(모노 제거). 고정 헤더, 스크롤 시 유틸바 접힘.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var NAVY = '#1a3d75', NAVYD = '#12294f', INK = '#0f1b30',
      PAPER = '#f1f2f5', LINE = '#e2ddd2', DIM = '#8b96a9', MUTED = '#5e6b82';
  var KR = '"Apple SD Gothic Neo","Pretendard Variable","Pretendard",system-ui,sans-serif';
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
    /* 등장 계단 — 예전엔 5번까지만 지연이 적혀 있었다. 소식은 하위가 7개라
       6·7번(자료실·취업 정보)만 지연 0이 되어 위 항목들보다 먼저 떠올랐다.
       n+8 로 나머지를 한 번에 받고, 지연은 '열릴 때'만 준다 —
       닫힐 때까지 지연이 남으면 아래 항목이 늦게까지 남아 어색하다. */
    '.ynv-i:hover .ynv-d a,.ynv-i:focus-within .ynv-d a{transition-delay:var(--dd,0s)}',
    '.ynv-d a:nth-child(2){--dd:.04s}.ynv-d a:nth-child(3){--dd:.08s}',
    '.ynv-d a:nth-child(4){--dd:.12s}.ynv-d a:nth-child(5){--dd:.16s}',
    '.ynv-d a:nth-child(6){--dd:.2s}.ynv-d a:nth-child(7){--dd:.24s}',
    '.ynv-d a:nth-child(n+8){--dd:.28s}',
    '.ynv-d a:hover{color:' + NAVY + ';background:' + PAPER + ';padding-left:1.6rem}',
    '[id]{scroll-margin-top:5rem}',
    'body.has-ysub [id]{scroll-margin-top:var(--ys-stick,7.6rem)}',
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
    /* 소제목 바로가기 바 — 탭 바 바로 아래. 탭 바보다 한 단계 낮은 무게로 둔다 */
    '.yjump{position:sticky;top:7.5rem;z-index:37;background:#fbfbfc;border-bottom:1px solid ' + LINE + '}',
    '.yjump-w{max-width:72rem;margin:0 auto;padding:.5rem clamp(1.1rem,4vw,2rem);' +
      'display:flex;gap:.15rem;align-items:center;overflow-x:auto;scrollbar-width:none}',
    '.yjump-w::-webkit-scrollbar{display:none}',
    '.yjump a{flex:0 0 auto;font-family:' + KR + ';font-size:.86rem;font-weight:600;color:' + MUTED + ';' +
      'text-decoration:none;padding:.42rem .7rem;border-radius:2px;white-space:nowrap;transition:color .15s,background .15s}',
    '.yjump a:hover{color:' + NAVY + ';background:' + PAPER + '}',
    '@media(max-width:920px){.yjump{top:6.6rem}}',
    '@media(max-width:640px){' +
      '.yjump{overflow:hidden}' +
      '.yjump::after{content:"";position:absolute;top:0;right:0;bottom:0;width:2rem;pointer-events:none;' +
        'background:linear-gradient(90deg,rgba(251,251,252,0),#fbfbfc 72%)}' +
      '.yjump-w{padding:.4rem .9rem;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}' +
      '.yjump a{font-size:.82rem;padding:.5rem .6rem;min-height:2.5rem;display:flex;align-items:center}' +
    '}',
    '@media(max-width:920px){.ysub{top:3.7rem}.ysub-tab{font-size:.92rem;padding:.85rem .9rem .7rem}}',
    /* 휴대폰 — 탭이 화면을 넘치므로 옆으로 밀리는 걸 눈에 보이게(오른쪽 페이드) + 손가락 크기 유지 */
    '@media(max-width:640px){' +
      '.ysub{overflow:hidden}' +   /* sticky 유지 — 위치는 그대로, 페이드만 얹는다 */
      '.ysub::after{content:"";position:absolute;top:0;right:0;bottom:0;width:2.2rem;pointer-events:none;' +
        'background:linear-gradient(90deg,rgba(255,255,255,0),#fff 72%)}' +
      '.ysub-w{padding:0 .9rem;scroll-padding-inline:.9rem;scroll-snap-type:x proximity;' +
        '-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}' +
      '.ysub-tab{scroll-snap-align:start;font-size:.9rem;padding:.8rem .72rem .62rem;min-height:2.9rem}' +
    '}',
    '@media(prefers-reduced-motion:reduce){.ysub-tab{transition:color .18s,border-color .18s,background .18s}}',

    /* ── 기본 등장 애니메이션 ──
       한화 에어로스페이스 미디어 라이브러리의 모션을 참고했다. 그쪽 구현은
       GSAP + ScrollTrigger + Locomotive(스크롤 하이재킹) + SplitText 조합인데,
       그 조합 자체는 우리 사이트에 못 넣는다:
         · Locomotive 는 스크롤 컨테이너에 transform 을 걸어 position:sticky 를 죽인다.
           우리는 헤더 · 형제바(.ysub) · 바로가기바(.yjump) 가 전부 sticky 다.
         · 라이브러리 4종이면 200KB 가 넘는다. 이 사이트는 의존성 0 · 빌드 0 이 원칙이다.
       그래서 '모션 언어'만 가져왔다 — 아래에서 위로 떠오르며 서서히 나타나기,
       Quart ease-out(cubic-bezier(.25,1,.5,1)), 형제끼리 0.13초 계단식.
       구현은 IntersectionObserver + CSS transition 뿐이다.
       숨김 상태는 반드시 html.ys-rv 아래에서만 걸린다 — JS 가 죽거나 모션 축소·
       숨은 탭이면 클래스가 안 붙고, 그러면 처음부터 그냥 다 보인다(내용 유실 없음). */
    'html.ys-rv [data-rv]{opacity:0;transform:translateY(2.6rem);' +
      'transition:opacity .95s cubic-bezier(.22,1,.36,1),transform .95s cubic-bezier(.22,1,.36,1);' +
      'transition-delay:var(--rv-d,0s)}',
    'html.ys-rv [data-rv].rv-in{opacity:1;transform:none}',
    /* 제목을 품은 블록은 덜 움직인다 — 제목이 아래의 제 몫 움직임을 갖기 때문에
       둘이 겹치면 과해진다. 블록은 살짝만 뜨고, 시선은 제목이 끈다. */
    'html.ys-rv [data-rv="s"]{transform:translateY(1rem)}',
    /* ── 대제목 ──
       예전엔 제목이 머리 블록에 실려 다 같이 2.6rem 올라올 뿐, 제 몫의 움직임이 없었다.
       위에서 아래로 걷히는 가림막(clip-path) + 살짝 밀려 올라오기로 제목만 따로 세운다.
       (아래 여백 보정은 CSS 로 하면 원래 margin 을 덮어써 배치가 밀린다 — JS 에서 잰다) */
    'html.ys-rv [data-rvt]:not([data-rvt="w"]){display:block;' +
      'clip-path:inset(0 0 100% 0);transform:translateY(.34em);' +
      'transition:clip-path 1.05s cubic-bezier(.22,1,.36,1),transform 1.05s cubic-bezier(.22,1,.36,1);' +
      'transition-delay:calc(var(--rv-d,0s) + .1s)}',
    'html.ys-rv .rv-in [data-rvt]:not([data-rvt="w"]),html.ys-rv [data-rvt]:not([data-rvt="w"]).rv-in{clip-path:inset(0 0 0 0);transform:none}',
    /* 단어 단위 리빌 — 제목을 단어마다 상자에 넣고 아래에서 하나씩 밀어 올린다.
       가림막(clip-path) 하나로 걷는 것보다 글이 「쓰이는」 느낌이 난다. */
    'html.ys-rv [data-rvt="w"] .rvw{display:inline-block;overflow:hidden;vertical-align:top;' +
      'padding-bottom:.14em;margin-bottom:-.14em}',
    'html.ys-rv [data-rvt="w"] .rvw > i{display:inline-block;font-style:normal;transform:translateY(115%);' +
      'transition:transform .92s cubic-bezier(.22,1,.36,1);' +
      'transition-delay:calc(var(--rv-d,0s) + var(--w,0s))}',
    'html.ys-rv .rv-in [data-rvt="w"] .rvw > i,html.ys-rv [data-rvt="w"].rv-in .rvw > i{transform:none}',
    '@media(prefers-reduced-motion:reduce){html.ys-rv [data-rv]{opacity:1;transform:none;transition:none}' +
      'html.ys-rv [data-rvt]{clip-path:none;transform:none;transition:none}}',
    '@media print{html.ys-rv [data-rv]{opacity:1;transform:none;transition:none}' +
      'html.ys-rv [data-rvt]{clip-path:none;transform:none;transition:none}}',
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
    '.ynv-ovl-body{display:flex;flex-direction:column;' +
      'padding:.6rem clamp(1.2rem,.6rem + 2vw,2.6rem) calc(3rem + env(safe-area-inset-bottom))}',
    '.ynv-ovl-top{display:block;font-family:' + KR + ';font-size:1.12rem;font-weight:800;color:' + NAVY + ';' +
      'padding:.85rem 0 .4rem;margin-top:.5rem;border-bottom:1px solid rgba(0,0,0,.06)}',
    /* 휴대폰 주내비라 손가락 크기(≈44px)로 — 줄 간격이 곧 탭 영역이다 */
    '.ynv-ovl-sub{display:block;font-family:' + KR + ';font-size:.95rem;color:' + MUTED + ';' +
      'padding:.66rem 0 .66rem 1.1rem;text-decoration:none}',
    '@media(max-width:920px){.ynv-menu{display:none}.ynv-burger{display:inline-flex}}',
    '@media(min-width:921px){.ynv-ovl{display:none!important}}',
    /* 휴대폰 — 유틸 바가 두 줄로 접히고 링크가 손가락보다 작았다 */
    '@media(max-width:640px){' +
      '.ynv-top{max-height:2.6rem}' +
      '.ynv-top .ynv-w{gap:.85rem;padding:0 .9rem;flex-wrap:nowrap;white-space:nowrap}' +
      '.ynv-top a{display:inline-flex;align-items:center;min-height:2.4rem;font-size:.72rem}' +
      '.ynv-lang{margin-left:.15rem}' +
      '.ynv-lang button{padding:.3rem .6rem;min-height:1.9rem}' +
      '.ynv-hdr .ynv-w{gap:.8rem;padding:.6rem .9rem}' +
      '.ynv-brand img{height:2rem}' +
      '.ynv-brand .bko{font-size:.95rem}' +
      '.ynv-brand .ben{font-size:.55rem;letter-spacing:.1em}' +
      '.ytop{right:.9rem;bottom:calc(.9rem + env(safe-area-inset-bottom));width:2.7rem;height:2.7rem}' +
    '}',
    /* 아주 좁은 화면(360 이하) — 영문 병기를 접어 브랜드 한 줄 유지 */
    '@media(max-width:360px){.ynv-brand .ben{display:none}.ynv-top .ynv-w{gap:.6rem}}',
    /* 서브페이지 히어로 윗여백은 이 고정 헤더를 비키려고 둔 값이라 여기서 맞춘다.
       (페이지 인라인 CSS 뒤에 주입되므로 이 규칙이 이긴다)
       휴대폰 헤더는 ~94px인데 데스크톱 기준 152px이 그대로 걸려 제목 위가 텅 비었다 */
    '@media(max-width:640px){' +
      '.phero .phero-in{padding-top:7.6rem;padding-bottom:2.1rem}' +
      '.phero{min-height:0}' +
      '.phero .phero-lead{font-size:.92rem;line-height:1.68}' +
    '}',
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
    '@media(max-width:720px){.yft-w{grid-template-columns:1fr;gap:2.4rem}}',
    /* 휴대폰 — 사이트맵이 길어 꼬리가 되므로 두 칸으로 촘촘히, 링크는 눌릴 만큼 */
    '@media(max-width:640px){' +
      '.yft-w{padding:2.2rem .9rem 1.6rem;gap:1.9rem}' +
      '.yft-cols{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 1rem}' +
      '.yft-h{margin-bottom:.7rem;font-size:.88rem}' +
      '.yft-col ul{gap:.15rem}' +
      '.yft-col li a{display:block;padding:.42rem 0;font-size:.8rem}' +
      '.yft-ext a{padding:.5rem .85rem}' +
      '.yft-base{padding:1.1rem .9rem calc(1.1rem + env(safe-area-inset-bottom));line-height:1.7}' +
    '}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ── 2. 메뉴 정의 (메인 H-academic 순서·라벨과 동일) ── */
  var MENU = [
    { t: '학부소개', h: 'G-about.html', key: 'about', sub: [['학부 소개', 'G-about.html#intro', ['intro']], ['교육목표', 'G-about.html#vision', ['vision']], ['조직 · 행정', 'G-about.html#organization', ['organization']], ['주요 연혁', 'G-about.html#history', ['history']], ['연락처 · 오시는 길', 'G-about.html#location', ['location']]] },
    { t: '구성원', h: 'G-people.html', key: 'people', sub: [['교수진', 'G-people.html#faculty', ['faculty', 'dir']], ['교직원', 'G-people.html#staff', ['staff']], ['동문', 'G-people.html#alumni', ['alumni']]] },
    { t: '연구', h: 'G-research.html', key: 'research', sub: [['연구 비전', 'G-research.html#vision', ['vision']], ['연구 분야', 'G-research.html#fields', ['fields', 'fieldsDetail']], ['연구실 목록', 'G-research.html#clusters', ['clusters']], ['연구실 홍보영상', 'G-research.html#labvideos', ['labvideos']]] },
    { t: '학사', h: 'G-academics.html', key: 'academics', sub: [['교육과정 개관', 'G-academics.html#curriculum', ['curriculum', 'requirements', 'abeek']], ['이수 체계도', 'G-academics.html#roadmap', ['roadmap']], ['졸업 요건', 'G-academics.html#graduation', ['graduation']], ['전공 교과', 'G-academics.html#courses', ['mechanics', 'courses']], ['동아리·학생활동', 'G-academics.html#clubs', ['clubs']]] },
    { t: '대학원', h: 'G-graduate.html', key: 'graduate', sub: [['입학 안내', 'G-graduate.html#grad-admission', ['grad-admission']], ['졸업 요건', 'G-graduate.html#grad-req', ['grad-req']], ['교과목 소개', 'G-graduate.html#grad-courses', ['grad-courses']], ['대학원 연구실', 'G-graduate.html#grad-labs', ['grad-labs']], ['BK21 FOUR', 'G-graduate.html#bk21', ['bk21']]] },
    { t: '소식', h: 'G-news.html', key: 'news', sub: [['학부 공지', 'G-news.html#notice-ug', ['notice-ug']], ['대학원 공지', 'G-news.html#notice-grad', ['notice-grad']], ['뉴스 · 연구성과', 'G-news.html#hi', ['hi']], ['세미나 · 행사', 'G-news.html#sched', ['sched']], ['학위논문심사', 'G-news.html#thesis', ['thesis']], ['자료실', 'G-news.html#archive', ['archive']], ['취업 정보', 'G-news.html#jobs', ['jobs']]] },
    { t: '입학', h: 'G-admissions.html', key: 'admissions', sub: [['학부 입학', 'G-admissions.html#undergraduate', ['undergraduate']], ['대학원 진학', 'G-admissions.html#graduate', ['graduate']], ['장학 안내', 'G-admissions.html#scholarships', ['scholarships']], ['자주 묻는 질문', 'G-admissions.html#faq', ['faq']]] }
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
        '<button type="button" id="ynvKo" class="on" data-no-i18n>한국어</button>' +
        '<button type="button" id="ynvEn" data-no-i18n>ENG</button></div>' +
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
      return '<button type="button" role="tab" class="ysub-tab" data-i="' + i + '"' +
        ' data-tab="' + esc((s[2] && s[2][0]) || '') + '"' +
        /* 이 탭이 담당하는 섹션 id 전부 — 다른 탭에 숨은 앵커로 갈 때 어느 탭을 켜야 하는지 찾는 열쇠 */
        ' data-tabids="' + esc((s[2] || []).join(' ')) + '">' + esc(s[0]) + '</button>';
    }).join('') + '</div>';
    phero.parentNode.insertBefore(bar, phero.nextSibling);

    /* sticky top = 흰 헤더 높이(유틸바 접힘 후 nav 높이) 동적 */
    var hdr = nav.querySelector('.ynv-hdr');
    /* sticky 층을 실제 높이로 쌓는다: 헤더 → 탭 바 → 소제목 바로가기 바.
       CSS 로 고정값을 주면 글자 크기 조절·줄바꿈에 어긋나므로 매번 재계산한다.
       앵커 이동 시 가려지지 않게 scroll-margin-top 도 같은 값으로 맞춘다. */
    function fitTop() {
      if (!hdr) return;
      var h = Math.round(hdr.getBoundingClientRect().height);
      if (h <= 20) return;
      bar.style.top = h + 'px';
      var barH = Math.round(bar.getBoundingClientRect().height);
      if (jump) jump.style.top = (h + barH) + 'px';
      var jumpH = jump ? Math.round(jump.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty('--ys-stick', (h + barH + jumpH + 12) + 'px');
      /* 페이지 쪽 sticky 요소(예: 교수진 필터바)가 이 바들 바로 아래에 붙도록 —
         --ys-stick 은 앵커 여백(+12)이 섞여 있어 sticky top 으로 쓰면 틈이 생긴다. */
      document.documentElement.style.setProperty('--ys-bars', (h + barH + jumpH) + 'px');
    }
    fitTop(); addEventListener('resize', fitTop); addEventListener('load', fitTop);

    /* 각 탭이 제어하는 섹션(managed = 어느 탭이든 제어하는 모든 섹션). 비관리 콘텐츠(히어로·CTA)는 항상 표시 */
    var tabs = [].slice.call(bar.querySelectorAll('.ysub-tab'));
    var managed = [];
    m.sub.forEach(function (s) { (s[2] || []).forEach(function (id) { var el = document.getElementById(id); if (el && managed.indexOf(el) < 0) managed.push(el); }); });
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* mode — 어디를 화면 맨 위로 올릴지. 누른 것이 무엇이냐에 따라 목적지가 다르다.
         'view' : 형제 탭 바 클릭. 히어로는 위로 넘기고 **그 탭 내용의 첫 줄**을 맨 위로.
                  (탭 바가 고정 헤더 바로 아래 붙는 위치 = 그 형제 페이지의 상단)
         'top'  : 상단 메뉴·드롭다운·푸터의 같은 페이지 링크. 그 페이지의 **히어로**부터.
         false  : 스크롤하지 않음(초기 렌더). */
    /* ── 소제목 바로가기 바 ──
       한 탭 안에 소제목이 여러 개인 화면(동문·교육목표 등)은 위아래로 길어서
       무엇이 들어 있는지 한눈에 안 보인다. 활성 탭 안의 소제목(h2/h3 중 id 가 있는 것)을
       모아 탭 바 바로 아래에 바로가기 줄로 깐다. 소제목이 2개 미만이면 아예 만들지 않는다. */
    var jump = null, jumpSeq = 0;
    function buildJump(ids) {
      /* 어느 단계를 「중제목」으로 볼지는 탭마다 다르다.
           · 탭이 섹션 여러 개를 묶고 있으면  → 각 섹션의 제목(h2)이 중제목
             (전공 교과 = 4대 역학 / 학부 전공 교과. 그 안의 h3 는 과목 이름이라 너무 잘다)
           · 탭이 섹션 하나면            → 그 섹션 안의 h3 가 중제목
             (동문 = 동문 연혁 / 인터뷰 / 대외협력 / 발전기금)
         id 가 없으면 그 자리에서 만들어 붙여, 페이지 HTML 을 고치지 않아도 되게 한다. */
      var secs = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      var pick = [];
      if (secs.length > 1) {
        secs.forEach(function (sec) { var h = sec.querySelector('h2'); if (h) pick.push(h); });
      } else if (secs.length === 1) {
        /* 반복 컴포넌트(절차 단계 카드·목록 항목·아코디언) 안의 h3 는 중제목이 아니라
           카드 이름이다. 대학원 「입학 안내」의 01~04 단계가 그 예 — 바로가기로 세우면
           '모집요강 확인 · 지원서 접수 …' 처럼 절차가 목차인 척 돼서 오히려 헷갈린다. */
        pick = [].slice.call(secs[0].querySelectorAll('h3')).filter(function (h) {
          return !h.closest('.step, .steps, li, details, summary, .card, [class*="-card"]');
        });
      }
      var heads = [];
      pick.forEach(function (h) {
        if (h.closest('.ysub-hide')) return;
        /* 제목 안의 개수 배지(세미나<span class="cnt">20건</span>) 같은 장식은 라벨에서 뺀다 */
        var label = h.getAttribute('data-jump');
        if (!label) {
          var t = '';
          [].forEach.call(h.childNodes, function (n) {
            if (n.nodeType === 3) { t += n.nodeValue; return; }
            if (n.nodeType !== 1) return;
            if (n.classList.contains('cnt') || n.classList.contains('count')
                || n.getAttribute('aria-hidden') === 'true') return;
            t += n.textContent;
          });
          label = t;
        }
        label = label.replace(/\s+/g, ' ').trim();
        if (!label || label.length > 24) return;
        if (!h.id) h.id = 'yj-' + (++jumpSeq);
        heads.push({ id: h.id, label: label });
      });
      if (heads.length > 8) heads = [];   /* 너무 많으면 오히려 안 읽힌다 — 아예 만들지 않는다 */
      if (jump) { jump.remove(); jump = null; fitTop(); }
      if (heads.length < 2) return;
      jump = document.createElement('nav');
      jump.className = 'yjump';
      jump.setAttribute('aria-label', '이 화면의 소제목');
      jump.innerHTML = '<div class="yjump-w">' + heads.map(function (h) {
        return '<a href="#' + esc(h.id) + '">' + esc(h.label) + '</a>';
      }).join('') + '</div>';
      bar.parentNode.insertBefore(jump, bar.nextSibling);
      fitTop();
      jump.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (!a) return;
        e.preventDefault();
        if (window.ysRevealAll) window.ysRevealAll();   /* 위치를 재기 전에 transform 을 걷어낸다 */
        var t = document.getElementById(a.getAttribute('href').slice(1));
        if (!t) return;
        var off = (hdr ? hdr.getBoundingClientRect().height : 62) +
                  bar.getBoundingClientRect().height + jump.getBoundingClientRect().height + 12;
        var y = t.getBoundingClientRect().top + (pageYOffset || 0) - off;
        try { scrollTo({ top: Math.max(0, y), behavior: (reduce || document.hidden) ? 'instant' : 'smooth' }); }
        catch (_) { scrollTo(0, Math.max(0, y)); }
      });
    }

    function show(idx, mode) {
      var s = m.sub[idx]; if (!s) return;
      var ids = s[2] || [];
      /* 활성 탭 섹션만 노출, 다른 탭 섹션 숨김 — '각 하위 메뉴 = 각 탭' 뷰 분리 */
      managed.forEach(function (el) { el.classList.toggle('ysub-hide', ids.indexOf(el.id) < 0); });
      tabs.forEach(function (t, i) { t.classList.toggle('cur', i === idx); t.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
      setBreadcrumb(s[0]);
      buildJump(ids);
      try { history.replaceState(null, '', '#' + (s[1].split('#')[1] || '')); } catch (_) {}
      if (mode) {
        var y = 0;
        if (mode === 'view') {
          /* 탭 바를 헤더 바로 아래에 세워 그 아래부터 새 탭 내용이 시작되게 한다.
             바는 sticky 라 제 위치를 물어보면 '붙어 있는 자리'(늘 헤더 밑)를 답한다 —
             getBoundingClientRect 도 offsetTop 도 그렇다. 그 값으로 계산하면 아무리
             내려와 있어도 "움직일 필요 없음"이 나온다.
             그래서 sticky 가 아닌 바로 위 형제(=히어로)의 아랫변으로 제자리를 잡는다. */
          var prev = bar.previousElementSibling;
          var nat = prev
            ? prev.getBoundingClientRect().bottom + (pageYOffset || 0)
            : bar.getBoundingClientRect().top + (pageYOffset || 0);
          y = Math.round(nat) - Math.round(hdr ? hdr.getBoundingClientRect().height : 62);
          if (y < 0) y = 0;
        }
        /* 'auto'는 CSS scroll-behavior:smooth 에 덮이므로 즉시 이동은 'instant'로 강제
           (모션 축소 선호·숨은 탭에서는 부드러운 이동이 진행되지 않는다) */
        try { scrollTo({ top: y, behavior: (reduce || document.hidden) ? 'instant' : 'smooth' }); }
        catch (_) { scrollTo(0, y); }
        /* 새로 보이는 뷰의 글자 등장 애니메이션(.ys-view-in — transition.css) */
        if (!reduce) managed.forEach(function (el) {
          if (ids.indexOf(el.id) >= 0) { el.classList.remove('ys-view-in'); void el.offsetWidth; el.classList.add('ys-view-in'); }
        });
      }
    }
    /* 형제 탭 바 — 그 탭 내용의 상단으로 */
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(i, 'view'); }); });

    /* 초기 탭 = 해시 매칭 or 첫 탭.
       탭 해시는 각 페이지 head 스니펫이 앵커 점프 차단을 위해 미리 떼어 window.__ysTab 에 보관 */
    var initial = 0, hash = window.__ysTab || (location.hash || '').slice(1), isTabHash = false;
    if (hash) m.sub.forEach(function (s, i) { if ((s[2] || []).indexOf(hash) >= 0 || s[1].split('#')[1] === hash) { initial = i; isTabHash = true; } });

    /* 깊은 앵커 판정은 show() 를 부르기 **전에** 해 둔다.
       show() 가 replaceState 로 '#intro' 같은 탭 해시를 주소에 써 넣기 때문에,
       나중에 location.hash 를 읽으면 우리가 방금 쓴 값을 사용자가 준 앵커로 착각한다.
       그러면 최상위 메뉴로 들어온 진입에서 맨 위로 올리는 보정이 통째로 건너뛰어진다
       — "새로고침하면 히어로가 보이는데 메뉴를 누르면 안 보인다"가 정확히 이 증상이었다. */
    var rawHash = (location.hash || '').slice(1);
    var deepAnchor = !!rawHash && !isTabHash && !window.__ysTab;

    show(initial, false);

    /* 진입 지점은 **무엇을 눌러서 왔느냐**에 따라 다르다.
         · 최상위 메뉴 이름(해시 없음)  → 히어로부터. 그 메뉴의 첫 화면을 보여 준다
         · 드롭다운 하위 항목(탭 해시)  → 그 하위 뷰의 상단부터. 히어로는 건너뛴다
         · 깊은 앵커(#kang-keonwook)   → 브라우저에 맡긴다
       로드 직후 한 번으로는 다른 스크립트·이미지 로드에 밀릴 수 있어 세 번 보정한다. */
    function settle(fn) { fn(); addEventListener('load', function () { setTimeout(fn, 0); }); setTimeout(fn, 120); }
    var toTop = function () { try { scrollTo({ top: 0, behavior: 'instant' }); } catch (_) { scrollTo(0, 0); } };
    var toView = function () {
      var prev = bar.previousElementSibling;
      var nat = prev ? prev.getBoundingClientRect().bottom + (pageYOffset || 0)
                     : bar.getBoundingClientRect().top + (pageYOffset || 0);
      var y = Math.max(0, Math.round(nat) - Math.round(hdr ? hdr.getBoundingClientRect().height : 62));
      try { scrollTo({ top: y, behavior: 'instant' }); } catch (_) { scrollTo(0, y); }
    };
    if (!deepAnchor) settle(isTabHash ? toView : toTop);

    /* 같은 페이지를 가리키는 메뉴·드롭다운·푸터·모바일메뉴 링크 — 리로드 없이 처리한다.
       주의: 지금 URL 은 show() 가 replaceState 로 써 넣은 '#<탭>' 을 달고 있다.
       그래서 최상위 메뉴(예: 구성원 → "G-people.html", 해시 없음)를 누르면 브라우저가
       '해시만 다른 같은 문서'로 보고 **리로드도 스크롤도 하지 않는다** — 보고 있던 자리에
       그대로 머물러 "메뉴를 눌렀는데 히어로가 아니라 교수진이 맨 위"가 된다. 직접 처리한다. */
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank') return;
      var href = a.getAttribute('href') || '';
      if (!href || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;
      var hi = href.indexOf('#');
      var page = (hi < 0 ? href : href.slice(0, hi)).split('?')[0];
      if (!page || page.toLowerCase() !== path) return;  /* 다른 페이지는 그대로(페이지 전환 담당) */

      var h = hi < 0 ? '' : href.slice(hi + 1);
      var idx = 0;                                        /* 해시 없는 최상위 메뉴 = 첫 탭 */
      if (h) {
        idx = -1;
        m.sub.forEach(function (s, i) { if ((s[2] || []).indexOf(h) >= 0 || s[1].split('#')[1] === h) idx = i; });
        if (idx < 0) return;                              /* 탭이 아닌 깊은 앵커는 브라우저에 맡긴다 */
      }
      e.preventDefault();
      if (h) { try { history.replaceState(null, '', '#' + h); } catch (_) {} }
      /* 최상위 메뉴 이름(해시 없음)은 히어로부터, 드롭다운 하위 항목(해시 있음)은 그 뷰 상단부터.
         다른 페이지에서 같은 링크를 눌러 들어왔을 때와 착지 지점이 같아야 한다. */
      show(idx, h ? 'view' : 'top');
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

  /* ── 기본 등장 애니메이션 (CSS 는 위 스타일 배열의 html.ys-rv 규칙) ──
     대상은 페이지를 고치지 않고 런타임에 고른다: main 안 각 섹션의 직계 블록들.
     그 블록이 그리드/플렉스이고 자식이 2~12개면 블록 대신 자식들을 골라
     카드가 하나씩 계단식으로 올라오게 한다.
     건드리면 안 되는 것 — transform 은 자손 sticky 의 기준 상자를 바꿔 sticky 를
     죽인다. 그래서 sticky 요소를 품은 블록은 통째로 건너뛴다.
     히어로도 제외한다: 탭 스크롤 위치를 히어로의 getBoundingClientRect() 로 재는데,
     transform 이 그 값을 흔들면 착지 위치가 어긋난다. */
  function setupReveal() {
    var root = document.documentElement;
    /* 숨은 탭(자동화·백그라운드)에서는 IntersectionObserver 가 안 돈다 →
       아예 시작하지 않는다. 클래스가 안 붙으니 처음부터 다 보이는 상태 그대로다. */
    if (!('IntersectionObserver' in window)) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;
    try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}

    var STICKY = '.ysub, .yjump, .filterbar, .crs-block-head, .cl-head';
    var main = document.querySelector('main');
    if (!main) return;

    var picks = [];
    [].forEach.call(main.children, function (sec) {
      if (sec.tagName !== 'SECTION' && sec.tagName !== 'DIV') return;
      [].forEach.call(sec.children, function (block, bi) {
        if (block.querySelector && block.querySelector(STICKY)) return;   /* sticky 품은 블록은 손대지 않는다 */
        if (block.matches && block.matches(STICKY)) return;
        var kids = block.children ? [].filter.call(block.children, function (k) { return k.nodeType === 1; }) : [];
        var disp = '';
        try { disp = getComputedStyle(block).display; } catch (e) {}
        var isGrid = disp.indexOf('grid') >= 0 || disp.indexOf('flex') >= 0;
        if (isGrid && kids.length >= 2 && kids.length <= 12) {
          kids.forEach(function (k, i) { if (!k.querySelector || !k.querySelector(STICKY)) picks.push([k, i]); });
        } else {
          picks.push([block, bi]);
        }
      });
    });
    if (!picks.length) return;

    /* 대제목 — 블록에 실려 같이 뜨기만 하던 것을, 제 몫의 움직임을 갖게 한다.
       h1(히어로)은 transition.css 가 로드 즉시 재생하므로 여기서는 제외한다. */
    var TITLE = '.sec-title, .staff-head > h2, .al-head > h2, .vision-tag';
    root.classList.add('ys-rv');
    picks.forEach(function (pair) {
      var el = pair[0], i = pair[1];
      var hasTitle = el.querySelector && el.querySelector(TITLE);
      el.setAttribute('data-rv', hasTitle ? 's' : '');
      if (i > 0) el.style.setProperty('--rv-d', Math.min(i, 5) * 0.17 + 's');
      if (hasTitle) [].forEach.call(el.querySelectorAll(TITLE), function (t) {
        /* 단어 단위로 쪼갠다 — <br> 같은 태그는 그대로 두고 글자 마디만 상자에 넣는다.
           실패하면 아래의 가림막 방식으로 조용히 남는다. */
        var split = false;
        try {
          var kids = [].slice.call(t.childNodes), out = [], wi = 0;
          kids.forEach(function (n) {
            if (n.nodeType === 3) {
              n.nodeValue.split(/(\s+)/).forEach(function (w) {
                if (!w) return;
                if (!w.trim()) { out.push(document.createTextNode(w)); return; }
                var box = document.createElement('span'); box.className = 'rvw';
                var inn = document.createElement('i'); inn.textContent = w;
                inn.style.setProperty('--w', (Math.min(wi, 9) * 0.055) + 's');
                box.appendChild(inn); out.push(box); wi++;
              });
            } else out.push(n);
          });
          if (wi > 0) { t.textContent = ''; out.forEach(function (n) { t.appendChild(n); }); split = true; }
        } catch (e) {}
        t.setAttribute('data-rvt', split ? 'w' : '');
        /* 가림막은 테두리 상자에서 잘린다 — 받침·괄호가 잘리지 않게 아래를 조금 넓히고,
           그만큼 margin 에서 도로 뺀다. 원래 margin 을 읽어 더하므로 여백을 가진
           제목(연구 비전의 큰 인용구 등)도 배치가 밀리지 않는다. */
        var mb = 0;
        try { mb = parseFloat(getComputedStyle(t).marginBottom) || 0; } catch (e) {}
        t.style.paddingBottom = '.18em';
        t.style.marginBottom = 'calc(' + mb + 'px - .18em)';
      });
    });

    /* IntersectionObserver 콜백은 브라우저의 렌더링 단계에 실려 온다. 렌더링이 멈춘
       환경(백그라운드 탭·일부 헤드리스·크롤러)에서는 한 번도 안 올 수 있고, 그러면
       내용이 opacity:0 인 채로 남는다. 그래서 IO 를 '주 엔진 + 3중 안전망' 으로 짠다. */
    var ioWorks = false;
    var io = new IntersectionObserver(function (entries) {
      ioWorks = true;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('rv-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    picks.forEach(function (pair) { io.observe(pair[0]); });

    /* 안전망 1 — IO 가 안 오면 스크롤·리사이즈 때 직접 위치를 재서 띄운다(rAF 안 씀) */
    function sweep() {
      if (ioWorks) return;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      picks.forEach(function (pair) {
        var el = pair[0];
        if (el.classList.contains('rv-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('rv-in');
      });
    }
    addEventListener('scroll', sweep, { passive: true });
    addEventListener('resize', sweep);
    setTimeout(sweep, 900);
    /* 안전망 2 — 5초가 지나도 단 하나도 안 떴으면 뭔가 고장 난 것이다. 전부 보여준다. */
    setTimeout(function () {
      if (!document.querySelector('[data-rv].rv-in') && window.ysRevealAll) window.ysRevealAll();
    }, 5000);

    /* 탭 전환·해시 이동처럼 우리가 직접 스크롤을 옮길 때는 애니메이션을 즉시 끝낸다.
       숨은 탭에 있던 요소가 transform 이 남은 채로 측정되면 착지가 어긋나기 때문이다. */
    window.ysRevealAll = function () {
      picks.forEach(function (pair) { pair[0].classList.add('rv-in'); io.unobserve(pair[0]); });
    };
  }

  function mount() {
    var old = document.querySelector('.hud-top'); if (old) old.remove();
    var ph = document.querySelector('.ynav-ph'); if (ph) ph.remove();
    document.body.insertBefore(nav, document.body.firstChild);
    buildSubnav();
    buildFooter();
    setupReveal();

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
