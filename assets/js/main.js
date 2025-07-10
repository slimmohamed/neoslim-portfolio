// Main JavaScript for Portfolio Website

// Wait for DOM to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const checkbox = document.getElementById('checkbox');
  const heroBtn = document.getElementById('hero-btn');
  const toggleWorksBtn = document.getElementById('toggle-works-btn');
  const worksSection = document.getElementById('works-section');

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('block');
    mobileMenu?.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      checkbox.checked = false;
      document.body.classList.remove('overflow-hidden');
    });
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Works button click logic
  toggleWorksBtn?.addEventListener('click', () => {
    toggleWorksBtn.classList.toggle('active');
    worksSection.classList.toggle('opened');
    if (worksSection.classList.contains('opened')) {
      setTimeout(() => {
        worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });

  // Panel click animations
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

  document.querySelectorAll('[onclick^="hidePortfolioContent"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const type = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      hidePortfolioContent(type);
    });
  });

  document.querySelectorAll('[onclick="hideAllCollapsibleSections()"]')?.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      hideAllCollapsibleSections();
    });
  });

  initAnimations();
  initCanvasBackground();
  handleFormSubmit();
}

function animatePanelClick(panel, targetUrl) {
  gsap.to(panel, {
    scale: 0.95,
    duration: 0.2,
    repeat: 1,
    repeatDelay: 0,
    yoyoEase: true,
    ease: 'power1.inOut',
    onComplete: function () {
      gsap.to('body', {
        opacity: 0,
        duration: 0.5,
        onComplete: function () {
          window.location.href = targetUrl;
        }
      });
    }
  });
}

function hidePortfolioContent(type) {
  const section = document.getElementById(`${type}-portfolio-content`);
  section.classList.add('hidden');
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

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.gsap-fade-in-up', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.gsap-zoom-in', {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'back.out(1.7)'
  });

  gsap.from('.gsap-line', {
    scaleX: 0,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.from('.gsap-fade-in-left', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%'
    },
    opacity: 0,
    x: -50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.gsap-zoom-in-up', {
    scrollTrigger: {
      trigger: '#article-section',
      start: 'top 80%'
    },
    opacity: 0,
    y: 50,
    scale: 0.95,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });

  gsap.from('.chart-container', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });

  gsap.from('#contact-section form', {
    scrollTrigger: {
      trigger: '#contact-section',
      start: 'top 80%'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out'
  });
}

function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: `rgba(94, 160, 140, ${Math.random() * 0.5 + 0.1})`
    };
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.y > canvas.height) p.y = 0;
      if (p.y < 0) p.y = canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animate();
}

function handleFormSubmit() {
  const contactForm = document.querySelector('#contact-section form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
  });
}

initGSAPAnimations();
initCanvasBackground();
handleFormSubmit();
function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  const selectors = {
    fadeInUp: '.gsap-fade-in-up',
    zoomIn: '.gsap-zoom-in',
    line: '.gsap-line',
    fadeInLeft: '.gsap-fade-in-left',
    zoomInUp: '.gsap-zoom-in-up',
    chartContainer: '.chart-container',
    contactForm: '#contact-section form'
  };

  const animationOptions = {
    duration: 1,
    ease: 'power2.out'
  };

  const triggers = {
    line: {},
    fadeInLeft: {
      trigger: '#about',
      start: 'top 80%'
    },
    zoomInUp: {
      trigger: '#article-section',
      start: 'top 80%'
    },
    chartContainer: {
      trigger: '#skills',
      start: 'top 80%'
    },
    contactForm: {
      trigger: '#contact-section',
      start: 'top 80%'
    }
  };

  Object.entries(selectors).forEach(([selector, trigger]) => {
    const options = {
      ...animationOptions,
      ...triggers[trigger]
    };

    switch (trigger) {
      case 'fadeInUp':
        options.opacity = 0;
        options.y = 50;
        options.stagger = 0.2;
        break;
      case 'zoomIn':
        options.opacity = 0;
        options.scale = 0.8;
        options.ease = 'back.out(1.7)';
        break;
      case 'line':
        options.scaleX = 0;
        break;
      default:
        options.opacity = 0;
        options.y = 50;
    }

    gsap.from(selector, options);
  });
}
function initializeBackgroundCanvas() {
  const backgroundCanvas = document.getElementById('background-canvas');
  if (!backgroundCanvas) return;

  animateParticles(backgroundCanvas);
}

function animateParticles(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;

  const colors = [
    '#5EA08C',
    '#2B6777',
    '#F5DEB3',
    '#CFEF00'
  ];

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

  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x > canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.y > canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = canvas.height;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    }
    requestAnimationFrame(updateParticles);
  }

  updateParticles();
}
function animateCardParticles(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;

  const particleColors = [
    '#5EA08C',
    '#2B6777',
    '#F5DEB3',
    '#CFEF00'
  ];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      velocityX: Math.random() * 1 - 0.5,
      velocityY: Math.random() * 1 - 0.5,
      color: particleColors[Math.floor(Math.random() * particleColors.length)]
    };
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.y > canvas.height) p.y = 0;
      if (p.y < 0) p.y = canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0; // Clear existing particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  });

  animate();
}
function handleContactFormSubmission() {
  const form = document.querySelector('#contact-section form');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    alert(`Thank you for your message, ${name}! I will get back to you soon.`);
    form.reset();
  });
}
// Initialize GSAP animations
initGSAPAnimations();
initCanvasBackground();
handleFormSubmit();
// Function to initialize GSAP animations
function initGSAPAnimations() {
  gsap.from('.gsap-fade-in-up', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.gsap-fade-in-right', {
    opacity: 0,
    x: 50,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initGSAPAnimations();
  initCanvasBackground();
  handleFormSubmit();
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.getElementById('checkbox').checked = false;
      document.body.classList.remove('overflow-hidden');
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  document.getElementById('toggle-works-btn')?.addEventListener('click', () => {
    const worksSection = document.getElementById('works-section');
    worksSection.classList.toggle('opened');
    if (worksSection.classList.contains('opened')) {
      setTimeout(() => {
        worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  });
  document.querySelectorAll('.collapsible-section').forEach(section => {
    section.addEventListener('click', function (e) {
      if (!e.target.closest('button')) {
        e.preventDefault();
        this.classList.toggle('hidden');
      }
    });
  });

const windsurfCommand = document.getElementById('windsurf-command');
  document.querySelectorAll('.collapsible-section').forEach(section => {
    section.addEventListener('click', function (e) {
      if (!e.target.closest('button')) {
        e.preventDefault();
        this.classList.toggle('hidden');
      }
    });
  });
})