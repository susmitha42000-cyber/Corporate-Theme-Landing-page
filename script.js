const state = {
  currentPage: "home",
  loginRole: "user",
  signupRole: "user",
};

const PAGES = ["home", "404", "login", "signup"];

window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    const app = document.getElementById("app");
    if (!splash || !app) return;

    splash.style.transition = "opacity 0.6s ease";
    splash.style.opacity = "0";

    setTimeout(() => {
      splash.style.display = "none";
      app.style.display = "block";
      updateHamburgerContrast();
    }, 700);
  }, 1400);
});

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "") || "home";
  const validPage = PAGES.includes(hash) ? hash : "home";
  window.history.replaceState({ page: validPage }, "", "#" + validPage);
  showPage(validPage, false);
  initAll();
});

window.addEventListener("popstate", (e) => {
  if (e.state?.page) {
    showPage(e.state.page, false);
  } else {
    showPage("home", false);
  }
});

function initAll() {
  initLogo();
  initNav();
  initHamburger();
  initHamburgerContrast();
  initHeaderButtons();
  initAuthForms();
  initContactForm();
  initAuthRoleTabs();
  init404Buttons();
  initScrollButtons();
}

function showPage(pageId, pushHistory = true) {
  PAGES.forEach((p) => {
    document.getElementById("page-" + p)?.classList.remove("active");
  });

  const target = document.getElementById("page-" + pageId);
  if (!target) {
    showPage("404", pushHistory);
    return;
  }

  target.classList.add("active");
  state.currentPage = pageId;

  const header = document.getElementById("header");
  const footer = document.getElementById("mainFooter");
  if (header) header.style.display = "";
  if (footer) footer.style.display = "";

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pushHistory) {
    const url = pageId === "home" ? "#home" : "#" + pageId;
    window.history.pushState({ page: pageId }, "", url);
  }

  updateNavActive(pageId);
  closeMobileNav();
  updateHamburgerContrast();
}

function updateNavActive(pageId) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.section === "home" && pageId === "home");
  });
}

function initLogo() {
  ["headerLogo", "footerLogo"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", triggerSplashAndHome);
  });
}

function triggerSplashAndHome() {
  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const fill = splash?.querySelector(".splash-fill");
  if (!splash || !app || !fill) return;

  splash.style.display = "flex";
  splash.style.opacity = "1";
  fill.style.animation = "none";
  fill.offsetHeight;
  fill.style.animation = "loadBar 1.8s ease forwards";
  app.style.display = "none";

  setTimeout(() => {
    splash.style.transition = "opacity 0.7s ease";
    splash.style.opacity = "0";
    setTimeout(() => {
      splash.style.display = "none";
      app.style.display = "block";
      showPage("home");
      window.scrollTo({ top: 0 });
    }, 700);
  }, 2200);
}

function initNav() {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (!section) return;

      if (section === "home") {
        showPage("home");
      } else if (state.currentPage !== "home") {
        showPage("home");
        setTimeout(() => scrollToSection(section), 400);
      } else {
        scrollToSection(section);
      }

      setActiveSection(section);
      closeMobileNav();
    });
  });

  window.addEventListener("scroll", updateNavOnScroll);
}

function scrollToSection(sectionId) {
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("home");
    return;
  }

  const el = document.getElementById("section-" + sectionId);
  if (!el) return;

  const offset = getHeaderOffset();
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: "smooth" });
  setActiveSection(sectionId);
}

function updateNavOnScroll() {
  if (state.currentPage !== "home") return;

  const sections = ["home", "about", "services", "team", "contact"];
  let current = "home";

  sections.forEach((id) => {
    const el = document.getElementById("section-" + id);
    if (el && el.getBoundingClientRect().top <= 120) {
      current = id;
    }
  });

  setActiveSection(current);
}

function setActiveSection(section) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.section === section);
  });
}

function getHeaderOffset() {
  const header = document.getElementById("header");
  const headerHeight = header?.offsetHeight ?? 80;
  return headerHeight + 16;
}

function initHamburger() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  if (!btn || !nav) return;

  btn.setAttribute("aria-expanded", "false");

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.classList.toggle("active", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    updateHamburgerContrast();
  });
}

function closeMobileNav() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");
  btn?.classList.remove("active");
  nav?.classList.remove("open");
  btn?.setAttribute("aria-expanded", "false");
}

function initHamburgerContrast() {
  updateHamburgerContrast();
  window.addEventListener("scroll", updateHamburgerContrast);
  window.addEventListener("resize", updateHamburgerContrast);
}

function updateHamburgerContrast() {
  const header = document.getElementById("header");
  if (!header) return;

  header.classList.remove("header-light", "header-dark", "header-transparent");

  const bg = window.getComputedStyle(header).backgroundColor;
  const rgba = parseColor(bg);
  const onHero = state.currentPage === "home" && window.scrollY < 80;

  if (!rgba || rgba.a < 0.35 || onHero) {
    header.classList.add("header-transparent");
    return;
  }

  const luminance = getLuminance(rgba.r, rgba.g, rgba.b);
  header.classList.add(luminance > 0.6 ? "header-light" : "header-dark");
}

function parseColor(color) {
  const match = color?.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  if (parts.length < 3) return null;

  return {
    r: parts[0],
    g: parts[1],
    b: parts[2],
    a: parts[3] ?? 1,
  };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function initHeaderButtons() {
  ["headerLoginBtn", "mobileLoginBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => showPage("login"));
  });

  ["headerSignupBtn", "mobileSignupBtn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => showPage("signup"));
  });

  document.getElementById("goSignup")?.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("signup");
  });

  document.getElementById("goLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("login");
  });

  document.getElementById("backHomeBtn")?.addEventListener("click", () => showPage("home"));
  document.getElementById("goBackBtn")?.addEventListener("click", () => window.history.back());
}

function initAuthRoleTabs() {
  document.getElementById("loginUserTab")?.addEventListener("click", () => setLoginRole("user"));
  document.getElementById("loginAdminTab")?.addEventListener("click", () => setLoginRole("admin"));
  document.getElementById("signupUserTab")?.addEventListener("click", () => setSignupRole("user"));
  document.getElementById("signupAdminTab")?.addEventListener("click", () => setSignupRole("admin"));
}

function setLoginRole(role) {
  state.loginRole = role;
  document.getElementById("loginUserTab")?.classList.toggle("active", role === "user");
  document.getElementById("loginAdminTab")?.classList.toggle("active", role === "admin");
}

function setSignupRole(role) {
  state.signupRole = role;
  document.getElementById("signupUserTab")?.classList.toggle("active", role === "user");
  document.getElementById("signupAdminTab")?.classList.toggle("active", role === "admin");
}

function initAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm(loginForm)) return;

    const submitButton = document.getElementById("loginSubmit");
    await withButtonLoading(submitButton, "Signing In...", 700);
    showToast(`Signed in as ${state.loginRole}. Welcome back to Stackly.`, "success");
    showPage("home");
  });

  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm(signupForm)) return;

    const submitButton = document.getElementById("signupSubmit");
    await withButtonLoading(submitButton, "Creating Account...", 900);
    showToast(`Account created for the ${state.signupRole} portal. Our team will follow up shortly.`, "success");
    signupForm.reset();
    setSignupRole("user");
    showPage("home");
  });
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) return;

    const submitButton = document.getElementById("contactSubmit");
    await withButtonLoading(submitButton, "Sending Message...", 900);
    showToast("Your message has been sent successfully. A Stackly specialist will get back to you soon.", "success");
    contactForm.reset();
  });
}

function init404Buttons() {
  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("[data-404]");
    if (!target) return;
    e.preventDefault();
    showPage("404");
  });
}

function initScrollButtons() {
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const section = btn.dataset.scroll;
      if (state.currentPage !== "home") {
        showPage("home");
        setTimeout(() => scrollToSection(section), 400);
      } else {
        scrollToSection(section);
      }
    });
  });
}

function validateForm(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    showToast("Please complete all required fields with valid information.", "warning");
    return false;
  }

  return true;
}

function withButtonLoading(button, loadingLabel, delay = 800) {
  if (!button) return Promise.resolve();

  const originalLabel = button.innerHTML;
  button.disabled = true;
  button.classList.add("is-loading");
  button.innerHTML = loadingLabel;

  return new Promise((resolve) => {
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove("is-loading");
      button.innerHTML = originalLabel;
      resolve();
    }, delay);
  });
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  btn.innerHTML = isPassword ? '<i class="fa fa-eye-slash"></i>' : '<i class="fa fa-eye"></i>';
}

function showToast(msg, type = "info") {
  let toast = document.getElementById("stackly-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "stackly-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; z-index: 99999;
      background: #0c1b2f; color: #f4f8ff;
      padding: 0.9rem 1.5rem; border-radius: 14px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      border: 1px solid rgba(168,85,247,0.3);
      box-shadow: 0 14px 36px rgba(0,0,0,0.35);
      transform: translateY(20px); opacity: 0;
      transition: all 0.3s ease;
      display: flex; align-items: center; gap: 0.75rem;
    `;
    document.body.appendChild(toast);
  }

  const icon = type === "warning" ? "!" : type === "success" ? "✓" : "i";
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 3000);
}

window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (!header) return;

  header.style.boxShadow = window.scrollY > 30 ? "0 10px 32px rgba(0,0,0,0.28)" : "";
});
