/**
 * common.js - Shared functionality across all pages
 * Handles: Mobile menu, search bar, year display
 */

(function () {
  'use strict';

  // DOM Elements
  const yearSpan = document.getElementById('year');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const searchToggle = document.getElementById('searchToggle');
  const searchBarWrapper = document.getElementById('searchBarWrapper');
  const searchInput = document.getElementById('searchInput');

  /**
   * Toggle mobile menu visibility
   */
  function toggleMobileMenu() {
    if (mainNav) {
      mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
    }
  }

  /**
   * Toggle search bar visibility
   */
  function toggleSearchBar() {
    if (searchBarWrapper) {
      searchBarWrapper.classList.toggle('active');
      if (searchBarWrapper.classList.contains('active') && searchInput) {
        searchInput.focus();
      }
    }
  }

  /**
   * Set current year in footer
   */
  function setCurrentYear() {
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /**
   * Close mobile menu when navigation link is clicked
   */
  function closeMenuOnLinkClick() {
    const navLinks = document.querySelectorAll('#mainNav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav) {
          mainNav.style.display = 'none';
        }
      });
    });
  }

  /**
   * Initialize common functionality
   */
  function init() {
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (searchToggle) searchToggle.addEventListener('click', toggleSearchBar);

    closeMenuOnLinkClick();
    setCurrentYear();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
