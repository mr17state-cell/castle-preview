/* Castle — site.js
   Nav state, mobile menu, scroll reveals, manifesto word-reveal,
   marquee duplication, Unicorn Studio (WebGL scenes) bootstrap. */

(function () {
  'use strict';

  /* ----- Nav: translucent bar once scrolled ----- */
  var nav = document.querySelector('.site-nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Mobile menu ----- */
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  }

  /* ----- Generic scroll-in reveals ----- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Manifesto: word-by-word reveal tied to scroll ----- */
  var blocks = document.querySelectorAll('.manifesto-block');
  if (blocks.length) {
    blocks.forEach(function (block) {
      var words = block.textContent.trim().split(/\s+/);
      block.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        block.appendChild(span);
        if (i < words.length - 1) block.appendChild(document.createTextNode(' '));
      });
    });

    var updateReveal = function () {
      var vh = window.innerHeight;
      blocks.forEach(function (block) {
        var r = block.getBoundingClientRect();
        // 0 when block top is at 88% of viewport, 1 when at 38%
        var progress = (vh * 0.88 - r.top) / (vh * 0.5);
        progress = Math.max(0, Math.min(1, progress));
        var words = block.querySelectorAll('.w');
        var lit = Math.round(progress * words.length);
        words.forEach(function (w, i) { w.classList.toggle('lit', i < lit); });
      });
    };
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);
    updateReveal();
  }

  /* ----- Marquee: duplicate track content for a seamless loop ----- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
    track.setAttribute('aria-hidden', 'false');
  });

  /* ----- Unicorn Studio scenes (WebGL backgrounds) ----- */
  if (document.querySelector('[data-us-project],[data-us-project-src]')) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js';
    s.async = true;
    s.onload = function () {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    document.head.appendChild(s);
  }
})();
