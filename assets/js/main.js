// /assets/js/main.js
"use strict";

/* =========================================================
   GLOBAL STATE
========================================================= */
let radarChart = null;
let barChart = null;

/* =========================================================
   RETURN TO LAST POSITION (Design/Coding -> back same scroll)
   Uses sessionStorage (best for "back from another page")
========================================================= */
const RETURN_KEY = "neo_return_state";

function saveReturnState(anchorId = null) {
  const state = {
    y: window.scrollY || 0,
    anchor: anchorId || (location.hash ? location.hash.replace("#", "") : null),
    t: Date.now(),
  };
  sessionStorage.setItem(RETURN_KEY, JSON.stringify(state));
}

function restoreReturnState() {
  // Only on index page
  const isIndex =
    location.pathname.endsWith("/") ||
    location.pathname.endsWith("/index.html") ||
    location.pathname === "";

  if (!isIndex) return;

  const raw = sessionStorage.getItem(RETURN_KEY);
  if (!raw) return;

  let state;
  try {
    state = JSON.parse(raw);
  } catch {
    return;
  }

  // only restore if recent (30 min)
  if (!state?.t || Date.now() - state.t > 1000 * 60 * 30) return;

  // If we return to works, keep it open
  if (state.anchor === "works-section") {
    localStorage.setItem("keepWorksOpen", "true");
  }

  // Wait for layout + works open restoration
  requestAnimationFrame(() => {
    setTimeout(() => {
      // If we have anchor, go there (with header offset)
      if (state.anchor) {
        const el = document.getElementById(state.anchor);
        if (el) {
          const headerH = document.querySelector("header")?.offsetHeight || 120;
          const y = el.getBoundingClientRect().top + window.scrollY - (headerH + 12);
          window.scrollTo({ top: y, left: 0, behavior: "auto" });
        } else {
          window.scrollTo({ top: state.y, left: 0, behavior: "auto" });
        }
      } else {
        window.scrollTo({ top: state.y, left: 0, behavior: "auto" });
      }

      // Clean key once used (prevents random old restores)
      sessionStorage.removeItem(RETURN_KEY);
    }, 80);
  });
}

/* =========================================================
   MENU (hamburger) - FIXED for ALL pages
========================================================= */
function initMenuToggleFixed() {
  const menuToggle = document.getElementById("menuToggle");
  const menuBox = document.getElementById("menuBox");
  if (!menuToggle || !menuBox) return;

  const open = () => {
    menuBox.classList.add("is-open");
    menuToggle.checked = true;
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    menuBox.classList.remove("is-open");
    menuToggle.checked = false;
    document.body.classList.remove("no-scroll");
  };

  // Toggle
  menuToggle.addEventListener("change", () => {
    if (menuToggle.checked) open();
    else close();
  });

  // Close on link click (and smooth scroll with header offset)
  menuBox.querySelectorAll('a.value[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;

      // if anchor exists on this page: smooth scroll
      if (target) {
        e.preventDefault();
        close();

        const headerH = document.querySelector("header")?.offsetHeight || 120;
        const y = target.getBoundingClientRect().top + window.scrollY - (headerH + 12);
        window.scrollTo({ top: y, behavior: "smooth" });

        // update hash without jump
        history.replaceState(null, "", `#${id}`);
      } else {
        // normal navigation (another page)
        close();
      }
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    const clickedHamburger = e.target.closest(".hamburger");
    const clickedMenu = menuBox.contains(e.target);
    if (!clickedMenu && !clickedHamburger) close();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* =========================================================
   WORKS SECTION TOGGLE (index only)
========================================================= */
function initWorksSection() {
  const btn = document.getElementById("toggle-works-btn");
  const works = document.getElementById("works-section");
  if (!btn || !works) return;

  let isOpen = false;

  const show = () => {
    works.classList.remove("hidden");
    works.classList.add("is-visible");
    isOpen = true;

    const t = btn.querySelector(".btn-hero__text");
    if (t) t.textContent = "HIDE WORKS";

    setTimeout(() => works.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const hide = () => {
    works.classList.remove("is-visible");
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
  works.classList.remove("is-visible");
}

function restoreWorksOpenIfNeeded() {
  const works = document.getElementById("works-section");
  const btn = document.getElementById("toggle-works-btn");
  if (!works || !btn) return;

  if (localStorage.getItem("keepWorksOpen") === "true") {
    localStorage.removeItem("keepWorksOpen");
    works.classList.remove("hidden");
    works.classList.add("is-visible");

    const t = btn.querySelector(".btn-hero__text");
    if (t) t.textContent = "HIDE WORKS";

    // do NOT force scroll if returnState already will scroll precisely
  }
}

/* =========================================================
   WORKS BUTTONS -> Save return state + go to page
   (Use on index panels/buttons)
========================================================= */
function initWorksReturnButtons() {
  document.querySelectorAll(".js-go-portfolio").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      saveReturnState("works-section");
      localStorage.setItem("keepWorksOpen", "true");
      const url = btn.getAttribute("data-url") || btn.getAttribute("data-go");
      if (url) window.location.href = url;
    });
  });
}

/* =========================================================
   "Go Home" buttons on portfolio pages
   - Save current Y and return anchor -> works-section
========================================================= */
function initGoHomeButtons() {
  document.querySelectorAll("[data-go-home]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      saveReturnState("works-section");
      localStorage.setItem("keepWorksOpen", "true");
      window.location.href = "/index.html#works-section";
    });
  });
}

/* =========================================================
   Anchor navigation (if user clicks # links)
========================================================= */
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = document.querySelector("header")?.offsetHeight || 120;
      const y = target.getBoundingClientRect().top + window.scrollY - (headerH + 12);
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}
// main.js
window.initHeaderMenu = function initHeaderMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuBox = document.getElementById('menuBox');

  if (!menuToggle || !menuBox) return;

  // Sécurité: éviter doubles listeners si init appelée plusieurs fois
  if (menuToggle.dataset.bound === "1") return;
  menuToggle.dataset.bound = "1";

  const closeMenu = () => {
    menuToggle.checked = false;
    menuBox.classList.add('hidden');
  };

  const openMenu = () => {
    menuToggle.checked = true;
    menuBox.classList.remove('hidden');
  };

  // Toggle via checkbox change
  menuToggle.addEventListener('change', () => {
    if (menuToggle.checked) openMenu();
    else closeMenu();
  });

  // Click sur un lien => fermer
  menuBox.querySelectorAll('a.value').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Click dehors => fermer
  document.addEventListener('click', (e) => {
    const clickedHamburger = e.target.closest('.hamburger');
    if (!menuBox.contains(e.target) && !clickedHamburger) {
      closeMenu();
    }
  });

  // Optionnel: fermer au scroll
  window.addEventListener('scroll', () => closeMenu(), { passive: true });
};

/* =========================================================
   Scroll To Top button - fixed position and visibility
========================================================= */
function initScrollToTop() {
  const btn = document.getElementById("scrollToTopBtn");
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 400) btn.classList.add("is-visible");
    else btn.classList.remove("is-visible");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   Background video optimization
   - avoid autoplay on mobile (speed)
========================================================= */
function optimizeBackgroundVideo() {
  const bg = document.getElementById("bg-video");
  if (!bg) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isMobile || prefersReduced) {
    try { bg.pause(); } catch {}
    return;
  }

  // Desktop: try play after paint
  requestAnimationFrame(() => {
    bg.play().catch(() => {
      window.addEventListener("click", () => bg.play().catch(() => {}), { once: true });
      window.addEventListener("touchstart", () => bg.play().catch(() => {}), { once: true });
    });
  });
}

/* =========================================================
   Charts (Skills) - replay when section visible
========================================================= */
function setupChartsReplay() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  if (typeof Chart === "undefined") return;

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
  }, 450);
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
          backgroundColor: "rgba(94,160,140,0.20)",
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
  gradTeal.addColorStop(0, "rgba(35,70,62,0.95)");
  gradTeal.addColorStop(1, "rgba(94,160,140,0.85)");

  const gradBeige = ctx.createLinearGradient(0, 0, 350, 0);
  gradBeige.addColorStop(0, "rgba(70,55,30,0.95)");
  gradBeige.addColorStop(1, "rgba(245,222,179,0.85)");

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

/* =========================================================
   Canvas background (keep light; not heavy)
========================================================= */
function initCanvasBackground() {
  const canvas = document.getElementById("background-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const particleCount = window.innerWidth < 768 ? 18 : 42; // lighter than before
  const colors = ["#5EA08C", "#2B6777", "#F5DEB3"];

  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.6 + 0.8,
    vx: Math.random() * 0.5 - 0.25,
    vy: Math.random() * 0.5 - 0.25,
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

/* =========================================================
   Card hover particles (optional; keep but light)
========================================================= */
function initCardParticles() {
  document.querySelectorAll(".bg-border").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dot = document.createElement("span");
      dot.className = "card-hover-dot";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      card.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.opacity = "0";
        dot.style.transform = "scale(2)";
      });

      setTimeout(() => dot.remove(), 650);
    });
  });
}

/* =========================================================
   Contact form (visual only) - do NOT block Formspree
========================================================= */
function handleFormSubmit() {
  const contactForm = document.querySelector("#contact-section form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", () => {
    // Let Formspree handle it normally (no preventDefault)
    const btn = contactForm.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add("is-loading");
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("is-loading");
    }, 1600);
  });
}

/* =========================================================
   DOM READY
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // index restore
  restoreWorksOpenIfNeeded();
  restoreReturnState();

  // menu
  initMenuToggleFixed();

  // sections
  initWorksSection();
  initAnchorNavigation();
  initScrollToTop();
  initWorksReturnButtons();
  initGoHomeButtons();

  // visuals + perf
  optimizeBackgroundVideo();
  initCanvasBackground();
  initCardParticles();

  // charts
  setupChartsReplay();

  // form
  handleFormSubmit();
});
