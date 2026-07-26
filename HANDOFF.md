# 인수인계 — 연세대 기계공학부 사이트 공모전 (팀 DATUM)

> **이어서 작업하는 사람은 이 파일부터 읽으세요.** 여기 없는 세부는 아래 문서로 넘깁니다.
>
> | 문서 | 무엇이 있나 |
> |---|---|
> | **`HANDOFF.md`** (이 파일) | 전체 그림 · 현재 상태 · 시작하는 법 · 남은 일 · 함정 · **재개 프롬프트** |
> | `README.md` | 실행법 · 개발 규칙 · 검증 명령 · 사이트 인터랙션 규약 |
> | `design-candidates/STUDIO_SPEC.md` | 편집 스튜디오 **계약서**. 스튜디오를 고치기 전에 반드시 읽을 것 |
> | `../CLAUDE.md` | 모노레포 git 규칙 (여러 PC 동시 작업 주의사항) |
>
> 최종 갱신: **2026-07-26 (일) 21:14 KST** · 커밋 `dc3fc62`

---

## 1. 30초 요약

공모전 산출물은 **두 축**입니다.

| 축 | 무엇 | 어디 |
|---|---|---|
| **1축** | 학부 홈페이지 시안 (8페이지) | `design-candidates/H-academic.html`, `G-*.html` |
| **2축** | **인플레이스 편집 스튜디오** — 사이트 화면 위에서 바로 고치고 GitHub 에 커밋 | `design-candidates/assets/studio/`, `design-candidates/api/` |

2축이 이 프로젝트의 차별점입니다. 별도 관리자 콘솔을 열지 않고, **방문자가 보는 그 화면에서** 글을 고치고 공지를 등록하고 시점을 저장합니다. 쓰는 사람은 디자이너가 아니라 **학과 조교**라고 가정하고 만들었습니다.

---

## 2. 지금 상태

| 항목 | 값 |
|---|---|
| 저장소 | `github.com/todo0157/yonsei-me-homepage-competition` (브랜치 `main`) |
| 배포 | **https://yonsei-me-homepage.vercel.app** — Vercel 프로젝트 `yonsei-me-homepage`, Root Directory `design-candidates` |
| 보기 | `…/H-academic.html` · 편집 `…/H-academic.html?studio=1` |
| 서버 함수 env | `GH_TOKEN`, `PUBLISH_PASSCODE` (Vercel **Sensitive** — 값을 다시 읽을 수 없다) |
| 사전 | `assets/i18n/en.json` **840항목 · 미번역 0** |
| 코드 | 스튜디오 16모듈 + CSS ≈ **9,600줄** (전부 의존성 0, 빌드 도구 없음) |

> 루트 `/` 는 홈이 아니라 「관제 시안」 목록 페이지입니다. 홈은 `H-academic.html`.

### 검증 현황 — 모두 통과

| 검사 | 항목 | 무엇을 보나 |
|---|---|---|
| `_studio/selftest.html` | 146 | 8페이지 원문 스캔·DOM 대응·편집 후 **바이트 동일 복귀**·정렬 88~97% |
| `_studio/inttest.html` | 130 | 실제 페이지에 스튜디오를 부팅해 저장본 오염 0·원자 게시·용어 검사·커서 간섭 0 |
| `_studio/railtest.html` | 26 | 홈 교수진 레일 버튼·자동 넘김, 직위 노출 위치 |
| `_studio/tools/test-posts.js` | 28 | 실제 `data.js` 로 공지 추가·삭제 왕복 |

---

## 3. 시작하기

```bash
git clone https://github.com/todo0157/yonsei-me-homepage-competition.git
cd yonsei-me-homepage-competition/design-candidates

# 로컬 서버 (검사에 필수 — /hang 엔드포인트가 헤드리스 load 를 붙잡는다)
python _studio/tools/testserver.py .        # http://127.0.0.1:8124

# 회귀 4종
node _studio/tools/test-posts.js
chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/selftest.html
chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/inttest.html
chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/railtest.html
```

덤프 끝의 `PASSED` / `FAILED` 를 본다. 항목별로 `ok` / `FAIL` 이 찍힌다.

**새 PC 주의:** 스튜디오의 초안·AI 키·계정은 브라우저 IndexedDB 에만 있습니다. git 으로 옮겨가지 않습니다. 반면 **버전 시점은 GitHub 커밋**이라 어느 PC 에서든 같은 이력을 봅니다.

---

## 4. 구조

### 사이트 (1축)

```
design-candidates/
├─ H-academic.html          홈
├─ G-about / people / research / academics / graduate / news / admissions
├─ assets/
│  ├─ js/data.js            ★ 공지·뉴스·교수·연구실… 목록의 원본 (window.YSME = {순수 JSON})
│  ├─ nav.js                공용 헤더·푸터 주입 + 런타임 로더
│  ├─ i18n.js               방문자용 한/영 적용
│  ├─ i18n/en.json          {"한국어 원문": "English"}  ← 키가 한국어다(gettext 규약)
│  ├─ cursor.js             몰입 구역 전용 커서
│  └─ faculty/*.jpg         교수 사진 33장
```

**화면의 목록 상당수는 HTML 에 없습니다.** `data.js` 를 읽어 런타임에 그립니다.
공지·뉴스·세미나·교수 카드가 그렇습니다. 그래서 화면에서 글자를 고쳐도 새로고침하면 사라집니다 — 스튜디오가 이걸 감지해 데이터 편집으로 보냅니다.

### 편집 스튜디오 (2축)

```
assets/studio/
├─ boot.js        게이트·세션·모듈 로더 (프레임 안에서는 스스로 멈춘다)
├─ core.js        네임스페이스·버스·IndexedDB·Y.labels(사람 말 이름표)
├─ net.js         api 클라이언트
├─ source.js      ★ HTML 원문 스캔 + 오프셋 편집 — 저장 경계
├─ align.js       원본 DOM ↔ 화면 DOM 정렬 (LCS)
├─ engine.js      진실 모델 · eid · undo/redo · 초안
├─ datamap.js     data.js 소유 판별 + JSON 오프셋 편집 + 배열 추가/삭제
├─ pagedict.js    홈 인라인 `var I18N` 사전 편집
├─ posts.js       공지·소식 등록 패널
├─ changes.js     두 시점의 "사람이 읽는 변경 목록"
├─ diff.js        LCS 라인 디프 (개발자용 보기)
├─ hud.js         버튼 스택·상태바·인스펙터 (얼굴)
├─ versions.js    시점 저장·목록·비교·복원
├─ ai.js          변경안 계획·항목 점프·승인
├─ i18n-edit.js   한/영 편집
├─ mobile.js      모바일 렌더 모드
└─ studio.css     오버레이 스타일 (전 선택자 `.ys-` 접두)

api/
├─ publish.js     파일 I/O · 다중파일 원자 커밋 · 이력 · 체크포인트
└─ ai.js          Gemini/Claude 프록시 (키 미저장)
```

### 이 설계의 핵심 판단 하나

**DOM 을 다시 직렬화하지 않는다.** `documentElement.outerHTML` 로 저장하면 브라우저가
`<meta … />`·따옴표·엔티티를 정규화해 **아무것도 안 고쳐도 파일 전체가 diff** 로 잡힙니다.
대신 원문을 직접 토큰화해 각 요소의 `[start,end)` 를 들고 **그 구간만 갈아끼웁니다.**
그래서 무편집 저장이 바이트 동일하고, 텍스트 한 줄 수정이 diff 한 줄이 됩니다.
`data.js`(JSON)·홈 인라인 사전(JS 리터럴)도 같은 원칙입니다.

---

## 5. 절대 어기면 안 되는 것

1. **`git add -A` / `git add .` 를 상위 모노레포 루트에서 쓰지 말 것.**
   이 폴더는 `공모전 준비`(모노레포) 안의 **독립 저장소**입니다. 다른 공모전 폴더가
   D(삭제) 로 보여도 건드리지 않습니다. 자세한 절차는 `../CLAUDE.md`.
2. **API 키·비밀번호를 저장소에 커밋하지 말 것.** 서버 env 로만 둡니다.
3. **스튜디오가 만드는 DOM 에는 반드시 `data-ys-ui`** 를 붙일 것.
   안 붙이면 정렬기가 편집 대상으로 오인하고, 번역 런타임이 건드립니다.
4. **저장본 오염 금지.** 편집 UI 클래스·`contenteditable`·런타임 클래스(`sfade` 등)가
   저장되는 HTML 에 들어가면 안 됩니다. `inttest` 가 이걸 감시합니다.
5. **스튜디오를 고쳤으면 `STUDIO_SPEC.md` 도 같이 고칠 것.** 계약과 코드가 어긋나면
   다음 사람이 계약을 믿고 잘못 만듭니다.
6. **실데이터 원칙.** 없는 정보를 지어내지 않습니다. (예: 교수의 교차 연구분야 데이터가
   없어서, 한양대처럼 여러 칸을 채우는 UI 를 흉내 내지 않았습니다.)

---

## 6. 2026-07-26 에 한 일

### 편집 도구 — "고칠 수 없는 칸" 없애기

- **시점 비교를 코드 diff → 사람이 읽는 변경 카드로** (`changes.js` 신규).
  "글자 크기 58px → 72px", "「교수진」 → 「우리 교수진」" 처럼 나오고, 항목을 누르면
  화면의 그 자리로 이동합니다. 옛 판본을 그대로 렌더해 보는 기능도 있습니다.
  원문 코드 비교는 접힌 「개발자용」 안에 남겨 뒀습니다.
- **개발자 용어 전면 제거.** `data.js`·`noticesGrad[20]`·`#ntList`·`eid 64`·CSS 브레드크럼이
  화면에서 사라졌습니다. 빨간 경고였던 데이터 편집 안내를 회색 안내로 바꿨습니다
  (정상 동작인데 오류처럼 읽혔습니다). `inttest` 에 **용어 감시 12항목**을 넣어
  이 말들이 다시 새면 검사가 실패합니다.
- **버그: 자리표시자 오인.** `#newsGrid`·`#ntList`·`#smList` 는 파일에 같은 클래스의
  자리표시자(`<a class="nrow">학부 뉴스 보기</a>`)가 있어, 정렬기가 런타임 목록의
  **첫 항목**을 그것과 짝지었습니다. "파일 소유"로 판정돼 HTML 편집이 열렸고,
  고쳐 봐야 아무도 못 보는 자리표시자만 바뀌고 사라졌습니다. 이제 목록 안쪽은 항상
  데이터 편집으로 가고, HTML 편집 대상은 목록 상자로 옮깁니다.
- **공지·소식 등록** (`posts.js`) — 분류 5종(학부/대학원 공지·연구 소식·세미나·행사).
  입력칸은 기존 첫 항목의 실제 필드에서 만들어 데이터 모양이 바뀌어도 따라갑니다.
- **홈 사전 문장 인플레이스 편집** (`pagedict.js`) — 홈의 `var I18N` 이 관리하는 문장을
  한국어·English 두 칸으로 바로 고칩니다. 예전엔 잠겨 있었습니다.
- `core.js` 회귀 수정: `Y.store.get` 이 없는 키에 IDBRequest 객체를 돌려주던 것.

### 디자인

- **교수 카드 분야 아이콘** — 한양대 학문분야 페이지의 정보 설계를 옮겼습니다.
  구성원 페이지는 사진 왼쪽 레일에 육각 6칸(그 교수의 분야만 채움), 홈은 배지 1개.
- **몰입 구역 커서** (`cursor.js`) — 한화에어로스페이스식 점+링 2겹. 홈 연구분야 목록과
  연구 페이지 분야 카드에서만 켜집니다.
- **히어로 모노톤화** — 스톡 사진을 흑백+네이비 질감으로 눌렀습니다.
  (처음엔 사진이 잘 보이게 바꿨는데 오히려 스톡 티가 더 났습니다. 방향을 뒤집었습니다.)
- **분야 6색 재설계** — CIELAB 색거리로 계산. 최소 ΔE **17.3 → 32.6**.
  기존엔 역학·소재와 바이오·포토닉스가 둘 다 파랑이라 구별이 안 됐습니다.
- **접근성 회귀 수정** — 이 색들이 카드 밴드의 흰 글자 배경인데 기존에 이미 두 개가
  WCAG 4.5:1 미달이었습니다. 칩·아이콘은 선명한 색, **흰 글자가 올라가는 배경만**
  `color-mix(… 73%, #0a1633)` 로 어둡게 섞어 전 분야 4.74 이상 확보.
- **홈 교수진 레일** — 좌우 버튼 + 3.6초 자동 넘김. 33명 전원 노출.
  직위(교수·부교수·조교수)는 카드에서 빼고 구성원 페이지 「자세히 보기」 안으로.
  보직(학과장 등 3명)은 성격이 다른 정보라 그대로 둡니다.
- **미번역 해소** — `en.json` 은 원래도 100% 였고, 미번역은 전부 `data.js` 에서 왔습니다
  (추출기가 HTML 8개만 훑었음). 실제 공지·교과목명 ~690개는 **번역하지 않는 것이 맞고**,
  화면 라벨은 data.js 안에 이미 `ko`/`en` 짝이 있어서 그 짝만 사전으로 옮겼습니다.
  536 → 840항목, 미번역 0.

### 2026-07-26 추가 (홈·연구·소식 상호작용 · 세오윤)

- **홈 연구 분야 → 연구 페이지 해당 분야 카드 자동 열기.** 홈 `renderAreas` 링크를
  `G-research.html?field=<id>#fields` 로 바꾸고, 연구 페이지가 **파싱 시점에** `?field` 를
  캡처(nav.js 가 `history.replaceState` 로 쿼리를 지우기 전)해 로드 후 그 분야 FLIP 카드를 연다.
  숨은 탭이면 `offsetParent` 확인 후 '연구 분야' 탭을 눌러 재시도(제로-rect FLIP 방지 가드 포함).
- **페이지 간 매끄러운 전환.** `assets/transition.css`(신규) — MPA View Transitions
  (`@view-transition{navigation:auto}` + 크로스페이드). 8개 콘텐츠 페이지 `<head>` 에 `<link>`.
  고정 헤더가 함께 움직이지 않도록 슬라이드 없이 투명도만. `file://`·미지원 브라우저는 무전환 폴백.
- **연구실 홍보영상 실제 연결.** `data.js labs[].video`(YouTube 14 · Google Drive 5, 실존·임베드
  가능 확인)를 실제 썸네일 + 라이트박스(iframe 임베드)로 연결. 영상 없는 14개는 '준비 중' 유지.
  모달은 배경 `inert` 로 포커스 트랩(스튜디오 UI `data-ys-ui` 는 제외). 분야 모달도 동일 적용.
- **형제 탭 클릭 시 새 뷰 맨 위로 스크롤** (`nav.js` buildSubnav `show`).
- **소식 뉴스·연구성과 각 게시물 앞 작은 썸네일** (`newsList[].thumb`, 실 이미지·핫링크 허용 확인).
- 검증: selftest 8페이지 **실패 0/경고 0**, inttest **실패 0**, test-posts **28/28**, 3중 서브에이전트 리뷰 반영.

### 2026-07-27 추가 (페이지 진입 UX 재설계 + 소식 하위 3보드 신설 · 세오윤)

- **페이지 진입 = 항상 히어로 화면부터.** 메뉴/드롭다운/푸터로 탭 해시(`#faculty` 등)를 갖고
  들어와도 앵커로 점프하지 않고 맨 위에서 시작(nav.js — 탭 해시일 때만 top 리셋, 연구실 id 같은
  깊은 앵커는 기존 스크롤 유지). 히어로 글자(bc·kick·h1·lead)는 진입 시 등장 애니메이션
  (`transition.css` `ys-txt-in`, reduced-motion 존중).
- **히어로 큰 제목 = 상단 메뉴 라벨 그대로.** 교수진→구성원, 연구 분야→연구, 학사·교육과정→학사,
  입학·진로→입학, 학부 소개→학부소개. (사용자 스크린샷 지시)
- **형제 탭 클릭 시** 탭 바가 화면 맨 위(헤더 아래)에 붙도록 양방향 부드러운 스크롤 +
  새로 보이는 섹션에 `.ys-view-in` 글자 등장. 같은 페이지의 드롭다운·푸터 탭 링크는
  리로드 없이 탭 전환으로 인터셉트.
- **소식(G-news)에 원본 구조대로 3개 게시판 신설** — 원본 조사 결과 학위논문심사·자료실·취업정보
  모두 me.yonsei '뉴스 및 공지사항' 하위 형제임을 확인하고 전부 소식 탭으로 배치.
  - 학위논문심사(#thesis): 실제 게시판(`community/degree_thesis_review.do`, 총 150건) 최근 10건
    실데이터 + 심사 규정 원문 인용(graduation.do). 개별 글 articleNo 는 목록에서 확인 불가라
    행 링크는 게시판으로(지어내지 않음 — data.js `thesisReviewSource` 에 명시).
  - 자료실(#archive): 실제 게시판(`community/information.do`) 총 7건 전체, 개별 글 URL 연결.
  - 취업 정보(#jobs): 기존 실데이터 30건을 입학에서 소식으로 이동(G-admissions 섹션·JS·CSS 제거,
    제목 기반 자체 분류 배지 유지). data.js 에 `thesisReview`/`archive` 배열 + Source 키 추가,
    en.json 11항목 보충.
- ⚠️ **사용자가 옛 미러(yonsei-hompage.vercel.app)에서 테스트하다 "적용 안 됨" 혼선** —
  현행 라이브는 yonsei-me-homepage.vercel.app 하나뿐. 미러 정리(삭제/리다이렉트) 결정 필요.

---

## 7. 남은 일

### 실환경에서만 확인 가능 (공용 암호·API 키 필요)

- [x] 로그인 · 게시 · **시점 저장** — 팀원이 실제로 확인 (`f8d8d83`, `bd7eb36`, `fd0b8a8`)
- [ ] **시점 복원 왕복** — 저장 → 수정·게시 → 복원
- [ ] **AI 수정 실키 호출** — 변경안 목록·항목 점프·승인
- [ ] **동시 편집 충돌(409)** — 두 창에서 같은 파일 게시

### 알려진 한계 · 정리 거리

- **시점 복원의 조회 범위.** 매니페스트의 `commitSha` 는 항상 비어 있습니다(커밋을 만들기
  전엔 자기 sha 를 모름 — 설계상 정상). `versions.js shaOf()` 가 커밋 메시지의
  `[ys-cp:<id>]` 표식을 **최근 60개 커밋**에서 찾습니다. 그보다 오래된 시점은 복원이
  막히고 UI 에 경고가 뜹니다. 근본 해결안: 커밋 성공 후 `POST /git/refs` 로
  `refs/ysme-cp/<id>` 를 만들면 히스토리 깊이와 무관해집니다.
- **`--c-*` 변수 이름이 파일마다 다릅니다.** `--c-micro`(G-people) vs `--c-nanobio`(나머지),
  `--c-dyn`/`--c-manuf`. 이름 통일은 위험이 커서 **값만** 맞춰 뒀습니다.
- **`03 교수진` 제목에 `style="font-size:58px"`** 인라인 스타일이 남아 있습니다.
  팀원이 편집 도구를 시험하며 게시한 것으로, 유지/제거 미결정입니다.
- **`https://yonsei-hompage.vercel.app`** — 우리 Vercel 계정 밖(팀원 계정 추정)인데
  저장소 **루트 전체**를 서빙해 `기획_전략/` 문서와 `admin/` 소스가 공개 URL 로 열립니다.
  소유자를 찾아 삭제하거나 Root Directory 를 `design-candidates` 로 바꿔야 합니다.
- 구 콘솔 `admin/` 의 보드·게시·찾기바꾸기는 E2E 회귀를 돌리지 않았습니다.
- 심사용 데모 시나리오, 최종 제출물 패키징.

---

## 8. 함정 모음 — 여기서 시간 버리지 마세요

### ★ 백그라운드 탭 (가장 크게 당한 것)

브라우저 창이 뒤에 있으면 탭이 `document.hidden=true` 가 되고, 그러면 브라우저가
**requestAnimationFrame 과 부드러운 스크롤을 멈춥니다.** 이것 때문에

- 교수진 캐러셀이 "고장난 것처럼" 보였고 (실제로는 정상 — 우리 코드도 hidden 이면 쉽니다)
- `scrollTo({behavior:'smooth'})` 가 전부 시작 위치로 되돌아왔고
- **스크린샷이 계속 백지로** 나왔습니다

→ 애니메이션·스크롤이 걸린 것은 **헤드리스 검사 페이지**로 검증하세요(`railtest.html` 참고).
   검사용 iframe 을 화면 밖(`left:-20000px`)으로 밀지 말고 `opacity` 로만 숨길 것 —
   화면 밖이면 IntersectionObserver 가 꺼져 자동 넘김이 안 돕니다.

### 그 밖

| 함정 | 대처 |
|---|---|
| 헤드리스 스크린샷이 백지 | 스크롤 리빌 애니메이션 탓. 결함으로 오해하지 말 것 — 계산된 스타일을 읽거나 검사 페이지를 쓸 것 |
| `nav.js` 를 고쳤는데 반영 안 됨 | 브라우저 캐시. **Ctrl+Shift+R** 하드 리로드 |
| bash heredoc 안 정규식 이스케이프가 깨짐 | `\\$&` 같은 걸 넣지 말고 Edit 도구로 직접 쓰거나 정규식을 피할 것 |
| `data.js` 는 **CRLF** | `'\n'` 리터럴로 매칭하면 실패. 줄끝 무관 정규식을 쓸 것 |
| Node 에서 `/tmp` 를 `C:\tmp` 로 해석 | 임시 파일은 스크래치패드에 |
| 헤드리스 Chrome 연속 실행 시 프로필 충돌 | `--user-data-dir` 를 매번 다르게 |
| 시간 확인 | **PowerShell `Get-Date`**. Git Bash 의 `TZ=Asia/Seoul date` 는 tzdata 가 없어 9시간 어긋남 |
| 테스트가 정확 문자열 비교 | 팀원이 인라인 style 하나 게시하자 깨졌음. 속성 순서·추가에 견디게 쓸 것 |

---

## 9. Claude Code 로 이어서 작업하기

작업 폴더에서 `claude` 를 켜고 **아래를 그대로 붙여넣으세요.**

````text
이 저장소(연세대 기계공학부 사이트 공모전)의 작업을 이어서 진행한다.

시작 전에 반드시 이 순서로 읽어라.
1. HANDOFF.md          ← 전체 그림·현재 상태·남은 일·함정. 이것부터.
2. README.md           ← 실행법·개발 규칙·검증 명령
3. design-candidates/STUDIO_SPEC.md   ← 편집 스튜디오 계약서 (스튜디오를 건드릴 때만)
4. ../CLAUDE.md        ← 상위 모노레포 git 규칙 (있는 경우)

작업 지침
1. 항상 현재 시각을 확인·기록하고 시작한다. 이 PC 에서는 PowerShell `Get-Date` 를 쓴다
   (Git Bash 의 TZ=Asia/Seoul 은 9시간 어긋난다).
2. 소요 시간보다 정확도와 최종 품질을 우선한다.
3. 애매한 부분은 결정 사항을 쉽게 설명한 뒤 장단점을 정리해 결정을 요청한다.
4. subagent·skill 등 필요한 도구를 적극 쓴다. 설치한 것은 작업 후 밝힌다.
5. 계획이 서면 예상 소요 시간을 알려주고 진행한다.
6. 중간에 끊겨도 이어갈 수 있게 HANDOFF.md 의 「지금 상태」와 「남은 일」을
   작업 시작·전환·완료마다 갱신하고 커밋한다.

지켜야 할 규칙 (HANDOFF.md 5절에 상세)
- 상위 모노레포 루트에서 `git add -A` / `git add .` 금지. 항상 pathspec 으로
  자기 폴더만 스테이징하고, 커밋 전 `git diff --cached --stat` 로 확인한다.
- API 키·비밀번호는 어떤 경우에도 커밋하지 않는다.
- 스튜디오가 만드는 DOM 에는 반드시 `data-ys-ui` 를 붙인다.
- 저장되는 HTML 에 편집 UI 흔적(ys- 클래스·contenteditable·런타임 클래스)이
  들어가면 안 된다.
- 스튜디오를 고쳤으면 STUDIO_SPEC.md 도 함께 고친다.
- 없는 정보를 지어내지 않는다(실데이터 원칙).

변경 후에는 반드시 회귀 4종을 돌리고 결과 수치를 보고한다.
  cd design-candidates
  python _studio/tools/testserver.py .        # 127.0.0.1:8124
  node _studio/tools/test-posts.js                                    # 28항목
  chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/selftest.html   # 146항목
  chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/inttest.html    # 130항목
  chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/railtest.html   # 26항목

주의: 애니메이션·스크롤을 검증할 때 브라우저 탭이 백그라운드면
requestAnimationFrame 과 부드러운 스크롤이 멈춰 "고장난 것처럼" 보인다.
스크린샷도 백지로 나온다. 헤드리스 검사 페이지로 확인하라. (HANDOFF.md 8절)

먼저 HANDOFF.md 를 읽고, 현재 상태와 남은 일을 요약한 뒤
무엇부터 할지 제안해라. 내 승인 없이 코드를 고치지 마라.
````

### 특정 작업을 바로 시키고 싶을 때

위 프롬프트 끝에 한 줄만 덧붙이면 됩니다. 예:

- `남은 일 중 「시점 복원의 조회 범위」 한계를 refs/ysme-cp 방식으로 해결해라.`
- `--c-* 변수 이름이 파일마다 다른 것을 통일해라. 값은 바꾸지 말고 이름만.`
- `심사용 데모 시나리오를 만들어라. 편집 스튜디오 시연 동선 중심으로.`
