/* ==========================================================================
   WebSnabb — Production Vanilla JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------------------
  // 1. Language Translation System
  // -----------------------------------------------------------------------
  const langSelect = document.getElementById('lang-select');
  const storedLang = localStorage.getItem('websnabb_lang') || 'en';

  function applyLanguage(lang) {
    if (!translations[lang]) return;

    const dictionary = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem('websnabb_lang', lang);
    if (langSelect) langSelect.value = lang;
  }

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  // Initialize Language
  applyLanguage(storedLang);

  // -----------------------------------------------------------------------
  // 2. Theme Switching System (Light/Dark Mode)
  // -----------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('websnabb_theme') || (prefersDark ? 'dark' : 'light');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('websnabb_theme', theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Initialize Theme
  setTheme(storedTheme);

  // Listen to OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('websnabb_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // -----------------------------------------------------------------------
  // 3. Active Navigation Scroll Observer
  // -----------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });

        mobileLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // -----------------------------------------------------------------------
  // 4. Contact Form Handler (Pure JS Client-Side Validation & Feedback)
  // -----------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();

      if (!nameVal || !emailVal) return;

      // Show temporary submission success notice
      if (formToast) {
        const currentLang = localStorage.getItem('websnabb_lang') || 'en';
        const msg = currentLang === 'sv' 
          ? 'Tack! Vi återkommer inom 24 timmar.' 
          : currentLang === 'fi' 
          ? 'Kiitos! Palaamme asiaan 24 tunnin kuluessa.' 
          : 'Thank you! We will get back to you within 24 hours.';

        formToast.textContent = msg;
        formToast.className = 'form-toast success';

        contactForm.reset();

        setTimeout(() => {
          formToast.style.display = 'none';
          formToast.className = 'form-toast';
        }, 5000);
      }
    });
  }
});