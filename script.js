// Global Date Year
document.getElementById('year').textContent = new Date().getFullYear();

// IMAGE SAFETY NET SCRIPT
(function initImageSafetyNet() {
  // Logo Candidates Resolution
  const logoImg = document.getElementById('logo-img');
  const logoPlate = document.getElementById('logo-plate');
  const logoEmblem = document.getElementById('logo-emblem');

  if (logoImg) {
    const testImg = new Image();
    testImg.referrerPolicy = "no-referrer";
    testImg.onload = function() {
      if (testImg.naturalWidth >= 24 && testImg.naturalHeight >= 24) {
        logoPlate.style.display = 'flex';
        logoEmblem.style.display = 'none';
      }
    };
    testImg.onerror = function() {
      // Fallback to drawn emblem
      logoPlate.style.display = 'none';
      logoEmblem.style.display = 'flex';
    };
    testImg.src = logoImg.src;
  }

  // Shared Image Error Handling & Retry
  const allImages = document.querySelectorAll('img[data-role]');
  allImages.forEach(img => {
    img.addEventListener('error', function() {
      const role = img.getAttribute('data-role');
      if (role === 'photo') {
        // Single retry with alternate seed
        if (!img.dataset.retried) {
          img.dataset.retried = 'true';
          const originalSrc = img.src;
          const newSeed = Math.floor(Math.random() * 9000) + 1000;
          img.src = originalSrc.replace(/seed=\d+/, 'seed=' + newSeed);
        } else {
          // Hide image, reveal fallback vector
          img.style.opacity = '0';
        }
      }
    });
  });
})();

// HEADER: Boxed Bar Glider Highlight & ScrollSpy
(function initHeaderGlider() {
  const navList = document.getElementById('nav-list');
  const links = document.querySelectorAll('.nav-link');
  const glider = document.getElementById('nav-glider');
  const sections = document.querySelectorAll('section, header');

  function moveGliderTo(element) {
    if (!element || !glider || !navList) return;
    const rect = element.getBoundingClientRect();
    const parentRect = navList.getBoundingClientRect();
    glider.style.width = `${rect.width}px`;
    glider.style.left = `${rect.left - parentRect.left}px`;
    glider.style.opacity = '1';
  }

  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => moveGliderTo(e.target));
  });

  navList.addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      moveGliderTo(activeLink);
    } else {
      glider.style.opacity = '0';
    }
  });

  // ScrollSpy
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
        moveGliderTo(link);
      }
    });
  });
})();

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// CARD HOVER CURSOR GRADIENT GLOW (fx-card)
(function initCardGlow() {
  const cards = document.querySelectorAll('.fx-card');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });
})();

// HERO MOTION (Bubbles & Sparkles Canvas)
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.radius = Math.random() * 6 + 2;
      this.speed = Math.random() * 1.2 + 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.y -= this.speed;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
      ctx.stroke();
    }
  }

  for (let i = 0; i < 22; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// HERO PARALLAX + Back to top visibility
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.getElementById('hero-bg');
  if (heroBg && scrolled < 800) {
    heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
  }

  // Back to top button
  const backTop = document.getElementById('back-to-top');
  if (scrolled > 400) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
});

document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// FORM SUBMISSION -> WhatsApp
const contactForm = document.getElementById('contact-form');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value;
    const text = encodeURIComponent(
      `Hello Shine S Cleaning Ltd,\nName: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`
    );
    window.open('https://wa.me/447518683314?text=' + text, '_blank');
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
  });
}