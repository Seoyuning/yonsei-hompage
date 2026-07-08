/* ═══════════════════════════════════════════════════════════════════
   연세대학교 기계공학부 — Editorial Institute  v3.0 공용 JS
   vanilla · 의존성 0 · file:// 직접 동작. 로드: data.js → main.js (defer).
   기능: ① 테마 토글  ② 헤더 축소  ③ 모바일 오버레이(포커스트랩)
        ④ 검색 모달(Ctrl/⌘+K)  ⑤ 스크롤 리빌(1회, stagger)
        ⑥ 카운트업  ⑦ KO/EN i18n 토글
   접근성: 모든 오버레이 포커스 트랩 · Esc 닫기 · reduced-motion 가드.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = window.YSME || {};
  var lastFocus = null;

  /* ── 포커스 트랩 유틸 ── */
  function focusables(container) {
    return container.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
    );
  }
  function trapFocus(container, e) {
    var f = focusables(container);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ── ① 테마 토글 (초기 적용 = <head> 인라인 스크립트, FOUC 방지) ── */
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    var syncTheme = function () {
      themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    };
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      syncTheme();
      try { localStorage.setItem('ysme-theme', next); } catch (e) {}
    });
    syncTheme();
  }

  /* ── ② 헤더 축소 (스크롤 시 .is-scrolled) ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var scrolled = false;
    var onScroll = function () {
      var s = window.scrollY > 12;
      if (s !== scrolled) { scrolled = s; header.classList.toggle('is-scrolled', s); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── ③ 모바일 풀스크린 오버레이 메뉴 ── */
  var menu = document.getElementById('mobileMenu');
  var toggle = document.getElementById('navToggle');
  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.setAttribute('data-open', '');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var f = focusables(menu);
    if (f.length) f[0].focus();
  }
  function closeMenu() {
    if (!menu || !menu.hasAttribute('data-open')) return;
    menu.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (menu.hasAttribute('data-open')) closeMenu(); else openMenu();
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeMenu(); });
    menu.addEventListener('keydown', function (e) { if (e.key === 'Tab') trapFocus(menu, e); });
  }

  /* ── ④ 검색 모달 (Ctrl/⌘+K · data.js 실검색) ── */
  var smodal = document.getElementById('searchModal');
  var sInput = document.getElementById('searchInput');
  var sResults = document.getElementById('searchResults');
  var sStatus = document.getElementById('searchStatus');
  var sSelected = -1;
  var searchIndex = null;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hl(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, i)) + '<mark>' + escapeHtml(text.slice(i, i + q.length)) +
      '</mark>' + escapeHtml(text.slice(i + q.length));
  }
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
  function runSearch(q) {
    if (!sResults) return;
    if (!searchIndex) searchIndex = buildIndex();
    q = (q || '').trim();
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
        if (sel) window.location.href = sel.getAttribute('href');
      } else if (e.key === 'Tab') trapFocus(smodal.querySelector('.search-panel'), e);
    });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (smodal && smodal.hidden) openSearch(); else closeSearch();
    }
    if (e.key === 'Escape') { closeSearch(); closeMenu(); }
  });

  /* ── ⑤ 스크롤 리빌 — 진입 시 1회, stagger(형제 순번 × 70ms) ── */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() { reveals.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); }
  else {
    var rio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (!el.style.getPropertyValue('--reveal-delay')) {
          var sibs = Array.prototype.slice.call((el.parentNode || document).children).filter(function (n) {
            return n.classList && n.classList.contains('reveal');
          });
          var i = Math.max(0, sibs.indexOf(el));
          el.style.setProperty('--reveal-delay', Math.min(i, 6) * 70 + 'ms');
        }
        el.classList.add('in');
        obs.unobserve(el);
      });
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(function (el) { rio.observe(el); });
    setTimeout(showAll, 1800); /* 안전망 */
  }

  /* ── ⑥ 카운트업 (easeOutBack 안착) ── */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = el.dataset.count; return; }
    var t0 = null, dur = 1100, c1 = 1.70158, c3 = c1 + 1;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
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

  /* ── ⑦ KO/EN 토글 — 사이트 크롬(내비·푸터·UI) 실전환. 본문은 KO 유지 ── */
  var I18N = {
    ko: {
      'nav.about': '소개', 'nav.academics': '교육', 'nav.research': '연구',
      'nav.people': '구성원', 'nav.news': '소식', 'nav.admissions': '입학·진로',
      'ui.search': '검색', 'ui.skip': '본문 바로가기', 'ui.menu': '메뉴', 'ui.lang': '언어',
      'ftr.quick': '바로가기', 'ftr.about': '소개', 'ftr.policy': '정책·안내'
    },
    en: {
      'nav.about': 'About', 'nav.academics': 'Academics', 'nav.research': 'Research',
      'nav.people': 'People', 'nav.news': 'News', 'nav.admissions': 'Admissions',
      'ui.search': 'Search', 'ui.skip': 'Skip to content', 'ui.menu': 'Menu', 'ui.lang': 'Language',
      'ftr.quick': 'Quick Links', 'ftr.about': 'About', 'ftr.policy': 'Policies'
    }
  };
  function applyLang(lang) {
    var dict = I18N[lang] || I18N.ko;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
    root.setAttribute('lang', lang);
    document.querySelectorAll('.lang-toggle button[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var note = document.getElementById('langNote');
    if (note) note.hidden = (lang !== 'en');
  }
  var langBtns = document.querySelectorAll('.lang-toggle button[data-lang]');
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
    },
    /* 재사용 가능한 mono 라인아트 SVG (플레이스홀더 .ph-art 용) */
    lineArt: function (kind) {
      var arts = {
        gear: '<circle cx="100" cy="70" r="34"/><circle cx="100" cy="70" r="14"/>' +
              '<g stroke-width="1">' + [0,45,90,135,180,225,270,315].map(function(a){var r=a*Math.PI/180;return '<line x1="'+(100+Math.cos(r)*34).toFixed(1)+'" y1="'+(70+Math.sin(r)*34).toFixed(1)+'" x2="'+(100+Math.cos(r)*44).toFixed(1)+'" y2="'+(70+Math.sin(r)*44).toFixed(1)+'"/>';}).join('') + '</g>',
        turbine: '<circle cx="100" cy="70" r="10"/>' + [0,60,120,180,240,300].map(function(a){var r=a*Math.PI/180;return '<path d="M100 70 Q'+(100+Math.cos(r)*22)+' '+(70+Math.sin(r)*22)+' '+(100+Math.cos(r+.5)*46)+' '+(70+Math.sin(r+.5)*46)+'"/>';}).join(''),
        arm: '<path d="M40 118 L40 96 L92 60 L150 74 L150 52"/><circle cx="40" cy="96" r="6"/><circle cx="92" cy="60" r="5"/><circle cx="150" cy="74" r="5"/><path d="M144 46 h12 v10 h-12z"/>',
        wave: '<path d="M20 70 Q45 30 70 70 T120 70 T170 70"/><path d="M20 90 Q45 50 70 90 T120 90 T170 90" stroke-width="1"/><line x1="20" y1="70" x2="20" y2="110"/><line x1="170" y1="70" x2="170" y2="110"/>',
        grid: '<path d="M40 40 h120 v60 h-120z"/><line x1="40" y1="70" x2="160" y2="70" stroke-width="1"/><line x1="80" y1="40" x2="80" y2="100" stroke-width="1"/><line x1="120" y1="40" x2="120" y2="100" stroke-width="1"/><circle cx="80" cy="70" r="4"/><circle cx="120" cy="70" r="4"/>'
      };
      var body = arts[kind] || arts.gear;
      return '<svg class="ph-art" viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' + body + '</svg>';
    }
  };
})();
