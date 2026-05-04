
const state = {
  currentPage: 'home',
  currentSection: 'home',
  loginRole: 'user',
  signupRole: 'user',
  history: [],
};


window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    splash.style.transition = 'opacity 0.6s ease';
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      app.style.display = 'block';

      document.querySelector('.hero-content')?.classList.add('entered');
    }, 700);
  }, 1400);
});


const PAGES = ['home','404','login','signup'];

function showPage(pageId, pushHistory = true) {
 
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });


  const target = document.getElementById('page-' + pageId);
  if (!target) { showPage('404', pushHistory); return; }
  target.classList.add('active');
  state.currentPage = pageId;

  const header = document.getElementById('header');
  const footer = document.getElementById('mainFooter');
  header.style.display = '';
  footer.style.display = '';

 
  window.scrollTo({ top: 0, behavior: 'smooth' });


  if (pushHistory) {
    const url = pageId === 'home' ? '#home' : '#' + pageId;
    window.history.pushState({ page: pageId }, '', url);
  }

 
  updateNavActive(pageId);


  closeMobileNav();
}

function updateNavActive(pageId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === 'home' && pageId === 'home') {
      link.classList.add('active');
    }
  });
}

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) {
    showPage(e.state.page, false);
  } else {
    showPage('home', false);
  }
});


window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  const validPage = PAGES.includes(hash) ? hash : 'home';
  window.history.replaceState({ page: validPage }, '', '#' + validPage);
  showPage(validPage, false);
  initAll();
});


function initAll() {
  initLogo();
  initNav();
  initHamburger();
  initHeaderButtons();
  initAuthForms();
  initAuthRoleTabs();
  init404Buttons();
  initScrollButtons();
}


function initLogo() {
  ['headerLogo', 'footerLogo'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      triggerSplashAndHome();
    });
  });
}

function triggerSplashAndHome() {
  const splash = document.getElementById('splash');
  const app = document.getElementById('app');

  splash.style.display = 'flex';
  splash.style.opacity = '1';

  const fill = splash.querySelector('.splash-fill');
  fill.style.animation = 'none';
  fill.offsetHeight; 
  fill.style.animation = 'loadBar 1.8s ease forwards';

  app.style.display = 'none';

  setTimeout(() => {
    splash.style.transition = 'opacity 0.7s ease';
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      app.style.display = 'block';
      showPage('home');
      window.scrollTo({ top: 0 });
    }, 700);
  }, 2200);
}


function initNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (!section) return;

      if (state.currentPage !== 'home') {
        showPage('home');
        setTimeout(() => scrollToSection(section), 400);
      } else {
        scrollToSection(section);
      }

     
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.nav-link[data-section="${section}"]`).forEach(l => l.classList.add('active'));

      closeMobileNav();
    });
  });


  window.addEventListener('scroll', updateNavOnScroll);
}

function scrollToSection(sectionId) {
  const el = document.getElementById('section-' + sectionId);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function updateNavOnScroll() {
  if (state.currentPage !== 'home') return;
  const sections = ['home','about','services','team','contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById('section-' + id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) current = id;
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    nav.classList.toggle('open');
  });
}
function closeMobileNav() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  btn?.classList.remove('active');
  nav?.classList.remove('open');
}

function initHeaderButtons() {
  ['headerLoginBtn','mobileLoginBtn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => showPage('404'));
  });
  ['headerSignupBtn','mobileSignupBtn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => showPage('404'));
  });
 
  document.getElementById('goSignup')?.addEventListener('click', (e) => {
    e.preventDefault(); showPage('404');
  });
  document.getElementById('goLogin')?.addEventListener('click', (e) => {
    e.preventDefault(); showPage('404');
  });
  
  document.getElementById('backHomeBtn')?.addEventListener('click', () => showPage('home'));
  document.getElementById('goBackBtn')?.addEventListener('click', () => window.history.back());
}


function initAuthRoleTabs() {

  document.getElementById('loginUserTab')?.addEventListener('click', () => {
    setLoginRole('user');
  });
  document.getElementById('loginAdminTab')?.addEventListener('click', () => {
    setLoginRole('admin');
  });
 
  document.getElementById('signupUserTab')?.addEventListener('click', () => {
    setSignupRole('user');
  });
  document.getElementById('signupAdminTab')?.addEventListener('click', () => {
    setSignupRole('admin');
  });
}

function setLoginRole(role) {
  state.loginRole = role;
  document.getElementById('loginUserTab').classList.toggle('active', role === 'user');
  document.getElementById('loginAdminTab').classList.toggle('active', role === 'admin');
}
function setSignupRole(role) {
  state.signupRole = role;
  document.getElementById('signupUserTab').classList.toggle('active', role === 'user');
  document.getElementById('signupAdminTab').classList.toggle('active', role === 'admin');
}


function initAuthForms() {
  // Login submit
  document.getElementById('loginSubmit')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail')?.value.trim();
    const pass = document.getElementById('loginPass')?.value.trim();
    if (!email || !pass) {
      showToast('Please fill in all fields.', 'warning'); return;
    }
    showPage('404');
  });

  document.getElementById('signupSubmit')?.addEventListener('click', () => {
    const email = document.getElementById('signupEmail')?.value.trim();
    const pass = document.getElementById('signupPass')?.value.trim();
    if (!email || !pass) {
      showToast('Please fill in all fields.', 'warning'); return;
    }
    showPage('404');
  });
}

function init404Buttons() {

  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-404]');
    if (target) {
      e.preventDefault();
      showPage('404');
    }
  });
}

function initScrollButtons() {
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.scroll;
      if (state.currentPage !== 'home') {
        showPage('home');
        setTimeout(() => scrollToSection(section), 400);
      } else {
        scrollToSection(section);
      }
    });
  });
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass ? '<i class="fa fa-eye-slash"></i>' : '<i class="fa fa-eye"></i>';
}

function showToast(msg, type = 'info') {
  let toast = document.getElementById('stackly-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'stackly-toast';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; z-index: 99999;
      background: #1a1a1a; color: #fff;
      padding: 0.9rem 1.5rem; border-radius: 10px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
      border: 1px solid rgba(201,168,76,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      transform: translateY(20px); opacity: 0;
      transition: all 0.3s ease;
      display: flex; align-items: center; gap: 0.75rem;
    `;
    document.body.appendChild(toast);
  }
  const icon = type === 'warning' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}


window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) {
    header.style.boxShadow = window.scrollY > 30 
      ? '0 4px 30px rgba(0,0,0,0.5)' 
      : '';
  }
});