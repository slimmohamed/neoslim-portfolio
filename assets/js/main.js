// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initMobileMenu();
  initWorksSection();
  initPanelInteractions();
  initSmoothScrolling();
  initAnimations();
  initCardParticles();
  bondElements();
  window.addEventListener('resize', bondElements);
});

// Initialisation des animations
function initAnimations() {
  // Animation des panneaux Works
  const panels = document.querySelectorAll('#design-panel, #programming-panel');
  panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      gsap.to(panel, {
        y: -10,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    panel.addEventListener('mouseleave', () => {
      gsap.to(panel, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });

  // Animation des boutons de navigation
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      const icon = button.querySelector('.icon');
      if (icon) {
        gsap.to(icon, {
          x: button.classList.contains('back-button') ? 10 : -10,
          duration: 0.4
        });
      }
    });
    button.addEventListener('mouseleave', () => {
      const icon = button.querySelector('.icon');
      if (icon) {
        gsap.to(icon, {
          x: 0,
          duration: 0.4
        });
      }
    });
  });
}


// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('change', (e) => {
      mobileMenu.classList.toggle('hidden', !e.target.checked);
      
      // Toggle body scroll when menu is open
      document.body.style.overflow = e.target.checked ? 'hidden' : '';
    });
  }
}

// Works Section Toggle
function initWorksSection() {
  const toggleWorksBtn = document.getElementById('toggle-works-btn');
  const worksSection = document.getElementById('works-section');
  
  if (toggleWorksBtn && worksSection) {
    let worksVisible = false;
    
    toggleWorksBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWorksVisibility();
    });

    function toggleWorksVisibility() {
      worksVisible = !worksVisible;
      
      if (worksVisible) {
        showWorksSection();
      } else {
        hideWorksSection();
      }
    }

    function showWorksSection() {
      worksSection.classList.remove('hidden');
      worksSection.style.opacity = '1';
      worksSection.style.transform = 'scaleY(1)';
      const button = toggleWorksBtn?.querySelector('.button__text');
      if (button) {
        button.textContent = 'HIDE WORKS';
      }
      
      // Scroll to section after a brief delay
      setTimeout(() => {
        worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }

    function hideWorksSection() {
      worksSection.style.opacity = '0';
      worksSection.style.transform = 'scaleY(0)';
      toggleWorksBtn.querySelector('.button__text').textContent = 'VIEW MY WORKS';
      
      // Hide after animation completes
      setTimeout(() => {
        worksSection.classList.add('hidden');
      }, 500);
    }

    // Initialize works section as hidden
    worksSection.classList.add('hidden');
    worksSection.style.opacity = '0';
    worksSection.style.transform = 'scaleY(0)';
  }
}

// Panel Interactions
function initPanelInteractions() {
  const setupPanel = (panel, url) => {
    if (!panel) return;
    
    panel.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        navigateWithAnimation(url);
      }
    });
    
    panel.addEventListener('keydown', (e) => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        navigateWithAnimation(url);
      }
    });
  };

  setupPanel(document.getElementById('design-panel'), '/design-portfolio');
  setupPanel(document.getElementById('programming-panel'), '/coding-portfolio');
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's a different kind of anchor
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      // Close mobile menu if open
      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      if (mobileMenuToggle?.checked) {
        mobileMenuToggle.checked = false;
        document.getElementById('mobile-menu').classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });
}

// Page Transition Animation
function navigateWithAnimation(url) {
  // Create animation overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = '#1E1E1E';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  
  // Create the loader
  const loader = document.createElement('div');
  loader.innerHTML = `
    <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
      <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#5EA08C" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
      <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#F5DEB3" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
      <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#2B6777" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
      <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#CFEF00" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
    </svg>
  `;
  
  overlay.appendChild(loader);
  document.body.appendChild(overlay);
  
  // Animate overlay in
  gsap.to(overlay, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }
  });
}

// Charts Initialization - Enhanced Chart Initialization with Animations
function getRadarChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: { color: '#F5DEB3' },
        grid: { color: '#3C3C3C' },
        pointLabels: {
          color: '#F5DEB3',
          font: { size: 14, family: "'Montserrat', sans-serif" }
        },
        ticks: { display: false, backdropColor: 'transparent' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        bodyFont: { size: 14, family: "'Montserrat', sans-serif" },
        titleFont: { size: 16, family: "'Montserrat', sans-serif", weight: 'bold' }
      }
    }
  };
}

// Initialize card background particle animations
function initCardParticles() {
  const cardCanvasElements = document.querySelectorAll('.card-bg-canvas');
  cardCanvasElements.forEach(animateCardParticles);
}

function animateCardParticles(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;
  let particles = [];
  const PARTICLE_COUNT = 12;
  const COLORS = ['#5EA08C', '#2B6777', '#F5DEB3', '#CFEF00'];
  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function Particle() {
    this.x = randomBetween(0, width);
    this.y = randomBetween(0, height);
    this.radius = randomBetween(1, 2.5);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.vx = randomBetween(-0.15, 0.15);
    this.vy = randomBetween(-0.15, 0.15);
    this.alpha = randomBetween(0.2, 0.5);
  }

  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  };

  Particle.prototype.draw = function(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  };

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw(ctx);
    }
    requestAnimationFrame(animate);
  }

  animate();
}

// Force separator/section bonding
function bondElements() {
  document.querySelectorAll('.separator').forEach(separator => {
    const nextSection = separator.nextElementSibling;
    if (nextSection) {
      separator.style.marginBottom = '-1px';
      nextSection.style.marginTop = '-1px';
    }
  });
}
bondElements();
window.addEventListener('resize', bondElements);
