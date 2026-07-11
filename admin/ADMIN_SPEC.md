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
  js/app.js         — 부트스트랩/배선
  README.md         — 사용법(한국어)
```

로드 순서: core → store → auth → audit → fs → versions → editor → ai → app.

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
Admin.state                        // { user, sitePath, currentPath, mode, dirty }
```

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
action 값: 'login'|'logout'|'account-create'|'save'|'rollback'|'ai-apply'|'export'|'site-open'
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
Admin.fs.reconnect() -> Promise<bool>      // 저장된 핸들 권한 재요청
Admin.fs.isReady() -> bool
Admin.fs.siteName() -> string
Admin.fs.pages() -> [{path, name}]         // 루트 *.html
Admin.fs.assets() -> [{path, name}]        // assets/ 내 .css/.js
Admin.fs.readFile(path) -> Promise<string> // 'index.html', 'assets/js/data.js' 형태
Admin.fs.writeFile(path, content) -> Promise
```

### versions.js — 버전 관리 (git 스타일)
레코드: {id, path, content, ts, author, note, origin}
origin: 'editor'|'code'|'ai'|'rollback'|'baseline'
- baseline: 파일을 처음 열 때 원본 스냅샷 1회 자동 저장(해당 path에 버전 0개일 때만).
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
Admin.editor.previewDraft(html, {label}) / Admin.editor.exitDraft()
   // 임시 HTML을 캔버스에 렌더(pristine 비파괴). #draftBanner 표시는 editor가 처리.
Admin.editor.undo() / redo() / canUndo() / canRedo()
Admin.editor.isDirty() -> bool / Admin.editor.markSaved()
Admin.editor.selectedInfo() -> {eid, tag, outerHTML}|null
```
emit 이벤트: 'editor:dirty' {dirty}, 'editor:selected' {eid,tag}|null,
'canvas:navigate' {href}, 'page:loaded' {path}.

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

### app.js (작성 완료) — 배선 요약 (참고용)
- 'auth:login' → #loginView 숨기고 #workspace 표시, fs 재연결 시도.
- #btnOpenSite → fs.openSite(); 'site:opened' → 페이지 목록 렌더, 첫 페이지 로드.
- #btnSave → 저장 파이프라인: content 결정(모드별) → fs.writeFile → versions.snapshot
  → audit.log('save') → editor.markSaved() → bus.emit('file:saved',{path, rec}).
- 'version:restoreRequest' → confirm → fs.writeFile + snapshot(origin:'rollback')
  + audit.log('rollback') + editor.loadPage 재로드.
- 'ai:applyDraft' → editor.loadPage(currentPath, html, {markDirty:true}) + audit.log('ai-apply').
- 사이드바 탭/우측 탭 전환, 코드 모드(#codeEditor, #codeFileSelect), 모드바, 뷰포트,
  Ctrl+S, beforeunload 더티 가드.

## index.html DOM id 인벤토리 (전체 — CSS 작성 근거)

**로그인**: #loginView > .login-card > (#setupForm | #loginForm) — 각 폼에 .field(label+input), .form-err(#setupErr/#loginErr), button.btn-primary
**워크스페이스**: #workspace (기본 hidden)
- #topbar: .topbar-brand("YSME ADMIN STUDIO" + .brand-dot), #btnOpenSite, #siteLabel(.site-label), 우측 #saveState(.save-state, data-dirty 속성), #btnSave(.btn-primary), #userLabel, #btnLogout, #btnAdminTheme
- #sidebar: .side-tabs > button.side-tab[data-tab=pages|versions|audit] (active: .is-active) / 패널 #panelPages(#pageList ul), #panelVersions(#versionFilter select + #versionList), #panelAudit(#auditList + #btnExportAudit)
  - #pageList 행: li > button.page-item[data-path] (.is-active 현재), .page-name + .page-file(mono)
- #canvasCol: #modeBar(버튼 #modeEdit #modePreview #modeCode + 구분선 + #vpDesktop #vpMobile + #undoBtn #redoBtn), #draftBanner(hidden, .draft-label #draftLabelTxt + #btnDraftExit), #canvasWrap > iframe#canvasFrame + #codeWrap(hidden) > (#codeFileSelect select + textarea#codeEditor)
- #rightPanel: .right-tabs > button.right-tab[data-rtab=inspector|ai] / #panelInspector(#inspEmpty 안내, #inspBody 동적), #panelAI(위 ai.js 참조)
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
  캔버스 배경 --surface-2, iframe은 흰 카드(그림자 --shadow-md, radius 6px), 모바일 뷰포트 시 width 390px 중앙.
- 배지 색: badge-editor 네이비 / badge-ai 골드 / badge-rollback #c0603a / badge-code #4b8a72 / badge-baseline 회색 /
  badge-login·logout 회색 / badge-save 네이비 / badge-ai-apply 골드.
- diff: add 배경 rgba(75,138,114,.15) 좌보더 #4b8a72 / del 배경 rgba(192,96,58,.12) 좌보더 #c0603a, mono, --step--1.
- 라운드 6px 이하, 이모지 금지, 좌측 정렬, 포커스 비저블 유지(outline:none 금지).
- 인스펙터 동적 필드 클래스: .insp-sec(섹션), .insp-sec-title(mono 소제목), .insp-field(label+control),
  .insp-row(가로 버튼열), .insp-btn(소형 버튼, variant .insp-btn--danger), .insp-input/.insp-select/.insp-textarea,
  .insp-elpath(mono, 선택 요소 경로 표시), .insp-note(회색 작은 안내).
- 토스트: 우하단, .toast.toast--ok|--err|--info, 등장/퇴장 트랜지션.
- 모달: 중앙 카드 max-width 720px, .modal-card, 디프 모달은 내부 스크롤(max-height 70vh).
- AI 챗: 메시지 버블 좌(모델)/우(사용자, 네이비 배경), .ai-code-chip은 mono 칩,
  #aiDraftBar 는 골드 하이라이트 바(버튼 3개), .ai-msg--pending 은 점 3개 로딩 애니메이션.
- 스크롤바: 얇게 커스텀(webkit), 사이드/우 패널 각자 스크롤.
- 접근성: 대비 AA, :focus-visible 링, 버튼 min-height 32px.
