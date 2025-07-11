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
  createBarChart();
  createRadarChart();
});

// CHARTS INITIALIZATION VALIDATION

document.addEventListener('DOMContentLoaded', () => {
  const radarCanvas = document.getElementById('skillsRadarChart');
  const barCanvas = document.getElementById('skillsBarChart');
  if (!radarCanvas || !barCanvas) {
    console.warn("Chart canvases not found in DOM!");
    return;
  }
});

// CHARTS

function createRadarChart() {
  const ctx = document.getElementById('skillsRadarChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Frontend', 'Backend', 'UI/UX', 'DevOps', 'Database'],
      datasets: [{
        label: 'Skill Level',
        data: [95, 75, 85, 70, 60],
        backgroundColor: 'rgba(94, 160, 140, 0.2)',
        borderColor: '#5EA08C',
        pointBackgroundColor: '#5EA08C'
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1200 },
      scales: {
        r: {
          angleLines: { color: '#F5DEB3' },
          grid: { color: '#3C3C3C' },
          pointLabels: {
            color: '#F5DEB3',
            font: { size: 14 }
          },
          ticks: { display: false }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function createBarChart() {
  const ctx = document.getElementById('skillsBarChart');
  if (!ctx) return;

  const finalData = [95, 80, 70, 85, 80, 75];
  const labels = ['React', 'Node.js', 'Python', 'Figma', 'Adobe XD', 'Git'];

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Proficiency',
        data: finalData.map(() => 0),
        backgroundColor: ['#5EA08C', '#5EA08C', '#5EA08C', '#F5DEB3', '#F5DEB3', '#5EA08C'],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      animation: {
        duration: 1000,
        onComplete: function () {
          chart.data.datasets[0].data = finalData;
          chart.update();
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          grid: { color: '#3C3C3C' },
          ticks: { color: '#F5DEB3', font: { size: 14 } }
        },
        y: {
          ticks: { color: '#F5DEB3', font: { size: 14 } },
          grid: { color: '#3C3C3C' }
        }
      },
      plugins: { legend: { display: false } }
    }
  });

  setTimeout(() => {
    chart.data.datasets[0].data = finalData;
    chart.update();
  }, 200);
}

// OBSERVER FOR CHART CONTAINERS

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.querySelector('#skillsRadarChart')) createRadarChart();
      if (entry.target.querySelector('#skillsBarChart')) createBarChart();
      entry.target.classList.add('animate-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.chart-container').forEach(container => {
  observer.observe(container);
});

// MENU TOGGLE

function initMenuToggle() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menuBox');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('hidden');
    menu.classList.toggle('show');
    document.body.classList.toggle('overflow-hidden');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      menu.classList.remove('show');
      document.body.classList.remove('overflow-hidden');
    }
  });

  document.querySelectorAll('.value').forEach(button => {
    button.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      menu.classList.remove('show');
      document.body.classList.remove('overflow-hidden');
    });
  });
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
