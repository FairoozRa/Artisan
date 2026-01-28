/**
 * product-detail-script.js - Product detail page functionality
 * Handles: Dynamic product loading, image gallery, quantity selector, cart integration
 */

(function () {
  'use strict';

  // Product data (will be loaded from localStorage)
  let productData = null;
  let relatedProducts = [];
  let allProducts = [];

  // DOM Elements
  const productName = document.getElementById('productName');
  const productDescription = document.getElementById('productDescription');
  const productPrice = document.getElementById('productPrice');
  const quantityInput = document.getElementById('quantity');
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const relatedGrid = document.getElementById('relatedGrid');
  const mainImage = document.getElementById('mainImage');
  const productBreadcrumb = document.getElementById('productBreadcrumb');
  const thumbnails = document.querySelectorAll('.thumbnail');

  /**
   * Load products from localStorage
   */
  function loadAllProducts() {
    const storedProducts = localStorage.getItem('allProducts');
    if (storedProducts) {
      try {
        allProducts = JSON.parse(storedProducts);
      } catch (e) {
        allProducts = [];
      }
    }
  }

  /**
   * Load selected product
   */
  function loadSelectedProduct() {
    const productId = localStorage.getItem('selectedProductId');
    
    if (!productId || allProducts.length === 0) {
      alert('Product not found. Redirecting to shop...');
      window.location.href = 'shop.html';
      return;
    }

    productData = allProducts.find(p => p.id === productId);

    if (!productData) {
      alert('Product not found. Redirecting to shop...');
      window.location.href = 'shop.html';
      return;
    }

    // Find related products (same category)
    relatedProducts = allProducts
      .filter(p => p.category === productData.category && p.id !== productData.id)
      .slice(0, 4);
  }

  /**
   * Populate product details from data
   */
  function populateProductDetails() {
    if (!productData) return;

    if (productName) productName.textContent = productData.name;
    if (productDescription) productDescription.textContent = productData.description;
    if (productPrice) productPrice.textContent = `Rs. ${productData.price.toLocaleString()}`;
    if (mainImage) mainImage.src = productData.image;
    if (productBreadcrumb) productBreadcrumb.textContent = productData.name;

    const specs = {
      material: document.getElementById('material'),
      dimensions: document.getElementById('dimensions'),
      weight: document.getElementById('weight'),
      artisan: document.getElementById('artisan'),
      stockStatus: document.getElementById('stockStatus')
    };

    if (specs.material) specs.material.textContent = productData.category || 'Handcrafted';
    if (specs.dimensions) specs.dimensions.textContent = 'One Size';
    if (specs.weight) specs.weight.textContent = 'Varies';
    if (specs.artisan) specs.artisan.textContent = productData.sellerName || 'Skilled Artisan';

    if (specs.stockStatus) {
      const availableQty = productData.quantity || 0;
      if (availableQty > 0) {
        specs.stockStatus.textContent = `In Stock (${availableQty} available)`;
        specs.stockStatus.style.color = '#28a745';
      } else {
        specs.stockStatus.textContent = 'Out of Stock';
        specs.stockStatus.style.color = '#dc3545';
      }
    }

    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) {
      reviewCount.textContent = `(${productData.views || 0} views)`;
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
        const maxQty = productData?.quantity || 10;
        if (current < maxQty) quantityInput.value = current + 1;
      });
    }
  }

  /**
   * Handle add to cart button
   */
  function handleAddToCart() {
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        if (!productData) return;

        const quantity = parseInt(quantityInput.value) || 1;

        // Get cart from localStorage
        let cart = [];
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          cart = JSON.parse(storedCart);
        }

        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productData.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: quantity
          });
        }

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();

        // Show confirmation
        addToCartBtn.textContent = '✓ Added to Cart';
        addToCartBtn.disabled = true;
        setTimeout(() => {
          addToCartBtn.textContent = 'Add to Cart';
          addToCartBtn.disabled = false;
        }, 1500);
      });
    }
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
   * Render related products
   */
  function populateRelatedProducts() {
    if (!relatedGrid) return;

    if (relatedProducts.length === 0) {
      relatedGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No related products available</p>';
      return;
    }

    relatedProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="seller-badge">${product.sellerName || 'Artisan'}</span>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">Rs. ${product.price.toLocaleString()}</p>
          <div class="product-actions">
            <button class="btn btn-primary btn-sm add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">Add to Cart</button>
            <button class="btn btn-outline btn-sm view-details" data-product-id="${product.id}">View Details</button>
          </div>
        </div>
      `;
      relatedGrid.appendChild(card);
    });

    // Attach listeners to related product buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        const productName = e.target.dataset.productName;
        const productPrice = parseFloat(e.target.dataset.productPrice);
        const productImage = e.target.dataset.productImage;

        let cart = [];
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          cart = JSON.parse(storedCart);
        }

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

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`"${productName}" added to your cart!`);
      });
    });

    document.querySelectorAll('.view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.productId;
        localStorage.setItem('selectedProductId', productId);
        location.reload();
      });
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
        if (mainImage) mainImage.src = thumb.src;
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
    loadAllProducts();
    loadSelectedProduct();
    populateProductDetails();
    populateRelatedProducts();
    handleQuantity();
    handleAddToCart();
    handleImageThumbnails();
    updateCartCount();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
