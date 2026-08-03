/* YSME In-Place Studio — 편집 엔진

   진실은 **파일 원문 문자열**이다. 편집은 source.js 의 오프셋 치환으로 원문에 기록하고,
   같은 변경을 화면(라이브 DOM)에도 개별 반영한다. 라이브 DOM 을 원문으로 되돌려 쓰는
   (미러링) 경로는 존재하지 않는다 — 사이트 JS 가 만든 노드·클래스·텍스트가 파일로
   새어 들어갈 통로를 아예 만들지 않기 위해서다.

   용어
     idx   전순회 인덱스( = eid ). source.zip() 이 원문 요소와 DOM 노드를 같은 인덱스로 묶는다.
     buf   현재 페이지 버퍼 {path, src, origSrc, els, nodes, history…}
     map   원본 ↔ 라이브 정렬 결과 (align.js)
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.engine) return;
  var S = Y.source, U = Y.util;

  var HISTORY_MAX = 60;
  var buf = null;              // 현재 버퍼
  var live = null;             // {doc, win, map}
  var headSha = null;          // 마지막으로 확인한 브랜치 HEAD

  /* ── 버퍼 만들기 ── */
  function reparse(b) {
    var doc = new DOMParser().parseFromString(b.src, 'text/html');
    var z = S.zip(doc, S.scan(b.src));
    b.doc = doc;
    if (z.ok) { b.mapped = true; b.els = z.els; b.nodes = z.nodes; b.reason = null; }
    else { b.mapped = false; b.els = null; b.nodes = null; b.reason = z.reason; }
    return b;
  }

  function makeBuffer(path, src, origSrc, baseSha) {
    var b = {
      path: path, src: src, origSrc: origSrc == null ? src : origSrc,
      baseSha: baseSha || headSha || null,
      history: [src], hIndex: 0,
      doc: null, els: null, nodes: null, mapped: false, reason: null
    };
    return reparse(b);
  }

  function pushHistory(b) {
    if (b.history[b.hIndex] === b.src) return;
    b.history = b.history.slice(0, b.hIndex + 1);
    b.history.push(b.src);
    if (b.history.length > HISTORY_MAX) b.history.shift();
    b.hIndex = b.history.length - 1;
  }

  /* ── 초안 버퍼 (IndexedDB) ── */
  var flushDraft = U.debounce(function () { saveDraft(); }, 700);

  function saveDraft() {
    if (!buf) return Promise.resolve();
    if (buf.src === buf.origSrc) return Y.store.del('drafts', buf.path).then(emitDirty);
    return Y.store.put('drafts', {
      path: buf.path, src: buf.src, origSrc: buf.origSrc,
      baseSha: buf.baseSha, ts: Date.now(), author: Y.session.author()
    }).then(emitDirty);
  }
  function emitDirty() { Y.bus.emit('draft:change', { path: buf && buf.path, dirty: isDirty() }); }
  function isDirty() { return !!buf && buf.src !== buf.origSrc; }

  /* ── 편집 반영 공통 경로 ── */
  function commitEdit(newSrc, liveApply, label) {
    if (!buf || newSrc === buf.src) return false;
    buf.src = newSrc;
    reparse(buf);
    pushHistory(buf);
    if (typeof liveApply === 'function') { try { liveApply(); } catch (e) {} }
    if (live) rebind();                       // 구조가 바뀌었을 수 있으니 정렬 갱신
    flushDraft();
    Y.bus.emit('buffer:change', { path: buf.path, label: label || 'edit', dirty: isDirty() });
    return true;
  }

  function elAt(idx) { return buf && buf.mapped && buf.els ? buf.els[idx] : null; }
  function nodeAt(idx) { return buf && buf.mapped && buf.nodes ? buf.nodes[idx] : null; }
  function liveAt(idx) { return live && live.map ? live.map.liveOf(idx) : null; }

  function rebind() {
    if (!live || !buf || !buf.mapped) return null;
    live.map = Y.align(buf.nodes, live.doc.documentElement);
    Y.bus.emit('align:change', live.map);
    return live.map;
  }

  /* ── 스타일 속성 파싱/직렬화 ── */
  function styleProps(text) {
    var out = [], parts = String(text || '').split(';');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim(); if (!p) continue;
      var c = p.indexOf(':'); if (c < 0) continue;
      out.push([p.slice(0, c).trim(), p.slice(c + 1).trim()]);
    }
    return out;
  }
  function styleText(pairs) {
    var s = [];
    for (var i = 0; i < pairs.length; i++) s.push(pairs[i][0] + ':' + pairs[i][1]);
    return s.join(';');
  }

  var engine = Y.engine = {
    /* ── 상태 ── */
    /* 세션에도 함께 적는다 — 게시 뒤 페이지를 이동하면 boot 가 세션의 headSha 로
       기준점을 되돌리는데, 메모리에만 갱신하면 직전에 내가 게시한 커밋과
       「다른 사람이 먼저 게시했다」는 충돌 오탐이 난다. */
    setHeadSha: function (sha) {
      headSha = sha || headSha;
      if (!sha) return;
      try {
        var s = Y.session.get();
        if (s && s.headSha !== sha) { s.headSha = sha; Y.session.set(s); }
      } catch (e) {}
    },
    headSha: function () { return headSha; },
    current: function () { return buf; },
    path: function () { return buf && buf.path; },
    src: function () { return buf && buf.src; },
    origSrc: function () { return buf && buf.origSrc; },
    mapped: function () { return !!(buf && buf.mapped); },
    reason: function () { return buf && buf.reason; },
    dirty: isDirty,
    map: function () { return live && live.map; },
    liveDoc: function () { return live && live.doc; },
    liveWin: function () { return live && live.win; },

    /** 페이지 원문을 확보한다 — 초안이 있으면 초안을 이어받는다. */
    open: function (path) {
      return Y.store.get('drafts', path).then(function (d) {
        if (d && typeof d.src === 'string') {
          buf = makeBuffer(path, d.src, d.origSrc, d.baseSha);
          Y.bus.emit('buffer:open', { path: path, fromDraft: true, dirty: isDirty() });
          return buf;
        }
        return Y.net.read(path).then(function (r) {
          buf = makeBuffer(path, r.content, r.content, headSha);
          Y.bus.emit('buffer:open', { path: path, fromDraft: false, dirty: false });
          return buf;
        });
      });
    },

    /** 라이브 문서를 엔진에 붙인다(데스크톱 = top document, 모바일 = 프레임 document). */
    bindLive: function (doc, win) {
      live = { doc: doc, win: win, map: null };
      return rebind();
    },
    unbindLive: function () { live = null; },

    /* ── 조회 ── */
    isTextLeaf: function (idx) {
      var n = nodeAt(idx);
      if (!n || n.children.length) return false;
      return !/^(script|style|textarea|title|img|br|hr|input|meta|link|source|track|iframe|svg|canvas|video|audio|use|path)$/
        .test(n.tagName.toLowerCase());
    },
    /** 런타임이 텍스트를 덮어쓰는 요소는 화면 텍스트를 신뢰할 수 없다. */
    runtimeManaged: function (idx) {
      var n = nodeAt(idx);
      if (!n) return null;
      if (n.hasAttribute('data-count')) return 'count';
      if (n.hasAttribute('data-i18n')) return 'i18n';
      return null;
    },
    info: function (idx) {
      var el = elAt(idx), n = nodeAt(idx);
      if (!el || !n) return null;
      var attrs = {}, list = S.attrList(buf.src, el);
      for (var i = 0; i < list.length; i++) attrs[list[i].name] = list[i].value == null ? '' : S.decodeEntities(list[i].value);
      return {
        idx: idx, tag: n.tagName.toLowerCase(), id: n.id || '',
        cls: n.getAttribute('class') || '', attrs: attrs,
        text: engine.isTextLeaf(idx) ? S.text(buf.src, el) : null,
        isLeaf: engine.isTextLeaf(idx),
        runtime: engine.runtimeManaged(idx),
        live: liveAt(idx),
        label: n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') +
          (n.getAttribute('class') ? '.' + n.getAttribute('class').trim().split(/\s+/)[0] : '')
      };
    },
    breadcrumb: function (idx) {
      var n = nodeAt(idx), out = [];
      while (n && n.nodeType === 1) {
        var i = buf.nodes.indexOf(n);
        if (i < 0) break;
        var info = engine.info(i);
        out.unshift({ idx: i, label: info ? info.label : n.tagName.toLowerCase() });
        if (n.tagName.toLowerCase() === 'body') break;
        n = n.parentElement;
      }
      return out;
    },
    /** AI 컨텍스트용 개요 — 전체 HTML 대신 이것을 보낸다. */
    outline: function (opts) {
      opts = opts || {};
      var out = [], max = opts.max || 400;
      if (!buf || !buf.mapped) return out;
      for (var i = 0; i < buf.nodes.length && out.length < max; i++) {
        var n = buf.nodes[i], tag = n.tagName.toLowerCase();
        if (/^(html|head|meta|link|script|style|title|body|noscript)$/.test(tag)) continue;
        if (n.children.length) continue;                       // 텍스트 리프만
        var t = S.text(buf.src, buf.els[i]).replace(/\s+/g, ' ').trim();
        if (!t) continue;
        out.push({ idx: i, tag: tag, id: n.id || undefined, text: t.length > 160 ? t.slice(0, 160) + '…' : t });
      }
      return out;
    },
    indexFromLive: function (el) { return live && live.map ? live.map.indexOf(el) : null; },
    nearestFromLive: function (el) { return live && live.map ? live.map.nearest(el) : null; },

    /* ── 편집 ── */
    setText: function (idx, text) {
      var el = elAt(idx); if (!el) return false;
      if (!engine.isTextLeaf(idx)) return false;
      if (S.text(buf.src, el) === text) return false;
      var lv = liveAt(idx);
      return commitEdit(S.setText(buf.src, el, text), function () {
        if (lv && lv.textContent !== text) lv.textContent = text;
      }, 'text');
    },

    setAttr: function (idx, name, value) {
      var el = elAt(idx); if (!el) return false;
      var lv = liveAt(idx);
      return commitEdit(S.setAttr(buf.src, el, name, value), function () {
        if (!lv) return;
        if (value == null) lv.removeAttribute(name);
        else lv.setAttribute(name, value);
      }, 'attr');
    },

    setStyleProp: function (idx, prop, value) {
      var el = elAt(idx); if (!el) return false;
      var cur = S.getAttr(buf.src, el, 'style') || '';
      var pairs = styleProps(cur), found = false;
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i][0].toLowerCase() === String(prop).toLowerCase()) {
          found = true;
          if (value == null || value === '') pairs.splice(i, 1);
          else pairs[i][1] = value;
          break;
        }
      }
      if (!found && value != null && value !== '') pairs.push([prop, value]);
      var next = styleText(pairs);
      var lv = liveAt(idx);
      return commitEdit(S.setAttr(buf.src, el, 'style', next || null), function () {
        if (!lv) return;
        if (next) lv.setAttribute('style', next); else lv.removeAttribute('style');
      }, 'style');
    },
    getStyleProp: function (idx, prop) {
      var el = elAt(idx); if (!el) return '';
      var pairs = styleProps(S.getAttr(buf.src, el, 'style') || '');
      for (var i = 0; i < pairs.length; i++) if (pairs[i][0].toLowerCase() === String(prop).toLowerCase()) return pairs[i][1];
      return '';
    },

    removeEl: function (idx) {
      var el = elAt(idx), n = nodeAt(idx); if (!el || !n) return false;
      var tag = n.tagName.toLowerCase();
      if (/^(html|head|body)$/.test(tag)) return false;
      var lv = liveAt(idx);
      return commitEdit(S.remove(buf.src, el), function () {
        if (lv && lv.parentNode) lv.parentNode.removeChild(lv);
      }, 'remove');
    },

    duplicateEl: function (idx) {
      var el = elAt(idx), n = nodeAt(idx); if (!el || !n) return false;
      if (/^(html|head|body)$/.test(n.tagName.toLowerCase())) return false;
      var lv = liveAt(idx);
      return commitEdit(S.duplicate(buf.src, el), function () {
        if (lv && lv.parentNode) lv.parentNode.insertBefore(lv.cloneNode(true), lv.nextSibling);
      }, 'duplicate');
    },

    moveEl: function (idx, dir) {
      if (!buf || !buf.mapped) return false;
      var next = S.swapSibling(buf.src, buf.els, buf.nodes, idx, dir);
      if (next == null) return false;
      var lv = liveAt(idx);
      return commitEdit(next, function () {
        if (!lv || !lv.parentNode) return;
        if (dir < 0 && lv.previousElementSibling) lv.parentNode.insertBefore(lv, lv.previousElementSibling);
        else if (dir > 0 && lv.nextElementSibling) lv.parentNode.insertBefore(lv.nextElementSibling, lv);
      }, 'move');
    },

    insertAfter: function (idx, html) {
      var el = elAt(idx); if (!el || !html) return false;
      var lv = liveAt(idx);
      return commitEdit(S.insertAfter(buf.src, el, html), function () {
        if (!lv || !lv.parentNode) return;
        var t = document.createElement('template');
        t.innerHTML = html;
        var frag = t.content;
        lv.parentNode.insertBefore(frag, lv.nextSibling);
      }, 'insert');
    },

    /** AI 패치·일괄 편집처럼 원문을 통째로 바꿀 때. 화면은 재로드가 필요할 수 있다. */
    applyRawSrc: function (newSrc, label) {
      if (!buf || newSrc === buf.src) return false;
      var before = buf.nodes ? buf.nodes.length : -1;
      buf.src = newSrc;
      reparse(buf);
      pushHistory(buf);
      flushDraft();
      var structural = !buf.nodes || buf.nodes.length !== before;
      if (live) rebind();
      Y.bus.emit('buffer:change', { path: buf.path, label: label || 'raw', dirty: isDirty(), structural: structural });
      if (structural) Y.bus.emit('live:stale', { path: buf.path });
      else engine.resyncLive();
      return true;
    },

    /** 원문의 텍스트·style 을 화면에 다시 밀어 넣는다(되돌리기 후 등). */
    resyncLive: function () {
      if (!buf || !buf.mapped || !live || !live.map) return 0;
      var n = 0;
      for (var i = 0; i < buf.nodes.length; i++) {
        var lv = live.map.liveOf(i); if (!lv) continue;
        if (engine.runtimeManaged(i)) continue;
        if (engine.isTextLeaf(i)) {
          var t = S.text(buf.src, buf.els[i]);
          if (lv.textContent !== t) { lv.textContent = t; n++; }
        }
        var st = S.getAttr(buf.src, buf.els[i], 'style');
        var cur = lv.getAttribute('style');
        if ((st || '') !== (cur || '')) {
          if (st) lv.setAttribute('style', st); else lv.removeAttribute('style');
          n++;
        }
      }
      return n;
    },

    /* ── 되돌리기 ── */
    canUndo: function () { return !!buf && buf.hIndex > 0; },
    canRedo: function () { return !!buf && buf.hIndex < buf.history.length - 1; },
    undo: function () { return step(-1); },
    redo: function () { return step(1); },

    /* ── 초안 ── */
    saveDraft: saveDraft,
    flush: function () { return saveDraft(); },

    /** 지금 유효한 원문을 준다 — 열려 있으면 버퍼, 초안이 있으면 초안, 없으면 파일.
        고치지 않고 보기만 할 때 쓴다(찾아 바꾸기의 「곳 목록」). */
    pageSrc: function (path) {
      if (buf && buf.path === path) return Promise.resolve(buf.src);
      return Y.store.get('drafts', path).then(function (d) {
        if (d && typeof d.src === 'string') return d.src;
        return Y.net.read(path).then(function (r) { return r.content; });
      });
    },

    /** 지금 열려 있지 않은 페이지의 원문을 고친다 (전영역 찾아 바꾸기용).
        fn(src) 이 새 원문을 돌려주면 초안으로 남긴다. 이미 초안이 있으면 그 위에 얹는다.
        현재 페이지면 열린 버퍼를 그대로 쓴다 — 같은 파일의 초안이 두 벌 생기면 안 된다.
        게시는 IndexedDB 의 초안을 전부 모으므로, 여기서 남긴 초안도 같은 커밋에 실린다. */
    patchPage: function (path, fn) {
      if (buf && buf.path === path) {
        var next = fn(buf.src);
        var ok = (next != null && next !== buf.src) ? engine.applyRawSrc(next, 'replace') : false;
        return Promise.resolve({ path: path, changed: !!ok, open: true });
      }
      return Y.store.get('drafts', path).then(function (d) {
        if (d && typeof d.src === 'string') {
          return { src: d.src, origSrc: d.origSrc == null ? d.src : d.origSrc, baseSha: d.baseSha };
        }
        return Y.net.read(path).then(function (r) {
          return { src: r.content, origSrc: r.content, baseSha: headSha };
        });
      }).then(function (rec) {
        var next = fn(rec.src);
        if (next == null || next === rec.src) return { path: path, changed: false };
        /* 원래대로 되돌아왔으면 초안을 남기지 않는다 — 빈 초안이 게시 목록을 더럽힌다 */
        if (next === rec.origSrc) {
          return Y.store.del('drafts', path).then(function () {
            Y.bus.emit('draft:change', { path: path, dirty: false });
            return { path: path, changed: true };
          });
        }
        return Y.store.put('drafts', {
          path: path, src: next, origSrc: rec.origSrc,
          baseSha: rec.baseSha || headSha || null, ts: Date.now(), author: Y.session.author()
        }).then(function () {
          Y.bus.emit('draft:change', { path: path, dirty: true });
          return { path: path, changed: true };
        });
      });
    },

    discardDraft: function () {
      if (!buf) return Promise.resolve();
      var path = buf.path;
      return Y.store.del('drafts', path).then(function () {
        buf = makeBuffer(path, buf.origSrc, buf.origSrc, buf.baseSha);
        if (live) rebind();
        Y.bus.emit('buffer:change', { path: path, label: 'discard', dirty: false });
        Y.bus.emit('live:stale', { path: path });
      });
    },
    /** 게시 후 — 현재 원문을 새 기준으로 삼고 초안을 지운다. */
    markPublished: function (sha) {
      if (!buf) return Promise.resolve();
      headSha = sha || headSha;
      buf.origSrc = buf.src;
      buf.baseSha = headSha;
      return Y.store.del('drafts', buf.path).then(function () {
        Y.bus.emit('buffer:change', { path: buf.path, label: 'published', dirty: false });
      });
    }
  };

  function step(dir) {
    if (!buf) return false;
    var to = buf.hIndex + dir;
    if (to < 0 || to >= buf.history.length) return false;
    var before = buf.nodes ? buf.nodes.length : -1;
    buf.hIndex = to;
    buf.src = buf.history[to];
    reparse(buf);
    flushDraft();
    if (live) rebind();
    var structural = !buf.nodes || buf.nodes.length !== before;
    Y.bus.emit('buffer:change', { path: buf.path, label: dir < 0 ? 'undo' : 'redo', dirty: isDirty(), structural: structural });
    if (structural) Y.bus.emit('live:stale', { path: buf.path });
    else engine.resyncLive();
    return true;
  }

  /* 탭을 떠나기 전에 초안을 확실히 저장한다 */
  window.addEventListener('pagehide', function () { if (isDirty()) saveDraft(); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && isDirty()) saveDraft();
  });
})();
