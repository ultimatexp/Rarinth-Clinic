/* ===================================================================
   DR. RARINTHORN — PREMIUM MEDICAL LANDING PAGE
   Interactive Behaviors & Animations
   =================================================================== */

(function () {
  'use strict';

  /* ======================== DOM REFERENCES ======================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  /* ======================== NAVBAR SCROLL SHRINK ======================== */
  let lastScroll = 0;
  const SCROLL_THRESHOLD = 60;

  function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ======================== MOBILE MENU TOGGLE ======================== */
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (
      navMenu.classList.contains('is-open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  /* ======================== SCROLL ANIMATIONS (Intersection Observer) ======================== */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: make everything visible
      animatedElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();

  /* ======================== SMOOTH SCROLL FOR ANCHOR LINKS ======================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        var navbarHeight = navbar.offsetHeight;
        var targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Update URL without triggering scroll
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* ======================== ACTIVE NAV LINK HIGHLIGHTING ======================== */
  function highlightActiveSection() {
    var sections = document.querySelectorAll('section[id]');
    var navbarHeight = navbar.offsetHeight + 20;

    sections.forEach(function (section) {
      var top = section.offsetTop - navbarHeight;
      var bottom = top + section.offsetHeight;
      var scroll = window.pageYOffset;

      var link = document.querySelector(
        '.navbar__link[href="#' + section.id + '"]'
      );
      if (link) {
        if (scroll >= top && scroll < bottom) {
          link.classList.add('navbar__link--active');
        } else {
          link.classList.remove('navbar__link--active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveSection, { passive: true });

  /* ======================== FLOATING CALL BUTTON VISIBILITY ======================== */
  var floatingCall = document.getElementById('floating-call');

  function handleFloatingCallVisibility() {
    if (window.innerWidth > 768) return;

    if (window.pageYOffset > 400) {
      floatingCall.style.display = 'flex';
    } else {
      floatingCall.style.display = 'none';
    }
  }

  window.addEventListener('scroll', handleFloatingCallVisibility, {
    passive: true,
  });
  window.addEventListener('resize', handleFloatingCallVisibility, {
    passive: true,
  });

  /* ======================== PRELOAD HERO IMAGE ======================== */
  // The hero background is already preloaded via <link rel="preload"> in HTML
  // This ensures the Ken Burns animation starts smoothly
  var heroImg = new Image();
  heroImg.src = 'images/hero-bg.png';

  /* ======================== PERFORMANCE: THROTTLE SCROLL HANDLERS ======================== */
  // Combine scroll handlers with requestAnimationFrame for performance
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNavbarScroll();
        highlightActiveSection();
        handleFloatingCallVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Replace individual scroll listeners with unified, throttled handler
  window.removeEventListener('scroll', handleNavbarScroll);
  window.removeEventListener('scroll', highlightActiveSection);
  window.removeEventListener('scroll', handleFloatingCallVisibility);
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ======================== LANGUAGE SWITCHER (i18n) ======================== */
  var langToggle = document.getElementById('langToggle');
  var langDropdown = document.getElementById('langDropdown');
  var langLabel = document.getElementById('currentLangLabel');
  var langOptions = document.querySelectorAll('.lang-option');

  // Selector-based i18n map: keys → CSS selectors (for elements without data-i18n)
  var I18N_MAP = {
    aboutLabel: '#about .section-label',
    aboutTitle: '#about-title',
    aboutSubtitle: '#about .section-subtitle',
    aboutP1: '.about__prose p:nth-child(1)',
    aboutP2: '.about__prose p:nth-child(2)',
    aboutP3: '.about__prose p:nth-child(3)',
    certTitle: '.about__certifications .about__cert-title',
    cert1: '.cert-list .cert-list__item:nth-child(1) .cert-desc',
    cert2: '.cert-list .cert-list__item:nth-child(2) .cert-desc',
    cert3: '.cert-list .cert-list__item:nth-child(3) .cert-desc',
    cert4: '.cert-list .cert-list__item:nth-child(4) .cert-desc',
    memberTitle: '.about__memberships .about__cert-title',
    badgeCU: '.credential-badge:nth-child(1) strong',
    badgeCUSub: '.credential-badge:nth-child(1) small',
    badgeASAN: '.credential-badge:nth-child(2) strong',
    badgeASANSub: '.credential-badge:nth-child(2) small',
    sgbLabel: '#stellate-ganglion-block .section-label',
    sgbTitle: '#sgb-title',
    sgbIntro: '#stellate-ganglion-block .section-intro',
    sgbWhatTitle: '.glass-card__title',
    sgbP1: '.sgb__explain .glass-card p:nth-child(2)',
    sgbP2: '.sgb__explain .glass-card p:nth-child(3)',
    sgbP3: '.sgb__explain .glass-card p:nth-child(4)',
    ben1Title: '.sgb__benefits-grid .benefit-card:nth-child(1) .benefit-card__title',
    ben1P:     '.sgb__benefits-grid .benefit-card:nth-child(1) p',
    ben2Title: '.sgb__benefits-grid .benefit-card:nth-child(2) .benefit-card__title',
    ben2P:     '.sgb__benefits-grid .benefit-card:nth-child(2) p',
    ben3Title: '.sgb__benefits-grid .benefit-card:nth-child(3) .benefit-card__title',
    ben3P:     '.sgb__benefits-grid .benefit-card:nth-child(3) p',
    ben4Title: '.sgb__benefits-grid .benefit-card:nth-child(4) .benefit-card__title',
    ben4P:     '.sgb__benefits-grid .benefit-card:nth-child(4) p',
    condLabel: '#conditions .section-label',
    condTitle: '#conditions-title',
    condIntro: '#conditions .section-intro',
    cond1T: '#condition-crps .condition-card__title',  cond1P: '#condition-crps p',
    cond2T: '#condition-neuropathic .condition-card__title', cond2P: '#condition-neuropathic p',
    cond3T: '#condition-spinal .condition-card__title', cond3P: '#condition-spinal p',
    cond4T: '#condition-ptsd .condition-card__title',  cond4P: '#condition-ptsd p',
    cond5T: '#condition-joint .condition-card__title', cond5P: '#condition-joint p',
    cond6T: '#condition-cancer .condition-card__title', cond6P: '#condition-cancer p',
    jourLabel: '#journey .section-label', jourTitle: '#journey-title',
    jourIntro: '#journey .section-intro',
    step1T: '#step-1 .timeline-step__title', step1P: '#step-1 .timeline-step__content p',
    step2T: '#step-2 .timeline-step__title', step2P: '#step-2 .timeline-step__content p',
    step3T: '#step-3 .timeline-step__title', step3P: '#step-3 .timeline-step__content p',
    step4T: '#step-4 .timeline-step__title', step4P: '#step-4 .timeline-step__content p',
    step5T: '#step-5 .timeline-step__title', step5P: '#step-5 .timeline-step__content p',
    procLabel: '#procedures .section-label', procTitle: '#procedures-title',
    procIntro: '#procedures .section-intro',
    proc1T: '.procedures__grid .procedure-item:nth-child(1) h3', proc1P: '.procedures__grid .procedure-item:nth-child(1) p',
    proc2T: '.procedures__grid .procedure-item:nth-child(2) h3', proc2P: '.procedures__grid .procedure-item:nth-child(2) p',
    proc3T: '.procedures__grid .procedure-item:nth-child(3) h3', proc3P: '.procedures__grid .procedure-item:nth-child(3) p',
    proc4T: '.procedures__grid .procedure-item:nth-child(4) h3', proc4P: '.procedures__grid .procedure-item:nth-child(4) p',
    proc5T: '.procedures__grid .procedure-item:nth-child(5) h3', proc5P: '.procedures__grid .procedure-item:nth-child(5) p',
    proc6T: '.procedures__grid .procedure-item:nth-child(6) h3', proc6P: '.procedures__grid .procedure-item:nth-child(6) p',
    faqLabel: '#faq .section-label', faqTitle: '#faq-title', faqIntro: '#faq .section-intro',
    faq1Q: '#faq-1 .faq-item__question span', faq1A: '#faq-1 .faq-item__answer p',
    faq2Q: '#faq-2 .faq-item__question span', faq2A: '#faq-2 .faq-item__answer p',
    faq3Q: '#faq-3 .faq-item__question span', faq3A: '#faq-3 .faq-item__answer p',
    faq4Q: '#faq-4 .faq-item__question span', faq4A: '#faq-4 .faq-item__answer p',
    faq5Q: '#faq-5 .faq-item__question span', faq5A: '#faq-5 .faq-item__answer p',
    faq6Q: '#faq-6 .faq-item__question span', faq6A: '#faq-6 .faq-item__answer p',
    ctaTitle: '#cta-title', ctaText: '.cta__text',
    ctaBtn: '#cta-book-line',
    ctaNote: '.cta__note',
    footerCopy: '.footer__disclaimer p:first-child',
    footerDisclaimer: '.footer__disclaimer small'
  };

  // Keys that need innerHTML (contain HTML tags like <strong>)
  var HTML_KEYS = ['aboutP1','aboutP2','aboutP3','sgbP1','sgbP2','sgbP3','heroSubtitle','badgeCUSub','badgeASANSub'];

  function applyTranslation(lang) {
    if (!window.TRANSLATIONS || !TRANSLATIONS[lang]) return;
    var t = TRANSLATIONS[lang];
    var labels = {en:'EN', my:'MY', bn:'BN'};
    langLabel.textContent = labels[lang] || lang.toUpperCase();

    // data-i18n elements (textContent)
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
    // data-i18n-html elements (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key]) el.innerHTML = t[key];
    });
    // Selector-based mapping
    Object.keys(I18N_MAP).forEach(function(key) {
      if (!t[key]) return;
      var el = document.querySelector(I18N_MAP[key]);
      if (!el) return;
      if (HTML_KEYS.indexOf(key) !== -1) { el.innerHTML = t[key]; }
      else { el.textContent = t[key]; }
    });

    // Update html lang attribute
    var langAttr = {en:'en', my:'my', bn:'bn'};
    document.documentElement.setAttribute('lang', langAttr[lang] || 'en');

    try { localStorage.setItem('dr-rarinthorn-lang', lang); } catch(e) {}
  }

  function toggleLangDropdown() {
    var isOpen = langDropdown.classList.toggle('is-open');
    langToggle.setAttribute('aria-expanded', isOpen.toString());
  }

  if (langToggle) {
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleLangDropdown();
    });
  }

  langOptions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var lang = this.getAttribute('data-lang');
      applyTranslation(lang);
      langDropdown.classList.remove('is-open');
      langToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function(e) {
    if (langDropdown && !langDropdown.contains(e.target) && !langToggle.contains(e.target)) {
      langDropdown.classList.remove('is-open');
      langToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Restore saved language
  try {
    var saved = localStorage.getItem('dr-rarinthorn-lang');
    if (saved && saved !== 'en') { applyTranslation(saved); }
  } catch(e) {}

  /* ======================== INITIAL STATE ======================== */
  handleNavbarScroll();
  handleFloatingCallVisibility();
})();
