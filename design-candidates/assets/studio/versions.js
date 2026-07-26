/* YSME In-Place Studio — 버전 관리 (STUDIO_SPEC 2·4·10-6절)

   사이트 전체의 "시점"을 GitHub 커밋으로 관리한다. 사람이 읽는 이름·시각·작성자는
   `_studio/checkpoints.json` 매니페스트에 담고, 그 매니페스트 파일 자체를 **같은 커밋에
   포함**시켜 커밋 1개로 시점을 만든다(체크포인트 전용 서버 액션은 없다).

   commitSha 문제: 커밋을 만들기 전에는 그 커밋의 sha 를 알 수 없다. 그래서 항목에는
   `baseSha`(부모 커밋)와 파일 목록을 기록하고, 커밋 메시지에 `[ys-cp:<id>]` 표식을 남긴다.
   목록 화면은 Y.net.history 로 그 표식을 찾아 **실제 sha** 를 확정한다(같은 브라우저에서
   만든 시점은 IndexedDB meta 캐시로 즉시 확정된다). 비교·복원은 확정된 sha 를 ref 로 쓴다.

   복원 범위: 텍스트 파일(html·css·js·json·svg·txt·md)만 되돌린다. 이미지 등 바이너리는
   문자열로 왕복시킬 수 없어 손대지 않으며, UI 에 그 사실을 밝힌다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.versions) return;
  var U = Y.util;

  var CP_PATH = '_studio/checkpoints.json';
  var TEXT_EXT = /\.(html?|css|js|json|svg|txt|md)$/i;
  var HISTORY_SCAN = 60;      // sha 확정을 위해 훑는 커밋 수
  var HISTORY_SHOW = 20;      // 화면에 나열하는 커밋 수
  var SHA_META_KEY = 'ys-cp-sha';

  var state = {
    host: null,
    items: null,              // Checkpoint[] (null = 아직 못 불러옴)
    commits: null,            // 커밋 이력
    shaMap: {},               // id → 확정된 커밋 sha (로컬 캐시)
    drafts: [],               // 미저장 초안
    cpError: null,
    hError: null,
    loading: false,
    form: { name: '', note: '' }
  };

  /* ── 작은 도우미 ── */
  function esc(s) { return U.esc(s); }
  function errMsg(e) { return (e && e.message) || '알 수 없는 오류가 발생했습니다.'; }
  function busy(label) {
    if (Y.hud && Y.hud.busy) { try { return Y.hud.busy(label); } catch (e) {} }
    return function () {};
  }
  function ask(message) {
    if (Y.hud && Y.hud.confirm) return Y.hud.confirm(message);
    return Promise.resolve(window.confirm(message));
  }
  function marker(id) { return '[ys-cp:' + id + ']'; }
  function isSha(s) { return typeof s === 'string' && /^[0-9a-f]{7,40}$/i.test(s); }

  function dirtyDrafts() {
    return Y.store.all('drafts').then(function (all) {
      var out = [];
      for (var i = 0; i < (all || []).length; i++) {
        var d = all[i];
        if (d && typeof d.src === 'string' && d.src !== d.origSrc) out.push(d);
      }
      out.sort(function (a, b) { return a.path < b.path ? -1 : 1; });
      return out;
    }, function () { return []; });
  }

  function loadShaMap() {
    return Y.store.get('meta', SHA_META_KEY).then(function (r) {
      return (r && r.map) || {};
    }, function () { return {}; });
  }
  function rememberSha(id, sha) {
    state.shaMap[id] = sha;
    var map = {};
    for (var k in state.shaMap) if (Object.prototype.hasOwnProperty.call(state.shaMap, k)) map[k] = state.shaMap[k];
    return Y.store.put('meta', { key: SHA_META_KEY, map: map }).catch(function () {});
  }

  /** 항목의 실제 커밋 sha 를 확정한다(없으면 null). */
  function shaOf(item) {
    if (!item) return null;
    if (isSha(item.commitSha)) return item.commitSha;
    if (isSha(state.shaMap[item.id])) return state.shaMap[item.id];
    var mk = marker(item.id), cs = state.commits || [];
    for (var i = 0; i < cs.length; i++) {
      if (String(cs[i].message || '').indexOf(mk) >= 0) {
        state.shaMap[item.id] = cs[i].sha;
        return cs[i].sha;
      }
    }
    return null;
  }

  function itemById(id) {
    var a = state.items || [];
    for (var i = 0; i < a.length; i++) if (a[i] && a[i].id === id) return a[i];
    return null;
  }

  /* ── 데이터 불러오기 ── */
  function refresh() {
    if (state.loading) return Promise.resolve();
    state.loading = true;
    state.cpError = null;
    state.hError = null;
    paint();
    var stop = busy('버전 정보를 불러옵니다…');
    return Promise.all([
      Y.net.checkpoints().then(function (r) {
        var items = (r && r.items) || [];
        return items.filter(function (x) { return x && x.id; });
      }, function (e) { state.cpError = errMsg(e); return null; }),
      Y.net.history(null, HISTORY_SCAN).then(function (r) {
        return (r && r.commits) || [];
      }, function (e) { state.hError = errMsg(e); return null; }),
      loadShaMap(),
      dirtyDrafts()
    ]).then(function (a) {
      if (a[0]) {
        a[0].sort(function (x, y) { return (y.ts || 0) - (x.ts || 0); });
        state.items = a[0];
      }
      if (a[1]) state.commits = a[1];
      state.shaMap = a[2] || {};
      state.drafts = a[3] || [];
      state.loading = false;
      stop();
      paint();
    }, function (e) {
      state.loading = false;
      stop();
      state.cpError = errMsg(e);
      paint();
    });
  }

  /* ── 화면 ── */
  function paint() {
    var host = state.host;
    if (!host) return;
    var wrap = document.createElement('div');
    wrap.className = 'ys-vs';
    wrap.setAttribute(Y.config.uiAttr, '');
    wrap.innerHTML = secSave() + secList() + secHistory();
    host.innerHTML = '';
    host.appendChild(wrap);

    var nameEl = wrap.querySelector('.ys-vs-name');
    var noteEl = wrap.querySelector('.ys-vs-memo');
    if (nameEl) nameEl.value = state.form.name;
    if (noteEl) noteEl.value = state.form.note;
    wire(wrap);
  }

  function secSave() {
    var n = state.drafts.length;
    var hint = n
      ? ('미저장 초안 ' + n + '개(' + esc(state.drafts.map(function (d) { return d.path; }).join(', ')) + ')가 함께 게시됩니다.')
      : '미저장 초안이 없습니다. 현재 게시본 그대로 시점만 기록합니다.';
    return '' +
      '<section class="ys-vs-sec">' +
        '<h3 class="ys-vs-h">지금 상태를 이름 붙여 저장</h3>' +
        '<p class="ys-vs-note">이름과 메모를 남기면 나중에 이 시점으로 되돌릴 수 있습니다. 커밋 1개로 기록됩니다.</p>' +
        '<label class="ys-vs-f"><span class="ys-vs-lb">이름</span>' +
          '<input type="text" class="ys-vs-in ys-vs-name" maxlength="60" placeholder="예: 학사 안내 개편 전"></label>' +
        '<label class="ys-vs-f"><span class="ys-vs-lb">메모(선택)</span>' +
          '<textarea class="ys-vs-in ys-vs-memo" rows="2" maxlength="300" placeholder="무엇을 바꾸기 직전인지 적어 두면 좋습니다."></textarea></label>' +
        '<p class="ys-vs-dim">' + hint + '</p>' +
        '<div class="ys-vs-act"><button type="button" class="ys-btn ys-vs-do-save">이 시점 저장</button></div>' +
      '</section>';
  }

  function secList() {
    var body;
    if (state.cpError) {
      body = '<p class="ys-vs-err">저장된 시점을 불러오지 못했습니다 — ' + esc(state.cpError) + '</p>' +
        '<div class="ys-vs-act"><button type="button" class="ys-btn ys-vs-reload">다시 시도</button></div>';
    } else if (state.items == null) {
      body = '<p class="ys-vs-dim">불러오는 중…</p>';
    } else if (!state.items.length) {
      body = '<p class="ys-vs-dim">저장된 시점이 없습니다. 위에서 첫 시점을 만들어 두면 언제든 되돌릴 수 있습니다.</p>';
    } else {
      var rows = [], i;
      for (i = 0; i < state.items.length; i++) rows.push(itemRow(state.items[i]));
      body = '<ul class="ys-vs-list">' + rows.join('') + '</ul>';
    }
    return '' +
      '<section class="ys-vs-sec">' +
        '<h3 class="ys-vs-h">저장된 시점' + (state.items && state.items.length ? ' (' + state.items.length + ')' : '') + '</h3>' +
        body +
      '</section>';
  }

  function itemRow(it) {
    var sha = shaOf(it);
    var ts = it.ts ? (U.fmtTime(it.ts) + ' · ' + U.ago(it.ts)) : '시각 미기록';
    var files = (it.files || []).length;
    var fileTxt = files ? (files + '개 파일 변경') : '파일 변경 없음';
    var noteHtml = it.note ? '<div class="ys-vs-item-note">' + esc(it.note) + '</div>' : '';
    var shaHtml = sha
      ? '<span class="ys-vs-sha">' + esc(String(sha).slice(0, 7)) + '</span>'
      : '<span class="ys-vs-warn">커밋 확인 불가</span>';
    var disabled = sha ? '' : ' disabled';
    var actNote = sha ? '' : '<div class="ys-vs-warn">최근 ' + HISTORY_SCAN + '개 커밋에서 이 시점의 커밋을 찾지 못해 비교·복원을 할 수 없습니다.</div>';
    return '' +
      '<li class="ys-vs-item" data-id="' + esc(it.id) + '">' +
        '<div class="ys-vs-item-h"><strong class="ys-vs-item-name">' + esc(it.name || '(이름 없음)') + '</strong>' + shaHtml + '</div>' +
        '<div class="ys-vs-item-meta">' + esc(ts) + ' · ' + esc(it.author || '알 수 없음') + ' · ' + fileTxt + '</div>' +
        noteHtml + actNote +
        '<div class="ys-vs-item-act">' +
          '<button type="button" class="ys-btn ys-btn-sm ys-vs-cmp" data-id="' + esc(it.id) + '"' + disabled + '>현재와 비교</button>' +
          '<button type="button" class="ys-btn ys-btn-sm ys-vs-rst" data-id="' + esc(it.id) + '"' + disabled + '>복원</button>' +
        '</div>' +
      '</li>';
  }

  function secHistory() {
    var body;
    if (state.hError) {
      body = '<p class="ys-vs-err">커밋 이력을 불러오지 못했습니다 — ' + esc(state.hError) + '</p>';
    } else if (state.commits == null) {
      body = '<p class="ys-vs-dim">불러오는 중…</p>';
    } else if (!state.commits.length) {
      body = '<p class="ys-vs-dim">커밋 이력이 없습니다.</p>';
    } else {
      var rows = [], list = state.commits.slice(0, HISTORY_SHOW);
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        var when = c.date ? U.fmtTime(Date.parse(c.date)) : '';
        var msg = String(c.message || '').split('\n')[0];
        var url = c.html_url || c.url || '';
        rows.push('' +
          '<li class="ys-vs-cm">' +
            '<div class="ys-vs-cm-msg">' + esc(msg) + '</div>' +
            '<div class="ys-vs-cm-meta">' +
              '<span class="ys-vs-sha">' + esc(String(c.sha || '').slice(0, 7)) + '</span> ' +
              esc(c.author || '알 수 없음') + (when ? ' · ' + esc(when) : '') +
              (url ? ' · <a class="ys-vs-link" href="' + U.escAttr(url) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' : '') +
            '</div>' +
          '</li>');
      }
      body = '<ul class="ys-vs-cms">' + rows.join('') + '</ul>';
    }
    return '' +
      '<section class="ys-vs-sec">' +
        '<h3 class="ys-vs-h">커밋 이력</h3>' +
        body +
        '<div class="ys-vs-act"><button type="button" class="ys-btn ys-vs-reload">새로 고침</button></div>' +
      '</section>';
  }

  function wire(wrap) {
    var nameEl = wrap.querySelector('.ys-vs-name');
    var memoEl = wrap.querySelector('.ys-vs-memo');
    if (nameEl) nameEl.addEventListener('input', function () { state.form.name = nameEl.value; });
    if (memoEl) memoEl.addEventListener('input', function () { state.form.note = memoEl.value; });

    wrap.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('.ys-vs-do-save')) { e.preventDefault(); save(); return; }
      if (t.closest('.ys-vs-reload')) { e.preventDefault(); refresh(); return; }
      var cmp = t.closest('.ys-vs-cmp');
      if (cmp) { e.preventDefault(); compare(cmp.getAttribute('data-id')); return; }
      var rst = t.closest('.ys-vs-rst');
      if (rst) { e.preventDefault(); restore(rst.getAttribute('data-id')); return; }
    });
  }

  /* ── 1. 시점 저장 ── */
  function save() {
    var name = String(state.form.name || '').trim();
    if (!name) { Y.toast('시점 이름을 입력하세요.', 'warn'); return Promise.resolve(false); }
    var note = String(state.form.note || '').trim();
    var author = Y.session.author();
    var id = U.uid('cp');

    var stop = busy('시점을 저장합니다…');
    var flush = (Y.engine && Y.engine.flush) ? Y.engine.flush() : Promise.resolve();

    return flush.then(dirtyDrafts).then(function (drafts) {
      state.drafts = drafts;
      var files = [], paths = [], i;
      for (i = 0; i < drafts.length; i++) {
        files.push({ path: drafts[i].path, content: drafts[i].src });
        paths.push(drafts[i].path);
      }
      return Y.net.checkpoints().then(function (r) {
        var items = (r && r.items) || [];
        if (!Array.isArray(items)) items = [];
        var base = (Y.engine && Y.engine.headSha && Y.engine.headSha()) || '';
        var entry = {
          id: id, name: name, note: note, ts: Date.now(), author: author,
          /* 이 커밋의 sha 는 커밋 전에 알 수 없다 — 부모 sha 와 표식으로 나중에 확정한다 */
          commitSha: '', baseSha: base, files: paths
        };
        items.push(entry);
        var payload = files.slice();
        payload.push({ path: CP_PATH, content: JSON.stringify(items, null, 2) + '\n' });
        return commitWithRetry({
          message: '시점 저장: ' + name + ' ' + marker(id) + (paths.length ? ' — 파일 ' + paths.length + '개' : ''),
          files: payload,
          author: author,
          baseSha: base || undefined
        }, files.length === 0, function (headSha) {
          /* 충돌 재시도: 매니페스트를 다시 읽어 항목을 얹는다 */
          return Y.net.checkpoints().then(function (r2) {
            var again = (r2 && r2.items) || [];
            if (!Array.isArray(again)) again = [];
            again.push(entry);
            return {
              message: '시점 저장: ' + name + ' ' + marker(id),
              files: [{ path: CP_PATH, content: JSON.stringify(again, null, 2) + '\n' }],
              author: author,
              baseSha: headSha || undefined
            };
          });
        }).then(function (res) {
          var sha = res && res.commit && res.commit.sha;
          if (Y.engine && Y.engine.setHeadSha) Y.engine.setHeadSha(res && res.headSha);
          state.form.name = '';
          state.form.note = '';
          var after = sha ? rememberSha(id, sha) : Promise.resolve();
          return after.then(function () { return clearDrafts(paths, sha); });
        });
      });
    }).then(function () {
      stop();
      Y.toast('시점 「' + name + '」을 저장했습니다.');
      return refresh().then(function () { return true; });
    }, function (e) {
      stop();
      var m = errMsg(e);
      if (e && e.status === 409) m = '다른 사람이 먼저 게시했습니다. 새로 고침한 뒤 다시 시도하세요.';
      if (e && e.status === 400 && /경로/.test(m)) m = m + ' (' + CP_PATH + ' 쓰기가 서버에서 허용되어야 합니다)';
      Y.toast('시점 저장 실패 — ' + m, 'error');
      paint();
      return false;
    });
  }

  /** 커밋 1회. 충돌(409)이고 재시도가 안전할 때만 최신 HEAD 기준으로 한 번 더 시도한다. */
  function commitWithRetry(opts, retryOk, rebuild) {
    return Y.net.commit(opts).catch(function (e) {
      var head = e && e.data && e.data.headSha;
      if (!retryOk || !e || e.status !== 409 || !head) throw e;
      return rebuild(head).then(function (next) { return Y.net.commit(next); });
    });
  }

  /** 게시된 경로의 초안을 정리한다(현재 버퍼는 engine 이 기준선을 갱신한다). */
  function clearDrafts(paths, sha) {
    var cur = Y.engine && Y.engine.path && Y.engine.path();
    var jobs = [];
    for (var i = 0; i < paths.length; i++) {
      if (cur && paths[i] === cur) continue;
      jobs.push(Y.store.del('drafts', paths[i]));
    }
    if (cur && paths.indexOf(cur) >= 0 && Y.engine.markPublished) jobs.push(Y.engine.markPublished(sha));
    return Promise.all(jobs).catch(function () {});
  }

  /* ── 2-a. 현재와 비교 ── */
  function compare(id) {
    var it = itemById(id);
    if (!it) { Y.toast('시점을 찾을 수 없습니다.', 'error'); return Promise.resolve(); }
    var sha = shaOf(it);
    if (!sha) { Y.toast('이 시점의 커밋을 찾을 수 없어 비교할 수 없습니다.', 'error'); return Promise.resolve(); }
    var path = (Y.engine && Y.engine.path && Y.engine.path()) || U.pagePath();
    var stop = busy('예전 본을 불러옵니다…');

    var curSrc = Y.engine && Y.engine.src && Y.engine.src();
    var curP = (typeof curSrc === 'string')
      ? Promise.resolve({ content: curSrc, dirty: !!(Y.engine.dirty && Y.engine.dirty()) })
      : Y.net.read(path).then(function (r) { return { content: r.content, dirty: false }; });

    return Promise.all([Y.net.read(path, sha), curP]).then(function (a) {
      stop();
      showCompare(path, it, a[0].content, a[1].content, a[1].dirty);
      return true;
    }, function (e) {
      stop();
      var m = errMsg(e);
      if (e && e.status === 404) m = '그 시점에는 ' + path + ' 파일이 없었습니다.';
      Y.toast('비교 실패 — ' + m, 'error');
      return false;
    });
  }

  /* ── 2-a-2. 비교 화면 (사람이 읽는 변경 목록) ──
     코드 diff 는 조교 사용자가 읽을 수 없다. 기본은 "무엇이 어디서 어떻게 바뀌었나"
     카드 목록이고, 원문 코드는 접힌 「개발자용」 영역에 둔다. */

  var TYPE_TAG = {
    text: { t: '글', c: 'is-text' }, style: { t: '모양', c: 'is-style' },
    attr: { t: '링크', c: 'is-attr' }, add: { t: '추가', c: 'is-add' },
    del: { t: '삭제', c: 'is-del' }, 'data-add': { t: '새 글', c: 'is-add' },
    'data-del': { t: '글 삭제', c: 'is-del' }, 'data-edit': { t: '목록', c: 'is-text' },
    i18n: { t: '영어', c: 'is-i18n' }
  };

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (tag === 'button') n.type = 'button';
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    n.setAttribute(Y.config.uiAttr, '');
    return n;
  }

  /** 변경 1건 카드 */
  function changeCard(ch, canJump, onJump) {
    var card = el('div', 'ys-ch');
    var head = el('div', 'ys-ch-h');
    var meta = TYPE_TAG[ch.type] || { t: '변경', c: '' };
    head.appendChild(el('span', 'ys-ch-tag ' + meta.c, meta.t));
    head.appendChild(el('b', 'ys-ch-what', ch.label));
    head.appendChild(el('span', 'ys-ch-where', ch.where || ''));
    card.appendChild(head);

    if (ch.before) {
      var b = el('div', 'ys-ch-row is-before');
      b.appendChild(el('span', 'ys-ch-k', '이전'));
      b.appendChild(el('span', 'ys-ch-v', ch.before));
      card.appendChild(b);
    }
    if (ch.after) {
      var f = el('div', 'ys-ch-row is-after');
      f.appendChild(el('span', 'ys-ch-k', '지금'));
      f.appendChild(el('span', 'ys-ch-v', ch.after));
      card.appendChild(f);
    }
    if (canJump && ch.idxNew != null) {
      var go = el('button', 'ys-btn ys-btn-sm ys-ch-go', '화면에서 보기');
      go.addEventListener('click', function () { onJump(ch.idxNew); });
      card.appendChild(go);
    }
    return card;
  }

  /** 옛 판본을 그대로 렌더해 보여 준다(같은 오리진 iframe · 스튜디오는 프레임에서 스스로 멈춘다). */
  function pastFrame(srcHtml) {
    var wrap = el('div', 'ys-ch-past');
    var f = document.createElement('iframe');
    f.setAttribute(Y.config.uiAttr, '');
    f.className = 'ys-ch-frame';
    f.setAttribute('title', '이 시점의 화면');
    f.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    f.srcdoc = srcHtml;
    wrap.appendChild(f);
    return wrap;
  }

  function showCompare(path, it, oldSrc, newSrc, dirty) {
    var res = (Y.changes && Y.changes.of) ? Y.changes.of(path, oldSrc, newSrc) : { ok: false, list: [] };
    var curPath = (Y.engine && Y.engine.path && Y.engine.path()) || '';
    var canJump = !!(curPath && curPath === path && Y.hud && Y.hud.select && Y.engine.mapped && Y.engine.mapped());
    var modalApi = null;

    var body = el('div', 'ys-cmp');
    var head = el('div', 'ys-cmp-head');
    head.appendChild(el('b', null, '「' + (it.name || '이름 없음') + '」'));
    head.appendChild(el('span', 'ys-cmp-dim',
      (it.ts ? U.fmtTime(it.ts) : '시각 미기록') + ' 시점  →  지금' + (dirty ? ' (미저장 초안 포함)' : '')));
    body.appendChild(head);

    var sum = el('p', 'ys-cmp-sum',
      res.ok ? (Y.changes.summarize(res.list)) : (res.reason || '항목별 비교를 할 수 없습니다.'));
    body.appendChild(sum);

    if (res.ok && res.list.length) {
      var CAP = 60;                                   // 복원 직후처럼 변경이 수백 건일 수 있다
      var list = el('div', 'ys-ch-list');
      var shownN = Math.min(CAP, res.list.length);
      for (var i = 0; i < shownN; i++) {
        list.appendChild(changeCard(res.list[i], canJump, function (idx) {
          if (modalApi) modalApi.close();
          try { Y.hud.select(idx); Y.hud.openPanel('inspect'); } catch (e) {}
        }));
      }
      body.appendChild(list);
      if (res.list.length > CAP) {
        body.appendChild(el('p', 'ys-hint',
          '변경이 많아 ' + CAP + '건만 보여 드립니다 (전체 ' + res.list.length + '건). 나머지는 아래 원문 비교에서 볼 수 있습니다.'));
      }
      if (!canJump) {
        body.appendChild(el('p', 'ys-hint',
          '「화면에서 보기」는 지금 열려 있는 페이지(' + (curPath || '없음') + ')와 같은 파일일 때만 쓸 수 있습니다.'));
      }
    } else if (res.ok) {
      body.appendChild(el('p', 'ys-hint', '이 파일은 그 시점과 똑같습니다.'));
    }

    /* 옛 화면 보기 — HTML 일 때만 */
    if (/\.html?$/i.test(path)) {
      var toggle = el('button', 'ys-btn ys-btn-sm', '이 시점 화면 그대로 보기');
      var slot = el('div', null);
      var shown = false;
      toggle.addEventListener('click', function () {
        shown = !shown;
        toggle.textContent = shown ? '이 시점 화면 접기' : '이 시점 화면 그대로 보기';
        slot.innerHTML = '';
        if (shown) slot.appendChild(pastFrame(oldSrc));
      });
      body.appendChild(toggle);
      body.appendChild(slot);
    }

    /* 개발자용 원문 비교 — 접어 둔다 */
    var det = document.createElement('details');
    det.className = 'ys-cmp-raw';
    det.setAttribute(Y.config.uiAttr, '');
    var sm = document.createElement('summary');
    sm.textContent = '원문 코드로 비교 (개발자용)';
    det.appendChild(sm);
    var built = false;
    det.addEventListener('toggle', function () {
      if (!det.open || built) return;
      built = true;
      var rows = Y.diff.lines(oldSrc, newSrc);
      var s = Y.diff.summary(rows);
      det.appendChild(el('p', 'ys-cmp-sum', '추가 ' + s.add + '줄 · 삭제 ' + s.del + '줄'));
      det.appendChild(Y.diff.render(rows, { context: 2 }));
    });
    body.appendChild(det);

    if (Y.hud && Y.hud.modal) {
      modalApi = Y.hud.modal({ title: '시점 비교 · ' + path, body: body, okLabel: '닫기', cancelLabel: null, wide: true });
    }
  }

  /* ── 2-b. 복원 ── */
  function restore(id) {
    var it = itemById(id);
    if (!it) { Y.toast('시점을 찾을 수 없습니다.', 'error'); return Promise.resolve(); }
    var sha = shaOf(it);
    if (!sha) { Y.toast('이 시점의 커밋을 찾을 수 없어 복원할 수 없습니다.', 'error'); return Promise.resolve(); }

    return dirtyDrafts().then(function (drafts) {
      state.drafts = drafts;
      var warn = drafts.length
        ? '주의: 미저장 초안 ' + drafts.length + '개(' + drafts.map(function (d) { return d.path; }).join(', ') +
          ')가 있습니다. 복원하면 이 초안은 버려집니다.\n\n'
        : '';
      var msg = warn +
        '「' + (it.name || '이름 없음') + '」 시점(' + (it.ts ? U.fmtTime(it.ts) : '시각 미기록') + ')으로 되돌립니다.\n' +
        '텍스트 파일(html·css·js·json)만 그 시점 내용으로 커밋 1개에 되돌립니다. 이미지 등 바이너리 자산은 바뀌지 않습니다.\n\n' +
        '계속할까요?';
      return ask(msg).then(function (ok) {
        if (!ok) return false;
        return doRestore(it, sha);
      });
    });
  }

  function doRestore(it, sha) {
    var stop = busy('복원 대상 파일을 확인합니다…');
    return Y.net.list().then(function (l) {
      var current = {}, paths = [], i, p;
      var pool = ((l && l.pages) || []).concat((l && l.assets) || []);
      for (i = 0; i < pool.length; i++) {
        p = pool[i] && pool[i].path;
        if (!p || p === CP_PATH || !TEXT_EXT.test(p)) continue;
        if (!current[p]) { current[p] = true; paths.push(p); }
      }
      /* 그 시점에는 있었지만 지금 목록에 없는 파일(삭제된 파일)도 되살린다 */
      var was = (it.files || []);
      for (i = 0; i < was.length; i++) {
        p = was[i];
        if (!p || p === CP_PATH || !TEXT_EXT.test(p) || current[p]) continue;
        current[p] = false;
        paths.push(p);
      }
      if (!paths.length) throw new Error('복원할 텍스트 파일을 찾지 못했습니다.');
      stop();
      stop = busy('그 시점의 파일을 읽습니다… (0/' + paths.length + ')');
      var files = [], deletions = [], n = 0;

      function step() {
        if (n >= paths.length) return Promise.resolve();
        var path = paths[n];
        return Y.net.read(path, sha).then(function (r) {
          files.push({ path: path, content: r.content });
        }, function (e) {
          if (e && e.status === 404) {
            /* 그 시점에 없던 파일 — 지금 있으면 지운다 */
            if (current[path]) deletions.push(path);
            return;
          }
          throw e;
        }).then(function () {
          n++;
          stop();
          stop = busy('그 시점의 파일을 읽습니다… (' + n + '/' + paths.length + ')');
          return step();
        });
      }

      return step().then(function () {
        if (!files.length && !deletions.length) throw new Error('되돌릴 내용이 없습니다.');
        stop();
        stop = busy('복원 커밋을 만듭니다…');
        return Y.net.commit({
          message: '시점 복원: ' + (it.name || it.id) + ' [ys-cp-restore:' + it.id + '] (' + (sha || '').slice(0, 7) + ')',
          files: files,
          deletions: deletions,
          author: Y.session.author(),
          baseSha: (Y.engine && Y.engine.headSha && Y.engine.headSha()) || undefined
        }).then(function (res) {
          if (Y.engine && Y.engine.setHeadSha) Y.engine.setHeadSha(res && res.headSha);
          /* 초안은 전부 낡았다 — 지우고 화면을 다시 불러온다 */
          return Y.store.clear('drafts').catch(function () {}).then(function () { return res; });
        });
      });
    }).then(function (res) {
      stop();
      var cnt = (res && res.files && res.files.length) || 0;
      Y.toast('「' + (it.name || it.id) + '」 시점으로 복원했습니다' + (cnt ? ' (파일 ' + cnt + '개)' : '') + '. 화면을 다시 불러옵니다…');
      setTimeout(function () { try { location.reload(); } catch (e) {} }, 1400);
      return true;
    }, function (e) {
      stop();
      var m = errMsg(e);
      if (e && e.status === 409) m = '그 사이 다른 사람이 게시했습니다. 새로 고침한 뒤 다시 시도하세요.';
      Y.toast('복원 실패 — ' + m, 'error');
      return false;
    });
  }

  /* ── HUD 패널 등록 (hud.js 로드 순서를 기다린다) ── */
  var registered = false, tries = 0;
  function register() {
    if (registered) return true;
    if (!Y.hud || !Y.hud.registerPanel) return false;
    Y.hud.registerPanel({
      id: 'versions',
      title: '버전 관리',
      icon: '↺',
      order: 20,
      render: function (hostEl) { state.host = hostEl; paint(); },
      onOpen: function () { refresh(); },
      onClose: function () {}
    });
    registered = true;
    return true;
  }
  function tryRegister() {
    if (register()) return;
    if (tries++ > 80) return;                 // 약 8초까지만 기다린다
    setTimeout(tryRegister, 100);
  }
  tryRegister();

  /* 초안 상태가 바뀌면 "함께 게시될 파일" 안내를 갱신한다.
     단, 사용자가 이 패널의 입력란에 있는 동안에는 다시 그리지 않는다(포커스 보호). */
  Y.bus.on('draft:change', function () {
    if (!state.host || !Y.hud || !Y.hud.isOpen || !Y.hud.isOpen('versions')) return;
    var a = document.activeElement;
    if (a && state.host.contains && state.host.contains(a)) return;
    dirtyDrafts().then(function (d) { state.drafts = d; paint(); });
  });

  Y.versions = {
    register: register,
    refresh: refresh,
    save: save,
    compare: compare,
    restore: restore,
    items: function () { return state.items || []; },
    shaOf: shaOf,
    CP_PATH: CP_PATH
  };
})();
