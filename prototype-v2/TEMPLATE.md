# TEMPLATE.md — 서브페이지 제작 규약 (v2 「機制 · Mechanism in Motion」)

> 모든 서브페이지는 이 문서의 규약을 **그대로** 따른다. 헤더/푸터/드로어/검색모달은
> `index.html`의 canonical 마크업을 복사한다(임의 수정 금지 — 드리프트가 v1 최대 감점 요인이었다).

---

## 1. 페이지 뼈대 (필수 순서)

```html
<!DOCTYPE html>
<html lang="ko" data-theme="paper" class="js">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>페이지명 · 연세대학교 기계공학부</title>
<meta name="description" content="…" />
<!-- ① FOUC 방지 인라인 스크립트 — CSS 로드보다 반드시 먼저 -->
<script>
(function(){try{var t=localStorage.getItem('ysme-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}
document.documentElement.classList.add('js');})();
</script>
<!-- ② 폰트 (v1과 동일 CDN 소스) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<!-- ③ 공용 CSS 단일 로드 (페이지 자체 <style>은 페이지 고유 레이아웃만, 토큰 재정의 절대 금지) -->
<link rel="stylesheet" href="assets/css/main.css" />
</head>
<body>
<a class="skip" href="#main" data-i18n="ui.skip">본문 바로가기</a>
<div class="scroll-rule" aria-hidden="true"><i></i></div>
<!-- ④ 헤더 → 드로어 → 검색모달: index.html 336~248행대 블록을 그대로 복사 -->
<main id="main"> …페이지 콘텐츠… </main>
<!-- ⑤ 푸터: index.html 푸터 블록 그대로 복사 -->
<script src="assets/js/data.js" defer></script>
<script src="assets/js/main.js" defer></script>
<script defer> /* 페이지 전용 JS — DOMContentLoaded 안에서, window.YSME / window.YSMEUI 사용 */ </script>
</body>
</html>
```

- **모듈(import/export) 금지** — file:// 프로토콜에서 직접 열려야 한다. 전부 `defer` 클래식 스크립트.
- 페이지 전용 CSS가 필요하면 `<head>` 맨 끝 `<style>` 블록에 **레이아웃 클래스만** 추가. 색·간격·라운드는 반드시 main.css 토큰 변수(`var(--…)`)로.

## 2. Canonical 블록 (index.html에서 복사)

| 블록 | index.html 위치 | 수정 허용 범위 |
|---|---|---|
| 헤더 `<header class="hdr">` | `<!-- ═══ 헤더` 주석 블록 | **aria-current만** (아래 §5) |
| 드로어 `<div class="drawer" id="drawer">` | `<!-- ═══ 모바일 드로어` | 없음 |
| 검색모달 `<div class="smodal" id="searchModal">` | `<!-- ═══ 검색 모달` | 없음 |
| 푸터 `<footer class="ftr">` | `<!-- ═══ 푸터` | 없음 |
| `<p id="langNote">` (푸터 뒤) | 푸터 직후 | 없음 |

ID 계약(main.js가 참조): `themeBtn` `burger` `drawer` `searchModal` `searchInput` `searchResults` `searchStatus` + 속성 `data-search-open` `data-search-close` `data-close` `data-lang` `data-i18n` `data-count`.

## 3. 페이지 콘텐츠 패턴

### 3.1 페이지 헤드 (서브페이지 공통 시작)
```html
<div class="page-hd gridpaper" style="position:relative">
  <div class="gridpaper-fade"></div>
  <div class="wrap" style="position:relative">
    <nav class="crumb" aria-label="현재 위치"><ol>
      <li><a href="index.html">홈</a></li><li><a href="research.html">연구</a></li>
      <li aria-current="page">연구실</li></ol></nav>
    <h1>연구실 <span class="mono" style="font-size:.5em;color:var(--txt-3)">§02 RESEARCH</span></h1>
    <p class="lead">…</p>
    <div class="datums page-datum"> …datum 칩+스탬프… </div>
  </div>
</div>
```
- **h1은 페이지당 정확히 1개.** 섹션 제목은 `.sec-head`(§번호 `.sec-num` + `.sec-title`) 패턴.
- §번호 체계: §00 HOME · §01 소개 · §02 연구 · §03 구성원 · §04 교육 · §05 소식 · §06 입학·진로 · §90 정책/사양(engineering·privacy·terms·accessibility).

### 3.2 섹션 / 카드 / 스탬프
- 섹션: `<section class="section [section--alt|section--tight]"><div class="wrap"><div class="sec-head reveal">…` — 배경은 `paper-0 ↔ paper-50`(`--alt`) 교차.
- 모든 카드는 `.card` 셸 상속: `class="card"` + 파생(`prof`,`lcard`,`ccard`,`pcard`). 코너 틱은 `.card--corner` 추가.
- **출처 스탬프(필수)**: 화면에 드러나는 모든 사실 수치 옆에
  ```html
  <span class="stamp"><button type="button" aria-label="출처 보기">i</button>
    <span class="pop" role="tooltip">출처: faculty_list.do · 최종확인 2026-06-30</span></span>
  ```
  화면 우측 끝 요소는 `pop--left` 클래스로 팝오버 방향 전환. **출처를 모르는 수치는 게시하지 않는다(placeholder 0 원칙).**
- 스크롤 리빌: 블록에 `class="reveal"`(+`data-delay="1|2|3"` 스태거). 1회만 발동, JS 실패/reduced-motion 시 항상 가시.
- 카운트업: `<span data-count="33">0</span>` — main.js가 자동 처리.
- 도판이 필요하면 `.dwg-sheet`(dwg-tb/dwg-body/dwg-cap) 셸 + `.mech` SVG 선 클래스 사용. **자동재생 루프 금지** — 스크롤/호버/버튼 의도에만 발동(정중동).

### 3.3 데이터는 data.js에서
`window.YSME`: `professors(33)` `labs(33)` `clusters(6)` `posts(32)` `courses(8)` `history(14)` `datums(5)` `pages` `site`.
`window.YSMEUI` 헬퍼: `escapeHtml` `clusterOf(id)` `labOf(id)` `fmtDate(iso)` `isNew(iso,days)` `reduce`.
- 교수/랩/공지 목록은 **HTML에 손으로 복제하지 말고** data.js에서 렌더(단일 진실원천). 렌더 실패 대비 `<noscript>` 안내 필수.
- 앵커 규약: 교수 카드 `id="{professor.id}"`(예: `kim-woochul`), 랩 카드 `id="{lab.id}"`(예: `atel`) — 검색모달이 `people.html#id`, `research.html#id`로 딥링크한다. **디렉터리 페이지는 이 id를 반드시 부여할 것.** 상세 페이지는 쿼리 방식: `lab.html?id={lab.id}`, `professor.html?id={professor.id}`.

## 4. 클러스터 색 매핑표 (고정 — 임의 변경 금지)

| cluster id | 명칭 | 태그 클래스 | CSS 변수(카드 `--cc`) | labs |
|---|---|---|---|---|
| `solid` | 고체·구조·재료역학 | `.tag--solid` | `var(--c-solid)` | 7 |
| `thermal` | 열·유체·에너지 | `.tag--thermal` | `var(--c-thermal)` | 7 |
| `manuf` | 생산·정밀제조 | `.tag--manuf` | `var(--c-manuf)` | 4 |
| `nanobio` | 마이크로·나노·바이오 | `.tag--nanobio` | `var(--c-bio)` | 6 |
| `optics` | 광학·이미징·계측 | `.tag--optics` | `var(--c-optics)` | 4 |
| `dyn` | 동역학·제어·로보·AI | `.tag--dyn` | `var(--c-dyn)` | 5 |

(실측 8클러스터 → 6색 병합 근거는 data.js 상단 주석 참조: 로보틱스+계산AI→dyn, 마이크로나노+바이오→nanobio)
클러스터 색은 **solid점(.td)/ink텍스트/bg배경 3종 세트**(.tag--*)로만 사용. 랩·클러스터 카드는 `style="--cc:var(--c-…)"`로 상단 색 인디케이터.

## 5. 내비 aria-current 규칙

헤더 상단 메뉴 6개 중 **현재 페이지가 속한 축 1개에만** `aria-current="page"`를 붙인다(복사 후 이 속성만 이동).

| 페이지 | aria-current 대상 |
|---|---|
| index.html | (없음 — 홈은 brand 로고가 현재) |
| about-dean.html, history.html, contact.html | 소개 |
| academics.html | 교육 |
| research.html, lab.html(?id= 랩 상세), engineering.html | 연구 |
| people.html, professor.html(?id= 교수 상세) | 구성원 |
| news.html | 소식 |
| admissions.html | 입학·진로 |
| privacy/terms/accessibility | (없음) |

브레드크럼 마지막 항목에도 `aria-current="page"`.

## 6. 파일 간 링크 맵

```
index.html ─┬─ about-dean.html   (소개·비전·교육목표)
            ├─ history.html      (연혁 Since 1962 — YSME.history 렌더)
            ├─ academics.html    (교육과정 · #courses 전공필수 · #abeek)
            ├─ research.html     (연구 허브 — 랩 33 디렉터리 · #clusters · #{cluster} · #{lab.id} 앵커)
            │    └─ lab.html?id={lab.id} (랩 상세 템플릿)
            ├─ people.html       (교수 33 디렉터리 · #{professor.id} 앵커)
            │    └─ professor.html?id={professor.id} (교수 상세·스토리 템플릿 — storyPage 필드)
            ├─ news.html         (공지+뉴스+세미나 통합 허브 · #news · #seminar)
            ├─ admissions.html   (#undergraduate #graduate #careers #alumni — 페르소나 카드가 이 앵커로 진입)
            ├─ contact.html      (오시는 길·연락처·문의폼)
            ├─ engineering.html  (공학 사양서 — 사양칩 3종의 착지점)
            └─ privacy.html · terms.html · accessibility.html (푸터 정책 3종)
```

## 7. 품질 게이트 (제출 전 셀프 체크)

1. 다크(청사진)모드에서 페이지 열고 이동해도 흰 화면 깜빡임 없음(§1-① 인라인 스크립트 확인).
2. 단일 h1 · landmark(header/nav/main/footer) · skip 링크 · 모든 인터랙티브 44px 이상.
3. 필터/검색 결과 수는 `aria-live="polite"` 요소로 안내. 빈 상태는 `.empty-state` + 초기화 CTA.
4. 자동재생 루프 0건 · reduced-motion에서 정적 완성형.
5. 수치 옆 스탬프 유무 검사 — 출처 없는 수치 0건.
6. 가로 스크롤 0(테이블은 `.table-wrap`으로 격리) · 한글 keep-all 파손 없음.
7. file://로 직접 열어 콘솔 에러 0 확인.
8. 금지: 보라 그라디언트 · 글래스모피즘 · 16px+ 라운드 카드 · 이모지 불릿 · 임의 HEX(토큰만).
