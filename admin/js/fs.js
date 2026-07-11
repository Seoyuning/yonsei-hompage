/* ═══════════════════════════════════════════════════════════════════
   YSME Admin Studio — fs.js
   File System Access 레이어. 사이트 폴더 핸들 확보 → 경로 기반 읽기/쓰기.
   폴더 핸들은 IndexedDB(settings.dirHandle)에 보존해 재접속 시 권한만 재요청.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

var Admin = window.Admin;

var dirHandle = null;          // FileSystemDirectoryHandle (사이트 루트)
var pageEntries = [];          // [{path, name}] 루트 *.html
var assetEntries = [];         // [{path, name}] assets/ 내 .css/.js

function supported() {
  return typeof window.showDirectoryPicker === 'function';
}

/* 경로 'a/b/c.ext' → 파일 핸들. create 옵션은 마지막 파일에만 적용 */
async function getFileHandle(path, create) {
  if (!dirHandle) throw new Error('사이트 폴더가 연결되지 않았습니다.');
  var parts = String(path).split('/').filter(Boolean);
  var dir = dirHandle;
  for (var i = 0; i < parts.length - 1; i++) {
    dir = await dir.getDirectoryHandle(parts[i], { create: false });
  }
  return dir.getFileHandle(parts[parts.length - 1], { create: !!create });
}

/* 사이트 구조 스캔: 루트 *.html + assets/**.css|js (깊이 3 제한) */
async function scanSite() {
  pageEntries = [];
  assetEntries = [];
  for await (var entry of dirHandle.values()) {
    if (entry.kind === 'file' && /\.html?$/i.test(entry.name)) {
      pageEntries.push({ path: entry.name, name: entry.name });
    }
  }
  pageEntries.sort(function (a, b) {
    // index.html 최상단, 나머지 가나다
    if (a.name === 'index.html') return -1;
    if (b.name === 'index.html') return 1;
    return a.name.localeCompare(b.name);
  });
  try {
    var assets = await dirHandle.getDirectoryHandle('assets', { create: false });
    await walkAssets(assets, 'assets', 0);
  } catch (e) { /* assets 폴더가 없는 사이트도 허용 */ }
  assetEntries.sort(function (a, b) { return a.path.localeCompare(b.path); });
}

async function walkAssets(dir, prefix, depth) {
  if (depth > 3) return;
  for await (var entry of dir.values()) {
    if (entry.kind === 'directory') {
      await walkAssets(entry, prefix + '/' + entry.name, depth + 1);
    } else if (/\.(css|js)$/i.test(entry.name)) {
      assetEntries.push({ path: prefix + '/' + entry.name, name: entry.name });
    }
  }
}

async function verifyPermission(handle, ask) {
  var opts = { mode: 'readwrite' };
  if (await handle.queryPermission(opts) === 'granted') return true;
  if (!ask) return false;
  return (await handle.requestPermission(opts)) === 'granted';
}

async function connect(handle) {
  dirHandle = handle;
  await scanSite();
  Admin.state.sitePath = handle.name;
  // 다음 세션을 위해 핸들 보존 (structured clone 가능)
  try { await Admin.store.setSetting('dirHandle', handle); } catch (e) {}
  Admin.bus.emit('site:opened', {
    name: handle.name,
    pages: pageEntries.slice(),
    assets: assetEntries.slice()
  });
  return true;
}

Admin.fs = {
  supported: supported,

  isReady: function () { return !!dirHandle; },
  siteName: function () { return dirHandle ? dirHandle.name : ''; },
  pages: function () { return pageEntries.slice(); },
  assets: function () { return assetEntries.slice(); },

  /* 폴더 픽커로 사이트 열기 (사용자 제스처에서 호출해야 함) */
  openSite: async function () {
    if (!supported()) {
      Admin.toast('이 브라우저는 폴더 접근을 지원하지 않습니다. Chrome/Edge를 사용하세요.', 'err');
      return false;
    }
    var handle;
    try {
      handle = await window.showDirectoryPicker({ mode: 'readwrite', id: 'ysme-site' });
    } catch (e) {
      if (e && e.name === 'AbortError') return false;   // 사용자가 취소
      // file:// 등 일부 컨텍스트에서 SecurityError 가능 → 안내
      Admin.toast('폴더를 열 수 없습니다: ' + (e && e.message ? e.message : e) +
        ' — README의 serve.py로 로컬 서버 실행을 시도해 보세요.', 'err');
      return false;
    }
    if (!(await verifyPermission(handle, true))) {
      Admin.toast('폴더 쓰기 권한이 거부되었습니다.', 'err');
      return false;
    }
    return connect(handle);
  },

  /* 저장된 핸들로 재연결 시도. needGesture=true 반환 시 버튼 클릭 필요 */
  reconnect: async function (askPermission) {
    if (!supported()) return false;
    var saved;
    try { saved = await Admin.store.getSetting('dirHandle'); } catch (e) { return false; }
    if (!saved) return false;
    try {
      if (!(await verifyPermission(saved, !!askPermission))) return false;
      return await connect(saved);
    } catch (e) {
      return false;
    }
  },

  readFile: async function (path) {
    var fh = await getFileHandle(path, false);
    var file = await fh.getFile();
    return file.text();
  },

  /* 이미지 등 바이너리 파일 → blob URL (iframe 렌더용). 실패 시 null */
  fileUrl: async function (path) {
    try {
      var fh = await getFileHandle(path, false);
      var file = await fh.getFile();
      return URL.createObjectURL(file);
    } catch (e) { return null; }
  },

  writeFile: async function (path, content) {
    var fh = await getFileHandle(path, false);
    var w = await fh.createWritable();
    try {
      await w.write(content);
    } finally {
      await w.close();
    }
  }
};

/* 미지원 브라우저 안내 배너 */
document.addEventListener('DOMContentLoaded', function () {
  if (!supported()) {
    var el = document.getElementById('fsUnsupported');
    if (el) el.hidden = false;
  }
});

})();
