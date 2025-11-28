/* ========================================
   Name Gate (first visit) + Greeting/Chip
   ======================================== */
const greetingEl = document.getElementById('greetingText');
const userChip = document.getElementById('userChip');
const changeNameBtn = document.getElementById('changeName');
const gate = document.getElementById('nameGate');
const gateForm = document.getElementById('nameGateForm');
const nameInput = document.getElementById('nameInput');

/**
 * Update greeting text and small user chip in the header
 * based on the current time and the saved username.
 */
function updateGreetingAndChip() {
  const hour = new Date().getHours();
  const base =
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
    'Good evening';

  const name = localStorage.getItem('username') || 'there';

  if (greetingEl) greetingEl.textContent = `${base}, ${name}! 👋`;
  if (userChip) userChip.textContent = `Hi, ${name}`;
}

/**
 * Show the name gate on first visit if no username is stored.
 * Otherwise, just update the greeting.
 */
(function initGate() {
  const saved = localStorage.getItem('username');
  if (!saved) {
    gate?.classList.add('show');
    setTimeout(() => nameInput?.focus(), 50);
  } else {
    updateGreetingAndChip();
  }
})();

/**
 * Handle name gate form submission.
 * Save the name, hide the gate, and update the UI.
 */
gateForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = (nameInput?.value || '').trim();
  if (!value) return;

  localStorage.setItem('username', value);
  gate?.classList.remove('show');
  updateGreetingAndChip();
  if (nameInput) nameInput.value = '';
});

/**
 * Allow the user to change their name later
 * using a simple prompt dialog.
 */
changeNameBtn?.addEventListener('click', () => {
  const current = localStorage.getItem('username') || '';
  const input = prompt('Update your name:', current);
  if (input !== null) {
    const v = input.trim();
    if (v) {
      localStorage.setItem('username', v);
      updateGreetingAndChip();
    }
  }
});

/* =========================
   Theme Toggle (persisted)
   ========================= */
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme'); // 'dark' | 'light' | null

// Initialize theme from localStorage
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
  if (themeBtn) themeBtn.textContent = '☀️';
} else {
  if (themeBtn) themeBtn.textContent = '🌙';
}

// Toggle theme and remember the choice
themeBtn?.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');
  const isDark = document.documentElement.classList.contains('dark-mode');
  if (themeBtn) themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* =====================================
   GitHub API (Advanced Integration)
   ===================================== */
const githubListEl = document.getElementById('githubRepos');
const githubErrorEl = document.getElementById('githubError');
const githubSpinnerEl = document.getElementById('githubSpinner');

// Your GitHub username
const GITHUB_USERNAME = 'Afrah-F';
// Use the username in the API URL
const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`;

/**
 * Fetch latest public repositories from GitHub
 * and render them as cards in the portfolio.
 */
async function loadGitHubRepos() {
  if (!githubListEl || !githubSpinnerEl || !githubErrorEl) return;

  // Show loading spinner and hide error message
  githubSpinnerEl.style.display = 'flex';
  githubErrorEl.classList.add('hidden');

  try {
    const res = await fetch(REPOS_URL, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('GitHub user not found or API limit reached.');
      }
      throw new Error('Network or API Error');
    }

    const repos = await res.json();
    githubListEl.innerHTML = '';

    if (!Array.isArray(repos) || repos.length === 0) {
      githubListEl.innerHTML =
        '<p class="muted" style="text-align: center; width: 100%;">No public repositories found.</p>';
      return;
    }

    // Render each repo as a card
    repos.forEach((repo) => {
      const card = document.createElement('article');
      card.className = 'project-card fade-in';
      card.innerHTML = `
        <div class="project-body">
          <h3>${repo.name}</h3>
          <div class="project-meta">
            ${repo.language || 'N/A'} • Updated: ${new Date(repo.updated_at).toLocaleDateString()}
          </div>
          <p>${repo.description || 'Assignment "SWE363".'}</p>
          <a href="${repo.html_url}" target="_blank" class="btn small" style="margin-top: 10px;">
            View Repo
          </a>
        </div>
      `;
      githubListEl.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load GitHub repos:', error);
    githubListEl.innerHTML = '';
    githubErrorEl.classList.remove('hidden');
  } finally {
    // Always hide the spinner at the end
    githubSpinnerEl.style.display = 'none';
  }
}

// Run GitHub API after the DOM has loaded
document.addEventListener('DOMContentLoaded', loadGitHubRepos);

/* ========================================
   Projects (filter/search/sort) - Complex Logic 1
   ======================================== */
const projects = [
  {
    title: 'CLUBZONE Platform',
    category: 'Web',
    date: '2025-01-10',
    img: 'club.png',
    summary: 'A web platform to manage and join student clubs.',
    details: 'Built a project of SWE206.'
  },
  {
    title: 'Online Gaming Data Analysis',
    category: 'Data',
    date: '2024-04-01',
    img: 'online.png',
    summary: 'Collected and analyzed player data with visual insights.',
    details: 'Part of COE292. I practiced data handling, visualization, and teamwork.'
  },
  {
    title: 'Saudi Electricity Investment Presentation',
    category: 'Presentation',
    date: '2024-05-16',
    img: 'elec.png',
    summary: 'English 102 presentation on investment benefits.',
    details: 'Improved my research, academic writing, and presentation skills.'
  }
];

const listEl = document.getElementById('projectsList');
const emptyEl = document.getElementById('emptyState');
const chips = [...document.querySelectorAll('.chip')];
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

let activeFilter = 'all';
let query = '';
let sortBy = 'date-desc';

/**
 * Compare two projects based on the current sort option.
 */
function compare(a, b) {
  if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
  if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
  if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
  if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
  return 0;
}

/**
 * Check if a project matches the current filter and search query.
 */
function match(p) {
  const passFilter = activeFilter === 'all' || p.category === activeFilter;
  const q = query.trim().toLowerCase();
  const passSearch =
    !q ||
    p.title.toLowerCase().includes(q) ||
    p.summary.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q);

  return passFilter && passSearch;
}

/**
 * Render the filtered and sorted project cards.
 */
function render() {
  if (!listEl || !emptyEl) return;

  const filtered = projects.filter(match).sort(compare);
  listEl.innerHTML = '';

  if (filtered.length === 0) {
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');

  filtered.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'project-card fade-in';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <div class="project-body">
        <h3>${p.title}</h3>
        <div class="project-meta">
          ${p.category} • ${new Date(p.date).toLocaleDateString()}
        </div>
        <p>${p.summary}</p>
        <details>
          <summary>Details</summary>
          <p>${p.details}</p>
        </details>
      </div>
    `;
    listEl.appendChild(card);
  });
}

// Filter buttons (chips)
chips.forEach((btn) => {
  btn.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter || 'all';
    render();
  });
});

// Search input
searchInput?.addEventListener('input', (e) => {
  query = e.target.value;
  render();
});

// Sort select
sortSelect?.addEventListener('change', (e) => {
  sortBy = e.target.value;
  render();
});

// Initial render
render();

/* ========================================
   Contact Form Validation (Complex Logic 2)
   ======================================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

/**
 * Basic email validation using a regular expression.
 */
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Show a validation error message for a specific field.
 */
function displayError(field, message) {
  const errorEl = document.querySelector(`.field-error[data-for="${field}"]`);
  if (errorEl) errorEl.textContent = message;

  const inputEl = contactForm?.querySelector(`[name="${field}"]`);
  if (inputEl) inputEl.classList.add('error-input');
}

/**
 * Clear all validation error messages and styles.
 */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
  document.querySelectorAll('.error-input').forEach((el) => el.classList.remove('error-input'));
  if (formStatus) {
    formStatus.textContent = '';
    formStatus.style.color = '';
  }
}

/**
 * Validate form fields and simulate form submission.
 */
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());
  let isValid = true;

  // 1. Required fields
  if (!data.name.trim()) {
    displayError('name', 'Name is required.');
    isValid = false;
  }
  if (!data.email.trim()) {
    displayError('email', 'Email is required.');
    isValid = false;
  }
  if (!data.message.trim()) {
    displayError('message', 'Message is required.');
    isValid = false;
  } else if (data.message.trim().length < 10) {
    // 2. Extra rule: minimum message length
    displayError('message', 'Message must be at least 10 characters.');
    isValid = false;
  }

  // 3. Extra rule: email format (only if not empty)
  if (data.email.trim() && !validateEmail(data.email.trim())) {
    displayError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (isValid) {
    // Show fake loading state
    if (formStatus) {
      formStatus.innerHTML = '<span class="spinner"></span> Submitting message...';
      formStatus.style.color = 'var(--muted)';
    }

    // Simulate async send
    setTimeout(() => {
      console.log('Form Submitted:', data);
      if (formStatus) {
        formStatus.textContent = '✅ Thank you! Your message has been sent.';
        formStatus.style.color = 'var(--primary)';
      }
      contactForm.reset();

      // Clear status after a few seconds
      setTimeout(() => {
        if (formStatus) formStatus.textContent = '';
      }, 5000);
    }, 1500);
  } else {
    if (formStatus) {
      formStatus.textContent = '❌ Please correct the errors above.';
      formStatus.style.color = '#ef4444';
    }
  }
});

/* =========================
   Back-to-Top + Smooth anchors
   ========================= */
const backToTopBtn = document.getElementById('backToTop');

// Show or hide the back-to-top button depending on scroll position
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (backToTopBtn) backToTopBtn.style.display = y > 200 ? 'block' : 'none';
});

// Scroll smoothly to top when the button is clicked
backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scrolling for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
