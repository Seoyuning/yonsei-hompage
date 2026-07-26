/* datamap 의 배열 항목 추가·삭제를 실제 data.js 로 검사한다.
   목적: 새 항목을 넣어도 (1) JS 로 다시 평가되고 (2) 그 항목만 diff 로 잡히고
        (3) 삭제하면 바이트 단위로 원래대로 돌아오는지. */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8');

let fails = 0, pass = 0;
function ok(cond, label, extra) {
  if (cond) { pass++; console.log('  PASS  ' + label); }
  else { fails++; console.log('  FAIL  ' + label + (extra ? '\n        ' + extra : '')); }
}

/* ── datamap.js 를 실제 코드 그대로 올린다(스텁만 갈아 끼움) ── */
const drafts = {};
const Y = {
  util: { esc: s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) },
  config: { uiAttr: 'data-ys-ui' },
  bus: { emit() {}, on() {}, off() {} },
  toast() {},
  session: { author: () => '테스트' },
  engine: { headSha: () => 'sha-test' },
  store: {
    get: (s, k) => Promise.resolve(drafts[k] || null),
    put: (s, o) => { drafts[o.path] = o; return Promise.resolve(); },
    del: (s, k) => { delete drafts[k]; return Promise.resolve(); }
  },
  net: { read: () => Promise.resolve({ content: DATA, ref: 'main' }) }
};
const ctx = { window: { YStudio: Y }, document: { getElementById: () => null }, console, setTimeout, Promise };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/studio/datamap.js'), 'utf8'), ctx);
const dm = ctx.window.YStudio.datamap;

/** data.js 소스를 평가해 window.YSME 를 얻는다 — 구문이 깨지면 여기서 터진다. */
function evalData(src) {
  const c = { window: {} };
  vm.createContext(c);
  vm.runInContext(src, c);
  return c.window.YSME;
}

/* datamap 은 원문과 같아지면 초안을 지운다 → 초안 없음 = 원본과 동일. */
function draftSrc() {
  const d = drafts['assets/js/data.js'];
  return d ? d.src : DATA;
}
function hasDraft() { return !!drafts['assets/js/data.js']; }

(async function () {
  await dm.load();

  console.log('\n[1] 기존 파일 해석');
  const base = evalData(DATA);
  ok(!!base && Array.isArray(base.noticesUG), 'data.js 가 평가되고 noticesUG 배열이 있다');
  const beforeN = base.noticesUG.length;
  ok(dm.items('noticesUG').length === beforeN, 'items() 개수가 실제 배열과 같다 (' + beforeN + ')');

  console.log('\n[2] 항목 모양 읽기');
  const shape = dm.shapeOf('noticesUG');
  ok(shape.map(f => f.key).join(',') === 'no,title,date,url,att',
    'noticesUG 필드 = no,title,date,url,att', shape.map(f => f.key).join(','));
  ok(shape.find(f => f.key === 'att').kind === 'bool', 'att 는 불리언으로 인식된다');

  console.log('\n[3] 맨 앞에 등록');
  const NEW = {
    no: '공지', title: '테스트 공지 — "따옴표" 와 \\역슬래시 포함',
    date: '2026.07.26', url: 'https://example.com/a?b=1&c=2', att: true
  };
  await dm.addItem('noticesUG', NEW, true);
  const after = evalData(draftSrc());
  ok(!!after, '등록 후에도 data.js 가 구문 오류 없이 평가된다');
  ok(after.noticesUG.length === beforeN + 1, '항목이 1개 늘었다');
  ok(after.noticesUG[0].title === NEW.title, '맨 앞에 들어갔고 제목이 그대로다');
  ok(after.noticesUG[0].att === true, '불리언이 문자열로 바뀌지 않았다');
  ok(after.noticesUG[1].title === base.noticesUG[0].title, '기존 1번 글이 2번으로 밀렸다');
  ok(JSON.stringify(after.noticesGrad) === JSON.stringify(base.noticesGrad), '다른 배열은 건드리지 않았다');

  console.log('\n[4] diff 는 새 항목만');
  const a = DATA.split('\n'), b = draftSrc().split('\n');
  let head = 0;
  while (head < a.length && a[head] === b[head]) head++;
  let tail = 0;
  while (tail < a.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;
  const changed = b.length - tail - head;
  ok(a.length === b.length - 7, '줄 수가 항목 1개(7줄)만큼만 늘었다', `${a.length} → ${b.length}`);
  ok(changed === 7, '바뀐 구간이 새 항목 7줄뿐이다', '변경 줄 수 ' + changed);
  ok(b.slice(head, head + 7).every(l => /^ {2,3}[{"}]|^ {2,3}"/.test(l) || l.trim() === '{' || l.trim().startsWith('}')),
    '새 항목의 들여쓰기가 기존과 같다', JSON.stringify(b.slice(head, head + 7)));

  console.log('\n[5] 등록 표시(pending)');
  const rows = dm.items('noticesUG');
  ok(rows[0].pending === true, '새 항목은 미게시로 표시된다');
  ok(rows[1].pending === false, '기존 항목은 미게시가 아니다');

  console.log('\n[6] 삭제 왕복');
  await dm.removeItem('noticesUG', 0);
  ok(draftSrc() === DATA && !hasDraft(), "삭제하면 바이트 단위로 원본과 같아진다");

  console.log('\n[7] 다른 컬렉션 · 맨 뒤 등록 · 중간 삭제');
  for (const coll of ['newsList', 'seminars', 'events', 'noticesGrad']) {
    const n0 = dm.items(coll).length;
    await dm.addItem(coll, Object.fromEntries(dm.shapeOf(coll).map(f =>
      [f.key, f.kind === 'bool' ? false : (f.kind === 'number' ? 0 : 'X-' + coll)])), true);
    const d1 = evalData(draftSrc());
    ok(d1[coll].length === n0 + 1 && d1[coll][0].title === 'X-' + coll, coll + ' 등록 OK');
    await dm.removeItem(coll, 0);
    ok(draftSrc() === DATA && !hasDraft(), coll + ' 삭제 후 원본 복귀(초안도 사라짐)');
  }
  await dm.addItem('events', { no: '99', title: '맨뒤', date: '2026.01.01', url: '' }, false);
  const d2 = evalData(draftSrc());
  ok(d2.events[d2.events.length - 1].title === '맨뒤', '맨 뒤 등록이 마지막에 들어간다');
  await dm.removeItem('events', d2.events.length - 1);
  ok(draftSrc() === DATA && !hasDraft(), '마지막 항목 삭제 후 원본 복귀');
  const mid = Math.floor(evalData(DATA).seminars.length / 2);
  const midTitle = evalData(DATA).seminars[mid].title;
  await dm.removeItem('seminars', mid);
  const d3 = evalData(draftSrc());
  ok(d3.seminars.every(s => s.title !== midTitle), '중간 항목 삭제가 그 항목만 지운다');
  ok(d3.seminars.length === evalData(DATA).seminars.length - 1, '중간 삭제 후 개수 -1');

  console.log('\n────────────────────────────');
  console.log(fails ? `FAILED  ${fails}건 (통과 ${pass})` : `PASSED  ${pass}건`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('\n예외:', e); process.exit(1); });
