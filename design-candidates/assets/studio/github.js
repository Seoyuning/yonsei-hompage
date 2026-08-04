/* YSME In-Place Studio — 깃헙 관리 패널

   「게시」가 어느 저장소·브랜치로 커밋되는지 보여 주고, 그 자리에서 관리한다.
     · 연결 카드 — 지금 게시가 가는 곳 + 연결 다시 확인(게시 기준점 재동기)
     · 최근 커밋 — 게시 이력. 「이 게시 되돌리기」(revert)로 게시 취소.
       취소 기록(게시 취소: …)과 이미 취소된 게시는 표식으로 구분한다.
     · 깃헙 연결 변경 — 폼에 현재 값이 채워져 있고, 검증에 성공하면 즉시 전환된다
       (서버 ghadd use:true 재사용 — 같은 저장소로 다시 바꾸면 저장해 둔 토큰이 살아난다).
       기본(환경변수)으로 되돌리기는 ghreset. 토큰은 서버에만 남고
       브라우저로는 절대 내려오지 않는다(tokenSet 불리언만 온다). */
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.github) return;
  var U = Y.util;

  var STYLE_ID = 'ys-gh-style';
  var CANCEL_RE = /^게시 취소: /;
  var host = null, info = null;

  function d() { return (host && host.ownerDocument) || document; }
  function mk(tag, cls, txt) {
    var n = d().createElement(tag);
    if (tag === 'button') n.type = 'button';
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function ext(href, txt, cls) {
    var a = d().createElement('a');
    a.className = cls || 'ys-gh-lnk';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = txt;
    return a;
  }

  function ensureStyle() {
    var doc = d();
    if (doc.getElementById(STYLE_ID)) return;
    var css = [
      '.ys-gh{display:flex;flex-direction:column;gap:.7rem}',
      '.ys-gh-card{border:1px solid var(--ys-line);border-radius:10px;padding:.7rem .8rem;',
      'display:flex;flex-direction:column;gap:.44rem;background:var(--ys-tint)}',
      '.ys-gh-row{display:flex;align-items:baseline;gap:.5rem;font-size:.78rem;min-width:0}',
      '.ys-gh-row>b{flex:0 0 4.2rem;font-size:.7rem;font-weight:700;color:var(--ys-muted)}',
      '.ys-gh-row>span{color:var(--ys-ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.ys-gh-lnk{color:var(--ys-navy);font-weight:700;text-decoration:none}',
      '.ys-gh-lnk:hover{text-decoration:underline}',
      '.ys-gh-sha{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.74rem}',
      '.ys-gh-act{display:flex;gap:.4rem;flex-wrap:wrap}',
      /* 최근 커밋 */
      '.ys-gh-hist{display:flex;flex-direction:column}',
      '.ys-gh-c{display:flex;flex-direction:column;gap:.12rem;padding:.4rem .1rem;border-top:1px solid var(--ys-line)}',
      '.ys-gh-c-m{font-size:.76rem;line-height:1.45;color:var(--ys-ink);overflow:hidden;text-overflow:ellipsis;',
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
      '.ys-gh-c.is-undone .ys-gh-c-m{color:var(--ys-dim);text-decoration:line-through}',
      '.ys-gh-c-i{font-size:.68rem;color:var(--ys-dim);display:flex;gap:.4rem;align-items:baseline;flex-wrap:wrap}',
      '.ys-gh-c-i a{color:var(--ys-muted)}',
      '.ys-gh-tag{display:inline-block;flex:none;font-size:.6rem;font-weight:700;border-radius:999px;',
      'padding:.06rem .38rem;margin-right:.3rem;background:#eef1f6;color:var(--ys-muted);vertical-align:.08em}',
      '.ys-gh-tag.is-cancel{background:#fff4e5;color:#8a5b00}',
      '.ys-gh-tag.is-undone{background:#fdeceb;color:#b3261e}',
      '.ys-gh-rv{margin-left:auto;font-size:.66rem;border:1px solid var(--ys-line);background:#fff;',
      'color:#b3261e;border-radius:6px;padding:.14rem .4rem;cursor:pointer}',
      '.ys-gh-rv:hover{background:#fdeceb}',
      '.ys-gh-rv.is-redo{color:#0d5c3a}',
      '.ys-gh-rv.is-redo:hover{background:#e8f5ee}',
      /* 연결 변경 폼 */
      '.ys-gh-form{display:flex;flex-direction:column;gap:.55rem;border:1px solid var(--ys-line);',
      'border-radius:10px;padding:.7rem .75rem}',
      '.ys-gh-f{display:flex;flex-direction:column;gap:.22rem}',
      '.ys-gh-f>span{font-size:.7rem;font-weight:700;color:var(--ys-muted)}',
      '.ys-gh-f em{font-style:normal;font-weight:400;color:var(--ys-dim)}',
      '.ys-gh-urlnote{font-size:.68rem;line-height:1.5;color:var(--ys-muted)}',
      '.ys-gh-urlnote.is-ok{color:#0d5c3a}',
      '.ys-gh-urlnote.is-bad{color:#b3261e}'
    ].join('');
    var st = doc.createElement('style');
    st.id = STYLE_ID;
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = css;
    (doc.head || doc.documentElement).appendChild(st);
  }

  function row(box, label, valueNode) {
    var r = mk('div', 'ys-gh-row');
    r.appendChild(mk('b', null, label));
    r.appendChild(valueNode);
    box.appendChild(r);
  }

  function firstLine(msg) {
    var s = String(msg || '').split('\n')[0];
    return s.length > 90 ? s.slice(0, 90) + '…' : s;
  }

  function render(hostEl) {
    host = hostEl;
    ensureStyle();
    hostEl.innerHTML = '';
    var root = mk('div', 'ys-gh');
    root.setAttribute(Y.config.uiAttr, '');
    hostEl.appendChild(root);
    root.appendChild(mk('p', 'ys-hint', '저장소 연결을 확인하는 중…'));
    refresh(root);
  }

  function rootEl() { return host && host.querySelector('.ys-gh'); }

  function refresh(root) {
    return Y.net.auth().then(function (r) {
      info = r || {};
      paint(root);
      loadHist(root);
    }, function (err) {
      root.innerHTML = '';
      root.appendChild(mk('p', 'ys-warn',
        '저장소에 연결하지 못했습니다 — ' + ((err && err.message) || '알 수 없는 오류')));
      root.appendChild(mk('p', 'ys-note',
        '게시 서버 환경변수(GH_TOKEN·GH_OWNER·GH_REPO·PUBLISH_PASSCODE)가 모두 있어야 연결됩니다. ' +
        'Vercel 프로젝트 설정에서 확인하세요.'));
    });
  }

  function paint(root) {
    root.innerHTML = '';

    root.appendChild(mk('p', 'ys-hint',
      '등록한 공지·수정한 화면은 「게시」를 누르는 순간 아래 저장소에 커밋 1개로 올라가고, ' +
      '그 커밋이 자동 배포되어 사이트에 반영됩니다.'));

    var card = mk('div', 'ys-gh-card');
    var repoName = info.repo || null;
    var repoUrl = info.repoUrl || (repoName ? 'https://github.com/' + repoName : null);
    if (repoName && repoUrl) {
      row(card, '저장소', ext(repoUrl, repoName + ' ↗'));
    } else {
      row(card, '저장소', mk('span', null, '이름 표시는 서버 갱신 뒤 지원됩니다'));
    }
    row(card, '브랜치', mk('span', null, (info.branch || 'main') + (info.basePath ? ' · 폴더 ' + info.basePath : '')));
    row(card, '설정 출처', mk('span', null,
      info.source === 'custom' ? '관리 화면에서 고른 연결' : '서버 환경변수(기본)'));
    var shaBox = mk('span', 'ys-gh-sha');
    var sha = info.headSha || '';
    if (sha && repoUrl) shaBox.appendChild(ext(repoUrl + '/commit/' + sha, sha.slice(0, 7)));
    else shaBox.textContent = sha ? sha.slice(0, 7) : '—';
    row(card, '최신 커밋', shaBox);
    root.appendChild(card);

    var act = mk('div', 'ys-gh-act');
    var chk = mk('button', 'ys-act is-pri', '연결 다시 확인');
    chk.addEventListener('click', function () {
      chk.disabled = true;
      Y.net.auth().then(function (r) {
        chk.disabled = false;
        info = r || {};
        if (info.headSha && Y.engine) Y.engine.setHeadSha(info.headSha);
        Y.toast('연결 정상 — 게시 기준점을 최신 커밋 ' + String(info.headSha || '').slice(0, 7) + ' 로 맞췄습니다.');
        var root2 = rootEl();
        if (root2) { paint(root2); loadHist(root2); }
      }, function (err) {
        chk.disabled = false;
        Y.toast('연결 확인 실패 — ' + ((err && err.message) || '알 수 없는 오류'), 'error');
      });
    });
    act.appendChild(chk);
    /* 연결 변경은 위쪽 버튼 줄에서 연다 — 폼에는 지금 값이 미리 채워져 있다 */
    var changeBtn = mk('button', 'ys-act', '깃헙 연결 변경…');
    act.appendChild(changeBtn);
    if (repoUrl) {
      var open = mk('button', 'ys-act', '커밋 이력 열기 ↗');
      open.addEventListener('click', function () {
        var w = window.open(repoUrl + '/commits/' + encodeURIComponent(info.branch || 'main'), '_blank', 'noopener');
        if (w) w.opener = null;
      });
      act.appendChild(open);
    }
    root.appendChild(act);

    buildChangeForm(root, changeBtn);

    root.appendChild(mk('h4', 'ys-sec-t', '최근 커밋'));
    var hist = mk('div', 'ys-gh-hist');
    hist.setAttribute('data-gh-hist', '');
    hist.appendChild(mk('p', 'ys-hint', '이력을 불러오는 중…'));
    root.appendChild(hist);

    root.appendChild(mk('p', 'ys-note',
      '쓰기 토큰은 서버에만 저장되고 브라우저에는 절대 내려오지 않습니다. ' +
      '새 저장소로 바꾼 뒤에는 그 저장소를 Vercel 프로젝트에 연결해야 사이트가 자동 배포됩니다.'));
  }

  /* ── 연결 변경 폼 — 여는 버튼(trigger)은 위 버튼 줄에 있다 ──
     지금 연결 값이 미리 채워져 있고, 저장하면 곧바로 그 저장소로 게시가 간다.
     서버는 ghadd(use:true) 를 재사용한다 — 같은 저장소로 다시 바꾸면 그때
     저장해 둔 토큰이 그대로 살아난다(토큰 칸을 비워도 된다). */
  function buildChangeForm(root, trigger) {
    var form = mk('div', 'ys-gh-form');
    form.style.display = 'none';
    trigger.addEventListener('click', function () {
      var on = form.style.display === 'none';
      form.style.display = on ? '' : 'none';
      trigger.classList.toggle('is-pri', on);
      if (on) { try { form.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
    });

    function field(label, hint, type, value, placeholder) {
      var w = mk('div', 'ys-gh-f');
      var s = mk('span', null, label);
      if (hint) s.appendChild(mk('em', null, ' · ' + hint));
      var i = mk('input', 'ys-in');
      i.type = type || 'text';
      i.value = value || '';
      if (placeholder) i.placeholder = placeholder;
      i.autocomplete = type === 'password' ? 'new-password' : 'off';
      i.spellcheck = false;
      w.appendChild(s);
      w.appendChild(i);
      form.appendChild(w);
      return i;
    }
    /* 깃헙 주소 → 아래 칸 자동 채움(사용자 요청: 소유자·저장소를 직접 안 쳐도 되게).
       지원: https://github.com/소유자/저장소[.git][/tree/브랜치[/폴더…]]
             git@github.com:소유자/저장소.git · 소유자/저장소 */
    function parseGhUrl(s) {
      s = String(s || '').trim();
      if (!s) return null;
      var m = s.match(/^git@github\.com:([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i);
      if (m) return { owner: m[1], repo: m[2], branch: '', basePath: '' };
      m = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/(?:tree|blob)\/([^\/?#\s]+)((?:\/[^?#\s]*)?))?\/?(?:[?#].*)?$/i);
      if (m) return { owner: m[1], repo: m[2], branch: m[3] || '', basePath: (m[4] || '').replace(/^\/+|\/+$/g, '') };
      m = s.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
      if (m) return { owner: m[1], repo: m[2], branch: '', basePath: '' };
      return null;
    }
    var curOwner = (info.repo || '/').split('/')[0] || '';
    var curRepo = (info.repo || '/').split('/')[1] || '';
    var fUrl = field('깃헙 주소로 채우기', '저장소 주소를 붙여넣으면 아래 칸이 채워집니다', 'text', '', 'https://github.com/소유자/저장소');
    var urlNote = mk('div', 'ys-gh-urlnote');
    fUrl.parentNode.appendChild(urlNote);
    fUrl.addEventListener('input', function () {
      var v = fUrl.value.trim();
      if (!v) { urlNote.textContent = ''; urlNote.className = 'ys-gh-urlnote'; return; }
      var p = parseGhUrl(v);
      if (!p) {
        urlNote.textContent = '주소를 읽지 못했습니다 — 아래 칸에 직접 적어 주세요.';
        urlNote.className = 'ys-gh-urlnote is-bad';
        return;
      }
      fOwner.value = p.owner; fRepo.value = p.repo;
      if (p.branch) fBranch.value = p.branch;
      if (p.basePath) fBase.value = p.basePath;
      urlNote.textContent = '채웠습니다: ' + p.owner + '/' + p.repo
        + (p.branch ? ' · ' + p.branch : '') + (p.basePath ? ' · ' + p.basePath : '');
      urlNote.className = 'ys-gh-urlnote is-ok';
    });
    var fOwner = field('소유자(owner)', '깃헙 계정 또는 조직 이름', 'text', curOwner);
    var fRepo = field('저장소 이름', null, 'text', curRepo);
    var fBranch = field('브랜치', null, 'text', info.branch || 'main');
    var fBase = field('사이트 폴더', '저장소 안에서 사이트가 있는 폴더. 저장소 뿌리면 비웁니다.', 'text', info.basePath || '');
    var fToken = field('쓰기 토큰', 'Fine-grained PAT, Contents Read/Write. 비우면 이 저장소에 저장된 토큰/기본 토큰 사용.', 'password', '', '비우면 기존 토큰 사용');

    var act = mk('div', 'ys-gh-act');
    var save = mk('button', 'ys-act is-pri', '검증하고 변경');
    save.addEventListener('click', function () {
      var o = fOwner.value.trim(), rp = fRepo.value.trim();
      if (!o || !rp) { Y.toast('소유자와 저장소 이름을 입력하세요.', 'warn'); return; }
      Y.hud.confirm('게시 대상을 ' + o + '/' + rp + ' 로 바꿉니다. 다음 「게시」부터 그 저장소에 커밋됩니다. 계속할까요?')
        .then(function (ok) {
          if (!ok) return;
          save.disabled = true;
          Y.net.call('ghadd', {
            owner: o, repo: rp,
            branch: fBranch.value.trim() || 'main',
            basePath: fBase.value.trim(),
            token: fToken.value.trim() || undefined,
            use: true
          }).then(function (r) {
            save.disabled = false;
            fToken.value = '';
            if (r && r.headSha && Y.engine) Y.engine.setHeadSha(r.headSha);
            Y.toast('연결을 바꿔습니다 — 이제 게시가 ' + o + '/' + rp + ' 로 커밋됩니다.');
            var r2 = rootEl(); if (r2) refresh(r2);
          }, function (err) {
            save.disabled = false;
            Y.toast((err && err.message) || '연결을 바꾸지 못했습니다.', 'error', 6500);
          });
        });
    });
    act.appendChild(save);

    /* 기본(환경변수) 저장소로 되돌리기 — 직접 바꾼 연결을 쓰는 중일 때만 */
    if (info.source === 'custom') {
      var reset = mk('button', 'ys-act', '기본(환경변수) 저장소로 되돌리기');
      reset.addEventListener('click', function () {
        Y.hud.confirm('게시 대상을 서버 환경변수의 기본 저장소로 되돌립니다. 계속할까요?').then(function (ok) {
          if (!ok) return;
          reset.disabled = true;
          Y.net.call('ghreset', {}).then(function () {
            Y.toast('기본 연결로 되돌렸습니다.');
            var r3 = rootEl(); if (r3) refresh(r3);
          }, function (err) {
            reset.disabled = false;
            Y.toast((err && err.message) || '되돌리지 못했습니다.', 'error');
          });
        });
      });
      act.appendChild(reset);
    }
    form.appendChild(act);
    root.appendChild(form);
  }

  /* ── 최근 커밋 ── */
  function loadHist(root) {
    return Y.net.history(null, 14).then(function (h) {
      paintHistory(root, (h && h.commits) || []);
    }, function () { paintHistory(root, null); });
  }

  function paintHistory(root, commits) {
    var hist = root.querySelector('[data-gh-hist]');
    if (!hist) return;
    hist.innerHTML = '';
    if (!commits) {
      hist.appendChild(mk('p', 'ys-hint', '커밋 이력을 불러오지 못했습니다.'));
      return;
    }
    /* 자동배포 트리거 커밋(빈 커밋)은 소음이라 걸러 낸다 */
    var rows = commits.filter(function (c) {
      return String(c.message || '').indexOf('[auto-deploy-trigger]') < 0;
    }).slice(0, 8);
    if (!rows.length) {
      hist.appendChild(mk('p', 'ys-hint', '표시할 커밋이 없습니다.'));
      return;
    }
    /* 「게시 취소: … (sha7, …)」 기록에서 취소된 원 커밋을 알아 둔다 */
    var undone = [];
    for (var u = 0; u < rows.length; u++) {
      var mm = /^게시 취소: .*\(([0-9a-f]{7})/.exec(String(rows[u].message || ''));
      if (mm) undone.push(mm[1]);
    }
    function isUndone(sha) {
      for (var k = 0; k < undone.length; k++) if (String(sha || '').indexOf(undone[k]) === 0) return true;
      return false;
    }

    for (var i = 0; i < rows.length; i++) {
      (function (c) {
        var cancel = CANCEL_RE.test(String(c.message || ''));
        var gone = !cancel && isUndone(c.sha);
        var el = mk('div', 'ys-gh-c' + (gone ? ' is-undone' : ''));
        var m = mk('span', 'ys-gh-c-m');
        if (cancel) m.appendChild(mk('i', 'ys-gh-tag is-cancel', '취소 기록'));
        if (gone) m.appendChild(mk('i', 'ys-gh-tag is-undone', '취소된 게시'));
        m.appendChild(d().createTextNode(firstLine(c.message)));
        el.appendChild(m);
        var meta = mk('span', 'ys-gh-c-i');
        var when = '';
        if (c.date) { try { when = U.ago(new Date(c.date).getTime()); } catch (e) { when = ''; } }
        meta.appendChild(d().createTextNode([c.author || '', when].filter(Boolean).join(' · ')));
        if (c.html_url) meta.appendChild(ext(c.html_url, '보기 ↗', ''));
        /* 취소된 게시에는 버튼을 주지 않는다 — 다시 살리려면 그 「취소 기록」을 되돌린다 */
        if (c.sha && !gone) {
          var rv = mk('button', 'ys-gh-rv' + (cancel ? ' is-redo' : ''),
            cancel ? '취소를 되돌리기(재게시)' : '이 게시 되돌리기');
          rv.addEventListener('click', function () { revertCommit(c, cancel); });
          meta.appendChild(rv);
        }
        el.appendChild(meta);
        hist.appendChild(el);
      })(rows[i]);
    }
  }

  /* ── 게시 취소 — 그 커밋이 바꾼 파일을 직전 상태로 되돌리는 새 커밋 ── */
  function revertCommit(c, isCancel) {
    var ask = isCancel
      ? '「' + firstLine(c.message) + '」 취소 기록을 되돌립니다.\n\n' +
        '취소됐던 게시 내용이 다시 살아납니다(재게시). 미저장 초안은 버려집니다. 계속할까요?'
      : '「' + firstLine(c.message) + '」 게시를 취소합니다.\n\n' +
        '이 게시가 바꾼 파일을 게시 직전 상태로 되돌리는 새 커밋을 만듭니다. ' +
        '이후 게시에서 같은 파일을 또 고쳤다면 그 변경도 함께 되돌아갑니다. ' +
        '미저장 초안은 버려집니다. 계속할까요?';
    Y.hud.confirm(ask).then(function (ok) {
      if (!ok) return;
      var stop = Y.hud.busy(isCancel ? '취소를 되돌리는 중…' : '게시를 취소하는 중…');
      Y.net.call('revert', {
        sha: c.sha,
        baseSha: (Y.engine && Y.engine.headSha && Y.engine.headSha()) || undefined,
        author: Y.session.author()
      }).then(function (r) {
        stop();
        if (r && r.headSha && Y.engine) Y.engine.setHeadSha(r.headSha);
        var n = (r && r.files && r.files.length) || 0;
        Y.toast((isCancel ? '취소를 되돌렸습니다(재게시)' : '게시를 취소했습니다') +
          (n ? ' (파일 ' + n + '개)' : '') + '. 화면을 다시 불러옵니다…');
        var wipe = Y.store && Y.store.clear ? Y.store.clear('drafts').catch(function () {}) : Promise.resolve();
        wipe.then(function () {
          setTimeout(function () { try { location.reload(); } catch (e) {} }, 1200);
        });
      }, function (err) {
        stop();
        Y.toast((err && err.message) || (isCancel ? '취소를 되돌리지 못했습니다.' : '게시를 취소하지 못했습니다.'), 'error', 6500);
      });
    });
  }

  /* ── HUD 등록 ── */
  var tries = 0;
  function registerPanel() {
    if (!Y.hud || !Y.hud.registerPanel) {
      if (tries++ > 60) return;
      setTimeout(registerPanel, 150);
      return;
    }
    Y.hud.registerPanel({
      id: 'github',
      title: '깃헙 관리',
      icon: 'git',
      order: 60,
      render: render,
      onOpen: function () {
        var r = rootEl();
        if (r && info) refresh(r);
      }
    });
  }
  registerPanel();

  Y.github = { refresh: function () { var r = rootEl(); return r ? refresh(r) : Promise.resolve(); } };
})();
