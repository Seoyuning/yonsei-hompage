/* versions.js — 버전 스냅샷 / 라인 디프 / 롤백 요청.
   classic script. window.Admin.versions 에 부착. core/store/fs/editor 계약에 의존. */
(function () {
  'use strict';

  var Admin = window.Admin = window.Admin || {};
  var util = Admin.util;
  var store = Admin.store;
  var bus = Admin.bus;

  var esc = function (s) { return (util && util.escapeHtml) ? util.escapeHtml(s) : String(s == null ? '' : s); };

  // origin 배지 한국어 라벨(클래스는 원본 origin 사용)
  var ORIGIN_LABEL = {
    editor: '편집',
    code: '코드',
    ai: 'AI',
    rollback: '롤백',
    baseline: '원본'
  };

  var LCS_CAP = 4000000; // n*m 이 이 값을 넘으면 LCS 생략(메모리 방어)

  // ── 유틸: 문자열을 라인 배열로 ──────────────────────────────
  function splitLines(s) {
    return String(s == null ? '' : s).split('\n');
  }

  // ── LCS 라인 디프(prefix/suffix 트리밍 후 DP) ───────────────
  function diffLines(oldStr, newStr) {
    var a = splitLines(oldStr);
    var b = splitLines(newStr);
    var aLen = a.length, bLen = b.length;

    // 공통 prefix
    var start = 0;
    var maxPre = Math.min(aLen, bLen);
    while (start < maxPre && a[start] === b[start]) start++;

    // 공통 suffix
    var aEnd = aLen, bEnd = bLen;
    while (aEnd > start && bEnd > start && a[aEnd - 1] === b[bEnd - 1]) { aEnd--; bEnd--; }

    var out = [];
    var i;
    for (i = 0; i < start; i++) out.push({ type: 'same', line: a[i] });

    var am = a.slice(start, aEnd);
    var bm = b.slice(start, bEnd);
    var mid = lcsDiff(am, bm);
    for (i = 0; i < mid.length; i++) out.push(mid[i]);

    for (i = aEnd; i < aLen; i++) out.push({ type: 'same', line: a[i] });
    return out;
  }

  function lcsDiff(a, b) {
    var n = a.length, m = b.length, i, j, out = [];
    if (n === 0) { for (i = 0; i < m; i++) out.push({ type: 'add', line: b[i] }); return out; }
    if (m === 0) { for (i = 0; i < n; i++) out.push({ type: 'del', line: a[i] }); return out; }

    // 방어: 트리밍 후에도 규모가 크면 전체 교체로 처리
    if (n * m > LCS_CAP) {
      for (i = 0; i < n; i++) out.push({ type: 'del', line: a[i] });
      for (j = 0; j < m; j++) out.push({ type: 'add', line: b[j] });
      return out;
    }

    // dp[i][j] = a[i..], b[j..] 의 LCS 길이
    var dp = new Array(n + 1);
    for (i = 0; i <= n; i++) dp[i] = new Uint32Array(m + 1);
    for (i = n - 1; i >= 0; i--) {
      var dpi = dp[i], dpi1 = dp[i + 1], ai = a[i];
      for (j = m - 1; j >= 0; j--) {
        dpi[j] = (ai === b[j]) ? dpi1[j + 1] + 1 : Math.max(dpi1[j], dpi[j + 1]);
      }
    }

    i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { out.push({ type: 'same', line: a[i] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: 'del', line: a[i] }); i++; }
      else { out.push({ type: 'add', line: b[j] }); j++; }
    }
    while (i < n) { out.push({ type: 'del', line: a[i] }); i++; }
    while (j < m) { out.push({ type: 'add', line: b[j] }); j++; }
    return out;
  }

  // ── 스토어 접근 ─────────────────────────────────────────────
  async function versionsForPath(path) {
    var recs = await store.list('versions', { index: 'byPath', value: path });
    recs = recs || [];
    recs.sort(function (x, y) { return y.ts - x.ts; }); // 최신순(ts 기준)
    return recs;
  }

  async function allVersions() {
    var recs = await store.list('versions');
    recs = recs || [];
    recs.sort(function (x, y) { return y.ts - x.ts; });
    return recs;
  }

  // ── snapshot ────────────────────────────────────────────────
  async function snapshot(path, content, opts) {
    opts = opts || {};
    var origin = opts.origin || 'editor';
    var note = opts.note || '';

    // 직전 버전(같은 path 최신)과 content 동일하면 생략
    var recent = await versionsForPath(path);
    var last = recent[0];
    if (last && last.content === content) return last;

    var author = (Admin.state && Admin.state.user && Admin.state.user.username) || '알 수 없음';
    var rec = {
      id: util.uid('ver'),
      path: path,
      content: content,
      ts: Date.now(),
      author: author,
      note: note,
      origin: origin
    };
    await store.put('versions', rec);
    return rec;
  }

  function list(path) {
    return (path == null) ? allVersions() : versionsForPath(path);
  }

  function get(id) {
    return store.get('versions', id);
  }

  // ── 현재 파일 내용 헬퍼 ─────────────────────────────────────
  function editorCurrentPath() {
    try {
      if (Admin.editor && typeof Admin.editor.currentPath === 'function') {
        return Admin.editor.currentPath();
      }
    } catch (e) {}
    return null;
  }

  function editorCleanHtml() {
    try {
      if (Admin.editor && typeof Admin.editor.getCleanHtml === 'function') {
        return Admin.editor.getCleanHtml();
      }
    } catch (e) {}
    return null;
  }

  // rec.path 기준의 "현재" 내용: 편집 중 파일이면 캔버스 정리본, 아니면 파일 원본
  async function currentContentFor(path) {
    if (editorCurrentPath() === path) {
      var clean = editorCleanHtml();
      if (clean != null) return clean;
    }
    if (Admin.fs && typeof Admin.fs.readFile === 'function') {
      try { return await Admin.fs.readFile(path); } catch (e) { return null; }
    }
    return null;
  }

  // ── 목록 렌더 ───────────────────────────────────────────────
  async function renderList() {
    var listEl = document.querySelector('#versionList');
    var filterEl = document.querySelector('#versionFilter');
    if (!listEl) return;

    var curPath = editorCurrentPath();
    var curContent = curPath ? editorCleanHtml() : null;

    var all = await allVersions();

    // 필터 옵션 구성(현재 열린 파일 우선)
    var selected = filterEl ? filterEl.value : 'all';
    if (filterEl) {
      var paths = [];
      var seen = {};
      if (curPath) { paths.push(curPath); seen[curPath] = true; }
      for (var k = 0; k < all.length; k++) {
        var p = all[k].path;
        if (!seen[p]) { seen[p] = true; paths.push(p); }
      }
      var opts = ['<option value="all">전체 파일</option>'];
      for (var q = 0; q < paths.length; q++) {
        opts.push('<option value="' + esc(paths[q]) + '">' + esc(paths[q]) + '</option>');
      }
      filterEl.innerHTML = opts.join('');

      // 선택값 복원(유효하지 않으면 현재 파일 → all)
      var valid = (selected === 'all') || paths.indexOf(selected) !== -1;
      if (!valid) selected = curPath && paths.indexOf(curPath) !== -1 ? curPath : 'all';
      filterEl.value = selected;
    } else {
      selected = 'all';
    }

    var rows = (selected === 'all') ? all : all.filter(function (r) { return r.path === selected; });

    if (!rows.length) {
      listEl.innerHTML = '<p class="empty-note">저장된 버전이 없습니다.</p>';
      return;
    }

    var html = [];
    for (var i = 0; i < rows.length; i++) {
      var rec = rows[i];
      var isCurrent = (rec.path === curPath) && (curContent != null) && (rec.content === curContent);
      var originLabel = ORIGIN_LABEL[rec.origin] || esc(rec.origin);
      var ts = (util && util.fmtTime) ? util.fmtTime(rec.ts) : String(rec.ts);
      var noteHtml = rec.note ? '<span class="ver-note">' + esc(rec.note) + '</span>' : '';
      var pathHint = (selected === 'all') ? '<span class="ver-note">' + esc(rec.path) + '</span>' : '';

      html.push(
        '<div class="ver-row' + (isCurrent ? ' is-current' : '') + '">' +
          '<div class="ver-meta">' +
            '<span class="ver-ts mono">' + esc(ts) + '</span>' +
            '<span class="ver-author">' + esc(rec.author) + '</span>' +
            '<span class="ver-origin badge-' + esc(rec.origin) + '">' + originLabel + '</span>' +
            noteHtml + pathHint +
          '</div>' +
          '<div class="ver-actions">' +
            '<button type="button" class="ver-btn" data-act="preview" data-id="' + esc(rec.id) + '">미리보기</button>' +
            '<button type="button" class="ver-btn" data-act="diff" data-id="' + esc(rec.id) + '">비교</button>' +
            '<button type="button" class="ver-btn" data-act="restore" data-id="' + esc(rec.id) + '">복원</button>' +
          '</div>' +
        '</div>'
      );
    }
    listEl.innerHTML = html.join('');
  }

  // ── 버튼 동작 ───────────────────────────────────────────────
  async function onPreview(rec) {
    if (Admin.editor && typeof Admin.editor.previewDraft === 'function') {
      var label = '버전 미리보기 · ' + ((util && util.fmtTime) ? util.fmtTime(rec.ts) : rec.ts);
      Admin.editor.previewDraft(rec.content, { label: label });
    } else if (Admin.toast) {
      Admin.toast('미리보기를 사용할 수 없습니다.', 'err');
    }
  }

  function onRestore(rec) {
    // 실제 복원은 app.js 담당
    if (bus) bus.emit('version:restoreRequest', { id: rec.id });
  }

  async function onDiff(rec) {
    var originLabel = ORIGIN_LABEL[rec.origin] || rec.origin;
    var ts = (util && util.fmtTime) ? util.fmtTime(rec.ts) : String(rec.ts);
    var header = rec.path + ' · ' + originLabel + ' · ' + ts;
    var current = await currentContentFor(rec.path);
    if (current == null) {
      showCompare(rec.content, rec.content, { header: header, note: '현재 파일 내용을 읽을 수 없어 현재본과 비교할 수 없습니다.' });
      return;
    }
    // 이 버전(과거) ↔ 현재(현행)
    showCompare(rec.content, current, { header: header, oldLabel: '이 버전 (' + originLabel + ')', newLabel: '현재' });
  }

  // 임의의 두 내용 비교 (ai.js 등 외부 재사용). 기본=화면 비교, 토글로 코드 비교.
  function showDiff(oldStr, newStr, headerText) {
    showCompare(oldStr, newStr, { header: headerText || '비교' });
  }

  // 변경부 주변 ±2줄만 남기고 사이는 접기
  function buildDiffView(diff) {
    var n = diff.length, i;
    var hasChange = false;
    for (i = 0; i < n; i++) { if (diff[i].type !== 'same') { hasChange = true; break; } }
    if (!hasChange) {
      return '<p class="insp-note">두 내용이 동일합니다 (변경 사항 없음).</p>';
    }

    var CTX = 2;
    var keep = new Array(n);
    for (i = 0; i < n; i++) keep[i] = false;
    for (i = 0; i < n; i++) {
      if (diff[i].type !== 'same') {
        var lo = Math.max(0, i - CTX), hi = Math.min(n - 1, i + CTX);
        for (var j = lo; j <= hi; j++) keep[j] = true;
      }
    }

    // 줄번호 사전 계산
    var oldNo = 0, newNo = 0;
    var lineNo = new Array(n);
    for (i = 0; i < n; i++) {
      var t = diff[i].type;
      if (t === 'same') { oldNo++; newNo++; lineNo[i] = newNo; }
      else if (t === 'del') { oldNo++; lineNo[i] = oldNo; }
      else { newNo++; lineNo[i] = newNo; }
    }

    var cls = { same: 'diff-same', add: 'diff-add', del: 'diff-del' };
    var parts = ['<div class="diff-view">'];
    i = 0;
    while (i < n) {
      if (keep[i]) {
        var d = diff[i];
        parts.push(
          '<div class="diff-line ' + cls[d.type] + '">' +
            '<span class="diff-ln">' + lineNo[i] + '</span>' +
            '<span class="diff-txt">' + esc(d.line) + '</span>' +
          '</div>'
        );
        i++;
      } else {
        var c = 0;
        while (i < n && !keep[i]) { c++; i++; }
        parts.push('<div class="diff-skip">··· ' + c + '줄 생략</div>');
      }
    }
    parts.push('</div>');
    return parts.join('');
  }

  // ── 비교 모달(공유 #modalRoot 직접 제어) ──
  //   기본 = 화면(UI) 비교: 두 내용을 실제 렌더한 iframe 을 나란히 보여준다.
  //   토글 = 코드 비교: 기존 LCS 라인 디프.
  var cmpOnKey = null;
  var cmpOnBackdrop = null;

  function showCompare(oldHtml, newHtml, opts) {
    opts = opts || {};
    var header = opts.header || '비교';
    var oldLabel = opts.oldLabel || '현재';
    var newLabel = opts.newLabel || '변경본';

    var root = document.querySelector('#modalRoot');
    var body = document.querySelector('#modalBody');
    var ok = document.querySelector('#modalOk');
    var cancel = document.querySelector('#modalCancel');
    var card = root ? root.querySelector('.modal-card') : null;
    if (!root || !body || !ok) return;

    if (card) card.classList.add('modal-wide');
    if (cancel) cancel.hidden = true;      // 닫기 버튼만 노출
    ok.textContent = '닫기';

    var toggleHtml = opts.note ? '' :
      '<div class="cmp-modes" role="tablist">' +
        '<button type="button" class="cmp-mode is-active" data-mode="visual">화면 비교</button>' +
        '<button type="button" class="cmp-mode" data-mode="code">코드 비교</button>' +
      '</div>';
    body.innerHTML =
      '<div class="cmp-head"><span class="diff-modal-head mono">' + esc(header) + '</span>' + toggleHtml + '</div>' +
      '<div class="cmp-body" id="cmpBody"></div>';
    root.hidden = false;

    var cmpBody = body.querySelector('#cmpBody');
    var codeCache = null;

    function renderVisual() {
      cmpBody.innerHTML =
        '<div class="cmp-visual">' +
          '<div class="cmp-pane"><div class="cmp-pane-label">' + esc(oldLabel) + '</div>' +
            '<iframe class="cmp-frame" sandbox="allow-scripts" title="' + esc(oldLabel) + '"></iframe></div>' +
          '<div class="cmp-pane"><div class="cmp-pane-label cmp-pane-label--new">' + esc(newLabel) + '</div>' +
            '<iframe class="cmp-frame" sandbox="allow-scripts" title="' + esc(newLabel) + '"></iframe></div>' +
        '</div>';
      var frames = cmpBody.querySelectorAll('.cmp-frame');
      renderFrame(frames[0], oldHtml);
      renderFrame(frames[1], newHtml);
    }

    async function renderFrame(frame, html) {
      if (!frame) return;
      var out = html == null ? '' : html;
      if (Admin.editor && typeof Admin.editor.buildStandaloneHtml === 'function') {
        try { out = await Admin.editor.buildStandaloneHtml(html); } catch (e) { out = html == null ? '' : html; }
      }
      frame.srcdoc = out;
    }

    function renderCode() {
      if (codeCache == null) {
        codeCache = buildDiffView(diffLines(oldHtml == null ? '' : oldHtml, newHtml == null ? '' : newHtml));
      }
      cmpBody.innerHTML = codeCache;
    }

    if (opts.note) {
      cmpBody.innerHTML = '<p class="insp-note">' + esc(opts.note) + '</p>';
    } else {
      var modes = body.querySelector('.cmp-modes');
      if (modes) modes.addEventListener('click', function (e) {
        var b = e.target && e.target.closest ? e.target.closest('.cmp-mode') : null;
        if (!b) return;
        var list = body.querySelectorAll('.cmp-mode');
        for (var i = 0; i < list.length; i++) list[i].classList.toggle('is-active', list[i] === b);
        if (b.getAttribute('data-mode') === 'code') renderCode(); else renderVisual();
      });
      renderVisual();
    }

    ok.addEventListener('click', closeCompare);
    cmpOnKey = function (e) { if (e.key === 'Escape') closeCompare(); };
    document.addEventListener('keydown', cmpOnKey);
    cmpOnBackdrop = function (e) { if (e.target === root) closeCompare(); };
    root.addEventListener('mousedown', cmpOnBackdrop);
  }

  function closeCompare() {
    var root = document.querySelector('#modalRoot');
    var body = document.querySelector('#modalBody');
    var ok = document.querySelector('#modalOk');
    var cancel = document.querySelector('#modalCancel');
    var card = root ? root.querySelector('.modal-card') : null;
    if (ok) ok.removeEventListener('click', closeCompare);
    if (cmpOnKey) { document.removeEventListener('keydown', cmpOnKey); cmpOnKey = null; }
    if (root && cmpOnBackdrop) { root.removeEventListener('mousedown', cmpOnBackdrop); cmpOnBackdrop = null; }
    if (card) card.classList.remove('modal-wide');
    if (root) root.hidden = true;
    if (body) body.innerHTML = '';
    // core 의 confirm/prompt 를 위해 원상 복구
    if (cancel) cancel.hidden = false;
    if (ok) ok.textContent = '확인';
  }

  // ── 위임 클릭 처리 ──────────────────────────────────────────
  async function onListClick(e) {
    var btn = e.target && e.target.closest ? e.target.closest('.ver-btn') : null;
    if (!btn) return;
    var act = btn.getAttribute('data-act');
    var id = btn.getAttribute('data-id');
    if (!id) return;
    var rec = await get(id);
    if (!rec) { if (Admin.toast) Admin.toast('버전을 찾을 수 없습니다.', 'err'); return; }
    if (act === 'preview') onPreview(rec);
    else if (act === 'diff') onDiff(rec);
    else if (act === 'restore') onRestore(rec);
  }

  // ── 배선 ────────────────────────────────────────────────────
  function versionsPanelVisible() {
    var p = document.querySelector('#panelVersions');
    return p && p.hidden === false;
  }

  function refreshIfVisible() {
    if (versionsPanelVisible()) renderList();
  }

  function wire() {
    var listEl = document.querySelector('#versionList');
    if (listEl) listEl.addEventListener('click', onListClick);

    var filterEl = document.querySelector('#versionFilter');
    if (filterEl) filterEl.addEventListener('change', function () { renderList(); });

    // 버전 탭 활성화 시 렌더(app.js 가 호출하지 않아도 동작하도록 방어)
    var verTab = document.querySelector('.side-tab[data-tab="versions"]');
    if (verTab) verTab.addEventListener('click', function () { setTimeout(refreshIfVisible, 0); });

    if (bus) {
      bus.on('file:saved', refreshIfVisible);
      bus.on('page:loaded', refreshIfVisible);
    }
  }

  Admin.versions = {
    snapshot: snapshot,
    list: list,
    get: get,
    renderList: renderList,
    diffLines: diffLines,
    showDiff: showDiff,
    showCompare: showCompare
  };

  wire();
})();
