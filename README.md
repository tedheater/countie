# Tap Counter

A customizable, full-screen counter/tally tracking Progressive Web App (PWA) designed for fast, touch-friendly counting with session tracking and data export capabilities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [User Guide](#user-guide)
  - [Basic Counting](#basic-counting)
  - [Managing Categories](#managing-categories)
  - [Session Tracking](#session-tracking)
  - [Undo Actions](#undo-actions)
  - [Data Export & Import](#data-export--import)
- [PWA Installation](#pwa-installation)
- [Mobile Usage](#mobile-usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

### Core Counting
- **Multi-category counters** - Track multiple counts simultaneously with custom names and colors
- **Quick tap to increment** - Tap any counter to increase its value by 1
- **Long-press to decrement** - Hold for 380ms to decrease a counter
- **Visual feedback** - Button press animations and color-coded categories
- **Undo support** - Up to 120 undo entries with easy undo button

### Session Management
- **Session recording** - Start/stop sessions to track counting periods
- **Session history** - Stores up to 40 previous sessions with timestamps
- **Real-time timer** - Live elapsed time display during active sessions
- **Session details** - View duration, total changes, and per-category deltas

### Data Management
- **Export to CSV** - Download count data as spreadsheet-compatible CSV file
- **Export to JSON** - Full backup including categories, sessions, and history
- **Import from JSON** - Restore from previous backups
- **Persistent storage** - All data automatically saved to browser localStorage

### PWA & Mobile
- **Installable** - Add to Home Screen on iOS/Android
- **Offline support** - Service Worker caches all assets for offline use
- **Standalone mode** - Runs as full-screen app when installed
- **Responsive grid** - Auto-adjusts columns (1-3) based on category count
- **iOS optimized** - Handles safe area insets and touch interactions

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Languages** | HTML5, CSS3, JavaScript (ES6+) |
| **Frameworks** | None (Vanilla JS) |
| **Libraries** | None (zero dependencies) |
| **Storage** | localStorage |
| **PWA Features** | Service Worker, Web App Manifest |

---

## Project Structure

```
County/
├── index.html          # Main HTML entry point
├── app.js              # Core application logic
├── styles.css          # Stylesheet with dark theme
├── manifest.json       # PWA manifest configuration
├── sw.js               # Service Worker for offline caching
├── icons/              # App icon assets
│   ├── icon-180.png    # Apple touch icon
│   ├── icon-192.png    # Standard PWA icon
│   ├── icon-512.png    # Large PWA icon
│   ├── icon-maskable-512.png  # Maskable icon for Android
│   └── icon-source-1024.png   # Source icon file
└── Archive.zip         # Archived files
```


## Getting Started

1. **Open the app** 
2. **Default counter** - The app starts with one default counter named "Counter"
3. **Start counting** - Tap the counter to increment
4. **Access settings** - Click the gear icon (⚙) in the bottom bar to manage categories and data

---

## User Guide

### Basic Counting

#### Incrementing a Counter
- **Tap** or **click** on any counter card to increase its count by 1
- The counter value updates immediately with visual feedback (pulse animation)
- The total count in the bottom bar updates automatically

#### Decrementing a Counter
- **Long-press** (hold for 380ms) on any counter card to decrease its count by 1
- A progress ring appears during the long-press to show progress
- The counter will not go below 0

#### Visual Indicators
- Each counter displays its current count in large text
- Counters are color-coded based on their assigned color
- The bottom bar shows the total count across all categories

---

### Managing Categories

Access category management through the **Settings dialog** (gear icon ⚙ in bottom bar).

#### Adding a New Category
1. Open Settings
2. Tap **"Add Category"**
3. Enter a name (max 24 characters)
4. Select a color from the color picker
5. Tap **"Save"** or **"Add"**

#### Editing a Category
1. Open Settings
2. Find the category in the list
3. Tap the **edit icon** (pencil) next to the category
4. Modify the name and/or color
5. Tap **"Save"**

#### Deleting a Category
1. Open Settings
2. Find the category in the list
3. Tap the **delete icon** (trash) next to the category
4. Confirm the deletion

**Note:** Deleting a category permanently removes its count data.

#### Category Limits
- Maximum of 20 categories allowed
- Category names limited to 24 characters
- Each category can have a unique color for easy identification

---

### Session Tracking

Sessions allow you to track counting activity over specific time periods.

#### Starting a Session
1. Tap the **timer icon** in the bottom bar
2. The session starts immediately
3. A timer appears showing elapsed time (HH:MM:SS format)
4. All counter changes during the session are recorded

#### Stopping a Session
1. Tap the **timer icon** again (now shown as stop icon)
2. The session ends and is saved to history
3. View session summary with duration and count changes

#### Viewing Session History
1. Open Settings
2. Navigate to the **"History"** section
3. See up to 40 previous sessions with:
   - Start and end timestamps
   - Duration
   - Total count change
   - Per-category deltas

#### Session Data Includes
- Session start time
- Session end time
- Duration (formatted as HH:MM:SS)
- Snapshot of all counter values at start
- Snapshot of all counter values at end
- Calculated deltas per category

---

### Undo Actions

The app maintains an undo history of up to 120 actions.

#### Undoing the Last Action
1. Tap the **undo icon** (↩) in the bottom bar
2. The last increment or decrement is reversed
3. Counter values return to their previous state

#### Undo Limitations
- Only the last action can be undone one at a time
- Undo history is lost when the page is refreshed
- Undo does not apply to category management actions (add/edit/delete)

---

### Data Export & Import

#### Export to CSV
Export counter data as a CSV file for use in spreadsheets:
1. Open Settings
2. Tap **"Export CSV"**
3. A file named `tap-counter-export-YYYY-MM-DD.csv` downloads
4. Open in Excel, Google Sheets, or any CSV viewer

CSV format includes:
- Category names
- Current counts
- Category colors

#### Export Full Backup (JSON)
Create a complete backup of all app data:
1. Open Settings
2. Tap **"Export Backup"**
3. A file named `tap-counter-backup-YYYY-MM-DD.json` downloads

Backup includes:
- All categories (names, counts, colors)
- Current session state (if active)
- Session history (up to 40 sessions)

#### Import Backup (JSON)
Restore from a previous backup:
1. Open Settings
2. Tap **"Import Backup"**
3. Select a previously exported `.json` backup file
4. Confirm the import

**Warning:** Importing replaces all current data with the backup data.

---

## PWA Installation

### Chrome / Edge (Desktop)
1. Open the app in Chrome or Edge
2. Look for the **install icon** (⊕) in the address bar
3. Click **"Install"** or use the Settings menu → **"Install App"**

### iPhone / iPad (iOS)
1. Open the app in **Safari**
2. Tap the **Share button** (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Confirm the name and tap **"Add"**

### Android
1. Open the app in Chrome
2. Tap the **menu button** (⋮)
3. Tap **"Install app"** or **"Add to Home Screen"**
4. Confirm the installation

### Benefits of PWA Installation
- Opens in full-screen (no browser chrome)
- Works offline after first visit
- Faster loading times
- Appears as a native app icon on Home Screen
- Independent from browser tabs

---

## Mobile Usage

### iOS Safari Optimizations
- Safe area insets handled for notch/dynamic island devices
- Touch callout suppressed to prevent copy/paste interference
- 380ms long-press threshold optimized for mobile

### Android Chrome Optimizations
- Maskable icons supported for adaptive icons
- Standalone display mode
- Portrait orientation lock

### Touch Interactions
| Action | Result |
|--------|--------|
| Quick tap | Increment counter |
| Long press (380ms) | Decrement counter |
| Tap settings gear | Open settings dialog |
| Tap undo button | Undo last action |
| Tap timer button | Start/stop session |

---

## Keyboard Shortcuts

While primarily designed for touch, the app supports keyboard navigation:

| Key/Action | Result |
|------------|--------|
| `Tab` | Navigate between interactive elements |
| `Enter` / `Space` | Activate focused button or counter |
| `Escape` | Close settings dialog |

---

## Troubleshooting

### Data Not Saving
- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode (may limit storage)
- Clear browser cache and reload if data appears corrupted

### PWA Not Installing
- Ensure you're serving the app via HTTP server (not file://)
- Check that all PWA files are present (manifest.json, sw.js, icons)
- In Chrome, check `chrome://flags/#bypass-app-banner-engagement-checks`

### Offline Not Working
- Verify Service Worker is registered (Chrome DevTools → Application → Service Workers)
- Clear cache and reload to re-register Service Worker
- Check that sw.js is being served correctly

### Long-press Not Working
- Ensure you're holding for the full 380ms
- Watch for the progress ring animation
- On some devices, disable "touch acceleration" or similar accessibility settings

### Import Fails
- Verify the JSON file was exported from this app
- Check file isn't corrupted (open in text editor to verify JSON format)
- Ensure file size is reasonable (should be < 1MB for typical usage)

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Best PWA support |
| Edge 90+ | ✅ Full | Best PWA support |
| Safari 14+ | ✅ Full | iOS PWA installation supported |
| Firefox 90+ | ⚠️ Partial | PWA features limited |
| Opera | ✅ Full | Based on Chromium |

---

## Development

### Making Changes
1. Edit `app.js` for functionality changes
2. Edit `styles.css` for visual changes
3. Edit `index.html` for structure changes
4. Update `sw.js` cache version when changing assets
5. Test with local server (not file:// protocol)

### Service Worker Cache
To force update cached files, increment the cache version in `sw.js`:
```javascript
const CACHE_NAME = 'tap-counter-v2'; // Increment this
```

---

## License

This project is open source. Feel free to modify and distribute.

---

## Credits

Built with vanilla JavaScript, HTML5, and CSS3. No dependencies, no build tools, just clean, accessible code.
