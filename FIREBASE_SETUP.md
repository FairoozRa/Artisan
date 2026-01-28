# Firebase Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Name it "Artisan Market"
4. Choose your region
5. Click "Create Project"

## Step 2: Enable Authentication

1. In the left sidebar, click **Authentication**
2. Click **Get Started**
3. Enable these providers:
   - **Email/Password** (required)
   - **Google** (optional but recommended)

## Step 3: Get Your Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Copy the entire config object from "Your web app"
3. It will look like:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "artisan-market-xxx.firebaseapp.com",
  projectId: "artisan-market-xxx",
  storageBucket: "artisan-market-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

## Step 4: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // Paste your apiKey
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Paste your authDomain
  projectId: "YOUR_PROJECT_ID",     // Paste your projectId
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Paste your storageBucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Paste your messagingSenderId
  appId: "YOUR_APP_ID"              // Paste your appId
};
```

## Step 5: Add Firebase Scripts to account.html

Add these lines in the `<head>` section (BEFORE firebase-config.js):

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"></script>
```

## Features After Setup:

✅ Real email/password authentication
✅ Google Sign-In support
✅ Password reset via email
✅ User profile persistence
✅ Secure seller data storage
✅ Product images stored securely
✅ User sessions maintained across page refreshes

## Security Rules for Firestore:

Go to **Firestore** > **Rules** and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow anyone to read products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow users to read their own seller products
    match /sellerProducts/{sellerEmail}/products/{productId} {
      allow read: if true;
      allow write, delete: if request.auth.token.email == sellerEmail;
    }
  }
}
```

## Security Rules for Storage:

Go to **Storage** > **Rules** and set:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write, delete: if request.auth.uid == userId;
    }
  }
}
```

## Testing:

1. Test email/password registration
2. Test email/password login
3. Check user profile in Firebase Console
4. Verify seller products are saved with user ID
5. Test logging out and back in

## Troubleshooting:

**"Firebase is not defined"**: Make sure Firebase scripts are loaded BEFORE firebase-config.js

**"CORS error"**: Check that your domain is added to Firebase authorized domains (Project Settings > Authorized Domains)

**"Product images not saving"**: Check Storage rules and ensure user is authenticated

**"Password reset not working"**: Check that "Email/Password" provider is enabled in Authentication
