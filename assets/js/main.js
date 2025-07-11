// Main JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initMenuToggle();
  initWorksSection();
  // initPanelClicks(); // (removed if not needed)
  // initPortfolioControls(); // (removed if not needed)
  initSmoothScrolling();
  initAnimations();
  initCardParticles();
  initGSAPAnimations(); // Add this line to use the function
  initCanvasBackground(); // Add this line to use the function
});
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('menuBox');

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    menu.classList.add('show');
  } else {
    menu.classList.remove('show');
  }
});

document.querySelectorAll('.value').forEach(btn => {
  btn.addEventListener('click', () => {
    toggle.checked = false;
    menu.classList.remove('show');
  });
});
function initWorksSection() {
  const toggleWorksButton = document.getElementById('toggle-works-btn');
  const worksSection = document.getElementById('works-section');
  
  if (toggleWorksButton && worksSection) {
    let isWorksVisible = false;
    
    toggleWorksButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWorksVisibility();
    });

    function toggleWorksVisibility() {
      isWorksVisible = !isWorksVisible;
      
      if (isWorksVisible) {
        showWorksSection();
      } else {
        hideWorksSection();
      }
    }
function showWorksSection() {
  worksSection.classList.remove('hidden');
  worksSection.style.opacity = '1';
  worksSection.style.transform = 'scaleY(1)';
  toggleWorksButton.querySelector('.btn-hero__text').textContent = 'HIDE WORKS';
  
  // Scroll to section after a brief delay
  setTimeout(() => {
    worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

function hideWorksSection() {
  worksSection.style.opacity = '0';
  worksSection.style.transform = 'scaleY(0)';
  toggleWorksButton.querySelector('.btn-hero__text').textContent = 'VIEW MY WORKS';
  
  // Hide after animation completes
  setTimeout(() => {
    worksSection.classList.add('hidden');
  }, 500);
}

// Initialize works section as hidden
worksSection.classList.add('hidden');
worksSection.style.opacity = '0';
worksSection.style.transform = 'scaleY(0)';
// --- Panels Redirection ---
// function initPanelClicks() {
//   document.getElementById('design-panel')?.addEventListener('click', function (e) {
//     if (!e.target.closest('button')) {
//       e.preventDefault();
//       animatePanelClick(this, '/design-projects.html');
//     }
//   });
//
//   document.getElementById('programming-panel')?.addEventListener('click', function (e) {
//     if (!e.target.closest('button')) {
//       e.preventDefault();
//       animatePanelClick(this, '/coding-projects.html');
//     }
//   });
// }

// --- Portfolio Content Toggles ---
// function initPortfolioControls() {
//   document.querySelectorAll('[onclick^="hidePortfolioContent"]').forEach(btn => {
//     btn.addEventListener('click', function (e) {
//       e.stopPropagation();
//       const type = this.getAttribute('onclick').match(/'([^']+)'/)[1];
//       hidePortfolioContent(type);
//     });
//   });
//
//   document.querySelectorAll('[onclick="hideAllCollapsibleSections()"]').forEach(btn => {
//     btn.addEventListener('click', function (e) {
//       e.stopPropagation();
//       hideAllCollapsibleSections();
//     });
//   });
// }

// --- Animations with GSAP ---
// This function initializes GSAP animations for fade-in and slide-in effects, including low opacity text on load.
function initGSAPAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-content', {
    opacity: 0,
    y: 40,
    duration: 1,
    delay: 0.3,
    ease: 'power2.out'
  });

  gsap.utils.toArray('section').forEach((section, i) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });
}
  if (!window.gsap || !ScrollTrigger) return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero animations
  gsap.from('.hero-content', {
    opacity: 0,
    y: 40,
    duration: 1,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Section animations
  gsap.utils.toArray('section').forEach((section, i) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power2.out'
    });
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

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      contactForm.reset();
      showNotification('Message sent successfully!');
    } catch (error) {
      showNotification('Error sending message. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message';
    }
  });
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
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
}

