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

  /* ----- Scroll-in reveals (rise + fade, like the original) -----
     .reveal can be set in the HTML; common card/heading elements get it
     automatically so every page animates without per-file markup.
     Original behavior: trigger at 50% visibility, run once, stagger
     siblings 0.2s apart — except blog cards, which all rise together. */
  ['.feature-card', '.blog-card', '.team-card', '.section-header'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add('reveal'); });
  });

  // stagger: delay each element by its index among reveal-siblings
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (el.classList.contains('blog-card')) return; // original: no stagger on blog cards
    var siblings = el.parentElement ? [].filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    }) : [el];
    var i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = (i * 0.2) + 's';
  });

  // the first product panel rises too (original: delay 0.2s, fires as soon
  // as any pixel is visible; the other panels stay static)
  var firstPanelCard = document.querySelector('.product-panel .product-card');
  if (firstPanelCard) {
    firstPanelCard.classList.add('reveal');
    firstPanelCard.style.transitionDelay = '0.2s';
    firstPanelCard.setAttribute('data-reveal-eager', '');
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var makeObserver = function (threshold) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            obs.unobserve(en.target);
          }
        });
      }, { threshold: threshold });
      return obs;
    };
    var ioHalf = makeObserver(0.5);
    var ioEager = makeObserver(0);
    revealEls.forEach(function (el) {
      (el.hasAttribute('data-reveal-eager') ? ioEager : ioHalf).observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----- Manifesto: each word's brightness is a pure function of scroll.
     As a block's top edge travels from 75% to 50% of the viewport height,
     its words go 0.1 → 1 one after another (word i of n lights over the
     [i/n, (i+1)/n] slice of that range). Stop scrolling and the reveal
     freezes mid-word; scroll up and it reverses — same as the original. ----- */
  var blocks = document.querySelectorAll('.manifesto-block');
  if (blocks.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var blockWords = [];
    blocks.forEach(function (block) {
      var words = block.textContent.trim().split(/\s+/);
      block.textContent = '';
      var spans = words.map(function (word, i) {
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        block.appendChild(span);
        if (i < words.length - 1) block.appendChild(document.createTextNode(' '));
        return span;
      });
      blockWords.push({ block: block, spans: spans });
    });

    var revealTicking = false;
    var updateReveal = function () {
      revealTicking = false;
      var start = window.innerHeight * 0.75;
      var range = window.innerHeight * 0.25;
      blockWords.forEach(function (item) {
        var wordsLit = (start - item.block.getBoundingClientRect().top) / range * item.spans.length;
        item.spans.forEach(function (w, i) {
          var t = wordsLit - i;
          w.style.opacity = t <= 0 ? '0.1' : t >= 1 ? '1' : (0.1 + 0.9 * t).toFixed(3);
        });
      });
    };
    window.addEventListener('scroll', function () {
      if (!revealTicking) {
        revealTicking = true;
        requestAnimationFrame(updateReveal);
      }
    }, { passive: true });
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
