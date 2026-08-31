// Theme Toggle dark or light

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme or default to system preference
function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme before paint
setTheme(getPreferredTheme());

// Toggle on click
themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Navigation
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Scroll shadow on nav
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    }
});

// Scroll reveal
const revealElements = document.querySelectorAll(
    '.section-title, .project-card, .skill-group, .about-content, .contact-links, .metric-card, .chart-card, .results-intro'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`;
    revealObserver.observe(el);
});

// Chart card image zoom on click
document.querySelectorAll('.chart-card img').forEach(img => {
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(0, 0, 0, 0.85);
            display: flex; align-items: center; justify-content: center;
            cursor: zoom-out;
            animation: fadeIn 0.2s ease;
        `;

        const zoomedImg = document.createElement('img');
        zoomedImg.src = img.src;
        zoomedImg.alt = img.alt;
        zoomedImg.style.cssText = `
            max-width: 90vw; max-height: 90vh;
            border-radius: 8px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
            animation: scaleIn 0.25s ease;
        `;

        overlay.appendChild(zoomedImg);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Close on click
        overlay.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.2s ease forwards';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
            }, 200);
        });

        // Close on Escape
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                overlay.click();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
});

// Inject keyframe animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;
document.head.appendChild(style);
