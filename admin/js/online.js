/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — online.js
   온라인 모드 게이트/부트. Admin.remotefs 가 있을 때만(=온라인) 동작한다.
   계정 로그인(auth.js) 대신 공용 암호 폼으로 접속시키고, 성공 시 기존
   auth:login 이벤트를 발생시켜 워크스페이스를 연다. 로컬 모드에서는 no-op.
   classic script (app.js 뒤에 로드). ES 모듈 금지.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin = window.Admin || {};

document.addEventListener('DOMContentLoaded', function () {
  var rfs = Admin.remotefs;
  if (!rfs) return;                 // 로컬 모드 → 아무 것도 안 함

  function $(id) { return document.getElementById(id); }

  var setupForm = $('setupForm'), loginForm = $('loginForm');
  var onlineForm = $('onlineForm'), passInput = $('onlinePass'), nameInput = $('onlineName');
  var errEl = $('onlineErr');
  var btnOpen = $('btnOpenSite'), fsBanner = $('fsUnsupported');

  // 계정 폼 숨김 → 온라인(암호) 폼만. 온라인에선 폴더 열기·FS 미지원 배너 불필요.
  if (setupForm) setupForm.hidden = true;
  if (loginForm) loginForm.hidden = true;
  if (onlineForm) onlineForm.hidden = false;
  if (btnOpen) btnOpen.hidden = true;
  if (fsBanner) fsBanner.hidden = true;
  if (nameInput && rfs.author()) nameInput.value = rfs.author();
  // 로그인 카드 하단 문구를 온라인용으로 교체("LOCAL CONSOLE …" 은 오해 소지)
  var foot = document.querySelector('#loginView .login-foot');
  if (foot) foot.textContent = 'ONLINE · 공용 암호로 사이트를 직접 편집·배포합니다';

  function fail(msg) { if (errEl) errEl.textContent = msg || '접속에 실패했습니다.'; }

  function enterWorkspace() {
    Admin.state = Admin.state || {};
    if (!Admin.state.user) Admin.state.user = { username: rfs.author() || '온라인 편집자', role: 'online' };
    // app.js 의 auth:login 리스너 → showWorkspace(). fs 는 이미 ready 라 재연결 생략됨.
    Admin.bus.emit('auth:login', Admin.state.user);
  }

  if (onlineForm) {
    onlineForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errEl) errEl.textContent = '';
      var pc = passInput ? passInput.value : '';
      var nm = nameInput ? nameInput.value : '';
      var btn = onlineForm.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      rfs.connectWith(pc, nm).then(function () {
        if (passInput) passInput.value = '';        // 암호는 DOM 에 남기지 않음
        enterWorkspace();
        Admin.toast('온라인 편집에 접속했습니다. 저장하면 바로 배포됩니다.', 'ok');
      }).catch(function (ex) {
        fail((ex && ex.message) || '접속에 실패했습니다.');
      }).then(function () {
        if (btn) btn.disabled = false;
      });
    });
  }

  // 로그아웃(app.js 의 btnLogout → Admin.auth.logout → auth:logout) 시 온라인 세션도 해제.
  Admin.bus.on('auth:logout', function () {
    rfs.disconnect();
    if (onlineForm) onlineForm.hidden = false;
    if (passInput) passInput.value = '';
    if (errEl) errEl.textContent = '';
  });

  // 저장된 세션(탭)이 있으면 자동 접속 시도.
  if (rfs.hasSession()) {
    rfs.reconnect().then(function (ok) {
      if (ok) enterWorkspace();
      else fail('세션이 만료되었습니다. 공용 암호를 다시 입력하세요.');
    });
  }
});

})();
