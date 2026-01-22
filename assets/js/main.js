// assets/js/main.js
let radarChart = null;
let barChart = null;

document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  initWorksSection();
  initAnchorNavigation();
  initScrollToTop();
  initCanvasBackground();
  initCardParticles();
  handleFormSubmit();

  setupChartsReplay();
  restoreWorksOpenIfNeeded();
});
function saveScrollForReturn() {
  localStorage.setItem('return_scrollY', String(window.scrollY || 0));
  // utile si tu veux aussi mémoriser la section
  localStorage.setItem('return_path', location.pathname);
}

function restoreScrollIfAny() {
  // seulement sur index
  if (!location.pathname.endsWith('/') && !location.pathname.endsWith('/index.html')) return;

  const y = localStorage.getItem('return_scrollY');
  if (!y) return;

  const scrollY = parseInt(y, 10);
  localStorage.removeItem('return_scrollY');
  localStorage.removeItem('return_path');

  // Important: wait layout
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });
  });
}

function initPortfolioReturnLinks() {
  document.querySelectorAll('.js-go-portfolio').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      saveScrollForReturn();
      // option: keep works open
      localStorage.setItem('keepWorksOpen', 'true');
      const url = btn.getAttribute('data-url');
      if (url) window.location.href = url;
    });
  });
}
// used by your buttons in HTML
window.redirectWithEffect = function (url, type = "fade") {
  if (typeof gsap === "undefined") {
    window.location.href = url;
    return;
  }
  const body = document.body;
  if (type === "fade") {
    gsap.to(body, { opacity: 0, duration: 0.55, onComplete: () => (window.location.href = url) });
  } else if (type === "slide") {
    gsap.to(body, { x: "-100%", opacity: 0, duration: 0.55, ease: "power1.inOut", onComplete: () => (window.location.href = url) });
  } else {
    window.location.href = url;
  }
};

/* -----------------------------
   MENU
-------------------------------- */
function initMenuToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menuBox");
  if (!menuToggle || !menu) return;

  const showMenu = () => {
    menu.classList.remove("hidden");
    menu.style.display = "block";
    menu.style.opacity = "1";
    menu.style.transform = "translateY(0)";
  };

  const hideMenu = () => {
    menu.classList.add("hidden");
    menu.style.display = "none";
    menuToggle.checked = false;
  };

  menuToggle.addEventListener("change", () => {
    if (menuToggle.checked) showMenu();
    else hideMenu();
  });

  menu.querySelectorAll("a.value").forEach((a) => {
    a.addEventListener("click", () => hideMenu());
  });

  document.addEventListener("click", (e) => {
    const clickedHamburger = e.target.closest(".hamburger");
    if (!menu.contains(e.target) && !clickedHamburger) hideMenu();
  });
}

/* -----------------------------
   WORKS SECTION TOGGLE
-------------------------------- */
function initWorksSection() {
  const btn = document.getElementById("toggle-works-btn");
  const works = document.getElementById("works-section");
  if (!btn || !works) return;

  let isOpen = false;

  const show = () => {
    works.classList.remove("hidden");
    works.style.opacity = "1";
    works.style.transform = "scaleY(1)";
    isOpen = true;
    const t = btn.querySelector(".btn-hero__text");
    if (t) t.textContent = "HIDE WORKS";
    setTimeout(() => works.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const hide = () => {
    works.style.opacity = "0";
    works.style.transform = "scaleY(0)";
    isOpen = false;
    const t = btn.querySelector(".btn-hero__text");
    if (t) t.textContent = "VIEW MY WORKS";
    setTimeout(() => works.classList.add("hidden"), 450);
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    isOpen ? hide() : show();
  });

  // default closed
  works.classList.add("hidden");
  works.style.opacity = "0";
  works.style.transform = "scaleY(0)";
}

function restoreWorksOpenIfNeeded() {
  const works = document.getElementById("works-section");
  const btn = document.getElementById("toggle-works-btn");
  if (!works || !btn) return;

  if (localStorage.getItem("keepWorksOpen") === "true") {
    localStorage.removeItem("keepWorksOpen");
    works.classList.remove("hidden");
    works.style.opacity = "1";
    works.style.transform = "scaleY(1)";
    const t = btn.querySelector(".btn-hero__text");
    if (t) t.textContent = "HIDE WORKS";
    setTimeout(() => works.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }
}

/* -----------------------------
   ANCHOR NAVIGATION
-------------------------------- */
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* -----------------------------
   SCROLL TO TOP
-------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById("scrollToTopBtn");
  if (!btn) return;

  btn.classList.add("hidden");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  });

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* -----------------------------
   CHARTS
-------------------------------- */
function setupChartsReplay() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  if (typeof Chart === "undefined") {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (typeof Chart !== "undefined") {
        clearInterval(t);
        setupChartsReplay();
      }
      if (tries > 40) clearInterval(t);
    }, 150);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      destroyCharts();
      createRadarChart();
      createBarChart();
    },
    { threshold: 0.35 }
  );

  io.observe(skillsSection);

  // init if already visible
  setTimeout(() => {
    const r = skillsSection.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      destroyCharts();
      createRadarChart();
      createBarChart();
    }
  }, 500);
}

function destroyCharts() {
  if (radarChart) {
    radarChart.destroy();
    radarChart = null;
  }
  if (barChart) {
    barChart.destroy();
    barChart = null;
  }
}

function createRadarChart() {
  const canvas = document.getElementById("skillsRadarChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Frontend", "Backend", "UI/UX", "DevOps", "Database"],
      datasets: [
        {
          data: [95, 75, 85, 70, 60],
          backgroundColor: "rgba(94, 160, 140, 0.20)",
          borderColor: "#5EA08C",
          pointBackgroundColor: "#5EA08C",
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false },
          angleLines: { color: "rgba(245,222,179,0.55)" },
          grid: { color: "rgba(60,60,60,0.6)" },
          pointLabels: { color: "#F5DEB3", font: { size: 14 } },
        },
      },
    },
  });
}

function createBarChart() {
  const canvas = document.getElementById("skillsBarChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const gradTeal = ctx.createLinearGradient(0, 0, 350, 0);
  gradTeal.addColorStop(0, "rgba(35, 70, 62, 0.95)");
  gradTeal.addColorStop(1, "rgba(94, 160, 140, 0.85)");

  const gradBeige = ctx.createLinearGradient(0, 0, 350, 0);
  gradBeige.addColorStop(0, "rgba(70, 55, 30, 0.95)");
  gradBeige.addColorStop(1, "rgba(245, 222, 179, 0.85)");

  const labels = ["React", "Node.js", "Python", "Figma", "Adobe XD", "Git"];
  const values = [95, 80, 70, 85, 80, 75];

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: values,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: (c) => {
            const label = c.chart.data.labels[c.dataIndex];
            return label === "Figma" || label === "Adobe XD" ? gradBeige : gradTeal;
          },
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1100, easing: "easeOutQuart" },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "#F5DEB3", stepSize: 20 },
          grid: { color: "rgba(60,60,60,0.45)" },
        },
        y: {
          ticks: { color: "#F5DEB3" },
          grid: { color: "rgba(60,60,60,0.25)" },
        },
      },
    },
  });
}

/* -----------------------------
   CANVAS BACKGROUND
-------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById("background-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particleCount = window.innerWidth < 768 ? 25 : 55;
  const colors = ["#5EA08C", "#2B6777", "#F5DEB3"];

  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    vx: Math.random() * 0.8 - 0.4,
    vy: Math.random() * 0.8 - 0.4,
    c: colors[(Math.random() * colors.length) | 0],
  }));

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.y > canvas.height) p.y = 0;
      if (p.y < 0) p.y = canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* -----------------------------
   CARD HOVER PARTICLES
-------------------------------- */
function initCardParticles() {
  document.querySelectorAll(".bg-border").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dot = document.createElement("span");
      dot.style.position = "absolute";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      dot.style.width = "7px";
      dot.style.height = "7px";
      dot.style.borderRadius = "999px";
      dot.style.pointerEvents = "none";
      dot.style.background = "rgba(99,193,255,0.6)";
      dot.style.opacity = "1";
      dot.style.zIndex = "20";
      dot.style.transition = "opacity 0.6s, transform 0.6s";

      card.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.opacity = "0";
        dot.style.transform = "scale(2)";
      });

      setTimeout(() => dot.remove(), 650);
    });
  });
}

/* -----------------------------
   CONTACT FORM
-------------------------------- */
function handleFormSubmit() {
  const contactForm = document.querySelector("#contact-section form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const oldHtml = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending...";
      await new Promise((r) => setTimeout(r, 900));
      contactForm.reset();
      showNotification("Message sent successfully!");
    } catch {
      showNotification("Error sending message. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = oldHtml;
    }
  });
}

function showNotification(message, type = "success") {
  const n = document.createElement("div");
  n.className =
    "fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transition-all duration-300 " +
    (type === "success" ? "bg-green-500" : "bg-red-500");

  n.textContent = message;
  document.body.appendChild(n);

  setTimeout(() => {
    n.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => n.remove(), 300);
  }, 2200);
}