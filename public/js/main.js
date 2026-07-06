// GradientWorks - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initFAQAccordion();
  initMetricCounters();
  initCookieBanner();
  initContactForms();
  initScrollAnimations();
  initHeroVideo();
});

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

// Hero Video - slow playback
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (video) {
    video.playbackRate = 0.6;
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  
  if (toggle && menu) {
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', function() {
      menu.classList.toggle('active');
      const isOpen = menu.classList.contains('active');
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    
    // Close menu when clicking a link
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
}

// FAQ Accordion
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.setAttribute('aria-expanded', 'false');

      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

// Metric Counters Animation
function initMetricCounters() {
  const counters = document.querySelectorAll('.metric-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        if (!isNaN(target)) {
          animateCounter(counter, target);
        }
        observer.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 60;
  const duration = 2000; // 2 seconds
  const stepTime = duration / 60;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, stepTime);
}

// Cookie Banner
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');
  
  if (!banner) return;
  
  // Check if user has already made a choice
  const cookieConsent = getStoredValue('cookieConsent');
  
  if (!cookieConsent) {
    // Show banner after a short delay
    setTimeout(() => {
      banner.classList.add('show');
    }, 1000);
  }
  
  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      setStoredValue('cookieConsent', 'acknowledged');
      banner.classList.remove('show');
      // Here you would initialize analytics and marketing cookies
    });
    
    // Add keyboard support
    acceptBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        acceptBtn.click();
      }
    });
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', function() {
      setStoredValue('cookieConsent', 'declined');
      banner.classList.remove('show');
      // Here you would only allow essential cookies
    });
    
    // Add keyboard support
    declineBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        declineBtn.click();
      }
    });
  }
}

// Contact Form Handling
function initContactForms() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      // Prepare form data
      const formData = new FormData(contactForm);
      
      // Send via FormSubmit
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Show success message
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          
          // Scroll to success message
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente por correo.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
  
  // Data Deletion Form
  const deletionForm = document.getElementById('deletionForm');
  const deletionSuccess = document.getElementById('formSuccess');
  
  if (deletionForm && deletionSuccess) {
    deletionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = deletionForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      // Prepare form data
      const formData = new FormData(deletionForm);
      
      // Send via FormSubmit
      fetch(deletionForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Show success message
          deletionForm.style.display = 'none';
          deletionSuccess.style.display = 'block';
          
          // Scroll to success message
          deletionSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar la solicitud. Por favor, intenta nuevamente desde el formulario de contacto.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
}

// Scroll Animations (Fade-up effect)
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-scroll]');

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}
