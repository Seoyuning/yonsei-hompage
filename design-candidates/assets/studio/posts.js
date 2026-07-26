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

  /* ── 등록 가능한 글 종류 ── */
  var KINDS = [
    { coll: 'noticesUG', label: '학부 공지', where: '홈 공지사항 · 소식 페이지', pin: true },
    { coll: 'noticesGrad', label: '대학원 공지', where: '홈 공지사항(대학원 탭) · 소식 페이지', pin: true },
    { coll: 'newsList', label: '연구 소식 · 뉴스', where: '홈 연구 소식 · 소식 페이지', pin: false },
    { coll: 'seminars', label: '세미나', where: '홈 세미나 · 소식 페이지', pin: false },
    { coll: 'events', label: '행사', where: '소식 페이지 행사 목록', pin: false }
  ];

  var FIELD = {
    no: { label: '번호', hint: '"공지"로 두면 목록 맨 위에 고정 표시됩니다.' },
    title: { label: '제목', long: true, required: true },
    date: { label: '날짜', hint: 'YYYY.MM.DD' },
    url: { label: '링크', hint: '원문 주소(비우면 목록 페이지로 연결됩니다).' },
    att: { label: '첨부파일 있음' },
    thumb: { label: '썸네일 주소', hint: '이미지 URL. 비우면 글자만 나옵니다.' },
    place: { label: '장소' },
    time: { label: '시간' },
    speaker: { label: '연사' }
  };

  var STYLE_ID = 'ys-post-style';
  var host = null, curColl = KINDS[0].coll, inputs = null, listEl = null;

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
    if (key === 'no') return kindOf(coll).pin ? '공지' : nextNo(coll);
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
      '.ys-post-del:hover{background:#fdeceb}'
    ].join('');
    var st = doc.createElement('style');
    st.id = STYLE_ID;
    st.setAttribute(Y.config.uiAttr, '');
    st.textContent = css;
    (doc.head || doc.documentElement).appendChild(st);
  }

  /* ── 입력 폼 ── */
  function buildForm(body) {
    var shape = Y.datamap.shapeOf(curColl);
    inputs = [];
    if (!shape.length) {
      body.appendChild(mk('p', 'ys-warn', '이 목록의 항목 모양을 읽지 못했습니다(기존 항목이 없습니다).'));
      return;
    }
    for (var i = 0; i < shape.length; i++) {
      var key = shape[i].key, kind = shape[i].kind;
      var meta = FIELD[key] || { label: key };
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
        inp = mk('textarea', 'ys-ta');
        inp.rows = 3;
        inp.value = String(defaultFor(curColl, key, kind));
        wrap.appendChild(lab);
        wrap.appendChild(inp);
      } else {
        inp = mk('input', 'ys-in');
        inp.type = 'text';
        inp.value = String(defaultFor(curColl, key, kind));
        wrap.appendChild(lab);
        wrap.appendChild(inp);
      }
      body.appendChild(wrap);
      inputs.push({ key: key, kind: kind, inp: inp, meta: meta });
    }
  }

  function readForm() {
    var obj = {}, errs = [];
    for (var i = 0; i < inputs.length; i++) {
      var f = inputs[i], v;
      if (f.kind === 'bool') { obj[f.key] = !!f.inp.checked; continue; }
      v = String(f.inp.value == null ? '' : f.inp.value).replace(/\s+/g, ' ').trim();
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
          add.disabled = false;
          Y.toast(kindOf(curColl).label + ' 1건을 등록했습니다. 「게시」를 눌러야 사이트에 나갑니다.');
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

  Y.posts = {
    KINDS: KINDS,
    /** 테스트·자동화용 — 폼을 거치지 않고 바로 등록한다. */
    add: function (coll, obj) { return Y.datamap.addItem(coll, obj, true); },
    remove: function (coll, index) { return Y.datamap.removeItem(coll, index); },
    kinds: function () { return KINDS.slice(); }
  };
})();
