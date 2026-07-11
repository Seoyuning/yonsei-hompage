/* YSME Admin Studio — store.js
   IndexedDB 래퍼. DB명 'ysme-admin' v1.
   ES 모듈 금지: window.Admin.store 에 부착. */
(function () {
  'use strict';

  var Admin = (window.Admin = window.Admin || {});

  var DB_NAME = 'ysme-admin';
  var DB_VER = 1;
  var dbPromise = null;

  // DB 오픈은 1회만 수행하고 프라미스를 재사용.
  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('accounts')) {
          db.createObjectStore('accounts', { keyPath: 'username' });
        }
        if (!db.objectStoreNames.contains('versions')) {
          var v = db.createObjectStore('versions', { keyPath: 'id' });
          v.createIndex('byPath', 'path', { unique: false });
          v.createIndex('byTs', 'ts', { unique: false });
        }
        if (!db.objectStoreNames.contains('audit')) {
          var a = db.createObjectStore('audit', { keyPath: 'id' });
          a.createIndex('byTs', 'ts', { unique: false });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
      req.onblocked = function () {
        reject(new Error('IndexedDB 열기가 차단되었습니다. 다른 탭을 닫고 다시 시도하세요.'));
      };
    });
    return dbPromise;
  }

  function get(storeName, key) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(storeName, 'readonly').objectStore(storeName).get(key);
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function put(storeName, record) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(storeName, 'readwrite');
        t.objectStore(storeName).put(record);
        t.oncomplete = function () { resolve(record); };
        t.onerror = function () { reject(t.error); };
        t.onabort = function () { reject(t.error); };
      });
    });
  }

  function del(storeName, key) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(storeName, 'readwrite');
        t.objectStore(storeName).delete(key);
        t.oncomplete = function () { resolve(); };
        t.onerror = function () { reject(t.error); };
        t.onabort = function () { reject(t.error); };
      });
    });
  }

  // list(storeName, {index, value, limit, desc})
  // index/value 생략 시 전체. desc=true면 정렬 키 기준 역순(최신순).
  function list(storeName, opts) {
    opts = opts || {};
    var indexName = opts.index;
    var value = opts.value;
    var limit = opts.limit;
    var desc = !!opts.desc;
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var store = db.transaction(storeName, 'readonly').objectStore(storeName);
        var src = indexName ? store.index(indexName) : store;
        // index+value 가 함께 주어졌을 때만 범위 한정(only). 아니면 전체 순회.
        var range = (indexName && value !== undefined && value !== null)
          ? IDBKeyRange.only(value)
          : null;
        var dir = desc ? 'prev' : 'next';
        var out = [];
        var req = src.openCursor(range, dir);
        req.onsuccess = function () {
          var cur = req.result;
          if (!cur) { resolve(out); return; }
          out.push(cur.value);
          if (limit && out.length >= limit) { resolve(out); return; }
          cur.continue();
        };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function setSetting(key, value) {
    return put('settings', { key: key, value: value });
  }

  function getSetting(key) {
    return get('settings', key).then(function (r) {
      return r ? r.value : undefined;
    });
  }

  Admin.store = {
    get: get,
    put: put,
    del: del,
    list: list,
    setSetting: setSetting,
    getSetting: getSetting
  };
})();
