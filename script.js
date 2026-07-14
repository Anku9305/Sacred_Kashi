// =========================================================
// SACRED KASHI — Main Script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 350);
  });
  // Fallback in case 'load' is slow/blocked
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Back to top button visibility
    if (window.scrollY > 600) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Back to top ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Graceful image fallback ---------- */
  // If any photo fails to load (slow connection, ad-blocker, etc.),
  // replace it with a soft placeholder instead of a broken icon.
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function handler() {
      this.removeEventListener('error', handler);
      this.style.objectFit = 'contain';
      this.style.padding = '20%';
      this.style.opacity = '0.35';
      this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23D4A656" stroke-width="1"%3E%3Cpath d="M12 2 14 9 21 9 15.5 13.5 17.5 21 12 16.5 6.5 21 8.5 13.5 3 9 10 9 Z"/%3E%3C/svg%3E';
    }, { once: true });
  });

  /* ---------- Contact form -> WhatsApp handoff ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const country = form.country.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const ritual = form.ritual.value;
      const date = form.date.value;
      const message = form.message.value.trim();

      if (!name || !email) {
        formNote.textContent = 'Please fill in your name and email so we can reach you.';
        formNote.classList.remove('success');
        return;
      }

      // Build a friendly WhatsApp message with the enquiry details
      const lines = [
        `Hello Sacred Kashi! I'd like to enquire about a ritual.`,
        `Name: ${name}`,
        country ? `Country: ${country}` : null,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        ritual ? `Ritual of interest: ${ritual}` : null,
        date ? `Preferred date: ${date}` : null,
        message ? `Message: ${message}` : null
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/919305433808?text=${encodeURIComponent(lines)}`;

      formNote.textContent = 'Thank you! Opening WhatsApp so you can send your request directly...';
      formNote.classList.add('success');

      window.open(waUrl, '_blank', 'noopener');
      form.reset();
    });
  }

})();

/* ── Slideshow ── */
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('slideDots');
  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer;

  // build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 3000);
  }

  document.getElementById('slidePrev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('slideNext')?.addEventListener('click', () => goTo(current + 1));

  resetTimer();
});
