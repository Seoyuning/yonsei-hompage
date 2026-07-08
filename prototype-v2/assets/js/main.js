/* ═══════════════════════════════════════════════════════════════════
   「機制 · Mechanism in Motion」 v2 — 공용 JS (vanilla, 의존성 0)
   로드 순서: data.js → main.js (둘 다 defer). file:// 에서 그대로 동작.
   기능: ① 테마 토글  ② 모바일 드로어(포커스 트랩)  ③ 검색 모달(Ctrl+K)
        ④ 스크롤 리빌(1회)  ⑤ 카운트업(ease-mech)  ⑥ 출처 스탬프(터치 대응)
        ⑦ KO/EN 토글(크롬 i18n)  ⑧ 스크롤 진행 치수선 폴백
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = window.YSME || {};

  /* ── ① 테마 토글 (초기 적용은 각 페이지 <head> 인라인 스크립트가 담당 = FOUC 방지) ── */
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'cyanotype' ? 'paper' : 'cyanotype';
      root.dataset.theme = next;
      themeBtn.setAttribute('aria-pressed', String(next === 'cyanotype'));
      try { localStorage.setItem('ysme-theme', next); } catch (e) {}
    });
    themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'cyanotype'));
  }

  /* ── 포커스 트랩 유틸 ── */
  function trapFocus(container, e) {
    var focusables = container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ── ② 모바일 드로어 ── */
  var drawer = document.getElementById('drawer');
  var burger = document.getElementById('burger');
  var lastFocus = null;
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', '');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var firstLink = drawer.querySelector('a,button');
    if (firstLink) firstLink.focus();
  }
  function closeDrawer() {
    if (!drawer || !drawer.hasAttribute('data-open')) return;
    drawer.removeAttribute('data-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (burger && drawer) {
    burger.addEventListener('click', openDrawer);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeDrawer();
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') trapFocus(drawer.querySelector('.drawer-panel'), e);
    });
  }

  /* ── ③ 검색 모달 (Ctrl/⌘+K · data.js 실검색: 교수/랩/소식/페이지) ── */
  var smodal = document.getElementById('searchModal');
  var sInput = document.getElementById('searchInput');
  var sResults = document.getElementById('searchResults');
  var sStatus = document.getElementById('searchStatus');
  var sSelected = -1;

  function buildIndex() {
    var idx = [];
    (D.professors || []).forEach(function (p) {
      var lab = (D.labs || []).find(function (l) { return l.id === p.labId; }) || {};
      idx.push({ group: '교수', title: p.ko + ' ' + p.rank, sub: (lab.ko || '') + ' · ' + p.en,
        text: (p.ko + ' ' + p.en + ' ' + (lab.ko || '') + ' ' + (lab.en || '')).toLowerCase(),
        href: p.storyPage || 'people.html#' + p.id });
    });
    (D.labs || []).forEach(function (l) {
      idx.push({ group: '연구실', title: l.ko, sub: l.pi + ' · ' + l.loc,
        text: (l.ko + ' ' + l.en + ' ' + l.pi).toLowerCase(), href: 'research.html#' + l.id });
    });
    (D.posts || []).slice(0, 40).forEach(function (n) {
      idx.push({ group: '소식', title: n.title, sub: n.cat + ' · ' + n.date,
        text: (n.title + ' ' + n.cat).toLowerCase(), href: 'news.html' });
    });
    (D.pages || []).forEach(function (pg) {
      idx.push({ group: '페이지', title: pg.title, sub: pg.desc,
        text: (pg.title + ' ' + pg.desc).toLowerCase(), href: pg.href });
    });
    (D.courses || []).forEach(function (c) {
      idx.push({ group: '교과목', title: c.code + ' ' + c.ko, sub: c.type,
        text: (c.code + ' ' + c.ko).toLowerCase(), href: 'academics.html' });
    });
    return idx;
  }
  var searchIndex = null;

  function hl(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, i)) + '<mark>' + escapeHtml(text.slice(i, i + q.length)) + '</mark>' + escapeHtml(text.slice(i + q.length));
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function runSearch(q) {
    if (!searchIndex) searchIndex = buildIndex();
    q = q.trim();
    sSelected = -1;
    if (!q) {
      sResults.innerHTML = '<div class="sempty">교수 · 연구실 · 공지 · 교과목 · 페이지를 검색합니다.</div>';
      if (sStatus) sStatus.textContent = '';
      sInput.setAttribute('aria-expanded', 'false');
      return;
    }
    var ql = q.toLowerCase();
    var hits = searchIndex.filter(function (it) { return it.text.indexOf(ql) > -1; }).slice(0, 24);
    if (!hits.length) {
      sResults.innerHTML = '<div class="sempty">‘' + escapeHtml(q) + '’ 결과 없음 — 다른 검색어를 입력해 보세요.</div>';
      if (sStatus) sStatus.textContent = '결과 0건';
      sInput.setAttribute('aria-expanded', 'false');
      return;
    }
    var html = '', lastGroup = '';
    hits.forEach(function (it, i) {
      if (it.group !== lastGroup) { html += '<div class="sgroup">' + it.group + '</div>'; lastGroup = it.group; }
      html += '<a class="sresult" role="option" id="sres-' + i + '" href="' + it.href + '">' +
        '<span class="st">' + hl(it.title, q) + '</span>' +
        '<span class="sd">' + escapeHtml(it.sub || '') + '</span></a>';
    });
    sResults.innerHTML = html;
    if (sStatus) sStatus.textContent = '결과 ' + hits.length + '건';
    sInput.setAttribute('aria-expanded', 'true');
  }

  function openSearch() {
    if (!smodal) return;
    lastFocus = document.activeElement;
    smodal.hidden = false;
    document.body.style.overflow = 'hidden';
    sInput.value = '';
    runSearch('');
    sInput.focus();
  }
  function closeSearch() {
    if (!smodal || smodal.hidden) return;
    smodal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function moveSelection(dir) {
    var opts = sResults.querySelectorAll('.sresult');
    if (!opts.length) return;
    if (sSelected >= 0 && opts[sSelected]) opts[sSelected].removeAttribute('aria-selected');
    sSelected = (sSelected + dir + opts.length) % opts.length;
    opts[sSelected].setAttribute('aria-selected', 'true');
    opts[sSelected].scrollIntoView({ block: 'nearest' });
    sInput.setAttribute('aria-activedescendant', opts[sSelected].id);
  }
  if (smodal && sInput) {
    document.querySelectorAll('[data-search-open]').forEach(function (b) { b.addEventListener('click', openSearch); });
    smodal.addEventListener('click', function (e) { if (e.target.closest('[data-search-close]')) closeSearch(); });
    sInput.addEventListener('input', function () { runSearch(sInput.value); });
    smodal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1); }
      else if (e.key === 'Enter') {
        var sel = sResults.querySelector('.sresult[aria-selected="true"]') || sResults.querySelector('.sresult');
        if (sel) { window.location.href = sel.getAttribute('href'); }
      } else if (e.key === 'Tab') trapFocus(smodal.querySelector('.smodal-panel'), e);
    });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (smodal && smodal.hidden) openSearch(); else closeSearch();
    }
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); closeAllStamps(); }
  });

  /* ── ④ 스크롤 리빌 — 정중동: 진입 시 1회만, 이후 정지 ── */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() { reveals.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); }
  else {
    var rio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
    setTimeout(showAll, 1800); /* 안전망: IO가 못 뜨면 강제 표시 */
  }

  /* ── ⑤ 카운트업 (ease-mech: 게이지 바늘 안착 오버슈트) ── */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = el.dataset.count; return; }
    var t0 = null, dur = 1100, c1 = 1.70158, c3 = c1 + 1;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); /* easeOutBack */
      el.textContent = Math.max(0, Math.round(target * e));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = el.dataset.count;
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target); animateCount(en.target);
        });
      }, { threshold: .5 });
      counters.forEach(function (el) { cio.observe(el); });
      setTimeout(function () {
        counters.forEach(function (el) { if (el.textContent === '0') el.textContent = el.dataset.count; });
      }, 2000);
    } else counters.forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ── ⑥ 출처 스탬프 — hover(CSS) + 클릭/터치/키보드(JS) ── */
  var stamps = document.querySelectorAll('.stamp > button');
  function closeAllStamps() {
    document.querySelectorAll('.stamp.open').forEach(function (s) {
      s.classList.remove('open');
      s.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  }
  stamps.forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wrap = btn.parentElement;
      var willOpen = !wrap.classList.contains('open');
      closeAllStamps();
      if (willOpen) { wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.stamp')) closeAllStamps();
  });

  /* ── ⑦ KO/EN 토글 — 사이트 크롬(내비·푸터·검색) 실전환. 본문은 KO 유지 명시 ── */
  var I18N = {
    ko: {
      'nav.about': '소개', 'nav.academics': '교육', 'nav.research': '연구',
      'nav.people': '구성원', 'nav.news': '소식', 'nav.admissions': '입학·진로',
      'ui.search': '검색', 'ui.skip': '본문 바로가기',
      'ftr.quick': '바로가기', 'ftr.policy': '정책·안내', 'ftr.spec': '이 사이트'
    },
    en: {
      'nav.about': 'About', 'nav.academics': 'Academics', 'nav.research': 'Research',
      'nav.people': 'People', 'nav.news': 'News', 'nav.admissions': 'Admissions',
      'ui.search': 'Search', 'ui.skip': 'Skip to content',
      'ftr.quick': 'QUICK LINKS', 'ftr.policy': 'POLICIES', 'ftr.spec': 'THIS SITE'
    }
  };
  function applyLang(lang) {
    var dict = I18N[lang] || I18N.ko;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    root.setAttribute('lang', lang);
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var note = document.getElementById('langNote');
    if (note) note.hidden = (lang !== 'en');
  }
  var langBtns = document.querySelectorAll('.lang button[data-lang]');
  if (langBtns.length) {
    langBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.dataset.lang);
        try { localStorage.setItem('ysme-lang', b.dataset.lang); } catch (e) {}
      });
    });
    var savedLang = null;
    try { savedLang = localStorage.getItem('ysme-lang'); } catch (e) {}
    if (savedLang && savedLang !== 'ko') applyLang(savedLang);
  }

  /* ── ⑧ 스크롤 진행 치수선 — CSS scroll-timeline 미지원 브라우저 폴백 ── */
  var rule = document.querySelector('.scroll-rule i');
  if (rule && !(window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()'))) {
    var ticking = false;
    function updateRule() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      rule.style.setProperty('--p', h > 0 ? (window.scrollY / h).toFixed(4) : 0);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateRule); }
    }, { passive: true });
    updateRule();
  }

  /* ── 공용 헬퍼 export (페이지별 스크립트에서 사용) ── */
  window.YSMEUI = {
    reduce: reduce,
    escapeHtml: escapeHtml,
    clusterOf: function (id) { return (D.clusters || []).find(function (c) { return c.id === id; }); },
    labOf: function (id) { return (D.labs || []).find(function (l) { return l.id === id; }); },
    fmtDate: function (iso) { return String(iso || '').replace(/-/g, '.'); },
    isNew: function (iso, days) {
      var ref = new Date((D.site && D.site.updated) || Date.now());
      return (ref - new Date(iso)) / 864e5 <= (days || 14);
    }
  };
})();
