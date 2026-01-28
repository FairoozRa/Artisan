/**
 * contact-script.js - Contact page functionality
 * Handles: Form submission and validation
 */

(function () {
  'use strict';

  // DOM Elements
  const contactForm = document.getElementById('contactForm');

  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name')?.value,
      email: document.getElementById('email')?.value,
      phone: document.getElementById('phone')?.value,
      subject: document.getElementById('subject')?.value,
      message: document.getElementById('message')?.value
    };

    // Log for demo purposes (in production, send to server)
    console.log('Contact form submitted:', formData);

    // Show success message
    alert(`Thank you ${formData.name}! Your message has been sent successfully. We'll get back to you soon.`);

    // Reset form
    contactForm.reset();
  }

  /**
   * Initialize
   */
  function init() {
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
