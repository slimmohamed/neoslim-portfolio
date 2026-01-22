// assets/js/main.js (FULL FIXED)

// ===== Charts instances =====
let radarChart = null;
let barChart = null;

// ===============================
// RETURN TO LAST POSITION (Design/Coding -> Back same scroll)
// ===============================
function saveReturnState(anchorId = null) {
  const state = {
    y: window.scrollY || 0,
    anchor: anchorId || (location.hash ? location.hash.replace("#", "") : null),
    t: Date.now(),
  };
  sessionStorage.setItem("neo_return_state", JSON.stringify(state));
}

function restoreReturnState() {
  // Only restore on index
  const isIndex =
    location.pathname.endsWith("/") ||
    location.pathname.endsWith("/index.html") ||
    location.pathname === "/index.html";

  if (!isIndex) return;

  const raw = sessionStorage.getItem("neo_return_state");
  if (!raw) return;

  let state;
  try {
    state = JSON.parse(raw);
  } catch {
    return;
  }

  // Only restore if recent (30 min)
  if (!state?.t || Date.now() - state.t > 1000 * 60 * 30) return;

  // Keep works open if coming from works
  if (state.anchor === "works-section") {
    localStorage.setItem("keepWorksOpen", "true");
  }

  // Do not delete immediately; let layout settle then clear
  requestAnimationFrame(() => {
    // If anchor exists, scroll to it with header offset
    if (state.anchor) {
      const el = document.getElementById(state.anchor);
      if (el) {
        const headerH = document.querySelector("header")?.offsetHeight || 120;
        const top = el.getBoundingClientRect().top + window.scrollY - (headerH + 12);
        window.scrollTo({ top, left: 0, behavior: "auto" });
      } else {
        window.scrollTo({ top: state.y, left: 0, behavior: "auto" });
      }
    } else {
      window.scrollTo({ top: state.y, left: 0, behavior: "auto" });
    }

    // Clear after restore
    setTimeout(() => {
      sessionStorage.removeItem("neo_return_state");
    }, 500);
  });
}

// ===============================
// PERF: Background video optimization
// ===============================
function optimizeBackgroundVideo() {
  const bg = document.getElementById("bg-video");
  if (!bg) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // On mobile or reduced motion: keep paused (poster only)
  if (isMobile || prefersReduced) {
    try {
      bg.pause();
    } catch {}
    return;
  }

  // Desktop: try play (may be blocked)
  requestAnimationFrame(() => {
    bg.play().catch(() => {
      window.addEventListener(
        "click",
        () => bg.play().catch(() => {}),
        { once: true }
      );
      window.addEventListener(
        "touchstart",
        () => bg.play().catch(() => {}),
        { once: true }
      );
    });
  });
}

// ===============================
// Works buttons: store return + go
// ===============================
function initWorksReturnButtons() {
  document.querySelectorAll(".js-go-portfolio").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Save exact place + anchor
      saveReturnState("works-section");
      localStorage.setItem("keepWorksOpen", "true");
      const url = btn.getAttribute("data-go");
      if (url) window.location.href = url;
    });
  });
}

// ===============================
// OPTIONAL: used by old HTML onclick if still present
// ===============================
window.redirectWithEffect = function (url, type = "fade") {
  saveReturnState("works-section");
  localStorage.setItem("keepWorksOpen", "true");

  if (typeof gsap === "undefined") {
    window.location.href = url;
    return;
  }

  const body = document.body;

  if (type === "fade") {
    gsap.to(body, {
      opacity: 0,
      duration: 0.55,
      onComplete: () => (window.location.href = url),
    });
  } else if (type === "slide") {
    gsap.to(body, {
      x: "-100%",
      opacity: 0,
      duration: 0.55,
      ease: "power1.inOut",
      onComplete: () => (window.location.href = url),
    });
  } else {
    window.location.href = url;
  }
};

// ===============================
// MENU (fixed: stable open/close, closes on outside/esc, smooth offset)
// ===============================
function initMenuToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const menuBox = document.getElementById("menuBox");
  if (!menuToggle || !menuBox) return;

  const open = () => {
    menuBox.classList.add("is-open");
    document.body.classList.add("overflow-hidden");
    menuToggle.checked = true;
  };

  const close = () => {
    menuBox.classList.remove("is-open");
    document.body.classList.remove("overflow-hidden");
    menuToggle.checked = false;
  };

  menuToggle.addEventListener("change", () => {
    if (menuToggle.checked) open();
    else close();
  });

  // Click menu item => close (+ smooth scroll with header offset)
  menuBox.querySelectorAll('a.value[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") {
        close();
        return;
      }

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) {
        close();
        return;
      }

      e.preventDefault();
      close();

      const headerH = document.querySelector("header")?.offsetHeight || 120;
      const top = target.getBoundingClientRect().top + window.scrollY - (headerH + 12);

      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    });
  });

  // Click outside => close
  document.addEventListener("click", (e) => {
    const inside = menuBox.contains(e.target) || e.target.closest(".hamburger");
    if (!inside && menuToggle.checked) close();
  });

  // ESC => close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuToggle.checked) close();
  });
}

// ===============================
// WORKS SECTION toggle (VIEW MY WORKS)
// ===============================
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
  }
}

// ===============================
// Anchor navigation (outside menu)
// ===============================
function initAnchorNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    // Avoid duplicates if menu already handles those anchors
    if (a.classList.contains("value")) return;

    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerH = document.querySelector("header")?.offsetHeight || 120;
      const top = target.getBoundingClientRect().top + window.scrollY - (headerH + 12);
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", href);
    });
  });
}

// ===============================
// Scroll to top
// ===============================
function initScrollToTop() {
  const btn = document.getElementById("scrollToTopBtn");
  if (!btn) return;

  btn.classList.add("hidden");

  const onScroll = () => {
    if (window.scrollY > 350) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ===============================
// Charts (replay when section visible)
// ===============================
function setupChartsReplay() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  const ensureChart = () => typeof Chart !== "undefined";

  if (!ensureChart()) {
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (ensureChart()) {
        clearInterval(t);
        setupChartsReplay();
      }
      if (tries > 50) clearInterval(t);
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
  }, 600);
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

// ===============================
// Canvas background
// ===============================
function initCanvasBackground() {
  const canvas = document.getElementById("background-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const particleCount = window.innerWidth < 768 ? 22 : 50;
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

// ===============================
// Card hover particles
// ===============================
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
      dot.style.background = "rgba(99,193,255,0.55)";
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

// ===============================
// Contact form (simple UX)
// ===============================
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
      // If you want real send, remove preventDefault and let Formspree submit
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

// ===============================
// BOOTSTRAP (single DOMContentLoaded)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // 1) restore works open if needed (before restore scroll)
  restoreWorksOpenIfNeeded();

  // 2) restore scroll state if coming back from portfolios
  restoreReturnState();

  // 3) UI init
  initMenuToggle();
  initWorksSection();
  initWorksReturnButtons();
  initAnchorNavigation();
  initScrollToTop();

  // 4) visuals
  initCanvasBackground();
  initCardParticles();

  // 5) form
  handleFormSubmit();

  // 6) charts
  setupChartsReplay();

  // 7) perf
  optimizeBackgroundVideo();
});