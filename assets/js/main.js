// Main JavaScript for Portfolio Website

// Wait for DOM to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Menu toggle functionality
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const checkbox = document.getElementById('checkbox');
  
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
    anchor.addEventListener('click', function(e) {
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

  // Works section toggle
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

  // Panel click animations
  document.getElementById('design-panel')?.addEventListener('click', function(e) {
    if (!e.target.closest('button')) {
      e.preventDefault();
      animatePanelClick(this, '/design-projects.html');
    }
  });

  document.getElementById('programming-panel')?.addEventListener('click', function(e) {
    if (!e.target.closest('button')) {
      e.preventDefault();
      animatePanelClick(this, '/coding-projects.html');
    }
  });

  // Portfolio content toggles
  document.querySelectorAll('[onclick^="hidePortfolioContent"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const type = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      hidePortfolioContent(type);
    });
  });

  document.querySelectorAll('[onclick="hideAllCollapsibleSections()"]')?.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      hideAllCollapsibleSections();
    });
  });

  // Initialize animations and effects
  initGSAPAnimations();
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
    onComplete: function() {
      gsap.to('body', {
        opacity: 0,
        duration: 0.5,
        onComplete: function() {
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

function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Fade in up animation
  gsap.from('.gsap-fade-in-up', {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });

  // Zoom in animation
  gsap.from('.gsap-zoom-in', {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'back.out(1.7)'
  });

  // Line animation
  gsap.from('.gsap-line', {
    scaleX: 0,
    duration: 1,
    ease: 'power2.out'
  });

  // About section animations
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

  // Article section animations
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

  // Skills section animations
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

  // Contact form animation
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

      // Boundary checks
      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.y > canvas.height) p.y = 0;
      if (p.y < 0) p.y = canvas.height;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    
    requestAnimationFrame(animate);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animate();
}

function handleFormSubmit() {
  const contactForm = document.querySelector('#contact-section form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
  });
}