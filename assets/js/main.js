// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  initWorksToggle();
  initPanelClicks();
  initPortfolioControls();
  initCanvasBackground();
  initGSAPAnimations();
  handleFormSubmit();
  initAnchorNavigation();
  initNavigationButtons();
  initCollapsibleSections();
});

// --- Menu Burger ---
function initMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const checkbox = menuToggle?.querySelector('input');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = checkbox?.checked;
    mobileMenu.classList.toggle('hidden', !isOpen);
    document.body.classList.toggle('overflow-hidden', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      if (checkbox) checkbox.checked = false;
      document.body.classList.remove('overflow-hidden');
    });
  });
}

// --- Section "Works" ---
function initWorksToggle() {
  const toggleWorksBtn = document.getElementById('toggle-works-btn');
  const worksSection = document.getElementById('works-section');

  toggleWorksBtn?.addEventListener('click', () => {
    toggleWorksBtn.classList.toggle('active');
    worksSection.classList.toggle('opened');

    if (worksSection.classList.contains('opened')) {
      setTimeout(() => {
        worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
}

// --- Panels Redirection ---
function initPanelClicks() {
  document.getElementById('design-panel')?.addEventListener('click', function (e) {
    if (!e.target.closest('button')) {
      e.preventDefault();
      animatePanelClick(this, '/design-projects.html');
    }
  });

  document.getElementById('programming-panel')?.addEventListener('click', function (e) {
    if (!e.target.closest('button')) {
      e.preventDefault();
      animatePanelClick(this, '/coding-projects.html');
    }
  });
}

// --- Portfolio Content Toggles ---
function initPortfolioControls() {
  document.querySelectorAll('[onclick^="hidePortfolioContent"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const type = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      hidePortfolioContent(type);
    });
  });

  document.querySelectorAll('[onclick="hideAllCollapsibleSections()"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      hideAllCollapsibleSections();
    });
  });
}

function hidePortfolioContent(type) {
  const section = document.getElementById(`${type}-portfolio-content`);
  section?.classList.add('hidden');
  document.getElementById('toggle-works-btn')?.classList.remove('active');
  document.getElementById('works-section')?.classList.remove('hidden');
  document.body.classList.remove('overflow-hidden');
}

function hideAllCollapsibleSections() {
  document.querySelectorAll('.collapsible-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.body.classList.remove('overflow-hidden');
}

// --- Animations with GSAP ---
function initGSAPAnimations() {
  if (!window.gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.gsap-fade-in-up', {
    opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: 'power2.out'
  });

  gsap.from('.gsap-zoom-in', {
    opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.7)'
  });

  gsap.from('.gsap-line', {
    scaleX: 0, duration: 1, ease: 'power2.out'
  });

  gsap.from('.gsap-fade-in-left', {
    scrollTrigger: { trigger: '#about', start: 'top 80%' },
    opacity: 0, x: -50, duration: 0.8, stagger: 0.2, ease: 'power2.out'
  });

  gsap.from('.gsap-zoom-in-up', {
    scrollTrigger: { trigger: '#article-section', start: 'top 80%' },
    opacity: 0, y: 50, scale: 0.95, duration: 0.8, ease: 'back.out(1.7)'
  });

  gsap.from('.chart-container', {
    scrollTrigger: { trigger: '#skills', start: 'top 80%' },
    opacity: 0, y: 50, duration: 0.8, stagger: 0.2, ease: 'power2.out'
  });

  gsap.from('#contact-section form', {
    scrollTrigger: { trigger: '#contact-section', start: 'top 80%' },
    opacity: 0, y: 50, duration: 0.8, ease: 'power2.out'
  });
}

// --- Canvas Background ---
function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;
  const colors = ['#5EA08C', '#2B6777', '#F5DEB3', '#CFEF00'];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      vx: Math.random() * 1 - 0.5,
      vy: Math.random() * 1 - 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.y > canvas.height) p.y = 0;
      if (p.y < 0) p.y = canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// --- Form Submission ---
function handleFormSubmit() {
  const contactForm = document.querySelector('#contact-section form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;

    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
  });
}

// --- Panel Animation + Redirect ---
function animatePanelClick(panel, targetUrl) {
  gsap.to(panel, {
    scale: 0.95,
    duration: 0.2,
    repeat: 1,
    yoyo: true,
    ease: 'power1.inOut',
    onComplete: () => {
      gsap.to('body', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => window.location.href = targetUrl
      });
    }
  });
}

// --- Smooth scroll for anchors ---
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// --- Navigation buttons ---
function initNavigationButtons() {
  document.querySelectorAll('.navigate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-url');
      if (target) window.location.href = target;
    });
  });
}

// --- Collapsibles ---
function initCollapsibleSections() {
  document.querySelectorAll('.collapsible-section').forEach(section => {
    section.addEventListener('click', function (e) {
      if (!e.target.closest('button')) {
        e.preventDefault();
        this.classList.toggle('hidden');
      }
    });
  });
}
