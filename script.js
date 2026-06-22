/* ═══════════════════════════════════════════════════════
   SUNNYRAIN STUDIO — script.js
   Formulier-logica + EmailJS + UI helpers
   ═══════════════════════════════════════════════════════ */

// ── EmailJS initialiseren ─────────────────────────────
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: 'tDmB4buj6uDbJyn4u' });
  }
})();

const EMAILJS_SERVICE  = 'service_uv4onr9';
const EMAILJS_TEMPLATE = 'template_4arb0vp';

// ── Huidig jaar in footer ─────────────────────────────
const jaarEl = document.getElementById('footer-jaar');
if (jaarEl) jaarEl.textContent = new Date().getFullYear();

// ── Hamburger-menu ────────────────────────────────────
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    if (open) {
      mobileMenu.hidden = true;
    } else {
      mobileMenu.hidden = false;
    }
  });

  // Sluit menu bij klik op een link
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });
}

// ── Uitgebreide functies toggle ───────────────────────
const toggleBtn    = document.getElementById('toggle-uitgebreid');
const tabelUitgeb = document.getElementById('tabel-uitgebreid');

if (toggleBtn && tabelUitgeb) {
  toggleBtn.addEventListener('click', function () {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      tabelUitgeb.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = 'Bekijk alle functies';
    } else {
      tabelUitgeb.hidden = false;
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.textContent = 'Verberg uitgebreide lijst';
      // Scroll er naartoe
      setTimeout(function () {
        tabelUitgeb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  });
}

// ── Formulier helpers ─────────────────────────────────
function toonFeedback(feedbackEl, type, tekst) {
  feedbackEl.className = 'form-feedback ' + type;
  feedbackEl.textContent = tekst;
  feedbackEl.hidden = false;
}

function valideerVeld(input) {
  if (input.required && !input.value.trim()) return false;
  if (input.type === 'email') {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(input.value.trim());
  }
  if (input.type === 'checkbox') return input.checked;
  return true;
}

function valideerFormulier(form) {
  let ok = true;
  form.querySelectorAll('input, textarea').forEach(function (el) {
    if (!valideerVeld(el)) {
      el.style.borderColor = '#dc2626';
      ok = false;
    } else {
      el.style.borderColor = '';
    }
  });
  return ok;
}

// ── Verstuur via EmailJS ──────────────────────────────
function verstuurViaEmailJS(params) {
  if (typeof emailjs === 'undefined') {
    return Promise.reject(new Error('EmailJS niet geladen'));
  }
  return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params);
}

// ── Formulier 1: Proefperiode aanvragen ───────────────
const formProef      = document.getElementById('form-proef');
const proefFeedback  = document.getElementById('proef-feedback');

if (formProef && proefFeedback) {
  formProef.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!valideerFormulier(formProef)) {
      toonFeedback(proefFeedback, 'fout',
        'Vul alle verplichte velden correct in voordat je verstuurt.');
      return;
    }

    const submitBtn = formProef.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen…';

    const params = {
      formulier_type: 'Proefperiode aanvragen',
      naam:           formProef.querySelector('[name="naam"]').value.trim(),
      bedrijf:        formProef.querySelector('[name="bedrijf"]').value.trim(),
      email:          formProef.querySelector('[name="email"]').value.trim(),
      situatie:       formProef.querySelector('[name="situatie"]').value.trim() || '(niet ingevuld)',
    };

    verstuurViaEmailJS(params)
      .then(function () {
        formProef.hidden = true;
        toonFeedback(proefFeedback, 'succes',
          'Bedankt! Ik neem snel contact met je op en bezorg je je licentiesleutel.');
      })
      .catch(function (err) {
        console.error('EmailJS fout:', err);
        toonFeedback(proefFeedback, 'fout',
          'Er is iets misgegaan bij het versturen. Probeer het opnieuw of mail rechtstreeks naar info@sunnyrain.be.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Vraag een gratis proefperiode aan';
      });
  });

  // Herstel rode randen bij invullen
  formProef.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () { el.style.borderColor = ''; });
    el.addEventListener('change', function () { el.style.borderColor = ''; });
  });
}

// ── Formulier 2: Vraag stellen ────────────────────────
const formVraag     = document.getElementById('form-vraag');
const vraagFeedback = document.getElementById('vraag-feedback');

if (formVraag && vraagFeedback) {
  formVraag.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!valideerFormulier(formVraag)) {
      toonFeedback(vraagFeedback, 'fout',
        'Vul alle verplichte velden correct in voordat je verstuurt.');
      return;
    }

    const submitBtn = formVraag.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen…';

    const params = {
      formulier_type: 'Vraag stellen',
      naam:           formVraag.querySelector('[name="naam"]').value.trim(),
      bedrijf:        '',
      email:          formVraag.querySelector('[name="email"]').value.trim(),
      situatie:       formVraag.querySelector('[name="vraag"]').value.trim(),
    };

    verstuurViaEmailJS(params)
      .then(function () {
        formVraag.hidden = true;
        toonFeedback(vraagFeedback, 'succes',
          'Bedankt voor je vraag! Ik antwoord je zo snel mogelijk.');
      })
      .catch(function (err) {
        console.error('EmailJS fout:', err);
        toonFeedback(vraagFeedback, 'fout',
          'Er is iets misgegaan bij het versturen. Probeer het opnieuw of mail rechtstreeks naar info@sunnyrain.be.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verstuur je vraag';
      });
  });

  formVraag.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () { el.style.borderColor = ''; });
    el.addEventListener('change', function () { el.style.borderColor = ''; });
  });
}
