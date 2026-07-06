// GradientWorks - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initFAQAccordion();
  initMetricCounters();
  initCookieBanner();
  initContactForms();
  initScrollAnimations();
  initHeroAnimation();
  initLegalNavigation();
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

function initLegalNavigation() {
  const navigation = document.querySelector('.legal-tabs');
  const headings = document.querySelectorAll('.legal-content section > h2');
  if (!navigation || headings.length === 0) return;

  const label = document.createElement('span');
  label.className = 'legal-nav-label';
  label.textContent = 'Documentos legales';
  navigation.prepend(label);

  const tableOfContents = document.createElement('div');
  tableOfContents.className = 'legal-on-page';

  const tocLabel = document.createElement('span');
  tocLabel.textContent = 'En esta página';
  tableOfContents.appendChild(tocLabel);

  const list = document.createElement('ol');
  const links = new Map();

  headings.forEach((heading, index) => {
    const section = heading.closest('section');
    if (!section) return;
    if (!section.id) section.id = `seccion-${index + 1}`;

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = heading.textContent.replace(/^\d+\.\s*/, '');
    item.appendChild(link);
    list.appendChild(item);
    links.set(section.id, link);
  });

  tableOfContents.appendChild(list);
  navigation.appendChild(tableOfContents);

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => link.classList.remove('is-active'));
      links.get(entry.target.id)?.classList.add('is-active');
    }
  }, {
    rootMargin: '-25% 0px -65% 0px'
  });

  links.forEach((_link, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

// Slow, frame-rate-independent data field for the hero background.
function initHeroAnimation() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let frameId = null;
  let previousTime = 0;
  let particles = [];

  function createParticle(index) {
    return {
      x: (index * 137.5 % 100) / 100 * width,
      baseY: (0.12 + ((index * 47) % 76) / 100) * height,
      radius: 1.5 + (index % 7) * 0.75,
      speed: 5 + (index % 9) * 1.15,
      amplitude: 5 + (index % 6) * 2.5,
      phase: index * 0.73,
      alpha: 0.28 + (index % 5) * 0.09
    };
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = width < 700 ? 38 : 72;
    particles = Array.from({ length: count }, (_, index) => createParticle(index));
  }

  function drawFlowLines(time) {
    context.lineWidth = 0.8;
    for (let line = 0; line < 20; line += 1) {
      const baseY = height * (0.15 + line * 0.035);
      const amplitude = 7 + (line % 5) * 3;
      context.beginPath();

      for (let x = -30; x <= width + 30; x += 24) {
        const y = baseY
          + Math.sin(x * 0.006 + time * 0.00012 + line * 0.48) * amplitude
          + Math.cos(x * 0.0022 - time * 0.00008 + line) * 4;
        if (x === -30) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.strokeStyle = `rgba(30, 183, 177, ${0.08 + (line % 4) * 0.03})`;
      context.stroke();
    }
  }

  function drawParticles(time, deltaSeconds) {
    for (const particle of particles) {
      particle.x += particle.speed * deltaSeconds;
      if (particle.x > width + 20) particle.x = -20;

      const y = particle.baseY + Math.sin(time * 0.00022 + particle.phase) * particle.amplitude;
      const glow = context.createRadialGradient(
        particle.x,
        y,
        0,
        particle.x,
        y,
        particle.radius * 4
      );
      glow.addColorStop(0, `rgba(36, 214, 197, ${particle.alpha})`);
      glow.addColorStop(0.35, `rgba(24, 164, 174, ${particle.alpha * 0.55})`);
      glow.addColorStop(1, 'rgba(13, 103, 131, 0)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(particle.x, y, particle.radius * 4, 0, Math.PI * 2);
      context.fill();
    }
  }

  function render(time = 0) {
    const deltaSeconds = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
    previousTime = time;
    context.clearRect(0, 0, width, height);
    drawFlowLines(time);
    drawParticles(time, deltaSeconds);

    if (!reducedMotion) frameId = requestAnimationFrame(render);
  }

  resizeCanvas();
  render();

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
    if (reducedMotion) render(0);
  });
  resizeObserver.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (reducedMotion) return;
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    } else if (!document.hidden && !frameId) {
      previousTime = 0;
      frameId = requestAnimationFrame(render);
    }
  });
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
