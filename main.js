/* ═══════════════════════════════════════════════════
   AGORA LAW FIRM — Main JavaScript
   Scroll effects, mobile nav, animations
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV SCROLL STATE ── */
  const header = document.getElementById('site-header');

  function updateHeaderState() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle = document.getElementById('nav-toggle');

  // Build drawer from existing nav items
  const navLinks = document.getElementById('nav-links');
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.setAttribute('id', 'nav-drawer');
  drawer.setAttribute('aria-label', 'Mobile navigation');

  // Clone nav links into drawer
  navLinks.querySelectorAll('a').forEach(link => {
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = link.textContent;
    drawer.appendChild(a);
  });

  // Add phone and CTA to drawer
  const phone = document.querySelector('.nav-phone');
  const cta = document.querySelector('.btn-consult');

  if (phone) {
    const drawerPhone = document.createElement('a');
    drawerPhone.href = phone.getAttribute('href');
    drawerPhone.textContent = phone.textContent;
    drawerPhone.className = 'nav-drawer-phone';
    drawer.appendChild(drawerPhone);
  }

  if (cta) {
    const drawerCta = document.createElement('a');
    drawerCta.href = cta.getAttribute('href');
    drawerCta.textContent = cta.textContent;
    drawerCta.className = 'nav-drawer-cta';
    drawer.appendChild(drawerCta);
  }

  header.insertAdjacentElement('afterend', drawer);

  let drawerOpen = false;

  function openDrawer() {
    drawerOpen = true;
    drawer.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerOpen = false;
    drawer.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    drawerOpen ? closeDrawer() : openDrawer();
  });

  // Close drawer on any drawer link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawerOpen) closeDrawer();
  });

  /* ── SMOOTH SCROLL ── */
  const NAV_H = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  ) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile drawer if open
      if (drawerOpen) closeDrawer();
    });
  });

  /* ── INTERSECTION OBSERVER — REVEAL ANIMATIONS ── */
  const revealTargets = [
    // Case Evaluation
    { selector: '#case-evaluation .section-headline', delay: '' },
    { selector: '#case-evaluation .evaluation-form', delay: 'reveal-delay-1' },

    // Approach
    { selector: '#approach .section-headline', delay: '' },
    { selector: '#approach .section-body', delay: 'reveal-delay-1' },

    // Practice areas — stagger each item
    { selector: '.practice-item:nth-child(1)', delay: '' },
    { selector: '.practice-item:nth-child(2)', delay: 'reveal-delay-1' },
    { selector: '.practice-item:nth-child(3)', delay: 'reveal-delay-2' },
    { selector: '.practice-item:nth-child(4)', delay: 'reveal-delay-3' },
    { selector: '#practice-areas .copper-link', delay: 'reveal-delay-4' },

    // Attorney
    { selector: '.attorney-photo-wrap', delay: '' },
    { selector: '.attorney-name', delay: '' },
    { selector: '.attorney-role', delay: 'reveal-delay-1' },
    { selector: '.attorney-body', delay: 'reveal-delay-2' },
    { selector: '.attorney-bio .copper-link', delay: 'reveal-delay-3' },

    // Contact
    { selector: '.contact-details', delay: '' },
    { selector: '.contact-cta-col', delay: 'reveal-delay-1' },

    // Section labels
    { selector: '#case-evaluation .section-label-col', delay: '' },
    { selector: '#approach .section-label-col', delay: '' },
    { selector: '#practice-areas .section-label-col', delay: '' },
    { selector: '#contact .section-label-col', delay: '' },
  ];

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealTargets.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('reveal');
    if (delay) el.classList.add(delay);
    observer.observe(el);
  });

  /* ── PRACTICE AREA KEYBOARD NAV ── */
  // Ensure practice links are navigable with keyboard enter/space
  document.querySelectorAll('.practice-link').forEach(link => {
    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });

  /* ── ACTIVE NAV LINK HIGHLIGHTING ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a, #nav-drawer a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            const href = a.getAttribute('href');
            if (href === `#${id}`) {
              a.style.color = '';
              a.style.opacity = '1';
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

})();
