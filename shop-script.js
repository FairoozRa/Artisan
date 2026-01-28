/**
 * shop-script.js - Shop page functionality
 * Handles: Product filtering, sorting, grid rendering, dynamic seller products
 */

(function () {
  'use strict';

  // Sample Products Database (fallback if no seller products)
  const sampleProducts = [
    { id: 1, name: 'Batik Tote Bag', price: 1800, category: 'bags', image: 'https://via.placeholder.com/250x250?text=Batik+Bag', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 2, name: 'Handwoven Mat', price: 3200, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Handwoven+Mat', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 3, name: 'Coconut Shell Bowl', price: 950, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Coconut+Bowl', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 4, name: 'Wood Carved Elephant', price: 2500, category: 'wood', image: 'https://via.placeholder.com/250x250?text=Wood+Elephant', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 5, name: 'Brass Pendant', price: 1200, category: 'jewelry', image: 'https://via.placeholder.com/250x250?text=Brass+Pendant', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 6, name: 'Ceramic Pot', price: 1500, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Ceramic+Pot', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 7, name: 'Premium Leather Bag', price: 2800, category: 'bags', image: 'https://via.placeholder.com/250x250?text=Leather+Bag', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 8, name: 'Silk Scarf', price: 1600, category: 'bags', image: 'https://via.placeholder.com/250x250?text=Silk+Scarf', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 9, name: 'Wooden Jewelry Box', price: 2100, category: 'wood', image: 'https://via.placeholder.com/250x250?text=Jewelry+Box', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 10, name: 'Decorative Wall Art', price: 3500, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Wall+Art', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 11, name: 'Silver Ring', price: 1400, category: 'jewelry', image: 'https://via.placeholder.com/250x250?text=Silver+Ring', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' },
    { id: 12, name: 'Woven Basket', price: 800, category: 'decor', image: 'https://via.placeholder.com/250x250?text=Woven+Basket', sellerName: 'Artisan Co.', sellerEmail: 'seller@artisan.com' }
  ];

  // State
  let allProducts = [];
  let filteredProducts = [];
  let currentSort = 'newest';

  // DOM Elements
  const shopGrid = document.getElementById('shopGrid');
  const productCount = document.getElementById('productCount');
  const sortSelect = document.getElementById('sortBy');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const filterCheckboxes = document.querySelectorAll('[data-filter]');

  /**
   * Load all products from seller database
   */
  function loadAllProducts() {
    // Get seller products from localStorage
    const storedProducts = localStorage.getItem('allProducts');
    
    if (storedProducts) {
      try {
        const sellerProducts = JSON.parse(storedProducts);
        if (sellerProducts.length > 0) {
          allProducts = sellerProducts;
          return;
        }
      } catch (e) {
        console.log('Using sample products');
      }
    }

    // If no seller products, use sample products
    // In a real app, these would come from a server
    allProducts = [...sampleProducts];
  }

  /**
   * Create product card
   */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="seller-badge">${product.sellerName || 'Artisan'}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-category">${product.category || 'Other'}</p>
        <p class="product-price">Rs. ${product.price.toLocaleString()}</p>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">Add to Cart</button>
          <button class="btn btn-outline btn-sm view-details" data-product-id="${product.id}">View Details</button>
        </div>
      </div>
    `;
    return card;
  }

  /**
   * Render filtered products to grid
   */
  function renderProducts() {
    if (!shopGrid) return;

    if (filteredProducts.length === 0) {
      shopGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p style="font-size: 1.1rem; color: #999;">No products found matching your filters.</p></div>';
      if (productCount) productCount.textContent = 0;
      return;
    }

    shopGrid.innerHTML = '';
    filteredProducts.forEach(product => {
      shopGrid.appendChild(createProductCard(product));
    });

    if (productCount) {
      productCount.textContent = filteredProducts.length;
    }

    attachCartListeners();
  }

  /**
   * Attach cart button listeners
   */
  function attachCartListeners() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', handleAddToCart);
    });

    const viewDetailsBtns = document.querySelectorAll('.view-details');
    viewDetailsBtns.forEach(btn => {
      btn.addEventListener('click', handleViewDetails);
    });
  }

  /**
   * Handle add to cart
   */
  function handleAddToCart(e) {
    e.preventDefault();
    
    const productId = e.target.dataset.productId;
    const productName = e.target.dataset.productName;
    const productPrice = parseFloat(e.target.dataset.productPrice);
    const productImage = e.target.dataset.productImage;

    // Get cart from localStorage
    let cart = [];
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count in header
    updateCartCount();

    // Show confirmation
    alert(`"${productName}" added to your cart!`);
  }

  /**
   * Handle view details
   */
  function handleViewDetails(e) {
    const productId = e.target.dataset.productId;
    // Store selected product and redirect
    localStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-detail.html';
  }

  /**
   * Update cart count in header
   */
  function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
      el.textContent = cartCount;
    });
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
        const parts = selectedPrice.split('-');
        let min = 0, max = Infinity;
        if (parts.length === 2) {
          min = parseInt(parts[0]);
          max = parts[1] === '+' ? Infinity : parseInt(parts[1]);
        }
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
        filteredProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
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
    applySorting();
    renderProducts();
  }

  /**
   * Initialize
   */
  function init() {
    loadAllProducts();
    filteredProducts = [...allProducts];
    applySorting();
    renderProducts();
    updateCartCount();

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
