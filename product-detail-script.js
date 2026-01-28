/**
 * product-detail-script.js - Product detail page functionality
 * Handles: Image gallery, quantity selector, product info display
 */

(function () {
  'use strict';

  // Sample Product Data
  const productData = {
    id: 1,
    name: 'Premium Handwoven Batik Tote Bag',
    price: 1800,
    rating: 4.8,
    reviews: 42,
    description: 'This is a premium handcrafted product made with authentic techniques and the finest materials from Sri Lanka. Our skilled artisans have spent years perfecting their craft to bring you this unique, one-of-a-kind piece.',
    material: 'Natural Batik Cotton',
    dimensions: '40cm x 30cm x 15cm',
    weight: '650g',
    artisan: 'Mrs. Weerasuriya',
    stock: 15
  };

  // Related Products
  const relatedProducts = [
    { id: 2, name: 'Leather Tote Bag', price: 2800, image: 'https://via.placeholder.com/250x250?text=Leather+Bag' },
    { id: 3, name: 'Canvas Shoulder Bag', price: 1500, image: 'https://via.placeholder.com/250x250?text=Canvas+Bag' },
    { id: 4, name: 'Woven Market Basket', price: 1200, image: 'https://via.placeholder.com/250x250?text=Market+Basket' },
    { id: 5, name: 'Silk Scarf', price: 1600, image: 'https://via.placeholder.com/250x250?text=Silk+Scarf' }
  ];

  // DOM Elements
  const productName = document.getElementById('productName');
  const productDescription = document.getElementById('productDescription');
  const productPrice = document.getElementById('productPrice');
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const relatedGrid = document.getElementById('relatedGrid');
  const thumbnails = document.querySelectorAll('.thumbnail');

  /**
   * Populate product details from data
   */
  function populateProductDetails() {
    if (productName) productName.textContent = productData.name;
    if (productDescription) productDescription.textContent = productData.description;
    if (productPrice) productPrice.textContent = `Rs. ${productData.price.toLocaleString()}`;

    const specs = {
      material: document.getElementById('material'),
      dimensions: document.getElementById('dimensions'),
      weight: document.getElementById('weight'),
      artisan: document.getElementById('artisan'),
      stockStatus: document.getElementById('stockStatus')
    };

    if (specs.material) specs.material.textContent = productData.material;
    if (specs.dimensions) specs.dimensions.textContent = productData.dimensions;
    if (specs.weight) specs.weight.textContent = productData.weight;
    if (specs.artisan) specs.artisan.textContent = productData.artisan;

    if (specs.stockStatus) {
      if (productData.stock > 0) {
        specs.stockStatus.textContent = `In Stock (${productData.stock} available)`;
        specs.stockStatus.style.color = '#28a745';
      } else {
        specs.stockStatus.textContent = 'Out of Stock';
        specs.stockStatus.style.color = '#dc3545';
      }
    }

    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) {
      reviewCount.textContent = `(${productData.reviews} reviews)`;
    }
  }

  /**
   * Handle quantity increase/decrease
   */
  function handleQuantity() {
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value);
        if (current > 1) quantityInput.value = current - 1;
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value);
        if (current < 10) quantityInput.value = current + 1;
      });
    }
  }

  /**
   * Handle add to cart button
   */
  function handleAddToCart() {
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        addToCartBtn.textContent = '✓ Added to Cart';
        setTimeout(() => {
          addToCartBtn.textContent = 'Add to Cart';
        }, 1500);
      });
    }
  }

  /**
   * Render related products
   */
  function populateRelatedProducts() {
    if (!relatedGrid) return;

    relatedProducts.forEach(product => {
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
      relatedGrid.appendChild(card);
    });
  }

  /**
   * Handle image thumbnail selection
   */
  function handleImageThumbnails() {
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });

      if (index === 0) {
        thumb.classList.add('active');
      }
    });
  }

  /**
   * Initialize
   */
  function init() {
    populateProductDetails();
    populateRelatedProducts();
    handleQuantity();
    handleAddToCart();
    handleImageThumbnails();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
