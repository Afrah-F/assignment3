/* ========================================
   Name Gate (first visit) + Greeting/Chip
   ======================================== */
const greetingEl = document.getElementById('greetingText');
const userChip = document.getElementById('userChip');
const changeNameBtn = document.getElementById('changeName');
const gate = document.getElementById('nameGate');
const gateForm = document.getElementById('nameGateForm');
const nameInput = document.getElementById('nameInput');

function updateGreetingAndChip() {
    const hour = new Date().getHours();
    const base = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const name = localStorage.getItem('username') || 'there';
    if (greetingEl) greetingEl.textContent = `${base}, ${name}! 👋`;
    if (userChip) userChip.textContent = `Hi, ${name}`;
}

// Show gate if no name yet
(function initGate(){
    const saved = localStorage.getItem('username');
    if (!saved) {
        gate?.classList.add('show');
        //
        setTimeout(()=> nameInput?.focus(), 50);
    } else {
        updateGreetingAndChip();
    }
})();

// Submit name
gateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = (nameInput?.value || '').trim();
    if (!value) return;
    localStorage.setItem('username', value);
    gate?.classList.remove('show');
    updateGreetingAndChip();
    if (nameInput) nameInput.value = '';
});

// Change name later
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
const savedTheme = localStorage.getItem('theme'); // 'dark' | 'light'

// 
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeBtn && (themeBtn.textContent = '☀️');
} else {
    themeBtn && (themeBtn.textContent = '🌙');
}

themeBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.documentElement.classList.contains('dark-mode');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


/* =====================================
   GitHub API (Advanced Integration)
   ===================================== */
const githubListEl = document.getElementById('githubRepos');
const githubErrorEl = document.getElementById('githubError');
const githubSpinnerEl = document.getElementById('githubSpinner');

// 
const GITHUB_USERNAME = 'Afrah-F';
const REPOS_URL = `https://api.github.com/users/Afrah-F/repos?sort=updated&per_page=4`;

async function loadGitHubRepos() {
    if (!githubListEl || !githubSpinnerEl || !githubErrorEl) return;

    // 
    if (githubSpinnerEl) githubSpinnerEl.style.display = 'flex';
    if (githubErrorEl) githubErrorEl.classList.add('hidden');

    try {
        const res = await fetch(REPOS_URL, { cache: 'no-store' });
        if (!res.ok) {
            //
            if (res.status === 404) {
                throw new Error('GitHub user not found or API limit reached.');
            }
            throw new Error('Network or API Error');
        }

        const repos = await res.json();
        githubListEl.innerHTML = '';

        if (repos.length === 0) {
            githubListEl.innerHTML = '<p class="muted" style="text-align: center; width: 100%;">No public repositories found.</p>';
            return;
        }

        repos.forEach(repo => {
            const card = document.createElement('article');
            card.className = 'project-card fade-in';
            card.innerHTML = `
        <div class="project-body">
          <h3>${repo.name}</h3>
          <div class="project-meta">${repo.language || 'N/A'} • Updated: ${new Date(repo.updated_at).toLocaleDateString()}</div>
          <p>${repo.description || 'No description provided.'}</p>
          <a href="${repo.html_url}" target="_blank" class="btn small" style="margin-top: 10px;">View Repo</a>
        </div>
      `;
            githubListEl.appendChild(card);
        });

    } catch (error) {
        console.error("Failed to load GitHub repos:", error);
        if (githubListEl) githubListEl.innerHTML = ''; // 
        if (githubErrorEl) githubErrorEl.classList.remove('hidden'); //
    } finally {
        if (githubSpinnerEl) githubSpinnerEl.style.display = 'none'; // 
    }
}

// 
if (GITHUB_USERNAME !== 'your-github-username') {
    loadGitHubRepos();
} else {
    if (githubListEl) githubListEl.innerHTML = '<p class="muted" style="text-align: center; width: 100%;">Please set your GitHub username in js/script.js to load repositories.</p>';
}

/* ========================================
   Projects (filter/search/sort) - Complex Logic 1
   ======================================== */
const projects = [
    { title:'CLUBZONE Platform', category:'Web', date:'2025-01-10', img:'club.png',
        summary:'A web platform to manage and join student clubs.',
        details:'Built as part of SWE206. I focused on UI design and improving UX flows.' },
    { title:'Online Gaming Data Analysis', category:'Data', date:'2024-04-01', img:'online.png',
        summary:'Collected and analyzed player data with visual insights.',
        details:'Part of COE292. I practiced data handling, visualization, and teamwork.' },
    { title:'Saudi Electricity Investment Presentation', category:'Presentation', date:'2024-05-16', img:'elec.png',
        summary:'English 102 presentation on investment benefits.',
        details:'Improved my research, academic writing, and presentation skills.' },
];
const listEl = document.getElementById('projectsList');
const emptyEl = document.getElementById('emptyState');
const chips = [...document.querySelectorAll('.chip')];
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
let activeFilter = 'all';
let query = '';
let sortBy = 'date-desc';

function compare(a, b) {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    return 0;
}

function match(p) {
    const passFilter = activeFilter === 'all' || p.category === activeFilter;
    const q = query.trim().toLowerCase();
    const passSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
    return passFilter && passSearch;
}

function render() {
    if (!listEl || !emptyEl) return;
    const filtered = projects.filter(match).sort(compare);
    listEl.innerHTML = '';

    if (filtered.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'project-card fade-in';
        card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <div class="project-body">
        <h3>${p.title}</h3>
        <div class="project-meta">${p.category} • ${new Date(p.date).toLocaleDateString()}</div>
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

chips.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        chips.forEach(c=>c.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        render();
    });
});

searchInput?.addEventListener('input', e=>{
    query = e.target.value;
    render();
});

sortSelect?.addEventListener('change', e=>{
    sortBy = e.target.value;
    render();
});

render(); // 

/* ========================================
   Contact Form Validation (Complex Logic 2)
   ======================================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function validateEmail(email) {
    // RegEx 
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function displayError(field, message) {
    const errorEl = document.querySelector(`.field-error[data-for="${field}"]`);
    if (errorEl) {
        errorEl.textContent = message;
    }
    const inputEl = contactForm.querySelector(`[name="${field}"]`);
    if (inputEl) {
        inputEl.classList.add('error-input');
    }
}

function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
    if (formStatus) formStatus.textContent = '';
}

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    let isValid = true;

    // 1. Check for empty fields
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
        // 2. Complex Logic: Check message length
        displayError('message', 'Message must be at least 10 characters.');
        isValid = false;
    }

    // 3. Complex Logic: Check email format (if not empty)
    if (data.email.trim() && !validateEmail(data.email.trim())) {
        displayError('email', 'Please enter a valid email address.');
        isValid = false;
    }

    if (isValid) {
        // 
        if (formStatus) formStatus.innerHTML = '<span class="spinner"></span> Submitting message...';

        // 
        setTimeout(() => {
            console.log('Form Submitted:', data);
            if (formStatus) {
                formStatus.textContent = '✅ Thank you! Your message has been sent.';
                formStatus.style.color = 'var(--primary)';
            }
            contactForm.reset();
            // 
            setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 5000);
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

window.addEventListener('scroll', () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (backToTopBtn) backToTopBtn.style.display = y > 200 ? 'block' : 'none';
});

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
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

