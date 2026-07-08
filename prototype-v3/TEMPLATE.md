# 연세대 기계공학부 · v3 「Editorial Institute」 — 서브페이지 제작 규약

이 문서는 서브페이지 14개(`about / history / academics / research / lab /
people / professor / news / admissions / contact / engineering /
accessibility / privacy / terms`)를 만드는 에이전트를 위한 **단일 규약**이다.
`index.html`이 살아있는 레퍼런스이므로, 판단이 서지 않으면 index.html의 동일
패턴을 그대로 따른다.

- **스택**: 순수 HTML + CSS + Vanilla JS. ES 모듈 금지. `<script defer>` 클래식만.
- **file:// 직접 열람 가능해야 함.** 절대경로/빌드 도구 금지. 링크는 전부 상대경로.
- **외부 의존성**: 오픈소스 폰트 CDN만 허용(아래 head에 포함). 그 외 CDN·JS 라이브러리 금지.
- **콘텐츠 SSOT**: `assets/js/data.js`(`window.YSME`). 수치·명단은 여기서만 렌더. 하드코딩 금지.
- **CSS 추가 금지 원칙**: `assets/css/main.css`의 토큰·컴포넌트로 해결한다. 페이지 고유 레이아웃은
  `<style>` 블록(head 내)에 **토큰만 참조**해 최소한으로. 임의 hex·px 금지.

---

## §0 · `<head>` 보일러플레이트 (복붙 후 title/description/§ 넘버만 교체)

```html
<!DOCTYPE html>
<html lang="ko" class="js">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>페이지명 — 연세대학교 기계공학부</title>
<meta name="description" content="이 페이지 한 줄 요약(80자 내외)." />
<meta property="og:title" content="연세대학교 기계공학부" />
<meta property="og:type" content="website" />
<meta name="theme-color" content="#001a38" />
<!-- FOUC 방지: CSS보다 먼저 저장된 테마 적용 (전 페이지 공통) -->
<script>
(function(){try{var t=localStorage.getItem('ysme-theme');if(t==='dark')document.documentElement.dataset.theme='dark';}catch(e){}
document.documentElement.classList.add('js');})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Serif+KR:wght@400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="assets/css/main.css" />
</head>
<body>
<a class="skip" href="#main" data-i18n="ui.skip">본문 바로가기</a>
```

`class="js"` 는 필수 — 스크롤 리빌의 `html.js` 게이팅(JS 실패 시 콘텐츠 항상 가시)의 스위치.

---

## §1 · 헤더 (canonical) — 전 페이지 100% 동일. index.html에서 그대로 복사

`<header class="site-header"> … </header>` 블록 전체를 `index.html`에서 복사한다.
아래 3개 오버레이 블록(모바일 메뉴, 검색 모달)도 헤더 바로 뒤에 **그대로** 복사한다.

- 현재 페이지에 해당하는 `.nav-link` 에 `aria-current="page"` 를 추가한다.
  예) academics.html → `<a class="nav-link" href="academics.html" data-i18n="nav.academics" aria-current="page">교육</a>`
- 마크업을 임의로 바꾸지 말 것. `id`(`themeBtn`, `navToggle`, `mobileMenu`, `searchModal`,
  `searchInput`, `searchResults`, `searchStatus`)는 main.js가 참조하므로 **이름 고정**.

복붙 대상 3블록(순서 유지):
1. `<header class="site-header">…</header>`
2. `<div class="mobile-menu" id="mobileMenu">…</div>`
3. `<div class="search-modal" id="searchModal" hidden>…</div>`

---

## §2 · 페이지 히어로 + 브레드크럼 (서브페이지 표준 상단)

모든 서브페이지는 `<main id="main">` 첫 요소로 **페이지 히어로**를 둔다. 비대칭 + 대형 타이포.

```html
<main id="main">
<section class="page-hero">
  <div class="container grid12">
    <div class="col-8">
      <nav class="breadcrumb reveal" aria-label="브레드크럼">
        <a href="index.html">홈</a><span class="sep" aria-hidden="true">/</span>
        <span aria-current="page">교육과정</span>
      </nav>
      <p class="page-hero-eyebrow eyebrow reveal">§ Academics</p>
      <h1 class="reveal">고체·열·유체·동역학,<br>네 개의 기둥</h1>
      <p class="page-hero-lede reveal">이 페이지가 다루는 내용을 한두 문장으로. 구체적으로.</p>
    </div>
    <div class="col-4 col-start-9 reveal">
      <p class="page-hero-meta">UPDATED 2026-07<br>SOURCE me.yonsei.ac.kr</p>
    </div>
  </div>
</section>

<!-- 이후 <section class="section">, <section class="section section--alt"> 교차 -->
</main>
```

- **본문 섹션은 `.section` / `.section--alt`(교차 배경) / `.section--navy`** 로 리듬을 만든다.
- 섹션 내부는 항상 `<div class="container">` 로 감싼다.
- 섹션 제목은 `.sec-head`(§넘버 + 제목 + more 링크) 패턴 사용(예시는 index.html §02~§05).

---

## §3 · 푸터 (canonical) — 전 페이지 동일. index.html에서 그대로 복사

`</main>` 뒤에 `<footer class="site-footer">…</footer>` 블록 전체 + 그 아래
`<p id="langNote" …>` + 스크립트 3줄을 복사한다:

```html
</main>
<!-- footer 복붙 -->
<footer class="site-footer"> … </footer>
<p id="langNote" hidden class="visually-hidden" aria-live="polite">English navigation applied. Full English content is in preparation.</p>
<script src="assets/js/data.js" defer></script>
<script src="assets/js/main.js" defer></script>
<!-- (선택) 이 페이지 전용 렌더 스크립트 -->
<script defer> /* DOMContentLoaded → window.YSME / window.YSMEUI 로 렌더 */ </script>
```

---

## §4 · 컬러 · 타이포 토큰 규칙

**색은 반드시 CSS 변수로만.** 임의 hex 금지(플레이스홀더 예외 없음).

| 용도 | 토큰 |
|---|---|
| 본문 텍스트 | `var(--text)` (`--ink-900`, 순검정 금지) |
| 보조 텍스트 | `var(--text-2)` |
| 브랜드/제목 | `var(--brand)` (`--yonsei-800`) |
| 링크/인터랙션 | `var(--link)` (`--yonsei-600`) |
| 배경 | `var(--bg)` / 교차 `var(--surface-2)` |
| 카드 표면 | `var(--surface)` |
| 보더 | `var(--line)` / 얇게 `var(--line-soft)` / 극세 `var(--hairline)` |
| 포인트(유일) | `var(--accent-gold)` — **남발 금지**. 강조 1개소/뷰포트 원칙 |
| 유일 그라디언트 | `var(--grad-navy)` (네이비 명도) — **다른 그라디언트 생성 금지** |
| 클러스터 액센트 | `--c-solid/-thermal/-manuf/-nanobio/-optics/-dyn` — 도트·라벨·바에만 |

**타이포 스케일은 `--step--1 … --step-hero`, `--step-5` 만 사용.** 임의 rem/px 폰트크기 금지.

| 역할 | 클래스 / 패밀리 |
|---|---|
| 초대형 헤드라인 | `.display`(900), `.display-2` / `--font-sans` |
| 섹션 제목 | `.sec-title` 또는 `h2` |
| 리드·인용문 | `.lede`, `blockquote.pull` / `--font-serif` (Noto Serif KR) — **인용/리드에만** |
| mono 라벨·캡션·숫자 | `.overline`, `.mono-label`, `.mono`, `.eyebrow` / `--font-mono` (IBM Plex Mono) |
| 본문 | 기본 body / Pretendard, `line-height:1.7`, `word-break:keep-all` |

---

## §5 · 컴포넌트 카탈로그 (클래스 + 예시 마크업)

### 레이아웃
```html
<section class="section section--alt">
  <div class="container grid12">
    <div class="col-7"> … </div>            <!-- 비대칭: 7+5, 5+7, 8+4로 뒤집어 리듬 -->
    <div class="col-4 col-start-9"> … </div>
  </div>
</section>
```
스팬 유틸: `.col-4/-5/-6/-7/-8/-12`, 시작: `.col-start-2/-6/-7`. 48rem 미만에서 자동 1열 재구성.
**전 요소 중앙정렬 금지. 좌측 정렬 기본.**

### 섹션 헤더
```html
<div class="sec-head reveal">
  <span class="sec-num">§02 / 연구</span>
  <div class="sec-body">
    <h2 class="sec-title">제목</h2>
    <p class="sec-sub">한 줄 부제.</p>
  </div>
  <a class="sec-more arrow-link" href="research.html">전체 <span class="arr" aria-hidden="true">→</span></a>
</div>
```

### 버튼 / 링크
```html
<a class="btn btn--primary" href="#">주 액션 <span class="arr" aria-hidden="true">→</span></a>
<a class="btn btn--ghost" href="#">보조</a>
<a class="btn btn--gold" href="#">네이비 배경 위 강조</a>   <!-- 네이비 섹션에서만 -->
<a class="arrow-link" href="#">텍스트 화살표 링크 <span class="arr" aria-hidden="true">→</span></a>
<a class="link-sweep" href="#">본문 내 밑줄 스윕 링크</a>
```

### 이미지 플레이스홀더 `.ph` (실사진 오기 전 표준)
`<figure class="media">` 로 감싸 나중에 `<img>` 로 교체하기 쉽게 한다.
라인아트는 `window.YSMEUI.lineArt('gear'|'turbine'|'arm'|'wave'|'grid')` 로 주입(JS) 하거나,
정적이면 아래처럼 캡션만 둔다.
```html
<figure class="media">
  <div class="ph ph--16x9">            <!-- 변형: --16x9 / --4x3 / --3x4 / --1x1 / --21x9 -->
    <span class="ph-tag">FIG. 02</span>
    <span class="ph-cap">PHOTO — 공학관 로보틱스 랩, 2026</span>
  </div>
  <figcaption>캡션(선택)</figcaption>
</figure>
```

### 에디토리얼 기사 카드 (뉴스·성과)
```html
<a class="article-card" href="news.html">
  <div class="ph ph--4x3"><span class="ph-tag">뉴스</span></div>
  <div class="article-body">
    <span class="article-cat">Research News</span>
    <h3 class="article-title">제목</h3>
    <time class="article-date" datetime="2026-05-18">2026.05.18</time>
  </div>
</a>
```

### 소식 리스트 행
```html
<div class="post-list">
  <a class="post-row post-row--pinned" href="news.html">
    <span class="post-cat">학부</span>
    <span class="post-title">제목 <span class="new-badge">NEW</span></span>
    <time class="post-date" datetime="2026-06-23">2026.06.23</time>
  </a>
</div>
```

### 교수 카드 (컨테이너 쿼리 — 좁으면 세로 / 넓으면 가로)
부모에 `.people-grid` + 조상에 `.cq`(또는 카드 자체 `container-type`). 마크업은 index.html §04 렌더 참조.
```html
<div class="people-grid">
  <article class="prof-card"> … .prof-inner > .prof-photo(.ph) + .prof-info … </article>
</div>
```

### 클러스터 리스트 행 / 태그·배지
```html
<a class="cluster-row" href="research.html#solid" style="--cluster-c:var(--c-solid)">
  <span class="cluster-idx">01</span>
  <span class="cluster-main"><span class="cluster-name">고체·구조·재료역학</span>
    <span class="cluster-en">Solid Mechanics & Design</span></span>
  <span class="cluster-count"><b>7</b> labs</span>
  <span class="cluster-bar" style="--w:100%"></span>
</a>

<span class="tag tag--thermal"><span class="dot" aria-hidden="true"></span>열·유체·에너지</span>
<span class="badge">부교수</span> · <span class="badge badge--gold">학과장</span>
```

### 벤토 통계 (카운트업)
`.bento` 안 첫 셀은 `.bento-cell--feature`(네이비). 숫자는 `data-count="33"` + `aria-hidden`,
스크린리더용 `.visually-hidden` 요약 문장 병기(index.html §03 참조).

### 타임라인 (history 등)
```html
<div class="timeline">
  <div class="tl-item tl-item--hl">
    <p class="tl-date">1962.12</p><p class="tl-text">기계공학과로 분리</p>
  </div>
  <div class="tl-item"> … </div>
</div>
```

### CTA 밴드 (네이비 + 골드)
index.html §06의 `.cta-band` 블록 복사. 페이지당 최대 1회 권장.

---

## §6 · data.js 렌더 사용법

`data.js` → `main.js` 순서로 로드되므로, 페이지 스크립트는 `DOMContentLoaded` 후
`window.YSME`(데이터)와 `window.YSMEUI`(헬퍼)를 쓴다.

```js
window.addEventListener('DOMContentLoaded', function () {
  var D = window.YSME, UI = window.YSMEUI;
  if (!D || !UI) return;                     // 방어: 데이터 없으면 정적 fallback 유지
  // D.professors / D.labs / D.clusters / D.posts / D.courses / D.history / D.datums / D.pages
  var el = document.getElementById('target');
  el.innerHTML = D.labs.map(function (l) {
    var clu = UI.clusterOf(l.cluster) || {};
    return '<a class="cluster-row" href="research.html#' + l.id + '">' +
      UI.escapeHtml(l.ko) + ' — ' + UI.escapeHtml(l.pi) + '</a>';
  }).join('');
});
```

**YSMEUI 헬퍼**
| 함수 | 용도 |
|---|---|
| `UI.escapeHtml(s)` | **모든** 데이터 출력 시 필수(XSS/깨짐 방지) |
| `UI.clusterOf(id)` | 클러스터 객체(`{id,ko,en,count}`) |
| `UI.labOf(id)` | 연구실 객체 |
| `UI.fmtDate('2026-05-18')` | `2026.05.18` |
| `UI.isNew(iso, 14)` | 최근 N일 이내면 true → NEW 뱃지 |
| `UI.lineArt(kind)` | 플레이스홀더용 mono 라인아트 SVG 문자열 |
| `UI.reduce` | reduced-motion 여부 |

**규칙**: 수치(33/33/6/130/1962), 교수/랩/공지 목록은 반드시 data.js에서 렌더.
정적 하드코딩 시 데이터와 어긋나 감점. 각 렌더 컨테이너에는 `<noscript>` fallback 링크를 둔다.

---

## §7 · i18n (`data-i18n`)

사이트 크롬(내비/푸터/UI 라벨)은 KO/EN 토글 대상. 해당 요소에 `data-i18n="키"` 부여.
등록된 키(main.js `I18N`): `nav.about/academics/research/people/news/admissions`,
`ui.search/skip/menu`, `ftr.quick/about/policy`.
본문은 KO 유지가 기본(정책). 새 UI 라벨을 EN 전환하려면 main.js `I18N` 양쪽 사전에 키를 추가.

---

## §8 · 접근성 체크리스트 (제출 전 전 페이지 필수 통과)

- [ ] `<a class="skip" href="#main">` 최상단 존재, `<main id="main">` 로 도달.
- [ ] 랜드마크: `header` / `nav[aria-label]` / `main` / `footer` 각 1회. 섹션은 `aria-labelledby` 로 제목 연결.
- [ ] 제목 위계: 페이지당 `h1` 정확히 1개(page-hero). 이후 `h2 → h3` 순서 건너뛰지 않기.
- [ ] 현재 페이지 내비에 `aria-current="page"`.
- [ ] 포커스 비저블: 전역 `:focus-visible` 사용 — 임의로 `outline:none` 금지.
- [ ] 모든 의미 있는 이미지에 `alt`. 장식 SVG/`.ph`/도트는 `aria-hidden="true"`.
- [ ] 아이콘 전용 버튼에 `aria-label`. 토글은 `aria-pressed`/`aria-expanded` 상태 반영(main.js 처리).
- [ ] 명도 대비 AA 이상(본문 4.5:1, 대형텍스트 3:1). 네이비 위 텍스트는 `#fff`/`--yonsei-100`.
- [ ] 키보드만으로 메뉴·검색·링크 전부 도달·조작. 오버레이는 Esc로 닫히고 포커스 트랩(main.js 제공).
- [ ] `data-count` 숫자는 `aria-hidden` + 별도 `.visually-hidden` 문장으로 스크린리더 제공.
- [ ] 다크모드에서도 대비 유지(토큰 사용 시 자동). `prefers-reduced-motion` 은 CSS/JS가 이미 가드.
- [ ] 가로 스크롤 0: 넓은 표/다이어그램은 `overflow-x:auto` 래퍼에.

---

## §9 · 금지 목록 (감점 · "AI 티" 안티패턴)

- ❌ 임의 hex / rgb / px 폰트크기 — 반드시 토큰·스케일.
- ❌ 보라·무지개·핑크 그라디언트, 그라디언트 텍스트 — `--grad-navy` 외 그라디언트 생성 금지.
- ❌ 이모지 아이콘/불릿 — SVG(`stroke-width` 라인) 또는 mono 라벨 사용.
- ❌ 균일 16px radius 카드 나열 — radius는 버튼 6 / 카드 10 / 이미지 4 / 히어로 0 차등.
- ❌ 중앙정렬 남발 — 좌측 정렬 기본, 중앙은 의도적 소수 지점만.
- ❌ 모호한 히어로 카피("미래를 만들다", "혁신을 선도") — 구체적 서사·수치.
- ❌ Inter/시스템폰트 디스플레이, 균일 그레이 카드 벽.
- ❌ 데이터 하드코딩(수치·명단) — data.js 렌더로.
- ❌ ES 모듈/외부 JS 라이브러리/절대경로 — file:// 열람 깨짐.

---

## §10 · 제출 전 self-check (페이지별)

1. `file://` 로 직접 열어 렌더·내비·검색(Ctrl+K)·테마·모바일 메뉴 동작.
2. JS 끈 상태에서도 본문·링크가 보이는지(`html.js` 게이팅 + `<noscript>`).
3. 320px~1600px 리사이즈 시 가로 스크롤 0, 브레이크포인트(48/64/90rem)에서 재구성.
4. 링크 상대경로가 실제 파일명(§ 첫 문단 14개)과 일치.
5. 키보드 탭 순회 · 포커스 링 · Esc 닫기.
