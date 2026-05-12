document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal, .fade-in');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => link.style.animation = '');
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Auto-Discovery Gallery Logic
    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let allImages = [];
    let currentImgIndex = 0;

    // Función para intentar cargar imágenes secuencialmente (gallery-1.png, gallery-2.png, etc.)
    async function discoverImages() {
        galleryGrid.innerHTML = ''; // Limpiar galería estática
        let i = 1;
        let searching = true;

        while (searching && i <= 50) { // Límite de 50 para evitar bucles infinitos
            const imgPath = `assets/gallery-${i}.png`;
            try {
                const exists = await checkImageExists(imgPath);
                if (exists) {
                    allImages.push(imgPath);
                    
                    // Solo crear el elemento en el grid si es una de las primeras 3
                    const item = document.createElement('div');
                    item.className = 'gallery-item reveal';
                    if (i > 3) item.style.display = 'none';
                    
                    const img = document.createElement('img');
                    img.src = imgPath;
                    img.alt = `Enzo Fernández Trío - Imagen ${i}`;
                    img.loading = 'lazy';
                    
                    const index = i - 1;
                    img.addEventListener('click', () => openLightbox(index));
                    
                    item.appendChild(img);
                    galleryGrid.appendChild(item);
                    i++;
                } else {
                    searching = false;
                }
            } catch (e) {
                searching = false;
            }
        }
    }

    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    const openLightbox = (index) => {
        currentImgIndex = index;
        lightboxImg.src = allImages[currentImgIndex];
        lightboxCaption.textContent = `Enzo Fernández Trío - Imagen ${currentImgIndex + 1}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    const showNext = () => {
        currentImgIndex = (currentImgIndex + 1) % allImages.length;
        lightboxImg.src = allImages[currentImgIndex];
        lightboxCaption.textContent = `Enzo Fernández Trío - Imagen ${currentImgIndex + 1}`;
    };

    const showPrev = () => {
        currentImgIndex = (currentImgIndex - 1 + allImages.length) % allImages.length;
        lightboxImg.src = allImages[currentImgIndex];
        lightboxCaption.textContent = `Enzo Fernández Trío - Imagen ${currentImgIndex + 1}`;
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    discoverImages();
});

// Keyframes for Nav Links Animation (added via JS to keep CSS clean)
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .toggle .line2 {
        opacity: 0;
    }
    .toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);
