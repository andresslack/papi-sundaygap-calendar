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
| SMS        | Twilio (via Netlify serverless function)        |
| Deploy     | Netlify (auto-deploy from GitHub on push)       |
| Fonts      | Google Fonts - Quicksand                        |

---

## Repository

GitHub: https://github.com/andresslack/papi-sundaygap-calendar
Branch: main
Files:
- index.html — main app
- netlify/functions/send-sms.js — Twilio SMS serverless function
- HANDOFF.md — this file

---

## Deployment

Netlify is connected to GitHub and auto-deploys on every push to main.
No build step needed - Netlify serves index.html directly.

---

## Netlify Environment Variables

| Variable              | Value                          |
|-----------------------|--------------------------------|
| TWILIO_ACCOUNT_SID    | (stored in Netlify environment variables) |
| TWILIO_AUTH_TOKEN     | (stored as secret in Netlify)  |
| TWILIO_PHONE_NUMBER   | +18135780433                   |

⚠️ PENDING: Regenerate Twilio Auth Token at console.twilio.com and update Netlify env variable.

---

## Firebase Configuration

Project: papi-sundaygap
Database URL: https://papi-sundaygap-default-rtdb.firebaseio.com
API Key: AIzaSyD8CS9GHLmONH7Timj4bJyGPskZevOn8jg
App ID: 1:93846168368:web:61c226190142d2de9d9ef5

Firebase stores two collections:
- caregivers: array of { name, code, color, phone } objects
- schedule: object of { "YYYY-MM-DD": "XX" } where XX is a 2-letter caregiver code

IMPORTANT: Firebase data always overrides the initialCaregivers defaults in the code.
If you change a caregiver's color in the code defaults, it won't take effect unless
the caregiver is deleted and re-added in the app (which overwrites Firebase),
OR the color is changed via the in-app color picker (which saves directly to Firebase).

Firebase Rules: must remain open (read/write: true) — rules expire if left on
timed trial mode. If app shows blank schedule, check Firebase Console →
Realtime Database → Rules and ensure they are set to:
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

---

## Twilio SMS Setup

Account SID: (stored in Netlify environment variables)
Phone number: +18135780433 (813) 578-0433
Serverless functions:
- netlify/functions/send-sms.js   — sends reminders AND the opt-in confirmation text
- netlify/functions/sms-reply.js  — inbound webhook: handles YES/STOP/HELP replies (double opt-in)

### Double opt-in / consent flow (required for A2P approval)
The May 2026 campaign was REJECTED for opt-in. Carriers require the *recipient*
to opt in — an organizer checkbox is not valid consent. The app now uses a
double opt-in:

1. Organizer adds a caregiver (name, phone) — consentStatus starts "none".
2. Organizer taps "Send confirm" → app sends a confirmation text via send-sms.js;
   consentStatus → "pending" ("awaiting YES" badge).
3. Caregiver replies YES → sms-reply.js sets consentStatus → "confirmed" in
   Firebase. The app (live Firebase listener) flips the badge to "SMS ✓".
4. Reminders can ONLY be sent to caregivers with consentStatus === "confirmed".
   There is no "send anyway" override.
5. Caregiver replies STOP → consentStatus → "opted_out"; reminders blocked.
6. Changing a caregiver's phone number resets consentStatus to "none"
   (the new number must be re-confirmed).

consentStatus values stored per caregiver in Firebase: none | pending | confirmed | opted_out
(legacy smsOptIn boolean is kept in sync: true only when confirmed).

### ⚠️ REQUIRED: configure the inbound webhook in Twilio
Twilio Console → Phone Numbers → Manage → Active Numbers → +1 813 578 0433 →
Messaging → "A MESSAGE COMES IN" → Webhook, HTTP POST:
    https://papi-sundaygap.netlify.app/.netlify/functions/sms-reply
Without this, caregiver YES/STOP replies are never recorded and reminders stay blocked.
sms-reply.js validates the X-Twilio-Signature, so TWILIO_AUTH_TOKEN must be set
correctly in Netlify (see the pending token-regeneration note above).

### A2P 10DLC Registration Status (as of May 15, 2026)
- Brand registration: IN REVIEW (submitted May 15, 2026)
- Campaign registration: NOT YET STARTED (pending Brand approval)

### Next Steps to Complete SMS Setup
1. Wait for Brand approval email from Twilio (1–3 business days)
2. Go to console.twilio.com → Messaging → Regulatory Compliance → Campaigns
3. Click "Register a Campaign" using the approved Brand
4. Use case: Notifications
5. Description: "Family caregiver scheduling reminders for elderly parent care coordination"
6. Sample message: "Hi Alexandra, reminder that you are scheduled for Papi's care
   this Sunday 5/18 from 6:00–8:00 PM. App: https://papi-sundaygap.netlify.app"
7. Once Campaign is approved, SMS reminders will work automatically — no code changes needed

---

## Features

- 24-week schedule: past Sundays back to April 12, 2026 + 20 future Sundays
- All dates (past, present, future) are fully clickable and editable
- April 12, 2026 is always pre-assigned to Andres (AN) if not set
- Color-coded calendar grid tiles per assigned caregiver (6-column grid)
- Caregiver management: add, delete, change color, add/edit phone number
- 📱 Send Reminders section: one row per assigned Sunday with Remind button
- SMS reminder sent manually by tapping Remind — shows preview before sending
- Firebase real-time sync across all devices
- SYNCED badge shown in header when Firebase is connected

### App Layout (top to bottom)
1. Header (title + SYNCED badge)
2. Calendar grid (24-week schedule)
3. Send Reminders section
4. Caregivers section (list with color picker, phone editor, add/delete)

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

Note: actual colors and phone numbers in use are stored in Firebase, not the defaults above.

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

## How Phone Numbers Work

- Each caregiver has an optional phone field stored in Firebase in E.164 format (+1XXXXXXXXXX)
- Tap ✏️ next to any caregiver to add or edit their phone number
- Type in any common format — the field auto-formats as you type to (012) 345-6789
- Saved to Firebase as +10123456789 (E.164) automatically — no manual formatting needed
- Displayed throughout the app in friendly format (012) 345-6789
- If no phone is stored, tapping Remind shows an alert to add one first
---

## How SMS Reminders Work

- The Send Reminders section lists all Sundays that have an assigned caregiver
- Tap 📱 Remind on any row to send a text to that caregiver
- A confirmation dialog shows the recipient, phone number, and exact message
- Message format: "Hi [FirstName], reminder that you are scheduled for Papi's care
  this Sunday [M/D] from 6:00–8:00 PM. App: https://papi-sundaygap.netlify.app"
- The button turns green (✓ Sent) for 4 seconds on success
- Reminders are manual — you tap them on Monday and again on Saturday

---

## Key Code Locations (all in index.html)

- Firebase config: lines ~35-43
- PALETTE constant: just after `const { useState, useEffect } = React;`
- initialCaregivers array: inside CaregiverCalendar() function
- getSundays(): controls which Sundays are displayed and how many
  (change `i < 20` to adjust future weeks shown)
- assignCaregiver(): handles date assignment and Firebase save
- changeColor(): handles color change and Firebase save
- savePhone(): handles phone number save to Firebase
- sendReminder(): builds and sends SMS via Netlify function
- Send Reminders section: below the calendar grid in JSX
- Color Picker Modal: just before the Assignment Modal in JSX

---

## Known Quirks

- The app uses Firebase v8 SDK (not v9 modular) - keep using v8 syntax
  (firebase.database().ref() not getDatabase/ref imports)
- React and Babel are loaded via CDN — no npm, no build step
- The file must be named index.html for Netlify to serve it at the root URL
- Past dates have no opacity fade (opacity: 1) — all dates look the same visually
- The calendar grid is 6 columns wide

---

## Completed Modifications

### As of April 21, 2026
1. Enabled full editing of past dates (previously non-clickable)
2. Changed David's color to blue (#4A90D9)
3. Changed Eloisa's color to orange (#FF8C42)
4. Removed opacity fade on past dates
5. Added 20-color palette picker for both new and existing caregivers

### As of May 15, 2026
6. Fixed Firebase rules expiration (rules had expired May 13, 2026 — reset to open)
7. Added phone number field to each caregiver (stored in Firebase)
8. Added ✏️ phone editor inline in Caregivers section
9. Added SMS reminder feature via Twilio + Netlify serverless function
10. Added Send Reminders section below the calendar grid
11. Reordered app layout: Calendar → Send Reminders → Caregivers
12. Extended schedule from 22 to 24 weeks (20 future Sundays)
13. Switched from drag-and-drop Netlify deploy to GitHub-connected auto-deploy
14. Added netlify/functions/send-sms.js serverless function
15. Added automatic phone number formatting — displays as (813) 555-1234, stores as +18135780433 in E.164 format
