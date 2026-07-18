# YSME Admin Studio — 모듈 계약서 (SPEC)

연세대 기계공학부 사이트(prototype-v3)의 **관리자 편집 도구**.
서버 없음. Chrome/Edge에서 `admin/index.html`을 열고 File System Access API로
사이트 폴더를 선택해 직접 읽기/쓰기한다. 버전·계정·감사기록은 IndexedDB.
Gemini(Google AI Studio 무료 키)는 브라우저에서 직접 REST 호출.

## 파일 구성 & 로드 순서 (모두 classic `<script defer>`, ES 모듈 금지)

```
admin/
  index.html        — 셸 (모든 DOM id의 SSOT, 이미 작성됨 — 수정 금지)
  css/admin.css     — 관리자 UI 전체 스타일
  js/core.js        — window.Admin 네임스페이스, bus, utils, toast, modal
  js/store.js       — IndexedDB 래퍼
  js/auth.js        — 계정/로그인 (WebCrypto PBKDF2)
  js/audit.js       — 감사 기록
  js/fs.js          — File System Access 레이어
  js/versions.js    — 버전 스냅샷/디프/롤백
  js/editor.js      — iframe 비주얼 편집기 (핵심 엔진)
  js/ai.js          — Gemini 챗 패널
  js/board.js       — 보드 모드 (전 페이지 캔버스 개요)
  js/github.js      — GitHub 게시(배포) + 게시 기록
  js/app.js         — 부트스트랩/배선
  js/layout.js      — 패널 폭 조절·접기 (독립 모듈, Admin.* 에 부착하지 않음)
  serve.py          — 로컬 서버 (file:// 에서 폴더 픽커가 막힐 때)
  README.md         — 사용법(한국어)
```

로드 순서: core → store → auth → audit → fs → versions → editor → ai → board → github → app → layout.
- `board.js` 는 `editor.js` 뒤(렌더 파이프라인 의존), `app.js` 앞(app 이 `init()` 호출).
- board.js 는 app.js 소유의 `PAGE_NAMES`/`Admin.util.pageTitle` 을 **런타임에만** 참조하므로
  자신이 먼저 로드돼도 문제없다(호출 시점에 이미 존재).
- `layout.js` 는 다른 모듈에 의존하지 않아 맨 뒤에 둔다.

**코딩 규칙**: 모던 JS(ES2020, async/await) 허용 — Chrome/Edge 전용 도구다.
단, 모듈 시스템 금지: 각 파일은 `Admin.xxx = {...}` 형태로 전역 네임스페이스에 부착.
모든 사용자 데이터 출력은 `Admin.util.escapeHtml()` 필수.

## 네임스페이스 계약

### core.js (작성 완료 — 이 계약대로 사용)
```js
Admin.bus.on(evt, fn) / Admin.bus.off(evt, fn) / Admin.bus.emit(evt, data)
Admin.util.escapeHtml(s) / .uid(prefix) / .fmtDate(tsOrIso) / .fmtTime(ts)
Admin.util.debounce(fn, ms) / .basename(path)
Admin.toast(msg, kind)            // kind: 'ok'|'err'|'info'
Admin.confirm(msg) -> Promise<bool>   // 커스텀 모달
Admin.prompt(msg, defVal) -> Promise<string|null>
Admin.modalShow(bodyHtml, {okText, hideCancel, focusSel}) -> Promise
   // 임의 콘텐츠 모달(버전 디프·단축키 도움말 등). 기본 확인 버튼만.
Admin.state                        // { user, sitePath, currentPath, mode, dirty }
   // mode 는 uiMode 와 같은 값: 'edit'|'preview'|'board'|'code'
```
`#modalRoot` 는 하나뿐이라 모달은 동시에 하나만 열린다(중복 호출은 즉시 null 반환).
앱 단축키·보드 스페이스 팬은 모달이 떠 있으면 물러난다 — 새 문서 레벨 키 처리를 추가할 때도
같은 규약을 지킬 것.

**런타임 확장**: `Admin.util.pageTitle(fileName)` 은 app.js 가 부착한다(core.js 에 없다).
board.js 등 나중에 쓰는 쪽은 호출 시점에만 참조하므로 로드 순서와 무관하되, 방어적으로 부른다.

### store.js — IndexedDB 래퍼 (DB명 'ysme-admin', version 1)
Object stores:
- `settings`  keyPath 'key'            — {key, value}
- `accounts`  keyPath 'username'       — {username, salt, hash, role, createdAt}
- `versions`  keyPath 'id', index 'byPath' on 'path', index 'byTs' on 'ts'
- `audit`     keyPath 'id', index 'byTs' on 'ts'

```js
Admin.store.get(storeName, key) -> Promise<record|undefined>
Admin.store.put(storeName, record) -> Promise
Admin.store.del(storeName, key) -> Promise
Admin.store.list(storeName, {index, value, limit, desc}) -> Promise<record[]>
  // index/value 생략 시 전체. desc=true면 최신순(정렬 키 기준 역순).
Admin.store.setSetting(key, value) / Admin.store.getSetting(key) -> Promise<value>
```

### auth.js — 로그인/계정
- 최초 실행(계정 0개): #setupForm 을 보여 관리자 계정 생성.
- 이후: #loginForm. PBKDF2-SHA256 150,000 iter, salt 16B random(hex 저장).
- 세션: sessionStorage 'ysme-admin-session' = JSON {username, role, loginAt}.
- 성공 시 `Admin.state.user = {username, role}` 설정 + `bus.emit('auth:login', user)`.
- 로그아웃: 세션 제거, `bus.emit('auth:logout')`, audit 기록은 app이 아닌 auth가 직접
  `Admin.audit.log('logout', ...)` 호출.
```js
Admin.auth.init() -> Promise          // 계정 존재여부 판단→폼 토글+와이어링, 세션 복원
Admin.auth.current() -> user|null
Admin.auth.login(u, p) -> Promise<bool>
Admin.auth.logout()
Admin.auth.createAccount(u, p, role='admin') -> Promise
Admin.auth.hasAccounts() -> Promise<bool>
```
관련 DOM(index.html에 이미 존재): #loginView, #setupForm(#setupUser,#setupPass,#setupPass2,#setupErr),
#loginForm(#loginUser,#loginPass,#loginErr). 폼 submit 와이어링은 auth.js 담당.
성공 시 화면 전환은 app.js가 'auth:login' 이벤트로 처리하므로 auth는 이벤트만 emit.

### audit.js — 감사 기록
레코드: {id, ts, user, action, target, detail}
action 값: 'login'|'logout'|'account-create'|'save'|'rollback'|'ai-apply'|'export'|'site-open'|'publish'
배지 라벨은 audit.js 의 ACTION_LABELS 맵이 한국어로 옮긴다(미정의 값은 원문 노출).
```js
Admin.audit.log(action, target, detail) -> Promise   // user는 Admin.state.user에서
Admin.audit.list({limit=200}) -> Promise<record[]>   // 최신순
Admin.audit.renderList() -> Promise    // #auditList 에 렌더 (아래 마크업 규약)
Admin.audit.exportJson()               // JSON 파일 다운로드 (a[download])
```
renderList 행 마크업: `.audit-row` > `.audit-ts`(mono) + `.audit-user` + `.audit-action`(배지, `.badge-{action}`) + `.audit-target` + `.audit-detail`. 비어있으면 `.empty-note`.
#btnExportAudit 클릭 와이어링도 audit.js 담당. export 시 audit.log('export', 'audit', ...).

### fs.js (작성 완료 — 이 계약대로 사용)
```js
Admin.fs.supported() -> bool
Admin.fs.openSite() -> Promise<bool>       // 폴더 픽커. 성공 시 bus.emit('site:opened', {name, pages, assets})
Admin.fs.reconnect(askPermission) -> Promise<bool>
   // 저장된 핸들 권한 재요청. askPermission=false 면 조용히(사용자 제스처 없이) 시도만 한다.
Admin.fs.isReady() -> bool
Admin.fs.siteName() -> string
Admin.fs.pages() -> [{path, name}]         // 루트 *.html
Admin.fs.assets() -> [{path, name}]        // assets/ 내 .css/.js
Admin.fs.readFile(path) -> Promise<string> // 'index.html', 'assets/js/data.js' 형태
Admin.fs.fileUrl(path) -> Promise<blob URL|null>
   // 자산을 blob: URL 로. editor 의 렌더 파이프라인(캔버스·보드 프레임)이 쓴다.
Admin.fs.writeFile(path, content) -> Promise
```

### versions.js — 버전 관리 (git 스타일)
레코드: {id, path, content, ts, author, note, origin}
origin: 'editor'|'code'|'ai'|'rollback'|'baseline'|'publish'
- baseline: 파일을 처음 열 때 원본 스냅샷 1회 자동 저장(해당 path에 버전 0개일 때만).
- publish: github.js 가 게시 성공 시 남기는 스냅샷.
- 배지 라벨은 versions.js 의 ORIGIN_LABEL 맵(클래스는 원본 origin 값 사용: `.badge-{origin}`).
```js
Admin.versions.snapshot(path, content, {note, origin}) -> Promise<record>
   // 직전 버전과 content 동일하면 저장 생략하고 그 레코드 반환
Admin.versions.list(path|null) -> Promise<record[]>   // null=전체, 최신순
Admin.versions.get(id) -> Promise<record>
Admin.versions.renderList() -> Promise
   // #versionList 렌더. #versionFilter(select)의 값(path 또는 'all') 반영.
   // #versionFilter options 도 여기서 채움(현재 열린 파일 우선).
Admin.versions.diffLines(oldStr, newStr) -> [{type:'same'|'add'|'del', line}]
   // LCS 기반 라인 디프 (자체 구현, 외부 라이브러리 금지)
```
행 마크업: `.ver-row`(현재 파일과 content 동일하면 `.is-current` 추가) >
`.ver-meta`(`.ver-ts` mono + `.ver-author` + `.ver-origin` 배지 `.badge-{origin}` + `.ver-note`) +
`.ver-actions`( 버튼 3개: `.ver-btn` data-act="preview"|"diff"|"restore" data-id="...").
- preview: `Admin.editor.previewDraft(content, {label})` 호출 (읽기전용 미리보기 배너).
- diff: 현재 편집 중 내용(`Admin.editor.getCleanHtml()` — 단 현재 path가 다르면
  `Admin.fs.readFile(rec.path)`)과 비교하는 모달. `Admin.modalOpen(html)` 사용.
  디프 마크업: `.diff-view` > `.diff-line.diff-add|.diff-del|.diff-same` > `.diff-ln`(줄번호 mono) + `.diff-txt`.
  same 줄은 변경부 주변 ±2줄만 표시하고 사이는 `.diff-skip`("··· N줄 생략")으로 접기.
- restore: `bus.emit('version:restoreRequest', {id})` 만 emit (실제 복원은 app.js).
'file:saved' / 'page:loaded' bus 이벤트 수신 시 목록 갱신(버전 탭이 활성일 때만; 활성 여부는
`document.querySelector('#panelVersions').hidden === false`).

### editor.js (작성 완료 — 이 계약대로 사용)
```js
Admin.editor.loadPage(path, html, {markDirty=false}) -> Promise  // 파싱→eid 태깅→iframe 렌더
Admin.editor.getCleanHtml() -> string        // data-eid 제거된 원본 HTML (저장용)
Admin.editor.currentPath() -> string|null
Admin.editor.setMode('edit'|'preview')       // preview=선택 오버레이 끔, 내부 링크는 'canvas:navigate' emit
Admin.editor.setViewport('desktop'|'mobile')
Admin.editor.previewDraft(html, {label}) / Admin.editor.exitDraft() / Admin.editor.isDraft() -> bool
   // 임시 HTML을 캔버스에 렌더(pristine 비파괴). #draftBanner 표시는 editor가 처리.
Admin.editor.undo() / redo() / canUndo() / canRedo()
Admin.editor.isDirty() -> bool / Admin.editor.markSaved()
Admin.editor.selectedInfo() -> {eid, tag, outerHTML}|null
Admin.editor.buildStandaloneHtml(html) -> Promise<string>
   // 자산을 인라인(CSS/JS)·data: URL(미디어)로 박은 독립 문서. sandbox 프레임용(버전 비교 등).
Admin.editor.buildBoardHtml(html) -> Promise<string>
   // 보드 프레임용. 편집 캔버스와 동일하게 blob: 자산 치환(inline:false) → 자산 캐시를
   // 프레임 전체가 공유한다. sandbox 프레임이 아니므로 blob: 로드 가능.
Admin.editor.selectByEid(eid)                // 인스펙터 브레드크럼에서 조상 요소 선택
Admin.editor.ancestors() -> [{eid, tag, label, current}]
   // 선택 요소의 조상 경로. pristine 기준, 가장 바깥(body) → 선택 요소 순. 최대 8개(초과 시 안쪽 8개).
   // label = tag + (#id | .첫클래스), body/html 은 태그명 고정.
Admin.editor.invalidateAssets()              // 자산(.css/.js) 저장 후 blob 캐시 폐기
Admin.editor.rerender() -> Promise           // 스크롤 유지 재렌더
```
emit 이벤트: 'editor:dirty' {dirty}, 'editor:selected' {eid,tag}|null,
'editor:history' {canUndo, canRedo}, 'canvas:navigate' {href}, 'page:loaded' {path},
'ai:editElement' {eid, tag, outerHTML}, 'draft:exited' {}, 'canvas:key' (아래).

수신 이벤트: 'file:saved' {path} → `.css`/`.js` 면 자산 캐시 폐기 + 캔버스 재렌더.
(이 리스너는 DOMContentLoaded 에서 등록되며 board.js 의 같은 이벤트 리스너보다 **먼저** 걸린다
 → 보드가 재렌더될 때는 이미 자산 캐시가 비워져 있다. 이 순서에 board.js 가 의존한다.)

**캔버스 태그 칩**: 편집 모드의 호버/선택 박스에 Figma 식 라벨 칩(`section.hero`)을 붙인다.
칩은 iframe 내부 요소라 admin.css 가 닿지 않는다 → 인라인 `style.cssText` 로만 스타일링하고,
박스와 함께 `data-admin-ui` 를 달아 `doc.body` 직속에 붙인다(미러링·저장 시 스크럽 대상).
호버 칩 파랑 `#1a5bb0`, 선택 칩 골드 `#c9a227`.

**인스펙터 브레드크럼**: `renderInspector()` 가 `ancestors()` 로 `.insp-crumbs` 를 그린다.
버튼 클릭 → 그 조상 선택, 호버 → 캔버스에서 hoverBox 하이라이트.
BODY 도 선택 가능하므로 `doAction()` 이 html/head/body 에 대한 순서 이동·삭제·복제를 거부한다
(골격이 깨진 채 저장되는 것을 막는 유일한 가드).

**요소 단축키 (iframe 내부에서 editor.js 가 직접 처리)**: Esc 선택 해제 / Delete·Backspace 삭제 /
Ctrl+D 복제 / Alt+↑↓ 순서 이동. **타이핑 중(포커스가 contenteditable·input 안)에는 발동하지 않는다** —
판정은 속성 유무가 아니라 `doc.activeElement` 기준(`isTypingInCanvas()`). 이 판정이 틀리면
Backspace 가 글자 지우기 대신 요소 삭제가 된다.

**'canvas:key' 이벤트 (iframe → 부모 키 전달)**: iframe 내부 keydown 은 부모 document 리스너에
도달하지 않는다 → editor.js 가 **자신이 처리하지 않은** 앱 단축키만 버스로 넘긴다.
```js
Admin.bus.emit('canvas:key', {
  key, ctrlKey, metaKey, shiftKey, altKey,
  inEditable   // 선택 요소 contenteditable 안에서 타이핑 중인가(bool)
});
```
- 전달 대상: `Ctrl/Cmd+S`, `Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+Shift+Z`, `?`, `1`~`4`.
- `inEditable === true` 면 `?`·`1`~`4` 는 전달하지 않는다(글자 입력이므로).
- `Ctrl+Z`/`Ctrl+Y` 는 `inEditable` 이어도 전달하되 `preventDefault()` 하지 않는다
  (브라우저 기본 undo 가 살아 있어야 contenteditable 편집이 정상 동작).
- 미리보기 모드에서도 키 브리지는 붙는다(요소 단축키만 제외) — 1~4 전환이 캔버스 안에서도 먹어야 한다.
- 실제 동작 판단은 app.js 의 `handleShortcut()` 단독 책임.

### ai.js — Gemini 챗 패널
설정: settings 키 'gemini-key', 'gemini-model' (기본 'gemini-2.5-flash').
모델 선택지: gemini-2.5-flash / gemini-2.5-flash-lite / gemini-2.0-flash.
엔드포인트: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={KEY}`
body: {contents:[{role:'user'|'model', parts:[{text}]}], generationConfig:{temperature:0.4, maxOutputTokens: 65536}}

동작:
1. 키 미설정 시 #aiSetup 표시, 저장하면 #aiChat 표시. "키 변경" 링크(#aiKeyChange)로 재설정.
2. 첫 사용자 메시지 전송 시 시스템 성격의 프리앰블 + **현재 페이지 전체 HTML**
   (`Admin.editor.getCleanHtml()`)을 첫 user 턴에 포함. 이후 턴은 텍스트만.
3. 프리앰블 요지(한국어로 작성): 너는 연세대 기계공학부 사이트의 웹 편집 어시스턴트.
   요청을 반영한 **완전한 수정본 HTML 전체**를 ```html 펜스에 담아 응답.
   펜스 앞에 3줄 이내 변경 요약. 규칙: 디자인 토큰(CSS 변수)만 사용, 외부 JS 라이브러리·
   ES 모듈 금지, 기존 구조·클래스 체계 유지, data-eid 속성이 있으면 그대로 보존,
   상대경로 유지, 한국어 콘텐츠.
4. 응답에서 마지막 ```html 펜스 추출 → 초안. #aiDraftBar 표시:
   - #btnDraftPreview → Admin.editor.previewDraft(draft, {label:'AI 초안'})
   - #btnDraftApply → bus.emit('ai:applyDraft', {html: draft})  (적용은 app.js)
   - #btnDraftDiscard → Admin.editor.exitDraft(), 바 숨김
5. 피드백 루프: 초안 상태에서 추가 메시지 보내면 대화 이력 유지한 채 재요청 → 새 초안 교체.
6. 요소 스코프: bus 'ai:editElement' {eid, tag, outerHTML} 수신 시 입력창에
   해당 요소 컨텍스트 태그 부착(다음 메시지에 "이번 요청은 다음 요소에 집중: <outerHTML>" 첨부).
7. 'page:loaded' 수신 시 대화 초기화(페이지 컨텍스트가 바뀌므로) — 단 메시지로 안내.
8. 로딩 중 표시(.ai-msg--pending), 오류는 메시지로(HTTP 코드별 안내: 400/403 키 확인, 429 무료 쿼터).
9. 대화 마크업: #aiMessages 안에 `.ai-msg.ai-msg--user|--model` > `.ai-msg-body`.
   모델 응답의 ```html 펜스는 본문에 그대로 넣지 말고 `.ai-code-chip`("HTML 초안 v{n}")로 대체.
```js
Admin.ai.init()
Admin.ai.hasDraft() -> bool
```
DOM: #panelAI, #aiSetup(#aiKeyInput,#aiModelSelect,#btnAiKeySave,#aiSetupErr),
#aiChat(#aiMessages,#aiInput,#btnAiSend,#aiKeyChange,#aiCtxChip),
#aiDraftBar(#btnDraftPreview,#btnDraftApply,#btnDraftDiscard). 와이어링 전부 ai.js 담당.
API 키는 절대 audit/버전 레코드에 남기지 않는다.

### board.js — 보드(캔버스 개요)

사이트의 모든 HTML 페이지를 **실제 렌더된 프레임**으로 무한 캔버스에 펼치고, 팬·줌으로
훑다가 더블클릭하면 그 페이지를 편집 모드로 연다. 보드는 **읽기 전용 뷰**다 — 편집은
`board:open` 을 통해 app.js 가 연다.

```js
Admin.board.init()                    // app.js 가 DOMContentLoaded 에서 1회 호출. 멱등.
Admin.board.show() -> Promise         // 진입: 프레임 목록 동기화 + 지연 렌더 시작 + (최초 1회) fit
Admin.board.hide()                    // 이탈: 옵저버·렌더 큐 정지 (DOM·렌더 결과는 유지)
Admin.board.isActive() -> bool
Admin.board.refresh(path)             // null=전체 무효화, path=해당 프레임만 재렌더
Admin.board.zoomIn() / zoomOut()
Admin.board.zoomTo(z, cx, cy)         // cx,cy = #boardViewport 기준 좌표(px). 생략 시 뷰포트 중심
Admin.board.fit()                     // 보이는 프레임 전체가 들어오도록 줌·팬
Admin.board.reset100()                // 줌 1.0 + 현재 페이지 프레임을 화면 중앙으로
Admin.board.filter(query)             // 검색어로 표시/숨김 + 재배치 (경로·한국어 이름 부분일치)
Admin.board.setMobile(bool)           // 프레임 폭 390 / 1280 전환 + 전체 재렌더
Admin.board.setFullHeight(bool)       // 커버(고정 900) <-> 페이지 실측 전체 높이. 재렌더 없이 재배치+재맞춤
```
`init()` 은 app.js 가 호출하지만, board.js 자체 DOMContentLoaded 안전망도 있다(멱등이라 무해).
셸 DOM(`#boardWrap`/`#boardViewport`/`#boardWorld`)이 없으면 조용히 비활성화된다.

**emit**: `'board:open'` {path} — 더블클릭·Enter/Space·라벨 클릭 → app.js 가 편집 모드로 연다.
`'board:zoom'` {zoom} — 줌 변경 시. app.js 가 `#boardZoomLevel` 텍스트 갱신.

**수신**: `'site:opened'` {pages} → 프레임 목록 전면 재구성 · `'file:saved'` {path} →
`.css`/`.js` 면 전체 무효화, 아니면 해당 프레임만 · `'page:loaded'` → `.is-current` 갱신 ·
`'editor:dirty'` → 현재 편집 경로 프레임에 `.is-dirty` 토글.

**프레임 DOM** (board.js 가 생성. 제목·파일명은 `escapeHtml` 필수)
```html
<div class="bframe" data-path="index.html">
  <div class="bframe-label">
    <span class="bframe-name">홈</span>
    <span class="bframe-file mono">index.html</span>
    <span class="bframe-badge mono">미저장</span>
  </div>
  <div class="bframe-box">
    <iframe class="bframe-frame" title="홈 미리보기" loading="lazy" tabindex="-1"></iframe>
    <div class="bframe-hit" role="button" tabindex="0" aria-label="홈 — index.html 편집 열기"></div>
    <div class="bframe-skel"><span class="mono">불러오는 중…</span></div>
  </div>
</div>
```
- `.bframe` 의 `left`/`top`(월드 좌표)·`width`, `.bframe-box` 의 `height` 는 board.js 가 인라인 지정.
- `.bframe-badge` 는 마크업에 항상 있고 `.bframe.is-dirty` 일 때만 CSS 로 보인다.
- `.bframe-skel` 은 렌더 완료 시 `hidden`, 실패 시 "불러오지 못했습니다"로 다시 표시.
- 페이지 한국어 이름은 `Admin.util.pageTitle(name)`(app.js 소유)을 방어적으로 호출한다 —
  표를 board.js 안에 복제하지 않는다.

**상태 클래스**: `.is-current`(현재 편집 중 경로) · `.is-selected`(단일 클릭 선택, 동시에 하나) ·
`.is-dirty`(미저장 변경이 있는 **현재 페이지에만**) — 이상 `.bframe` 에 부여.
`.is-clipped`(표시 높이보다 콘텐츠가 길다 - 페이드만) 와 `.is-truncated`(전체 높이 모드에서
`FRAME_H_MAX` 에 걸려 실제로 잘림 - 「잘림」 배지)는 `.bframe-box` 에.
검색 필터로 숨긴 프레임은 `.bframe[hidden]`.

**치수**
```js
FRAME_W_DESKTOP = 1280, FRAME_W_MOBILE = 390
FRAME_H_MIN = 600, FRAME_H_MAX = 4200, FRAME_H_DEFAULT = 1400   // 측정 전 placeholder
FRAME_H_COVER = 900           // 커버 모드(기본) 고정 높이
GAP_X = 80, GAP_Y = 240       // 월드 좌표 기준 프레임 간격 (라벨 자리 포함)
PAD = 40                      // fit() 시 뷰포트 여백 (화면 px)
ZOOM_MIN = 0.04, ZOOM_MAX = 2, ZOOM_STEP = 1.2
RENDER_MAX = 2                // 동시 렌더 상한
CLICK_SLOP = 4                // 이 거리 이하의 드래그는 클릭으로 취급 (px)
```

**커버 높이 (기본) ↔ 전체 높이 — 「한눈에 보기」의 핵심**
- 표시 높이는 `frameH(fr)` 하나로만 결정한다: 커버 모드면 `FRAME_H_COVER`, 전체 높이 모드면
  실측 `fr.h`. 레이아웃·`doFit` 은 반드시 이 함수를 거친다(`fr.h` 를 직접 쓰면 두 모드가 어긋난다).
- **왜 고정 높이가 기본인가**: 페이지 실제 높이는 수천 px 이고 페이지끼리 10배씩 차이 난다.
  그대로 15장을 늘어놓으면 세로가 병목이라 「전체 맞춤」이 **4%** 까지 내려가 아무것도 안 보인다
  (실측: 720×485 뷰포트에서 전체 높이 4%, 커버 10%). 높이를 고정하면 페이지끼리 비교 가능한
  썸네일이 되고 라벨도 읽힌다. `#boardFull`(「전체 높이」)로 언제든 실측 높이로 전환한다.
- `fr.raw` = 실측 원본 높이(클램프 전). 페이드·배지 판정에 쓴다.
- 전환은 재렌더 없이 `.bframe-box` 높이만 바꾼다 — 사이트가 `vh` 레이아웃을 쓰지 않아
  되먹임이 없다(prototype-v3 확인). 프레임이 커지면 사이트의 reveal IntersectionObserver 가
  리사이즈로 재평가되어 아래쪽 요소도 나타난다.

**렌더 소스**
- 기본 `await Admin.fs.readFile(path)`. 단 `path === Admin.editor.currentPath()` 이고 편집기 원본이
  있으면 `Admin.editor.getCleanHtml()` 을 쓴다 → 미저장 편집분이 보드에 그대로 보인다.
- 변환은 `Admin.editor.buildBoardHtml(html)`. 미배포 환경 대비로 `buildStandaloneHtml` → 원본
  순서로 폴백한다.
- `frame.srcdoc` 주입. **sandbox 속성을 붙이지 않는다** — 붙이면 부모가 만든 blob: 자산을
  못 읽어 빈 화면이 된다(편집 캔버스와 동일 신뢰 수준).
- `fromEditor` 플래그: 「파일에 없는 휘발성 편집분으로 렌더했는가」. 편집분이 폐기·되돌림되면
  `show()` 가 이 표시를 보고 프레임을 버린다(그 경로엔 무효화 트리거가 없어 낡은 프레임이 남는다).

**지연 렌더 (프레임 15개를 동시에 렌더하면 브라우저가 멈춘다)**
- `IntersectionObserver`(root `#boardViewport`, rootMargin `600px`)로 `.bframe` 관찰 →
  교차 진입분만 큐에 넣고 **동시 2개**로 제한해 순차 처리. IO 미지원이면 전부 큐에 넣되 상한은 유지.
- 프레임마다 `epoch` 토큰으로 렌더 경합을 막는다(무효화 시 증가 → 진행 중 렌더 결과 폐기).
- 이미 렌더된 프레임은 무효화 전까지 다시 렌더하지 않고, 언로드도 하지 않는다(15개 규모 전제).
- `load` 가 오지 않아도 큐가 멈추지 않도록 8초 타임아웃.
- `hide()` 시 옵저버 disconnect + 큐 비우기, `show()` 시 재관찰.

**높이 측정** — iframe `load` 후 `body.scrollHeight` 를 읽고 `[FRAME_H_MIN, FRAME_H_MAX]` 로 클램프.
- `documentElement.scrollHeight` 를 쓰면 안 된다: 그 값은 max(뷰포트 높이, 콘텐츠 높이)인데 뷰포트
  높이가 곧 board.js 가 박아 둔 `fr.h` 라 자기참조가 되어 높이가 커지기만 하고 줄지 않는다.
- 사이트 JS 의 리빌 애니메이션 때문에 load 직후 값이 덜 잡힌다 → 350ms 뒤 1회 재측정, 달라지면 재배치.
- 접근 예외 시 `FRAME_H_DEFAULT` 유지. 재배치는 **전체 높이 모드에서만** 필요하다(커버 모드는
  표시 높이가 고정이라 실측이 바뀌어도 배치가 그대로다).
- `markClip(fr)` 이 두 표시를 나눠 단다:
  `.is-clipped`(= `fr.raw > frameH(fr)`) 는 **페이드만** — 「아래로 더 있다」는 신호이고 커버
  모드에선 거의 모든 프레임이 해당하므로 글자를 붙이면 소음이 된다.
  `.is-truncated`(= 전체 높이 모드 && `fr.raw > FRAME_H_MAX`) 만 「잘림」 배지를 띄운다.

**레이아웃(메이슨리)** — `COLS = bestCols()`: 2~6열 후보를 실제로 packing 해 보고 **「전체 맞춤」
배율이 가장 커지는 열 수**를 고른다. `ceil(sqrt(n))` 고정 heuristic 은 뷰포트 가로세로비를 무시해
15장을 4열×4행으로 깔고 세로를 병목으로 만든다(5열×3행이 맞다). 뷰포트 크기만 보고 zoom 은
보지 않으므로 `doFit` 과 되먹임이 없다. 페이지 순서대로 가장 짧은 열(동률이면 왼쪽)에 배치,
`left = col * (FRAME_W + GAP_X)`, `top = colHeight[col]`.
연속 호출(높이 측정 콜백이 프레임마다 터진다)은 `requestAnimationFrame` 으로 1회에 병합한다.

**줌·팬**
- `#boardWorld` 에 `transform: translate(Xpx,Ypx) scale(Z)`, `transform-origin: 0 0`.
- **라벨·테두리는 화면상 크기 고정**: `--bz = 1/zoom` 을 `#boardWorld` 에 세팅 → admin.css 가
  `calc(12px * var(--bz))` 식으로 역보정. 줌 변경 시마다 갱신.
- **`--bzl` = `min(1/zoom, GAP_Y/24)`** (= 상한 10) — 라벨 전용 역보정. 라벨(18+6px)을 `--bz` 로
  그대로 역보정하면 월드 높이가 24/zoom 이라 상한이 없으면 GAP_Y 를 넘어 위 프레임을 덮고
  클릭까지 가로챈다 → 상한을 둬 라벨 몫을 GAP_Y 안에 묶는다. 테두리·포커스 링은 `--bz` 를 그대로.
  `GAP_Y` 를 240 으로 잡은 것이 이 상한을 10 으로 올려, 기본 맞춤 배율(~10%)에서 라벨이
  11~12 화면px 로 읽히게 한다(GAP_Y=120·상한 5 이던 시절엔 2.4px 로 보이지 않았다).
  **`GAP_Y` 를 줄이면 라벨이 다시 안 보인다 — 두 값은 함께 움직인다.**
- 휠: `ctrlKey||metaKey`(트랙패드 핀치 포함) → 커서 기준 줌, 아니면 세로 팬(`shiftKey` 면 가로).
  **`passive:false` 로 등록 + `preventDefault()`** — 브라우저 페이지 줌 방지.
- 커서 기준 줌: `k = new/old; panX = cx - (cx-panX)*k; panY = cy - (cy-panY)*k;`
- 팬 드래그: (1) 빈 배경 (2) 마우스 가운데 버튼 (3) 스페이스바 누른 채. 드래그 중 `#boardViewport`
  에 `.is-panning`, 스페이스 누름 상태는 `.is-space`. 스페이스는 보드가 활성이고 포커스가 입력
  요소가 아니며 **모달이 닫혀 있을 때만** 가로챈다(모달 백드롭이 뷰포트를 덮으므로).
- `fit()`: 보이는 프레임의 월드 bbox → `z = min((vw-2PAD)/bw, (vh-2PAD)/bh)` 를 `[ZOOM_MIN, 1]`
  로 클램프(전체 맞춤은 100% 를 넘기지 않는다) → bbox 중심을 뷰포트 중심에.
- 최초 fit 은 사이트당 1회이며 **성공했을 때만** 래치된다(뷰포트가 0 이라 조기 반환한 fit 이
  기회를 삼키면 안 된다). 이후 실측 높이가 들어오는 동안 `autoFit` 이 켜져 재맞춤하고,
  사용자가 팬·줌하는 순간 꺼진다.
- `#boardViewport` 의 scroll 은 즉시 0 으로 되돌린다 — Tab 으로 화면 밖 `.bframe-hit` 에 포커스가
  가면 브라우저가 컨테이너를 스크롤해, 위치를 transform 만으로 관리하는 panX/panY 모델과 어긋난다.

**클릭 동작** — `.bframe-hit` 단일 클릭 → 선택 / 더블클릭 → `board:open` / Enter·Space → `board:open`
(문서 레벨 스페이스 팬 진입을 stopPropagation 으로 막는다). `.bframe-label` 클릭 → `board:open`.
빈 배경 클릭 → 선택 해제. 팬 드래그(4px 초과) 직후의 click 은 무시한다.
`.bframe-frame` 은 CSS 로 `pointer-events:none` — 프레임 내부 클릭이 먹히면 안 된다.

### github.js — GitHub 게시(배포)

편집·저장은 로컬 파일에만 반영된다. 「게시」는 그 내용을 GitHub 저장소에 커밋해 배포에 태운다.
```js
Admin.github.init() -> Promise      // DOM 캐시·배선·설정 로드 후 연결/설정 화면 결정
Admin.github.isConnected() -> bool
Admin.github.publishCurrent()       // 현재 편집 중 페이지 게시 (#btnPublish · #btnPublishCurrent)
```
연결 모드 2종(설정은 IndexedDB `settings` 의 `gh-*` 키에 브라우저별 저장):
- `shared`(공동 게시, 기본): 서버(Vercel 함수)가 토큰을 쥐고, 관리자는 **공용 암호 + 본인 이름**
  으로 게시한다. 토큰이 브라우저에 저장되지 않는다. 교수·관리자 인수인계용.
- `token`(직접 토큰, 고급): 개인 fine-grained PAT(Contents read/write)로 GitHub API 직접 호출.

게시 흐름: 확인 모달 → (폴더가 열려 있으면) 로컬 저장 → 커밋 → `versions.snapshot(origin:'publish')`
→ `audit.log('publish')` → `bus.emit('file:saved', {path})` → 기록 갱신.
`file:saved` 를 타므로 보드 프레임·자산 캐시도 함께 갱신된다.
토큰·공용 암호는 감사/버전/로그에 남기지 않고, 연결 후 입력 필드에서도 지운다.
행 마크업: `.gh-row` > `.gh-meta`(`.gh-when` mono + `.gh-who` + `.gh-sha` mono) + `.gh-msg`.

### layout.js — 패널 폭 조절·접기

`Admin.*` 에 부착하지 않는 독립 모듈. 스플리터 드래그(`#wgSplitLeft`/`#wgSplitRight`)로 좌·우 패널
폭을 조절하고, `#btnToggleLeft`/`#btnToggleRight` 로 접는다. 상태는 localStorage `ysme-admin-layout`.
- 폭은 `#workGrid` 의 `--side-w`/`--right-w` CSS 변수로 반영. 접힘은 `.left-collapsed`/`.right-collapsed`.
- 최소 160px, 상한 min(560px, 그리드 폭의 42%). 창 크기 변경 시 재보정.
- 접근성: 스플리터에 포커스 후 ←/→ 로 16px 조절, 더블클릭으로 기본 폭 복원.

### app.js (작성 완료) — 배선 요약 (참고용)
- 'auth:login' → #loginView 숨기고 #workspace 표시, fs 재연결 시도.
- #btnOpenSite → fs.openSite(); 'site:opened' → 페이지 목록 렌더, 첫 페이지 로드.
- #btnSave → 저장 파이프라인: content 결정(모드별) → fs.writeFile → versions.snapshot
  → audit.log('save') → editor.markSaved() → bus.emit('file:saved',{path, rec}).
- 'version:restoreRequest' → confirm → fs.writeFile + snapshot(origin:'rollback')
  + audit.log('rollback') + editor.loadPage 재로드.
- 'ai:applyDraft' → editor.loadPage(currentPath, html, {markDirty:true}) + audit.log('ai-apply').
- 사이드바 탭/우측 탭 전환, 코드 모드(#codeEditor, #codeFileSelect), 모드바, 뷰포트,
  beforeunload 더티 가드.
- `PAGE_NAMES` 표(파일명 → 한국어 이름)와 `pageTitle()` 을 보유하고, `Admin.util.pageTitle` 로
  노출한다(board.js 가 런타임에 참조).
- 좌측 페이지 검색: 'site:opened' 시 #pageSearch 표시, input(디바운스 150ms) → 파일 경로 또는
  한국어 이름 부분일치(대소문자 무시)로 `li` 필터. 0건이면 #pageSearchEmpty. 목록 재렌더 시 초기화.
- 보드 배선: #modeBoard, #boardZoomIn/Out, #boardZoomLevel(→reset100), #boardFit, #boardMobile, #boardFull,
  #boardSearch(디바운스 200ms → board.filter), 'board:zoom' → 배율 라벨,
  'board:open' → `switchUiMode('edit')` **후** `openPage(path)`(openPage 가 같은 경로면 일찍
  반환하므로 순서가 중요). `Admin.board` 가 없어도 죽지 않도록 전부 방어적으로 호출한다.

**모드 체계** — `uiMode`: `'edit' | 'preview' | 'board' | 'code'`

| 모드 | #canvasWrap | #boardWrap | #boardBar | #codeWrap | #canvasFrame |
|---|---|---|---|---|---|
| edit / preview | 표시 | hidden | hidden | hidden | 표시 |
| code | 표시 | hidden | hidden | 표시 | `display:none` |
| board | hidden | 표시 | 표시 | hidden | — |

`switchUiMode(m)` 이 단독으로 처리한다: 코드 모드 이탈 시 더티 확인 → 버튼 상태 →
가시성 토글 → 보드 이탈 시 `Admin.board.hide()` → 모드별 진입(`loadCodeFile` /
`Admin.board.show()` / `Admin.editor.setMode()` — editor 는 'edit'|'preview' 만 받는다).
`openPage()` 는 code·board 모드에서 호출되면 먼저 편집 모드로 나온다.
※ `#canvasWrap` 은 `display:flex` 라 `hidden` 속성이 안 먹는다 → admin.css 의
`#canvasWrap[hidden]{display:none}` 규칙이 받는다.

**단축키** — 부모 document 의 `keydown` 과 캔버스에서 올라온 `'canvas:key'` 를 **같은
`handleShortcut(k)` 하나**로 처리한다(두 경로가 각자 save() 를 부르면 중복 저장된다).
`k = {key, ctrlKey, metaKey, shiftKey, altKey, inEditable, preventDefault?}` —
`preventDefault` 는 부모 경로에만 있다(iframe 쪽은 editor.js 가 이미 막았다).
로그인 화면(`#workspace[hidden]`)이나 모달이 떠 있으면 전부 무시한다.

| 키 | 동작 | 조건 |
|---|---|---|
| `Ctrl/Cmd+S` | 저장 | 항상 (`preventDefault`) |
| `Ctrl/Cmd+Z` | 실행 취소 | 편집 모드 + 입력 중 아님 |
| `Ctrl/Cmd+Shift+Z`, `Ctrl/Cmd+Y` | 다시 실행 | 편집 모드 + 입력 중 아님 |
| `1` / `2` / `3` / `4` | 편집 / 미리보기 / 보드 / 코드 | 입력 중 아님 + `Admin.fs.isReady()` |
| `?` | 단축키 도움말 모달 | 입력 중 아님 |
| `Esc` · `Del` · `Ctrl+D` · `Alt+↑↓` | 요소 조작 | 캔버스 안에서 editor.js 가 직접 처리 |

도움말 모달(`#btnShortcuts` 또는 `?`)은 `Admin.modalShow(html, {okText:'닫기'})` 로 띄운다.
마크업: `.modal-title` + `.kbd-list` > `.kbd-group`(`.kbd-group-title` mono) >
`.kbd-row`(`.kbd-keys` > `<kbd>` + `.kbd-desc`). 그룹: 모드 · 편집 · 보드 · 기타.

## index.html DOM id 인벤토리 (전체 — CSS 작성 근거)

**로그인**: #loginView > .login-card > (#setupForm | #loginForm) — 각 폼에 .field(label+input), .form-err(#setupErr/#loginErr), button.btn-primary
**워크스페이스**: #workspace (기본 hidden) > #workGrid
- #topbar: .topbar-brand("YSME ADMIN STUDIO" + .brand-dot), #btnToggleLeft, #btnOpenSite, #siteLabel(.site-label), .topbar-spacer, 우측 #saveState(.save-state, data-dirty 속성), #btnSave(.btn-primary), #btnPublish(.btn-publish), #userLabel, #btnToggleRight, #btnAdminTheme, #btnLogout
- #sidebar: .side-tabs > button.side-tab[data-tab=pages|versions|audit|publish] (active: .is-active) / 패널 #panelPages, #panelVersions(#versionFilter select + #versionList), #panelAudit(#auditList + #btnExportAudit), #panelPublish
  - #panelPages: #pageSearch(.side-search, 기본 hidden) + #pagesEmpty + #pageList(ul) + #pageSearchEmpty(hidden)
  - #pageList 행: li > button.page-item[data-path] (.is-active 현재), .page-name + .page-file(mono)
  - #panelPublish: #ghSetup(hidden) > .gh-setup-title + .gh-mode-toggle(button.gh-mode[data-mode=shared|token])
    + #ghSharedFields(#ghEndpoint,#ghPasscode,#ghAuthor) + #ghTokenFields(hidden; #ghToken,#ghOwner,#ghRepo,#ghBranch,#ghBasePath)
    + #ghSetupErr + #btnGhConnect / #ghConnected(hidden) > #ghStatus(.gh-status) + #btnPublishCurrent
    + .side-subhead + #ghHistory(.gh-history) + #btnGhChange
- #canvasCol:
  - #modeBar: .mode-group(#modeEdit #modePreview #modeBoard #modeCode) + .mode-sep + .mode-group(#vpDesktop #vpMobile)
    + .mode-sep + .mode-group(#undoBtn #redoBtn) + #currentPathLabel(.mode-path, margin-left:auto) + #btnShortcuts(.btn-icon)
  - #boardBar(hidden): #boardSearch(.board-search) + .mode-sep + .mode-group(#boardZoomOut #boardZoomLevel #boardZoomIn)
    + #boardFit + .mode-sep + label.board-check(#boardMobile checkbox) + label.board-check(#boardFull checkbox)
    + #boardCount(.board-count) + #boardHint(.board-hint)
  - #draftBanner(hidden): .draft-label #draftLabelTxt + #btnDraftExit
  - #canvasWrap > iframe#canvasFrame + #codeWrap(hidden) > .code-bar(#codeFileSelect select + .code-note) + textarea#codeEditor
  - #boardWrap(hidden) > #boardViewport > #boardWorld(프레임 컨테이너) + #boardEmpty(.board-empty)
    - #boardEmpty 문구는 board.js 가 상황별로 바꿔 쓴다: 사이트 미개방 안내 / 「검색 0건」 안내.
      빈 격자만 남기면 사용자가 고장으로 읽으므로 두 경우 모두 반드시 이유를 적는다.
- #rightPanel: .right-tabs > button.right-tab[data-rtab=inspector|ai] / #panelInspector(#inspEmpty 안내, #inspBody 동적), #panelAI(위 ai.js 참조)
- 패널 스플리터: #wgSplitLeft, #wgSplitRight (.wg-split, role=separator, tabindex=0)
- 공통: #modalRoot(hidden) > .modal-card > #modalBody + .modal-actions(#modalOk,#modalCancel), #toastRoot
- #fsUnsupported (hidden) — FS API 미지원 브라우저 안내 배너

## 디자인 지침 (admin.css)

사이트 본체와 같은 DNA, 단 **도구 UI**이므로 밀도 높게.
- 토큰은 admin.css 안에 자체 정의(사이트 main.css 로드하지 않음):
  네이비 스케일(--yonsei-950:#001a38, -900:#002a5c, -800:#003876, -600:#1a5bb0, -400:#5b8fd6, -100:#e7eef8),
  잉크/페이퍼(--ink-900:#0d1520, --ink-600:#4a5568, --ink-300:#c7cfda, --paper:#fbfcfe, --paper-2:#f2f5fa),
  골드 --accent-gold:#c9a227, 시맨틱 별칭(--bg,--surface,--surface-2,--line,--text,--text-2,--brand,--link).
  다크: :root[data-theme="dark"] 오버라이드(#0a1220 bg / #111c30 surface / #21324d line / #dbe4f0 text).
- 폰트: Pretendard(본문), IBM Plex Mono(타임스탬프·경로·배지) — index.html에서 CDN 로드됨.
  --font-sans / --font-mono 정의해 사용.
- 레이아웃: 100vh 고정 그리드. topbar 52px / 좌 사이드바 240px / 우 패널 320px / 중앙 캔버스 flex.
  좌·우 폭은 layout.js 가 `--side-w`/`--right-w`(#workGrid)로 덮어쓰므로 위 값은 기본값이다.
  캔버스 배경 --surface-2, iframe은 흰 카드(그림자 --shadow-md, radius 6px), 모바일 뷰포트 시 width 390px 중앙.
- 배지 색: badge-editor 네이비 / badge-ai 골드 / badge-rollback #c0603a / badge-code #4b8a72 / badge-baseline 회색 /
  badge-login·logout 회색 / badge-save 네이비 / badge-ai-apply 골드 / badge-publish 채운 초록(#2b8a5e).
- diff: add 배경 rgba(75,138,114,.15) 좌보더 #4b8a72 / del 배경 rgba(192,96,58,.12) 좌보더 #c0603a, mono, --step--1.
- 라운드 6px 이하, 이모지 금지, 좌측 정렬, 포커스 비저블 유지(outline:none 금지).
- 인스펙터 동적 필드 클래스: .insp-sec(섹션), .insp-sec-title(mono 소제목), .insp-field(label+control),
  .insp-row(가로 버튼열), .insp-btn(소형 버튼, variant .insp-btn--danger/.insp-btn--ai), .insp-check,
  .insp-fs-row(글자 크기 스테퍼), .insp-input/.insp-select/.insp-textarea, .insp-note(회색 작은 안내).
  요소 경로는 브레드크럼: .insp-crumbs(nav) > .insp-crumb(mono 텍스트 버튼, 현재 요소 .is-current
  — 브랜드색 + --yonsei-100 배경, 다크는 rgba(91,143,214,.16)) + .insp-crumb-sep("›").
  ※ 구 .insp-elpath 는 브레드크럼으로 대체되어 더 이상 렌더되지 않는다.
- 토스트: 우하단, .toast.toast--ok|--err|--info, 등장/퇴장 트랜지션.
- 모달: 중앙 카드 max-width 720px, .modal-card, 디프 모달은 내부 스크롤(max-height 70vh).
  .modal-title(제목), .modal-msg(본문). 단축키 모달: .kbd-list > .kbd-group(.kbd-group-title mono 대문자)
  > .kbd-row(.kbd-keys 고정폭 + .kbd-desc), `kbd` 는 아래 보더 2px 의 키캡 스타일.
- 보드 모드 (admin.css 파일 끝의 「보드 모드」 섹션):
  - 툴바 #boardBar(#modeBar 와 같은 시각 언어), .board-search, .board-check, .board-count,
    .board-hint(우측 정렬, max-width 1100px 에서 숨김), #btnShortcuts.
  - 캔버스 #boardWrap(격자 배경 radial-gradient 24px), #boardViewport(cursor:grab, touch-action:none,
    .is-space/.is-panning), #boardWorld(transform-origin 0 0), .board-empty.
  - **역보정 규약**: board.js 가 #boardWorld 에 `--bz`(=1/zoom)와 `--bzl`(=min(1/zoom, 5))을 세팅한다.
    라벨 계열(.bframe-label/-name/-file/-badge)은 `--bzl`, 테두리·포커스 링·스켈레톤·잘림 페이드는
    `--bz` 를 곱해 화면상 크기를 고정한다. 두 변수를 바꿔 쓰면 낮은 줌에서 라벨이 위 프레임을 덮는다.
  - 프레임: .bframe(+.is-current/.is-selected/.is-dirty), .bframe-label/-name/-file/-badge,
    .bframe-box(+.is-clipped → 하단 페이드 + "잘림"), .bframe-frame(**pointer-events:none 필수**),
    .bframe-hit(:focus-visible 골드 링), .bframe-skel(펄스, prefers-reduced-motion 존중).
  - 프레임 안은 사이트가 흰 배경이므로 **다크 모드에서도 .bframe-box 는 흰색** 유지. 잘림 페이드도
    흰색 기준 고정. 현재 프레임 링만 다크에서 --yonsei-400 으로 밝힌다(#boardWorld 의
    `--bframe-ring-current` 변수 — .is-selected 와 특이도 충돌을 피하려고 색만 변수로 뺐다).
  - .bframe-badge("미저장")는 --surface-2 위 대비 AA 를 위해 #7a5f0c 를 쓴다(놓치면 안 되는 신호).
- 게시 패널: .gh-setup-title/.side-subhead, .gh-mode-toggle > .gh-mode(.is-active), .gh-status(mono),
  .gh-history > .gh-row > .gh-meta(.gh-when mono + .gh-who + .gh-sha mono) + .gh-msg, .empty-note.
- 패널 스플리터: .wg-split(.wg-split-left/-right, 드래그 중 .dragging), #workGrid 의
  .left-collapsed/.right-collapsed.
- 페이지 검색: .side-search(.side-select 와 같은 톤, width:100%), `[hidden]{display:none}`.
- `#canvasWrap` 은 display:flex 라 hidden 속성이 안 먹는다 → `#canvasWrap[hidden]{display:none}` 필수.
- AI 챗: 메시지 버블 좌(모델)/우(사용자, 네이비 배경), .ai-code-chip은 mono 칩,
  #aiDraftBar 는 골드 하이라이트 바(버튼 3개), .ai-msg--pending 은 점 3개 로딩 애니메이션.
- 스크롤바: 얇게 커스텀(webkit), 사이드/우 패널 각자 스크롤.
- 접근성: 대비 AA, :focus-visible 링, 버튼 min-height 32px.
