/* YSME Admin Studio — auth.js
   계정/로그인. WebCrypto PBKDF2-SHA256 150,000 iter.
   ES 모듈 금지: window.Admin.auth 에 부착. */
(function () {
  'use strict';

  var Admin = (window.Admin = window.Admin || {});

  var SESSION_KEY = 'ysme-admin-session';
  var PBKDF2_ITER = 150000;
  var SALT_BYTES = 16;
  var wired = false;

  /* ── 바이트/헥사 유틸 ── */
  function bytesToHex(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) {
      s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    }
    return s;
  }

  function hexToBytes(hex) {
    var out = new Uint8Array(hex.length / 2);
    for (var i = 0; i < out.length; i++) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
  }

  function randomSaltHex() {
    var b = new Uint8Array(SALT_BYTES);
    crypto.getRandomValues(b);
    return bytesToHex(b);
  }

  // PBKDF2-SHA256 → 256bit 헥사. salt 는 hex 문자열.
  function derive(password, saltHex) {
    var enc = new TextEncoder();
    return crypto.subtle
      .importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
      .then(function (keyMaterial) {
        return crypto.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: hexToBytes(saltHex),
            iterations: PBKDF2_ITER,
            hash: 'SHA-256'
          },
          keyMaterial,
          256
        );
      })
      .then(function (bits) {
        return bytesToHex(new Uint8Array(bits));
      });
  }

  // 길이·값 노출을 줄이기 위한 상수시간 비교(동일 길이 헥사 가정).
  function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    var diff = 0;
    for (var i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
  }

  /* ── 감사 로그(옵셔널: audit.js 는 이 파일보다 늦게 로드됨) ── */
  function auditLog(action, target, detail) {
    if (Admin.audit && typeof Admin.audit.log === 'function') {
      try { Admin.audit.log(action, target, detail); } catch (e) { /* 감사 실패는 인증을 막지 않음 */ }
    }
  }

  /* ── 상태/세션 ── */
  function setUser(user) {
    if (!Admin.state) Admin.state = {};
    Admin.state.user = user;
  }

  function writeSession(user) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        username: user.username,
        role: user.role,
        loginAt: Date.now()
      }));
    } catch (e) { /* 세션 저장 실패는 무시 */ }
  }

  function readSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      return (s && s.username) ? s : null;
    } catch (e) { return null; }
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* 무시 */ }
  }

  /* ── 공개 API ── */
  function hasAccounts() {
    return Admin.store.list('accounts', { limit: 1 }).then(function (rows) {
      return rows.length > 0;
    });
  }

  function current() {
    return (Admin.state && Admin.state.user) ? Admin.state.user : null;
  }

  function createAccount(username, password, role) {
    role = role || 'admin';
    var saltHex = randomSaltHex();
    return derive(password, saltHex).then(function (hash) {
      var rec = {
        username: username,
        salt: saltHex,
        hash: hash,
        role: role,
        createdAt: Date.now()
      };
      return Admin.store.put('accounts', rec);
    }).then(function (rec) {
      auditLog('account-create', username, '계정 생성 (권한: ' + role + ')');
      return rec;
    });
  }

  function login(username, password) {
    return Admin.store.get('accounts', username).then(function (acc) {
      if (!acc) return false;
      return derive(password, acc.salt).then(function (hash) {
        if (!timingSafeEqual(hash, acc.hash)) return false;
        var user = { username: acc.username, role: acc.role };
        writeSession(user);
        setUser(user);
        auditLog('login', acc.username, '로그인 성공');
        Admin.bus.emit('auth:login', user);
        return true;
      });
    });
  }

  function logout() {
    // 감사 user 필드는 Admin.state.user 에서 읽으므로 상태 초기화 전에 기록.
    var name = current() ? current().username : '';
    auditLog('logout', name, '로그아웃');
    clearSession();
    setUser(null);
    Admin.bus.emit('auth:logout');
  }

  /* ── 폼 유틸 ── */
  function $(id) { return document.getElementById(id); }

  function showErr(el, msg) { if (el) el.textContent = msg; }

  function setFormBusy(form, busy) {
    if (!form) return;
    var els = form.querySelectorAll('input, button');
    for (var i = 0; i < els.length; i++) els[i].disabled = busy;
  }

  function toggleForms(hasAcc) {
    var setup = $('setupForm');
    var login = $('loginForm');
    if (setup) setup.hidden = hasAcc;
    if (login) login.hidden = !hasAcc;
    // 첫 입력에 포커스.
    var focusTarget = hasAcc ? $('loginUser') : $('setupUser');
    if (focusTarget) { try { focusTarget.focus(); } catch (e) { /* 무시 */ } }
  }

  function wireForms() {
    if (wired) return;
    wired = true;

    var setupForm = $('setupForm');
    if (setupForm) {
      setupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var errEl = $('setupErr');
        showErr(errEl, '');
        var u = ($('setupUser').value || '').trim();
        var p = $('setupPass').value || '';
        var p2 = $('setupPass2').value || '';
        if (u.length < 3) { showErr(errEl, '아이디는 3자 이상이어야 합니다.'); return; }
        if (p.length < 8) { showErr(errEl, '비밀번호는 8자 이상이어야 합니다.'); return; }
        if (p !== p2) { showErr(errEl, '비밀번호가 일치하지 않습니다.'); return; }
        setFormBusy(setupForm, true);
        createAccount(u, p, 'admin').then(function () {
          return login(u, p);
        }).then(function (ok) {
          if (!ok) showErr(errEl, '계정 생성 후 자동 로그인에 실패했습니다.');
        }).catch(function (ex) {
          showErr(errEl, '계정 생성 중 오류가 발생했습니다. ' + (ex && ex.message ? ex.message : ''));
        }).then(function () {
          setFormBusy(setupForm, false);
        });
      });
    }

    var loginForm = $('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var errEl = $('loginErr');
        showErr(errEl, '');
        var u = ($('loginUser').value || '').trim();
        var p = $('loginPass').value || '';
        if (!u || !p) { showErr(errEl, '아이디와 비밀번호를 입력하세요.'); return; }
        setFormBusy(loginForm, true);
        login(u, p).then(function (ok) {
          if (!ok) showErr(errEl, '아이디 또는 비밀번호가 올바르지 않습니다.');
        }).catch(function () {
          showErr(errEl, '로그인 중 오류가 발생했습니다.');
        }).then(function () {
          setFormBusy(loginForm, false);
          if (current()) return; // 성공 시 화면 전환은 app.js 담당
          var pass = $('loginPass');
          if (pass) pass.value = '';
        });
      });
    }
  }

  // 계정 존재여부 판단 → 폼 토글 + 와이어링, 세션 복원.
  function init() {
    wireForms();
    return hasAccounts().then(function (hasAcc) {
      var sess = readSession();
      if (hasAcc && sess) {
        return Admin.store.get('accounts', sess.username).then(function (acc) {
          if (acc) {
            var user = { username: acc.username, role: acc.role };
            setUser(user);
            Admin.bus.emit('auth:login', user);
            return;
          }
          // 세션이 가리키는 계정이 사라진 경우 세션 폐기.
          clearSession();
          toggleForms(hasAcc);
        });
      }
      toggleForms(hasAcc);
    });
  }

  Admin.auth = {
    init: init,
    current: current,
    login: login,
    logout: logout,
    createAccount: createAccount,
    hasAccounts: hasAccounts
  };
})();
