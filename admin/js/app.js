/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — app.js
   부트스트랩 · 뷰 전환 · 저장 파이프라인 · 탭/모드 배선
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin;
var U = Admin.util;

var codeDirty = false;      // 코드 모드 미저장 변경
var uiMode = 'edit';        // 'edit' | 'preview' | 'code'

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
        Admin.toast('「사이트 폴더 열기」로 편집할 사이트(prototype-v3)를 선택하세요.', 'info');
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
  renderPageList(d.pages);
  fillCodeFileSelect(d.pages, d.assets);
  Admin.audit.log('site-open', d.name, d.pages.length + '개 페이지');
  // 첫 페이지 자동 로드
  var first = d.pages.find(function (p) { return p.name === 'index.html'; }) || d.pages[0];
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
}

/* 파일명 → 사람이 읽는 이름 (알려진 페이지는 한국어 라벨) */
var PAGE_NAMES = {
  'index.html': '홈', 'about.html': '학부 소개', 'history.html': '연혁',
  'academics.html': '교육', 'research.html': '연구', 'lab.html': '연구실',
  'people.html': '구성원', 'professor.html': '교수', 'news.html': '소식',
  'admissions.html': '입학', 'contact.html': '연락처', 'engineering.html': '공학 이야기',
  'accessibility.html': '접근성', 'privacy.html': '개인정보처리방침', 'terms.html': '이용약관'
};
function pageTitle(name) {
  return PAGE_NAMES[name] || name.replace(/\.html?$/i, '');
}

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
  if (path === Admin.editor.currentPath() && uiMode !== 'code') return;
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
  if (uiMode === 'code') switchUiMode('edit');
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

document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    save();
  }
});

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

/* ═══════════ 모드 전환 (편집/미리보기/코드) ═══════════ */

function setModeButtons(m) {
  [['modeEdit', 'edit'], ['modePreview', 'preview'], ['modeCode', 'code']].forEach(function (pair) {
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

  uiMode = m;
  Admin.state.mode = m;
  setModeButtons(m);

  var isCode = m === 'code';
  $('codeWrap').hidden = !isCode;
  $('canvasFrame').style.display = isCode ? 'none' : '';

  if (isCode) {
    // 현재 편집 중인 페이지를 우선으로 연다 (미저장 편집도 반영됨)
    await loadCodeFile(Admin.editor.currentPath() || $('codeFileSelect').value);
  } else {
    Admin.editor.setMode(m);
  }
  updateSaveUi();
}

$('modeEdit').addEventListener('click', function () { switchUiMode('edit'); });
$('modePreview').addEventListener('click', function () { switchUiMode('preview'); });
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

/* ═══════════ 부트 ═══════════ */

document.addEventListener('DOMContentLoaded', function () {
  Admin.auth.init().then(function () {
    if (Admin.auth.current()) showWorkspace();
  });
  if (Admin.ai && Admin.ai.init) Admin.ai.init();
  if (Admin.github && Admin.github.init) Admin.github.init();
});

})();
