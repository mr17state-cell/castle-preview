/* Castle — site.js
   Nav state, mobile menu, scroll reveals, manifesto word-reveal,
   marquee duplication, Unicorn Studio (WebGL scenes) bootstrap. */

(function () {
  'use strict';

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

  /* ----- Scroll-in reveals (rise + fade, staggered within card groups) -----
     .reveal can be set in the HTML; common card/heading elements get it
     automatically so every page animates without per-file markup. */
  ['.feature-card', '.blog-card', '.team-card', '.section-header'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
  });

  // stagger: delay each element by its index among reveal-siblings
  document.querySelectorAll('.reveal').forEach(function (el) {
    var siblings = el.parentElement ? [].filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    }) : [el];
    var i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = (i * 0.12) + 's';
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Manifesto: words cascade bright when a block crosses ~60% of the
     viewport, and dim again on the way back up (matches the original) ----- */
  var blocks = document.querySelectorAll('.manifesto-block');
  if (blocks.length) {
    blocks.forEach(function (block) {
      var words = block.textContent.trim().split(/\s+/);
      block.textContent = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        span.style.setProperty('--d', (i * 0.04) + 's');
        block.appendChild(span);
        if (i < words.length - 1) block.appendChild(document.createTextNode(' '));
      });
    });

    var updateReveal = function () {
      var line = window.innerHeight * 0.62;
      blocks.forEach(function (block) {
        block.classList.toggle('lit', block.getBoundingClientRect().top < line);
      });
    };
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);
    updateReveal();
  }

  /* ----- Hero parallax: background scrolls at 70% speed (Framer speed=70) ----- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var parallaxTicking = false;
    var updateParallax = function () {
      parallaxTicking = false;
      var y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        heroBg.style.transform = 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)';
      }
    };
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        parallaxTicking = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
    updateParallax();
  }

  /* ----- Marquee: clone the group for a seamless loop, then set the
     animation duration from the measured width (original: 30px/s) ----- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    var group = track.querySelector('.marquee-group');
    if (!group) return;
    var clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    var setSpeed = function () {
      var w = group.getBoundingClientRect().width; // includes trailing gap
      if (w > 0) track.style.animationDuration = (w / 30) + 's';
    };
    if (document.readyState === 'complete') setSpeed();
    else window.addEventListener('load', setSpeed);
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
