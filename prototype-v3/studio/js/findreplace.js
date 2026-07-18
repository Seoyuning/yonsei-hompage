/* findreplace.js — 사이트 전체 찾기/바꾸기.
   classic script. window.Admin.findreplace 에 부착.
   fs/versions/audit/editor 계약에 의존. 커스텀 버튼(미리보기·모두 바꾸기)이
   필요해 versions.js showCompare 와 같은 방식으로 #modalRoot 를 직접 제어한다.
   치환은 plain-text(정규식 이스케이프) 전체 치환. 쓰기 전 버전 스냅샷을 남긴다. */
(function () {
'use strict';

var Admin = window.Admin = window.Admin || {};
var U = Admin.util;

var SNIPPET_CTX = 30;      // 매치 전후 문맥 글자 수
var SNIPPET_MAX = 3;       // 파일당 최대 스니펫 수
var running = false;       // 모두 바꾸기 중복 실행 방지

var frOnKey = null, frOnBackdrop = null;

/* ── 매칭 유틸 ── */

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* plain-text 검색용 정규식 (전체 치환, 대소문자 옵션) */
function buildRegex(find, caseSensitive) {
  return new RegExp(escapeRegExp(find), caseSensitive ? 'g' : 'gi');
}

function countMatches(content, re) {
  re.lastIndex = 0;
  var n = 0, m;
  while ((m = re.exec(content)) !== null) {
    n += 1;
    if (m.index === re.lastIndex) re.lastIndex += 1;   // 빈 매치 방어
  }
  return n;
}

/* 파일당 최대 SNIPPET_MAX 개의 문맥 스니펫 HTML (매치는 <mark>) */
function snippetsOf(content, re, max) {
  re.lastIndex = 0;
  var out = [], m;
  function piece(s) { return U.escapeHtml(String(s).replace(/\s+/g, ' ')); }
  while (out.length < max && (m = re.exec(content)) !== null) {
    var from = Math.max(0, m.index - SNIPPET_CTX);
    var to = Math.min(content.length, m.index + m[0].length + SNIPPET_CTX);
    out.push(
      (from > 0 ? '…' : '') +
      piece(content.slice(from, m.index)) +
      '<mark>' + piece(m[0]) + '</mark>' +
      piece(content.slice(m.index + m[0].length, to)) +
      (to < content.length ? '…' : ''));
    if (m.index === re.lastIndex) re.lastIndex += 1;
  }
  return out;
}

/* 범위 → 대상 경로 목록 */
function targetPaths(scope) {
  if (scope === 'current') {
    var p = Admin.editor.currentPath();
    return p ? [p] : [];
  }
  return Admin.fs.pages().map(function (pg) { return pg.path; });
}

/* ── 모달 폼 값 읽기 ── */
function readForm(body) {
  var scopeEl = body.querySelector('input[name="frScope"]:checked');
  return {
    find: (body.querySelector('#frFind') || {}).value || '',
    replace: (body.querySelector('#frReplace') || {}).value || '',
    caseSensitive: !!(body.querySelector('#frCase') && body.querySelector('#frCase').checked),
    scope: scopeEl ? scopeEl.value : 'current'
  };
}

/* ── 미리보기: 파일별 매치 수 + 문맥 스니펫 ── */
async function renderPreview(body) {
  var form = readForm(body);
  var out = body.querySelector('#frResult');
  if (!out) return;
  if (!form.find) {
    out.innerHTML = '<p class="insp-note">찾을 내용을 입력하세요.</p>';
    return;
  }
  var paths = targetPaths(form.scope);
  if (!paths.length) {
    out.innerHTML = '<p class="insp-note">대상 페이지가 없습니다. 먼저 페이지를 여세요.</p>';
    return;
  }
  out.innerHTML = '<p class="insp-note">검색 중…</p>';

  var html = [];
  var totalFiles = 0, totalHits = 0;
  for (var i = 0; i < paths.length; i++) {
    var content;
    try { content = await Admin.fs.readFile(paths[i]); }
    catch (e) {
      html.push('<div class="fr-file"><p class="fr-file-head mono">' + U.escapeHtml(paths[i]) +
        ' · <span class="fr-err">읽기 실패</span></p></div>');
      continue;
    }
    var re = buildRegex(form.find, form.caseSensitive);
    var n = countMatches(content, re);
    if (!n) continue;
    totalFiles += 1;
    totalHits += n;
    var snips = snippetsOf(content, buildRegex(form.find, form.caseSensitive), SNIPPET_MAX);
    html.push(
      '<div class="fr-file">' +
        '<p class="fr-file-head mono">' + U.escapeHtml(paths[i]) + ' · ' + n + '개 일치</p>' +
        snips.map(function (s) { return '<p class="fr-snippet mono">' + s + '</p>'; }).join('') +
        (n > SNIPPET_MAX ? '<p class="insp-note">외 ' + (n - SNIPPET_MAX) + '개 매치 생략</p>' : '') +
      '</div>');
  }

  if (!totalHits) {
    out.innerHTML = '<p class="insp-note">일치하는 내용이 없습니다.</p>';
    return;
  }
  out.innerHTML =
    '<p class="fr-sum">' + totalFiles + '개 파일 · ' + totalHits + '개 일치</p>' + html.join('');
}

/* ── 모두 바꾸기 실행 ──
   현재 페이지가 저장 안 된 상태면 중단(파일 내용과 편집 내용이 갈라지므로).
   변경되는 각 파일: 쓰기 전 스냅샷(첫 이력이면 baseline 규약) → writeFile.
   완료 후 audit 1건(파일 수·치환 수). 현재 페이지가 바뀌었으면 재로드. */
async function runReplace(body) {
  if (running) return;
  var form = readForm(body);
  if (!form.find) { Admin.toast('찾을 내용을 입력하세요.', 'err'); return; }
  if (Admin.state.mode === 'code') {
    Admin.toast('코드 모드에서는 실행할 수 없습니다. 편집 모드로 전환 후 실행하세요.', 'err');
    return;
  }
  if (Admin.editor.isDirty()) {
    Admin.toast('저장하지 않은 변경이 있습니다 — 저장 후 실행하세요.', 'err');
    return;
  }
  var paths = targetPaths(form.scope);
  if (!paths.length) { Admin.toast('대상 페이지가 없습니다.', 'info'); return; }

  running = true;
  var runBtn = body.querySelector('#frRun');
  var prevBtn = body.querySelector('#frPreview');
  if (runBtn) runBtn.disabled = true;
  if (prevBtn) prevBtn.disabled = true;

  var changedFiles = 0, totalHits = 0, failed = [];
  var curPath = Admin.editor.currentPath();
  var currentChangedHtml = null;

  try {
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      var old;
      try { old = await Admin.fs.readFile(path); }
      catch (e) { failed.push(path); continue; }

      var re = buildRegex(form.find, form.caseSensitive);
      var n = countMatches(old, re);
      if (!n) continue;
      re.lastIndex = 0;
      // 함수 치환: 바꿀 내용의 $ 시퀀스가 특수 해석되지 않도록(plain-text 보장)
      var next = old.replace(re, function () { return form.replace; });
      if (next === old) continue;

      try {
        // 쓰기 전 스냅샷 — 이력이 없으면 openPage 의 baseline 규약을 따른다.
        // (직전 저장본과 동일하면 versions.snapshot 이 dedupe 하므로 중복 없음)
        var existing = await Admin.versions.list(path);
        if (!existing.length) {
          await Admin.versions.snapshot(path, old, { origin: 'baseline', note: '원본 (찾기/바꾸기 전 자동 백업)' });
        } else {
          await Admin.versions.snapshot(path, old, { origin: 'editor', note: '찾기/바꾸기 전 자동 백업' });
        }
        await Admin.fs.writeFile(path, next);
      } catch (e) {
        failed.push(path);
        continue;
      }
      changedFiles += 1;
      totalHits += n;
      if (path === curPath) currentChangedHtml = next;
      Admin.bus.emit('file:saved', { path: path });
    }

    if (changedFiles) {
      await Admin.audit.log('replace',
        form.scope === 'all' ? '모든 페이지' : (curPath || '현재 페이지'),
        '파일 ' + changedFiles + '개 · 치환 ' + totalHits + '회 · "' + form.find + '" → "' + form.replace + '"');
    }
  } finally {
    running = false;
    if (runBtn) runBtn.disabled = false;
    if (prevBtn) prevBtn.disabled = false;
  }

  closeDialog();

  // 현재 열린 페이지가 바뀌었으면 editor 로드 흐름으로 재로드(저장됨 상태 유지)
  if (currentChangedHtml != null && curPath) {
    await Admin.editor.loadPage(curPath, currentChangedHtml);
  }

  if (failed.length) {
    Admin.toast('일부 파일 처리 실패: ' + failed.join(', '), 'err');
  }
  if (changedFiles) {
    Admin.toast('바꾸기 완료 — 파일 ' + changedFiles + '개 · ' + totalHits + '회 치환', 'ok');
  } else if (!failed.length) {
    Admin.toast('일치하는 내용이 없어 바꾼 파일이 없습니다.', 'info');
  }
}

/* ── 모달 열기/닫기 (#modalRoot 직접 제어) ── */

function openDialog() {
  if (!Admin.fs.isReady()) { Admin.toast('먼저 사이트 폴더를 여세요.', 'err'); return; }
  var root = document.getElementById('modalRoot');
  var body = document.getElementById('modalBody');
  var ok = document.getElementById('modalOk');
  var cancel = document.getElementById('modalCancel');
  if (!root || !body || !ok || !cancel) return;
  if (root.hidden === false) return;   // 다른 모달이 열려 있으면 중단

  cancel.hidden = true;                // 닫기 버튼만 노출
  ok.textContent = '닫기';

  var curPath = Admin.editor.currentPath();
  body.innerHTML =
    '<p class="diff-modal-head mono">사이트 전체 찾기/바꾸기</p>' +
    '<div class="insp-field"><label for="frFind">찾을 내용</label>' +
      '<input id="frFind" class="insp-input" type="text" autocomplete="off" /></div>' +
    '<div class="insp-field"><label for="frReplace">바꿀 내용</label>' +
      '<input id="frReplace" class="insp-input" type="text" autocomplete="off" /></div>' +
    '<div class="fr-opts">' +
      '<label class="insp-check"><input type="checkbox" id="frCase" /> 대소문자 구분</label>' +
      '<span class="fr-scope" role="radiogroup" aria-label="바꾸기 범위">' +
        '<label class="insp-check"><input type="radio" name="frScope" value="current" checked /> 현재 페이지만' +
          (curPath ? ' <span class="mono">(' + U.escapeHtml(curPath) + ')</span>' : '') + '</label>' +
        '<label class="insp-check"><input type="radio" name="frScope" value="all" /> 모든 페이지</label>' +
      '</span>' +
    '</div>' +
    '<div class="insp-row fr-actions">' +
      '<button type="button" class="insp-btn" id="frPreview">미리보기</button>' +
      '<button type="button" class="insp-btn insp-btn--danger" id="frRun">모두 바꾸기</button>' +
    '</div>' +
    '<p class="insp-note">HTML 원문 기준 plain-text 치환입니다. 실행 전 「미리보기」로 대상을 확인하세요. ' +
    '바뀌는 파일은 쓰기 전 버전 스냅샷이 남아 「버전」 탭에서 되돌릴 수 있습니다.</p>' +
    '<div id="frResult" class="fr-result" aria-live="polite"></div>';
  root.hidden = false;

  var findInput = body.querySelector('#frFind');
  if (findInput) {
    findInput.focus();
    findInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); renderPreview(body); }
    });
  }
  var prevBtn = body.querySelector('#frPreview');
  if (prevBtn) prevBtn.addEventListener('click', function () { renderPreview(body); });
  var runBtn = body.querySelector('#frRun');
  if (runBtn) runBtn.addEventListener('click', function () { runReplace(body); });

  ok.addEventListener('click', closeDialog);
  frOnKey = function (e) { if (e.key === 'Escape' && !running) closeDialog(); };
  document.addEventListener('keydown', frOnKey);
  frOnBackdrop = function (e) { if (e.target === root && !running) closeDialog(); };
  root.addEventListener('mousedown', frOnBackdrop);
}

function closeDialog() {
  var root = document.getElementById('modalRoot');
  var body = document.getElementById('modalBody');
  var ok = document.getElementById('modalOk');
  var cancel = document.getElementById('modalCancel');
  if (ok) ok.removeEventListener('click', closeDialog);
  if (frOnKey) { document.removeEventListener('keydown', frOnKey); frOnKey = null; }
  if (root && frOnBackdrop) { root.removeEventListener('mousedown', frOnBackdrop); frOnBackdrop = null; }
  if (root) root.hidden = true;
  if (body) body.innerHTML = '';
  // core 의 confirm/prompt 를 위해 원상 복구
  if (cancel) cancel.hidden = false;
  if (ok) ok.textContent = '확인';
}

/* ── 배선 ── */
function wire() {
  var btn = document.getElementById('btnFindReplace');
  if (btn && !btn.dataset.wired) {
    btn.dataset.wired = '1';
    btn.addEventListener('click', openDialog);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wire);
} else {
  wire();
}

Admin.findreplace = {
  open: openDialog
};

})();
