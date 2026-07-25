/* YSME In-Place Studio — AI 수정 (키 등록 → 요청 → 변경안 토글 목록 → 항목별 점프·디프·승인)

   계약은 ../../STUDIO_SPEC.md 3·8절.

   설계 원칙 두 가지만 기억하면 된다.
   1) **컨텍스트로 문서 전체를 보내지 않는다.** engine.outline() 이 만든 [{idx,tag,id,text}] 목록만
      보낸다(선택 범위가 있으면 그 요소의 원문을 덧붙인다). 문서를 통째로 주고 통째로 받으면
      응답이 잘리는 순간 페이지가 파괴된다.
   2) **AI 응답은 제안일 뿐이다.** 승인 버튼을 누른 항목만, 그것도 적용 직전에 원문을 다시 검증한
      뒤에 초안에 반영한다. eid 는 페이지마다 다른 전순회 인덱스이므로 다른 페이지 항목은
      절대 여기서 적용하지 않는다(엔진 버퍼에는 현재 페이지 원문만 있다).

   계획(plan)은 IndexedDB 'plans' 에 저장되므로 페이지를 옮겨도 승인/거절 상태가 유지된다.
   API 키는 IndexedDB 'meta' 의 ai-config 레코드에만 두고, 화면·로그·에러 메시지에 남기지 않는다.
*/
(function () {
  'use strict';
  var Y = window.YStudio;
  if (!Y || Y.ai) return;
  var U = Y.util;

  /* ── 상수 ── */
  var PANEL_ID = 'ai';
  var CFG_KEY = 'ai-config';
  var SS_PLAN = 'ysme-ai-plan';        // 지금 보고 있는 계획 id (탭 단위)
  var SS_FOCUS = 'ysme-ai-focus';      // '<계획id>|<항목id>' — 페이지 이동 뒤 펼칠 항목
  var MAX_CHANGES = 10;
  var OUTLINE_MAX = 400;
  var OUTER_MAX = 6000;                // 선택 요소 원문 첨부 상한(문자)

  var PROVIDERS = [['gemini', 'Gemini (Google)'], ['claude', 'Claude (Anthropic)']];
  var MODELS = {
    gemini: [
      ['gemini-2.5-flash', 'gemini-2.5-flash (기본)'],
      ['gemini-2.5-flash-lite', 'gemini-2.5-flash-lite (가볍고 쿼터 여유)'],
      ['gemini-2.0-flash', 'gemini-2.0-flash']
    ],
    claude: [
      ['claude-sonnet-5', 'claude-sonnet-5 (기본)'],
      ['claude-opus-5', 'claude-opus-5 (정밀)']
    ]
  };
  var KEY_HINT = {
    gemini: '키는 aistudio.google.com 에서 무료로 발급받을 수 있습니다.',
    claude: '키는 console.anthropic.com 에서 발급합니다(유료 크레딧 필요).'
  };
  var OPS = {
    setText: '텍스트 수정',
    setAttr: '속성 수정',
    setStyle: '스타일 수정',
    replaceOuter: '요소 교체',
    insertAfter: '뒤에 삽입',
    remove: '요소 삭제'
  };
  var STATE_LABEL = { pending: '대기', approved: '승인', rejected: '거절' };

  /* ── 모듈 상태 ── */
  var st = {
    host: null,          // 패널 본문 요소
    view: 'key',         // 'key' | 'ask' | 'result'
    cfg: null,           // {provider, model, apiKey, ts}
    plan: null,          // 계획 레코드
    prompt: '',          // 요청 입력값(재렌더 후 복원)
    scope: 'page',       // 'page' | 'element'
    busy: false,
    error: '',
    expand: {},          // {항목id: true}
    nodes: {},           // {항목id: 항목 DOM}
    focusId: null        // 이동 후 펼칠 항목 id
  };

  /* ── 폴백 스타일 ──
     studio.css 가 .ys-ai-* 를 모를 수 있어 최소 레이아웃만 심는다.
     같은 특이도라면 나중 규칙이 이기므로, 이 블록을 head **첫 자식**으로 넣어
     studio.css 가 항상 덮어쓸 수 있게 한다(선택자는 단일 클래스만 쓴다). */
  var CSS = [
    '.ys-ai-panel{display:flex;flex-direction:column;gap:.7rem;font:400 .86rem/1.55 "Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;color:#12294f}',
    '.ys-ai-note{margin:0;font-size:.78rem;opacity:.72}',
    '.ys-ai-row{display:flex;gap:.4rem;align-items:center;flex-wrap:wrap}',
    '.ys-ai-field{display:flex;flex-direction:column;gap:.25rem}',
    '.ys-ai-label{font-weight:700;font-size:.76rem;letter-spacing:.01em}',
    '.ys-ai-input{width:100%;box-sizing:border-box;padding:.45rem .55rem;border:1px solid rgba(10,26,51,.22);border-radius:.35rem;background:#fff;color:#12294f;font:inherit}',
    '.ys-ai-text{width:100%;box-sizing:border-box;min-height:5.5rem;resize:vertical;padding:.45rem .55rem;border:1px solid rgba(10,26,51,.22);border-radius:.35rem;background:#fff;color:#12294f;font:inherit}',
    '.ys-ai-btn{padding:.4rem .7rem;border:1px solid #12294f;border-radius:.35rem;background:#12294f;color:#fff;font:700 .8rem/1.25 inherit;cursor:pointer}',
    '.ys-ai-btn2{padding:.4rem .7rem;border:1px solid rgba(10,26,51,.28);border-radius:.35rem;background:#fff;color:#12294f;font:700 .8rem/1.25 inherit;cursor:pointer}',
    '.ys-ai-strong{box-shadow:0 0 0 2px #b58a00}',
    '.ys-ai-item{border:1px solid rgba(10,26,51,.16);border-radius:.4rem;background:#fff;overflow:hidden}',
    '.ys-ai-head{display:flex;gap:.4rem;align-items:center;width:100%;box-sizing:border-box;padding:.45rem .55rem;border:0;background:transparent;text-align:left;cursor:pointer;font:inherit;color:inherit}',
    '.ys-ai-num{flex:none;font-weight:700;opacity:.55}',
    '.ys-ai-line{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.ys-ai-chip{flex:none;font-size:.7rem;font-weight:700;padding:.08rem .34rem;border-radius:.25rem;border:1px solid rgba(10,26,51,.2);background:#f2f4f8}',
    '.ys-ai-ok{background:#e4efe2}',
    '.ys-ai-no{background:#f2e3e1}',
    '.ys-ai-body{display:flex;flex-direction:column;gap:.45rem;padding:0 .55rem .6rem}',
    '.ys-ai-meta{font-size:.74rem;opacity:.75;word-break:break-all}',
    '.ys-ai-why{margin:0;font-size:.8rem}',
    '.ys-ai-diff{border:1px solid rgba(10,26,51,.14);border-radius:.3rem;overflow-x:auto;font:400 .76rem/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
    '.ys-ai-dline{display:flex;gap:.4rem;padding:.08rem .35rem;white-space:pre-wrap;word-break:break-word}',
    '.ys-ai-del{background:#fbeceb}',
    '.ys-ai-add{background:#eaf3ea}',
    '.ys-ai-sign{flex:none;font-weight:700;opacity:.6}',
    '.ys-ai-msg{margin:0;font-size:.76rem;white-space:pre-wrap}',
    '.ys-ai-err{color:#a8321f}',
    '.ys-ai-pre{margin:0;max-height:60vh;overflow:auto;white-space:pre-wrap;word-break:break-word;font:400 .78rem/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}'
  ].join('\n');

  var styled = false;
  function ensureStyle() {
    if (styled) return;
    styled = true;
    if (document.getElementById('ys-ai-fallback-css')) return;
    var head = document.head || document.documentElement;
    var s = document.createElement('style');
    s.id = 'ys-ai-fallback-css';
    s.setAttribute(Y.config.uiAttr, '');
    s.textContent = CSS;
    head.insertBefore(s, head.firstChild);
  }

  /* ── DOM 짧은 도우미 ── */
  function el(tag, cls, text) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (text != null) d.textContent = String(text);
    return d;
  }
  function btn(label, cls, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = cls || 'ys-ai-btn';
    b.textContent = label;
    b.addEventListener('click', fn);
    return b;
  }
  function field(labelText, control, hint) {
    var w = el('div', 'ys-ai-field');
    w.appendChild(el('span', 'ys-ai-label', labelText));
    w.appendChild(control);
    if (hint) w.appendChild(el('p', 'ys-ai-note', hint));
    return w;
  }
  function select(cls, pairs, cur) {
    var s = document.createElement('select');
    s.className = cls || 'ys-ai-input';
    for (var i = 0; i < pairs.length; i++) {
      var o = document.createElement('option');
      o.value = pairs[i][0];
      o.textContent = pairs[i][1];
      if (pairs[i][0] === cur) o.selected = true;
      s.appendChild(o);
    }
    return s;
  }
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function shorten(s, n) {
    var t = norm(s);
    return t.length > n ? t.slice(0, n) + '…' : t;
  }

  /* ── 설정(제공자·모델·키) ── */
  function loadCfg() {
    return Y.store.get('meta', CFG_KEY).then(function (rec) {
      st.cfg = (rec && rec.apiKey) ? rec : null;
      return st.cfg;
    }, function () { st.cfg = null; return null; });
  }
  function saveCfg(provider, model, apiKey) {
    var rec = { key: CFG_KEY, provider: provider, model: model, apiKey: apiKey, ts: Date.now() };
    st.cfg = rec;
    return Y.store.put('meta', rec);
  }
  function dropCfg() {
    st.cfg = null;
    return Y.store.del('meta', CFG_KEY);
  }

  /* ── 계획 저장/불러오기 ── */
  function savePlan() {
    if (!st.plan) return Promise.resolve();
    return Y.store.put('plans', st.plan);
  }
  function rememberPlan(id) {
    try { if (id) sessionStorage.setItem(SS_PLAN, id); else sessionStorage.removeItem(SS_PLAN); } catch (e) {}
  }

  /* ── 현재 페이지 판별 ── */
  function pageOf(ch) { return ch && ch.page ? ch.page : (st.plan && st.plan.basePage) || U.pagePath(); }
  function isHere(ch) { return pageOf(ch) === U.pagePath(); }
  function safePage(p) { return /^[A-Za-z0-9][A-Za-z0-9._-]*\.html?$/.test(String(p || '')); }

  function idxOf(ch) {
    if (!ch || !ch.target || ch.target.kind !== 'eid') return null;
    var m = /(\d+)/.exec(String(ch.target.value));
    return m ? parseInt(m[1], 10) : null;
  }

  /* 원문 조각. buf.els 는 engine.current() 가 노출하는 버퍼 필드다(원문 오프셋 표). */
  function outerOf(idx, limit) {
    var buf = Y.engine.current(), src = Y.engine.src();
    if (!buf || !buf.mapped || !buf.els || !src) return '';
    var e = buf.els[idx];
    if (!e) return '';
    var s = Y.source.outer(src, e);
    if (limit && s.length > limit) s = s.slice(0, limit) + '\n<!-- (이하 생략) -->';
    return s;
  }
  function elOf(idx) {
    var buf = Y.engine.current();
    return (buf && buf.mapped && buf.els) ? buf.els[idx] : null;
  }
  function nodeCount() {
    var buf = Y.engine.current();
    return (buf && buf.nodes) ? buf.nodes.length : -1;
  }
  function crumbText(idx) {
    var c = Y.engine.breadcrumb(idx) || [], out = [];
    for (var i = 0; i < c.length; i++) out.push(c[i].label);
    return out.join(' > ');
  }
  /* 선택 요소의 자손 중 아웃라인에 들어간 idx 목록 */
  function subIdx(selIdx, outline) {
    var buf = Y.engine.current(), out = [];
    if (!buf || !buf.nodes || !buf.nodes[selIdx]) return out;
    var root = buf.nodes[selIdx];
    for (var i = 0; i < outline.length; i++) {
      var n = buf.nodes[outline[i].idx];
      if (n && n !== root && root.contains && root.contains(n)) out.push(outline[i].idx);
    }
    return out;
  }

  /* ── 디프 표시 ── */
  function diffBlock(before, after) {
    var host = el('div', 'ys-ai-diff');
    var a = String(before == null ? '' : before), b = String(after == null ? '' : after);
    var D = Y.diff;
    if (D && typeof D.render === 'function') {
      var out = null;
      try {
        out = (typeof D.lines === 'function') ? D.render(D.lines(a, b)) : D.render(a, b);
      } catch (e1) { out = null; }
      if (out == null) {
        try { out = D.render(a, b); } catch (e2) { out = null; }
      }
      if (out && out.nodeType) { host.appendChild(out); return host; }
      if (typeof out === 'string' && out) { host.innerHTML = out; return host; }
    }
    /* diff.js 가 없거나 형태가 다를 때의 자체 표시(텍스트 노드만 쓴다) */
    function rows(text, cls, sign) {
      if (!text) return;
      var parts = String(text).split('\n');
      for (var i = 0; i < parts.length; i++) {
        var r = el('div', 'ys-ai-dline ' + cls);
        r.appendChild(el('span', 'ys-ai-sign', sign));
        r.appendChild(el('span', null, parts[i]));
        host.appendChild(r);
      }
    }
    rows(a, 'ys-ai-del', '−');
    rows(b, 'ys-ai-add', '+');
    if (!a && !b) host.appendChild(el('div', 'ys-ai-dline', '(표시할 내용이 없습니다)'));
    return host;
  }

  /* ── 스키마 (Gemini responseSchema 형식) ── */
  function planSchema() {
    var change = {
      type: 'OBJECT',
      properties: {
        id: { type: 'STRING', description: '항목 식별자. c1, c2 처럼 짧게.' },
        page: { type: 'STRING', description: '대상 페이지 파일명. 예: H-academic.html' },
        lang: { type: 'STRING', enum: ['ko', 'en'], description: '항상 ko (HTML 원문은 한국어).' },
        target: {
          type: 'OBJECT',
          properties: {
            kind: { type: 'STRING', enum: ['eid', 'dataPath', 'i18nKey'], description: "가능하면 항상 'eid'." },
            value: { type: 'STRING', description: '아웃라인의 idx 를 문자열로. 예: "231"' }
          },
          required: ['kind', 'value']
        },
        op: {
          type: 'STRING',
          enum: ['setText', 'setAttr', 'setStyle', 'replaceOuter', 'insertAfter', 'remove'],
          description: '가능하면 setText 를 쓴다.'
        },
        attr: { type: 'STRING', description: "op 가 setAttr 이면 속성 이름, setStyle 이면 CSS 속성 이름. 그 외에는 빈 문자열." },
        before: { type: 'STRING', description: '지금 값. 아웃라인에 적힌 텍스트를 그대로 옮긴다(추측 금지).' },
        after: { type: 'STRING', description: '바꿀 값. remove 면 빈 문자열.' },
        why: { type: 'STRING', description: '한 줄 근거(한국어).' }
      },
      required: ['id', 'page', 'lang', 'target', 'op', 'before', 'after', 'why']
    };
    return {
      type: 'OBJECT',
      properties: {
        summary: { type: 'STRING', description: '무엇을 왜 바꿨는지 2~3줄(한국어).' },
        changes: { type: 'ARRAY', items: change, description: '최대 10건.' }
      },
      required: ['summary', 'changes']
    };
  }

  /* ── 프롬프트 ── */
  function buildSystem(page) {
    return [
      '너는 연세대학교 기계공학부 웹사이트를 고치는 편집 보조다. 편집자의 요청을 "패치 계획"으로 바꾼다.',
      '',
      '규칙(반드시 지킨다):',
      '1. 한국어로 답한다. summary·why 도 한국어로 쓴다.',
      '2. 문서 전체를 반환하지 마라. 주어진 JSON 스키마의 변경안(패치)만 만든다. 항목은 최대 ' + MAX_CHANGES + '건.',
      '3. target.kind 는 항상 \'eid\' 를 우선 쓴다. target.value 에는 아웃라인의 idx 를 문자열로 적는다.',
      '4. 제공된 아웃라인에 없는 idx 를 만들어내지 마라. 대상이 확실하지 않으면 항목을 만들지 말고 summary 에 이유를 적는다.',
      '5. before 에는 아웃라인에 적힌 지금 값을 그대로 옮긴다(추측·재작성 금지). after 에는 바꿀 값만 적는다.',
      '6. op 는 setText 를 최우선으로 쓴다. 구조를 바꾸는 replaceOuter·insertAfter·remove 는 요청이 명시적으로 요구할 때만 쓴다.',
      '7. op 가 setAttr 이면 attr 에 속성 이름을, setStyle 이면 attr 에 CSS 속성 이름을 반드시 적는다.',
      '8. lang 은 항상 "ko" 로 적는다. HTML 파일의 진실은 한국어 원문이다.',
      '9. page 는 항상 "' + page + '" 로 적는다.',
      '',
      '사이트 톤(어기면 안 된다):',
      '- 연세 네이비(#0A1A33 계열) 기반의 절제된 학술 톤. 과장·홍보 문구·감탄사를 쓰지 않는다.',
      '- 이모지를 절대 쓰지 않는다.',
      '- 좌측 정렬을 유지한다. 가운데 정렬로 바꾸지 않는다.',
      '- 문장은 짧고 사실 위주로 쓴다. 학부·전공·연구분야의 공식 표기를 임의로 바꾸지 않는다.'
    ].join('\n');
  }

  function buildUser(promptText, page, outline, selIdx) {
    var L = [];
    L.push('현재 페이지: ' + page);
    L.push('편집 언어: ko (HTML 원문)');
    L.push('');
    L.push('[편집자 요청]');
    L.push(promptText);
    L.push('');
    L.push('[아웃라인] 이 페이지에서 텍스트를 담고 있는 요소 목록이다. idx 가 곧 eid 다.');
    L.push(JSON.stringify(outline));
    if (selIdx != null) {
      var info = Y.engine.info(selIdx);
      if (info) {
        L.push('');
        L.push('[선택 범위] 아래 요소와 그 자손만 수정 대상이다. eid=' + selIdx + ' · ' + info.label);
        var cb = crumbText(selIdx);
        if (cb) L.push('경로: ' + cb);
        var sub = subIdx(selIdx, outline);
        if (sub.length) L.push('선택 범위 안의 eid: ' + sub.join(', '));
        var outer = outerOf(selIdx, OUTER_MAX);
        if (outer) {
          L.push('원문:');
          L.push(outer);
        }
      }
    }
    return L.join('\n');
  }

  /* ── 응답 정규화 ── */
  function normPage(v, dflt) {
    var s = String(v == null ? '' : v).trim().replace(/^\.\//, '').replace(/[?#].*$/, '');
    if (s.indexOf('/') >= 0) s = s.split('/').pop();
    return /\.html?$/i.test(s) ? s : dflt;
  }

  function normChange(raw, i, page, seen) {
    if (!raw || typeof raw !== 'object') return null;
    var op = String(raw.op == null ? '' : raw.op).trim();
    if (!OPS[op]) return null;
    var t = raw.target || {};
    var value = String(t.value == null ? '' : t.value).trim();
    if (!value) return null;
    var kind = String(t.kind == null ? 'eid' : t.kind).trim();
    if (kind !== 'dataPath' && kind !== 'i18nKey') kind = 'eid';
    var id = String(raw.id == null ? '' : raw.id).trim() || ('c' + (i + 1));
    var base = id, k = 2;
    while (seen[id]) { id = base + '#' + k; k++; }
    seen[id] = true;
    return {
      id: id,
      page: normPage(raw.page, page),
      lang: (String(raw.lang == null ? 'ko' : raw.lang).toLowerCase() === 'en') ? 'en' : 'ko',
      target: { kind: kind, value: value },
      op: op,
      attr: String(raw.attr == null ? '' : raw.attr).trim(),
      before: raw.before == null ? '' : String(raw.before),
      after: raw.after == null ? '' : String(raw.after),
      why: raw.why == null ? '' : String(raw.why),
      state: 'pending',
      stale: false,
      msg: ''
    };
  }

  function normPlan(data, promptText, scope, page) {
    if (!data || typeof data !== 'object') return null;
    var arr = data.changes;
    if (!arr || typeof arr.length !== 'number') return null;     // 스키마 불일치
    var plan = {
      id: U.uid('plan'),
      ts: Date.now(),
      author: Y.session.author(),
      basePage: page,
      prompt: promptText,
      scope: scope,
      provider: st.cfg ? st.cfg.provider : '',
      model: st.cfg ? st.cfg.model : '',
      summary: typeof data.summary === 'string' ? data.summary : '',
      changes: [],
      dropped: 0
    };
    var seen = {};
    for (var i = 0; i < arr.length && plan.changes.length < MAX_CHANGES; i++) {
      var c = normChange(arr[i], i, page, seen);
      if (c) plan.changes.push(c);
    }
    plan.dropped = Math.max(0, arr.length - plan.changes.length);
    return plan;
  }

  /* ── 오류 안내 ── */
  function errText(err) {
    if (!err) return 'AI 호출에 실패했습니다.';
    var s = err.status, m = err.message || '';
    if (s === 401) return '공용 암호가 거부되었습니다(401). 페이지를 새로고침해 다시 로그인하세요.';
    if (s === 429) return '사용량(쿼터)을 초과했습니다(429). 잠시 뒤에 다시 시도하거나 더 가벼운 모델을 고르세요.' + (m ? '\n' + m : '');
    if (s === 413) return '요청이 너무 큽니다(413). 범위를 「선택한 요소」로 좁혀 주세요.';
    if (s === 0) return m || '서버에 연결할 수 없습니다. 네트워크를 확인하세요.';
    if (/잘렸/.test(m)) return '응답이 도중에 잘렸습니다. 한 번에 고칠 범위를 줄여 다시 요청하세요.';
    if (/JSON/.test(m)) return '응답이 약속한 형식(JSON)이 아닙니다. 요청을 더 구체적으로 적어 다시 시도하세요.\n' + m;
    return m || ('AI 호출 실패 (' + (s == null ? '?' : s) + ')');
  }

  /* ── 요청 ── */
  function requestPlan(sendBtn) {
    if (st.busy) return;
    if (!st.cfg || !st.cfg.apiKey) { st.view = 'key'; render(); return; }
    var promptText = String(st.prompt || '').trim();
    if (!promptText) { Y.toast('수정 요청을 적어 주세요.', 'warn'); return; }
    if (!Y.engine.mapped()) {
      Y.toast('이 페이지는 원문 정렬에 실패해 AI 수정을 쓸 수 없습니다.', 'error');
      return;
    }
    var page = U.pagePath();
    var outline = Y.engine.outline({ max: OUTLINE_MAX });
    if (!outline.length) { Y.toast('보낼 아웃라인이 비어 있습니다.', 'warn'); return; }

    var selIdx = null;
    if (st.scope === 'element' && Y.hud && typeof Y.hud.selection === 'function') {
      selIdx = Y.hud.selection();
      if (selIdx == null) { Y.toast('선택한 요소가 없습니다. 요소를 클릭해 선택하세요.', 'warn'); return; }
    }

    st.busy = true;
    st.error = '';
    var label0 = '';
    if (sendBtn) { label0 = sendBtn.textContent; sendBtn.disabled = true; sendBtn.textContent = '요청 중…'; }
    var stop = (Y.hud && Y.hud.busy) ? Y.hud.busy('AI 에게 변경안을 요청합니다…') : function () {};

    function done() {
      st.busy = false;
      try { stop(); } catch (e) {}
      if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = label0 || '변경안 받기'; }
    }

    Y.net.ai({
      provider: st.cfg.provider,
      model: st.cfg.model,
      apiKey: st.cfg.apiKey,
      system: buildSystem(page),
      messages: [{ role: 'user', content: buildUser(promptText, page, outline, selIdx) }],
      json: true,
      schema: planSchema(),
      temperature: 0.2,
      maxOutputTokens: 8192
    }).then(function (res) {
      var data = res && res.data;
      if (data == null && res && typeof res.text === 'string') {
        try { data = JSON.parse(res.text); } catch (e) { data = null; }
      }
      var plan = normPlan(data, promptText, st.scope, page);
      if (!plan) {
        st.error = '응답이 계약과 다릅니다(changes 배열을 찾을 수 없습니다). 요청을 조금 더 구체적으로 적어 다시 시도하세요.';
        done(); render(); return;
      }
      st.plan = plan;
      st.expand = {};
      st.view = 'result';
      rememberPlan(plan.id);
      savePlan();
      done();
      render();
      if (!plan.changes.length) Y.toast('적용할 변경안을 만들지 못했습니다. 요약을 확인하세요.', 'warn');
      else if (plan.dropped) Y.toast('형식이 맞지 않는 항목 ' + plan.dropped + '건을 걸렀습니다.', 'warn');
      else Y.toast('변경안 ' + plan.changes.length + '건을 받았습니다.');
    }, function (err) {
      st.error = errText(err);
      done();
      render();
    });
  }

  /* ── 적용 전 재검증 ──
     AI 가 본 원문과 지금 원문이 어긋나면(다른 편집·되돌리기·구조 변경) 엉뚱한 요소를 덮어쓴다.
     tag/text 를 대조해 어긋나면 거부한다. */
  function textMatch(actual, claimed) {
    var a = norm(actual), b = norm(claimed);
    if (!b) return true;
    if (a === b) return true;
    // outline 은 160자에서 잘라 '…' 를 붙인다 — 잘린 형태도 인정한다.
    var cut = b.replace(/(?:…|\.\.\.)$/, '');
    if (cut !== b && cut && a.indexOf(cut) === 0) return true;
    return false;
  }

  function verify(ch) {
    if (!Y.engine.mapped()) return { ok: false, msg: '이 페이지는 원문 정렬에 실패해 적용할 수 없습니다.' };
    var idx = idxOf(ch);
    if (idx == null) return { ok: false, msg: '대상 eid 를 읽을 수 없습니다: ' + ch.target.value };
    var info = Y.engine.info(idx);
    if (!info) return { ok: false, msg: '원문이 그 사이 바뀌었습니다 — eid ' + idx + ' 요소를 찾을 수 없습니다.' };

    var m = /^\s*<\s*([A-Za-z][A-Za-z0-9:-]*)/.exec(ch.before);
    if (m && m[1].toLowerCase() !== info.tag) {
      return { ok: false, msg: '원문이 그 사이 바뀌었습니다 — 대상은 <' + info.tag + '> 인데 변경안은 <' + m[1].toLowerCase() + '> 입니다.' };
    }

    if (ch.op === 'setText') {
      if (!info.isLeaf) return { ok: false, msg: '이 요소는 자식 요소를 담고 있어 텍스트만 바꿀 수 없습니다.' };
      if (!textMatch(info.text, ch.before)) {
        return { ok: false, msg: '원문이 그 사이 바뀌었습니다.\n지금 원문: ' + shorten(info.text, 90) };
      }
    } else if (ch.op === 'setAttr') {
      if (!ch.attr) return { ok: false, msg: '속성 이름(attr)이 없어 적용할 수 없습니다.' };
      var cur = info.attrs[ch.attr.toLowerCase()];
      if (ch.before && cur != null && !m && norm(cur) !== norm(ch.before)) {
        return { ok: false, msg: '원문이 그 사이 바뀌었습니다.\n지금 ' + ch.attr + '="' + shorten(cur, 70) + '"' };
      }
    } else if (ch.op === 'setStyle') {
      if (!ch.attr) return { ok: false, msg: 'CSS 속성 이름(attr)이 없어 적용할 수 없습니다.' };
    } else if (ch.op === 'remove' || ch.op === 'replaceOuter') {
      if (ch.before && !m && info.isLeaf && info.text && !textMatch(info.text, ch.before)) {
        return { ok: false, msg: '원문이 그 사이 바뀌었습니다.\n지금 원문: ' + shorten(info.text, 90) };
      }
    }
    return { ok: true, idx: idx, info: info };
  }

  /* 구조가 바뀌면 뒤쪽 eid 가 밀린다 — 남은 대기 항목에 표시만 해 둔다(검증이 최종 안전망이다). */
  function markStale(exceptId) {
    if (!st.plan) return;
    var cur = U.pagePath(), n = 0;
    for (var i = 0; i < st.plan.changes.length; i++) {
      var c = st.plan.changes[i];
      if (c.id === exceptId || c.state !== 'pending') continue;
      if (pageOf(c) !== cur) continue;
      c.stale = true; n++;
    }
    return n;
  }

  function applyChange(ch) {
    if (ch.state === 'approved') return { ok: false, msg: '이미 승인된 항목입니다.' };
    if (!isHere(ch)) {
      return { ok: false, jump: true, msg: '다른 페이지(' + pageOf(ch) + ') 항목입니다. 「이 위치로 이동」으로 그 페이지에 간 뒤 승인하세요.' };
    }
    if (ch.lang === 'en') {
      return { ok: false, msg: '영문 항목입니다. 영문 문장은 한/영 편집 패널에서 반영해야 합니다(HTML 은 한국어 원문만 담습니다).' };
    }
    if (ch.target.kind === 'dataPath') {
      return { ok: false, msg: 'data.js 가 그리는 데이터 항목입니다. 데이터 편집에서 직접 수정하세요.' };
    }
    if (ch.target.kind === 'i18nKey') {
      return { ok: false, msg: '번역 사전 항목입니다. 한/영 편집에서 수정하세요.' };
    }

    var v = verify(ch);
    if (!v.ok) return v;
    var idx = v.idx, info = v.info;

    // 이미 같은 값이면 성공으로 처리한다(중복 승인 방지).
    if (ch.op === 'setText' && norm(info.text) === norm(ch.after)) {
      return { ok: true, idx: idx, msg: '이미 같은 값이라 반영할 것이 없습니다.' };
    }

    var before = nodeCount(), ok = false;
    if (ch.op === 'setText') {
      ok = Y.engine.setText(idx, ch.after);
    } else if (ch.op === 'setAttr') {
      ok = Y.engine.setAttr(idx, ch.attr, ch.after);
    } else if (ch.op === 'setStyle') {
      ok = Y.engine.setStyleProp(idx, ch.attr, ch.after);
    } else if (ch.op === 'remove') {
      ok = Y.engine.removeEl(idx);
    } else if (ch.op === 'insertAfter') {
      if (!/^\s*</.test(ch.after)) return { ok: false, msg: '삽입할 마크업이 태그로 시작하지 않습니다.' };
      ok = Y.engine.insertAfter(idx, ch.after);
    } else if (ch.op === 'replaceOuter') {
      if (!/^\s*</.test(ch.after)) return { ok: false, msg: '교체할 마크업이 태그로 시작하지 않습니다.' };
      var e = elOf(idx);
      if (!e) return { ok: false, msg: '원문 구간을 찾을 수 없습니다.' };
      ok = Y.engine.applyRawSrc(Y.source.setOuter(Y.engine.src(), e, ch.after), 'ai:replaceOuter');
    }
    if (!ok) return { ok: false, msg: '변경이 적용되지 않았습니다(값이 이미 같거나 편집할 수 없는 요소입니다).' };

    var after = nodeCount();
    var structural = (before !== after);
    return { ok: true, idx: idx, structural: structural };
  }

  /* ── 항목 이동 ── */
  function jump(ch, jumpBtn) {
    if (isHere(ch)) {
      var idx = idxOf(ch);
      if (idx == null) { Y.toast('대상 eid 를 알 수 없습니다.', 'warn'); return; }
      if (!Y.engine.info(idx)) { Y.toast('이 페이지에서 대상 요소를 찾지 못했습니다.', 'warn'); return; }
      if (Y.hud && Y.hud.revealIdx) Y.hud.revealIdx(idx);
      return;
    }
    var page = pageOf(ch);
    if (!safePage(page)) { Y.toast('이동할 페이지 경로가 올바르지 않습니다: ' + page, 'error'); return; }
    if (jumpBtn) jumpBtn.disabled = true;
    savePlan().then(function () {
      try { sessionStorage.setItem(SS_FOCUS, st.plan.id + '|' + ch.id); } catch (e) {}
      rememberPlan(st.plan.id);
      var go = function () { location.href = page; };
      if (Y.engine && Y.engine.flush) Y.engine.flush().then(go, go); else go();
    }, function () {
      if (jumpBtn) jumpBtn.disabled = false;
      Y.toast('계획을 저장하지 못해 이동을 취소했습니다.', 'error');
    });
  }

  /* ── 화면: 키 등록 ── */
  function renderKey(host) {
    var provider = (st.cfg && st.cfg.provider) || 'gemini';
    if (!MODELS[provider]) provider = 'gemini';
    var model = (st.cfg && st.cfg.model) || MODELS[provider][0][0];

    host.appendChild(el('p', 'ys-ai-note',
      st.cfg ? 'AI 키가 등록되어 있습니다. 새 키를 넣으면 이전 키를 대체합니다.'
             : 'AI 수정을 쓰려면 먼저 API 키를 등록하세요. 키는 이 브라우저에만 저장되고 서버는 중계만 합니다.'));

    var pSel = select('ys-ai-input', PROVIDERS, provider);
    var mSel = select('ys-ai-input', MODELS[provider], model);
    var hint = el('p', 'ys-ai-note', KEY_HINT[provider]);

    pSel.addEventListener('change', function () {
      var p = pSel.value;
      while (mSel.firstChild) mSel.removeChild(mSel.firstChild);
      var list = MODELS[p] || [];
      for (var i = 0; i < list.length; i++) {
        var o = document.createElement('option');
        o.value = list[i][0];
        o.textContent = list[i][1];
        mSel.appendChild(o);
      }
      hint.textContent = KEY_HINT[p] || '';
    });

    var keyIn = document.createElement('input');
    keyIn.type = 'password';
    keyIn.className = 'ys-ai-input';
    keyIn.autocomplete = 'off';
    keyIn.spellcheck = false;
    keyIn.placeholder = 'API 키를 붙여 넣으세요';

    host.appendChild(field('제공자', pSel));
    host.appendChild(field('모델', mSel));
    var kf = field('API 키', keyIn);
    kf.appendChild(hint);
    host.appendChild(kf);

    var row = el('div', 'ys-ai-row');
    row.appendChild(btn('연결', 'ys-ai-btn', function () {
      var k = keyIn.value.replace(/\s+/g, '');
      keyIn.value = '';                                  // 입력칸은 즉시 비운다
      if (k.length < 8) { Y.toast('키가 너무 짧습니다. 다시 확인하세요.', 'error'); return; }
      saveCfg(pSel.value, mSel.value, k).then(function () {
        st.view = 'ask';
        Y.toast('AI 키를 등록했습니다.');
        render();
      }, function () { Y.toast('키를 저장하지 못했습니다.', 'error'); });
    }));
    if (st.cfg) {
      row.appendChild(btn('취소', 'ys-ai-btn2', function () { st.view = 'ask'; render(); }));
      row.appendChild(btn('키 삭제', 'ys-ai-btn2', function () {
        var ask = (Y.hud && Y.hud.confirm) ? Y.hud.confirm('저장된 AI 키를 삭제할까요?') : Promise.resolve(true);
        ask.then(function (yes) {
          if (!yes) return;
          dropCfg().then(function () { Y.toast('AI 키를 삭제했습니다.'); render(); });
        });
      }));
    }
    host.appendChild(row);
  }

  /* ── 화면: 요청 ── */
  function renderAsk(host) {
    var head = el('div', 'ys-ai-row');
    head.appendChild(el('span', 'ys-ai-chip', (st.cfg ? st.cfg.provider : '') + ' · ' + (st.cfg ? st.cfg.model : '')));
    head.appendChild(btn('키 변경', 'ys-ai-btn2', function () { st.view = 'key'; render(); }));
    if (st.plan) head.appendChild(btn('지난 변경안 보기', 'ys-ai-btn2', function () { st.view = 'result'; render(); }));
    host.appendChild(head);

    if (!Y.engine.mapped()) {
      var why = Y.engine.reason();
      host.appendChild(el('p', 'ys-ai-msg ys-ai-err',
        '이 페이지는 원문 정렬에 실패해 AI 수정을 쓸 수 없습니다.' + (why ? '\n(' + why + ')' : '')));
      return;
    }

    var ta = document.createElement('textarea');
    ta.className = 'ys-ai-text';
    ta.placeholder = '예) 대학원 소개 문단의 문장을 더 짧고 사실 위주로 다듬어 주세요.';
    ta.value = st.prompt || '';
    ta.addEventListener('input', function () { st.prompt = ta.value; });
    host.appendChild(field('수정 요청', ta));

    /* 범위 */
    var selIdx = (Y.hud && typeof Y.hud.selection === 'function') ? Y.hud.selection() : null;
    var selInfo = (selIdx != null) ? Y.engine.info(selIdx) : null;
    if (selIdx != null && !selInfo) selIdx = null;
    if (st.scope === 'element' && selIdx == null) st.scope = 'page';

    var name = U.uid('ys-scope');
    var box = el('div', 'ys-ai-row');
    function radio(value, label, disabled) {
      var w = document.createElement('label');
      w.className = 'ys-ai-row';
      var r = document.createElement('input');
      r.type = 'radio';
      r.name = name;
      r.value = value;
      r.checked = (st.scope === value);
      r.disabled = !!disabled;
      r.addEventListener('change', function () { if (r.checked) st.scope = value; });
      w.appendChild(r);
      w.appendChild(el('span', null, label));
      box.appendChild(w);
    }
    radio('page', '현재 페이지 (' + U.pagePath() + ')', false);
    radio('element', '선택한 요소' + (selInfo ? ' (' + selInfo.label + ')' : ''), selIdx == null);
    host.appendChild(field('범위', box,
      selIdx == null ? '요소를 클릭해 선택하면 범위를 좁힐 수 있습니다.' : '선택한 요소와 그 안쪽만 대상으로 합니다.'));

    var lang = 'ko';
    try { lang = (localStorage.getItem('ysme-lang') === 'en') ? 'en' : 'ko'; } catch (e) {}
    if (lang === 'en') {
      host.appendChild(el('p', 'ys-ai-note', '현재 화면이 영문 모드입니다. AI 수정은 한국어 원문(HTML)에 반영됩니다.'));
    }

    var row = el('div', 'ys-ai-row');
    var send = btn('변경안 받기', 'ys-ai-btn', function () { requestPlan(send); });
    row.appendChild(send);
    host.appendChild(row);

    host.appendChild(el('p', 'ys-ai-note',
      '페이지 전체 HTML 을 보내지 않습니다. 요소 개요(최대 ' + OUTLINE_MAX + '개)만 보내고, 받은 변경안은 승인한 항목만 초안에 반영됩니다.'));

    if (st.error) host.appendChild(el('p', 'ys-ai-msg ys-ai-err', st.error));
  }

  /* ── 화면: 결과(토글 목록) ── */
  function longView(title, text) {
    var pre = el('pre', 'ys-ai-pre', text);
    if (Y.hud && Y.hud.modal) Y.hud.modal({ title: title, body: pre, okLabel: '닫기', wide: true });
  }

  function itemLine(ch, i) {
    var head = OPS[ch.op] || ch.op;
    var body = ch.op === 'remove' ? shorten(ch.before, 44) : shorten(ch.after || ch.why, 56);
    var where = ch.target.kind === 'eid' ? ('eid ' + (idxOf(ch) == null ? '?' : idxOf(ch))) : ch.target.kind;
    var pre = isHere(ch) ? '' : '[' + pageOf(ch) + '] ';
    return (i + 1) + '. ' + pre + head + ' · ' + where + (body ? ' — ' + body : '');
  }

  function renderItem(ch, i) {
    var wrap = el('div', 'ys-ai-item');
    var open = !!st.expand[ch.id];

    var head = document.createElement('button');
    head.type = 'button';
    head.className = 'ys-ai-head';
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    head.appendChild(el('span', 'ys-ai-num', open ? '▾' : '▸'));
    head.appendChild(el('span', 'ys-ai-line', itemLine(ch, i)));
    head.appendChild(el('span', 'ys-ai-chip' + (ch.state === 'approved' ? ' ys-ai-ok' : ch.state === 'rejected' ? ' ys-ai-no' : ''),
      STATE_LABEL[ch.state] || ch.state));
    head.addEventListener('click', function () {
      st.expand[ch.id] = !st.expand[ch.id];
      refreshItem(ch, i);
    });
    wrap.appendChild(head);

    if (open) {
      var body = el('div', 'ys-ai-body');

      var meta = [];
      meta.push('페이지 ' + pageOf(ch));
      meta.push('op ' + (OPS[ch.op] || ch.op) + (ch.attr ? ' (' + ch.attr + ')' : ''));
      meta.push('대상 ' + ch.target.kind + ' ' + ch.target.value);
      var idx = idxOf(ch);
      if (isHere(ch) && idx != null) {
        var info = Y.engine.info(idx);
        if (info) {
          meta.push('경로 ' + (crumbText(idx) || info.label));
          if (info.runtime) meta.push('주의: 이 요소의 화면 텍스트는 런타임(' + info.runtime + ')이 덮어씁니다 — 파일에는 반영됩니다');
        } else {
          meta.push('경로 (현재 원문에서 찾을 수 없음)');
        }
      }
      body.appendChild(el('div', 'ys-ai-meta', meta.join(' · ')));

      if (ch.why) body.appendChild(el('p', 'ys-ai-why', ch.why));
      if (ch.stale) body.appendChild(el('p', 'ys-ai-msg ys-ai-err', '구조가 바뀌어 대상 위치가 밀렸을 수 있습니다. 승인 전에 「이 위치로 이동」으로 확인하세요.'));

      body.appendChild(diffBlock(ch.before, ch.after));

      if ((ch.before && ch.before.length > 600) || (ch.after && ch.after.length > 600)) {
        var full = el('div', 'ys-ai-row');
        full.appendChild(btn('기존 전체 보기', 'ys-ai-btn2', function () { longView('기존 값', ch.before); }));
        full.appendChild(btn('변경 전체 보기', 'ys-ai-btn2', function () { longView('변경 값', ch.after); }));
        body.appendChild(full);
      }

      var msg = el('p', 'ys-ai-msg', ch.msg || '');
      if (ch.msg && ch.state !== 'approved') msg.className = 'ys-ai-msg ys-ai-err';

      var acts = el('div', 'ys-ai-row');
      var jumpBtn = btn(isHere(ch) ? '이 위치로 이동' : '그 페이지로 이동', 'ys-ai-btn2', function () { jump(ch, jumpBtn); });
      acts.appendChild(jumpBtn);

      if (ch.state === 'approved') {
        acts.appendChild(el('span', 'ys-ai-note', '초안에 반영됨 (되돌리려면 Ctrl+Z)'));
      } else if (ch.state === 'rejected') {
        acts.appendChild(btn('거절 취소', 'ys-ai-btn2', function () {
          ch.state = 'pending'; ch.msg = '';
          savePlan(); refreshItem(ch, i);
        }));
      } else {
        acts.appendChild(btn('승인', 'ys-ai-btn', function () {
          var r = applyChange(ch);
          if (r.ok) {
            ch.state = 'approved';
            ch.stale = false;
            ch.msg = r.msg || '';
            var n = r.structural ? markStale(ch.id) : 0;
            savePlan();
            Y.toast(r.msg ? r.msg : '변경안을 초안에 반영했습니다.');
            if (r.structural && n) Y.toast('구조가 바뀌어 남은 ' + n + '건은 승인 전에 대상을 확인하세요.', 'warn');
            if (isHere(ch) && r.idx != null && Y.hud && Y.hud.revealIdx) Y.hud.revealIdx(r.idx);
          } else {
            ch.msg = r.msg || '적용하지 못했습니다.';
            Y.toast(ch.msg, 'error');
            if (r.jump) { jumpBtn.classList.add('ys-ai-strong'); try { jumpBtn.focus(); } catch (e) {} }
          }
          refreshItem(ch, i);
        }));
        acts.appendChild(btn('거절', 'ys-ai-btn2', function () {
          ch.state = 'rejected'; ch.msg = '';
          savePlan(); refreshItem(ch, i);
        }));
      }
      body.appendChild(acts);
      if (msg.textContent) body.appendChild(msg);
      wrap.appendChild(body);
    }

    st.nodes[ch.id] = wrap;
    return wrap;
  }

  function refreshItem(ch, i) {
    var old = st.nodes[ch.id];
    if (!old || !old.parentNode) { render(); return; }
    var next = renderItem(ch, i);
    old.parentNode.replaceChild(next, old);
  }

  function renderResult(host) {
    var plan = st.plan;
    var head = el('div', 'ys-ai-row');
    head.appendChild(btn('새 요청', 'ys-ai-btn2', function () { st.view = 'ask'; render(); }));
    head.appendChild(btn('키 변경', 'ys-ai-btn2', function () { st.view = 'key'; render(); }));
    head.appendChild(btn('계획 삭제', 'ys-ai-btn2', function () {
      var ask = (Y.hud && Y.hud.confirm) ? Y.hud.confirm('이 변경안 목록을 지울까요? 이미 승인한 편집은 초안에 남습니다.') : Promise.resolve(true);
      ask.then(function (yes) {
        if (!yes) return;
        var id = plan.id;
        st.plan = null; st.expand = {}; st.view = 'ask';
        rememberPlan(null);
        try { sessionStorage.removeItem(SS_FOCUS); } catch (e) {}
        Y.store.del('plans', id).then(render, render);
      });
    }));
    host.appendChild(head);

    var counts = { pending: 0, approved: 0, rejected: 0 };
    for (var i = 0; i < plan.changes.length; i++) counts[plan.changes[i].state]++;
    host.appendChild(el('div', 'ys-ai-meta',
      U.fmtTime(plan.ts) + ' · ' + plan.provider + ' ' + plan.model +
      ' · 승인 ' + counts.approved + ' · 거절 ' + counts.rejected + ' · 대기 ' + counts.pending));

    if (plan.prompt) host.appendChild(el('p', 'ys-ai-note', '요청: ' + shorten(plan.prompt, 160)));
    if (plan.summary) host.appendChild(el('p', 'ys-ai-why', plan.summary));
    if (plan.dropped) host.appendChild(el('p', 'ys-ai-note', '형식이 맞지 않아 걸러낸 항목: ' + plan.dropped + '건'));

    if (!plan.changes.length) {
      host.appendChild(el('p', 'ys-ai-msg', '적용할 변경안이 없습니다.'));
      return;
    }

    var list = el('div', 'ys-ai-field');
    st.nodes = {};
    for (var j = 0; j < plan.changes.length; j++) list.appendChild(renderItem(plan.changes[j], j));
    host.appendChild(list);

    /* 이동 후 복원: 해당 항목을 보이게 스크롤하고 대상을 강조한다.
       버퍼가 아직 열리지 않았으면 focusId 를 남겨 다음 렌더에서 강조한다. */
    if (st.focusId) {
      var fid = st.focusId;
      var target = st.nodes[fid];
      if (target) { try { target.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
      var ch = null;
      for (var k = 0; k < plan.changes.length; k++) if (plan.changes[k].id === fid) ch = plan.changes[k];
      if (!ch || !isHere(ch)) {
        st.focusId = null;
      } else if (Y.engine.mapped()) {
        st.focusId = null;
        var ti = idxOf(ch);
        if (ti != null && Y.engine.info(ti) && Y.hud && Y.hud.revealIdx) Y.hud.revealIdx(ti);
      }
    }
  }

  /* ── 렌더 진입점 ── */
  function render() {
    if (!st.host) return;
    ensureStyle();
    var host = st.host;
    while (host.firstChild) host.removeChild(host.firstChild);

    var root = el('div', 'ys-ai-panel');
    root.setAttribute(Y.config.uiAttr, '');
    host.appendChild(root);

    if (!st.cfg) st.view = 'key';
    else if (st.view === 'result' && !st.plan) st.view = 'ask';

    if (st.view === 'key') renderKey(root);
    else if (st.view === 'result') renderResult(root);
    else renderAsk(root);
  }

  /* ── 부팅: 계획 복원 + 이동 후 항목 펼치기 ── */
  function afterEngine(fn) {
    var done = false;
    function run() {
      if (done) return;
      done = true;
      try { fn(); } catch (e) {}
    }
    if (Y.engine && Y.engine.mapped()) { setTimeout(run, 120); return; }
    var h = Y.bus.on('buffer:open', function () {
      Y.bus.off('buffer:open', h);
      setTimeout(run, 120);
    });
    setTimeout(run, 1800);
  }

  function boot() {
    var focus = null, planId = null;
    try {
      focus = sessionStorage.getItem(SS_FOCUS);
      planId = sessionStorage.getItem(SS_PLAN);
    } catch (e) {}
    var wantPlan = null, wantChange = null;
    if (focus) {
      var p = String(focus).split('|');
      wantPlan = p[0]; wantChange = p[1] || null;
      try { sessionStorage.removeItem(SS_FOCUS); } catch (e2) {}
    }
    var id = wantPlan || planId;

    loadCfg().then(function () {
      st.view = st.cfg ? 'ask' : 'key';
      if (!id) { render(); return; }
      return Y.store.get('plans', id).then(function (rec) {
        if (!rec || !rec.changes) { rememberPlan(null); render(); return; }
        st.plan = rec;
        rememberPlan(rec.id);
        if (st.cfg) st.view = 'result';
        if (wantChange) {
          st.expand[wantChange] = true;
          st.focusId = wantChange;
          afterEngine(function () {
            if (Y.hud && Y.hud.openPanel) Y.hud.openPanel(PANEL_ID);
            render();
          });
        }
        render();
      }, function () { render(); });
    });
  }

  /* ── HUD 패널 등록 ── */
  function registerPanel() {
    Y.hud.registerPanel({
      id: PANEL_ID,
      title: 'AI 수정',
      icon: 'AI',
      order: 30,
      render: function (hostEl) { st.host = hostEl; render(); },
      onOpen: function () { render(); },
      onClose: function () {}
    });
    boot();
  }

  var tries = 0;
  (function whenHud() {
    if (Y.hud && typeof Y.hud.registerPanel === 'function') { registerPanel(); return; }
    if (++tries > 120) return;                    // 약 7초 — HUD 없이 쓰지 않는다
    setTimeout(whenHud, 60);
  })();

  /* 세션이 끊기면 계획 포인터만 지운다(계획 자체는 남긴다) */
  Y.bus.on('session:invalid', function () { rememberPlan(null); });

  Y.ai = {
    open: function () { if (Y.hud && Y.hud.openPanel) Y.hud.openPanel(PANEL_ID); },
    hasKey: function () { return !!(st.cfg && st.cfg.apiKey); },
    plan: function () { return st.plan; }
  };
})();
