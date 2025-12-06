# 🚀 ViScan - Firebase Deployment Quick Start

## Prerequisites Checklist

- [x] Firebase CLI installed (`firebase --version`)
- [x] Firebase configuration files created
- [x] Firebase Functions code ready
- [ ] Firebase project created in console
- [ ] Functions dependencies installed

## Quick Deployment Steps

### 1. Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize or Link Project

**Option A: Link Existing Project**
```bash
firebase use --add
# Select your project from the list
# Enter alias: production
```

**Option B: Create .firebaserc manually**
```bash
echo '{
  "projects": {
    "default": "YOUR_PROJECT_ID_HERE"
  }
}' > .firebaserc
```

Replace `YOUR_PROJECT_ID_HERE` with your actual Firebase project ID.

### 4. Set Environment Variables

```bash
firebase functions:config:set \
  jwt.secret="your-super-secret-jwt-key-change-this" \
  jwt.expire="7d"
```

### 5. Test Locally with Emulators

```bash
firebase emulators:start
```

Open http://localhost:5000 to test the app locally.

### 6. Deploy to Firebase

```bash
# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore,storage
```

### 7. Get Your App URL

After deployment, you'll see:
```
✔  Deploy complete!

Hosting URL: https://YOUR_PROJECT_ID.web.app
```

## Testing PWA on iOS

1. Open Safari on iPhone
2. Navigate to your Hosting URL
3. Tap Share button → "Add to Home Screen"
4. Open app from Home Screen

## Need Help?

See the comprehensive [walkthrough.md](/.gemini/antigravity/brain/d2a051d0-cb75-463f-adff-24d40134877e/walkthrough.md) for detailed instructions.

## Project Structure

```
viscan-1uzz8/
├── functions/              # Firebase Functions (Backend)
│   ├── controllers/       # Auth & Analysis controllers
│   ├── routes/           # API routes
│   ├── middleware/        # Auth middleware
│   ├── services/          # Iris processing services
│   ├── data/             # Iridology zones data
│   ├── index.js          # Main entry point
│   └── package.json      # Functions dependencies
├── public/                # Frontend (Hosting)
│   ├── index.html        # Landing page
│   ├── auth.html         # Login/Register
│   ├── dashboard.html     # Dashboard
│   ├── manifest.json      # PWA manifest
│   ├── service-worker.js  # Service worker
│   ├── icons/            # App icons (72-512px)
│   ├── css/              # Stylesheets
│   └── js/               # Client-side JavaScript
├── firebase.json          # Firebase config
├── firestore.rules        # Database security
└── storage.rules          # Storage security
```

## Key Features

### PWA (Progressive Web App)
✅ Offline support with Service Worker
✅ App installation on iOS and Android
✅ Apple-specific meta tags and icons
✅ RTL Arabic support

### Firebase Backend
✅ Firestore for user data and analyses
✅ Firebase Storage for iris images
✅ Cloud Functions for API
✅ Secure authentication with JWT

## Commands Reference

```bash
# Local development
npm start                    # Run local server
firebase emulators:start     # Test with emulators

# Deployment
firebase deploy              # Deploy all
firebase deploy --only hosting
firebase deploy --only functions

# Monitoring
firebase functions:log       # View function logs
```

---

**Last Updated**: 2025-12-06  
**Status**: Ready for deployment 🎉
