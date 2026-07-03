/* =============================================
   AMBIKA MAKEOVER SALON – script.js
   ============================================= */

(function () {
  'use strict';

  /* ---- DOM refs ---- */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const allLinks  = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ============================================
     1. Navbar — scroll shadow + toggle
     ============================================ */
  function handleScroll() {
    const y = window.scrollY;

    // Scrolled style
    if (y > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (y > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav highlight
    highlightActiveLink();
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============================================
     2. Smooth scrolling (anchor links)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================
     3. Active navbar link highlight
     ============================================ */
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navH = 80;
    let current = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - navH - 60;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    allLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return; // cross-page links keep their own current-page state
      link.classList.remove('active');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================
     3b. Mark current page in nav (multi-page site)
     ============================================ */
  function markCurrentPageLink() {
    const path = location.pathname.split('/').pop() || 'index.html';
    allLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) === '#') return;
      const linkPath = href.split('#')[0].split('/').pop();
      if (linkPath === path) {
        link.classList.add('active');
      }
    });
  }
  markCurrentPageLink();

  /* ============================================
     4. Scroll reveal animations
     ============================================ */
  const revealEls = document.querySelectorAll('.scroll-reveal');

  function revealOnScroll() {
    const viewBottom = window.scrollY + window.innerHeight;

    revealEls.forEach(function (el, i) {
      if (el.classList.contains('revealed')) return;

      const elTop = el.getBoundingClientRect().top + window.scrollY;
      if (viewBottom > elTop + 60) {
        // Stagger siblings within the same parent
        const siblings = Array.from(el.parentElement.querySelectorAll('.scroll-reveal:not(.revealed)'));
        const sibIdx   = siblings.indexOf(el);
        const delay    = Math.min(sibIdx * 80, 320);

        setTimeout(function () {
          el.classList.add('revealed');
        }, delay);
      }
    });
  }

  /* ============================================
     5. Back to top button
     ============================================ */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================
     6. Contact form — WhatsApp redirect
     ============================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = (contactForm.querySelector('[name="name"]').value || '').trim();
      const phone   = (contactForm.querySelector('[name="phone"]').value || '').trim();
      const service = (contactForm.querySelector('[name="service"]').value || '').trim();
      const message = (contactForm.querySelector('[name="message"]').value || '').trim();

      const waText = encodeURIComponent(
        'Hi, I am ' + name + '.\n' +
        'Phone: ' + phone + '\n' +
        'Interested in: ' + (service || 'a service') + '\n' +
        (message ? 'Message: ' + message : '')
      );

      // Show success message briefly then open WhatsApp
      formSuccess.style.display = 'block';
      setTimeout(function () {
        window.open('https://wa.me/919065409709?text=' + waText, '_blank');
      }, 800);

      // Reset form
      setTimeout(function () {
        contactForm.reset();
        formSuccess.style.display = 'none';
      }, 3500);
    });
  }

  /* ============================================
     7. Gallery — lightbox-style zoom
     ============================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Create lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  Object.assign(lightbox.style, {
    position: 'fixed', inset: '0', zIndex: '2000',
    background: 'rgba(44,36,24,0.95)',
    display: 'none', alignItems: 'center',
    justifyContent: 'center', cursor: 'zoom-out',
    padding: '24px'
  });

  const lightboxImg = document.createElement('img');
  Object.assign(lightboxImg.style, {
    maxWidth: '90vw', maxHeight: '88vh',
    borderRadius: '8px', objectFit: 'contain',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    animation: 'fadeUp 0.3s ease forwards'
  });

  const lightboxClose = document.createElement('button');
  lightboxClose.innerHTML = '&times;';
  Object.assign(lightboxClose.style, {
    position: 'absolute', top: '20px', right: '24px',
    background: 'none', border: 'none',
    color: '#fff', fontSize: '2.4rem',
    cursor: 'pointer', lineHeight: '1',
    opacity: '0.7'
  });

  lightbox.appendChild(lightboxClose);
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const src = item.querySelector('img').src;
      lightboxImg.src = src;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('click', function (e) {
    e.stopPropagation();
    closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ============================================
     8. Mobile tap-to-reveal prices
     On touch devices hover doesn't work, so
     tapping a price-list item toggles the price.
     ============================================ */
  function isTouchDevice() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }

  function initPriceTap() {
    if (!isTouchDevice()) return; // desktop — CSS hover handles it

    const priceItems = document.querySelectorAll('.price-list li');

    // Update hint text for touch users
    document.querySelectorAll('.price-list').forEach(function (ul) {
      // We'll inject a ::before replacement via a real element
      const hint = document.createElement('p');
      hint.className = 'price-hint-touch';
      hint.textContent = 'Tap to see prices ✦';
      ul.insertBefore(hint, ul.firstChild);
    });

    priceItems.forEach(function (item) {
      item.addEventListener('click', function () {
        const price = item.querySelector('span:last-child');
        if (!price) return;

        const isOpen = item.classList.contains('tapped');

        // Close all others in same list
        const siblings = item.closest('ul').querySelectorAll('li.tapped');
        siblings.forEach(function (s) {
          s.classList.remove('tapped');
          s.querySelector('span:last-child').style.opacity = '0';
          s.querySelector('span:last-child').style.transform = 'translateX(10px)';
        });

        if (!isOpen) {
          item.classList.add('tapped');
          price.style.opacity = '1';
          price.style.transform = 'translateX(0)';
        }
      });
    });
  }

  initPriceTap();

  /* ============================================
     9. Event listeners + initial run
     ============================================ */
  window.addEventListener('scroll', function () {
    handleScroll();
    revealOnScroll();
  }, { passive: true });

  // Run once on load
  handleScroll();
  revealOnScroll();

  // Stagger the service cards on page load if already in view
  window.addEventListener('load', revealOnScroll);

})();
