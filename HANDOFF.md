# Papi Sunday Gap Calendar - Technical Handoff

A caregiver scheduling calendar for Sunday visits (6:00-8:00 PM) with MaCristina and Papi.
Single HTML file app using React, Firebase Realtime Database, and deployed on Netlify.
Live at: https://papi-sundaygap.netlify.app

---

## Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18 (loaded via CDN, no build step)        |
| Language   | JSX compiled by Babel Standalone (CDN)          |
| Database   | Firebase Realtime Database v8                   |
| Deploy     | Netlify (auto-deploy from GitHub on push)       |
| Fonts      | Google Fonts - Quicksand                        |

---

## Repository

GitHub: https://github.com/andresslack/papi-sundaygap-calendar
Local path: C:\Users\andre\OneDrive\Documents\Caregiver Calendar App\index.html
Branch: main

---

## Deployment

Netlify is connected to GitHub and auto-deploys on every push to main.

To deploy changes:
    git add index.html
    git commit -m "your message"
    git push

No build step needed - Netlify serves index.html directly.

---

## Firebase Configuration

Project: papi-sundaygap
Database URL: https://papi-sundaygap-default-rtdb.firebaseio.com
API Key: AIzaSyD8CS9GHLmONH7Timj4bJyGPskZevOn8jg
App ID: 1:93846168368:web:61c226190142d2de9d9ef5

Firebase stores two collections:
- caregivers: array of { name, code, color } objects
- schedule: object of { "YYYY-MM-DD": "XX" } where XX is a 2-letter caregiver code

IMPORTANT: Firebase data always overrides the initialCaregivers defaults in the code.
If you change a caregiver's color in the code defaults, it won't take effect unless
the caregiver is deleted and re-added in the app (which overwrites Firebase),
OR the color is changed via the in-app color picker (which saves directly to Firebase).

---

## Features

- Displays all Sundays from April 12, 2026 up to 17 weeks in the future
- Shows up to 12 past Sundays (going back to April 12, 2026 start date)
- All dates (past, present, future) are fully clickable and editable
- April 12, 2026 is always pre-assigned to Andres (AN) if not set
- Color-coded calendar tiles per assigned caregiver
- Caregiver management: add, delete, change color
- Firebase real-time sync across all devices
- SYNCED badge shown in header when Firebase is connected

---

## Caregivers (default list)

| Name      | Code | Color   |
|-----------|------|---------|
| Alexandra | AL   | #AA96DA |
| Andres    | AN   | #F38181 |
| Claudia   | CL   | #FCBAD3 |
| David     | DA   | #4A90D9 |
| Eloisa    | EL   | #FF8C42 |
| Gina      | GI   | #FFE66D |
| Karen     | KA   | #FF6B9D |
| Raquel    | RA   | #FFD3B6 |
| Sonia     | SO   | #4ECDC4 |

Note: actual colors in use are stored in Firebase, not the defaults above.
Use the in-app color picker to change colors (saves to Firebase permanently).

---

## Color Palette (20 preset colors)

    '#F38181', '#FF6B9D', '#FF8C42', '#F9A825', '#FFE66D',
    '#A8E6CF', '#48BB78', '#4ECDC4', '#4A90D9', '#667EEA',
    '#AA96DA', '#9C27B0', '#FCBAD3', '#FFD3B6', '#E91E63',
    '#00BCD4', '#38B2AC', '#3182CE', '#805AD5', '#718096'

---

## How Color Picker Works

For existing caregivers:
- Click the colored code badge (e.g. "DA") next to a caregiver's name
- A modal appears with the 20-color palette
- Clicking a color saves it immediately to Firebase

When adding a new caregiver:
- The Add form shows a row of 20 color swatches
- Click one to select it before saving
- Default selection is the first palette color (#F38181)

---

## Key Code Locations (all in index.html)

- Firebase config: lines ~35-43
- PALETTE constant: just after `const { useState, useEffect } = React;`
- initialCaregivers array: inside CaregiverCalendar() function
- getSundays(): controls which Sundays are displayed and how many
- assignCaregiver(): handles date assignment and Firebase save
- changeColor(): handles color change and Firebase save
- Color Picker Modal: just before the Assignment Modal in the JSX

---

## Known Quirks

- The app uses Firebase v8 SDK (not v9 modular) - keep using v8 syntax
  (firebase.database().ref() not getDatabase/ref imports)
- React and Babel are loaded via CDN - no npm, no build step
- The file must be named index.html for Netlify to serve it at the root URL
- Past dates have no opacity fade (opacity: 1) - all dates look the same visually
- The calendar grid is 6 columns wide

---

## Completed Modifications (as of April 21, 2026)

1. Enabled full editing of past dates (previously non-clickable)
2. Changed David's color to blue (#4A90D9)
3. Changed Eloisa's color to orange (#FF8C42)
4. Removed opacity fade on past dates
5. Added 20-color palette picker for both new and existing caregivers
