# Youth Space 6.0 — Website

**AIESEC in University of Ruhuna**  
Live: https://aiesec-in-ruhuna.github.io/YS-6.0/

---

## Setup Instructions

### 1. Files & Folder Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    ├── ys-logo.png                 ← Youth Space 6.0 logo (YS logo.png)
    ├── aiesec-ruhuna-logo.png      ← AIESEC in Ruhuna logo
    ├── hero-bg.jpg                 ← Large group photo at YS event (full-width hero)
    ├── aiesec-group.jpg            ← AIESEC members group photo on campus
    ├── phase1-online.jpg           ← Students in virtual/zoom session
    ├── phase2-obt.jpg              ← Outdoor team training / OBT activity photo
    ├── phase3-fair.jpg             ← Career fair with stalls and networking
    ├── register-bg.jpg             ← Energetic youth group photo (register section)
    ├── contact-disari.jpg          ← T.D. Disari Saseka (OCP)
    ├── contact-fakiya.jpg          ← Fakiya Jasuly
    ├── contact-hiranya.jpg         ← Hiranya Amarakoon
    ├── contact-wasana.jpg          ← Wasana Chathuperera
    ├── contact-sandali.jpg         ← Sandali Divyanjali
    ├── contact-adithya.jpg         ← Adithya Wijewickrama
    └── contact-manindu.jpg         ← Manindu Upek
```

### 2. Connect Live Data (Google Sheets)

Open `js/main.js` and update the `CONFIG` object at the top:

```js
const CONFIG = {
  // Registration responses sheet:
  // Go to Google Sheets → File → Share → Publish to web → CSV → Copy link
  REGISTRATION_SHEET_CSV: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0',

  // Ambassador codes sheet (same process):
  AMBASSADOR_SHEET_CSV: 'https://docs.google.com/spreadsheets/d/YOUR_AMB_SHEET_ID/export?format=csv&gid=0',

  // Google Form link for registration:
  REGISTRATION_FORM_URL: 'https://forms.gle/YOUR_FORM_LINK',

  // Column indices in the REGISTRATION CSV (0-based, skip header):
  REG_COL_SCHOOL:   3,   // Which column has "School/University"?
  REG_COL_DISTRICT: 4,   // Which column has "District"?
  REG_COL_AMBCODE:  5,   // Which column has "Ambassador Code"?

  // Column indices in the AMBASSADOR CSV:
  AMB_COL_NAME:  0,   // Column A = Name
  AMB_COL_EMAIL: 1,   // Column B = Email
  AMB_COL_CODE:  2,   // Column C = Ambassador Code
};
```

**To publish a Google Sheet as CSV:**
1. Open the sheet → File → Share → Publish to web
2. Select the correct sheet tab
3. Format: **Comma-separated values (.csv)**
4. Click Publish → copy the URL

### 3. Update Contact WhatsApp Links

The team card `onclick` handlers already have the correct numbers from the booklet.  
If any number changes, edit `index.html` and find the relevant `openWhatsApp('94XXXXXXXXX', ...)` call.

### 4. Update Social Media Links

In `index.html`, find the `.social-links` section and update:
- Facebook: `href="https://www.facebook.com/aiesecin.ruhuna"`
- Instagram: `href="https://www.instagram.com/aiesec_ruhuna"`
- LinkedIn: your LinkedIn company page URL

### 5. Deploy to GitHub Pages

```bash
git add .
git commit -m "Launch Youth Space 6.0 website"
git push origin main
```

Then in GitHub → Settings → Pages → Source: `main` branch → `/` (root)

---

## Features

- **Hero section** with animated title and live delegate count
- **About AIESEC** with Sri Lanka stats
- **What is Youth Space 6.0** — 6 focus cards
- **3-Phase Journey** — Online Sessions → OBT → Career Fair
- **Delegate Benefits & Awards** panel
- **Live Stats Dashboard** — pulls from published Google Sheet CSV every 5 minutes
- **Ambassador Program** section with roles, responsibilities, promotion tips
- **Ambassador Code Lookup** — search by name or email against your live sheet
- **Delegate Registration** CTA linked to Google Form
- **Contact Team** — 7 team cards with WhatsApp deep-links + hover effect
- **Responsive** down to 320px mobile
- **Accessibility** — keyboard focus, reduced motion support

---

## Image Guidelines

- All team photos: portrait orientation, 400×500px minimum, clear face
- Hero/background photos: landscape, 1920×1080px minimum
- Logos: PNG with transparent background
- Compress with TinyPNG or Squoosh before uploading

---

*Built for AIESEC in University of Ruhuna · Youth Space 6.0*