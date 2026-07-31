# YSME In‑Place Studio — 계약서(SPEC)

사이트 화면 위에서 바로 편집하는 관리자 도구. 기존 콘솔(`../admin/`)은 그대로 남기고,
이 문서는 **사이트에 내장되는 인플레이스 편집 오버레이**의 계약을 정의한다.
구현·수정 시 이 문서가 기준이다. (배경 조사 결과는 `../admin/ADMIN_SPEC.md` 와 병행 참조)

## 0. 확정된 결정 사항

| 항목 | 결정 |
|---|---|
| 편집 대상 | `design-candidates/` (사이트 A) — 배포 `https://yonsei-me-homepage.vercel.app` |
| 저장 모델 | **초안 버퍼 → 명시적 「게시」**. 게시 = 여러 파일 1커밋(원자적) |
| 버전 관리 | **GitHub 커밋 기반 사이트 전체 시점** + 이름·시각 매니페스트 |
| 언어 | 한/영 2개, **8페이지 본문 전체** (텍스트키 사전 = msgid 는 한국어 원문) |
| 모바일 | **진짜 모바일 렌더**(390px 동일 오리진 프레임 + pointer 에뮬레이션), 저장 산출물은 공통 파일 |
| AI | 서버 프록시 경유(`/api/ai`), 브라우저 키 입력란 유지, 응답은 **JSON 패치 계획** |
| 노출 | `nav.js` 에 로더 1블록만 상주, 암호 통과 후 본체 동적 로드 |

## 1. 파일 배치

```
design-candidates/
├─ vercel.json                내부 경로(_studio) 비공개 + 보안 헤더
├─ api/
│  ├─ publish.js              파일 I/O · 다중파일 원자 커밋 · 이력 · 체크포인트
│  └─ ai.js                   Gemini/Claude 프록시 (키 미저장)
├─ assets/
│  ├─ nav.js                  (수정) 스튜디오 로더 블록 추가
│  ├─ i18n.js                 (신규) 방문자용 한/영 적용 런타임
│  ├─ i18n/en.json            (신규) 한→영 사전 { "한국어 원문": "English" }
│  └─ studio/                 (신규) 편집 오버레이 — 암호 통과 후에만 로드
│     ├─ boot.js              게이트 · 세션 · 모듈 로더 · 페이지 이동 간 부활
│     ├─ core.js              네임스페이스 · 버스 · IndexedDB(초안/세션/계획)
│     ├─ net.js               api 클라이언트
│     ├─ align.js             원본 DOM ↔ 라이브 DOM 정렬
│     ├─ source.js            HTML 원문 스캔 · 오프셋 편집 원시연산 (= 저장 경계)
│     ├─ engine.js            원본 진실 모델 · eid · 편집 적용 · undo/redo · patchPage(다른 페이지)
│     ├─ replace.js           찾아 바꾸기 — 원문을 훑어 **사람이 읽는 글자만** 바꾼다
│     │                       (텍스트·보이는 속성값·스크립트 문자열 / 태그·class·href·주석 제외)
│     ├─ datamap.js           data.js 소유 판별 + JSON 소스 오프셋 편집 · 배열 항목 추가/삭제
│     ├─ pagedict.js          홈 인라인 `var I18N` 사전의 소스 오프셋 편집
│     ├─ posts.js             공지·뉴스·세미나·행사 등록 패널
│     ├─ diff.js              LCS 라인 디프
│     ├─ hud.js               플로팅 버튼 · 상태바 · 인스펙터
│     ├─ versions.js          이름+시각 시점 저장 · 목록 · 디프 · 복원
│     ├─ ai.js                변경안 계획 · 토글 목록 · 항목 점프/디프/승인
│     ├─ i18n-edit.js         한/영 편집 모드
│     ├─ mobile.js            모바일 렌더 모드
│     └─ studio.css           오버레이 스타일 (전 선택자 `.ys-` 접두)
└─ _studio/checkpoints.json   이름 붙인 시점 매니페스트 (웹 비공개)
```

**불변식**: `assets/studio/` 와 `api/` 는 사이트 방문자 경험에 어떤 영향도 주지 않는다.
`nav.js` 로더는 세션/쿼리 플래그가 없으면 **아무것도 로드하지 않는다**.

## 2. 서버 계약 — `POST /api/publish`

공통 요청 필드: `{ action, passcode, ... }` · 실패 응답 `{ error: string }` + 적절한 HTTP 코드.
CORS 헤더를 **주지 않는다**(동일 오리진 전용). 암호 불일치 시 400ms 지연 후 401.
env: `GH_TOKEN` `GH_OWNER` `GH_REPO` `GH_BRANCH`(기본 main) `GH_BASEPATH`(= `design-candidates`)
`PUBLISH_PASSCODE` `GH_AUTHOR_EMAIL`.

| action | 요청 | 응답 |
|---|---|---|
| `auth` | – | `{ ok:true, branch, headSha }` |
| `list` | – | `{ pages:[{path,name}], assets:[{path,name}], headSha }` — 서버에서 basePrefix 필터 |
| `read` | `{path, ref?}` | `{ content, blobSha, ref }` — `ref` 미지정 시 브랜치 HEAD |
| `commit` | `{message, files:[{path,content,encoding?}], deletions?, author, baseSha?}` | `{ ok:true, commit:{sha,html_url}, headSha, files:[path] }` · `baseSha`≠HEAD → **409** `{conflict:true, headSha}` |
| `history` | `{path?, limit?}` | `{ commits:[{sha,message,author,date,url}] }` |
| `checkpoints` | – | `{ items:[Checkpoint] }` (없으면 `[]`) |

- `commit` 은 **Git Trees API** 사용: blobs → tree(base=현재 tree) → commit → ref 갱신. 파일 N개 = 커밋 1개.
- 경로 검증: `..` 금지, `^[A-Za-z0-9](?:[A-Za-z0-9._/-]*)$`, 쓰기 허용 확장자
  `html css js json svg png jpg jpeg webp avif ico txt md`. 위반 → 400.
- `Checkpoint` = `{ id, name, note, ts, author, commitSha, files:[path] }`.
  체크포인트 생성은 별도 액션이 없다 — `_studio/checkpoints.json` 을 **같은 `commit` 에 포함**시킨다.

## 3. 서버 계약 — `POST /api/ai`

`{ passcode, provider:'gemini'|'claude', model, apiKey?, system?, messages:[{role,content}], json?:true, schema? }`
→ `{ text }` 또는 `json:true 일 때 { data }` · 오류는 `{ error, status }`.

**계획 스키마는 두 갈래다.**
- `changes[]` — 요소 하나를 고친다(eid 기준). 최대 10건.
- `replacements[]` — `{id, find, replace, why}`. 「A 를 B 로」 같은 **일괄 치환**.
  AI 는 무엇을 무엇으로 바꿀지만 정하고, 빠짐없이 찾는 일은 클라이언트(`replace.js`)가 한다.
  상한이 없다. 아웃라인은 텍스트 리프만 담아 `<title>`·`<meta>`·속성값·인라인 사전을
  통째로 놓치므로, 요소를 열거시키면 **반드시 빠진다**(H-academic.html 의 '연세대학교'
  13곳 중 아웃라인에 오르는 건 1곳뿐이다). 범위가 「전영역」이면 replacements 만 쓴다.

`{ passcode, probe:true }` → `{ ok:true, serverKey:{gemini:bool, claude:bool} }`
브라우저가 "서버에 키가 있나" 만 묻는 질의. **불리언만 돌려주고 키 값은 절대 내보내지 않는다.**
페이지를 열 때마다 부르는 값싼 질의라 호출 제한에서 제외한다.

env: `PUBLISH_PASSCODE`(필수) · `GEMINI_API_KEY` · `ANTHROPIC_API_KEY`
`AI_RATE_MAX`(기본 100) · `AI_RATE_WINDOW_MS`(기본 300000) — IP 당 5분에 100회.

- **키는 두 갈래.** 본문 `apiKey` 가 있으면 그것을, 없으면 서버 환경변수의 키를 쓴다.
  둘 다 없으면 400. 개인 키가 서버 키보다 우선한다.
- 서버 키 경로에서는 **공용 암호가 곧 요금 방어선**이다. 그래서 IP 별 고정 창 호출 제한을 둔다.
  인스턴스 메모리에만 있으므로 인스턴스가 여러 개면 그만큼 느슨하다 —
  완전한 방어가 아니라 과금 사고를 막는 속도 방지턱이다. 초과 시 429 + `Retry-After`.
- 암호 검증 필수(오픈 프록시 방지). **API 키는 로그·저장·에코 금지.**
- Gemini: `x-goog-api-key` 헤더 사용(URL 쿼리 금지). `json:true` → `responseMimeType:'application/json'` + `responseSchema`.
- Claude: `x-api-key` + `anthropic-version: 2023-06-01`. 스키마는 tool 강제 대신 프롬프트+검증으로 처리.

## 4. 진실 모델 (engine.js)

```
파일 원문(문자열)  ──DOMParser──▶  pristineDoc (+ data-eid)   ◀── 모든 편집이 여기에 기록된다
                                        │
                                   align.js 정렬
                                        ▼
                                  라이브 document (화면) ── 사이트 JS 가 이미 변형시킨 상태
```

- **eid 는 파일에서 파싱한 pristine 에서만 발급**한다. 라이브 DOM 을 태깅하지 않는다
  (라이브에는 사이트 JS 가 만든 노드가 섞여 있어 1:1 대응이 깨진다).
- 편집은 pristine 에 기록하고, 화면에는 같은 편집을 **개별 반영**한다(라이브→pristine 미러링 금지).
- 저장(초안) = **편집이 누적된 원문 문자열 그대로**. DOM 을 다시 직렬화하지 않는다(§4.2).
- undo/redo = pristine 전체 HTML 문자열 스냅샷(경로별 최대 60개). 복원 시 페이지를 다시 그리지 않고
  **바뀐 eid 만 라이브에 재적용**한다(전체 재렌더는 인플레이스에서 곧 세션 파괴다).

### 4.1 정렬 규칙 (align.js)

라이브에서 **무시**할 노드(사이트가 런타임에 만든 것):
`.ynv`, `.ysub`, `.ytop`, `.ynv-ovl`, `footer.yft`, `[data-ys-ui]`, 스튜디오가 넣은 `<style>`.
pristine 에만 있는 **유령** 노드(nav.js 가 DOM 에서 제거함): `.cta`, `footer:not(.yft)`.

정렬 키 = `tag + '#' + id + '.' + (class 목록 − 런타임 클래스, 정렬)`.
런타임 클래스(정렬·저장 양쪽에서 무시): `in vis fade ttl-on ysub-hide on cur open min show dim-others`.
자식 목록은 이 키로 LCS 정렬하고, 짝지어진 쌍만 재귀한다. 결과:

반환 API: `indexOf(liveEl)` → 원본 인덱스 또는 `null` · `nearest(liveEl)` → `{index, live, self}`
(가장 가까운 "파일 소유" 조상. `self:false` 면 클릭한 요소 자신은 파일에 없다) · `liveOf(idx)` · `i2l` · `l2i` · `stats`.

**소유 판정은 짝의 유무 하나로 정한다.** 짝이 있으면 파일 소유(편집 가능), 없으면 사이트 JS 생성물이다.
JS 생성물의 텍스트는 화면에서 직접 고칠 수 없다(고쳐도 다음 로드에 사라짐) → `datamap` 으로 라우팅한다.
단, 파일에 자리표시자 마크업이 있는 컨테이너(예: 홈 `#newsGrid` 의 대체 링크 1개)는 그 자리표시자와
짝이 맺어지는 것이 정상이다 — 그래서 HUD 는 편집 전에 항상 `datamap.ownerOf()` 를 먼저 확인한다.

### 4.2 저장 경계 (source.js)

**별도의 스크럽(오염 제거) 단계가 없다.** 라이브 DOM 이 저장 경로에 아예 닿지 않기 때문이다.
저장되는 것은 파일 원문 문자열이고, 편집은 그 문자열의 해당 구간만 치환한다(`source.js`).
따라서 사이트 JS 가 화면에 붙인 클래스(`in`·`fade`·`sfade`·`ysub-hide`), 카운트업이 덮어쓴 숫자,
`applyLang` 이 바꾼 텍스트, 인라인 `opacity`, 스튜디오 자신의 UI 노드는 **원문에 들어갈 통로가 없다.**

지켜야 할 규칙은 두 가지다.

1. **라이브 → 원문 방향으로 값을 읽어 오지 않는다.** 인스펙터가 보여 주는 값은 항상 원문에서 읽는다
   (`source.getAttr`·`source.text`). 라이브 `textContent`/`getComputedStyle` 은 참고 표시용으로만 쓴다.
   특히 `[data-count]`·`[data-i18n]` 요소는 라이브 텍스트가 이미 다른 값이므로 편집을 막거나 사전으로 돌린다
   (`engine.runtimeManaged(idx)`).
2. **스튜디오가 만든 노드는 최상위 컨테이너에 `data-ys-ui` 를 붙인다.** `align.js` 가 이 속성으로 걸러 내므로
   짝이 생기지 않고, 따라서 편집·저장 대상이 될 수 없다.

이 두 규칙이 지켜지는지는 `_studio/selftest.html`(8페이지 라운드트립)과 `_studio/inttest.html`
(부팅·편집 후 저장본에 `data-ys-ui`·`ys-`·`contenteditable`·`sfade` 0건)이 자동으로 검증한다.

### 4.3 data.js 소유 영역 (datamap.js)

컨테이너 id → 데이터 경로 매핑(초기값):

| 페이지 | 컨테이너 | 데이터 경로 |
|---|---|---|
| H-academic | `newsGrid` | `newsList[]` |
| H-academic | `ntList` | `noticesUG[]` + `noticesGrad[]` |
| H-academic | `smList` | `seminars[]` |
| H-academic | `areaGrid` | `clusters[]` |
| H-academic | `pGrid` | `professors[]` (무작위 셔플 주의) |
| G-people | `rows`, `cChips` | `professors[]`, `clusters[]` |
| G-research | `fieldGrid`, `clusterBlocks`, `statRow`, `lvGroups`, `internSum` | `clusters[]`, `labs[]` |
| G-news | `newsRows`, `semRows`, `evtRows` | `newsList[]`, `seminars[]`, `events[]` |
| G-graduate | `gradClusterBlocks` | `clusters[]`, `labs[]` |
| G-admissions | `schInternal` | `scholarshipsInternal[]` |

- `assets/js/data.js` 는 `window.YSME = {…};` 이며 중괄호 안은 **순수 JSON**이다.
- 편집은 **소스 오프셋 치환**으로 한다: JSON 을 스캔해 각 값의 `[start,end)` 를 기록하고 해당 구간만 갈아낀다.
  전체 재직렬화(`JSON.stringify`)는 165KB 파일 전체 diff 를 만들므로 금지.

### 4.4 배열 항목 추가·삭제 (datamap.js · posts.js)

새 공지·뉴스는 화면에 없는 것을 만드는 일이라 오프셋 **삽입**으로 처리한다.

- 들여쓰기는 파일에서 읽어 낸다: `[` 와 첫 항목 사이 공백에서 항목 들여쓰기,
  첫 항목 안의 첫 줄바꿈에서 필드 들여쓰기. 하드코딩하지 않는다.
- 기본은 **맨 앞 삽입**(최신 글이 위). 삭제는 항목 구간 + 인접 쉼표 하나를 함께 지운다.
- 삽입/삭제 후 즉시 재파싱해 깨지면 원문으로 되돌린다(초안 오염 방지).
- 등록 폼의 입력칸은 `shapeOf(coll)` — **기존 첫 항목의 실제 필드**에서 만든다.
  데이터 모양이 바뀌어도 폼이 따라가고, 존재하지 않는 필드를 만들지 않는다.
- 불변식: **항목 1개 추가 → diff 는 그 항목 줄만. 추가 후 삭제 → 바이트 동일 복귀.**
  (`_studio/tools/test-posts.js` 가 실제 `data.js` 로 검사)

| 분류 | 컬렉션 | 노출 |
|---|---|---|
| 학부 공지 | `noticesUG` | 홈 공지사항 · G-news |
| 대학원 공지 | `noticesGrad` | 홈 공지사항(대학원 탭) · G-news |
| 연구 소식 · 뉴스 | `newsList` | 홈 연구 소식 · G-news |
| 세미나 | `seminars` | 홈 세미나 · G-news |
| 행사 | `events` | G-news 행사 목록 |

## 5. i18n (한/영)

- **한국어 = 파일의 진실.** HTML 은 항상 한국어를 담는다.
- `assets/i18n/en.json` = `{ "<한국어 원문>": "<English>" }` (gettext 의 msgid 규약).
- `assets/i18n.js` 가 `localStorage['ysme-lang']==='en'` 일 때 텍스트 노드를 훑어 치환한다.
  치환 제외 영역: `.ynv`, `.ynv-ovl`, `footer.yft`, `.ytop`, `[data-ys-ui]`, `script`, `style`,
  그리고 **홈의 인라인 사전이 관리하는 `[data-i18n]`**(중복 번역 방지).
  JS 가 나중에 그리는 영역까지 덮기 위해 렌더 후 1회 + MutationObserver 로 재적용한다.
- 속성도 대상: `alt`, `title`, `aria-label`, `placeholder`.
- **편집 규칙**: EN 모드에서 텍스트를 고치면 `en.json`(초안)에 기록되고 HTML 은 건드리지 않는다.
  KO 모드에서 고치면 HTML(pristine)이 바뀌고, 그 원문에 대한 `en.json` 항목은 **새 원문으로 이관**된다.
- 번역이 없는 문장은 EN 모드에서 한국어로 남고, 스튜디오가 「미번역」으로 표시한다.
  한글이 하나도 없는 조각(숫자 `33`·연도 `1962`·`SCROLL` 등)은 애초에 사전 대상이 아니므로 세지 않는다.

### 5.1 홈 인라인 사전 (pagedict.js)

홈(`H-academic.html`)만 예외적으로 인라인 스크립트의 `var I18N = { ko:{…}, en:{…} }` 가
`[data-i18n]` 요소의 `textContent` 를 통째로 덮어쓴다(`applyI18n`). 화면에서 고쳐도 새로고침이면
사라지므로 **사전 자체를 고친다.**

- JS 객체 리터럴을 직접 스캔해 문자열 값의 `[start,end)` 를 잡고 그 구간만 갈아낀다.
  따옴표 종류는 **원문 그대로 유지**하고, `\n`·`\r`·`U+2028`·`U+2029` 만 이스케이프한다.
  (무변경 재인코딩이 바이트 동일해야 한다 — 검증됨: ko/en 각 70항목)
- 인스펙터는 그 문장을 **한국어·English 두 칸**으로 보여 준다. 잠그지 않는다.
- 사전의 **첫 언어(ko)** 를 고치면 HTML 폴백 텍스트(`<h1 data-i18n="…">…</h1>`)도 같이 맞춘다
  — 스크립트가 실패해도 같은 문장이 보이게. 영어만 고치면 HTML 은 건드리지 않는다.
- 화면 반영은 직접 넣는다: `resyncLive()` 는 런타임 관리 요소를 건너뛰기 때문이다.
- `data-count`(스크롤 카운트업)는 화면 숫자가 애니메이션 소유이므로 「최종 숫자」 칸이
  `data-count` 속성을 고친다. 같은 값을 속성 목록에 중복 노출하지 않는다.

## 6. 모바일 모드 (mobile.js)

- 같은 오리진 `<iframe>` 에 **실제 페이지 URL**을 로드한다(자산 경로 치환 불필요).
  폭 390px · `?ysstudio=frame` 로 프레임임을 알리고, 프레임 안에서 `matchMedia` 를 감싸
  `(pointer: fine)` → false, `(hover: hover)` → false 로 보고해 모바일 분기를 재현한다.
- 프레임 문서에 같은 엔진을 붙여 편집한다(엔진은 `(doc, win)` 을 인자로 받는다).
- 저장 산출물은 데스크톱과 **동일한 파일**이다. 모바일 전용 오버라이드는 만들지 않는다.

## 7. HUD (hud.js)

화면 우하단 세로 스택(모두 `data-ys-ui`, Shadow DOM 없이 `.ys-` 접두 + `z-index: 2147483000`):

| 버튼 | 동작 |
|---|---|
| `편집` | 선택·편집 모드 on/off (off 면 방문자처럼 링크·탭·모달이 정상 동작) |
| `글등록` | 공지·뉴스·세미나·행사 등록/삭제 (data.js 배열) — §4.4 |
| `버전 관리` | 이름+시각 시점 저장 / 목록 / 디프 / 복원 |
| `AI 수정` | 키 등록 → 요청 → 변경안 토글 목록 → 항목별 점프·디프·승인 |
| `모바일` | 모바일 렌더 모드 토글 |
| `한/영` | 편집 대상 언어 전환 |
| `게시` | 초안 전체를 1커밋으로 배포 (변경 파일 수·요약 확인 후) |

- 상태바: 현재 페이지 · 미저장 초안 수 · 세션 편집자 · 마지막 게시 시각.
- 편집 모드에서 링크 클릭은 **막지 않는다**. 페이지 이동 시 초안은 IndexedDB 에 남아 다음 페이지에서 이어진다.
- 단축키: `Ctrl+S` 초안 저장, `Ctrl+Shift+P` 게시, `Ctrl+Z/Y` undo/redo, `Esc` 선택 해제, `E` 편집 토글.

## 8. AI 변경안 계약 (ai.js)

응답은 반드시 다음 JSON 스키마를 만족한다(문서 전체 반환 금지 — 잘리면 페이지가 파괴된다).

```json
{
  "summary": "무엇을 왜 바꿨는지 2~3줄",
  "changes": [{
    "id": "c1",
    "page": "H-academic.html",
    "lang": "ko|en",
    "target": { "kind": "eid|dataPath|i18nKey", "value": "e123" },
    "op": "setText|setAttr|setStyle|replaceOuter|insertAfter|remove",
    "attr": "setAttr 이면 속성 이름, setStyle 이면 CSS 속성 이름 (그 외 생략)",
    "before": "기존 값(표시용)",
    "after": "새 값",
    "why": "한 줄 근거"
  }]
}
```

- `changes` 항목 수 상한 10. 컨텍스트는 페이지 전체 HTML 대신 **eid 아웃라인**(eid·태그·텍스트 요약)을
  보내고, 필요한 요소만 2차 턴에서 `outerHTML` 로 확장한다.
- UI: 토글 목록에서 항목을 열면 `그 페이지로 이동 → 대상 강조 → 기존/변경 디프`. 항목별 승인/거절.
  승인된 항목만 초안에 반영된다. 계획은 IndexedDB `plans` 에 남아 페이지를 옮겨도 유지된다.

### 8-1. 일괄 치환 (`replacements`)

「A 를 B 로 바꿔」 는 `changes` 로 받지 않는다. 아웃라인은 텍스트 리프만 담아
`<title>`·`<meta>`·속성값·인라인 사전을 통째로 놓치고, 상한 10 에도 걸린다.
AI 는 **무엇을 무엇으로** 만 정하고, 빠짐없이 찾는 일은 `replace.js` 가 한다.

```json
"replacements": [{ "id": "r1", "find": "찾을 말", "replace": "바꿀 말", "why": "한 줄 근거" }]
```

- 범위가 「전영역」이면 **replacements 로만** 답한다(changes 는 이 페이지 전용이다).
- 곳(hit)의 종류 — 목록의 칩이자 「이동」 가능 여부의 기준이다.

  | kind | 칩 | 어디 | 화면에 보이나 |
  |---|---|---|---|
  | `text` | 글 | `<body>` 안 텍스트 | **보인다** — 「이동」이 그 자리를 찍는다 |
  | `head` | 탭·검색 | `<head>` 안 텍스트(`<title>`) | 안 보인다 |
  | `attr` | 정보 | alt·aria-label·meta content … | 안 보인다 |
  | `script` | 사전 | 인라인 스크립트 문자열 | 안 보인다 |

  `head` 를 `text` 와 섞으면 「글」인 줄 알고 눌렀는데 아무 일도 안 일어난다 — 반드시 가른다.

- **부분 승인**: 곳마다·페이지마다 체크박스. `plan(src, find, replace, {only:[번호…]})` 로
  고른 곳만 바꾼다. 하나도 안 고른 페이지는 초안조차 만들지 않는다.
- **되돌리기**: 바꾼 자리와 글자를 `applied[{at,from,to}]` 로 남겨 뒤에서부터 되감는다
  (바이트 동일 복구). 그 사이 같은 자리가 또 바뀌었으면 그 곳만 건너뛰고 개수를 알린다.
- **사전 이관**: `en.json` 은 한국어 원문이 키다. 원문을 바꾸면 키도 바꿔야 영문 전환이
  깨지지 않는다. 바꾼 키 쌍을 남겨(`i18nEdit.replaceInKeys` → `renameKeys`) **그 쌍만** 되돌린다.
  문자열로 되돌리면 원래부터 그 말이 있던 키(예: 타 대학 소속 연사)까지 바꿔 버린다.

### 8-2. 「이동」 규칙 (두 단계)

1. **이동** — 그 자리로 스크롤하고 **위치만** 표시한다(`hud.revealIdx(idx,{arm:true})`).
   보고 있던 목록은 그대로 두고 편집 모드만 켠다. 패널을 곧바로 갈아 끼우면
   무엇을 고르러 왔는지 맥락이 끊긴다.
2. **그 자리를 클릭** — 그때 「요소 편집」이 열린다(스튜디오 본래 동작).
   맨 위에 「← …목록으로」(`hud.setReturn`)가 붙어 한 번에 돌아온다.
   돌아가기 줄은 **그 요소를 골랐을 때만** 뜬다.

다른 페이지의 곳이면 브라우저가 그 페이지를 통째로 다시 연다 — 화면이 한 번 깜빡이고
편집 모드가 초기값으로 돌아간다. `sessionStorage['ysme-ai-focus']` 에
`계획id|항목id|곳번호` 를 남겨, 도착한 페이지에서 원문을 다시 훑어 그 자리를 찍는다.
곳 번호만 빠뜨리면 「페이지는 갔는데 아무 표시도 없다」가 된다.

## 9. 세션·보안

- 게이트: 공용 암호 + 편집자 이름 → `auth` 검증 → `sessionStorage['ysme-studio']` 에
  `{passcode, author, ts}` 저장(탭 단위). 페이지를 이동해도 오버레이가 부활한다.
- 한계(고지): 공용 암호 1개가 곧 쓰기 권한이다. 암호는 sessionStorage 에 평문으로 있다.
  방어선은 강한 암호 · 커밋 이력 · 체크포인트 복원 · Vercel 롤백이다.
- `GH_TOKEN` 은 이 저장소 `Contents: read/write` 로만 제한된 fine‑grained PAT 를 쓴다.
- AI 키는 서버를 통과만 하고 저장되지 않는다. 로그 금지.

## 10. 검증 기준 (구현 완료 조건)

1. **라운드트립 무결성**: 8페이지 각각을 편집 없이 열고 초안 저장 → 파일 내용이 **바이트 단위로 동일**.
2. **오염 차단**: 리빌 클래스(`in`/`fade`/`vis`), 카운트업 숫자, `ysub-hide`, `aria-expanded`,
   인라인 `transition-delay`, 무작위 셔플 결과가 저장본에 나타나지 않는다.
3. **JS 소유 판별**: 홈 `newsGrid`·`pGrid` 등 컨테이너 내부 요소는 `owner==='js'` 로 잡히고
   HTML 직접 편집이 차단되며 data.js 필드 편집으로 안내된다.
4. **이동 지속**: 편집 → 다른 페이지 이동 → 돌아오면 초안이 그대로 있다.
5. **원자 게시**: 3개 파일을 고치고 게시하면 커밋 1개에 3파일이 담긴다.
6. **체크포인트**: 이름 저장 → 다른 편집·게시 → 복원 시 해당 시점 전체가 되돌아온다.
7. **언어**: EN 모드 편집이 HTML 을 바꾸지 않고 `en.json` 만 바꾼다. KO 원문 수정 시 EN 항목이 이관된다.
8. **모바일**: 390px 프레임에서 햄버거 메뉴가 나타나고, 그 상태에서 한 편집이 공통 파일에 반영된다.
9. **방문자 무영향**: 세션 없이 페이지를 열면 `assets/studio/*` 요청이 0건이다.
10. 문법: `node --check` 가 `api/*.js` 와 `assets/studio/*.js` 전부 통과.
11. **잠긴 칸 없음**: 텍스트를 가진 요소를 고르면 어떤 경우에도 고칠 방법이 함께 제시된다.
    홈 사전 문장 → 한/영 두 칸, 카운트업 → 최종 숫자 칸, data.js 소유 → 데이터 필드 폼.
    "다른 데서 고치세요" 로 끝나는 안내는 실패로 본다.
12. **글 등록**: 분류를 골라 제목·날짜만 넣어도 등록되고, 초안 `data.js` 가 구문 오류 없이
    평가되며, 삭제하면 바이트 동일하게 돌아온다.
