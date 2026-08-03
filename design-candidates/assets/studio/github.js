/* YSME In-Place Studio — 깃헙 관리 패널

   「게시」가 어느 저장소·브랜치로 커밋되는지 보여 주고, 연결 상태를 그 자리에서
   다시 확인한다. 저장소를 바꾸는 일은 서버 환경변수(GH_OWNER·GH_REPO·GH_BRANCH·
   GH_TOKEN)의 몫이라 여기서는 안내만 한다 — 토큰은 브라우저로 절대 내려오지 않는다.

   「연결 다시 확인」은 서버의 최신 커밋(headSha)으로 게시 기준점도 함께 맞춘다.
   충돌 안내가 반복될 때 새로고침 없이 푸는 손잡이다. */
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.github) return;
  var U = Y.util;

  var STYLE_ID = 'ys-gh-style';
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
      '.ys-gh-hist{display:flex;flex-direction:column}',
      '.ys-gh-c{display:flex;flex-direction:column;gap:.12rem;padding:.4rem .1rem;border-top:1px solid var(--ys-line)}',
      '.ys-gh-c-m{font-size:.76rem;line-height:1.45;color:var(--ys-ink);overflow:hidden;text-overflow:ellipsis;',
      'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
      '.ys-gh-c-i{font-size:.68rem;color:var(--ys-dim);display:flex;gap:.4rem;align-items:baseline;flex-wrap:wrap}',
      '.ys-gh-c-i a{color:var(--ys-muted)}',
      '.ys-gh-rv{margin-left:auto;font-size:.66rem;border:1px solid var(--ys-line);background:#fff;',
      'color:#b3261e;border-radius:6px;padding:.14rem .4rem;cursor:pointer}',
      '.ys-gh-rv:hover{background:#fdeceb}',
      '.ys-gh-form{display:flex;flex-direction:column;gap:.55rem;border:1px solid var(--ys-line);',
      'border-radius:10px;padding:.7rem .75rem}',
      '.ys-gh-f{display:flex;flex-direction:column;gap:.22rem}',
      '.ys-gh-f>span{font-size:.7rem;font-weight:700;color:var(--ys-muted)}',
      '.ys-gh-f em{font-style:normal;font-weight:400;color:var(--ys-dim)}'
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

  function refresh(root) {
    return Y.net.auth().then(function (r) {
      info = r || {};
      paint(root);
      return loadHist(root);
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
      var na = mk('span', null, '이름 표시는 서버 갱신 뒤 지원됩니다');
      row(card, '저장소', na);
    }
    row(card, '브랜치', mk('span', null, (info.branch || 'main') + (info.basePath ? ' · 폴더 ' + info.basePath : '')));
    row(card, '설정 출처', mk('span', null,
      info.source === 'custom' ? '관리 화면에서 직접 설정' : '서버 환경변수(기본)'));
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
        paint(root);
        loadHist(root);
      }, function (err) {
        chk.disabled = false;
        Y.toast('연결 확인 실패 — ' + ((err && err.message) || '알 수 없는 오류'), 'error');
      });
    });
    act.appendChild(chk);
    if (repoUrl) {
      var open = mk('button', 'ys-act', '커밋 이력 열기 ↗');
      open.addEventListener('click', function () {
        var w = window.open(repoUrl + '/commits/' + encodeURIComponent(info.branch || 'main'), '_blank', 'noopener');
        if (w) w.opener = null;
      });
      act.appendChild(open);
    }
    root.appendChild(act);

    var lh = mk('h4', 'ys-sec-t', '최근 커밋');
    lh.setAttribute('data-gh-hist-h', '');
    root.appendChild(lh);
    var hist = mk('div', 'ys-gh-hist');
    hist.setAttribute('data-gh-hist', '');
    hist.appendChild(mk('p', 'ys-hint', '이력을 불러오는 중…'));
    root.appendChild(hist);

    /* ── 연결 바꾸기 — 인수인계 뒤 학부가 자기 저장소로 게시하게 하는 자리 ── */
    root.appendChild(mk('h4', 'ys-sec-t', '연결 바꾸기'));
    if (info.canStore) {
      buildSwitchForm(root);
    } else {
      root.appendChild(mk('p', 'ys-note',
        '화면에서 바꾸려면 서버에 Upstash Redis(설정 저장소)가 연결되어 있어야 합니다. ' +
        '지금은 Vercel 환경변수 GH_OWNER · GH_REPO · GH_BRANCH · GH_TOKEN 을 바꾸고 Redeploy 하세요.'));
    }
    root.appendChild(mk('p', 'ys-note',
      '쓰기 토큰은 서버에만 저장되고 브라우저에는 절대 내려오지 않습니다. ' +
      '새 저장소로 바꾼 뒤에는 그 저장소를 Vercel 프로젝트에 연결해야 사이트가 자동 배포됩니다.'));
  }

  function buildSwitchForm(root) {
    var open = mk('button', 'ys-act', '다른 저장소로 바꾸기…');
    root.appendChild(open);
    var form = mk('div', 'ys-gh-form');
    form.style.display = 'none';
    open.addEventListener('click', function () {
      var on = form.style.display === 'none';
      form.style.display = on ? '' : 'none';
      open.textContent = on ? '접기' : '다른 저장소로 바꾸기…';
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
    var curOwner = (info.repo || '/').split('/')[0], curRepo = (info.repo || '/').split('/')[1] || '';
    var fOwner = field('소유자(owner)', '깃헙 계정 또는 조직 이름', 'text', curOwner);
    var fRepo = field('저장소 이름', null, 'text', curRepo);
    var fBranch = field('브랜치', null, 'text', info.branch || 'main');
    var fBase = field('사이트 폴더', '저장소 안에서 사이트가 있는 폴더. 저장소 뿌리면 비웁니다.', 'text', info.basePath || '');
    var fToken = field('쓰기 토큰', 'Fine-grained PAT, Contents Read/Write. 비우면 기존 토큰 그대로.', 'password', '', '비우면 기존 토큰 사용');

    var act = mk('div', 'ys-gh-act');
    var save = mk('button', 'ys-act is-pri', '바꾸고 연결 확인');
    save.addEventListener('click', function () {
      var o = fOwner.value.trim(), rp = fRepo.value.trim();
      if (!o || !rp) { Y.toast('소유자와 저장소 이름을 입력하세요.', 'warn'); return; }
      Y.hud.confirm('게시 대상을 ' + o + '/' + rp + ' 로 바꿉니다. 다음 「게시」부터 그 저장소에 커밋됩니다. 계속할까요?')
        .then(function (ok) {
          if (!ok) return;
          save.disabled = true;
          Y.net.call('ghset', {
            owner: o, repo: rp,
            branch: fBranch.value.trim() || 'main',
            basePath: fBase.value.trim(),
            token: fToken.value.trim() || undefined
          }).then(function (r) {
            save.disabled = false;
            fToken.value = '';
            info = Object.assign({}, info, r || {});
            if (r && r.headSha && Y.engine) Y.engine.setHeadSha(r.headSha);
            Y.toast('연결을 바꿨습니다 — 이제 게시가 ' + (r && r.repo) + ' 저장소로 커밋됩니다.');
            var rootEl = host && host.querySelector('.ys-gh');
            if (rootEl) { paint(rootEl); loadHist(rootEl); }
          }, function (err) {
            save.disabled = false;
            Y.toast((err && err.message) || '연결을 바꾸지 못했습니다.', 'error', 6500);
          });
        });
    });
    act.appendChild(save);

    if (info.source === 'custom') {
      var reset = mk('button', 'ys-act', '기본(환경변수)으로 되돌리기');
      reset.addEventListener('click', function () {
        Y.hud.confirm('직접 설정을 지우고 서버 환경변수의 저장소로 되돌립니다. 계속할까요?').then(function (ok) {
          if (!ok) return;
          reset.disabled = true;
          Y.net.call('ghreset', {}).then(function () {
            reset.disabled = false;
            Y.toast('기본 연결로 되돌렸습니다.');
            var rootEl = host && host.querySelector('.ys-gh');
            if (rootEl) refresh(rootEl);
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

  function loadHist(rootEl) {
    Y.net.history(null, 14).then(function (h) {
      paintHistory(rootEl, (h && h.commits) || []);
    }, function () { paintHistory(rootEl, null); });
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
    for (var i = 0; i < rows.length; i++) {
      (function (c) {
        var el = mk('div', 'ys-gh-c');
        el.appendChild(mk('span', 'ys-gh-c-m', firstLine(c.message)));
        var meta = mk('span', 'ys-gh-c-i');
        var when = '';
        if (c.date) { try { when = U.ago(new Date(c.date).getTime()); } catch (e) { when = ''; } }
        meta.appendChild(d().createTextNode([c.author || '', when].filter(Boolean).join(' · ')));
        if (c.html_url) meta.appendChild(ext(c.html_url, '보기 ↗', ''));
        if (c.sha) {
          var rv = mk('button', 'ys-gh-rv', '이 게시 되돌리기');
          rv.addEventListener('click', function () { revertCommit(c); });
          meta.appendChild(rv);
        }
        el.appendChild(meta);
        hist.appendChild(el);
      })(rows[i]);
    }
  }

  /* ── 게시 취소 — 그 커밋이 바꾼 파일을 직전 상태로 되돌리는 새 커밋 ── */
  function revertCommit(c) {
    Y.hud.confirm(
      '「' + firstLine(c.message) + '」 게시를 취소합니다.\n\n' +
      '이 게시가 바꾼 파일을 게시 직전 상태로 되돌리는 새 커밋을 만듭니다. ' +
      '이후 게시에서 같은 파일을 또 고쳤다면 그 변경도 함께 되돌아갑니다. ' +
      '미저장 초안은 버려집니다. 계속할까요?'
    ).then(function (ok) {
      if (!ok) return;
      var stop = Y.hud.busy('게시를 취소하는 중…');
      Y.net.call('revert', {
        sha: c.sha,
        baseSha: (Y.engine && Y.engine.headSha && Y.engine.headSha()) || undefined,
        author: Y.session.author()
      }).then(function (r) {
        stop();
        if (r && r.headSha && Y.engine) Y.engine.setHeadSha(r.headSha);
        var n = (r && r.files && r.files.length) || 0;
        Y.toast('게시를 취소했습니다' + (n ? ' (파일 ' + n + '개 되돌림)' : '') + '. 화면을 다시 불러옵니다…');
        var wipe = Y.store && Y.store.clear ? Y.store.clear('drafts').catch(function () {}) : Promise.resolve();
        wipe.then(function () {
          setTimeout(function () { try { location.reload(); } catch (e) {} }, 1200);
        });
      }, function (err) {
        stop();
        Y.toast((err && err.message) || '게시를 취소하지 못했습니다.', 'error', 6500);
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
        /* 열 때마다 최신 상태로 — 이미 그려져 있으면 조용히 갱신 */
        var r = host && host.querySelector('.ys-gh');
        if (r && info) refresh(r);
      }
    });
  }
  registerPanel();

  Y.github = { refresh: function () { var r = host && host.querySelector('.ys-gh'); return r ? refresh(r) : Promise.resolve(); } };
})();
