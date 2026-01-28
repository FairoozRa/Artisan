/**
 * script.js - Homepage and About page functionality
 * Handles: Product rendering, product grid
 */

(function () {
  'use strict';

  // Sample Products
  const products = [
    { id: 1, name: 'Batik Tote Bag', price: 'Rs. 1,800', image: 'https://via.placeholder.com/250x250?text=Batik+Bag' },
    { id: 2, name: 'Handwoven Mat', price: 'Rs. 3,200', image: 'https://via.placeholder.com/250x250?text=Handwoven+Mat' },
    { id: 3, name: 'Coconut Shell Bowl', price: 'Rs. 950', image: 'https://via.placeholder.com/250x250?text=Coconut+Bowl' },
    { id: 4, name: 'Wood Carved Elephant', price: 'Rs. 2,500', image: 'https://via.placeholder.com/250x250?text=Wood+Elephant' },
    { id: 5, name: 'Brass Pendant', price: 'Rs. 1,200', image: 'https://via.placeholder.com/250x250?text=Brass+Pendant' },
    { id: 6, name: 'Ceramic Pot', price: 'Rs. 1,500', image: 'https://via.placeholder.com/250x250?text=Ceramic+Pot' }
  ];

  const bestsellers = [
    { id: 7, name: 'Premium Leather Bag', price: 'Rs. 2,800', image: 'https://via.placeholder.com/250x250?text=Leather+Bag' },
    { id: 8, name: 'Silk Scarf', price: 'Rs. 1,600', image: 'https://via.placeholder.com/250x250?text=Silk+Scarf' },
    { id: 9, name: 'Wooden Jewelry Box', price: 'Rs. 2,100', image: 'https://via.placeholder.com/250x250?text=Jewelry+Box' },
    { id: 10, name: 'Decorative Wall Art', price: 'Rs. 3,500', image: 'https://via.placeholder.com/250x250?text=Wall+Art' }
  ];

  // DOM Elements
  const productGrid = document.getElementById('productGrid');
  const bestsellerGrid = document.getElementById('bestsellerGrid');

  /**
   * Create product card element
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
        <p class="product-price">${product.price}</p>
        <button class="btn btn-primary btn-sm">Add to Cart</button>
      </div>
    `;
    return card;
  }

  /**
   * Render products to grid
   */
  function renderProducts() {
    if (productGrid) {
      productGrid.innerHTML = '';
      products.forEach(product => {
        productGrid.appendChild(createProductCard(product));
      });
    }
  }

  /**
   * Render bestsellers to grid
   */
  function renderBestsellers() {
    if (bestsellerGrid) {
      bestsellerGrid.innerHTML = '';
      bestsellers.forEach(product => {
        bestsellerGrid.appendChild(createProductCard(product));
      });
    }
  }

  /**
   * Initialize
   */
  function init() {
    renderProducts();
    renderBestsellers();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


