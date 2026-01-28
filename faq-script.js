/**
 * faq-script.js - FAQ page functionality
 * Handles: Accordion toggle for questions
 */

(function () {
  'use strict';

  // DOM Elements
  const faqQuestions = document.querySelectorAll('.faq-question');

  /**
   * Handle FAQ item toggle
   */
  function handleFaqToggle(e) {
    const faqItem = e.currentTarget.closest('.faq-item');

    if (!faqItem) return;

    const isOpen = faqItem.classList.contains('active');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle current item
    if (!isOpen) {
      faqItem.classList.add('active');
    }
  }

  /**
   * Initialize
   */
  function init() {
    faqQuestions.forEach(question => {
      question.addEventListener('click', handleFaqToggle);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
