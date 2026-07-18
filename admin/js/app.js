/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — app.js
   부트스트랩 · 뷰 전환 · 저장 파이프라인 · 탭/모드 배선
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin;
var U = Admin.util;

var codeDirty = false;      // 코드 모드 미저장 변경
var uiMode = 'edit';        // 'edit' | 'preview' | 'board' | 'code'

function $(id) { return document.getElementById(id); }

/* ═══════════ 인증 화면 전환 ═══════════ */

function showWorkspace() {
  $('loginView').hidden = true;
  $('workspace').hidden = false;
  var u = Admin.state.user;
  $('userLabel').textContent = u ? (u.username + ' · ' + (u.role || 'admin')) : '';
}

function showLogin() {
  $('workspace').hidden = true;
  $('loginView').hidden = false;
}

Admin.bus.on('auth:login', function () {
  showWorkspace();
  // 지난 세션의 사이트 폴더가 있으면 조용히 재연결 시도(권한 이미 부여된 경우)
  if (!Admin.fs.isReady()) {
    Admin.fs.reconnect(false).then(function (ok) {
      if (!ok) {
        Admin.toast('「사이트 폴더 열기」로 편집할 사이트(design-candidates 또는 prototype-v3)를 선택하세요.', 'info');
      }
    });
  }
});

Admin.bus.on('auth:logout', function () {
  showLogin();
});

/* ═══════════ 사이트 열기 · 페이지 목록 ═══════════ */

$('btnOpenSite').addEventListener('click', async function () {
  // 저장된 핸들이 있으면 권한 재요청부터 (픽커 생략 가능)
  if (!Admin.fs.isReady()) {
    var re = await Admin.fs.reconnect(true);
    if (re) return;
  }
  await Admin.fs.openSite();
});

Admin.bus.on('site:opened', function (d) {
  $('siteLabel').textContent = d.name + '/';
  $('pagesEmpty').hidden = true;
  $('pageSearch').hidden = false;
  renderPageList(d.pages);
  fillCodeFileSelect(d.pages, d.assets);
  Admin.audit.log('site-open', d.name, d.pages.length + '개 페이지');
  // 첫 페이지 자동 로드 — index.html 은 G-console 로 넘기는 리다이렉트 스텁일 수
  // 있으므로(design-candidates) 실제 홈인 G-console.html 을 우선한다
  var first = d.pages.find(function (p) { return p.name === 'G-console.html'; }) ||
    d.pages.find(function (p) { return p.name === 'index.html'; }) || d.pages[0];
  if (first) openPage(first.path);
});

function renderPageList(pages) {
  var ul = $('pageList');
  ul.innerHTML = pages.map(function (p) {
    return '<li><button type="button" class="page-item" data-path="' + U.escapeHtml(p.path) + '">' +
      '<span class="page-name">' + U.escapeHtml(pageTitle(p.name)) + '</span>' +
      '<span class="page-file mono">' + U.escapeHtml(p.name) + '</span>' +
      '</button></li>';
  }).join('');
  // 목록을 새로 그렸으므로 검색 필터는 초기화
  $('pageSearch').value = '';
  $('pageSearchEmpty').hidden = true;
}

/* 좌측 페이지 목록 검색 — 파일 경로 또는 한국어 이름에 부분일치(대소문자 무시) */
function applyPageFilter() {
  var q = ($('pageSearch').value || '').trim().toLowerCase();
  var shown = 0;
  $('pageList').querySelectorAll('li').forEach(function (li) {
    var btn = li.querySelector('.page-item');
    // btn.textContent = 한국어 이름 + 파일명. data-path 로 하위 경로까지 커버.
    var hay = btn ? ((btn.getAttribute('data-path') || '') + ' ' + btn.textContent).toLowerCase() : '';
    var hit = !q || hay.indexOf(q) >= 0;
    li.hidden = !hit;
    if (hit) shown += 1;
  });
  $('pageSearchEmpty').hidden = !(q && shown === 0);
}

$('pageSearch').addEventListener('input', U.debounce(applyPageFilter, 150));

/* 파일명 → 사람이 읽는 이름 (알려진 페이지는 한국어 라벨) */
var PAGE_NAMES = {
  'index.html': '홈', 'about.html': '학부 소개', 'history.html': '연혁',
  'academics.html': '교육', 'research.html': '연구', 'lab.html': '연구실',
  'people.html': '구성원', 'professor.html': '교수', 'news.html': '소식',
  'admissions.html': '입학', 'contact.html': '연락처', 'engineering.html': '공학 이야기',
  'accessibility.html': '접근성', 'privacy.html': '개인정보처리방침', 'terms.html': '이용약관',
  /* 관제(G · design-candidates) 사이트 페이지 */
  'G-console.html': '관제 · 홈', 'G-about.html': '관제 · 소개', 'G-academics.html': '관제 · 교육',
  'G-research.html': '관제 · 연구', 'G-people.html': '관제 · 구성원', 'G-news.html': '관제 · 소식',
  'G-admissions.html': '관제 · 입학', 'D-drafting.html': '도면 시안'
};
function pageTitle(name) {
  return PAGE_NAMES[name] || name.replace(/\.html?$/i, '');
}
/* board.js 등 다른 모듈이 런타임에 쓰도록 노출 (로드 순서 무관 — 호출 시점에만 참조된다) */
Admin.util.pageTitle = pageTitle;

function markActivePage(path) {
  document.querySelectorAll('.page-item').forEach(function (b) {
    b.classList.toggle('is-active', b.getAttribute('data-path') === path);
  });
  $('currentPathLabel').textContent = path || '';
}

$('pageList').addEventListener('click', function (e) {
  var btn = e.target.closest('.page-item');
  if (!btn) return;
  openPage(btn.getAttribute('data-path'));
});

/* 페이지 로드 (더티 가드 포함) */
async function openPage(path) {
  if (!Admin.fs.isReady()) return;
  if (path === Admin.editor.currentPath() && uiMode !== 'code') {
    // 이미 열린 페이지 — 다시 읽지 않는다. 단 보드에서 고른 것이면 편집 모드로는 나와야 한다.
    if (uiMode === 'board') await switchUiMode('edit');
    return;
  }
  if (Admin.editor.isDirty() || codeDirty) {
    var ok = await Admin.confirm('저장하지 않은 변경이 있습니다.\n버리고 다른 페이지로 이동할까요?');
    if (!ok) return;
  }
  var html;
  try {
    html = await Admin.fs.readFile(path);
  } catch (e) {
    Admin.toast('파일을 읽지 못했습니다: ' + path, 'err');
    return;
  }
  codeDirty = false;
  if (uiMode === 'code' || uiMode === 'board') await switchUiMode('edit');
  await Admin.editor.loadPage(path, html);
  markActivePage(path);
  // 최초 열람 시 원본 baseline 스냅샷
  var existing = await Admin.versions.list(path);
  if (!existing.length) {
    await Admin.versions.snapshot(path, html, { origin: 'baseline', note: '원본 (최초 열람 시점)' });
  }
  updateSaveUi();
}

Admin.bus.on('canvas:navigate', function (d) {
  if (!d || !d.href) return;
  var pages = Admin.fs.pages();
  var hit = pages.find(function (p) { return p.path === d.href; });
  if (hit) openPage(hit.path);
  else Admin.toast('사이트 폴더에 없는 페이지입니다: ' + d.href, 'info');
});

/* ═══════════ 저장 파이프라인 ═══════════ */

async function save() {
  if (!Admin.fs.isReady()) { Admin.toast('먼저 사이트 폴더를 여세요.', 'err'); return; }

  var path, content, origin;
  if (uiMode === 'code') {
    path = $('codeFileSelect').value;
    content = $('codeEditor').value;
    origin = 'code';
  } else {
    path = Admin.editor.currentPath();
    content = Admin.editor.getCleanHtml();
    origin = 'editor';
  }
  if (!path || !content) { Admin.toast('저장할 내용이 없습니다.', 'info'); return; }

  var btn = $('btnSave');
  btn.disabled = true;
  try {
    await Admin.fs.writeFile(path, content);
    var rec = await Admin.versions.snapshot(path, content, { origin: origin });
    await Admin.audit.log('save', path, origin === 'code' ? '코드 모드 저장' : '비주얼 편집 저장');

    if (uiMode === 'code') {
      codeDirty = false;
      // 코드로 고친 파일이 현재 편집 중 페이지라면 편집기 원본도 동기화
      if (path === Admin.editor.currentPath()) {
        await Admin.editor.loadPage(path, content);
      }
    } else {
      Admin.editor.markSaved();
    }
    Admin.bus.emit('file:saved', { path: path, rec: rec });
    Admin.toast('저장되었습니다 — ' + path, 'ok');
  } catch (e) {
    console.error(e);
    Admin.toast('저장 실패: ' + (e && e.message ? e.message : e), 'err');
  }
  updateSaveUi();
}

$('btnSave').addEventListener('click', save);

function updateSaveUi() {
  var isDirty = uiMode === 'code' ? codeDirty : Admin.editor.isDirty();
  var st = $('saveState');
  st.dataset.dirty = String(isDirty);
  st.textContent = isDirty ? '저장 안 됨' : '저장됨';
  $('btnSave').disabled = !isDirty;
}

Admin.bus.on('editor:dirty', updateSaveUi);

Admin.bus.on('editor:history', function (d) {
  $('undoBtn').disabled = !d.canUndo;
  $('redoBtn').disabled = !d.canRedo;
});

$('undoBtn').addEventListener('click', function () { Admin.editor.undo(); });
$('redoBtn').addEventListener('click', function () { Admin.editor.redo(); });

window.addEventListener('beforeunload', function (e) {
  if (Admin.editor.isDirty() || codeDirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});

/* ═══════════ 모드 전환 (편집/미리보기/보드/코드) ═══════════ */

function setModeButtons(m) {
  [['modeEdit', 'edit'], ['modePreview', 'preview'], ['modeBoard', 'board'], ['modeCode', 'code']].forEach(function (pair) {
    var b = $(pair[0]);
    b.classList.toggle('is-active', m === pair[1]);
    b.setAttribute('aria-pressed', String(m === pair[1]));
  });
}

async function switchUiMode(m) {
  if (m === uiMode) return;

  if (uiMode === 'code' && codeDirty) {
    var ok = await Admin.confirm('코드 모드의 변경 사항이 저장되지 않았습니다.\n버리고 나갈까요?');
    if (!ok) return;
    codeDirty = false;
  }

  var prev = uiMode;
  uiMode = m;
  Admin.state.mode = m;
  setModeButtons(m);

  var isCode = m === 'code', isBoard = m === 'board';
  $('codeWrap').hidden = !isCode;
  $('canvasFrame').style.display = isCode ? 'none' : '';
  $('canvasWrap').hidden = isBoard;      // admin.css 의 #canvasWrap[hidden]{display:none} 규칙이 받는다
  $('boardWrap').hidden = !isBoard;
  $('boardBar').hidden = !isBoard;

  // 보드에서 나갈 때만 정지 (옵저버·렌더 큐. DOM 은 유지된다)
  if (prev === 'board' && !isBoard && Admin.board) Admin.board.hide();

  if (isCode) {
    // 현재 편집 중인 페이지를 우선으로 연다 (미저장 편집도 반영됨)
    await loadCodeFile(Admin.editor.currentPath() || $('codeFileSelect').value);
  } else if (isBoard) {
    if (Admin.board) await Admin.board.show();
  } else {
    Admin.editor.setMode(m);   // 'edit' | 'preview' 만 받는다
  }
  updateSaveUi();
}

$('modeEdit').addEventListener('click', function () { switchUiMode('edit'); });
$('modePreview').addEventListener('click', function () { switchUiMode('preview'); });
$('modeBoard').addEventListener('click', function () { switchUiMode('board'); });
$('modeCode').addEventListener('click', function () { switchUiMode('code'); });

/* 뷰포트 */
[['vpDesktop', 'desktop'], ['vpMobile', 'mobile']].forEach(function (pair) {
  $(pair[0]).addEventListener('click', function () {
    $('vpDesktop').classList.toggle('is-active', pair[1] === 'desktop');
    $('vpMobile').classList.toggle('is-active', pair[1] === 'mobile');
    $('vpDesktop').setAttribute('aria-pressed', String(pair[1] === 'desktop'));
    $('vpMobile').setAttribute('aria-pressed', String(pair[1] === 'mobile'));
    Admin.editor.setViewport(pair[1]);
  });
});

/* ═══════════ 보드 모드 배선 ═══════════
   실제 엔진은 board.js(Admin.board). 로드 실패해도 앱이 죽지 않도록 전부 방어적으로 호출한다. */

$('boardZoomIn').addEventListener('click', function () { if (Admin.board) Admin.board.zoomIn(); });
$('boardZoomOut').addEventListener('click', function () { if (Admin.board) Admin.board.zoomOut(); });
$('boardZoomLevel').addEventListener('click', function () { if (Admin.board) Admin.board.reset100(); });
$('boardFit').addEventListener('click', function () { if (Admin.board) Admin.board.fit(); });
$('boardMobile').addEventListener('change', function () { if (Admin.board) Admin.board.setMobile(this.checked); });
$('boardFull').addEventListener('change', function () { if (Admin.board) Admin.board.setFullHeight(this.checked); });

$('boardSearch').addEventListener('input', U.debounce(function () {
  if (Admin.board) Admin.board.filter($('boardSearch').value);
}, 200));

Admin.bus.on('board:zoom', function (d) {
  $('boardZoomLevel').textContent = Math.round((d && d.zoom ? d.zoom : 1) * 100) + '%';
});

/* 프레임 더블클릭/Enter/라벨 클릭 → 그 페이지를 편집 모드로 연다.
   모드 전환이 먼저다 — openPage 는 currentPath 가 같으면 일찍 반환하므로. */
Admin.bus.on('board:open', async function (d) {
  if (!d || !d.path) return;
  await switchUiMode('edit');
  await openPage(d.path);
});

/* ═══════════ 코드 모드 ═══════════ */

function fillCodeFileSelect(pages, assets) {
  var sel = $('codeFileSelect');
  var opts = [];
  pages.forEach(function (p) {
    opts.push('<option value="' + U.escapeHtml(p.path) + '">' + U.escapeHtml(p.path) + '</option>');
  });
  if (assets.length) {
    opts.push('<optgroup label="assets">');
    assets.forEach(function (a) {
      opts.push('<option value="' + U.escapeHtml(a.path) + '">' + U.escapeHtml(a.path) + '</option>');
    });
    opts.push('</optgroup>');
  }
  sel.innerHTML = opts.join('');
}

async function loadCodeFile(path) {
  if (!path) return;
  var sel = $('codeFileSelect');
  sel.value = path;
  var ed = $('codeEditor');
  try {
    // 현재 편집 중 페이지는 (미저장 편집 반영된) 편집기 내용을 보여준다
    if (path === Admin.editor.currentPath() && Admin.editor.isDirty()) {
      ed.value = Admin.editor.getCleanHtml();
      codeDirty = true;
    } else {
      ed.value = await Admin.fs.readFile(path);
      codeDirty = false;
    }
  } catch (e) {
    Admin.toast('파일을 읽지 못했습니다: ' + path, 'err');
    ed.value = '';
  }
  updateSaveUi();
}

$('codeFileSelect').addEventListener('change', async function () {
  if (codeDirty) {
    var ok = await Admin.confirm('코드 변경이 저장되지 않았습니다. 버리고 다른 파일을 열까요?');
    if (!ok) return;
    codeDirty = false;
  }
  loadCodeFile($('codeFileSelect').value);
});

$('codeEditor').addEventListener('input', function () {
  codeDirty = true;
  updateSaveUi();
});

/* ═══════════ 버전 복원 ═══════════ */

Admin.bus.on('version:restoreRequest', async function (d) {
  var rec = await Admin.versions.get(d.id);
  if (!rec) { Admin.toast('버전을 찾을 수 없습니다.', 'err'); return; }
  var ok = await Admin.confirm(
    rec.path + ' 파일을\n' + U.fmtTime(rec.ts) + ' 버전으로 복원할까요?\n' +
    '(복원도 새 버전으로 기록되어 언제든 다시 되돌릴 수 있습니다)');
  if (!ok) return;
  try {
    await Admin.fs.writeFile(rec.path, rec.content);
    await Admin.versions.snapshot(rec.path, rec.content, {
      origin: 'rollback',
      note: U.fmtTime(rec.ts) + ' 버전으로 복원'
    });
    await Admin.audit.log('rollback', rec.path, U.fmtTime(rec.ts) + ' 버전 복원');
    if (rec.path === Admin.editor.currentPath()) {
      await Admin.editor.loadPage(rec.path, rec.content);
    }
    // 코드 편집기에 열려 있는 파일이면 (편집 중 페이지와 무관하게) 복원 내용으로 동기화
    if (uiMode === 'code' && $('codeFileSelect').value === rec.path) {
      $('codeEditor').value = rec.content;
      codeDirty = false;
      updateSaveUi();
    }
    Admin.bus.emit('file:saved', { path: rec.path });
    Admin.toast('복원되었습니다 — ' + rec.path, 'ok');
  } catch (e) {
    Admin.toast('복원 실패: ' + (e && e.message ? e.message : e), 'err');
  }
});

/* ═══════════ AI 초안 적용 ═══════════ */

Admin.bus.on('ai:applyDraft', async function (d) {
  if (!d || !d.html) return;
  var path = Admin.editor.currentPath();
  if (!path) { Admin.toast('열려 있는 페이지가 없습니다.', 'err'); return; }
  await Admin.editor.loadPage(path, d.html, { markDirty: true });
  // AI 적용분을 버전으로 즉시 기록(origin='ai'). 이후 동일 내용 저장은 dedupe 되어 중복 안 생김.
  var rec = await Admin.versions.snapshot(path, d.html, { origin: 'ai', note: 'AI 초안 적용' });
  await Admin.audit.log('ai-apply', path, 'AI 초안 적용 (버전 기록됨)');
  Admin.versions.renderList();   // 버전 패널 즉시 갱신(활성 아니어도 #versionList 갱신)
  Admin.toast('AI 초안이 적용되고 버전에 기록되었습니다. 확인 후 「저장」을 누르세요.', 'ok');
  updateSaveUi();
});

/* ═══════════ 사이드바 / 우측 탭 ═══════════ */

document.querySelectorAll('.side-tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.side-tab').forEach(function (t) {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });
    var key = tab.getAttribute('data-tab');
    $('panelPages').hidden = key !== 'pages';
    $('panelVersions').hidden = key !== 'versions';
    $('panelAudit').hidden = key !== 'audit';
    $('panelPublish').hidden = key !== 'publish';
    if (key === 'versions') Admin.versions.renderList();
    if (key === 'audit') Admin.audit.renderList();
  });
});

document.querySelectorAll('.right-tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.right-tab').forEach(function (t) {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });
    var key = tab.getAttribute('data-rtab');
    $('panelInspector').hidden = key !== 'inspector';
    $('panelAI').hidden = key !== 'ai';
  });
});

/* AI 요소 연결 시 AI 탭 자동 전환 */
Admin.bus.on('ai:editElement', function () {
  var aiTab = document.querySelector('.right-tab[data-rtab="ai"]');
  if (aiTab) aiTab.click();
});

/* ═══════════ 테마 · 로그아웃 ═══════════ */

$('btnAdminTheme').addEventListener('click', function () {
  var root = document.documentElement;
  var dark = root.dataset.theme === 'dark';
  if (dark) delete root.dataset.theme;
  else root.dataset.theme = 'dark';
  this.setAttribute('aria-pressed', String(!dark));
  try { localStorage.setItem('ysme-admin-theme', dark ? 'light' : 'dark'); } catch (e) {}
});

$('btnLogout').addEventListener('click', async function () {
  if (Admin.editor.isDirty() || codeDirty) {
    var ok = await Admin.confirm('저장하지 않은 변경이 있습니다. 버리고 로그아웃할까요?');
    if (!ok) return;
  }
  Admin.auth.logout();
});

/* ═══════════ 단축키 ═══════════
   부모 document 의 keydown 과, 캔버스 iframe 안에서 editor.js 가 넘겨주는 'canvas:key' 를
   같은 handleShortcut() 하나로 처리한다. (두 경로가 각자 save() 를 부르면 중복 저장된다) */

function isTypingTarget(el) {
  if (!el) return false;
  var t = (el.tagName || '').toLowerCase();
  return t === 'input' || t === 'textarea' || t === 'select' || el.isContentEditable === true;
}

function modalOpen() {
  var r = $('modalRoot');
  return !!r && !r.hidden;
}

var MODE_KEYS = { '1': 'edit', '2': 'preview', '3': 'board', '4': 'code' };

/* k = {key, ctrlKey, metaKey, shiftKey, altKey, inEditable, preventDefault?}
   preventDefault 는 부모 document 경로에만 있다 — iframe 쪽은 editor.js 가 이미 막았다. */
function handleShortcut(k) {
  if (!k || typeof k.key !== 'string') return false;
  if ($('workspace').hidden) return false;   // 로그인 화면에서는 단축키 없음
  if (modalOpen()) return false;             // 모달 뒤에서 모드가 바뀌면 안 된다

  var mod = k.ctrlKey || k.metaKey;
  var lower = k.key.toLowerCase();
  function stop() { if (k.preventDefault) k.preventDefault(); }

  /* 저장 — 입력 중이든 아니든 항상 */
  if (mod && lower === 's') { stop(); save(); return true; }

  /* 취소 / 재실행 — 편집 모드 + 입력 중 아닐 때만.
     (입력 중이면 막지 않고 흘려보내 브라우저 기본 undo 가 동작하게 둔다) */
  if (mod && !k.shiftKey && lower === 'z') {
    if (k.inEditable || uiMode !== 'edit') return false;
    stop(); Admin.editor.undo(); return true;
  }
  if (mod && ((k.shiftKey && lower === 'z') || lower === 'y')) {
    if (k.inEditable || uiMode !== 'edit') return false;
    stop(); Admin.editor.redo(); return true;
  }

  /* 이하 조합키 없는 단일 키 — 글자 입력 중이면 절대 발동하지 않는다 */
  if (mod || k.altKey || k.inEditable) return false;

  if (k.key === '?') { stop(); showShortcutHelp(); return true; }

  if (MODE_KEYS[k.key]) {
    if (!Admin.fs.isReady()) return false;   // 사이트 폴더가 없으면 전환할 것도 없다
    stop(); switchUiMode(MODE_KEYS[k.key]); return true;
  }
  return false;
}

document.addEventListener('keydown', function (e) {
  handleShortcut({
    key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
    shiftKey: e.shiftKey, altKey: e.altKey,
    inEditable: isTypingTarget(e.target),
    preventDefault: function () { e.preventDefault(); }
  });
});

/* 캔버스 iframe 내부 키 — editor.js 가 자기가 처리하지 않은 것만 넘긴다 */
Admin.bus.on('canvas:key', function (k) { handleShortcut(k); });

/* ═══════════ 단축키 도움말 ═══════════ */

function kbdRow(keys, desc) {
  return '<div class="kbd-row"><span class="kbd-keys">' +
    keys.map(function (k) { return '<kbd>' + U.escapeHtml(k) + '</kbd>'; }).join('') +
    '</span><span class="kbd-desc">' + U.escapeHtml(desc) + '</span></div>';
}

function kbdGroup(title, rows) {
  return '<div class="kbd-group"><p class="kbd-group-title mono">' + U.escapeHtml(title) + '</p>' +
    rows.map(function (r) { return kbdRow(r[0], r[1]); }).join('') + '</div>';
}

function showShortcutHelp() {
  var html = '<h2 class="modal-title">단축키</h2><div class="kbd-list">' +
    kbdGroup('모드', [
      [['1'], '편집'],
      [['2'], '미리보기'],
      [['3'], '보드'],
      [['4'], '코드']
    ]) +
    kbdGroup('편집', [
      [['Ctrl', 'S'], '저장'],
      [['Ctrl', 'Z'], '취소'],
      [['Ctrl', 'Y'], '재실행'],
      [['Esc'], '선택 해제'],
      [['Del'], '선택 요소 삭제'],
      [['Ctrl', 'D'], '선택 요소 복제'],
      [['Alt', '↑ / ↓'], '선택 요소 순서 이동']
    ]) +
    kbdGroup('보드', [
      [['드래그'], '화면 이동'],
      [['Space', '드래그'], '화면 이동 (프레임 위에서도)'],
      [['Ctrl', '휠'], '확대 · 축소'],
      [['휠'], '세로 이동'],
      [['Shift', '휠'], '가로 이동'],
      [['더블클릭'], '그 페이지를 편집 모드로 열기']
    ]) +
    kbdGroup('기타', [
      [['?'], '이 도움말']
    ]) +
    '</div>';
  Admin.modalShow(html, { okText: '닫기' });
}

$('btnShortcuts').addEventListener('click', showShortcutHelp);

/* ═══════════ 부트 ═══════════ */

document.addEventListener('DOMContentLoaded', function () {
  Admin.auth.init().then(function () {
    if (Admin.auth.current()) showWorkspace();
  });
  if (Admin.ai && Admin.ai.init) Admin.ai.init();
  if (Admin.board && Admin.board.init) Admin.board.init();
  if (Admin.github && Admin.github.init) Admin.github.init();
});

})();
