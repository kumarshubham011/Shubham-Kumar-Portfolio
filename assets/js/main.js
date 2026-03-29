// main.js — keeps things small and readable.
// Each feature is its own function so it's easy to find and edit.

(function () {
  'use strict';

  // ── Mobile navigation ────────────────────────────────────────

  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    // Close the menu when clicking anywhere outside it
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) links.classList.remove('open');
    });
  }

  // ── Active nav link ──────────────────────────────────────────
  // Highlights the current page's link in the navbar

  function initActiveLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      // exact match for home, startsWith for other sections
      if (href === path || (href !== '/' && path.startsWith(href))) {
        link.classList.add('active');
      }
    });
  }

  // ── Focus mode (Shift + F) ───────────────────────────────────

  function initFocusMode() {
    const indicator = document.getElementById('focus-indicator');
    let on = false;

    try { on = localStorage.getItem('focusMode') === 'true'; } catch (e) {}
    if (on) document.body.classList.add('focus-mode');

    document.addEventListener('keydown', function (e) {
      // Don't fire while typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        on = !on;
        document.body.classList.toggle('focus-mode', on);

        if (indicator) {
          indicator.textContent = on ? 'Focus Mode On' : 'Focus Mode Off';
          indicator.classList.add('visible');
          clearTimeout(indicator._t);
          indicator._t = setTimeout(function () {
            indicator.classList.remove('visible');
          }, 2000);
        }

        try { localStorage.setItem('focusMode', on); } catch (e) {}
      }
    });
  }

  // ── Reading progress bar ─────────────────────────────────────
  // Only shown on post pages (where .post-content exists)

  function initReadingProgress() {
    if (!document.querySelector('.post-content')) return;

    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', function () {
      const total  = document.body.scrollHeight - window.innerHeight;
      const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── Mermaid diagrams ─────────────────────────────────────────
  // Mermaid.js is loaded in the <head> via CDN.
  // We just need to initialise it with our dark theme colours.

  function initMermaid() {
    if (typeof mermaid === 'undefined') return;

    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        // Match the GitHub dark palette from our CSS
        background:     '#161b22',
        primaryColor:   '#21262d',
        primaryBorderColor: '#30363d',
        primaryTextColor:   '#e6edf3',
        lineColor:      '#58a6ff',
        secondaryColor: '#161b22',
        tertiaryColor:  '#0d1117',
        edgeLabelBackground: '#161b22',
        fontFamily:     'ui-monospace, SFMono-Regular, monospace',
        fontSize:       '14px',
      },
      // Allows diagrams to scroll horizontally on mobile
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence:  { useMaxWidth: true },
    });
  }

  // ── Tag filter on blog page ──────────────────────────────────

  function initTagFilter() {
    const filter   = document.getElementById('tag-filter');
    const postList = document.getElementById('post-list');
    if (!filter || !postList) return;

    filter.addEventListener('click', function (e) {
      const btn = e.target.closest('.tag-btn');
      if (!btn) return;

      // Update active button
      filter.querySelectorAll('.tag-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const tag = btn.dataset.tag;

      // Show/hide posts
      postList.querySelectorAll('.post-card').forEach(function (card) {
        if (tag === 'all') {
          card.style.display = '';
        } else {
          const tags = (card.dataset.tags || '').split(' ');
          card.style.display = tags.includes(tag) ? '' : 'none';
        }
      });
    });
  }

  // ── Copy button on code blocks ───────────────────────────────
  // Adds a small "Copy" button to every fenced code block

  function initCopyButtons() {
    document.querySelectorAll('.post-content pre').forEach(function (pre) {
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.className = 'copy-btn';
      btn.style.cssText = [
        'position:absolute', 'top:.5rem', 'right:.5rem',
        'font-family:inherit', 'font-size:11px',
        'padding:2px 8px', 'border-radius:4px',
        'border:1px solid #30363d', 'background:#21262d',
        'color:#8b949e', 'cursor:pointer', 'opacity:0',
        'transition:opacity 150ms ease'
      ].join(';');

      pre.style.position = 'relative';
      pre.appendChild(btn);

      pre.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
      pre.addEventListener('mouseleave', function () { btn.style.opacity = '0'; });

      btn.addEventListener('click', function () {
        const code = pre.querySelector('code');
        if (!code) return;
        navigator.clipboard.writeText(code.innerText).then(function () {
          btn.textContent = 'Copied!';
          btn.style.color = '#3fb950';
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.style.color = '#8b949e';
          }, 2000);
        });
      });
    });
  }

  // ── Boot ─────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initActiveLink();
    initFocusMode();
    initReadingProgress();
    initMermaid();
    initTagFilter();
    initCopyButtons();

    console.log('Site loaded. Shift+F = focus mode.');
  });

}());
