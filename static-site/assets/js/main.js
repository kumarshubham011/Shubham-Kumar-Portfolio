(function() {
  'use strict';

  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;
    toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) navLinks.classList.remove('active');
    });
  }

  function initFocusMode() {
    const indicator = document.getElementById('focus-indicator');
    let focusModeActive = localStorage.getItem('focusMode') === 'true';
    document.body.classList.toggle('focus-mode', focusModeActive);
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        focusModeActive = !focusModeActive;
        document.body.classList.toggle('focus-mode', focusModeActive);
        if (indicator) {
          indicator.classList.add('visible');
          indicator.textContent = focusModeActive ? 'Focus Mode On' : 'Focus Mode Off';
          setTimeout(() => indicator.classList.remove('visible'), 1500);
        }
        localStorage.setItem('focusMode', String(focusModeActive));
      }
    });
  }

  function initActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if ((page === 'home' && href === 'index.html') || href.includes(`${page}.html`)) {
        link.style.color = 'var(--color-text)';
        link.style.backgroundColor = 'var(--color-surface)';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initFocusMode();
    initActiveNav();
  });
})();
