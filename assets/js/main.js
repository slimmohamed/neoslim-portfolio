// Main JavaScript for Portfolio Website

// Chart instances
let radarChart = null;
let barChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  initHeaderMenu();
  initWorksSection();
  initSmoothScrolling();
  initAnimations();
  initCardParticles();
  initGSAPAnimations();
  initCanvasBackground();
  initAnchorNavigation();
  initNavigationButtons();
  initCollapsibleSections();
  handleFormSubmit();
  initScrollToTop();

  // Chart initialization logic
  function tryInitCharts() {
    if (typeof Chart !== 'undefined') {
      if (!barChart) createBarChart();
      if (!radarChart) createRadarChart();
      return true;
    }
    return false;
  }

  // Try to initialize charts after DOM is ready
  setTimeout(() => {
    if (!tryInitCharts()) {
      // Wait for Chart.js to load
      const checkChart = setInterval(() => {
        if (tryInitCharts()) {
          clearInterval(checkChart);
        }
      }, 100);
    }
  }, 1000);

  // Also initialize charts when skills section comes into view
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            tryInitCharts();
          }, 500);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(skillsSection);
  }

  // Fallback: Initialize charts after a longer delay
  setTimeout(() => {
    tryInitCharts();
  }, 3000);

  // Additional fallback: Initialize charts when window loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      tryInitCharts();
    }, 1000);
  });

  // Test function - you can call this in browser console: testCharts()
  window.testCharts = function() {
    createRadarChart();
    createBarChart();
  };
});

// CHARTS INITIALIZATION

function createRadarChart() {
  if (radarChart) return;
  const ctx = document.getElementById('skillsRadarChart');
  if (!ctx) return;
  if (typeof Chart === 'undefined') return;

  ctx.style.width = '100%';
  ctx.style.height = '100%';
  ctx.style.display = 'block';

  try {
    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Frontend', 'Backend', 'UI/UX', 'DevOps', 'Database'],
        datasets: [{
          label: 'Skill Level',
          data: [95, 75, 85, 70, 60],
          backgroundColor: 'rgba(94, 160, 140, 0.2)',
          borderColor: '#5EA08C',
          pointBackgroundColor: '#5EA08C',
          borderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200 },
        scales: {
          r: {
            angleLines: { color: '#F5DEB3' },
            grid: { color: '#3C3C3C' },
            pointLabels: { color: '#F5DEB3', font: { size: 14 } },
            ticks: { display: false },
            beginAtZero: true,
            max: 100
          }
        },
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            titleColor: '#F5DEB3',
            bodyColor: '#F4F4F5'
          }
        }
      }
    });
  } catch (error) {
    radarChart = null;
  }
}

function createBarChart() {
  if (barChart) return;
  const ctx = document.getElementById('skillsBarChart');
  if (!ctx) return;
  if (typeof Chart === 'undefined') return;

  ctx.style.width = '100%';
  ctx.style.height = '100%';
  ctx.style.display = 'block';

  const data = {
    labels: ['React', 'Node.js', 'Python', 'Figma', 'Adobe XD', 'Git'],
    datasets: [{
      label: 'Proficiency',
      data: [95, 80, 70, 85, 80, 75],
      backgroundColor: [
        'rgba(94, 160, 140, 0.7)',
        'rgba(94, 160, 140, 0.7)',
        'rgba(94, 160, 140, 0.7)',
        'rgba(245, 222, 179, 0.7)',
        'rgba(245, 222, 179, 0.7)',
        'rgba(94, 160, 140, 0.7)'
      ],
      borderColor: [
        '#5EA08C',
        '#5EA08C',
        '#5EA08C',
        '#F5DEB3',
        '#F5DEB3',
        '#5EA08C'
      ],
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  try {
    barChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(60, 60, 60, 0.5)'
            },
            ticks: {
              color: '#F5DEB3',
              stepSize: 20
            }
          },
          y: {
            grid: {
              color: 'rgba(60, 60, 60, 0.5)'
            },
            ticks: {
              color: '#F5DEB3'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            titleColor: '#F5DEB3',
            bodyColor: '#F4F4F5'
          }
        }
      }
    });
  } catch (error) {
    barChart = null;
  }
}

// MENU TOGGLE

function initMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menuBox');
  if (!menuToggle || !menu) return;

  // Animate menu show/hide with GSAP
  function showMenu() {
    menu.classList.remove('hidden');
    gsap.to(menu, { opacity: 1, y: 0, duration: 0.35, pointerEvents: 'auto', onStart: () => { menu.style.display = 'block'; } });
  }
  function hideMenu() {
    gsap.to(menu, { opacity: 0, y: -20, duration: 0.3, pointerEvents: 'none', onComplete: () => { menu.classList.add('hidden'); menu.style.display = 'none'; } });
  }

  menuToggle.addEventListener('change', () => {
    if (menuToggle.checked) {
      showMenu();
    } else {
      hideMenu();
    }
  });
  // (Restored/fixed block for menu toggle with correct variable names)
  if (menuToggle && menu) {
    menuToggle.addEventListener('change', () => {
      if (menuToggle.checked) {
        menu.classList.add('block', 'animate-in');
        document.body.classList.add('overflow-hidden');
      } else {
        menu.classList.remove('block', 'animate-in');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }
  // Hide menu when clicking a menu item
  menu.querySelectorAll('.value').forEach(btn => {
    btn.addEventListener('click', () => {
      hideMenu();
      menuToggle.checked = false;
    });
  });

  // Hide menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target) && !e.target.closest('.hamburger')) {
      hideMenu();
      menuToggle.checked = false;
    }
  });
  // Add glitch effect when menu opens
  menuToggle.addEventListener('change', () => {
    if (menuToggle.checked) {
      menu.classList.add('glitch');
      setTimeout(() => {
        menu.classList.remove('glitch');
      }, 1000);
    }
  });

}
// Add when opening the menu
function openMenuVisuals() {
  menu.classList.add('block', 'animate-in', 'glitch');
}
// Remove when closing the menu
function closeMenuVisuals() {
  menu.classList.remove('block', 'animate-in', 'glitch');
}

function initHeaderMenu() {
  // This function is kept for backward compatibility, but is redundant.
  // It just calls initMenuToggle, which is already called in DOMContentLoaded.
}

// WORKS SECTION TOGGLE
function initWorksSection() {
  const toggleWorksButton = document.getElementById('toggle-works-btn');
  const worksSection = document.getElementById('works-section');
  if (!toggleWorksButton || !worksSection) return;

  let isWorksVisible = false;

  toggleWorksButton.addEventListener('click', (e) => {
    e.preventDefault();
    toggleWorksVisibility();
  });

  function toggleWorksVisibility() {
    isWorksVisible = !isWorksVisible;
    if (isWorksVisible) showWorksSection();
    else hideWorksSection();
  }

  function showWorksSection() {
    worksSection.classList.remove('hidden');
    worksSection.style.opacity = '1';
    worksSection.style.transform = 'scaleY(1)';
    const btnText = toggleWorksButton.querySelector('.btn-hero__text');
    if (btnText) btnText.textContent = 'HIDE WORKS';
    setTimeout(() => {
      worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function hideWorksSection() {
    worksSection.style.opacity = '0';
    worksSection.style.transform = 'scaleY(0)';
    const btnText = toggleWorksButton.querySelector('.btn-hero__text');
    if (btnText) btnText.textContent = 'VIEW MY WORKS';
    setTimeout(() => {
      worksSection.classList.add('hidden');
    }, 500);
  }

  if (localStorage.getItem("keepWorksOpen") === "true") {
    worksSection.classList.remove("hidden");
    localStorage.removeItem("keepWorksOpen");
    isWorksVisible = true;
    showWorksSection();
  } else {
    worksSection.classList.add('hidden');
    worksSection.style.opacity = '0';
    worksSection.style.transform = 'scaleY(0)';
  }
}

// BACK BUTTONS
function initBackButtons() {
  document.querySelectorAll('.back-button-container').forEach(btn => {
    btn.addEventListener('click', () => window.history.back());
  });
}
gsap.from("#article-section img", {
  y: -40,
  opacity: 0,
  duration: 1.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#article-section",
    start: "top 80%",
  }
});
// SCROLL ANIMATIONS (GSAP)
function initGSAPAnimations() {
  // All scroll-triggered hide/show animations removed. All items are always visible.
}

// CANVAS BACKGROUND ANIMATION
function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

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

  window.addEventListener('resize', resizeCanvas);
}

// CONTACT FORM HANDLING
function handleFormSubmit() {
  const contactForm = document.querySelector('#contact-section form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
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
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('bg-video');
  video.play().catch(e => {
    // Fallback for mobile devices that block autoplay
    video.muted = true;
    video.play();
  });
});
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white transition-all duration-300`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ANCHOR SCROLLING
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });
}

// NAVIGATION BUTTON REDIRECT
function initNavigationButtons() {
  document.querySelectorAll('.navigate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-url');
      if (target) window.location.href = target;
    });
  });
}

// COLLAPSIBLE SECTIONS
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

// SIMPLE SCROLLING ANIMATION
function initAnimations() {
  const about = document.querySelector('.about-content');
  if (about) {
    const onScroll = () => {
      const rect = about.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        about.style.transition = 'opacity 0.8s, transform 0.8s';
        about.style.opacity = 1;
        about.style.transform = 'translateY(0)';
        window.removeEventListener('scroll', onScroll);
      }
    };
    about.style.opacity = 0;
    about.style.transform = 'translateY(40px)';
    window.addEventListener('scroll', onScroll);
    onScroll();
  }
}

// PARTICLE HOVER EFFECT ON CARDS
function initCardParticles() {
  document.querySelectorAll('.bg-border').forEach(card => {
    card.addEventListener('mousemove', e => {
      let rect = card.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      let particle = document.createElement('span');
      particle.style.position = 'absolute';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.background = 'rgba(99,193,255,0.7)';
      particle.style.opacity = 1;
      particle.style.zIndex = 20;
      particle.style.transition = 'opacity 0.7s, transform 0.7s';
      card.appendChild(particle);
      setTimeout(() => {
        particle.style.opacity = 0;
        particle.style.transform = 'scale(2)';
      }, 10);
      setTimeout(() => {
        particle.remove();
      }, 700);
    });
  });
}

// DUPLICATED SCROLL FIX
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (!link.hash || link.hash === '#') return;
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initScrollToTop() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (!scrollToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove("hidden");
    } else {
      scrollToTopBtn.classList.add("hidden");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", initScrollToTop);


// Contact section animation
function animateContactSection() {
  var section = document.getElementById('contact-section');
  if (!section) return;
  var logo = document.getElementById('contact-logo');
  var form = document.getElementById('contact-form-animated');
  var fields = document.querySelectorAll('.contact-field');
  var sectionRect = section.getBoundingClientRect();
  var windowHeight = window.innerHeight || document.documentElement.clientHeight;
  if (sectionRect.top < windowHeight - 100) {
    section.classList.add('animate-in');
    setTimeout(function() {
      if (logo) logo.classList.add('animate-in');
    }, 200);
    setTimeout(function() {
      if (form) form.classList.add('animate-in');
    }, 400);
    fields.forEach(function(field, i) {
      setTimeout(function() {
        field.classList.add('animate-in');
      }, 600 + i * 120);
    });
    // Ensure animation only runs once
    window.removeEventListener('scroll', animateContactSection);
    if (window.location.hash === '#contact-section') {
      setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    // Ensure scroll-to-top button hides if contact-section is in view
    if (sectionRect.top < windowHeight - 100) {
      const btn = document.getElementById("scrollToTopBtn");
      if (btn) btn.classList.add("hidden");
    }
  }
}