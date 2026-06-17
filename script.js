/**
 * WhatDash — main.js
 * Architecture: IIFE modules, no global pollution, event delegation
 * where appropriate. No framework needed for this scope.
 */

'use strict';

/* ================================================================
   UTILITIES
   ================================================================ */

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

/** Animate a numeric value from 0 to target */
function animateCount(el, target, duration = 2000, formatter = (v) => v) {
  const fps = 60;
  const steps = (duration / 1000) * fps;
  const inc = target / steps;
  let current = 0;

  function tick() {
    current = Math.min(current + inc, target);
    el.textContent = formatter(current);
    if (current < target) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function formatUSD(value) {
  return '$' + value.toFixed(2);
}

/* ================================================================
   THEME
   ================================================================ */
const Theme = (() => {
  const html = document.documentElement;
  let isDark = true;

  function apply(dark) {
    isDark = dark;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');

    // Sync all toggle icon pairs
    $$('[data-theme-sun]').forEach(el => {
      el.style.display = dark ? 'block' : 'none';
    });
    $$('[data-theme-moon]').forEach(el => {
      el.style.display = dark ? 'none' : 'block';
    });

    try { localStorage.setItem('wd_theme', dark ? 'dark' : 'light'); } catch (_) {}
  }

  function toggle() { apply(!isDark); }

  function init() {
    let saved = 'dark';
    try { saved = localStorage.getItem('wd_theme') || 'dark'; } catch (_) {}
    apply(saved === 'dark');

    // Bind all theme toggle buttons
    $$('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle, apply, get isDark() { return isDark; } };
})();

/* ================================================================
   NAVBAR
   ================================================================ */
const Navbar = (() => {
  function init() {
    const nav = $('#navbar');
    if (!nav) return;

    // Scroll state
    const onScroll = () => {
      nav.classList.toggle('navbar--scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger
    const ham = $('#hamburger');
    const mob = $('#mobileMenu');
    if (!ham || !mob) return;

    ham.addEventListener('click', () => {
      const isOpen = ham.getAttribute('aria-expanded') === 'true';
      const next = !isOpen;
      ham.setAttribute('aria-expanded', next);
      mob.setAttribute('aria-hidden', !next);
    });

    // Close on link click
    $$('a', mob).forEach(a => {
      a.addEventListener('click', () => {
        ham.setAttribute('aria-expanded', 'false');
        mob.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mob.contains(e.target)) {
        ham.setAttribute('aria-expanded', 'false');
        mob.setAttribute('aria-hidden', 'true');
      }
    });
  }

  return { init };
})();

/* ================================================================
   SMOOTH SCROLL
   ================================================================ */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ================================================================
   SCROLL REVEAL
   ================================================================ */
const Reveal = (() => {
  let observer;

  function init() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  }

  /** Observe new elements added dynamically (e.g. dashboard) */
  function observe(root) {
    $$('.reveal', root).forEach(el => {
      el.classList.add('visible'); // instant on navigation
    });
  }

  return { init, observe };
})();

/* ================================================================
   PLATFORM BARS (landing preview)
   ================================================================ */
function initPlatformBars() {
  const fills = $$('.pbar__fill[data-width]');
  if (!fills.length) return;

  fills.forEach(f => { f.style.width = '0'; });

  const section = $('#dashboard-preview');
  if (!section) return;

  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      fills.forEach((f, i) => {
        setTimeout(() => { f.style.width = f.dataset.width; }, i * 140);
      });
      obs.disconnect();
    }
  }, { threshold: 0.25 });

  obs.observe(section);
}

/* ================================================================
   PHONE PROFIT COUNTER
   ================================================================ */
function initPhoneProfitCounter() {
  const el = $('#phoneProfit');
  if (!el) return;

  const hero = $('#hero');
  if (!hero) return;

  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      obs.disconnect();
      setTimeout(() => animateCount(el, 4287.50, 2400, formatUSD), 500);
    }
  }, { threshold: 0.2 });

  obs.observe(hero);
}

/* ================================================================
   LIVE PROFIT COUNTER (dashboard)
   ================================================================ */
function initLiveProfitCounter() {
  const el = $('#liveProfit');
  if (!el) return;
  setTimeout(() => animateCount(el, 309.00, 1800, formatUSD), 300);
}

/* ================================================================
   TERMINAL ANIMATION
   ================================================================ */
const Terminal = (() => {
  const SCRIPT = [
    { delay: 0,    cls: 't-line--sys',    text: 'WhatDash Live Tracker — Session started' },
    { delay: 350,  cls: 't-line--sys',    text: 'Platform: Whatnot  ·  12:04:33 PM' },
    { delay: 700,  cls: '',              text: '' },
    { delay: 1050, cls: 't-line--action', text: '► Sale registered: Vintage Coach Bag × 1' },
    { delay: 1400, cls: 't-line--profit', text: '  Revenue  +$145.00  Cost  -$62.00  Profit  +$83.00' },
    { delay: 2000, cls: 't-line--action', text: '► Sale registered: Y2K Levi Jeans × 2' },
    { delay: 2350, cls: 't-line--profit', text: '  Revenue  +$90.00   Cost  -$34.00  Profit  +$56.00' },
    { delay: 3000, cls: 't-line--action', text: '► Sale registered: Nike SB Dunk Low × 1' },
    { delay: 3350, cls: 't-line--profit', text: '  Revenue  +$280.00  Cost  -$110.00  Profit  +$170.00' },
    { delay: 4000, cls: '',              text: '' },
    { delay: 4200, cls: 't-line--sep',    text: '─────────────────────────────────────────' },
    { delay: 4350, cls: 't-line--summary', text: '  Sales: 3  ·  Revenue: $515.00  ·  Profit: $309.00' },
    { delay: 4500, cls: 't-line--margin',  text: '  Margin: 59.9%  ·  Running 00:47:12' },
    { delay: 4650, cls: 't-line--sep',    text: '─────────────────────────────────────────' },
    { delay: 5000, cls: 't-line--cursor', text: '' },
  ];

  let timers = [];
  let hasRun = false;

  function build() {
    const body = $('#terminalBody');
    if (!body) return;

    body.innerHTML = '';
    SCRIPT.forEach(line => {
      const el = document.createElement('div');
      el.className = ['t-line', 'mono', line.cls].filter(Boolean).join(' ');
      el.setAttribute('aria-hidden', 'true');
      if (line.cls !== 't-line--cursor') el.textContent = line.text;
      body.appendChild(el);
    });
  }

  function run() {
    timers.forEach(clearTimeout);
    timers = [];
    build();

    const lines = $$('#terminalBody .t-line');
    SCRIPT.forEach((line, i) => {
      const t = setTimeout(() => {
        lines[i]?.classList.add('visible');
      }, line.delay);
      timers.push(t);
    });
  }

  function init() {
    const section = $('#demo');
    if (!section) return;

    build();

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        run();
      }
    }, { threshold: 0.2 });
    obs.observe(section);

    $('#replayBtn')?.addEventListener('click', () => {
      hasRun = false;
      run();
    });
  }

  return { init };
})();

/* ================================================================
   FAQ ACCORDION
   ================================================================ */
function initFaq() {
  $$('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      $$('.faq-trigger').forEach(other => {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        const otherBody = other.closest('.faq-item').querySelector('.faq-body');
        otherBody?.classList.remove('faq-body--open');
      });

      // Toggle current
      const next = !isExpanded;
      btn.setAttribute('aria-expanded', next);
      body?.classList.toggle('faq-body--open', next);
    });
  });
}

/* ================================================================
   AUTH MODAL
   ================================================================ */
const Auth = (() => {
  const STORAGE_KEY_USERS   = 'wd_users_v2';
  const STORAGE_KEY_SESSION = 'wd_session_v2';

  let overlay, modal;

  function open(mode = 'signup') {
    overlay.classList.add('auth-overlay--open');
    document.body.style.overflow = 'hidden';
    setMode(mode);

    // Focus first field
    setTimeout(() => {
      const first = modal.querySelector('input:not([type="hidden"])');
      first?.focus();
    }, 260);
  }

  function close() {
    overlay.classList.remove('auth-overlay--open');
    document.body.style.overflow = '';
    clearErrors();
  }

  function setMode(mode) {
    const loginForm   = $('#loginForm');
    const signupForm  = $('#signupForm');
    const tabLogin    = $('#tabLogin');
    const tabSignup   = $('#tabSignup');
    const heading     = $('#authTitle');
    const subheading  = $('#authSubtitle');

    if (mode === 'login') {
      loginForm.hidden  = false;
      signupForm.hidden = true;
      tabLogin.classList.add('auth-tab--active');
      tabSignup.classList.remove('auth-tab--active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabSignup.setAttribute('aria-selected', 'false');
      if (heading) heading.textContent = 'Welcome back';
      if (subheading) subheading.textContent = 'Enter your details to continue.';
    } else {
      loginForm.hidden  = true;
      signupForm.hidden = false;
      tabLogin.classList.remove('auth-tab--active');
      tabSignup.classList.add('auth-tab--active');
      tabLogin.setAttribute('aria-selected', 'false');
      tabSignup.setAttribute('aria-selected', 'true');
      if (heading) heading.textContent = 'Create your account';
      if (subheading) subheading.textContent = 'Free plan. No credit card required.';
    }
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('auth-error--visible');
    el.setAttribute('role', 'alert');
    setTimeout(() => el.classList.remove('auth-error--visible'), 5000);
  }

  function clearErrors() {
    $$('.auth-error').forEach(el => el.classList.remove('auth-error--visible'));
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'); }
    catch (_) { return []; }
  }
  function saveUsers(users) {
    try { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users)); }
    catch (_) {}
  }
  function saveSession(user) {
    try { localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user)); }
    catch (_) {}
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION)); }
    catch (_) { return null; }
  }
  function clearSession() {
    try { localStorage.removeItem(STORAGE_KEY_SESSION); }
    catch (_) {}
  }

  function handleSignup() {
    const name  = $('#signupName')?.value.trim()  || '';
    const email = $('#signupEmail')?.value.trim() || '';
    const pass  = $('#signupPassword')?.value     || '';

    if (!name)                   return showError('signupError', 'Please enter your name.');
    if (!email.includes('@'))    return showError('signupError', 'Please enter a valid email address.');
    if (pass.length < 8)         return showError('signupError', 'Password must be at least 8 characters.');

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return showError('signupError', 'An account with this email already exists. Try logging in.');
    }

    const user = { name, email, pass };
    users.push(user);
    saveUsers(users);
    saveSession({ name, email });
    close();
    Dashboard.mount({ name, email });
  }

  function handleLogin() {
    const email = $('#loginEmail')?.value.trim() || '';
    const pass  = $('#loginPassword')?.value     || '';

    if (!email) return showError('loginError', 'Please enter your email address.');
    if (!pass)  return showError('loginError', 'Please enter your password.');

    const users = getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

    if (!user) return showError('loginError', 'Incorrect email or password. Please try again.');

    saveSession({ name: user.name, email: user.email });
    close();
    Dashboard.mount(user);
  }

  function init() {
    overlay = $('#authOverlay');
    modal   = overlay?.querySelector('.auth-modal');
    if (!overlay) return;

    // Open triggers
    $$('[data-auth-open]').forEach(btn => {
      btn.addEventListener('click', () => open(btn.dataset.authOpen));
    });

    // Close
    $('#authClose')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('auth-overlay--open')) close();
    });

    // Tabs
    $('#tabLogin')?.addEventListener('click',  () => setMode('login'));
    $('#tabSignup')?.addEventListener('click', () => setMode('signup'));

    // Switch links
    $('#switchToSignup')?.addEventListener('click', (e) => { e.preventDefault(); setMode('signup'); });
    $('#switchToLogin')?.addEventListener('click',  (e) => { e.preventDefault(); setMode('login'); });

    // Submit buttons
    $('#signupSubmit')?.addEventListener('click', handleSignup);
    $('#loginSubmit')?.addEventListener('click',  handleLogin);

    // Enter key on inputs
    ['loginEmail', 'loginPassword'].forEach(id => {
      document.getElementById(id)?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
      });
    });
    ['signupName', 'signupEmail', 'signupPassword'].forEach(id => {
      document.getElementById(id)?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSignup();
      });
    });

    // Restore session
    const session = getSession();
    if (session) {
      Dashboard.mount(session);
    }
  }

  return { init, open, close, clearSession };
})();

/* ================================================================
   DASHBOARD
   ================================================================ */
const Dashboard = (() => {
  function mount(user) {
    const landing   = $('#landingPage');
    const dashPage  = $('#dashboardPage');
    if (!landing || !dashPage) return;

    landing.hidden = true;
    dashPage.classList.add('page-dashboard--active');

    // User info
    const initials = user.name
      ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : user.email.slice(0, 2).toUpperCase();

    const avatar   = $('#dashAvatar');
    const username = $('#dashUsername');
    if (avatar)   avatar.textContent   = initials;
    if (username) username.textContent = user.email;

    // Date subtitle
    const dateEl = $('#dashDate');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = `Last 30 days · ${now.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })}`;
    }

    // Animate live profit counter
    initLiveProfitCounter();

    // Reveal dashboard elements
    Reveal.observe(dashPage);

    window.scrollTo(0, 0);
  }

  function unmount() {
    const landing  = $('#landingPage');
    const dashPage = $('#dashboardPage');
    if (!landing || !dashPage) return;

    landing.hidden = false;
    dashPage.classList.remove('page-dashboard--active');
    window.scrollTo(0, 0);
  }

  function init() {
    $('#dashLogout')?.addEventListener('click', () => {
      Auth.clearSession();
      unmount();
    });

    $('#dashLogoHome')?.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.clearSession();
      unmount();
    });
  }

  return { init, mount, unmount };
})();

/* ================================================================
   FOOTER YEAR
   ================================================================ */
function initFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = `© ${new Date().getFullYear()} WhatDash. All rights reserved.`;
}

/* ================================================================
   MAIN INIT
   ================================================================ */
function init() {
  Theme.init();
  Navbar.init();
  initSmoothScroll();
  Reveal.init();
  initPlatformBars();
  initPhoneProfitCounter();
  Terminal.init();
  initFaq();
  Auth.init();
  Dashboard.init();
  initFooterYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}