// Style loaded in index.html

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card, .glass-panel, .hero-content, .hero-image, .gallery-item').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});

// User Selection Logic
const userLinks = {
    jorge: "[ENLACE_ROM_JORGE]",
    manu: "[ENLACE_ROM_MANU]", 
    montes: "[ENLACE_ROM_MONTES]",
    mario: "[ENLACE_ROM_MARIO]",
    fran: "[ENLACE_ROM_FRAN]"
};

const userButtons = document.querySelectorAll('.user-btn');
const downloadContainer = document.getElementById('download-container');
const selectedUserName = document.getElementById('selected-user-name');
const dynamicDownloadLink = document.getElementById('dynamic-download-link');
const romDownloadContainer = document.getElementById('rom-download-container');
const romDownloadLink = document.getElementById('rom-download-link');

userButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        userButtons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');

        const user = btn.dataset.user;
        const link = userLinks[user];

        // Update content
        if (selectedUserName) {
            selectedUserName.textContent = user;
        }
        if (dynamicDownloadLink) {
            dynamicDownloadLink.href = link;
        }

        // Update ROM download area
        if (romDownloadLink) {
            romDownloadLink.href = link;
        }

        // Update ROM filename display
        const userNamePlaceholder = document.querySelector('.user-name-placeholder');
        if (userNamePlaceholder) {
            userNamePlaceholder.textContent = user.charAt(0).toUpperCase() + user.slice(1);
        }

        // Show download areas with animation
        if (downloadContainer) {
            downloadContainer.classList.remove('hidden');
        }
        if (romDownloadContainer) {
            romDownloadContainer.classList.remove('hidden');
        }
    });
});
