/* ============================================================
   MM TRANSPORTS — MAIN JAVASCRIPT (Clean / Professional)
   ============================================================ */

/* ---------- Sticky Header ---------- */
const header = document.querySelector('.site-header');
if (header) {
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ---------- Mobile Navigation ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Active nav link ---------- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ---------- Scroll Reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));
}

/* ---------- Animated Counters ---------- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = eased * target;
    el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));
}

/* ---------- Contact Form Feedback ---------- */
const contactForm = document.getElementById('quote-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const fullName = formData.get('full_name') || '';
    const phone = formData.get('phone') || '';
    const serviceRaw = formData.get('service_type') || '';
    const origin = formData.get('origin') || '';
    const destination = formData.get('destination') || '';
    const message = formData.get('message') || '';
    
    const serviceMap = {
      'ftl': 'Full Truck Load (FTL) Transport',
      'container': 'Container Transport',
      'industrial': 'Industrial Goods Transport',
      'long-distance': 'Long Distance Transport',
      'factory': 'Factory Material Transport',
      'other': 'Other'
    };
    const serviceName = serviceMap[serviceRaw] || serviceRaw;

    let waMessage = `*New Transport Enquiry*\n\n`;
    waMessage += `*Name:* ${fullName}\n`;
    waMessage += `*Phone:* ${phone}\n`;
    waMessage += `*Service Needed:* ${serviceName}\n`;
    if (origin) waMessage += `*Pickup Location:* ${origin}\n`;
    if (destination) waMessage += `*Delivery Location:* ${destination}\n`;
    if (message) waMessage += `*Details:* ${message}\n`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waNumber = '919633665648';
    
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
  });
}

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
