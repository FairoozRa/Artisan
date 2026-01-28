/**
 * shop-script.js - Shop page functionality
 * Handles: Product filtering, sorting, grid rendering
 */

(function () {
  'use strict';

  // Sample Products Database
  const allProducts = [
    { id: 1, name: 'Batik Tote Bag', price: 1800, category: 'bags', image: 'https://via.placeholder.com/250x250?text=Batik+Bag' },
    { id: 2, name: 'Handwoven Mat', price: 3200, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Handwoven+Mat' },
    { id: 3, name: 'Coconut Shell Bowl', price: 950, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Coconut+Bowl' },
    { id: 4, name: 'Wood Carved Elephant', price: 2500, category: 'wood', image: 'https://via.placeholder.com/250x250?text=Wood+Elephant' },
    { id: 5, name: 'Brass Pendant', price: 1200, category: 'jewelry', image: 'https://via.placeholder.com/250x250?text=Brass+Pendant' },
    { id: 6, name: 'Ceramic Pot', price: 1500, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Ceramic+Pot' },
    { id: 7, name: 'Premium Leather Bag', price: 2800, category: 'bags', image: 'https://via.placeholder.com/250x250?text=Leather+Bag' },
    { id: 8, name: 'Silk Scarf', price: 1600, category: 'bags', image: 'https://via.placeholder.com/250x250?text=Silk+Scarf' },
    { id: 9, name: 'Wooden Jewelry Box', price: 2100, category: 'wood', image: 'https://via.placeholder.com/250x250?text=Jewelry+Box' },
    { id: 10, name: 'Decorative Wall Art', price: 3500, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Wall+Art' },
    { id: 11, name: 'Silver Ring', price: 1400, category: 'jewelry', image: 'https://via.placeholder.com/250x250?text=Silver+Ring' },
    { id: 12, name: 'Woven Basket', price: 800, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Woven+Basket' }
  ];

  // State
  let filteredProducts = [...allProducts];
  let currentSort = 'newest';

  // DOM Elements
  const shopGrid = document.getElementById('shopGrid');
  const productCount = document.getElementById('productCount');
  const sortSelect = document.getElementById('sortBy');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const filterCheckboxes = document.querySelectorAll('[data-filter]');

  /**
   * Create product card
   */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">Rs. ${product.price.toLocaleString()}</p>
        <button class="btn btn-primary btn-sm">Add to Cart</button>
      </div>
    `;
    return card;
  }

  /**
   * Render filtered products to grid
   */
  function renderProducts() {
    if (!shopGrid) return;

    shopGrid.innerHTML = '';
    filteredProducts.forEach(product => {
      shopGrid.appendChild(createProductCard(product));
    });

    if (productCount) {
      productCount.textContent = filteredProducts.length;
    }
  }

  /**
   * Apply active filters
   */
  function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('[data-filter="category"]:checked'))
      .map(cb => cb.value);
    const selectedPrice = document.querySelector('[data-filter="price"]:checked')?.value;

    filteredProducts = allProducts.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Price filter
      if (selectedPrice) {
        const [min, max] = selectedPrice.split('-').map(p => p === '+' ? Infinity : parseInt(p));
        if (product.price < min || product.price > max) {
          return false;
        }
      }

      return true;
    });

    applySorting();
    renderProducts();
  }

  /**
   * Apply sorting to filtered products
   */
  function applySorting() {
    switch (currentSort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => a.id - b.id);
    }
  }

  /**
   * Handle sort dropdown change
   */
  function handleSort(e) {
    currentSort = e.target.value;
    applySorting();
    renderProducts();
  }

  /**
   * Clear all filters and reset view
   */
  function handleClearFilters() {
    document.querySelectorAll('[data-filter]').forEach(cb => {
      cb.checked = false;
    });
    if (sortSelect) sortSelect.value = 'newest';
    currentSort = 'newest';
    filteredProducts = [...allProducts];
    renderProducts();
  }

  /**
   * Initialize
   */
  function init() {
    renderProducts();

    filterCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    if (sortSelect) sortSelect.addEventListener('change', handleSort);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', handleClearFilters);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
