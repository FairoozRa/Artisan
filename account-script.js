/**
 * account-script.js - Account and authentication functionality
 * Handles: Login/Register forms, dashboard navigation
 */

(function () {
  'use strict';

  // DOM Elements
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  const accountDashboard = document.getElementById('accountDashboard');
  const authContainer = document.getElementById('authContainer');
  const dashboardNavBtns = document.querySelectorAll('.nav-btn');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  const logoutBtn = document.getElementById('logoutBtn');

  /**
   * Handle auth tab switching (Login/Register)
   */
  function handleAuthTabSwitch(e) {
    const tabName = e.target.dataset.tab;

    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));

    e.target.classList.add('active');

    const targetForm = document.getElementById(tabName);
    if (targetForm) {
      targetForm.classList.add('active');
    }
  }

  /**
   * Handle dashboard navigation
   */
  function handleDashboardNav(e) {
    if (e.target.classList.contains('logout')) {
      handleLogout();
      return;
    }

    const sectionName = e.target.dataset.section;

    dashboardNavBtns.forEach(btn => btn.classList.remove('active'));
    dashboardSections.forEach(section => section.classList.remove('active'));

    e.target.classList.add('active');

    const targetSection = document.getElementById(sectionName);
    if (targetSection && sectionName) {
      targetSection.classList.add('active');
    }
  }

  /**
   * Handle login form submission
   */
  function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail')?.value;

    if (email) {
      const userName = email.split('@')[0];
      const userNameEl = document.getElementById('userName');
      const userEmailEl = document.getElementById('userEmail');

      if (userNameEl) userNameEl.textContent = `Welcome back, ${userName}!`;
      if (userEmailEl) userEmailEl.textContent = email;

      if (authContainer) authContainer.style.display = 'none';
      if (accountDashboard) accountDashboard.style.display = 'grid';
    }
  }

  /**
   * Handle register form submission
   */
  function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName')?.value;
    const email = document.getElementById('registerEmail')?.value;

    if (firstName && email) {
      alert(`Account created successfully for ${firstName}! Welcome to Artisan Market!`);

      const userNameEl = document.getElementById('userName');
      const userEmailEl = document.getElementById('userEmail');

      if (userNameEl) userNameEl.textContent = firstName;
      if (userEmailEl) userEmailEl.textContent = email;

      if (authContainer) authContainer.style.display = 'none';
      if (accountDashboard) accountDashboard.style.display = 'grid';
    }
  }

  /**
   * Handle logout
   */
  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      if (accountDashboard) accountDashboard.style.display = 'none';
      if (authContainer) authContainer.style.display = 'block';

      const loginForm = document.getElementById('login');
      const registerForm = document.getElementById('register');

      if (loginForm) loginForm.classList.add('active');
      if (registerForm) registerForm.classList.remove('active');

      authTabs[0]?.classList.add('active');
      authTabs[1]?.classList.remove('active');
    }
  }

  /**
   * Initialize
   */
  function init() {
    // Auth tabs
    authTabs.forEach(tab => tab.addEventListener('click', handleAuthTabSwitch));

    // Forms
    const loginForm = document.querySelector('#login form');
    const registerForm = document.querySelector('#register form');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    // Dashboard
    dashboardNavBtns.forEach(btn => btn.addEventListener('click', handleDashboardNav));

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
