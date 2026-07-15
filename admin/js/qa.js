/* qa.js — 현재 편집 중 페이지 품질 검사(접근성·링크).
   classic script. window.Admin.qa 에 부착.
   저장과 무관한 비차단 검사다. editor.getCleanHtml() 로 얻은 pristine 직렬화본을
   파싱해 검사하므로 사이트 JS 런타임 잔재(리빌 클래스·주입 노드)에 오염되지 않는다.
   결과는 core.js 의 Admin.modalShow 로 표시한다. */
(function () {
'use strict';

var Admin = window.Admin = window.Admin || {};
var U = Admin.util;

/* ── 요소 경로(간이 셀렉터, editor.elPath 와 유사) ── */
function elPath(el) {
  var parts = [];
  var cur = el, depth = 0;
  while (cur && cur.tagName && cur.tagName !== 'BODY' && cur.tagName !== 'HTML' && depth < 4) {
    var s = cur.tagName.toLowerCase();
    if (cur.id) s += '#' + cur.id;
    else if (cur.classList && cur.classList.length) s += '.' + cur.classList[0];
    parts.unshift(s);
    cur = cur.parentElement;
    depth += 1;
  }
  return parts.join(' › ') || '(문서 최상위)';
}

/* a/button 의 접근가능 텍스트 유무(텍스트·aria-label·title·img[alt]) */
function hasAccessibleText(el) {
  if ((el.textContent || '').trim()) return true;
  if ((el.getAttribute('aria-label') || '').trim()) return true;
  if ((el.getAttribute('title') || '').trim()) return true;
  var labelledby = el.getAttribute('aria-labelledby');
  if (labelledby && labelledby.trim()) return true;
  // 아이콘 대신 alt 있는 이미지가 들어있으면 접근명 확보
  var imgs = el.querySelectorAll('img[alt]');
  for (var i = 0; i < imgs.length; i++) {
    if ((imgs[i].getAttribute('alt') || '').trim()) return true;
  }
  return false;
}

/* ── 검사 본체 ──
   doc: 검사 대상 Document, pagePaths: fs.pages() 경로 집합 */
function inspect(doc, pagePaths) {
  var issues = [];   // {level:'error'|'warn', msg, path}
  function add(level, msg, el) {
    issues.push({ level: level, msg: msg, path: el ? elPath(el) : '' });
  }

  var pageSet = {};
  for (var i = 0; i < pagePaths.length; i++) pageSet[pagePaths[i]] = true;

  /* [오류] img alt 누락/빈값 */
  var imgs = doc.querySelectorAll('img');
  for (i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    if (!img.hasAttribute('alt') || !(img.getAttribute('alt') || '').trim()) {
      // alt="" (명시적 장식용 빈 alt)는 의도된 것일 수 있으나, 여기선 빈값도 지적한다.
      add('error', '이미지에 대체 텍스트(alt)가 없습니다.', img);
    }
  }

  /* [오류] 내부 링크 깨짐: 상대 *.html 이 pages 에 없음 / #id 인데 대상 id 없음 */
  var anchors = doc.querySelectorAll('a[href]');
  for (i = 0; i < anchors.length; i++) {
    var a = anchors[i];
    var href = (a.getAttribute('href') || '').trim();
    if (!href) continue;
    if (href.charAt(0) === '#') {
      var id = href.slice(1);
      if (id && !doc.getElementById(id)) {
        add('error', '문서 내 앵커 대상이 없습니다: ' + href, a);
      }
      continue;
    }
    // 외부/특수 스킴은 검사 대상 아님
    if (/^(https?:|mailto:|tel:|data:|blob:|\/\/|javascript:)/i.test(href)) continue;
    // 상대 경로에서 쿼리·해시 제거 후 .html 만 검사
    var bare = href.split('#')[0].split('?')[0];
    if (!bare) continue;               // href="#..." 는 위에서 처리됨
    if (/\.html?$/i.test(bare)) {
      if (!pageSet[bare]) {
        add('error', '내부 링크 대상 페이지가 없습니다: ' + bare, a);
      }
    }
  }

  /* [주의] h1 개수 · 제목 레벨 건너뜀 */
  var headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  var h1Count = 0, prevLevel = 0;
  for (i = 0; i < headings.length; i++) {
    var hEl = headings[i];
    var level = parseInt(hEl.tagName.slice(1), 10);
    if (level === 1) h1Count += 1;
    if (prevLevel && level > prevLevel + 1) {
      add('warn', '제목 레벨을 건너뜁니다: h' + prevLevel + ' 다음에 h' + level, hEl);
    }
    prevLevel = level;
  }
  if (h1Count === 0) {
    add('warn', '페이지에 h1 제목이 없습니다.', null);
  } else if (h1Count > 1) {
    add('warn', 'h1 제목이 ' + h1Count + '개입니다(정확히 1개 권장).', null);
  }

  /* [주의] a·button 접근가능 텍스트 없음 */
  var clickables = doc.querySelectorAll('a[href], button');
  for (i = 0; i < clickables.length; i++) {
    var c = clickables[i];
    if (!hasAccessibleText(c)) {
      add('warn', (c.tagName.toLowerCase() === 'a' ? '링크' : '버튼') +
        '에 읽을 수 있는 텍스트나 aria-label 이 없습니다.', c);
    }
  }

  return issues;
}

/* ── 결과 모달 ── */
function renderResult(issues) {
  var errors = issues.filter(function (x) { return x.level === 'error'; });
  var warns = issues.filter(function (x) { return x.level === 'warn'; });

  var html = '<p class="diff-modal-head mono">품질 검사 — ' +
    U.escapeHtml(Admin.editor.currentPath() || '현재 페이지') + '</p>';

  if (!issues.length) {
    html += '<p class="qa-pass">통과 — 발견된 문제가 없습니다.</p>' +
      '<p class="insp-note">이미지 대체 텍스트, 내부 링크, 제목 구조, 링크/버튼 접근명을 확인했습니다.</p>';
    Admin.modalShow(html, { okText: '닫기' });
    return;
  }

  html += '<p class="qa-summary mono">오류 ' + errors.length + '개 · 주의 ' + warns.length + '개</p>';

  function group(title, list, cls) {
    if (!list.length) return '';
    var out = '<div class="qa-group"><p class="qa-group-title ' + cls + '">' +
      U.escapeHtml(title) + ' (' + list.length + ')</p><ul class="qa-list">';
    for (var i = 0; i < list.length; i++) {
      out += '<li class="qa-item qa-item--' + list[i].level + '">' +
        '<span class="qa-msg">' + U.escapeHtml(list[i].msg) + '</span>' +
        (list[i].path ? '<span class="qa-path mono">' + U.escapeHtml(list[i].path) + '</span>' : '') +
        '</li>';
    }
    out += '</ul></div>';
    return out;
  }

  html += group('오류', errors, 'qa-group-title--error');
  html += group('주의', warns, 'qa-group-title--warn');
  html += '<p class="insp-note">비차단 검사입니다 — 저장에는 영향을 주지 않습니다. ' +
    '요소 경로를 참고해 캔버스에서 해당 요소를 찾아 수정하세요.</p>';

  Admin.modalShow(html, { okText: '닫기' });
}

/* ── 진입점 ── */
function run() {
  if (!Admin.fs.isReady()) { Admin.toast('먼저 사이트 폴더를 여세요.', 'err'); return; }
  if (!Admin.editor.currentPath()) { Admin.toast('먼저 검사할 페이지를 여세요.', 'err'); return; }

  var clean = Admin.editor.getCleanHtml();
  if (!clean) { Admin.toast('검사할 페이지 내용을 읽을 수 없습니다.', 'err'); return; }

  var doc = new DOMParser().parseFromString(clean, 'text/html');
  var pagePaths = Admin.fs.pages().map(function (p) { return p.path; });
  var issues = inspect(doc, pagePaths);
  renderResult(issues);
  Admin.audit.log('qa', Admin.editor.currentPath(),
    '품질 검사 — 문제 ' + issues.length + '개');
}

/* ── 배선 ── */
function wire() {
  var btn = document.getElementById('btnQa');
  if (btn && !btn.dataset.wired) {
    btn.dataset.wired = '1';
    btn.addEventListener('click', run);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wire);
} else {
  wire();
}

Admin.qa = { run: run };

})();
