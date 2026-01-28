/**
 * cart-script.js - Shopping cart functionality
 * Handles: Cart management, calculations, promo codes, persistent storage
 */

(function () {
  'use strict';

  // Cart data
  let cart = [];

  // Constants
  const TAX_RATE = 0.10;
  const SHIPPING = 250;

  // DOM Elements
  const cartItems = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');
  const applyPromoBtn = document.getElementById('applyPromo');
  const promoInput = document.getElementById('promoCode');

  /**
   * Load cart from localStorage
   */
  function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        cart = JSON.parse(storedCart);
      } catch (e) {
        cart = [];
      }
    }
  }

  /**
   * Save cart to localStorage
   */
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  /**
   * Update cart count in header
   */
  function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
      el.textContent = cartCount;
    });
  }

  /**
   * Render cart items to DOM
   */
  function renderCart() {
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <p>🛒 Your cart is empty</p>
          <p class="empty-text">Start shopping to add items to your cart</p>
          <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
      updateCartSummary();
      return;
    }

    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>Rs. ${item.price.toLocaleString()}</p>
        </div>
        <div class="quantity-control">
          <input type="number" value="${item.quantity}" min="1" max="10" data-index="${index}">
        </div>
        <p class="item-total">Rs. ${(item.price * item.quantity).toLocaleString()}</p>
        <button class="btn btn-sm btn-outline" data-remove="${index}">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });

    attachCartEventListeners();
    updateCartSummary();
  }

  /**
   * Attach event listeners to cart controls
   */
  function attachCartEventListeners() {
    // Quantity change
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity > 0) {
          cart[index].quantity = newQuantity;
          saveCart();
          renderCart();
        }
      });
    });

    // Remove item
    document.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.remove);
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });
    });
  }

  /**
   * Update cart totals
   */
  function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const shippingCost = cart.length > 0 ? SHIPPING : 0;
    const total = subtotal + tax + shippingCost;

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (taxEl) taxEl.textContent = `Rs. ${tax.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `Rs. ${total.toLocaleString()}`;
  }

  /**
   * Handle promo code application
   */
  function handlePromoCode() {
    const code = promoInput.value.toUpperCase().trim();

    if (code === 'SAVE10') {
      alert('✓ Promo code "SAVE10" applied! You get 10% discount.');
      promoInput.value = '';
    } else if (code === 'WELCOME') {
      alert('✓ Promo code "WELCOME" applied! You get Rs. 500 off.');
      promoInput.value = '';
    } else if (code !== '') {
      alert('✗ Invalid promo code. Please try again.');
    }
  }

  /**
   * Initialize
   */
  function init() {
    loadCart();
    renderCart();
    updateCartCount();

    if (applyPromoBtn) applyPromoBtn.addEventListener('click', handlePromoCode);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
