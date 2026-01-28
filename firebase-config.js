/**
 * firebase-config.js - Firebase Configuration and Initialization
 * IMPORTANT: Replace YOUR_* placeholders with your actual Firebase credentials
 */

// Import Firebase modules from CDN
// These are loaded automatically if included in your HTML before this script

// Firebase Configuration
// Get these values from your Firebase Console:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project called "Artisan Market"
// 3. Go to Project Settings
// 4. Copy the Web API credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

// Wait for DOM to ensure Firebase is loaded globally
if (typeof firebase !== 'undefined') {
  // Initialize Firebase
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();

  console.log('Firebase initialized successfully');
} else {
  console.error('Firebase SDK not loaded. Add Firebase scripts to your HTML.');
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.firebaseConfig = {
    app,
    auth,
    db,
    isConfigured: auth && db ? true : false
  };
}
