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
│     ├─ scrub.js             저장 경계 오염 제거
│     ├─ engine.js            원본 진실 모델 · eid · 편집 적용 · undo/redo
│     ├─ datamap.js           data.js 소유 판별 + JSON 소스 오프셋 편집
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
| `commit` | `{message, files:[{path,content,encoding?}], deletions?, author, baseSha?}` | `{ commit:{sha,url}, headSha }` · `baseSha`≠HEAD → **409** `{conflict:true, headSha}` |
| `history` | `{path?, limit?}` | `{ commits:[{sha,message,author,date,url}] }` |
| `checkpoints` | – | `{ items:[Checkpoint] }` (없으면 `[]`) |

- `commit` 은 **Git Trees API** 사용: blobs → tree(base=현재 tree) → commit → ref 갱신. 파일 N개 = 커밋 1개.
- 경로 검증: `..` 금지, `^[A-Za-z0-9](?:[A-Za-z0-9._/-]*)$`, 쓰기 허용 확장자
  `html css js json svg png jpg jpeg webp avif ico txt md`. 위반 → 400.
- `Checkpoint` = `{ id, name, note, ts, author, commitSha, files:[path] }`.
  체크포인트 생성은 별도 액션이 없다 — `_studio/checkpoints.json` 을 **같은 `commit` 에 포함**시킨다.

## 3. 서버 계약 — `POST /api/ai`

`{ passcode, provider:'gemini'|'claude', model, apiKey, system?, messages:[{role,content}], json?:true, schema? }`
→ `{ text }` 또는 `json:true 일 때 { data }` · 오류는 `{ error, status }`.

- 암호 검증 필수(오픈 프록시 방지). **API 키는 요청 본문으로만 받고 로그·저장·에코 금지.**
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
- 저장(초안) = `scrub(pristine).documentElement.outerHTML` + `<!DOCTYPE html>` + **줄바꿈 LF 유지**.
- undo/redo = pristine 전체 HTML 문자열 스냅샷(경로별 최대 60개). 복원 시 페이지를 다시 그리지 않고
  **바뀐 eid 만 라이브에 재적용**한다(전체 재렌더는 인플레이스에서 곧 세션 파괴다).

### 4.1 정렬 규칙 (align.js)

라이브에서 **무시**할 노드(사이트가 런타임에 만든 것):
`.ynv`, `.ysub`, `.ytop`, `.ynv-ovl`, `footer.yft`, `[data-ys-ui]`, 스튜디오가 넣은 `<style>`.
pristine 에만 있는 **유령** 노드(nav.js 가 DOM 에서 제거함): `.cta`, `footer:not(.yft)`.

정렬 키 = `tag + '#' + id + '.' + (class 목록 − 런타임 클래스, 정렬)`.
런타임 클래스(정렬·저장 양쪽에서 무시): `in vis fade ttl-on ysub-hide on cur open min show dim-others`.
자식 목록은 이 키로 LCS 정렬하고, 짝지어진 쌍만 재귀한다. 결과:

- `map.live→pristine`, `map.eid→live`
- `owner(eid) = 'html' | 'js'` — 라이브 자식 구성이 pristine 과 어긋난 컨테이너 이하는 `'js'`.
  `'js'` 영역의 텍스트는 **화면에서 직접 고칠 수 없다**(고쳐도 다음 로드에 사라짐) → datamap 으로 라우팅.

### 4.2 저장 경계 (scrub.js)

pristine 은 사이트 JS 가 건드리지 않으므로 원칙적으로 깨끗하다. 그럼에도 저장 직전에 다음을 제거·복원한다.
`data-eid`, `data-ys-*`, `contenteditable`, `spellcheck`, 런타임 클래스, `--reveal-delay`,
`aria-expanded/pressed/selected`(원본 값 복원), 스튜디오 UI 노드, `style=""` 껍데기.
**`[data-count]` 요소의 textContent 는 절대 라이브에서 가져오지 않는다**(카운트업 결과가 굳는다).

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
    "before": "기존 값(표시용)",
    "after": "새 값",
    "why": "한 줄 근거"
  }]
}
```

- 항목 수 상한 10. 컨텍스트는 페이지 전체 HTML 대신 **eid 아웃라인**(eid·태그·텍스트 요약)을 보내고,
  필요한 요소만 2차 턴에서 `outerHTML` 로 확장한다.
- UI: 토글 목록에서 항목을 열면 `그 페이지로 이동 → 대상 강조 → 기존/변경 디프`. 항목별 승인/거절.
  승인된 항목만 초안에 반영된다. 계획은 IndexedDB `plans` 에 남아 페이지를 옮겨도 유지된다.

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
