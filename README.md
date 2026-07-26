# 연세대 기계공학부 사이트 공모전 — 팀 DATUM

연세대학교 기계공학부 홈페이지 경진대회 출품 프로젝트.
이 문서 하나로 **다른 PC에서 이전 대화·작업 내역 없이 바로 이어서 작업**할 수 있도록
전체 구조·실행법·개발 규칙·현재 상태를 정리한다.

## 전략 (2축)

OT 청취 결과 "수정·보수 관리가 용이한가"가 핵심 심사 기준이라고 판단, 두 축으로 진행한다.

| 축 | 내용 | 상태 |
|---|---|---|
| 1축 | 웹사이트 디자인 & 사이트 설계 | `design-candidates/`(관제 시안, 현재 본선) · `prototype-v3/`(v3 완성본) |
| 2축 | 사이트 수정·관리 도구 | ① `admin/` 콘솔(별도 창) ② **`design-candidates/assets/studio/` 인플레이스 스튜디오** — 사이트 화면 위에서 바로 편집 |

## 배포 (Vercel)

| 프로젝트 | 서빙 폴더 | 주소 | 소유 |
|---|---|---|---|
| `yonsei-me-homepage` | `design-candidates/` | https://yonsei-me-homepage.vercel.app | 우리 계정(`kwonchanghans-projects`) — **유일한 현행 배포. 편집 스튜디오가 여기 있다** |

- 진입: 보기 `…/H-academic.html` · 편집 `…/H-academic.html?studio=1`
  (한 번 로그인하면 세션이 유지되어 다른 페이지로 넘어가도 편집이 붙어 있다)
- 루트 `/` 는 홈이 아니라 「관제 시안」 목록 페이지다.
- `prototype-v3` 프로젝트(구 `prototype-v3-nine.vercel.app`)는 2026-07-26 삭제했다.
  소스는 `prototype-v3/` 에 그대로 있으므로 필요하면 다시 배포하면 된다.

> ⚠️ **`https://yonsei-hompage.vercel.app`** 는 우리 Vercel 계정에 없다(팀원 계정 추정).
> 저장소 **루트 전체**를 서빙해서 `/%EA%B8%B0%ED%9A%8D_%EC%A0%84%EB%9E%B5/00_INDEX.md`
> (기획_전략 폴더)와 `/admin/js/editor.js` 가 공개 URL 로 열린다. 소유자를 찾아
> 프로젝트를 삭제하거나 Root Directory 를 `design-candidates` 로 바꿔야 한다.

## 폴더 구조

```
연세대_사이트 공모전/
├─ 가이드라인/        대회 안내문·참가신청서 원본·OT 정리
├─ 기획_전략/         마스터플레이북·컨셉·레드팀 분석 등 기획 문서 (00_INDEX.md부터 볼 것)
├─ prototype/         1차 시안 (참고용, 더 이상 수정하지 않음)
├─ prototype-v2/      2차 시안 (참고용, 더 이상 수정하지 않음)
├─ prototype-v3/      ★ 최신 사이트 본체 — 편집 대상은 항상 이 폴더
├─ admin/             ★ YSME Admin Studio — 관리자 편집 콘솔 (2축 산출물)
└─ preview_admin/     Admin Studio 스크린샷 (로그인·워크스페이스)
```

## 다른 PC에서 시작하기

1. 저장소 클론: `git clone https://github.com/todo0157/Contest_build.git`
   (이 폴더는 저장소 내 `연세대_사이트 공모전/`에 있다.)
   - 이미 클론된 PC라면 **저장소 루트의 `CLAUDE.md`(멀티 PC git 규칙)** 절차대로
     `git fetch` → ff-merge로 먼저 최신화한다. 커밋은 반드시 이 폴더만
     pathspec으로 지정한다 — 루트에서 `git add -A` 금지.
2. 필요 프로그램: **Chrome 또는 Edge(데스크톱)** 만 있으면 된다. 빌드 도구·npm 불필요.
   폴더 픽커가 안 열리는 환경에서만 Python 3 필요(아래 serve.py).
3. 사이트 확인: `prototype-v3/index.html`을 브라우저로 연다. 끝.
4. Admin Studio 실행: `admin/index.html`을 Chrome/Edge로 연다.
   - 최초 실행 시 관리자 계정 생성 → 「사이트 폴더 열기」→ `prototype-v3` 선택.
   - AI 초안 기능은 [aistudio.google.com](https://aistudio.google.com)에서 무료 API 키
     발급 후 「AI 어시스턴트」 탭에 입력 (키는 코드·저장소에 절대 커밋하지 않는다).
   - 안 열리면: `python admin/serve.py` → http://localhost:8787 자동 오픈.
   - 상세 사용법: **`admin/README.md`**

> **기기 간 데이터 주의**: Admin Studio의 계정·버전 스냅샷·감사 기록·API 키는
> 브라우저 로컬(IndexedDB)에만 저장된다. 다른 PC에서는 계정을 새로 만들고 키를
> 다시 입력해야 하며, 버전 이력은 넘어가지 않는다(감사 기록은 JSON 내보내기로
> 백업 가능). **사이트 파일 자체의 이력은 git이 진실**이므로, 작업 후 커밋·푸시하면
> 어느 PC에서든 동일하게 이어진다.

## 개발 규칙 (반드시 읽을 문서 2개)

0. **`design-candidates/STUDIO_SPEC.md`** — 인플레이스 편집 스튜디오 계약(파일 배치, 서버 API,
   진실 모델, 정렬 규칙, 저장 경계, i18n·모바일·AI 스키마, 합격 기준 10개). 스튜디오를 고칠 때 기준.
1. **`prototype-v3/TEMPLATE.md`** — 사이트 본체 제약. 요지:
   - 순수 HTML + CSS + Vanilla JS. ES 모듈·빌드 도구 금지, `file://`로 직접 열려야 함.
   - 콘텐츠 데이터는 `assets/js/data.js`(`window.YSME`)가 단일 원천(SSOT).
   - 스타일은 디자인 토큰만 사용: 연세 네이비 `#001a38/#002a5c/#003876/#1a5bb0`,
     골드 `#c9a227`, Pretendard + IBM Plex Mono. 이모지 금지, 좌측 정렬.
2. **`admin/ADMIN_SPEC.md`** — Admin Studio 모듈 계약(파일 배치, 로드 순서,
   `Admin.*` API 시그니처, 버스 이벤트, DOM id 목록). admin 코드를 고칠 때 기준.

## Admin Studio 아키텍처 요약 (admin/ 수정 시 필독)

- 서버 없는 정적 SPA. File System Access API(Chrome/Edge)로 사이트 폴더를 직접 읽고 쓴다.
- 계정(PBKDF2-SHA256 15만회)·버전·감사 기록은 IndexedDB `ysme-admin`에 저장.
- **핵심 원리**: "라이브 DOM은 화면, 원본(pristine) DOM이 진실."
  페이지를 열면 모든 요소에 `data-eid`를 부여해 iframe(srcdoc)에 렌더하고,
  편집은 eid로 원본 DOM에 미러링, 저장 시 eid를 제거한 원본을 파일에 쓴다.
  사이트 JS가 런타임에 넣는 상태(`.reveal.in`, `--reveal-delay`, i18n 텍스트,
  aria 토글)는 저장본에 새지 않도록 스크럽한다 — 이 불변식을 깨면 안 된다.
- 보안: AI 초안·버전 미리보기는 `sandbox="allow-scripts"`(null origin) 프레임 렌더,
  콘솔 전체에 meta CSP로 외부 유출 차단. API 키는 로그·버전·감사 기록에 절대 남기지 않는다.
  단 **보드 프레임은 sandbox를 붙이지 않는다** — 편집 캔버스와 같은 신뢰 수준(내 사이트 파일)
  이고, sandbox를 붙이면 부모가 만든 blob: 자산을 못 읽어 빈 화면이 된다.
- 보드 모드(`board.js`): 모든 페이지를 실제 렌더된 iframe 프레임으로 무한 캔버스에 펼치고
  팬·줌으로 훑다가 더블클릭하면 그 페이지를 편집 모드로 연다. 15개를 동시에 렌더하면 브라우저가
  멈추므로 IntersectionObserver로 화면 근처 프레임만 동시 2개까지 순차 렌더한다.
- 모듈(로드 순서): core → store → auth → audit → fs → versions → editor → ai → board →
  github → app → layout. 전부 classic `<script defer>`, 전역 네임스페이스 `Admin.*`.

## 인플레이스 스튜디오 사용법 (2축 핵심)

배포된 사이트를 방문자처럼 돌아다니면서 그 화면 위에서 고친다. 별도 콘솔을 열지 않는다.

1. https://yonsei-me-homepage.vercel.app/H-academic.html**?studio=1** 로 접속
2. 공용 암호 + 편집자 이름 입력 → 우하단에 버튼 7개가 뜬다
   (편집 · 글등록 · 버전 · AI · 모바일 · 한·영 · 게시)
3. 「편집」을 켜고 글자를 클릭해 고친다. **초안은 브라우저에 쌓이고, 「게시」를 눌러야 파일에 반영된다**
   (여러 페이지·여러 파일이 GitHub 커밋 **1개**로 묶인다).
4. 페이지를 옮겨도 편집 세션과 초안이 유지된다. 「편집」을 끄면 방문자와 완전히 동일하게 동작한다.
5. 단축키: `E` 편집 토글 · `Ctrl+S` 초안 저장 · `Ctrl+Shift+P` 게시 · `Ctrl+Z/Y` 되돌리기 · `Esc` 선택 해제

- **세션이 없으면 스튜디오 파일을 요청조차 하지 않는다** — 방문자 경험에 영향 0.
- 서버 함수 env(`GH_TOKEN`·`PUBLISH_PASSCODE` 등)는 Vercel 프로젝트 설정에만 있다. 저장소에 넣지 않는다.
- 화면의 카드·공지·교수 목록처럼 `assets/js/data.js` 가 그리는 영역은 HTML 이 아니라 **데이터 필드 편집**으로 안내된다.
- 영어 전환 중에 고친 글은 HTML 이 아니라 `assets/i18n/en.json` 사전에 들어간다.

### 새 공지·소식 등록 (「글등록」 버튼)

공지·뉴스·세미나·행사는 HTML 이 아니라 `assets/js/data.js` 의 배열이 원본이므로 화면 조작으로는
만들 수 없다. 「글등록」 패널이 그 배열 맨 앞에 항목 하나를 끼워 넣는다.

1. 분류 선택 — 학부 공지 / 대학원 공지 / 연구 소식 / 세미나 / 행사 (노출 위치가 함께 표시된다)
2. 제목·날짜(기본 오늘)·링크·첨부 여부를 넣고 「등록」. 입력칸은 기존 항목의 실제 필드에서
   자동으로 만들어지므로 데이터 모양이 바뀌어도 폼이 따라간다.
3. 등록한 글은 목록에 **미게시** 배지로 표시된다. 「게시」를 눌러야 사이트에 나간다.
   그 전까지는 같은 패널에서 삭제할 수 있다.

번호(`no`)를 `공지` 로 두면 목록 맨 위에 고정 표시된다. 세미나·행사는 다음 번호가 자동으로 채워진다.

### 홈 한/영 사전 문장 (「홈 사전」 칩이 붙는 문장)

홈(`H-academic.html`)의 히어로·섹션 제목 등은 인라인 스크립트의 `var I18N = {ko:…, en:…}` 이
`textContent` 를 덮어쓴다. 이런 문장을 고를 때 인스펙터는 **한국어·English 두 칸**을 함께 보여 주고,
고치면 사전 값과 HTML 폴백 텍스트를 동시에 갱신한다(`assets/studio/pagedict.js`).
예전처럼 "한/영 패널에서 고치세요" 로 막지 않는다.

스크롤할 때 0부터 올라가는 숫자(`data-count`)는 「최종 숫자」 칸에서 목표값을 고친다.

## 사이트 인터랙션 (1축)

### 분야 아이콘 (`G-people.html` · `H-academic.html`)

여섯 개 연구 분야를 육각 글리프로 표시한다. 한양대 기계공학부 학문분야 페이지의 정보 설계를
우리 데이터에 맞춰 옮긴 것이다.

- 구성원 페이지: 사진 **왼쪽 레일**에 6칸. 그 교수의 분야만 색으로 채운다.
  채워진 칸이 섹션마다 아래로 내려가 "지금 어느 분야를 보는지"가 위치로 읽힌다.
  활성 칸을 누르면 그 분야만 걸러 본다(비활성 칸은 `aria-hidden` 장식 — 33장×6개를
  전부 탭 정지점으로 만들지 않는다. 걸러 보기의 정식 경로는 위쪽 칩이다).
- 홈: 카드가 작아 6칸 대신 **배지 1개**. 같은 글리프·같은 색을 쓴다.
- 교수당 소속 분야는 데이터상 하나뿐이다. 없는 교차 분야를 지어내지 않는다.

### 몰입 구역 커서 (`assets/cursor.js`)

한화에어로스페이스 제품 소개 구역처럼 **일부 영역에서만** 커서가 바뀐다.
즉시 따라오는 점 + 관성으로 늦게 따라오는 링, 두 겹 구조다.

```html
<div data-cursor-zone>                     <!-- 이 안에서만 커서가 바뀐다 -->
  <a data-cursor="분야 보기"> … </a>        <!-- 링 안에 이 말이 뜬다 -->
</div>
```

현재 구역: 홈 연구 분야 목록(`#areaGrid`), 연구 페이지 분야 카드(`#fieldGrid`).

지켜야 할 것:
- 기본 커서를 **전역으로 없애지 않는다.** `cursor:none` 은 JS 가 성공했을 때만 붙는
  `html.ycur-live` 아래에서만 걸려, 스크립트가 죽어도 커서가 사라지지 않는다.
- 터치·호버 불가·`prefers-reduced-motion`·폭 900px 미만이면 **아예 만들지 않는다.**
- 편집 스튜디오가 편집 모드면 스스로 물러난다(선택 상자와 싸우면 안 된다).
- 만드는 DOM 은 전부 `data-ys-ui` — 편집 대상·번역 대상에서 빠진다.
- 커서 라벨(`data-cursor`)은 속성 스캔 대상이 아니므로 `extract-i18n.js` 의 `EXTRA` 에 적어 둔다.

## 검증 방법 (수정 후 회귀 확인)

- 스튜디오 자동 검증 2종 — `design-candidates/` 에서 로컬 서버를 띄우고 헤드리스 Chrome 으로 돌린다:
  ```
  cd design-candidates
  python _studio/tools/testserver.py .                 # 127.0.0.1:8124, /hang 으로 load 를 붙잡는다
  chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/selftest.html
  chrome --headless --disable-gpu --dump-dom http://127.0.0.1:8124/_studio/inttest.html
  ```
  덤프 끝의 `PASSED` / `FAILED` 와 각 항목의 `ok` / `FAIL` 을 확인한다.
  - `selftest` — 8페이지 전부에서 원문 스캔·DOM 대응·오프셋 정합성·편집 후 **바이트 동일 복귀**·
    라이브 정렬(88~97%)·nav.js 주입물 제외·JS 생성 영역 판별. (146항목)
  - `inttest` — 실제 페이지에 스튜디오를 부팅해 저장본 오염 0·원자 게시(커밋 1개)·이동 후 초안 지속·
    체크포인트 매니페스트·모바일 프레임·한영 편집 분리·홈 사전 인플레이스 편집·카운트업 숫자·
    공지 등록/삭제 왕복·패널 연결·런타임 오류 0. (87항목)
- 서버 없이 도는 단위 검사 — 실제 `assets/js/data.js` 로 배열 삽입·삭제를 왕복시킨다:
  ```
  node design-candidates/_studio/tools/test-posts.js      # 28항목
  ```
  새 항목을 넣어도 (1) JS 로 다시 평가되고 (2) diff 가 그 항목 7줄만 잡고 (3) 지우면
  바이트 단위로 원본과 같아지는지 본다.
- 화면 눈으로 확인 — `_studio/shot.html?panel=inspect|post|versions|ai|lang|mobile|publish`,
  `&sel=<CSS 선택자>` 로 특정 요소의 인스펙터를 띄울 수 있다:
  ```
  chrome --headless --screenshot=out.png --window-size=1280,1000 \
    "http://127.0.0.1:8124/_studio/shot.html?panel=inspect&sel=h1[data-i18n=heroTitle]"
  ```
- 문법: `node --check admin/js/*.js`
- E2E: headless Chrome `--dump-dom`은 load 직후 덤프되므로, 테스트 페이지에
  `<img src="/hang">`(30초 지연 응답 엔드포인트) 블로커를 두고 테스트 완료 시
  `blocker.remove()`로 load를 발화시키는 기법을 쓴다. 마지막 회귀 23/23 통과
  (sandbox 격리, aria 복원, prototype-v3/index.html 라운드트립 무결성 포함).

## 현재 상태 & 다음 할 일

- [x] 2축 기본: Admin Studio 4기능(비주얼 편집 / Gemini AI 초안 / 버전 롤백 / 계정·감사 기록)
      구현·적대 리뷰 4건 수정·E2E 검증 완료 (2026-07-10, 23/23).
- [x] 2축 확장: GitHub 게시(공동 게시 암호 방식 / 개인 토큰 방식)와 게시 기록 패널,
      패널 폭 조절·접기.
- [x] 2축 확장: 보드 모드(전 페이지 캔버스 개요)와 편집 UX 개선(요소 태그 칩,
      클릭 가능한 요소 경로 브레드크럼, 단축키 세트 + 도움말 모달, 페이지 검색).
- [x] **2축 재설계: 인플레이스 편집 스튜디오** (2026-07-25) — 사이트 화면 위에서 바로 편집, 페이지를
      옮겨도 유지, 이름+시각 시점 저장(GitHub 커밋 기반), AI 다건 변경안 개별 승인, 한/영·모바일 전환.
      `design-candidates/STUDIO_SPEC.md` 가 계약, `design-candidates/api/` 가 서버 함수.
      검증: selftest 8페이지 통과 + inttest 통과(저장본 오염 0·런타임 오류 0).
      핵심 결정은 **DOM 재직렬화를 버리고 원문 오프셋 치환**을 쓴 것 — 무편집 저장이 바이트 동일하고
      텍스트 한 줄 수정이 diff 한 줄이 된다.
- [x] **편집 막힘 해소 + 글 등록** (2026-07-26)
      - `assets/studio/pagedict.js` — 홈 인라인 `var I18N` 을 오프셋 치환으로 고친다.
        「홈 사전」 문장의 텍스트 칸이 더 이상 잠기지 않고 한국어·English 두 칸으로 바로 편집된다.
      - `data-count` 숫자를 「최종 숫자」 칸에서 직접 고친다(속성 칸 중복 제거).
      - `assets/studio/posts.js` + `datamap` 배열 삽입/삭제 — 공지·뉴스·세미나·행사 등록.
      - `core.js` 회귀 수정: `Y.store.get` 이 없는 키에 IDBRequest 객체를 돌려주던 것을 `undefined` 로.
      - 검증: selftest 146 · inttest 87 · test-posts 28 전부 통과, 런타임 오류 0.
- [x] 구 배포 정리 (2026-07-26): `prototype-v3` Vercel 프로젝트 삭제.
- [ ] **`yonsei-hompage.vercel.app` 정리** — 우리 계정 밖. 소유자를 찾아 삭제/Root Directory 변경 요청.
      현재 `기획_전략/` 문서와 `admin/` 소스가 공개 URL 로 열린다.
- [ ] 실제 환경 잔여 검증: 체크포인트 **복원** 왕복(실제 GitHub 커밋), AI 실키 호출, 여러 사람 동시 편집 충돌(409).
- [ ] 2축 구 콘솔(`admin/`) 확장분 회귀 — 보드·게시·찾기바꾸기는 아직 E2E 회귀를 돌리지 않았다.
- [ ] 1축: 디자인·설계 추가 개선.
- [ ] 심사용 데모 시나리오(인플레이스 스튜디오 시연 동선) 정리.
- [ ] 최종 제출물 패키징.

> 기기 간 주의: 스튜디오의 **초안 버퍼·AI 키는 브라우저 IndexedDB** 에만 있다(게시 전에는 다른 PC 에서 안 보인다).
> 반면 **버전 시점은 GitHub 커밋 + `_studio/checkpoints.json`** 이므로 어느 PC 에서든 같은 이력을 본다.
