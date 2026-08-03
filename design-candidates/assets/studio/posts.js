/* YSME In-Place Studio — 공지·소식 등록 패널

   공지/뉴스/세미나/행사는 HTML 이 아니라 assets/js/data.js 의 배열이 원본이고
   사이트 스크립트가 런타임에 그린다. 그래서 "새 글 등록"은 화면 조작이 아니라
   **그 배열 맨 앞에 항목 하나를 끼워 넣는 일**이다 — datamap 의 소스 오프셋
   삽입을 써서 diff 에 새 항목만 잡히게 한다.

   등록한 글은 초안(IndexedDB)에 쌓이고, 「게시」를 눌러야 사이트에 나간다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.posts) return;

  /* ── 등록 가능한 글 종류 ──
     소식 화면에 실제로 있는 게시판 전부를 여기 둔다. 예전에는 다섯뿐이라
     자료실·취업 정보·학위논문심사는 편집기로 글을 올릴 수가 없었다. */
  var KINDS = [
    { coll: 'noticesUG', label: '학부 공지', where: '홈 공지사항 · 소식 › 공지사항(학부)', pin: true },
    { coll: 'noticesGrad', label: '대학원 공지', where: '홈 공지사항(대학원) · 소식 › 공지사항(대학원)', pin: true },
    { coll: 'newsList', label: '연구 소식 · 뉴스', where: '홈 연구 소식 · 소식 › 뉴스·연구성과', pin: false },
    { coll: 'seminars', label: '세미나', where: '홈 세미나 · 소식 › 세미나·행사 · 학사 일정', pin: false },
    { coll: 'events', label: '행사', where: '소식 › 세미나·행사 · 학사 일정', pin: false },
    { coll: 'thesisReview', label: '학위논문심사', where: '소식 › 학위논문심사', pin: false },
    { coll: 'archive', label: '자료실', where: '소식 › 자료실', pin: false },
    { coll: 'jobs', label: '취업 정보', where: '소식 › 취업 정보 · 연구 › 대외협력', pin: false }
  ];

  var FIELD = {
    no: { label: '번호', hint: '맨 위 번호의 다음이 저절로 들어갑니다. "공지"로 바꾸면 목록 맨 위에 고정됩니다.' },
    title: { label: '제목', long: true, required: true },
    date: { label: '날짜', hint: 'YYYY.MM.DD' },
    url: { label: '원문 링크', hint: '학교 게시판 원문 주소. 없으면 비워 둡니다.' },
    /* 첨부는 한 묶음이다 — 켜면 파일 올리기와 이름 칸이 함께 열린다 */
    att: { label: '첨부 파일', hint: '켜면 파일을 올릴 수 있습니다.', group: 'att' },
    attName: { label: '첨부 이름만 표시', hint: '파일을 올리지 않고 이름만 보여 줄 때 씁니다(여러 개면 쉼표). 내려받기는 원문에서.', group: 'att' },
    thumb: { label: '썸네일 주소', hint: '이미지 URL. 비우면 글자만 나옵니다.' },
    body: { label: '본문', long: true, para: true, tall: true,
      hint: '엔터 두 번(빈 줄)으로 문단이 나뉩니다. 비우면 「원문에서 보라」고 안내만 나갑니다.' },
    /* 본문 형태(text/file)는 본문이 있으면 text, 없으면 file 로 저절로 정한다 —
       직접 고르게 했더니 다들 헷갈려 했다. */
    bodyKind: { auto: true },
    meta: { label: '머리 정보', long: true, para: true, hint: '세미나·행사에서 연사·일시·장소처럼 본문 위에 따로 세울 줄.' },
    place: { label: '장소' },
    time: { label: '시간' },
    speaker: { label: '연사' }
  };

  /* 입력 칸을 읽는 차례대로 세운다 — data.js 의 키 순서는 기계의 사정이다.
     목록에 없는 키는 뒤에 원래 순서대로 붙는다. */
  var ORDER = ['title', 'date', 'no', 'body', 'meta', 'speaker', 'time', 'place', 'url', 'att', 'attName', 'thumb'];

  var STYLE_ID = 'ys-post-style';
  var QUEUE_KEY = 'ysme-alert-queue';
  var host = null, curColl = KINDS[0].coll, inputs = null, listEl = null;

  /* ── 공지 메일 알림 큐 ──
     학부·대학원 공지를 등록하면 여기 쌓아 두고, 「게시」가 실제로 성공한 뒤에야
     구독자에게 메일을 보낸다(api/alerts). 게시 전에 글을 버릴 수 있으므로
     발송 직전에 data.js 에 아직 남아 있는 제목만 추려 보낸다. */
  function alertQueue() {
    try { return JSON.parse(sessionStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; }
  }
  function setAlertQueue(list) {
    try {
      if (list && list.length) sessionStorage.setItem(QUEUE_KEY, JSON.stringify(list.slice(-20)));
      else sessionStorage.removeItem(QUEUE_KEY);
    } catch (e) {}
  }
  function queueAlert(coll, obj) {
    if (coll !== 'noticesUG' && coll !== 'noticesGrad') return;
    var list = alertQueue();
    list.push({
      kind: coll === 'noticesGrad' ? 'grad' : 'ug',
      title: String(obj.title || ''),
      date: String(obj.date || ''),
      url: String(obj.url || '')
    });
    setAlertQueue(list);
  }

  function d() { return (host && host.ownerDocument) || document; }
  function mk(tag, cls, txt) {
    var n = d().createElement(tag);
    if (tag === 'button') n.type = 'button';
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function today() {
    var t = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return t.getFullYear() + '.' + p(t.getMonth() + 1) + '.' + p(t.getDate());
  }

  function kindOf(coll) {
    for (var i = 0; i < KINDS.length; i++) if (KINDS[i].coll === coll) return KINDS[i];
    return KINDS[0];
  }

  /** 기존 항목의 no 중 가장 큰 수 + 1 */
  function nextNo(coll) {
    var rows = Y.datamap.items(coll), max = 0;
    for (var i = 0; i < rows.length; i++) {
      var n = parseInt(rows[i].item && rows[i].item.no, 10);
      if (isFinite(n) && n > max) max = n;
    }
    return max ? String(max + 1) : '1';
  }

  function defaultFor(coll, key, kind) {
    if (key === 'date') return today();
    /* 공지 게시판도 다음 번호가 기본 — 고정글로 만들 때만 "공지"로 바꾼다 */
    if (key === 'no') return nextNo(coll);
    if (kind === 'bool') return false;
    return '';
  }

  /* ── 스타일 ── */
  function ensureStyle() {
    var doc = d();
    if (doc.getElementById(STYLE_ID)) return;
    var css = [
      '.ys-post{display:flex;flex-direction:column;gap:.6rem}',
      '.ys-post-f{display:flex;flex-direction:column;gap:.2rem}',
      '.ys-post-f>span{font-size:.72rem;font-weight:700;color:var(--ys-muted)}',
      '.ys-post-f em{font-style:normal;font-weight:400;color:var(--ys-dim)}',
      '.ys-post-f .ys-req{color:#b3261e;margin-left:.15rem}',
      '.ys-post-chk{flex-direction:row;align-items:center;gap:.4rem}',
      '.ys-post-chk input{width:auto;flex:none}',
      '.ys-post-act{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.2rem}',
      '.ys-post-err{color:#b3261e;font-size:.74rem;margin:.1rem 0 0}',
      '.ys-post-list{display:flex;flex-direction:column;gap:.3rem;max-height:20rem;overflow:auto}',
      '.ys-post-row{display:flex;align-items:flex-start;gap:.4rem;padding:.34rem .1rem;',
      'border-top:1px solid var(--ys-line)}',
      '.ys-post-row>div{flex:1 1 auto;min-width:0}',
      '.ys-post-t{display:block;font-size:.78rem;line-height:1.4;color:var(--ys-ink);',
      'overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
      '.ys-post-m{font-size:.7rem;color:var(--ys-dim)}',
      '.ys-post-new{display:inline-block;font-size:.62rem;font-weight:700;color:#fff;',
      'background:#0d5c3a;border-radius:999px;padding:.08rem .34rem;margin-right:.25rem}',
      '.ys-post-del{flex:none;font-size:.72rem;border:1px solid var(--ys-line);background:#fff;',
      'color:#b3261e;border-radius:6px;padding:.22rem .4rem;cursor:pointer}',
      '.ys-post-del:hover{background:#fdeceb}',
      /* 본문 — 글답게 넓고 성기게. 쓰는 만큼 아래로 자란다(autoGrow) */
      '.ys-post .ys-ta.is-tall{min-height:10.5rem;font-size:.84rem;line-height:1.75;resize:vertical}',
      /* 첨부 묶음 — 켜야 열리는 한 칸 */
      '.ys-post-attg{border:1px solid var(--ys-line);border-radius:10px;background:var(--ys-tint);',
      'padding:.6rem .65rem;display:flex;flex-direction:column;gap:.5rem}',
      '.ys-post-upc{display:flex;align-items:center;gap:.45rem;background:#fff;border:1px solid var(--ys-line);',
      'border-radius:8px;padding:.34rem .5rem;font-size:.75rem;min-width:0}',
      '.ys-post-upc>span{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
      'color:var(--ys-ink)}',
      '.ys-post-upc>em{flex:none;font-style:normal;font-size:.68rem;color:var(--ys-dim)}',
      '.ys-post-upc>button{flex:none;width:1.3rem;height:1.3rem;border:0;background:none;color:#b3261e;',
      'font-size:.85rem;line-height:1;cursor:pointer;border-radius:5px}',
      '.ys-post-upc>button:hover{background:#fdeceb}'
    ].join('');
    var st = doc.createElement('style');
    st.id = STYLE_ID;
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = css;
    (doc.head || doc.documentElement).appendChild(st);
  }

  /* ── 첨부 파일 올리기 ──
     파일은 base64 초안으로 담겼다가 「게시」 때 data.js 와 같은 커밋에 실려
     assets/files/ 아래로 올라간다(서버 publish.js 가 base64 blob 커밋을 지원).
     경로는 ASCII 로 만들고(서버 경로 규칙), 한글 원래 이름은 attName 과
     내려받기 이름(download 속성)으로만 쓴다. */
  var UP_EXT = ['pdf', 'hwp', 'hwpx', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'png', 'jpg', 'jpeg'];
  var UP_MAX_ONE = 2.5 * 1024 * 1024;   // 파일 하나
  var UP_MAX_ALL = 3 * 1024 * 1024;     // 한 글 합계 — Vercel 요청 본문(4.5MB) 안
  var upFiles = [];                     // [{name, ext, b64, bytes, path?}]
  var upListEl = null, attNameWrap = null, attChk = null;

  function upTotal() {
    var t = 0;
    for (var i = 0; i < upFiles.length; i++) t += upFiles[i].bytes;
    return t;
  }
  function kb(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + 'MB' : Math.max(1, Math.round(n / 1024)) + 'KB'; }

  function readAsB64(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () {
        var s = String(r.result || ''), at = s.indexOf(',');
        at >= 0 ? res(s.slice(at + 1)) : rej(new Error('파일을 읽지 못했습니다.'));
      };
      r.onerror = function () { rej(new Error('파일을 읽지 못했습니다.')); };
      r.readAsDataURL(file);
    });
  }

  function takeFiles(list) {
    var jobs = Promise.resolve();
    Array.prototype.forEach.call(list || [], function (file) {
      jobs = jobs.then(function () {
        var ext = String(file.name.split('.').pop() || '').toLowerCase();
        if (UP_EXT.indexOf(ext) < 0) {
          Y.toast('올릴 수 없는 형식입니다: ' + file.name + ' (.' + ext + ')', 'warn');
          return;
        }
        if (file.size > UP_MAX_ONE) {
          Y.toast(file.name + ' 은(는) ' + kb(file.size) + ' — 2.5MB 를 넘습니다. 원문 링크로 안내해 주세요.', 'warn', 5200);
          return;
        }
        if (upTotal() + file.size > UP_MAX_ALL) {
          Y.toast('첨부 합계가 3MB 를 넘습니다. 큰 파일은 원문 링크로 안내해 주세요.', 'warn', 5200);
          return;
        }
        return readAsB64(file).then(function (b64) {
          upFiles.push({ name: file.name, ext: ext, b64: b64, bytes: file.size });
          if (attChk) attChk.checked = true;
          renderChips();
        }, function (e) { Y.toast(e.message, 'error'); });
      });
    });
    return jobs;
  }

  function renderChips() {
    if (!upListEl) return;
    upListEl.innerHTML = '';
    for (var i = 0; i < upFiles.length; i++) {
      (function (idx) {
        var f = upFiles[idx];
        var chip = mk('div', 'ys-post-upc');
        chip.appendChild(mk('span', null, f.name));
        chip.appendChild(mk('em', null, kb(f.bytes)));
        var x = mk('button', null, '×');
        x.setAttribute('aria-label', f.name + ' 빼기');
        x.addEventListener('click', function () { upFiles.splice(idx, 1); renderChips(); });
        chip.appendChild(x);
        upListEl.appendChild(chip);
      })(i);
    }
    /* 파일을 올렸으면 이름은 파일에서 나온다 — 직접 쓰는 칸은 접는다 */
    if (attNameWrap) attNameWrap.style.display = upFiles.length ? 'none' : '';
  }

  /* 등록이 끝난 뒤 올린 파일을 base64 초안으로 담는다 — 「게시」 때
     data.js 와 한 커밋에 실린다. 돌아오는 값은 담은 파일 수. */
  function stageAttachments() {
    if (!upFiles.length) return Promise.resolve(0);
    var list = upFiles.slice(), chain = Promise.resolve();
    list.forEach(function (f) {
      chain = chain.then(function () {
        return Y.store.put('drafts', {
          path: f.path, src: f.b64, origSrc: '', encoding: 'base64', bin: 1,
          bytes: f.bytes, note: '첨부 — ' + f.name, ts: Date.now(), author: Y.session.author()
        }).then(function () {
          Y.bus.emit('draft:change', { path: f.path, dirty: true });
        });
      });
    });
    return chain.then(function () { return list.length; });
  }

  function buildUpload(group) {
    var act = mk('div', 'ys-post-act');
    var pick = mk('button', 'ys-act', '파일 올리기…');
    var inp = mk('input');
    inp.type = 'file';
    inp.multiple = true;
    inp.accept = UP_EXT.map(function (e) { return '.' + e; }).join(',');
    inp.style.display = 'none';
    pick.addEventListener('click', function () { inp.click(); });
    inp.addEventListener('change', function () { takeFiles(inp.files); inp.value = ''; });
    act.appendChild(pick);
    group.appendChild(act);
    group.appendChild(inp);
    upListEl = mk('div', 'ys-post-upl');
    group.appendChild(upListEl);
    group.appendChild(mk('p', 'ys-hint',
      '올린 파일은 「게시」 때 함께 올라가, 글에서 바로 내려받게 됩니다. ' +
      '하나 2.5MB · 한 글 합계 3MB까지 — 더 크면 원문 링크로 안내하세요.'));
  }

  /* ── 입력 폼 ── */
  function autoGrow(ta) {
    function fit() {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight + 2, 560) + 'px';
    }
    ta.addEventListener('input', fit);
    setTimeout(fit, 0);
  }

  function buildForm(body) {
    var shape = Y.datamap.shapeOf(curColl);
    inputs = [];
    upFiles = [];
    upListEl = null; attNameWrap = null; attChk = null;
    if (!shape.length) {
      body.appendChild(mk('p', 'ys-warn', '이 목록의 항목 모양을 읽지 못했습니다(기존 항목이 없습니다).'));
      return;
    }
    shape = shape.slice().sort(function (a, b) {
      var ia = ORDER.indexOf(a.key), ib = ORDER.indexOf(b.key);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    var attGroup = null;
    for (var i = 0; i < shape.length; i++) {
      var key = shape[i].key, kind = shape[i].kind;
      var meta = FIELD[key] || { label: key };
      if (meta.auto) { inputs.push({ key: key, kind: kind, meta: meta, auto: true }); continue; }
      var wrap = mk('div', 'ys-post-f' + (kind === 'bool' ? ' ys-post-chk' : ''));
      var lab = mk('span', null, meta.label);
      if (meta.required) lab.appendChild(mk('i', 'ys-req', '*'));
      if (meta.hint) { var em = mk('em', null, ' · ' + meta.hint); lab.appendChild(em); }
      var inp;
      if (kind === 'bool') {
        inp = mk('input');
        inp.type = 'checkbox';
        inp.checked = !!defaultFor(curColl, key, kind);
        wrap.appendChild(inp);
        wrap.appendChild(lab);
      } else if (meta.long) {
        inp = mk('textarea', 'ys-ta' + (meta.tall ? ' is-tall' : ''));
        inp.rows = meta.tall ? 8 : 3;
        inp.value = String(defaultFor(curColl, key, kind));
        wrap.appendChild(lab);
        wrap.appendChild(inp);
        autoGrow(inp);
      } else {
        inp = mk('input', 'ys-in');
        inp.type = 'text';
        inp.value = String(defaultFor(curColl, key, kind));
        wrap.appendChild(lab);
        wrap.appendChild(inp);
      }

      /* 첨부 묶음 — att 체크가 열고 닫는 상자에 파일 올리기·이름 칸을 함께 담는다 */
      if (key === 'att' && kind === 'bool') {
        body.appendChild(wrap);
        attChk = inp;
        attGroup = mk('div', 'ys-post-attg');
        attGroup.style.display = inp.checked ? '' : 'none';
        buildUpload(attGroup);
        body.appendChild(attGroup);
        (function (chk, grp) {
          chk.addEventListener('change', function () { grp.style.display = chk.checked ? '' : 'none'; });
        })(inp, attGroup);
      } else if (meta.group === 'att' && attGroup) {
        if (key === 'attName') attNameWrap = wrap;
        attGroup.appendChild(wrap);
      } else {
        body.appendChild(wrap);
      }
      inputs.push({ key: key, kind: kind, inp: inp, meta: meta });
    }
  }

  function readForm() {
    var obj = {}, errs = [], hasBodyKind = false;
    for (var i = 0; i < inputs.length; i++) {
      var f = inputs[i], v;
      if (f.auto) { if (f.key === 'bodyKind') hasBodyKind = true; continue; }
      if (f.kind === 'bool') { obj[f.key] = !!f.inp.checked; continue; }
      var raw = String(f.inp.value == null ? '' : f.inp.value);
      if (f.meta.para) {
        /* 본문·머리 정보 — 문단(빈 줄)을 살린다. 예전엔 모든 공백을 한 칸으로
           뭉개 등록한 글이 통짜 한 덩어리로 게시됐다. */
        v = raw.replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n')
               .replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();
      } else {
        v = raw.replace(/\s+/g, ' ').trim();
      }
      if (f.meta.required && !v) errs.push(f.meta.label + '을(를) 입력하세요.');
      if (f.key === 'date' && v && !/^\d{4}\.\d{2}\.\d{2}$/.test(v)) {
        errs.push('날짜는 2026.07.26 처럼 YYYY.MM.DD 형식으로 넣어 주세요.');
      }
      if ((f.key === 'url' || f.key === 'thumb') && v &&
          !/^(https?:\/\/|\/|[\w.-]+\.html)/.test(v)) {
        errs.push(f.meta.label + '은(는) http:// 또는 https:// 로 시작해야 합니다.');
      }
      if (f.kind === 'number') {
        var n = Number(v);
        if (v && !isFinite(n)) errs.push(f.meta.label + '에는 숫자를 넣으세요.');
        obj[f.key] = v ? n : 0;
        continue;
      }
      obj[f.key] = v;
    }

    /* 올린 파일 — 게시 경로를 여기서 정해 두고(등록 때 초안으로 담는다),
       attFiles 는 「경로>표시이름」을 | 로 이어 이름과 파일이 절대 어긋나지 않게 한다.
       (attName 쉼표 나누기는 못 쓴다 — 파일 이름 자체에 쉼표가 흔하다.) */
    if (upFiles.length) {
      var stamp = Date.now().toString(36);
      var names = [], pairs = [];
      for (var j = 0; j < upFiles.length; j++) {
        upFiles[j].path = 'assets/files/' + stamp + '-' + (j + 1) + '.' + upFiles[j].ext;
        var nm = upFiles[j].name.replace(/[|>]/g, ' ').trim();
        names.push(nm);
        pairs.push(upFiles[j].path + '>' + nm);
      }
      obj.att = true;
      obj.attName = names.join(', ');
      obj.attFiles = pairs.join('|');
    }

    /* 본문 형태 — 본문이 있으면 그대로 보여 주고(text), 없으면 안내만(file) */
    if (hasBodyKind) obj.bodyKind = obj.body ? 'text' : 'file';

    return { obj: obj, errs: errs };
  }

  /* ── 최근 항목 목록 ── */
  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = '';
    var rows = Y.datamap.items(curColl);
    var head = mk('p', 'ys-hint', kindOf(curColl).label + ' ' + rows.length + '건 · 최근 8건');
    listEl.appendChild(head);
    for (var i = 0; i < Math.min(8, rows.length); i++) {
      (function (rec) {
        var it = rec.item || {};
        var row = mk('div', 'ys-post-row');
        var box = mk('div');
        var t = mk('span', 'ys-post-t');
        if (rec.pending) t.appendChild(mk('b', 'ys-post-new', '미게시'));
        t.appendChild(d().createTextNode(String(it.title || '(제목 없음)')));
        var m = mk('span', 'ys-post-m',
          [it.date || '', it.no ? '#' + it.no : '', it.att ? '첨부' : ''].filter(Boolean).join(' · '));
        box.appendChild(t);
        box.appendChild(m);
        var del = mk('button', 'ys-post-del', '삭제');
        del.addEventListener('click', function () { confirmDelete(rec.index, it); });
        row.appendChild(box);
        row.appendChild(del);
        listEl.appendChild(row);
      })(rows[i]);
    }
    if (!rows.length) listEl.appendChild(mk('p', 'ys-hint', '아직 등록된 글이 없습니다.'));
  }

  function confirmDelete(index, item) {
    var body = mk('div');
    body.appendChild(mk('p', null, '「' + String(item.title || '').slice(0, 60) + '」 을(를) 목록에서 지웁니다.'));
    body.appendChild(mk('p', 'ys-hint', '게시하기 전까지는 초안 버리기로 되돌릴 수 있습니다.'));
    Y.hud.modal({
      title: '글 삭제',
      body: body,
      okLabel: '삭제',
      onOk: function () {
        Y.datamap.removeItem(curColl, index).then(function () {
          Y.toast('삭제했습니다. 「게시」를 눌러야 사이트에 반영됩니다.');
          renderList();
        }, function (e) { Y.toast(e && e.message ? e.message : '삭제하지 못했습니다.', 'error'); });
      }
    });
  }

  /* ── 패널 ── */
  function render(hostEl) {
    host = hostEl;
    ensureStyle();
    hostEl.innerHTML = '';
    var root = mk('div', 'ys-post');
    root.setAttribute(Y.config.uiAttr, '');
    hostEl.appendChild(root);
    root.appendChild(mk('p', 'ys-hint', 'data.js 를 불러오는 중…'));

    Y.datamap.load().then(function () {
      root.innerHTML = '';

      /* 분류 */
      var pick = mk('div', 'ys-post-f');
      pick.appendChild(mk('span', null, '분류'));
      var sel = mk('select', 'ys-select');
      for (var i = 0; i < KINDS.length; i++) {
        var o = d().createElement('option');
        o.value = KINDS[i].coll;
        o.textContent = KINDS[i].label;
        sel.appendChild(o);
      }
      sel.value = curColl;
      pick.appendChild(sel);
      root.appendChild(pick);

      var where = mk('p', 'ys-hint', '');
      root.appendChild(where);

      var form = mk('div', 'ys-post');
      root.appendChild(form);

      var err = mk('p', 'ys-post-err', '');
      root.appendChild(err);

      var act = mk('div', 'ys-post-act');
      var add = mk('button', 'ys-act is-pri', '등록');
      var reset = mk('button', 'ys-act', '입력 비우기');
      act.appendChild(add);
      act.appendChild(reset);
      root.appendChild(act);

      root.appendChild(mk('p', 'ys-note',
        '등록하면 초안에 저장됩니다. 화면에는 「게시」를 눌러 커밋한 뒤 나타납니다.'));

      var lh = mk('h4', 'ys-sec-t', '등록된 글');
      root.appendChild(lh);
      listEl = mk('div', 'ys-post-list');
      root.appendChild(listEl);

      function rebuild() {
        where.textContent = '노출 위치 — ' + kindOf(curColl).where;
        form.innerHTML = '';
        err.textContent = '';
        buildForm(form);
        renderList();
      }
      sel.addEventListener('change', function () { curColl = sel.value; rebuild(); });
      reset.addEventListener('click', function () { rebuild(); });

      add.addEventListener('click', function () {
        var r = readForm();
        if (r.errs.length) { err.textContent = r.errs.join(' '); return; }
        err.textContent = '';
        add.disabled = true;
        Y.datamap.addItem(curColl, r.obj, true).then(function () {
          return stageAttachments();
        }).then(function (nAtt) {
          add.disabled = false;
          queueAlert(curColl, r.obj);
          Y.toast(kindOf(curColl).label + ' 1건을 등록했습니다' +
            (nAtt ? ' (첨부 ' + nAtt + '개 포함)' : '') + '. 「게시」를 눌러야 사이트에 나갑니다.' +
            (curColl === 'noticesUG' || curColl === 'noticesGrad' ? ' 게시되면 구독자에게 메일 알림이 나갑니다.' : ''));
          rebuild();
        }, function (e) {
          add.disabled = false;
          err.textContent = e && e.message ? e.message : '등록하지 못했습니다.';
        });
      });

      rebuild();
    }, function (e) {
      root.innerHTML = '';
      root.appendChild(mk('p', 'ys-warn', e && e.message ? e.message : 'data.js 를 불러올 수 없습니다.'));
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
      id: 'post',
      title: '공지 · 소식 등록',
      icon: '＋',
      order: 25,
      render: render,
      onOpen: function () { if (listEl) { Y.datamap.load().then(renderList, function () {}); } }
    });
  }
  registerPanel();

  /* ── 게시 완료 → 구독자 메일 발송 ──
     data.js 가 이번 커밋에 실제로 포함됐을 때만, 그리고 그 안에 아직 제목이
     남아 있는 공지만 보낸다(등록 후 버린 글이 메일로 나가는 일을 막는다). */
  function flushAlerts(ev) {
    var queue = alertQueue();
    if (!queue.length) return Promise.resolve(null);
    if (!ev || !ev.paths || ev.paths.indexOf('assets/js/data.js') < 0) return Promise.resolve(null);
    return Y.datamap.load().then(function () {
      var live = queue.filter(function (q) {
        var rows = Y.datamap.items(q.kind === 'grad' ? 'noticesGrad' : 'noticesUG');
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].item && String(rows[i].item.title) === q.title) return true;
        }
        return false;
      });
      if (!live.length) { setAlertQueue([]); return null; }
      return fetch(Y.config.api + '/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'notify', passcode: Y.session.passcode(), items: live })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, d: d }; });
      }).then(function (r) {
        if (r.d && r.d.ok) {
          setAlertQueue([]);
          Y.toast(r.d.total
            ? '메일 알림 — 구독자 ' + r.d.total + '명에게 새 공지를 보냈습니다' + (r.d.failed ? ' (실패 ' + r.d.failed + ')' : '') + '.'
            : '메일 알림 — 아직 구독자가 없어 보낼 곳이 없습니다.');
        } else if (r.status === 500) {
          // 서버에 발송 설정이 없다 — 큐를 들고 있어 봐야 같은 결과라 비운다
          setAlertQueue([]);
          Y.toast('메일 알림 서버 설정이 아직 없어 이번 공지는 메일로 나가지 않았습니다.', 'warn');
        } else {
          Y.toast('메일 알림 발송에 실패했습니다 — 다음 게시 때 다시 시도합니다.', 'warn');
        }
        return r;
      });
    }).catch(function () {
      Y.toast('메일 알림 발송에 실패했습니다 — 다음 게시 때 다시 시도합니다.', 'warn');
      return null;
    });
  }
  Y.bus.on('publish:done', flushAlerts);

  Y.posts = {
    KINDS: KINDS,
    /** 테스트·자동화용 — 폼을 거치지 않고 바로 등록한다. */
    add: function (coll, obj) { return Y.datamap.addItem(coll, obj, true); },
    remove: function (coll, index) { return Y.datamap.removeItem(coll, index); },
    kinds: function () { return KINDS.slice(); },
    /** 메일 알림 큐 — 검사·자동화용 */
    alertQueue: alertQueue,
    setAlertQueue: setAlertQueue,
    queueAlert: queueAlert,
    flushAlerts: flushAlerts
  };
})();
