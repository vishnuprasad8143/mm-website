/* ============================================================
   MM TRANSPORTS — SITE SCRIPT
   ============================================================ */

/* ------------------------------------------------------------
   CONFIG — everything the client might need to change lives here
   ------------------------------------------------------------ */
const CONFIG = {
  // Phone in international format, digits only (used to build wa.me links)
  whatsappNumber: '919633665648',

  // Where enquiry emails go. FormSubmit relays to these addresses.
  // IMPORTANT: the first submission triggers a one-time activation email
  // to enquiryTo — click the link in it once, and the form is live.
  enquiryTo: 'vishnuprasad@mmtransports.in',
  enquiryCc: 'operations@mmtransports.in',

  // Email relay endpoint. FormSubmit needs no account or API key.
  // To switch providers later, only this line and sendEnquiry() change.
  formEndpoint: 'https://formsubmit.co/ajax/'
};

/* ------------------------------------------------------------
   Footer year — updates itself every January
   ------------------------------------------------------------ */
document.querySelectorAll('[data-current-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ------------------------------------------------------------
   Sticky header shadow
   ------------------------------------------------------------ */
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------
   Mobile navigation
   ------------------------------------------------------------ */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  const setNav = open => {
    navToggle.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  navToggle.addEventListener('click', () => setNav(!navToggle.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navToggle.classList.contains('open')) {
      setNav(false);
      navToggle.focus();
    }
  });
}

/* ------------------------------------------------------------
   Active nav link
   ------------------------------------------------------------ */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page) a.classList.add('active');
});

/* ------------------------------------------------------------
   Scroll reveal
   ------------------------------------------------------------ */
const revealEls = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealEls.length && !reducedMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ------------------------------------------------------------
   Animated counters
   ------------------------------------------------------------ */
const counters = document.querySelectorAll('[data-count]');

if (counters.length && !reducedMotion && 'IntersectionObserver' in window) {
  const runCounter = el => {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) return;

    const duration = 1400;
    const start = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };

    requestAnimationFrame(tick);
  };

  const co = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => co.observe(c));
}

/* ------------------------------------------------------------
   FAQ accordion
   ------------------------------------------------------------ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', String(!isOpen));
    if (panel) panel.classList.toggle('open', !isOpen);
  });
});

/* ------------------------------------------------------------
   Smooth scroll for in-page anchors
   ------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

/* ============================================================
   ENQUIRY FORM
   ============================================================ */
const form = document.getElementById('quote-form');

if (form) {
  const submitBtn = document.getElementById('submit-btn');
  const whatsappBtn = document.getElementById('whatsapp-btn');
  const statusBox = document.getElementById('form-status');
  const successBox = document.getElementById('form-success');

  /* --- Read the form into a plain object ---
     Always go through form.elements: several field names (name, method,
     target, action…) collide with built-in HTMLFormElement properties,
     so form.name would return the form's own name attribute, not the input. */
  const field = key => (form.elements[key]?.value ?? '').trim();

  const readForm = () => ({
    name: field('name'),
    company: field('company'),
    phone: field('phone'),
    email: field('email'),
    service: field('service'),
    origin: field('origin'),
    destination: field('destination'),
    details: field('details'),
    honeypot: field('_honey')
  });

  /* --- Validate the three required fields --- */
  const validate = data => {
    const missing = [];
    if (!data.name) missing.push('your name');
    if (!data.phone) missing.push('a phone number');
    if (!data.service) missing.push('a service');
    return missing;
  };

  /* "a, b and c" rather than "a, b, c" */
  const listOut = items =>
    items.length < 2 ? items[0] : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

  const showError = msg => {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = 'form-status error show';
  };

  const clearError = () => {
    if (statusBox) statusBox.className = 'form-status';
  };

  /* --- Build the message body shared by email and WhatsApp --- */
  const buildMessage = data => {
    const lines = [
      'New transport enquiry from mmtransports.in',
      '',
      `Name: ${data.name}`,
      data.company ? `Company: ${data.company}` : null,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : null,
      `Service: ${data.service}`,
      data.origin ? `Pickup: ${data.origin}` : null,
      data.destination ? `Delivery: ${data.destination}` : null,
      data.details ? `Details: ${data.details}` : null
    ];

    return lines.filter(Boolean).join('\n');
  };

  /* ----------------------------------------------------------
     Path 1 — email to operations (FormSubmit relay)
     ---------------------------------------------------------- */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearError();

    const data = readForm();

    // Bot filled the hidden field — pretend it worked, send nothing.
    if (data.honeypot) {
      form.style.display = 'none';
      successBox.classList.add('show');
      return;
    }

    const missing = validate(data);
    if (missing.length) {
      showError(`Please add ${listOut(missing)} before sending.`);
      return;
    }

    const original = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch(CONFIG.formEndpoint + CONFIG.enquiryTo, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Website enquiry — ${data.name}${data.company ? ' (' + data.company + ')' : ''}`,
          _cc: CONFIG.enquiryCc,
          _template: 'table',
          _captcha: 'false',
          Name: data.name,
          Company: data.company || '—',
          Phone: data.phone,
          Email: data.email || '—',
          Service: data.service,
          Pickup: data.origin || '—',
          Delivery: data.destination || '—',
          Details: data.details || '—'
        })
      });

      if (!res.ok) throw new Error(`Relay responded ${res.status}`);

      form.style.display = 'none';
      successBox.classList.add('show');
      successBox.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
      showError(
        'Sorry — the enquiry could not be sent just now. Please use the WhatsApp button below, ' +
        'or call us on +91 96336 65648.'
      );
    }
  });

  /* ----------------------------------------------------------
     Path 2 — prefilled WhatsApp message
     ---------------------------------------------------------- */
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      clearError();

      const data = readForm();
      const missing = validate(data);

      if (missing.length) {
        showError(`Please add ${listOut(missing)} before sending on WhatsApp.`);
        return;
      }

      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildMessage(data))}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // Clear the error as soon as the user starts fixing things
  form.addEventListener('input', clearError);
}

/* ------------------------------------------------------------
   Plain WhatsApp buttons elsewhere on the site — give them a
   sensible opening message rather than an empty chat.
   ------------------------------------------------------------ */
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const text = 'Hello MM Transports, I would like a quote for container transport.';
  link.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
});
