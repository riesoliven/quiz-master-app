# Firebase Setup Guide for QuizMasterApp

## 🔥 Firebase Configuration Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "QuizMasterApp" (or your choice)
4. Disable Google Analytics (optional) or enable it
5. Click "Create Project"

### 2. Register Your App

**Note:** This is a React Native app, but we use the Web SDK for Expo compatibility.

#### Option A: Web SDK (Recommended for Expo)
1. In Firebase Console, click the **Web icon (</>)** to add a web app
2. Enter app nickname: "QuizMasterApp"
3. DON'T check "Firebase Hosting" (not needed for React Native)
4. Click "Register app"
5. Copy the Firebase configuration object

#### Option B: Android Native (For Production/Standalone Builds)
If you're building a standalone APK or using EAS Build:
1. Click the **Android icon** in Firebase Console
2. Enter Android package name (e.g., `com.yourname.quizmasterapp`)
3. Download `google-services.json`
4. Place it in the root of your project
5. Follow Expo's Firebase setup guide for native builds

**For now, use Option A (Web SDK) - it works perfectly with Expo Go!**

### 3. Update Firebase Config

Open `src/services/firebase.js` and replace the config with your values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Enable Authentication

1. In Firebase Console, go to "Build" > "Authentication"
2. Click "Get Started"
3. Click on "Email/Password" in the Sign-in method tab
4. Enable "Email/Password"
5. Click "Save"

### 5. Set Up Firestore Database

1. Go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a Cloud Firestore location (choose nearest to you)
5. Click "Enable"

### 6. Configure Firestore Security Rules

In the "Rules" tab, replace with these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Leaderboard - anyone authenticated can read, only own data can be written
    match /leaderboard/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
    }

    // Scores - users can write their own scores, read all scores
    match /scores/{scoreId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

**⚠️ IMPORTANT:** These are development rules. For production, implement stricter security!

### 7. Database Structure

The app will automatically create these collections:

#### `users` Collection
```
users/{userId}
  - username: string
  - email: string
  - avatar: string (emoji)
  - createdAt: timestamp
  - level: number
  - totalGamesPlayed: number
  - coins: number
  - gems: number
```

#### `leaderboard` Collection
```
leaderboard/{userId}
  - userId: string
  - username: string
  - avatar: string
  - highScore: number
  - message: string (custom message)
  - lastUpdated: timestamp
```

#### `scores` Collection
```
scores/{scoreId}
  - userId: string
  - score: number
  - baseScore: number
  - timeBonus: number
  - completionBonus: number
  - questionsAnswered: number
  - totalQuestions: number
  - timeRemaining: number
  - createdAt: timestamp
```

## 📱 Testing the App

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Test authentication:
   - Create a new account
   - Login with email/password
   - Test logout

4. Test gameplay:
   - Play a quiz
   - Complete it to save a score
   - Check if score appears in leaderboard
   - Try beating your high score to see the celebration

## 🎮 Features Implemented

✅ Email/Password Authentication
✅ User Profiles with Avatars
✅ Global Leaderboard (ranked by high score only)
✅ Personal High Score Tracking
✅ Custom Message Bubbles on Leaderboard
✅ New High Score Celebration
✅ Real-time Leaderboard Updates
✅ Logout Functionality

## 🔧 Troubleshooting

### Firebase Not Connecting
- Make sure you copied the config correctly
- Check that Authentication is enabled
- Verify Firestore is created

### "Missing or insufficient permissions"
- Check Firestore security rules
- Make sure you're logged in

### App Crashes on Signup
- Check Firebase console for errors
- Verify all fields are filled
- Check network connection

## 📚 Next Steps

After basic setup works:

1. **Production Security Rules**: Implement stricter Firestore rules
2. **Email Verification**: Add email verification for new users
3. **Password Reset**: Already implemented in LoginScreen
4. **Social Login**: Add Google/Apple sign-in
5. **Analytics**: Enable Firebase Analytics to track user behavior

## 🎯 Firebase Free Tier Limits

- **Authentication**: 50,000 MAUs (Monthly Active Users)
- **Firestore**:
  - 50K document reads/day
  - 20K document writes/day
  - 1 GB storage
- More than enough for development and small-scale deployment!

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Look at browser/app console logs
3. Verify all configuration values are correct
4. Check network connectivity

---

**Happy Coding! 🚀**
