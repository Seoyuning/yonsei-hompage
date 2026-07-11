/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — core.js
   전역 네임스페이스 · 이벤트 버스 · 유틸 · 토스트 · 모달
   classic script. window.Admin 이 모든 모듈의 부착점.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin = window.Admin || {};

/* ── 앱 상태 (모듈 간 공유 최소 상태) ── */
Admin.state = {
  user: null,          // {username, role}
  sitePath: null,      // 열린 사이트 폴더 이름
  currentPath: null,   // 편집 중 파일 경로 ('index.html' 등)
  mode: 'edit',        // 'edit' | 'preview' | 'code'
  dirty: false
};

/* ── 이벤트 버스 ── */
var listeners = Object.create(null);
Admin.bus = {
  on: function (evt, fn) {
    (listeners[evt] = listeners[evt] || []).push(fn);
  },
  off: function (evt, fn) {
    var a = listeners[evt];
    if (!a) return;
    var i = a.indexOf(fn);
    if (i >= 0) a.splice(i, 1);
  },
  emit: function (evt, data) {
    var a = listeners[evt];
    if (!a) return;
    // 리스너 안에서 on/off 해도 안전하도록 복사본 순회
    a.slice().forEach(function (fn) {
      try { fn(data); }
      catch (e) { console.error('[bus:' + evt + ']', e); }
    });
  }
};

/* ── 유틸 ── */
var uidSeq = 0;
Admin.util = {
  escapeHtml: function (s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },
  uid: function (prefix) {
    uidSeq += 1;
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' +
      uidSeq.toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  },
  fmtDate: function (ts) {
    var d = (ts instanceof Date) ? ts : new Date(ts);
    if (isNaN(d)) return '';
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate());
  },
  fmtTime: function (ts) {
    var d = (ts instanceof Date) ? ts : new Date(ts);
    if (isNaN(d)) return '';
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate()) +
      ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  },
  debounce: function (fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  },
  basename: function (path) {
    var s = String(path || '');
    var i = s.lastIndexOf('/');
    return i >= 0 ? s.slice(i + 1) : s;
  }
};

/* ── 토스트 ── */
Admin.toast = function (msg, kind) {
  var root = document.getElementById('toastRoot');
  if (!root) return;
  var el = document.createElement('div');
  el.className = 'toast toast--' + (kind || 'info');
  el.textContent = msg;
  root.appendChild(el);
  // 강제 리플로우 후 표시 클래스 → 트랜지션
  void el.offsetWidth;
  el.classList.add('is-in');
  setTimeout(function () {
    el.classList.remove('is-in');
    setTimeout(function () { el.remove(); }, 400);
  }, kind === 'err' ? 5200 : 3200);
};

/* ── 모달 (confirm / prompt / 커스텀) ──
   #modalRoot 를 공유. 동시에 하나만 연다(큐 없음 — 도구 UI 특성상 충분). */
var modalBusy = false;

function openModal(bodyHtml, opts) {
  // opts: {okText, cancelText, hideCancel, hideOk, focusSel}
  return new Promise(function (resolve) {
    var root = document.getElementById('modalRoot');
    var body = document.getElementById('modalBody');
    var ok = document.getElementById('modalOk');
    var cancel = document.getElementById('modalCancel');
    if (!root || !body || !ok || !cancel) { resolve(null); return; }
    if (modalBusy) { resolve(null); return; }
    modalBusy = true;
    opts = opts || {};

    var prevFocus = document.activeElement;
    body.innerHTML = bodyHtml;
    ok.textContent = opts.okText || '확인';
    cancel.textContent = opts.cancelText || '취소';
    ok.hidden = !!opts.hideOk;
    cancel.hidden = !!opts.hideCancel;
    root.hidden = false;

    var focusTarget = opts.focusSel ? body.querySelector(opts.focusSel) : null;
    (focusTarget || (opts.hideOk ? cancel : ok)).focus();

    function close(result) {
      root.hidden = true;
      body.innerHTML = '';
      ok.removeEventListener('click', onOk);
      cancel.removeEventListener('click', onCancel);
      document.removeEventListener('keydown', onKey, true);
      root.removeEventListener('mousedown', onBackdrop);
      modalBusy = false;
      if (prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) {} }
      resolve(result);
    }
    function onOk() { close(true); }
    function onCancel() { close(false); }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(false); }
      // 모달 밖으로 탭 이동 방지(간이 포커스 트랩)
      if (e.key === 'Tab') {
        var f = root.querySelectorAll('button:not([hidden]), input, textarea, select, a[href]');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function onBackdrop(e) { if (e.target === root) close(false); }

    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
    document.addEventListener('keydown', onKey, true);
    root.addEventListener('mousedown', onBackdrop);
  });
}

Admin.confirm = function (msg) {
  return openModal(
    '<p class="modal-msg">' + Admin.util.escapeHtml(msg).replace(/\n/g, '<br />') + '</p>',
    {}
  ).then(function (r) { return r === true; });
};

/* prompt 는 확인 시점의 입력값 캡처가 필요해 input 이벤트로 값을 추적한다 */
Admin.prompt = function (msg, defVal) {
  return new Promise(function (resolve) {
    var captured = null;
    var html = '<p class="modal-msg">' + Admin.util.escapeHtml(msg) + '</p>' +
      '<input id="modalPromptInput" class="insp-input" type="text" />';
    var p = openModal(html, { focusSel: '#modalPromptInput' });
    var input = document.getElementById('modalPromptInput');
    if (input) {
      input.value = defVal || '';
      input.select();
      input.addEventListener('input', function () { captured = input.value; });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          captured = input.value;
          var okBtn = document.getElementById('modalOk');
          if (okBtn) okBtn.click();
        }
      });
      captured = input.value;
    }
    p.then(function (r) { resolve(r === true ? (captured || '') : null); });
  });
};

/* 임의 콘텐츠 모달 (버전 디프 등에서 사용) — 확인 버튼만 */
Admin.modalShow = function (bodyHtml, opts) {
  opts = opts || {};
  return openModal(bodyHtml, {
    okText: opts.okText || '닫기',
    hideCancel: opts.hideCancel !== false,
    focusSel: opts.focusSel
  });
};

})();
