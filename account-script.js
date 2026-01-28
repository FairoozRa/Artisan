/**
 * account-script.js - Account and authentication functionality
 * Handles: Login/Register forms, dashboard navigation, buyer/seller accounts
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
  
  // Account type elements
  const accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
  const sellerFields = document.getElementById('sellerFields');
  const buyerNav = document.getElementById('buyerNav');
  const sellerNav = document.getElementById('sellerNav');
  const addProductForm = document.getElementById('addProductForm');
  const productImage = document.getElementById('productImage');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  
  // Local storage for user data
  let currentUser = null;
  let sellerProducts = [];

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

    // Reset account type to buyer when switching tabs
    if (tabName === 'register') {
      const buyerRadio = document.querySelector('input[name="accountType"][value="buyer"]');
      if (buyerRadio) buyerRadio.checked = true;
      if (sellerFields) sellerFields.style.display = 'none';
    }
  }

  /**
   * Handle account type selection (Buyer/Seller)
   */
  function handleAccountTypeChange(e) {
    const accountType = e.target.value;
    
    if (accountType === 'seller') {
      if (sellerFields) sellerFields.style.display = 'block';
      // Mark seller fields as required
      document.getElementById('businessName').required = true;
      document.getElementById('businessPhone').required = true;
    } else {
      if (sellerFields) sellerFields.style.display = 'none';
      // Mark seller fields as not required
      document.getElementById('businessName').required = false;
      document.getElementById('businessPhone').required = false;
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
      // In a real app, you'd verify this against a database
      // For now, we'll check if user was previously registered
      const userData = localStorage.getItem('currentUser');
      
      if (userData) {
        const user = JSON.parse(userData);
        currentUser = user;
        
        const userName = user.firstName || email.split('@')[0];
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');

        if (userNameEl) userNameEl.textContent = `Welcome back, ${userName}!`;
        if (userEmailEl) userEmailEl.textContent = email;

        displayDashboard(user.accountType);

        if (authContainer) authContainer.style.display = 'none';
        if (accountDashboard) accountDashboard.style.display = 'grid';
      } else {
        alert('User not found. Please register first or check your email.');
      }
    }
  }

  /**
   * Display appropriate dashboard based on account type
   */
  function displayDashboard(accountType) {
    if (accountType === 'seller') {
      // Show seller dashboard
      if (buyerNav) buyerNav.style.display = 'none';
      if (sellerNav) sellerNav.style.display = 'block';
      
      // Hide buyer sections, show seller sections
      const buyerSections = ['overview', 'orders', 'addresses', 'wishlist'];
      const sellerSections = ['seller-overview', 'inventory', 'add-product', 'seller-orders', 'seller-analytics'];
      
      buyerSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = 'none';
      });
      
      sellerSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = 'block';
      });
      
      // Set first seller section as active
      const firstSellerBtn = document.querySelector('[data-section="seller-overview"]');
      if (firstSellerBtn) firstSellerBtn.click();
      
      // Load seller products
      loadSellerProducts();
    } else {
      // Show buyer dashboard
      if (buyerNav) buyerNav.style.display = 'block';
      if (sellerNav) sellerNav.style.display = 'none';
      
      // Show buyer sections, hide seller sections
      const buyerSections = ['overview', 'orders', 'addresses', 'wishlist'];
      const sellerSections = ['seller-overview', 'inventory', 'add-product', 'seller-orders', 'seller-analytics'];
      
      buyerSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = 'block';
      });
      
      sellerSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = 'none';
      });
      
      // Set first buyer section as active
      const firstBuyerBtn = document.querySelector('[data-section="overview"]');
      if (firstBuyerBtn) firstBuyerBtn.click();
    }
  }

  /**
   * Handle register form submission
   */
  function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const accountType = document.querySelector('input[name="accountType"]:checked')?.value;
    const businessName = document.getElementById('businessName')?.value;
    const businessPhone = document.getElementById('businessPhone')?.value;

    if (firstName && email && accountType) {
      const userData = {
        firstName,
        lastName: document.getElementById('lastName')?.value,
        email,
        accountType,
        businessName: accountType === 'seller' ? businessName : null,
        businessDescription: accountType === 'seller' ? document.getElementById('businessDescription')?.value : null,
        businessPhone: accountType === 'seller' ? businessPhone : null,
        createdAt: new Date().toISOString()
      };

      currentUser = userData;
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('sellerProducts_' + email, JSON.stringify([]));

      alert(`Account created successfully for ${firstName}! Welcome to Artisan Market!`);

      const userNameEl = document.getElementById('userName');
      const userEmailEl = document.getElementById('userEmail');

      if (userNameEl) userNameEl.textContent = `Welcome back, ${firstName}!`;
      if (userEmailEl) userEmailEl.textContent = email;

      // Show/hide relevant dashboard sections based on account type
      displayDashboard(accountType);

      if (authContainer) authContainer.style.display = 'none';
      if (accountDashboard) accountDashboard.style.display = 'grid';
    }
  }

  /**
   * Handle logout
   */
  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      currentUser = null;
      localStorage.removeItem('currentUser');
      
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
   * Handle image preview for product
   */
  function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        previewImg.src = event.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Handle add product form submission
   */
  function handleAddProduct(e) {
    e.preventDefault();

    if (!currentUser || currentUser.accountType !== 'seller') {
      alert('Only sellers can add products');
      return;
    }

    const productData = {
      id: 'PROD_' + Date.now(),
      name: document.getElementById('productName')?.value,
      category: document.getElementById('productCategory')?.value,
      description: document.getElementById('productDescription')?.value,
      price: parseFloat(document.getElementById('productPrice')?.value),
      quantity: parseInt(document.getElementById('productQuantity')?.value),
      image: previewImg.src,
      sellerEmail: currentUser.email,
      sellerName: currentUser.businessName || currentUser.firstName,
      createdAt: new Date().toISOString(),
      views: 0,
      sales: 0
    };

    if (!sellerProducts) sellerProducts = [];
    sellerProducts.push(productData);

    // Save to seller's local storage
    localStorage.setItem('sellerProducts_' + currentUser.email, JSON.stringify(sellerProducts));
    
    // Also add to global products database
    let allProducts = [];
    const stored = localStorage.getItem('allProducts');
    if (stored) {
      allProducts = JSON.parse(stored);
    }
    allProducts.push(productData);
    localStorage.setItem('allProducts', JSON.stringify(allProducts));

    alert('Product added successfully!');
    
    // Reset form
    addProductForm.reset();
    imagePreview.style.display = 'none';
    
    // Update inventory display
    displayInventory();
    updateSellerStats();
  }

  /**
   * Load seller products from local storage
   */
  function loadSellerProducts() {
    if (currentUser && currentUser.accountType === 'seller') {
      const stored = localStorage.getItem('sellerProducts_' + currentUser.email);
      sellerProducts = stored ? JSON.parse(stored) : [];
      displayInventory();
      updateSellerStats();
    }
  }

  /**
   * Display seller inventory
   */
  function displayInventory() {
    const inventoryList = document.getElementById('inventoryList');
    if (!inventoryList) return;

    if (sellerProducts.length === 0) {
      inventoryList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No products yet. Add your first product to get started!</p>';
      return;
    }

    inventoryList.innerHTML = sellerProducts.map(product => `
      <div class="inventory-item">
        <img src="${product.image}" alt="${product.name}" class="inventory-item-image">
        <div class="inventory-item-content">
          <h3>${product.name}</h3>
          <p class="inventory-item-category">${product.category}</p>
          <p class="inventory-item-price">Rs. ${product.price.toFixed(2)}</p>
          <p class="inventory-item-meta">Stock: ${product.quantity} | Views: ${product.views}</p>
        </div>
        <div class="inventory-item-actions">
          <button class="btn btn-sm btn-outline" onclick="editProduct('${product.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Delete product
   */
  window.deleteProduct = function(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      sellerProducts = sellerProducts.filter(p => p.id !== productId);
      localStorage.setItem('sellerProducts_' + currentUser.email, JSON.stringify(sellerProducts));
      displayInventory();
      updateSellerStats();
    }
  };

  /**
   * Edit product (simplified - just delete and re-add)
   */
  window.editProduct = function(productId) {
    alert('Edit feature coming soon. You can delete and re-add the product.');
  };

  /**
   * Update seller statistics
   */
  function updateSellerStats() {
    if (!currentUser || currentUser.accountType !== 'seller') return;

    const totalProductsEl = document.getElementById('totalProducts');
    const totalViewsEl = document.getElementById('totalViews');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const analyticsOrderCountEl = document.getElementById('analyticsOrderCount');
    const avgOrderValueEl = document.getElementById('avgOrderValue');

    const totalViews = sellerProducts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSales = sellerProducts.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalRevenue = sellerProducts.reduce((sum, p) => sum + (p.price * (p.sales || 0)), 0);

    if (totalProductsEl) totalProductsEl.textContent = sellerProducts.length;
    if (totalViewsEl) totalViewsEl.textContent = totalViews;
    if (totalRevenueEl) totalRevenueEl.textContent = 'Rs. ' + totalRevenue.toFixed(2);
    if (analyticsOrderCountEl) analyticsOrderCountEl.textContent = totalSales;
    if (avgOrderValueEl) avgOrderValueEl.textContent = totalSales > 0 ? 'Rs. ' + (totalRevenue / totalSales).toFixed(2) : 'Rs. 0';
  }

  /**
   * Initialize
   */
  function init() {
    // Auth tabs
    authTabs.forEach(tab => tab.addEventListener('click', handleAuthTabSwitch));

    // Account type selection
    accountTypeRadios.forEach(radio => radio.addEventListener('change', handleAccountTypeChange));

    // Forms
    const loginForm = document.querySelector('#login form');
    const registerForm = document.querySelector('#register form');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    // Dashboard
    dashboardNavBtns.forEach(btn => btn.addEventListener('click', handleDashboardNav));

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Product form
    if (addProductForm) addProductForm.addEventListener('submit', handleAddProduct);
    if (productImage) productImage.addEventListener('change', handleImagePreview);

    // Check if user is already logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      currentUser = JSON.parse(userData);
      const userNameEl = document.getElementById('userName');
      const userEmailEl = document.getElementById('userEmail');

      if (userNameEl) userNameEl.textContent = `Welcome back, ${currentUser.firstName}!`;
      if (userEmailEl) userEmailEl.textContent = currentUser.email;

      displayDashboard(currentUser.accountType);
      if (authContainer) authContainer.style.display = 'none';
      if (accountDashboard) accountDashboard.style.display = 'grid';
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
