/* github.js — GitHub 게시(배포) + 게시 기록. window.Admin.github 에 부착.
   두 가지 연결 모드:
   · shared(공동 게시): 서버(Vercel 함수)가 토큰을 쥐고, 관리자는 공용 암호 + 본인
     이름만으로 게시. 브라우저엔 토큰이 절대 저장되지 않는다. (교수·관리자 인수인계용)
   · token(직접 토큰): 개인 fine-grained PAT로 GitHub API 직접 호출. (파워유저용)
   설정은 IndexedDB(settings)에 브라우저별 저장. 토큰/암호는 감사/버전/로그에 안 남긴다.
   classic script(ES 모듈 금지). */
(function () {
  'use strict';

  var Admin = window.Admin = window.Admin || {};

  var API = 'https://api.github.com';
  // 공동 게시 함수 기본 주소(배포 도메인). 필요하면 설정에서 변경 가능.
  var DEFAULT_ENDPOINT = 'https://prototype-v3-nine.vercel.app/api/publish';
  var COMMIT_EMAIL = 'ysme-admin@users.noreply.github.com';

  var cfg = {
    mode: 'shared',
    // shared
    endpoint: '', passcode: '', author: '',
    // token
    token: '', owner: '', repo: '', branch: 'main', basePath: ''
  };
  var meLogin = '';
  var connected = false;
  var els = null, wired = false, busy = false;

  function byId(id) { return document.getElementById(id); }
  function esc(s) { return Admin.util.escapeHtml(String(s == null ? '' : s)); }

  function cacheEls() {
    els = {
      panel: byId('panelPublish'),
      setup: byId('ghSetup'), connected: byId('ghConnected'),
      modeBtns: document.querySelectorAll('#ghSetup .gh-mode'),
      sharedFields: byId('ghSharedFields'), tokenFields: byId('ghTokenFields'),
      endpoint: byId('ghEndpoint'), passcode: byId('ghPasscode'), author: byId('ghAuthor'),
      token: byId('ghToken'), owner: byId('ghOwner'), repo: byId('ghRepo'),
      branch: byId('ghBranch'), basePath: byId('ghBasePath'),
      setupErr: byId('ghSetupErr'), btnConnect: byId('btnGhConnect'),
      status: byId('ghStatus'), btnPublish: byId('btnPublishCurrent'),
      history: byId('ghHistory'), btnChange: byId('btnGhChange')
    };
    return !!(els.panel && els.setup && els.connected);
  }

  /* ── base64(UTF-8) ── */
  function toB64(str) {
    var bytes = new TextEncoder().encode(String(str));
    var bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  }

  /* ── 직접 토큰(GitHub API) ── */
  function ghFetch(path, opts) {
    opts = opts || {};
    var headers = Object.assign({
      'Authorization': 'Bearer ' + cfg.token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }, opts.headers || {});
    return fetch(API + path, { method: opts.method || 'GET', headers: headers, body: opts.body });
  }
  function statusMsg(status, ctx) {
    if (status === 401) return 'GitHub 토큰이 유효하지 않습니다. (401)';
    if (status === 403) return '권한이 없거나 사용량 한도입니다. 토큰 권한(Contents: read/write)을 확인하세요. (403)';
    if (status === 404) return '저장소/경로를 찾을 수 없습니다. 소유자·저장소·브랜치·경로를 확인하세요. (404)';
    if (status === 409) return '충돌: 다른 사람이 먼저 게시했습니다. 최신본 확인 후 다시 시도하세요. (409)';
    return (ctx ? ctx + ' ' : '') + '요청 실패 (HTTP ' + status + ')';
  }
  async function safeJson(res) { try { return await res.json(); } catch (e) { return null; } }
  function repoPath(sitePath) {
    var base = cfg.basePath ? cfg.basePath.replace(/^\/+|\/+$/g, '') + '/' : '';
    return base + String(sitePath == null ? '' : sitePath).replace(/^\/+/, '');
  }
  function encPath(p) { return String(p).split('/').map(encodeURIComponent).join('/'); }

  /* ── 공동 게시(서버 함수) ── */
  async function fnFetch(payload) {
    return fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ passcode: cfg.passcode }, payload))
    });
  }

  /* ── 모드 공용: 커밋 / 기록 (기록은 동일 형태로 정규화) ── */
  async function commitFile(sitePath, content, author) {
    if (cfg.mode === 'shared') {
      var res = await fnFetch({ action: 'publish', path: sitePath, content: content, author: author });
      var d = await res.json().catch(function () { return {}; });
      if (!res.ok) throw new Error((d && d.error) || ('게시 실패 (' + res.status + ')'));
      return (d && d.commit) || {};
    }
    // token 모드
    var sha = await getShaToken(sitePath);
    var body = {
      message: 'YSME Admin: ' + sitePath + ' 게시 (' + author + ')',
      content: toB64(content), branch: cfg.branch,
      author: { name: author, email: COMMIT_EMAIL }, committer: { name: author, email: COMMIT_EMAIL }
    };
    if (sha) body.sha = sha;
    var r = await ghFetch('/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' + encPath(repoPath(sitePath)),
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) { var e = await safeJson(r); throw new Error(statusMsg(r.status, '게시') + (e && e.message && r.status >= 500 ? ' — ' + e.message : '')); }
    var out = await r.json();
    return out.commit || {};
  }

  async function getShaToken(sitePath) {
    var url = '/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' + encPath(repoPath(sitePath)) + '?ref=' + encodeURIComponent(cfg.branch);
    var res = await ghFetch(url);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(statusMsg(res.status, 'sha 조회'));
    var d = await res.json();
    return d && d.sha ? d.sha : null;
  }

  async function fetchHistory(sitePath) {
    if (cfg.mode === 'shared') {
      var res = await fnFetch({ action: 'history', path: sitePath });
      var d = await res.json().catch(function () { return {}; });
      if (!res.ok) throw new Error((d && d.error) || ('기록 조회 실패 (' + res.status + ')'));
      return (d && d.commits) || [];
    }
    var r = await ghFetch('/repos/' + cfg.owner + '/' + cfg.repo + '/commits?sha=' + encodeURIComponent(cfg.branch) +
      '&path=' + encodeURIComponent(repoPath(sitePath)) + '&per_page=20');
    if (!r.ok) throw new Error(statusMsg(r.status, '기록'));
    var commits = await r.json();
    return (commits || []).map(function (c) {
      return {
        sha: c.sha, message: c.commit && c.commit.message,
        author: (c.commit && c.commit.author && c.commit.author.name) || (c.author && c.author.login) || '',
        date: c.commit && c.commit.author && c.commit.author.date, html_url: c.html_url
      };
    });
  }

  /* ── 설정 저장/로드 ── */
  async function saveCfg() {
    try {
      await Admin.store.setSetting('gh-mode', cfg.mode);
      await Admin.store.setSetting('gh-endpoint', cfg.endpoint);
      await Admin.store.setSetting('gh-passcode', cfg.passcode);
      await Admin.store.setSetting('gh-author', cfg.author);
      await Admin.store.setSetting('gh-token', cfg.token);
      await Admin.store.setSetting('gh-owner', cfg.owner);
      await Admin.store.setSetting('gh-repo', cfg.repo);
      await Admin.store.setSetting('gh-branch', cfg.branch);
      await Admin.store.setSetting('gh-basepath', cfg.basePath);
    } catch (e) {}
  }
  async function loadCfg() {
    try {
      cfg.mode = (await Admin.store.getSetting('gh-mode')) || 'shared';
      cfg.endpoint = (await Admin.store.getSetting('gh-endpoint')) || '';
      cfg.passcode = (await Admin.store.getSetting('gh-passcode')) || '';
      cfg.author = (await Admin.store.getSetting('gh-author')) || '';
      cfg.token = (await Admin.store.getSetting('gh-token')) || '';
      cfg.owner = (await Admin.store.getSetting('gh-owner')) || '';
      cfg.repo = (await Admin.store.getSetting('gh-repo')) || '';
      cfg.branch = (await Admin.store.getSetting('gh-branch')) || 'main';
      cfg.basePath = (await Admin.store.getSetting('gh-basepath')) || '';
    } catch (e) {}
  }

  /* ── 연결(검증) ── */
  async function connect(next) {
    var saved = cfg;
    cfg = next;
    try {
      if (next.mode === 'shared') {
        var res = await fnFetch({ action: 'history', path: 'index.html' });
        if (res.status === 401) throw new Error('공용 암호가 올바르지 않습니다.');
        if (res.status === 500) { var d = await safeJson(res); throw new Error((d && d.error) || '게시 서버 설정이 완료되지 않았습니다.'); }
        if (!res.ok) throw new Error('게시 서버에 연결할 수 없습니다 (' + res.status + '). 주소를 확인하세요.');
        meLogin = '';
      } else {
        var rres = await ghFetch('/repos/' + next.owner + '/' + next.repo);
        if (!rres.ok) throw new Error(statusMsg(rres.status, '저장소'));
        var repo = await rres.json();
        if (!repo.permissions || !(repo.permissions.push || repo.permissions.admin)) throw new Error('이 토큰으로는 쓰기(push) 권한이 없습니다.');
        var ures = await ghFetch('/user');
        meLogin = ures.ok ? ((await ures.json()).login || '') : '';
      }
      connected = true;
      await saveCfg();
      return true;
    } catch (e) {
      cfg = saved;
      throw e;
    }
  }

  function disconnect() {
    cfg = { mode: 'shared', endpoint: '', passcode: '', author: '', token: '', owner: '', repo: '', branch: 'main', basePath: '' };
    meLogin = ''; connected = false; saveCfg();
  }

  /* ── UI ── */
  function applyModeUI(mode) {
    if (els.modeBtns) els.modeBtns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-mode') === mode); });
    if (els.sharedFields) els.sharedFields.hidden = mode !== 'shared';
    if (els.tokenFields) els.tokenFields.hidden = mode !== 'token';
  }
  function showSetup() {
    if (els.setupErr) els.setupErr.textContent = '';
    // 공동 게시
    if (els.endpoint) els.endpoint.value = cfg.endpoint || DEFAULT_ENDPOINT;
    if (els.passcode) els.passcode.value = '';           // 암호는 DOM에 남기지 않음
    if (els.author) els.author.value = cfg.author || '';
    // 직접 토큰
    if (els.token) els.token.value = '';
    if (els.owner) els.owner.value = cfg.owner || '';
    if (els.repo) els.repo.value = cfg.repo || '';
    if (els.branch) els.branch.value = cfg.branch || 'main';
    if (els.basePath) els.basePath.value = cfg.basePath || '';
    applyModeUI(cfg.mode || 'shared');
    if (els.setup) els.setup.hidden = false;
    if (els.connected) els.connected.hidden = true;
  }
  function showConnected() {
    if (els.setup) els.setup.hidden = true;
    if (els.connected) els.connected.hidden = false;
    if (els.status) {
      var line;
      if (cfg.mode === 'shared') {
        var host = '';
        try { host = new URL(cfg.endpoint).host; } catch (e) { host = cfg.endpoint; }
        line = '공동 게시 · ' + host + (cfg.author ? ' · 게시자 ' + cfg.author : '');
      } else {
        line = cfg.owner + '/' + cfg.repo + ' · ' + cfg.branch + (cfg.basePath ? ' · ' + cfg.basePath + '/' : '') + (meLogin ? ' · ' + meLogin : '');
      }
      els.status.textContent = line;
    }
    renderHistory();
  }

  function currentSitePath() {
    try { return (Admin.editor && Admin.editor.currentPath && Admin.editor.currentPath()) || null; } catch (e) { return null; }
  }

  async function renderHistory() {
    if (!els.history) return;
    var path = currentSitePath();
    if (!path) { els.history.innerHTML = '<p class="empty-note">편집 중인 페이지가 없습니다.</p>'; return; }
    els.history.innerHTML = '<p class="empty-note">불러오는 중…</p>';
    try {
      var commits = await fetchHistory(path);
      if (!commits.length) { els.history.innerHTML = '<p class="empty-note">이 파일의 게시 기록이 없습니다.</p>'; return; }
      els.history.innerHTML = commits.map(function (c) {
        var who = c.author || '알 수 없음';
        var when = c.date ? Admin.util.fmtTime(c.date) : '';
        var msg = (c.message || '').split('\n')[0];
        var short = c.sha ? c.sha.slice(0, 7) : '';
        return '<div class="gh-row"><div class="gh-meta">' +
          '<span class="gh-when mono">' + esc(when) + '</span>' +
          '<span class="gh-who">' + esc(who) + '</span>' +
          '<span class="gh-sha mono">' + esc(short) + '</span></div>' +
          '<div class="gh-msg">' + esc(msg) + '</div></div>';
      }).join('');
    } catch (e) {
      els.history.innerHTML = '<p class="empty-note">' + esc((e && e.message) || '기록을 불러오지 못했습니다.') + '</p>';
    }
  }

  function setBusy(on) {
    busy = on;
    if (els.btnPublish) els.btnPublish.disabled = on;
    var top = byId('btnPublish');
    if (top) top.disabled = on;
  }

  function switchToPublishTab() {
    var tab = document.querySelector('.side-tab[data-tab="publish"]');
    if (tab) tab.click();
  }

  async function publishCurrent() {
    if (busy) return;
    if (!connected) { showSetup(); switchToPublishTab(); Admin.toast('먼저 게시 연결을 설정하세요.', 'info'); return; }
    var path = currentSitePath();
    if (!path) { Admin.toast('게시할 페이지가 없습니다. 먼저 페이지를 여세요.', 'err'); return; }

    var author;
    if (cfg.mode === 'shared') {
      author = (cfg.author || '').trim();
      if (!author) { Admin.toast('게시자 이름을 설정하세요.', 'err'); showSetup(); switchToPublishTab(); return; }
    } else {
      author = (Admin.state && Admin.state.user && Admin.state.user.username) || '관리자';
    }

    var content;
    try { content = Admin.editor.getCleanHtml(); } catch (e) { content = ''; }
    if (!content) { Admin.toast('게시할 내용이 없습니다.', 'info'); return; }

    var ok = await Admin.confirm('현재 「' + path + '」 내용을 게시할까요?\n게시자: ' + author + '\n게시하면 배포된 사이트에 반영됩니다.');
    if (!ok) return;

    setBusy(true);
    try {
      if (Admin.fs && Admin.fs.isReady && Admin.fs.isReady()) {
        try { await Admin.fs.writeFile(path, content); if (Admin.editor.markSaved) Admin.editor.markSaved(); } catch (e) {}
      }
      var commit = await commitFile(path, content, author);
      var short = commit && commit.sha ? commit.sha.slice(0, 7) : '';
      try { if (Admin.versions) await Admin.versions.snapshot(path, content, { origin: 'publish', note: '게시 · ' + author + (short ? ' · ' + short : '') }); } catch (e) {}
      try { if (Admin.audit) await Admin.audit.log('publish', path, '게시 · ' + author + (short ? ' · ' + short : '')); } catch (e) {}
      if (Admin.bus) Admin.bus.emit('file:saved', { path: path });
      renderHistory();
      Admin.toast('게시되었습니다 — ' + path + (short ? ' (' + short + ')' : '') + '. 반영에 1~2분 걸릴 수 있습니다.', 'ok');
    } catch (e) {
      Admin.toast('게시 실패: ' + ((e && e.message) || e), 'err');
    } finally {
      setBusy(false);
    }
  }

  function wire() {
    if (wired) return;
    wired = true;

    // 모드 토글
    if (els.modeBtns) els.modeBtns.forEach(function (b) {
      b.addEventListener('click', function () { applyModeUI(b.getAttribute('data-mode')); if (els.setupErr) els.setupErr.textContent = ''; });
    });

    if (els.btnConnect) els.btnConnect.addEventListener('click', async function () {
      if (els.setupErr) els.setupErr.textContent = '';
      var mode = 'shared';
      if (els.modeBtns) els.modeBtns.forEach(function (b) { if (b.classList.contains('is-active')) mode = b.getAttribute('data-mode'); });
      var next;
      if (mode === 'shared') {
        next = {
          mode: 'shared',
          endpoint: (els.endpoint.value || '').trim(),
          passcode: (els.passcode.value || '').trim(),
          author: (els.author.value || '').trim(),
          token: '', owner: '', repo: '', branch: 'main', basePath: ''
        };
        if (!next.endpoint || !next.passcode || !next.author) { els.setupErr.textContent = '게시 서버 주소·공용 암호·이름은 필수입니다.'; return; }
      } else {
        next = {
          mode: 'token',
          token: (els.token.value || '').trim(), owner: (els.owner.value || '').trim(), repo: (els.repo.value || '').trim(),
          branch: (els.branch.value || 'main').trim() || 'main', basePath: (els.basePath.value || '').trim(),
          endpoint: '', passcode: '', author: ''
        };
        if (!next.token || !next.owner || !next.repo) { els.setupErr.textContent = '토큰·소유자·저장소는 필수입니다.'; return; }
      }
      els.btnConnect.disabled = true;
      try {
        await connect(next);
        if (els.passcode) els.passcode.value = '';
        if (els.token) els.token.value = '';
        showConnected();
        Admin.toast('게시 연결이 저장되었습니다.', 'ok');
      } catch (e) {
        els.setupErr.textContent = (e && e.message) || '연결에 실패했습니다.';
      } finally {
        els.btnConnect.disabled = false;
      }
    });

    if (els.btnPublish) els.btnPublish.addEventListener('click', publishCurrent);
    if (els.btnChange) els.btnChange.addEventListener('click', showSetup);
    var top = byId('btnPublish');
    if (top) top.addEventListener('click', publishCurrent);

    var pubTab = document.querySelector('.side-tab[data-tab="publish"]');
    if (pubTab) pubTab.addEventListener('click', function () {
      if (connected && els.connected && !els.connected.hidden) setTimeout(renderHistory, 0);
    });
    if (Admin.bus) Admin.bus.on('page:loaded', function () {
      if (connected && els.connected && !els.connected.hidden) renderHistory();
    });
  }

  Admin.github = {
    init: async function () {
      if (!cacheEls()) return;
      wire();
      await loadCfg();
      if (cfg.mode === 'shared') connected = !!(cfg.endpoint && cfg.passcode && cfg.author);
      else connected = !!(cfg.token && cfg.owner && cfg.repo);
      if (connected) {
        if (cfg.mode === 'token') { try { var r = await ghFetch('/user'); if (r.ok) meLogin = (await r.json()).login || ''; } catch (e) {} }
        showConnected();
      } else {
        showSetup();
      }
    },
    isConnected: function () { return connected; },
    publishCurrent: publishCurrent
  };
})();
