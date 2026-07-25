/* YSME In-Place Studio — 코어
   네임스페이스 · 유틸 · 이벤트 버스 · 로컬 저장(IndexedDB) · 세션 · 토스트.
   순수 ES5 스타일 클래식 스크립트. 전역은 window.YStudio 하나만 쓴다. */
(function () {
  'use strict';
  var Y = window.YStudio = window.YStudio || {};
  if (Y.core) return;

  Y.VERSION = '1.0.0';
  Y.config = {
    api: window.YSME_STUDIO_API || '/api',
    sessionKey: 'ysme-studio',
    db: 'ysme-studio',
    dbVer: 1,
    uiAttr: 'data-ys-ui',
    Z: 2147483000
  };

  /* ── 유틸 ── */
  var util = Y.util = {
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    /* 텍스트 노드용 — 속성값이 아니므로 & < > 만 막는다(원문 diff 최소화) */
    escText: function (s) {
      return String(s == null ? '' : s).replace(/[&<>]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
      });
    },
    escAttr: function (s) {
      return String(s == null ? '' : s).replace(/[&"<>]/g, function (c) {
        return { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[c];
      });
    },
    uid: function (p) { return (p || 'id') + '-' + Math.random().toString(36).slice(2, 9); },
    pad: function (n) { return (n < 10 ? '0' : '') + n; },
    fmtTime: function (ts) {
      var d = new Date(ts);
      return d.getFullYear() + '-' + util.pad(d.getMonth() + 1) + '-' + util.pad(d.getDate()) +
        ' ' + util.pad(d.getHours()) + ':' + util.pad(d.getMinutes());
    },
    ago: function (ts) {
      var s = Math.max(0, Math.round((Date.now() - ts) / 1000));
      if (s < 60) return '방금';
      if (s < 3600) return Math.round(s / 60) + '분 전';
      if (s < 86400) return Math.round(s / 3600) + '시간 전';
      return Math.round(s / 86400) + '일 전';
    },
    debounce: function (fn, ms) {
      var t = null;
      return function () {
        var a = arguments, self = this;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(self, a); }, ms);
      };
    },
    /* 현재 페이지의 사이트 기준 상대경로 (예: 'H-academic.html') */
    pagePath: function (loc) {
      loc = loc || location;
      var p = (loc.pathname || '').replace(/^\/+/, '');
      if (!p || /\/$/.test(p)) p += 'index.html';
      if (p.indexOf('/') >= 0) p = p.split('/').pop();       // 하위 폴더 없음(사이트 A는 평면 구조)
      if (!/\.html?$/i.test(p)) p = 'index.html';
      return p;
    },
    isUi: function (el) {
      return !!(el && el.closest && el.closest('[' + Y.config.uiAttr + ']'));
    }
  };

  /* ── 이벤트 버스 ── */
  var handlers = {};
  Y.bus = {
    on: function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); return fn; },
    off: function (name, fn) {
      var a = handlers[name]; if (!a) return;
      var i = a.indexOf(fn); if (i >= 0) a.splice(i, 1);
    },
    emit: function (name, data) {
      var a = (handlers[name] || []).slice();
      for (var i = 0; i < a.length; i++) {
        try { a[i](data); } catch (e) { if (window.console) console.error('[studio] ' + name, e); }
      }
    }
  };

  /* ── IndexedDB (초안 버퍼 · 설정 · AI 계획) ── */
  var dbp = null;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      var rq = indexedDB.open(Y.config.db, Y.config.dbVer);
      rq.onupgradeneeded = function () {
        var db = rq.result;
        if (!db.objectStoreNames.contains('drafts')) db.createObjectStore('drafts', { keyPath: 'path' });
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('plans')) db.createObjectStore('plans', { keyPath: 'id' });
      };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error); };
    });
    return dbp;
  }
  function tx(store, mode, fn) {
    return open().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(store, mode), s = t.objectStore(store), out;
        try { out = fn(s); } catch (e) { rej(e); return; }
        t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); };
        t.onerror = function () { rej(t.error); };
        t.onabort = function () { rej(t.error); };
      });
    });
  }
  Y.store = {
    put: function (store, rec) { return tx(store, 'readwrite', function (s) { return s.put(rec); }); },
    get: function (store, key) { return tx(store, 'readonly', function (s) { return s.get(key); }); },
    del: function (store, key) { return tx(store, 'readwrite', function (s) { return s.delete(key); }); },
    all: function (store) { return tx(store, 'readonly', function (s) { return s.getAll(); }); },
    clear: function (store) { return tx(store, 'readwrite', function (s) { return s.clear(); }); }
  };

  /* ── 세션 (탭 단위) ── */
  Y.session = {
    get: function () {
      try { return JSON.parse(sessionStorage.getItem(Y.config.sessionKey) || 'null'); }
      catch (e) { return null; }
    },
    set: function (s) {
      try { sessionStorage.setItem(Y.config.sessionKey, JSON.stringify(s)); } catch (e) {}
      Y.bus.emit('session:change', s);
    },
    clear: function () {
      try { sessionStorage.removeItem(Y.config.sessionKey); } catch (e) {}
      Y.bus.emit('session:change', null);
    },
    author: function () { var s = Y.session.get(); return (s && s.author) || '편집자'; },
    passcode: function () { var s = Y.session.get(); return s && s.passcode; }
  };

  /* ── 토스트 (studio.css 로드 전에도 보이도록 인라인 스타일 병용) ── */
  var toastWrap = null;
  Y.toast = function (msg, kind, ms) {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'ys-toasts';
      toastWrap.setAttribute(Y.config.uiAttr, '');
      toastWrap.style.cssText = 'position:fixed;left:50%;bottom:1.4rem;transform:translateX(-50%);z-index:' +
        (Y.config.Z + 20) + ';display:flex;flex-direction:column;gap:.4rem;align-items:center;pointer-events:none';
      document.body.appendChild(toastWrap);
    }
    var t = document.createElement('div');
    t.className = 'ys-toast' + (kind ? ' is-' + kind : '');
    t.textContent = String(msg);
    t.style.cssText = 'font:600 .84rem/1.45 "Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;' +
      'padding:.55rem .9rem;border-radius:.5rem;color:#fff;max-width:min(30rem,86vw);' +
      'box-shadow:0 8px 24px rgba(10,26,51,.28);background:' +
      (kind === 'error' ? '#a8321f' : kind === 'warn' ? '#8a6a12' : '#12294f');
    toastWrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .25s'; t.style.opacity = '0';
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
    }, ms || (kind === 'error' ? 5200 : 2600));
    return t;
  };

  Y.core = true;
})();
