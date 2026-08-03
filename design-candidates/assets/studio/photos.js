/* YSME In-Place Studio — 머리 사진(히어로) 패널

   페이지 맨 위 큰 사진은 HTML 본문이 아니라 각 페이지 <style> 의
   background:url("assets/hero-….jpg") 에 박혀 있어 글 편집으로는 손댈 수 없었다.
   이 패널은 여덟 페이지의 히어로 사진을 한 자리에 모은다.
     ① 새 사진으로 바꾼다 — 브라우저에서 알맞게 줄여(최대 2560px·JPEG) 초안에 담는다.
     ② 세로 초점을 옮긴다 — cover 로 잘리는 사진이 어느 높이를 보여줄지.
     ③ 게시 전에 지금 화면에서 미리 본다(오버레이 스타일 — 원문은 건드리지 않는다).

   저장 모델은 글 편집과 같다: 모든 변경은 초안(IndexedDB)에 쌓이고 「게시」 한 번에
   커밋 1개로 나간다.
     · 사진 파일 — 초안 레코드에 base64 로 담는다. hud/versions 가 encoding 을 서버로
       넘기고, 서버(publish.js)가 base64 blob 커밋을 이미 지원한다.
     · 파일 이름은 그대로 두고 내용만 바꾼다 — 예전 사진은 Git 이력에 남는다.
     · 참조하는 모든 페이지의 url("…?v=N") 버전을 올려 방문자 캐시를 깬다.
       (학사·대학원처럼 한 사진을 두 페이지가 쓰면 함께 바뀐다 — 화면에 미리 알린다.)
   되돌리기는 각 페이지 초안의 origSrc 에서 원래 토큰(버전·초점)을 읽어 복원한다 —
   되돌린 결과가 origSrc 와 같아지면 patchPage 가 그 초안을 알아서 지운다. */
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.photos) return;
  var U = Y.util;

  var PAGES = [
    { path: 'H-academic.html', label: '홈(메인)' },
    { path: 'G-about.html', label: '학부소개' },
    { path: 'G-people.html', label: '구성원' },
    { path: 'G-research.html', label: '연구' },
    { path: 'G-academics.html', label: '학사' },
    { path: 'G-graduate.html', label: '대학원' },
    { path: 'G-news.html', label: '소식' },
    { path: 'G-admissions.html', label: '입학' }
  ];
  var MAX_W = 2560;           // 와이드 데스크탑까지 덮는 최대 폭
  var MAX_B64 = 2800000;      // 한 장 상한(base64 글자 수 ≈ 2.1MB) — Vercel 본문 4.5MB 안
  var WARN_TOTAL = 3200000;   // 게시 대기 사진 합계 경고선

  /* 페이지 원문에서 히어로 선언을 찾는다 — url("assets/hero-….jpg[?v=N]") center P%/cover */
  var SCAN_RE = /url\("(assets\/hero-[^"?]+)(?:\?v=(\d+))?"\)\s*(?:center\s+([\d.]+)%\s*\/\s*cover)?/;

  var state = { host: null, heroes: null, loading: false };

  function d() { return (state.host && state.host.ownerDocument) || document; }
  function mk(tag, cls, txt) {
    var n = d().createElement(tag);
    if (tag === 'button') n.type = 'button';
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function reEsc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function slug(s) { return String(s).replace(/[^A-Za-z0-9]+/g, '-'); }
  function kb(n) { return Math.max(1, Math.round(n / 1024)) + 'KB'; }
  function b64bytes(b64) { return Math.round(b64.length * 3 / 4); }

  /* ── 1. 훑기 — 여덟 페이지의 히어로를 모은다 ── */
  function scan() {
    state.loading = true;
    var jobs = PAGES.map(function (pg) {
      return Y.engine.pageSrc(pg.path).then(function (src) {
        var m = SCAN_RE.exec(String(src || ''));
        if (!m) return null;
        return { path: pg.path, label: pg.label, img: m[1],
          ver: m[2] ? parseInt(m[2], 10) : 0, pos: m[3] != null ? parseFloat(m[3]) : null };
      }, function () { return null; });
    });
    return Promise.all(jobs).then(function (rows) {
      var byImg = {}, order = [];
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (!r) continue;
        if (!byImg[r.img]) { byImg[r.img] = { img: r.img, pages: [], staged: null }; order.push(r.img); }
        byImg[r.img].pages.push(r);
      }
      /* 이전 세션에서 담아 둔 사진 초안을 이어받는다 */
      return Y.store.all('drafts').then(function (all) {
        for (var j = 0; j < (all || []).length; j++) {
          var rec = all[j];
          if (rec && rec.encoding === 'base64' && byImg[rec.path]) byImg[rec.path].staged = rec;
        }
        state.heroes = order.map(function (k) { return byImg[k]; });
        state.loading = false;
        return state.heroes;
      });
    });
  }

  /* ── 2. 사진 읽기 — 줄이고 JPEG 로 다진다 ── */
  function decode(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file, { imageOrientation: 'from-image' })
        .catch(function () { return decodeByImg(file); });
    }
    return decodeByImg(file);
  }
  function decodeByImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () {
        URL.revokeObjectURL(url);
        rej(new Error('사진을 읽을 수 없습니다. JPG·PNG·WebP 사진을 올려 주세요.'));
      };
      im.src = url;
    });
  }
  function encode(bmp, maxW) {
    var w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
    if (!w || !h) return null;
    var scale = Math.min(1, maxW / w);
    var cw = Math.round(w * scale), ch = Math.round(h * scale);
    var cv = d().createElement('canvas');
    cv.width = cw; cv.height = ch;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#12294f';               // PNG 투명 영역은 히어로의 네이비로 채운다
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(bmp, 0, 0, cw, ch);
    var qs = [0.85, 0.72, 0.6];
    for (var i = 0; i < qs.length; i++) {
      var du = cv.toDataURL('image/jpeg', qs[i]);
      if (du.length <= MAX_B64) return { dataUrl: du, w: cw, h: ch };
    }
    return { tooBig: true, w: cw, h: ch };
  }
  function readImage(file) {
    if (file.size > 25 * 1024 * 1024) {
      return Promise.reject(new Error('사진이 너무 큽니다(25MB 초과). 다른 사진을 골라 주세요.'));
    }
    return decode(file).then(function (bmp) {
      var out = encode(bmp, MAX_W);
      if (out && out.tooBig) out = encode(bmp, 1920);   // 아주 촘촘한 사진은 한 단계 더 줄인다
      if (bmp.close) { try { bmp.close(); } catch (e) {} }
      if (!out) throw new Error('사진 크기를 읽을 수 없습니다.');
      if (out.tooBig) throw new Error('줄여도 용량이 큽니다. 4000px 이하 사진으로 다시 시도해 주세요.');
      var b64 = out.dataUrl.slice(out.dataUrl.indexOf(',') + 1);
      return { dataUrl: out.dataUrl, b64: b64, w: out.w, h: out.h, bytes: b64bytes(b64) };
    });
  }

  /* ── 3. 페이지 원문 손질 — 버전·초점 토큰만 바꾼다 ── */
  function patchPages(hero, o) {
    var chain = Promise.resolve();
    hero.pages.forEach(function (pg) {
      chain = chain.then(function () {
        return Y.engine.patchPage(pg.path, function (src) {
          var next = String(src);
          if (o.ver != null) {
            next = next.replace(
              new RegExp('url\\("' + reEsc(hero.img) + '(?:\\?v=\\d+)?"\\)', 'g'),
              'url("' + hero.img + (o.ver ? '?v=' + o.ver : '') + '")');
          }
          if (o.pos != null) {
            next = next.replace(
              new RegExp('(url\\("' + reEsc(hero.img) + '(?:\\?v=\\d+)?"\\)\\s*center\\s+)[\\d.]+%'),
              '$1' + o.pos + '%');
          }
          return next;
        }).then(function () {
          if (o.ver != null) pg.ver = o.ver;
          if (o.pos != null && pg.pos != null) pg.pos = o.pos;
        });
      });
    });
    return chain;
  }

  /* ── 4. 미리보기 — 지금 보고 있는 페이지에만 오버레이 스타일을 얹는다 ── */
  function previewSheet(hero) {
    var here = U.pagePath();
    var mine = hero.pages.some(function (pg) { return pg.path === here; });
    var id = 'ys-photo-prev-' + slug(hero.img);
    var doc = document;
    var st = doc.getElementById(id);
    if (!mine) { if (st) st.parentNode.removeChild(st); return; }
    var decl = [];
    if (hero.staged) decl.push('background-image:url("data:image/jpeg;base64,' + hero.staged.src + '")!important');
    var p = hero.pages[0].pos;
    if (p != null) decl.push('background-position:center ' + p + '%!important');
    if (!decl.length) { if (st) st.parentNode.removeChild(st); return; }
    if (!st) {
      st = doc.createElement('style');
      st.id = id;
      st.setAttribute(Y.config.uiAttr, '');
      (doc.head || doc.documentElement).appendChild(st);
    }
    /* .phero(하위)·.hero-bg(메인) 어느 쪽이든 한 페이지에는 하나만 있다.
       .phero::before 는 background:inherit 라 부모만 덮으면 따라온다. */
    st.textContent = '.phero,.hero-bg{' + decl.join(';') + '}';
  }
  function dropPreview(hero) {
    var st = document.getElementById('ys-photo-prev-' + slug(hero.img));
    if (st && st.parentNode) st.parentNode.removeChild(st);
  }

  /* ── 5. 담기 · 초점 · 되돌리기 ── */
  function nextVer(hero) {
    var v = 1;
    hero.pages.forEach(function (pg) { if (pg.ver > v) v = pg.ver; });
    return v + 1;
  }
  function stagedTotal() {
    var t = 0;
    (state.heroes || []).forEach(function (h) { if (h.staged) t += h.staged.src.length; });
    return t;
  }

  function stagePhoto(hero, file) {
    return readImage(file).then(function (img) {
      var rec = {
        path: hero.img, src: img.b64, origSrc: '', encoding: 'base64', bin: 1,
        bytes: img.bytes, w: img.w, h: img.h,
        note: '히어로 사진 교체', ts: Date.now(), author: Y.session.author()
      };
      return Y.store.put('drafts', rec).then(function () {
        hero.staged = rec;
        Y.bus.emit('draft:change', { path: hero.img, dirty: true });
        return patchPages(hero, { ver: nextVer(hero) });
      }).then(function () {
        previewSheet(hero);
        if (stagedTotal() > WARN_TOTAL) {
          Y.toast('담아 둔 사진 용량이 큽니다. 사진은 한두 장씩 나눠 게시하세요.', 'warn', 6000);
        }
        Y.toast('사진을 초안에 담았습니다 (' + kb(img.bytes) + '). 「게시」를 눌러야 사이트에 나갑니다.');
      });
    });
  }

  function applyPos(hero, pos) {
    return patchPages(hero, { pos: pos }).then(function () { previewSheet(hero); });
  }

  /** 이 사진에 대한 모든 변경(파일·버전·초점)을 초안에서 걷어낸다. */
  function revert(hero) {
    var jobs = [Y.store.del('drafts', hero.img).then(function () {
      hero.staged = null;
      Y.bus.emit('draft:change', { path: hero.img, dirty: false });
    })];
    hero.pages.forEach(function (pg) {
      jobs.push(Y.store.get('drafts', pg.path).then(function (rec) {
        /* 열려 있는 현재 페이지는 초안 레코드가 아직 없을 수 있다 — 버퍼에서 origSrc 를 읽는다 */
        var orig = rec && typeof rec.origSrc === 'string' ? rec.origSrc
          : (Y.engine.path() === pg.path ? Y.engine.origSrc() : null);
        if (orig == null) return null;
        var m = new RegExp('url\\("' + reEsc(hero.img) + '(?:\\?v=(\\d+))?"\\)\\s*(?:center\\s+([\\d.]+)%)?').exec(orig);
        if (!m) return null;
        var o = { ver: m[1] ? parseInt(m[1], 10) : 0 };
        if (m[2] != null) o.pos = parseFloat(m[2]);
        return Y.engine.patchPage(pg.path, function (src) {
          var next = String(src).replace(
            new RegExp('url\\("' + reEsc(hero.img) + '(?:\\?v=\\d+)?"\\)', 'g'),
            'url("' + hero.img + (o.ver ? '?v=' + o.ver : '') + '")');
          if (o.pos != null) {
            next = next.replace(
              new RegExp('(url\\("' + reEsc(hero.img) + '(?:\\?v=\\d+)?"\\)\\s*center\\s+)[\\d.]+%'),
              '$1' + o.pos + '%');
          }
          return next;
        }).then(function () {
          pg.ver = o.ver;
          if (o.pos != null) pg.pos = o.pos;
        });
      }));
    });
    return Promise.all(jobs).then(function () { dropPreview(hero); });
  }

  /* ── 6. 패널 ── */
  var STYLE_ID = 'ys-photo-style';
  function ensureStyle() {
    var doc = d();
    if (doc.getElementById(STYLE_ID)) return;
    var css = [
      '.ys-ph{display:flex;flex-direction:column;gap:.9rem}',
      '.ys-ph-card{border:1px solid var(--ys-line);border-radius:8px;padding:.7rem;display:flex;flex-direction:column;gap:.55rem}',
      '.ys-ph-h{display:flex;align-items:baseline;gap:.4rem;flex-wrap:wrap}',
      '.ys-ph-h b{font-size:.84rem;color:var(--ys-ink)}',
      '.ys-ph-h span{font-size:.7rem;color:var(--ys-dim)}',
      '.ys-ph-new{display:inline-block;font-size:.62rem;font-weight:700;color:#fff;background:#0d5c3a;border-radius:999px;padding:.08rem .38rem}',
      '.ys-ph-thumb{width:100%;aspect-ratio:21/9;border-radius:6px;background:#12294f center/cover no-repeat;border:1px solid var(--ys-line)}',
      '.ys-ph-row{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}',
      '.ys-ph-row label{font-size:.72rem;font-weight:700;color:var(--ys-muted);flex:none}',
      '.ys-ph-row input[type=range]{flex:1 1 8rem;min-width:6rem}',
      '.ys-ph-val{font-size:.72rem;color:var(--ys-ink);width:2.6rem;text-align:right}',
      '.ys-ph-share{font-size:.7rem;color:#8a6a12}'
    ].join('');
    var st = doc.createElement('style');
    st.id = STYLE_ID;
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = css;
    (doc.head || doc.documentElement).appendChild(st);
  }

  function thumbUrl(hero) {
    if (hero.staged) return 'data:image/jpeg;base64,' + hero.staged.src;
    var pg = hero.pages[0];
    return hero.img + (pg.ver ? '?v=' + pg.ver : '');
  }

  function card(hero) {
    var c = mk('div', 'ys-ph-card');

    var head = mk('div', 'ys-ph-h');
    var names = hero.pages.map(function (pg) { return pg.label; }).join(' · ');
    head.appendChild(mk('b', null, names));
    head.appendChild(mk('span', null, hero.img.replace(/^assets\//, '')));
    if (hero.staged) {
      head.appendChild(mk('i', 'ys-ph-new', '미게시 새 사진 · ' + kb(hero.staged.bytes || b64bytes(hero.staged.src))));
    }
    c.appendChild(head);
    if (hero.pages.length > 1) {
      c.appendChild(mk('p', 'ys-ph-share',
        hero.pages.map(function (pg) { return pg.label; }).join('·') + ' 페이지가 같은 사진을 씁니다 — 바꾸면 함께 바뀝니다.'));
    }

    var thumb = mk('div', 'ys-ph-thumb');
    thumb.style.backgroundImage = 'url("' + thumbUrl(hero) + '")';
    var p0 = hero.pages[0].pos;
    if (p0 != null) thumb.style.backgroundPosition = 'center ' + p0 + '%';
    c.appendChild(thumb);

    /* 초점 — cover 로 잘릴 때 보여줄 높이 */
    if (p0 != null) {
      var row = mk('div', 'ys-ph-row');
      row.appendChild(mk('label', null, '세로 초점'));
      var range = mk('input');
      range.type = 'range'; range.min = '0'; range.max = '100'; range.step = '1';
      range.value = String(Math.round(p0));
      var val = mk('span', 'ys-ph-val', Math.round(p0) + '%');
      range.addEventListener('input', function () {
        val.textContent = range.value + '%';
        hero.pages.forEach(function (pg) { if (pg.pos != null) pg.pos = parseFloat(range.value); });
        thumb.style.backgroundPosition = 'center ' + range.value + '%';
        previewSheet(hero);                    // 문서에는 아직 안 쓴다 — 손을 뗐을 때 쓴다
      });
      range.addEventListener('change', function () {
        applyPos(hero, parseFloat(range.value)).then(null, function (e) {
          Y.toast((e && e.message) || '초점을 저장하지 못했습니다.', 'error');
        });
      });
      row.appendChild(range);
      row.appendChild(val);
      c.appendChild(row);
      c.appendChild(mk('p', 'ys-hint', '사진이 화면 폭에 맞춰 잘릴 때 보여줄 높이입니다 — 0%는 맨 위, 100%는 맨 아래.'));
    }

    var act = mk('div', 'ys-ph-row');
    var up = mk('button', 'ys-act is-pri', '새 사진 올리기');
    var file = mk('input');
    file.type = 'file';
    file.accept = 'image/jpeg,image/png,image/webp,image/*';
    file.style.display = 'none';
    up.addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      file.value = '';
      if (!f) return;
      up.disabled = true;
      stagePhoto(hero, f).then(function () {
        up.disabled = false;
        repaint();
      }, function (e) {
        up.disabled = false;
        Y.toast((e && e.message) || '사진을 담지 못했습니다.', 'error');
      });
    });
    act.appendChild(up);
    act.appendChild(file);
    if (hero.staged || hasHeroDraftEdits(hero)) {
      var rb = mk('button', 'ys-act', '이 사진 변경 되돌리기');
      rb.addEventListener('click', function () {
        rb.disabled = true;
        revert(hero).then(function () { repaint(); },
          function (e) { rb.disabled = false; Y.toast((e && e.message) || '되돌리지 못했습니다.', 'error'); });
      });
      act.appendChild(rb);
    }
    c.appendChild(act);
    return c;
  }

  /** 초점·버전이 초안에서 바뀌어 있나 — 되돌리기 버튼을 보일지 정한다. */
  function hasHeroDraftEdits(hero) {
    return hero.pages.some(function (pg) { return pg._dirty; });
  }
  /** scan 결과에 초안 여부 표시를 붙인다(카드 그릴 때 쓴다). */
  function markDirty() {
    var jobs = (state.heroes || []).map(function (hero) {
      return Promise.all(hero.pages.map(function (pg) {
        return Y.store.get('drafts', pg.path).then(function (rec) {
          var orig = rec && typeof rec.origSrc === 'string' ? rec.origSrc : null;
          if (orig == null && Y.engine.path() === pg.path) orig = Y.engine.origSrc();
          if (orig == null) { pg._dirty = false; return; }
          var now = SCAN_RE.exec(rec ? rec.src : (Y.engine.path() === pg.path ? Y.engine.src() : ''));
          var was = new RegExp('url\\("' + reEsc(hero.img) + '(?:\\?v=(\\d+))?"\\)\\s*(?:center\\s+([\\d.]+)%)?').exec(orig);
          pg._dirty = !!(now && was && (String(now[2] || 0) !== String(was[1] || 0) || String(now[3] || '') !== String(was[2] || '')));
        }, function () { pg._dirty = false; });
      }));
    });
    return Promise.all(jobs);
  }

  function repaint() {
    var host = state.host;
    if (!host) return;
    ensureStyle();
    host.innerHTML = '';
    var root = mk('div', 'ys-ph');
    root.setAttribute(Y.config.uiAttr, '');
    host.appendChild(root);
    if (state.loading || !state.heroes) {
      root.appendChild(mk('p', 'ys-hint', '여덟 페이지의 머리 사진을 살펴보는 중…'));
      return;
    }
    root.appendChild(mk('p', 'ys-hint',
      '페이지 맨 위 큰 사진을 바꿉니다. 올린 사진은 알맞게 줄여 초안에 담고, 「게시」를 눌러야 사이트에 나갑니다. 예전 사진은 버전 이력에 남습니다.'));
    if (!state.heroes.length) {
      root.appendChild(mk('p', 'ys-warn', '머리 사진을 찾지 못했습니다. 페이지 원문을 불러올 수 없는 상태일 수 있습니다.'));
      return;
    }
    for (var i = 0; i < state.heroes.length; i++) root.appendChild(card(state.heroes[i]));
    root.appendChild(mk('p', 'ys-note',
      '지금 보고 있는 페이지의 사진은 바꾸는 즉시 화면에서 미리 보입니다. 다른 페이지는 작은 그림으로 확인하세요.'));
  }

  function refresh() {
    if (state.loading) return Promise.resolve();
    repaint();                                  // '살펴보는 중' 표시
    return scan().then(markDirty).then(function () {
      repaint();
      /* 이전 세션에서 담아 둔 미리보기를 되살린다 */
      (state.heroes || []).forEach(function (hero) {
        if (hero.staged || hasHeroDraftEdits(hero)) previewSheet(hero);
      });
    }, function (e) {
      state.loading = false;
      repaint();
      Y.toast((e && e.message) || '머리 사진 목록을 불러오지 못했습니다.', 'error');
    });
  }

  /* 게시가 끝나면 버전·초안 상태가 달라졌다 — 다음에 열 때 새로 훑는다 */
  Y.bus.on('publish:done', function () { state.heroes = null; });

  /* ── HUD 등록 ── */
  var tries = 0;
  function register() {
    if (!Y.hud || !Y.hud.registerPanel) {
      if (tries++ > 60) return;
      setTimeout(register, 150);
      return;
    }
    Y.hud.registerPanel({
      id: 'photos',
      title: '머리 사진',
      icon: '▣',
      order: 26,
      render: function (hostEl) { state.host = hostEl; refresh(); },
      onOpen: function () { if (state.heroes === null && !state.loading) refresh(); else repaint(); }
    });
  }
  register();

  Y.photos = {
    scan: scan,
    refresh: refresh,
    stage: stagePhoto,
    revert: revert,
    heroes: function () { return state.heroes || []; }
  };
})();
