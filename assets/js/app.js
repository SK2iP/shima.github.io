/*
 * Progressive enhancement only. Everything below is optional chrome:
 * the CV renders and prints correctly with JavaScript disabled.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Theme toggle -------------------------------------------------- */
  /* The initial theme is set by an inline script in <head> to avoid a flash
     of the wrong theme; this only handles user-initiated changes. */
  var toggle = document.getElementById('theme-toggle');
  var toggleLabel = document.getElementById('theme-toggle-label');

  function syncToggle() {
    if (!toggle) return;
    var isDark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    var next = isDark ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    if (toggleLabel) toggleLabel.textContent = (isDark ? 'Light' : 'Dark') + ' theme';
  }

  if (toggle) {
    syncToggle();
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* storage unavailable (private mode) — theme still applies for this page */
      }
      syncToggle();
    });
  }

  /* Follow the OS if the visitor has not made an explicit choice. */
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var stored;
    try {
      stored = localStorage.getItem('theme');
    } catch (err) {
      stored = null;
    }
    if (stored === 'dark' || stored === 'light') return;
    root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    syncToggle();
  };
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onSchemeChange);
  }

  /* ---- Print --------------------------------------------------------- */
  var printButton = document.getElementById('print-button');
  if (printButton) {
    printButton.addEventListener('click', function () {
      window.print();
    });
  }

  /* Reveal the controls now that they do something. */
  var actions = document.getElementById('page-actions');
  if (actions) actions.hidden = false;

  /* ---- Section reveal ------------------------------------------------ */
  /* One motion idea, skipped entirely when the visitor asked for less motion
     or when IntersectionObserver is unavailable. */
  var wantsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (wantsMotion && 'IntersectionObserver' in window) {
    var sections = document.querySelectorAll('.main-wrapper .section');
    if (sections.length) {
      root.classList.add('js-reveal');
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
      );
      Array.prototype.forEach.call(sections, function (section) {
        observer.observe(section);
      });
    }
  }
})();
