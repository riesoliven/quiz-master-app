# 📝 QuizMaster App - Changelog

---

## October 3, 2025 - Project Start

### ✅ Working Functionalities

**Core Quiz Features:**
- Multiple choice quiz system with 4 options per question
- Question shuffling capability
- Timer-based gameplay
- Score tracking and high score system
- Results screen with performance feedback

**User System:**
- User authentication (signup/login)
- User profiles with statistics
- Stats by subject tracking
- Profile management

**Leaderboard:**
- Global leaderboard functionality
- High score rankings
- Player performance comparison

**Question Management:**
- Question manager for admins
- Admin authorization system
- Multiple subjects/categories support
- Subject-specific ratings display

**UI/UX:**
- Main menu navigation
- Helper screen with subject ratings
- Proper back button functionality
- Debug screen for diagnostics

**Coins System:**
- Coin balance tracking
- Coin rewards system (simulated ads)

---

## October 4, 2025 - AdMob Real Test Ads Implementation

### 🐛 Issues Resolved

**AdMob Integration Bug Fixes:**
- ❌ **Problem:** Real Google test ads not showing in EAS builds - app was falling back to 2-second simulated ads
- ✅ **Root Cause:** Incorrect event listener API usage
  - Was using wrong event type names (`FAILED_TO_LOAD`, lowercase strings like `'rewarded'`, `'closed'`)
  - Caused error: `RewardedAd.addAdEventListener(*) 'type' expected a valid event type value`
- ✅ **Solution:** Updated to correct event types from official `react-native-google-mobile-ads` API:
  - Initialization: `RewardedAdEventType.LOADED` and `AdEventType.ERROR`
  - Showing ads: `RewardedAdEventType.EARNED_REWARD` and `AdEventType.CLOSED`
  - Properly imported `AdEventType` from AdMob module

**Previous Fixes (Earlier in Session):**
- Fixed coin balance refresh bug - added missing `refreshUserProfile` call
- Fixed ad unit ID bug - removed `__DEV__` check that caused placeholder ID in production builds

### ✨ Features Added

**Debug Tools:**
- Live console log viewer in Debug Screen
- Real-time ad event monitoring
- On-screen diagnostic information showing:
  - Environment detection (bare/standalone/Expo Go)
  - AdMob module status
  - Ad loading state
  - Ad unit IDs
  - All internal checks status

### 📁 Files Modified
- `src/services/adService.js` - Fixed event listener API, improved logging
- `src/screens/DebugScreen.js` - Added live console log capture and display
- `CHANGELOG.md` - Created (this file)

### 🎯 Current Status
✅ Real Google test ads now working in EAS builds
✅ Proper ad loading detection
✅ Comprehensive debugging tools in place

---

## October 5, 2025 - Helper System & New Subjects

### ✨ Features Added

**Complete Helper Progression System:**
- 20 unique helpers across 5 tiers (FREE, COMMON, RARE, EPIC, LEGENDARY)
- EXP-based leveling system (Level 1-10, 100 EXP per level)
- Base→Potential rating growth (linear interpolation)
- Earn 2 EXP per correct answer in quizzes
- Buy EXP with coins (10 coins = 1 EXP)
- Unlock costs: FREE (0), COMMON (1k), RARE (5k), EPIC (15k), LEGENDARY (50k)
- New users start with 3 FREE helpers unlocked

**View Helpers Screen:**
- Browse all 20 helpers (locked and unlocked)
- View helper stats, levels, and EXP progress
- Unlock helpers directly with coins
- Upgrade helpers by buying EXP
- See current ratings and potential ratings

**New Subjects:**
- Geography (🌍) - 12 questions covering world geography
- Technology (💻) - 12 questions on AI, ML, and tech advances

**Dev Tools:**
- Energy refill button (DEV +25) for testing
- Delete account functionality in Profile screen
- Enhanced logging for high score messages

### 🔧 Fixes

**Bug Fixes:**
- Fixed energy system going negative
- Fixed leaderboard loading errors with try-catch
- Fixed CSV import compatibility (DocumentPicker + FileSystem API updates)

**UI/UX Improvements:**
- Helper selection now shows locked/unlocked status
- Added unlock buttons directly on helper cards
- Renamed "Upgrade Helpers" to "View Helpers"

### 📊 Data Changes

**New Helper Roster (20 total):**
- **FREE (3):** Max Chen, Coach Rivera, Luna Page
- **COMMON (7):** Sarah Kim, Alex Torres, Dr. Yamamoto, Prof. Smith, Maya Patel, Jamie Chen, Raj Sharma
- **RARE (5):** Captain Nova, Sherlock, Marie Curie, Da Vinci, Shakespeare
- **EPIC (3):** Einstein, Newton, Aristotle
- **LEGENDARY (2):** Athena, Merlin

**Subject Expansion:**
- Added Geography and Technology to all relevant systems:
  - Daily subject rotation
  - User stats initialization
  - Question submission forms
  - Admin question manager

### 📁 Files Modified

**New Files:**
- `src/services/helperService.js` - Helper unlock/EXP/leveling logic
- `src/data/helpers.js` - 20 helper definitions with ratings
- `src/screens/HelperUpgradeScreen.js` - View/unlock/upgrade UI
- `src/services/deleteAccountService.js` - Account deletion

**Updated Files:**
- `src/screens/SignupScreen.js` - Initialize 3 FREE helpers
- `src/screens/HelperSelectScreen.js` - Show lock/unlock UI
- `src/screens/QuizGameScreen.js` - Award helper EXP
- `src/screens/MainMenuScreen.js` - Added VIEW HELPERS button
- `src/screens/ResultsScreen.js` - Enhanced message logging
- `src/screens/ProfileScreen.js` - Delete account button
- `src/screens/QuestionManagerScreen.js` - CSV import fixes
- `src/screens/SubmitQuestionScreen.js` - New subjects
- `src/data/questions.js` - Geography & Technology questions
- `src/services/dailySubject.js` - New subjects in rotation
- `src/services/userStatsService.js` - New subjects in stats
- `src/services/energyService.js` - Prevent negative energy
- `App.js` - HelperUpgrade route

### 🐛 Known Issues

**Under Investigation:**
- High score messages not appearing on leaderboard (debugging logs added)

### 🎯 Current Status

✅ Helper system fully functional
✅ 12 subjects with questions
✅ Multi-currency economy (Energy, Gems, Coins)
✅ CSV import/export working
✅ Leaderboard with messages
✅ Stats tracking by subject
⚠️ Investigating message display issue

---

*Last updated: October 5, 2025*
