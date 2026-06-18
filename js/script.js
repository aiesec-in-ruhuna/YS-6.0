/* =============================================
   YOUTH SPACE 6.0 — Main JavaScript
   ============================================= */

// =============================================
// CONFIGURATION — Update these values!
// =============================================
const CONFIG = {
  // Google Form registration responses sheet (File → Share → Publish to web → CSV)
  REGISTRATION_SHEET_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclBAK7PY9gNctYhebX_x5nupiVQdn72phhsADJ9Y4vu9WsPLg4NuQb15o_g0jIwpzcZILbtHzXHms/pub?output=csv',

  // Ambassador codes sheet (File → Share → Publish to web → CSV)
  AMBASSADOR_SHEET_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS24TzKtykBo54xfUCzP-8IN4uZy49B5X-VWuW_ctTPBOyx_GfGenMStC0K4SeFk5IiUZ263B2ri6T_/pub?gid=1427230571&single=true&output=csv',

  // Google Form registration link
  REGISTRATION_FORM_URL: 'https://aiesec-in-ruhuna.github.io/YS-6.0/delegate-registration.html',

  REGISTRATION_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzlM6RgQikCJ_cyAi0ByyK5Gt4pB8pWik5K6uKXD0oQ8y4iB-ZGIwOs24cfpM9VY5y0mQ/exec',

  // Column indices (0-based) in the registration CSV:
  REG_COL_SCHOOL: 'Your School',   // Column D = "School / University"
  REG_COL_UNIVERSITY: 'University\nUse short form\ni.e. UOR for University of Ruhuna',   // Column D = "School / University"
  REG_COL_DISTRICT: 'District',   // Column E = "District"
  REG_COL_AMBCODE: 'Ambassador Id (if you don\'t know use 0000)',   // Column F = "Ambassador Code used"

  // Column indices in the ambassador CSV:
  AMB_COL_NAME: 5,   // Column A = Name
  AMB_COL_EMAIL: 1,   // Column B = Email
  AMB_COL_CODE: 4,   // Column C = Ambassador Code
  AMB_COL_UNIVERSITY: 6,   // Column D = University/School
};

// =============================================
// NAVBAR — scroll effect + mobile toggle
// =============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    document.getElementById('backToTop').classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    document.getElementById('backToTop').classList.remove('visible');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const observeSections = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observeSections.observe(s));

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.focus-card, .phase-card, .role-card, .benefit-item, .stat-card, .team-card, .award-card').forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('reveal-delay-1');
  if (i % 4 === 2) el.classList.add('reveal-delay-2');
  if (i % 4 === 3) el.classList.add('reveal-delay-3');
  revealObserver.observe(el);
});

// =============================================
// WHATSAPP — open chat
// =============================================
function openWhatsApp(number, message) {
  const encoded = encodeURIComponent(message || '');
  window.open(`https://wa.me/${number}?text=${encoded}`, '_blank', 'noopener');
}

// =============================================
// CSV PARSER — simple, no dependencies
// =============================================
function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  for (let i = 1; i < lines.length; i++) {   // skip header row
    const line = lines[i].trim();
    if (!line) continue;
    // Handle quoted commas
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"') {
        inQuotes = !inQuotes;
      } else if (line[c] === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += line[c];
      }
    }
    cells.push(current.trim());
    rows.push(cells);
  }
  return rows;
}

// =============================================
// LIVE STATS — from registration sheet
// =============================================
let registrationData = [];
async function loadStats() {
  const el_total = document.getElementById('totalRegistered');
  const el_schools = document.getElementById('totalSchools');
  const el_ambs = document.getElementById('totalAmbassadors');
  const el_districts = document.getElementById('totalDistricts');
  const el_hero = document.getElementById('heroRegistered');
  const el_updated = document.getElementById('lastUpdated');

  [el_total, el_schools, el_ambs, el_districts, el_hero].forEach(el => {
    if (el) el.textContent = '…';
  });

  try {
    const url = CONFIG.REGISTRATION_APPS_SCRIPT_URL + '?t=' + Date.now();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network error');
    registrationData = await res.json(); // now an array of objects, not parsed CSV rows
    // console.log('Loaded registration data:', Object.keys(registrationData[0]));
    const total = registrationData.length;

    const schools = new Set(
      registrationData.map(r => (r[CONFIG.REG_COL_SCHOOL] || '').toString().trim().toLowerCase()).filter(Boolean)
    );
    const universities = new Set(
      registrationData.map(r => (r[CONFIG.REG_COL_UNIVERSITY] || '').toString().trim().toLowerCase()).filter(Boolean)
    );
    const districts = new Set(
      registrationData.map(r => (r[CONFIG.REG_COL_DISTRICT] || '').toString().trim().toLowerCase()).filter(Boolean)
    );
    const ambCodes = new Set(
      registrationData.map(r => (r[CONFIG.REG_COL_AMBCODE] || '').toString().trim()).filter(Boolean)
    );

    let ambStats = {}; // default code for unknown ambassadors
    registrationData.forEach(r => {
      const code = (r[CONFIG.REG_COL_AMBCODE] || '').toString().trim();
      // console.log('Processing ambassador code:', code);
      // console.log(Object.keys(ambStats).indexOf(code));
      if (code !== '0000') {
        if (Object.keys(ambStats).indexOf(code) === -1) {
          ambStats[code] = { count: 1 };
        }
        ambStats[code].count = (ambStats[code]['count'] || 0) + 1;
      } // skip unknown ambassadors
    });

    //sort amdbassador stats by count descending
    const sortedAmbStats = Object.fromEntries(
      Object.entries(ambStats).sort(([, a], [, b]) => b.count - a.count)
    );

    ambStats = sortedAmbStats;
    await loadAmbassadorData();
    // Update the ambassador table with the latest stats id=ambassadorTableBody
    const tableBody = document.getElementById('ambassadorTableBody');
    if (tableBody) {
      tableBody.innerHTML = '';
      Object.keys(ambStats).forEach(code => {
        const count = ambStats[code].count;
        const amb = ambassadorData.find(a => (a[CONFIG.AMB_COL_CODE] || '').toString().trim() === code);
        const name = amb ? amb[CONFIG.AMB_COL_NAME] : 'Unknown';
        const email = amb ? amb[CONFIG.AMB_COL_EMAIL] : 'Unknown';
        //get the unievrsity/school of the ambassador

        const university = amb ? amb[CONFIG.AMB_COL_UNIVERSITY] : 'Unknown';
        const row = document.createElement('tr');
        row.innerHTML = `
    <td data-label="Code">${escapeHtml(code)}</td>
    <td data-label="Name">${escapeHtml(name)}</td>
    <td data-label="University/School">${escapeHtml(university)}</td>
    <td data-label="Delegate Registrations">${count}</td>
`;
tableBody.appendChild(row);
        // Example of how you are likely building your table rows in JS:
        // let newRow = document.createElement('tr');

        // // Notice the added data-label attribute inside each <td>!
        // newRow.innerHTML = `
        // <td data-label="Code">${ambassadorCode}</td>
        // <td data-label="Name">${ambassadorName}</td>
        // <td data-label="University">${universityName}</td>
        // <td data-label="Registrations">${registrationCount}</td>
        // `;

        // tableBody.appendChild(newRow);
      });
      applyTableLogic(); // re-apply search and pagination logic after updating the table
    }


    // console.log('Stats:', { total, schools: schools.size, universities: universities.size, districts: districts.size, ambCodes: ambCodes.size });

    animateCount(el_total, total);
    animateCount(el_schools, schools.size + universities.size);
    animateCount(el_ambs, ambCodes.size);
    animateCount(el_districts, districts.size);
    if (el_hero) animateCount(el_hero, total);

    const now = new Date();
    if (el_updated) el_updated.textContent = now.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });

  } catch (err) {
    console.warn('Stats load failed:', err);
    const fallback = '—';
    [el_total, el_schools, el_ambs, el_districts].forEach(el => {
      if (el) el.textContent = fallback;
    });
    if (el_hero) el_hero.textContent = fallback;
    if (el_updated) el_updated.textContent = 'Unable to load';
  }
}


// async function loadStats() {
//   const el_total = document.getElementById('totalRegistered');
//   const el_schools = document.getElementById('totalSchools');
//   const el_ambs = document.getElementById('totalAmbassadors');
//   const el_districts = document.getElementById('totalDistricts');
//   const el_hero = document.getElementById('heroRegistered');
//   const el_updated = document.getElementById('lastUpdated');

//   // Show loading
//   [el_total, el_schools, el_ambs, el_districts, el_hero].forEach(el => {
//     if (el) el.textContent = '…';
//   });

//   try {
//     const url = CONFIG.REGISTRATION_SHEET_CSV + '&t=' + Date.now(); // cache-bust
//     const res = await fetch(url);
//     if (!res.ok) throw new Error('Network error');
//     const text = await res.text();
//     registrationData = parseCSV(text);

//     const total = registrationData.length;

//     const schools = new Set(
//       registrationData.map(r => (r[CONFIG.REG_COL_SCHOOL] || '').trim().toLowerCase()).filter(Boolean)
//     );
//     const universities = new Set(
//       registrationData.map(r => (r[CONFIG.REG_COL_UNIVERSITY] || '').trim().toLowerCase()).filter(Boolean)
//     );
//     const districts = new Set(
//       registrationData.map(r => (r[CONFIG.REG_COL_DISTRICT] || '').trim().toLowerCase()).filter(Boolean)
//     );
//     const ambCodes = new Set(
//       registrationData.map(r => (r[CONFIG.REG_COL_AMBCODE] || '').trim()).filter(Boolean)
//     );

//     animateCount(el_total, total);
//     animateCount(el_schools, schools.size+universities.size);
//     animateCount(el_ambs, ambCodes.size);
//     animateCount(el_districts, districts.size);
//     if (el_hero) animateCount(el_hero, total);

//     const now = new Date();
//     if (el_updated) el_updated.textContent = now.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });

//   } catch (err) {
//     console.warn('Stats load failed:', err);
//     const fallback = '—';
//     [el_total, el_schools, el_ambs, el_districts].forEach(el => {
//       if (el) el.textContent = fallback;
//     });
//     if (el_hero) el_hero.textContent = fallback;
//     if (el_updated) el_updated.textContent = 'Unable to load';
//   }
// }

function applyTableLogic() {
  const searchInput = document.getElementById('ambassadorSearch');
  const tableBody = document.getElementById('ambassadorTableBody');
  const showMoreBtn = document.getElementById('showMoreBtn');

  // Get all the rows currently in the table
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  let isShowingAll = false;
  const INITIAL_LIMIT = 5;

  // This function decides which rows to show or hide
  function updateDisplay() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let matchCount = 0;

    rows.forEach(row => {
      // Check if the row text contains the search term
      const textContent = row.textContent.toLowerCase();
      const matchesSearch = textContent.includes(searchTerm);

      if (matchesSearch) {
        matchCount++;

        // If user is actively searching, show all matches. 
        // If not searching, enforce the 5-row limit (unless 'Show More' is clicked).
        if (searchTerm !== "") {
          row.classList.remove('hidden-row');
        } else {
          if (isShowingAll || matchCount <= INITIAL_LIMIT) {
            row.classList.remove('hidden-row');
          } else {
            row.classList.add('hidden-row');
          }
        }
      } else {
        row.classList.add('hidden-row'); // Hide rows that don't match the search
      }
    });

    // Update the Button
    if (searchTerm !== "") {
      // Hide the button completely when searching
      showMoreBtn.style.display = 'none';
    } else if (rows.length > INITIAL_LIMIT) {
      // Show the button if there are more than 5 total rows
      showMoreBtn.style.display = 'inline-block';
      showMoreBtn.innerText = isShowingAll ? "Show Less" : "Show More";
    } else {
      showMoreBtn.style.display = 'none';
    }
  }

  // 1. Listen for typing in the search bar
  searchInput.addEventListener('input', updateDisplay);

  // 2. Listen for clicks on the Show More button
  showMoreBtn.addEventListener('click', () => {
    isShowingAll = !isShowingAll; // Toggle the state
    updateDisplay();              // Re-run the display logic
  });

  // 3. Run it once immediately to hide rows 6+ on page load
  updateDisplay();
}

function animateCount(el, target) {
  if (!el) return;
  const duration = 1200;
  const step = 16;
  const steps = Math.ceil(duration / step);
  let current = 0;
  const inc = target / steps;
  const timer = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = Math.round(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, step);
}

// =============================================
// AMBASSADOR CODE LOOKUP
// =============================================
let ambassadorData = [];

async function loadAmbassadorData() {
  if (ambassadorData.length > 0) return; // already loaded
  try {
    const url = CONFIG.AMBASSADOR_SHEET_CSV + '&t=' + Date.now();
    const res = await fetch(url);
    if (!res.ok) throw new Error('fetch failed');
    const text = await res.text();
    ambassadorData = parseCSV(text);
  } catch (err) {
    console.warn('Ambassador sheet load failed:', err);
  }
}

async function lookupAmbassador() {
  const query = (document.getElementById('lookupQuery').value || '').trim().toLowerCase();
  const resultEl = document.getElementById('lookupResult');
  const loadingEl = document.getElementById('lookupLoading');

  if (!query) {
    resultEl.innerHTML = '<p class="lookup-not-found">Please enter a name or email to search.</p>';
    return;
  }

  resultEl.innerHTML = '';
  loadingEl.style.display = 'block';

  await loadAmbassadorData();
  loadingEl.style.display = 'none';

  if (ambassadorData.length === 0) {
    resultEl.innerHTML = '<p class="lookup-not-found">⚠ Unable to connect to the ambassador database. Please contact the organizing team.</p>';
    return;
  }

  const match = ambassadorData.find(row => {
    const name = (row[CONFIG.AMB_COL_NAME] || '').toLowerCase();
    const email = (row[CONFIG.AMB_COL_EMAIL] || '').toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  if (match) {
    const name = match[CONFIG.AMB_COL_NAME] || '';
    const email = match[CONFIG.AMB_COL_EMAIL] || '';
    const code = match[CONFIG.AMB_COL_CODE] || '—';
    resultEl.innerHTML = `
      <div class="lookup-card">
        <div class="lc-name">👋 ${escapeHtml(name)}</div>
        <div class="lc-email">${escapeHtml(email)}</div>
        <div style="margin-top:4px">
          <span style="font-size:0.78rem;color:#888;display:block;margin-bottom:6px">Your Ambassador Code:</span>
          <span class="lc-code">${escapeHtml(code)}</span>
        </div>
        <p style="font-size:0.78rem;color:#888;margin-top:12px">Share this code with your delegates when they register!</p>
      </div>`;
  } else {
    resultEl.innerHTML = `<p class="lookup-not-found">❌ No ambassador found matching "<strong>${escapeHtml(query)}</strong>". Please check your spelling or contact the organizing team.</p>`;
  }
}

function updateAmbassadorTable() {

}

// Allow Enter key in lookup input
document.getElementById('lookupQuery').addEventListener('keydown', e => {
  if (e.key === 'Enter') lookupAmbassador();
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// =============================================
// REGISTRATION BUTTON — patch the href
// =============================================
document.querySelectorAll('a[href*="forms.gle/YourGoogleFormLinkHere"]').forEach(a => {
  a.href = CONFIG.REGISTRATION_FORM_URL;
});

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  loadStats();

  // Preload ambassador data when user focuses the search box
  document.getElementById('lookupQuery').addEventListener('focus', loadAmbassadorData, { once: true });
});

// Auto-refresh stats every 5 minutes
setInterval(loadStats, 5 * 60 * 1000);