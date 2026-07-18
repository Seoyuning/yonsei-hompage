/* YSME Admin Studio — audit.js
   감사 기록. 레코드 {id, ts, user, action, target, detail}.
   ES 모듈 금지: window.Admin.audit 에 부착. */
(function () {
  'use strict';

  var Admin = (window.Admin = window.Admin || {});

  // action → 한국어 배지 라벨(미정의 값은 원문 노출).
  var ACTION_LABELS = {
    'login': '로그인',
    'logout': '로그아웃',
    'account-create': '계정 생성',
    'save': '저장',
    'rollback': '롤백',
    'ai-apply': 'AI 적용',
    'export': '내보내기',
    'site-open': '사이트 열기',
    'publish': '게시',
    'asset:upload': '자산 업로드',
    'replace': '찾기/바꾸기',
    'qa': '품질 검사'
  };

  function actionLabel(action) {
    return ACTION_LABELS[action] || action || '기타';
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function stamp() {
    var d = new Date();
    return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
      '-' + pad(d.getHours()) + pad(d.getMinutes());
  }

  function auditPanelActive() {
    var p = document.getElementById('panelAudit');
    return !!p && p.hidden === false;
  }

  function log(action, target, detail) {
    var user = (Admin.state && Admin.state.user && Admin.state.user.username)
      ? Admin.state.user.username
      : '시스템';
    var rec = {
      id: Admin.util.uid('aud'),
      ts: Date.now(),
      user: user,
      action: action || '',
      target: target || '',
      detail: detail || ''
    };
    return Admin.store.put('audit', rec).then(function () {
      // 감사 탭이 열려 있으면 실시간 갱신.
      if (auditPanelActive()) renderList();
      return rec;
    });
  }

  function list(opts) {
    opts = opts || {};
    var limit = (opts.limit === undefined) ? 200 : opts.limit;
    return Admin.store.list('audit', { index: 'byTs', desc: true, limit: limit });
  }

  function renderList() {
    var el = document.getElementById('auditList');
    if (!el) return Promise.resolve();
    return list({ limit: 200 }).then(function (rows) {
      if (!rows.length) {
        el.innerHTML = '<p class="empty-note">감사 기록이 없습니다.</p>';
        return;
      }
      var esc = Admin.util.escapeHtml;
      var html = rows.map(function (r) {
        return '<div class="audit-row">' +
          '<span class="audit-ts mono">' + esc(Admin.util.fmtTime(r.ts)) + '</span>' +
          '<span class="audit-user">' + esc(r.user) + '</span>' +
          '<span class="audit-action badge-' + esc(r.action) + '">' + esc(actionLabel(r.action)) + '</span>' +
          '<span class="audit-target">' + esc(r.target) + '</span>' +
          '<span class="audit-detail">' + esc(r.detail) + '</span>' +
          '</div>';
      }).join('');
      el.innerHTML = html;
    });
  }

  function exportJson() {
    // 내보내기는 전체 레코드(최신순).
    return Admin.store.list('audit', { index: 'byTs', desc: true }).then(function (rows) {
      var payload = {
        tool: 'YSME Admin Studio',
        exportedAt: new Date().toISOString(),
        count: rows.length,
        records: rows
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'ysme-audit-' + stamp() + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      if (Admin.toast) Admin.toast('감사 기록 ' + rows.length + '건을 내보냈습니다.', 'ok');
      return log('export', 'audit', rows.length + '건 내보내기');
    });
  }

  function wire() {
    var btn = document.getElementById('btnExportAudit');
    if (btn && !btn.dataset.wired) {
      btn.dataset.wired = '1';
      btn.addEventListener('click', function () { exportJson(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  Admin.audit = {
    log: log,
    list: list,
    renderList: renderList,
    exportJson: exportJson
  };
})();
