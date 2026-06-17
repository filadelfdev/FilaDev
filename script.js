/* =========================================================
   WHATDASH — script.js
   Handles: navbar scroll, mobile menu, hero profit counter,
   terminal animation, scroll reveals, FAQ accordion,
   platform bar animations.
   ========================================================= */

'use strict';

/* =========================================================
   1. NAVBAR — scroll effect + mobile toggle
   ========================================================= */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  /* Scroll state */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Mobile toggle */
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  /* Close mobile menu when a link is clicked */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
})();


/* =========================================================
   2. HERO PROFIT COUNTER — animated count-up
   ========================================================= */
(function initProfitCounter() {
  const el       = document.getElementById('heroProfit');
  const target   = 4287.50;
  const duration = 2200; // ms
  const fps      = 60;
  const steps    = (duration / 1000) * fps;
  const increment= target / steps;
  let   current  = 0;
  let   raf;

  function tick() {
    current = Math.min(current + increment, target);
    el.textContent = '$' + current.toFixed(2);
    if (current < target) {
      raf = requestAnimationFrame(tick);
    }
  }

  /* Start when hero is visible (immediately for above-fold) */
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        // short delay so the page paints first
        setTimeout(() => requestAnimationFrame(tick), 400);
      }
    },
    { threshold: 0.2 }
  );
  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);
})();


/* =========================================================
   3. TERMINAL ANIMATION — scroll-triggered typewriter
   ========================================================= */
(function initTerminal() {
  const LINES = [
    { delay: 0,    cls: 'terminal__line--system',  text: 'WhatDash Live Tracker — Session started' },
    { delay: 500,  cls: 'terminal__line--muted',   text: 'Platform: Whatnot  ·  12:04:33 PM' },
    { delay: 1000, cls: 'terminal__line--blank',   text: ' ' },
    { delay: 1400, cls: 'terminal__line--action',  text: '► Sale registered: Vintage Coach Bag × 1' },
    { delay: 1800, cls: 'terminal__line--profit',  text: '  Revenue  +$145.00  Cost  -$62.00  Profit  +$83.00' },
    { delay: 2600, cls: 'terminal__line--action',  text: '► Sale registered: Y2K Levi Jeans × 2' },
    { delay: 3000, cls: 'terminal__line--profit',  text: '  Revenue  +$90.00   Cost  -$34.00  Profit  +$56.00' },
    { delay: 3800, cls: 'terminal__line--action',  text: '► Sale registered: Nike SB Dunk Low × 1' },
    { delay: 4200, cls: 'terminal__line--profit',  text: '  Revenue  +$280.00  Cost  -$110.00  Profit  +$170.00' },
    { delay: 5000, cls: 'terminal__line--blank',   text: ' ' },
    { delay: 5200, cls: 'terminal__line--system',  text: '─────────────────────────────────────' },
    { delay: 5400, cls: 'terminal__line--summary', text: '  Sales: 4  ·  Revenue: $515.00  ·  Profit: $309.00' },
    { delay: 5800, cls: 'terminal__line--margin',  text: '  Margin: 59.9%  ·  Running 00:47:12' },
    { delay: 6200, cls: 'terminal__line--system',  text: '─────────────────────────────────────' },
    { delay: 7000, cls: 'terminal__line--cursor',  text: '' },
  ];

  const body       = document.getElementById('terminalBody');
  const replayBtn  = document.getElementById('replayBtn');
  let   timers     = [];
  let   hasRun     = false;

  function buildLines() {
    body.innerHTML = '';
    LINES.forEach(line => {
      const div = document.createElement('div');
      div.className = 'terminal__line ' + line.cls;
      if (line.cls === 'terminal__line--cursor') {
        const cursor = document.createElement('span');
        cursor.className = 'terminal__cursor';
        div.appendChild(cursor);
      } else {
        div.textContent = line.text;
      }
      body.appendChild(div);
    });
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function run() {
    clearTimers();
    buildLines();
    const lineEls = body.querySelectorAll('.terminal__line');
    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        lineEls[i].classList.add('visible');
      }, line.delay);
      timers.push(t);
    });
  }

  /* Scroll trigger */
  const section = document.getElementById('demo');
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        run();
      }
    },
    { threshold: 0.25 }
  );
  if (section) observer.observe(section);

  /* Replay button */
  replayBtn.addEventListener('click', () => {
    hasRun = false; // allow re-trigger
    run();
  });

  buildLines(); // pre-render hidden lines
})();


/* =========================================================
   4. SCROLL REVEAL — IntersectionObserver for .reveal
   ========================================================= */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* =========================================================
   5. FAQ ACCORDION
   ========================================================= */
(function initFAQ() {
  const triggers = document.querySelectorAll('.faq-item__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item     = trigger.closest('.faq-item');
      const body     = item.querySelector('.faq-item__body');
      const expanded = trigger.getAttribute('aria-expanded') === 'true';

      /* Close all others */
      triggers.forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.closest('.faq-item').querySelector('.faq-item__body').classList.remove('open');
        }
      });

      /* Toggle this one */
      const next = !expanded;
      trigger.setAttribute('aria-expanded', next);
      body.classList.toggle('open', next);
    });
  });
})();


/* =========================================================
   6. PLATFORM BAR ANIMATION
   — animate width on scroll into view
   ========================================================= */
(function initPlatformBars() {
  const fills = document.querySelectorAll('.platform-bar__fill');
  if (!fills.length) return;

  /* Store original widths, reset to 0 */
  const targets = [];
  fills.forEach(fill => {
    targets.push(fill.style.width);
    fill.style.width = '0';
    fill.style.transition = 'none';
  });

  const dashboard = document.querySelector('.mock-dashboard');
  if (!dashboard) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fills.forEach((fill, i) => {
          setTimeout(() => {
            fill.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
            fill.style.width = targets[i];
          }, i * 120);
        });
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(dashboard);
})();


/* =========================================================
   7. SMOOTH SCROLL — anchor links
   ========================================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* =========================================================
   8. HERO PROFIT CARD — live pulse glow on value change
   ========================================================= */
(function initProfitPulse() {
  const profitEl = document.getElementById('heroProfit');
  if (!profitEl) return;

  /* Watch for textContent mutations and briefly brighten */
  let pulseTmo;
  const mo = new MutationObserver(() => {
    profitEl.style.textShadow = '0 0 60px rgba(0,230,118,.7)';
    clearTimeout(pulseTmo);
    pulseTmo = setTimeout(() => {
      profitEl.style.textShadow = '0 0 40px rgba(0,230,118,.4)';
    }, 300);
  });
  mo.observe(profitEl, { childList: true, subtree: true, characterData: true });
})();


/* =========================================================
   9. CURRENT YEAR IN FOOTER
   ========================================================= */
(function setYear() {
  const el = document.querySelector('.footer__bottom .mono:first-child');
  if (el) {
    el.textContent = `© ${new Date().getFullYear()} WhatDash. All rights reserved.`;
  }
})();