import './style.css'

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
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

document.querySelectorAll('.step-card, .glass-panel, .hero-content, .hero-image').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});

// User Selection Logic
const userLinks = {
    fran: "https://gofile.io/d/Xib0Ix",
    manu: "https://www.facebook.com/photo/?fbid=2024612324264064&set=ecnf.100044254457993", // REEMPLAZAR CON ENLACE REAL
    mario: "https://gofile.io/d/xK4mjB",
    jorge: "https://example.com/rom-jorge"  // REEMPLAZAR CON ENLACE REAL
};

console.log('Iniciando lógica de selección de usuario...');
const userButtons = document.querySelectorAll('.user-btn');
const downloadContainer = document.getElementById('download-container');
const selectedUserName = document.getElementById('selected-user-name');
const dynamicDownloadLink = document.getElementById('dynamic-download-link');

if (userButtons.length === 0) console.error('No se encontraron botones de usuario (.user-btn)');
if (!downloadContainer) console.error('No se encontró el contenedor de descarga (#download-container)');

userButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Click en usuario:', btn.dataset.user);

        // Remove active class from all
        userButtons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');

        const user = btn.dataset.user;
        const link = userLinks[user];

        if (!link) {
            console.error('No se encontró enlace para el usuario:', user);
            return;
        }

        console.log('Enlace seleccionado:', link);

        // Update content
        if (selectedUserName) selectedUserName.textContent = user;
        if (dynamicDownloadLink) dynamicDownloadLink.href = link;

        // Show download area with animation
        if (downloadContainer) {
            downloadContainer.classList.remove('hidden');
            console.log('Clase hidden eliminada del contenedor');
        }
    });
});
