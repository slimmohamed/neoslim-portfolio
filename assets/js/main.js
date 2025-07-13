// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
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
  
  // Initialize charts with delay to ensure DOM is ready
  setTimeout(() => {
    console.log('Initializing charts...');
    console.log('Chart.js available:', typeof Chart !== 'undefined');
    if (typeof Chart !== 'undefined') {
      createBarChart();
      createRadarChart();
    } else {
      console.log('Waiting for Chart.js to load...');
      // Wait for Chart.js to load
      const checkChart = setInterval(() => {
        if (typeof Chart !== 'undefined') {
          console.log('Chart.js now available, creating charts...');
          clearInterval(checkChart);
          createBarChart();
          createRadarChart();
        }
      }, 100);
    }
  }, 1000);
  
  // Also initialize charts when skills section comes into view
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Skills section visible, initializing charts...');
          setTimeout(() => {
            if (typeof Chart !== 'undefined') {
              if (!radarChart) createRadarChart();
              if (!barChart) createBarChart();
            } else {
              console.log('Chart.js not available when skills section visible');
            }
          }, 500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(skillsSection);
  }

  // Fallback: Initialize charts after a longer delay
  setTimeout(() => {
    if (!radarChart || !barChart) {
      console.log('Fallback chart initialization...');
      createRadarChart();
      createBarChart();
    }
  }, 3000);

  // Test function - you can call this in browser console: testCharts()
  window.testCharts = function() {
    console.log('Testing charts...');
    console.log('Chart.js available:', typeof Chart !== 'undefined');
    console.log('Radar canvas:', document.getElementById('skillsRadarChart'));
    console.log('Bar canvas:', document.getElementById('skillsBarChart'));
    createRadarChart();
    createBarChart();
  };
});

// CHARTS INITIALIZATION VALIDATION
let radarChart, barChart;

function createRadarChart() {
  const ctx = document.getElementById('skillsRadarChart');
  console.log('Creating radar chart, ctx:', ctx);
  if (!ctx) {
    console.log('Radar chart canvas not found');
    return;
  }
  if (radarChart) {
    console.log('Radar chart already exists');
    return;
  }

  // Check if Chart is available
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  // Debug canvas visibility
  console.log('Radar canvas dimensions:', ctx.width, ctx.height);
  console.log('Radar canvas style:', ctx.style.width, ctx.style.height);
  console.log('Radar canvas display:', window.getComputedStyle(ctx).display);

  // Set canvas dimensions
  ctx.style.width = '100%';
  ctx.style.height = '100%';

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
    console.log('Radar chart created successfully');
  } catch (error) {
    console.error('Error creating radar chart:', error);
  }
}

function createBarChart() {
  const ctx = document.getElementById('skillsBarChart');
  console.log('Creating bar chart, ctx:', ctx);
  if (!ctx) {
    console.log('Bar chart canvas not found');
    return;
  }

  // Check if Chart is available
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  // Debug canvas visibility
  console.log('Bar canvas dimensions:', ctx.width, ctx.height);
  console.log('Bar canvas style:', ctx.style.width, ctx.style.height);
  console.log('Bar canvas display:', window.getComputedStyle(ctx).display);

  // Set canvas dimensions
  ctx.style.width = '100%';
  ctx.style.height = '100%';

  // Data configuration
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

  // Create the chart with particle effects
  try {
    barChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          onComplete: () => {
            console.log('Bar chart animation completed');
          }
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
    console.log('Bar chart created successfully');
  } catch (error) {
    console.error('Error creating bar chart:', error);
  }
}
// Charts are initialized in the main DOMContentLoaded event listener


// MENU TOGGLE

function initMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menuBox');
  
  if (!menuToggle || !menu) return;

  // Handle checkbox change
  menuToggle.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      showMenu();
    } else {
      hideMenu();
    }
  });

  // Handle label click for toggle
  const hamburgerLabel = menuToggle.closest('.hamburger');
  if (hamburgerLabel) {
    hamburgerLabel.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyVisible = menu.classList.contains('show');
      
      if (isCurrentlyVisible) {
        hideMenu();
        menuToggle.checked = false;
      } else {
        showMenu();
        menuToggle.checked = true;
      }
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuToggle.contains(e.target) && !hamburgerLabel.contains(e.target)) {
      hideMenu();
      menuToggle.checked = false;
    }
  });

  // Close menu when clicking on menu items
  document.querySelectorAll('.value').forEach(button => {
    button.addEventListener('click', () => {
      hideMenu();
      menuToggle.checked = false;
    });
  });

  function showMenu() {
    menu.classList.remove('hide');
    menu.classList.add('show');
  }

  function hideMenu() {
    menu.classList.remove('show');
    menu.classList.add('hide');
  }
}

// WORKS SECTION TOGGLE

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
      if (isWorksVisible) showWorksSection();
      else hideWorksSection();
    }

    function showWorksSection() {
      worksSection.classList.remove('hidden');
      worksSection.style.opacity = '1';
      worksSection.style.transform = 'scaleY(1)';
      toggleWorksButton.querySelector('.btn-hero__text').textContent = 'HIDE WORKS';
      setTimeout(() => {
        worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }

    function hideWorksSection() {
      worksSection.style.opacity = '0';
      worksSection.style.transform = 'scaleY(0)';
      toggleWorksButton.querySelector('.btn-hero__text').textContent = 'VIEW MY WORKS';
      setTimeout(() => {
        worksSection.classList.add('hidden');
      }, 500);
    }

    worksSection.classList.add('hidden');
    worksSection.style.opacity = '0';
    worksSection.style.transform = 'scaleY(0)';
  }
}
// Back button animation handler
function initBackButtons() {
  document.querySelectorAll('.back-button-container').forEach(btn => {
    btn.addEventListener('click', () => window.history.back());
  });
}
// SCROLL ANIMATIONS (GSAP)

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

  gsap.from('.gsap-fade-in-up', {
    scrollTrigger: {
      trigger: '.gsap-fade-in-up',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Animate sections except works-section which has its own toggle
  gsap.utils.toArray('section:not(#works-section)').forEach((section, i) => {
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

// CANVAS BACKGROUND ANIMATION

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

// CONTACT FORM HANDLING

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
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
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
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
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

// Contact section animation
(function() {
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
      window.removeEventListener('scroll', animateContactSection);
    }
  }
  window.addEventListener('scroll', animateContactSection);
  animateContactSection();
})();
