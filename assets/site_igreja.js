/* ============================================================
   IEQ Cervezão — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Carrossel Nativo ---------- */
  (function initCarousel() {
    const carousel    = document.getElementById('about-carousel');
    if (!carousel) return;

    const track       = carousel.querySelector('.carousel__track');
    const slides      = Array.from(track.querySelectorAll('.carousel__slide'));
    const dotsWrapper = document.getElementById('carousel-dots');
    const btnPrev     = document.getElementById('carousel-prev');
    const btnNext     = document.getElementById('carousel-next');
    const total       = slides.length;
    let   current     = 0;
    let   autoTimer   = null;
    let   dragStartX  = 0;
    let   dragging    = false;

    /* Criar dots */
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrapper.appendChild(dot);
    });

    function getDots() { return dotsWrapper.querySelectorAll('.carousel__dot'); }

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      getDots().forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    btnNext.addEventListener('click', function () { next(); });
    btnPrev.addEventListener('click', function () { prev(); });

    /* Teclado */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); }
      if (e.key === 'ArrowLeft')  { prev(); }
    });

    /* Touch / Drag */
    carousel.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      dragging  = true;
      dragStartX = e.clientX;
      carousel.setPointerCapture(e.pointerId);
    });
    carousel.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      const delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? next() : prev();
      }
    });
    carousel.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      e.preventDefault();
    }, { passive: false });
  })();

  /* ---------- 2. Navbar & Active Link variables ---------- */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---------- 3. Hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    // Prevent body scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on nav link click
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* Scrollspy function moved up to section 2 */

  /* ---------- 5. Scroll Reveal (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  /* ---------- 6. Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navH   = navbar ? navbar.offsetHeight : 0;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 7. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();



})();