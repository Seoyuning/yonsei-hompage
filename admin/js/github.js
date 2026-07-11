/* github.js — GitHub 게시(Contents API) + 게시 기록. window.Admin.github 에 부착.
   「게시」= 현재 편집본을 저장소에 커밋 → 자동배포로 라이브 사이트 반영.
   토큰·저장소 설정은 IndexedDB(settings)에 브라우저별 저장. 토큰은 감사/버전/로그에
   절대 남기지 않는다. classic script(ES 모듈 금지). */
(function () {
  'use strict';

  var Admin = window.Admin = window.Admin || {};

  var API = 'https://api.github.com';
  var cfg = { token: '', owner: '', repo: '', branch: 'main', basePath: '' };
  var meLogin = '';           // 인증된 GitHub 사용자(게시자 표시용)
  var connected = false;
  var els = null;
  var wired = false;
  var busy = false;

  function byId(id) { return document.getElementById(id); }
  function esc(s) { return Admin.util.escapeHtml(String(s == null ? '' : s)); }

  function cacheEls() {
    els = {
      panel: byId('panelPublish'),
      setup: byId('ghSetup'),
      connected: byId('ghConnected'),
      token: byId('ghToken'), owner: byId('ghOwner'), repo: byId('ghRepo'),
      branch: byId('ghBranch'), basePath: byId('ghBasePath'),
      setupErr: byId('ghSetupErr'), btnConnect: byId('btnGhConnect'),
      status: byId('ghStatus'), btnPublish: byId('btnPublishCurrent'),
      history: byId('ghHistory'), btnChange: byId('btnGhChange')
    };
    return !!(els.panel && els.setup && els.connected);
  }

  /* ── base64 (UTF-8 안전) ── */
  function toB64(str) {
    var bytes = new TextEncoder().encode(String(str));
    var bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }

  /* ── REST 호출 (토큰은 헤더로만; URL·로그에 절대 노출 안 함) ── */
  function ghFetch(path, opts) {
    opts = opts || {};
    var headers = opts.headers || {};
    headers['Authorization'] = 'Bearer ' + cfg.token;
    headers['Accept'] = 'application/vnd.github+json';
    headers['X-GitHub-Api-Version'] = '2022-11-28';
    return fetch(API + path, { method: opts.method || 'GET', headers: headers, body: opts.body });
  }

  function statusMsg(status, ctx) {
    if (status === 401) return 'GitHub 토큰이 유효하지 않습니다. 토큰을 다시 확인하세요. (401)';
    if (status === 403) return '권한이 없거나 사용량 한도입니다. 토큰 권한(Contents: read/write)을 확인하세요. (403)';
    if (status === 404) return '저장소나 경로를 찾을 수 없습니다. 소유자/저장소/브랜치/경로를 확인하세요. (404)';
    if (status === 409) return '충돌: 다른 사람이 먼저 게시했습니다. 최신본을 확인한 뒤 다시 시도하세요. (409)';
    if (status === 422) return '요청 값이 올바르지 않습니다. (422)';
    return (ctx ? ctx + ' ' : '') + '요청 실패 (HTTP ' + status + ')';
  }

  async function safeJson(res) { try { return await res.json(); } catch (e) { return null; } }

  function repoPath(sitePath) {
    var base = cfg.basePath ? cfg.basePath.replace(/^\/+|\/+$/g, '') + '/' : '';
    return base + String(sitePath == null ? '' : sitePath).replace(/^\/+/, '');
  }
  // 경로의 각 세그먼트만 인코딩(슬래시는 유지)
  function encPath(p) { return String(p).split('/').map(encodeURIComponent).join('/'); }

  /* ── 설정 저장/로드 ── */
  async function saveCfg() {
    try {
      await Admin.store.setSetting('gh-token', cfg.token);
      await Admin.store.setSetting('gh-owner', cfg.owner);
      await Admin.store.setSetting('gh-repo', cfg.repo);
      await Admin.store.setSetting('gh-branch', cfg.branch);
      await Admin.store.setSetting('gh-basepath', cfg.basePath);
    } catch (e) { /* 저장 실패는 게시를 막지 않음 */ }
  }
  async function loadCfg() {
    try {
      cfg.token = (await Admin.store.getSetting('gh-token')) || '';
      cfg.owner = (await Admin.store.getSetting('gh-owner')) || '';
      cfg.repo = (await Admin.store.getSetting('gh-repo')) || '';
      cfg.branch = (await Admin.store.getSetting('gh-branch')) || 'main';
      cfg.basePath = (await Admin.store.getSetting('gh-basepath')) || '';
    } catch (e) {}
  }

  /* ── 연결(검증) ── */
  async function connect(next) {
    // next: {token, owner, repo, branch, basePath}
    var probe = { token: next.token, owner: next.owner, repo: next.repo, branch: next.branch || 'main', basePath: next.basePath || '' };
    var saved = cfg; cfg = probe;                 // 검증 동안 임시 적용
    try {
      var rres = await ghFetch('/repos/' + probe.owner + '/' + probe.repo);
      if (!rres.ok) throw new Error(statusMsg(rres.status, '저장소'));
      var repo = await rres.json();
      if (!repo.permissions || !(repo.permissions.push || repo.permissions.admin)) {
        throw new Error('이 토큰으로는 쓰기(push) 권한이 없습니다. 토큰 권한을 확인하세요.');
      }
      var ures = await ghFetch('/user');
      meLogin = ures.ok ? ((await ures.json()).login || '') : '';
      connected = true;
      await saveCfg();
      return true;
    } catch (e) {
      cfg = saved; connected = !!(saved.token && saved.owner && saved.repo && connected);
      throw e;
    }
  }

  function disconnect() {
    cfg = { token: '', owner: '', repo: '', branch: 'main', basePath: '' };
    meLogin = '';
    connected = false;
    saveCfg();
  }

  /* ── 게시(커밋) ── */
  async function getSha(sitePath) {
    var url = '/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' + encPath(repoPath(sitePath)) +
      '?ref=' + encodeURIComponent(cfg.branch);
    var res = await ghFetch(url);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(statusMsg(res.status, 'sha 조회'));
    var d = await res.json();
    return d && d.sha ? d.sha : null;
  }

  async function publish(sitePath, content, message) {
    if (!connected) throw new Error('GitHub에 먼저 연결하세요.');
    var sha = await getSha(sitePath);
    var body = { message: message, content: toB64(content), branch: cfg.branch };
    if (sha) body.sha = sha;
    var url = '/repos/' + cfg.owner + '/' + cfg.repo + '/contents/' + encPath(repoPath(sitePath));
    var res = await ghFetch(url, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    if (!res.ok) {
      var e = await safeJson(res);
      throw new Error(statusMsg(res.status, '게시') + (e && e.message && res.status >= 500 ? ' — ' + e.message : ''));
    }
    var out = await res.json();
    return out.commit || {};        // {sha, html_url, author, ...}
  }

  async function listCommits(sitePath, limit) {
    var url = '/repos/' + cfg.owner + '/' + cfg.repo + '/commits' +
      '?sha=' + encodeURIComponent(cfg.branch) +
      '&path=' + encodeURIComponent(repoPath(sitePath)) +
      '&per_page=' + (limit || 20);
    var res = await ghFetch(url);
    if (!res.ok) throw new Error(statusMsg(res.status, '기록'));
    return await res.json();
  }

  /* ── UI ── */
  function showSetup() {
    if (els.setupErr) els.setupErr.textContent = '';
    if (els.token) els.token.value = '';           // 토큰은 DOM에 남기지 않음
    if (els.owner) els.owner.value = cfg.owner || '';
    if (els.repo) els.repo.value = cfg.repo || '';
    if (els.branch) els.branch.value = cfg.branch || 'main';
    if (els.basePath) els.basePath.value = cfg.basePath || '';
    if (els.setup) els.setup.hidden = false;
    if (els.connected) els.connected.hidden = true;
  }
  function showConnected() {
    if (els.setup) els.setup.hidden = true;
    if (els.connected) els.connected.hidden = false;
    if (els.status) {
      els.status.textContent = cfg.owner + '/' + cfg.repo + ' · ' + cfg.branch +
        (cfg.basePath ? ' · ' + cfg.basePath + '/' : '') + (meLogin ? ' · 게시자 ' + meLogin : '');
    }
    renderHistory();
  }

  async function renderHistory() {
    if (!els.history) return;
    var path = currentSitePath();
    if (!path) { els.history.innerHTML = '<p class="empty-note">편집 중인 페이지가 없습니다.</p>'; return; }
    els.history.innerHTML = '<p class="empty-note">불러오는 중…</p>';
    try {
      var commits = await listCommits(path, 20);
      if (!commits.length) { els.history.innerHTML = '<p class="empty-note">이 파일의 게시 기록이 없습니다.</p>'; return; }
      els.history.innerHTML = commits.map(function (c) {
        var who = (c.author && c.author.login) || (c.commit && c.commit.author && c.commit.author.name) || '알 수 없음';
        var when = (c.commit && c.commit.author && c.commit.author.date) ? Admin.util.fmtTime(c.commit.author.date) : '';
        var msg = (c.commit && c.commit.message ? c.commit.message : '').split('\n')[0];
        var short = c.sha ? c.sha.slice(0, 7) : '';
        return '<div class="gh-row">' +
          '<div class="gh-meta"><span class="gh-when mono">' + esc(when) + '</span>' +
          '<span class="gh-who">' + esc(who) + '</span>' +
          '<span class="gh-sha mono">' + esc(short) + '</span></div>' +
          '<div class="gh-msg">' + esc(msg) + '</div></div>';
      }).join('');
    } catch (e) {
      els.history.innerHTML = '<p class="empty-note">' + esc((e && e.message) || '기록을 불러오지 못했습니다.') + '</p>';
    }
  }

  function currentSitePath() {
    try {
      return (Admin.editor && Admin.editor.currentPath && Admin.editor.currentPath()) || null;
    } catch (e) { return null; }
  }

  function setBusy(on) {
    busy = on;
    if (els.btnPublish) els.btnPublish.disabled = on;
    var top = byId('btnPublish');
    if (top) top.disabled = on;
  }

  /* 게시 파이프라인: 로컬 저장(가능하면) + 커밋 + 버전/감사 기록 */
  async function publishCurrent() {
    if (busy) return;
    if (!connected) { showSetup(); switchToPublishTab(); Admin.toast('먼저 GitHub 게시 연결을 설정하세요.', 'info'); return; }
    var path = currentSitePath();
    if (!path) { Admin.toast('게시할 페이지가 없습니다. 먼저 페이지를 여세요.', 'err'); return; }

    var content;
    try { content = Admin.editor.getCleanHtml(); }
    catch (e) { content = ''; }
    if (!content) { Admin.toast('게시할 내용이 없습니다.', 'info'); return; }

    var user = (Admin.state && Admin.state.user && Admin.state.user.username) || '관리자';
    var ok = await Admin.confirm('현재 「' + path + '」 내용을\n' + cfg.owner + '/' + cfg.repo + ' (' + cfg.branch + ')에 게시할까요?\n게시하면 배포된 사이트에 반영됩니다.');
    if (!ok) return;

    setBusy(true);
    try {
      // 1) 로컬 작업본도 동기화(사이트 폴더가 열려 있으면)
      if (Admin.fs && Admin.fs.isReady && Admin.fs.isReady()) {
        try { await Admin.fs.writeFile(path, content); if (Admin.editor.markSaved) Admin.editor.markSaved(); } catch (e) {}
      }
      // 2) GitHub 커밋
      var message = 'YSME Admin: ' + path + ' 게시 (' + user + ')';
      var commit = await publish(path, content, message);
      var short = commit && commit.sha ? commit.sha.slice(0, 7) : '';
      // 3) 로컬 버전/감사 기록
      try { if (Admin.versions) await Admin.versions.snapshot(path, content, { origin: 'publish', note: 'GitHub 게시' + (short ? ' · ' + short : '') }); } catch (e) {}
      try { if (Admin.audit) await Admin.audit.log('publish', path, 'GitHub 게시' + (short ? ' · ' + short : '') + ' → ' + cfg.owner + '/' + cfg.repo); } catch (e) {}
      if (Admin.bus) Admin.bus.emit('file:saved', { path: path });
      renderHistory();
      Admin.toast('게시되었습니다 — ' + path + (short ? ' (' + short + ')' : '') + '. 배포 반영에 1~2분 걸릴 수 있습니다.', 'ok');
    } catch (e) {
      Admin.toast('게시 실패: ' + ((e && e.message) || e), 'err');
    } finally {
      setBusy(false);
    }
  }

  function switchToPublishTab() {
    var tab = document.querySelector('.side-tab[data-tab="publish"]');
    if (tab) tab.click();
  }

  function wire() {
    if (wired) return;
    wired = true;

    if (els.btnConnect) els.btnConnect.addEventListener('click', async function () {
      if (els.setupErr) els.setupErr.textContent = '';
      var next = {
        token: (els.token.value || '').trim(),
        owner: (els.owner.value || '').trim(),
        repo: (els.repo.value || '').trim(),
        branch: (els.branch.value || 'main').trim() || 'main',
        basePath: (els.basePath.value || '').trim()
      };
      if (!next.token || !next.owner || !next.repo) {
        if (els.setupErr) els.setupErr.textContent = '토큰·소유자·저장소는 필수입니다.';
        return;
      }
      els.btnConnect.disabled = true;
      try {
        await connect(next);
        if (els.token) els.token.value = '';       // 저장 후 DOM에서 즉시 제거
        showConnected();
        Admin.toast('GitHub 게시 연결이 저장되었습니다.', 'ok');
      } catch (e) {
        if (els.setupErr) els.setupErr.textContent = (e && e.message) || '연결에 실패했습니다.';
      } finally {
        els.btnConnect.disabled = false;
      }
    });

    if (els.btnPublish) els.btnPublish.addEventListener('click', publishCurrent);
    if (els.btnChange) els.btnChange.addEventListener('click', showSetup);

    var top = byId('btnPublish');
    if (top) top.addEventListener('click', publishCurrent);

    // 게시 탭을 열 때 최신 기록 갱신
    var pubTab = document.querySelector('.side-tab[data-tab="publish"]');
    if (pubTab) pubTab.addEventListener('click', function () {
      if (connected && els.connected && !els.connected.hidden) setTimeout(renderHistory, 0);
    });

    // 페이지 전환 시 게시 기록 갱신(게시 탭이 열려 있을 때)
    if (Admin.bus) Admin.bus.on('page:loaded', function () {
      if (connected && els.connected && !els.connected.hidden) renderHistory();
    });
  }

  Admin.github = {
    init: async function () {
      if (!cacheEls()) return;
      wire();
      await loadCfg();
      connected = !!(cfg.token && cfg.owner && cfg.repo);
      if (connected) {
        // 저장된 설정으로 사용자 정보만 조용히 조회(실패해도 연결 유지)
        try { var r = await ghFetch('/user'); if (r.ok) meLogin = (await r.json()).login || ''; } catch (e) {}
        showConnected();
      } else {
        showSetup();
      }
    },
    isConnected: function () { return connected; },
    publishCurrent: publishCurrent
  };
})();
