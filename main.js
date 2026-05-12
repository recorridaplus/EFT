document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        document.getElementById('main-header').classList.toggle('nav-open');

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
                document.getElementById('main-header').classList.remove('nav-open');
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

    // Función para intentar cargar imágenes secuencialmente (gallery-1, gallery-2, etc.)
    async function discoverImages() {
        // 1. Cargar imágenes que ya existan en el HTML (fallback)
        const existingImages = galleryGrid.querySelectorAll('img');
        existingImages.forEach(img => {
            if (!allImages.includes(img.src)) {
                allImages.push(img.src);
            }
        });

        // 2. Intentar descubrir más imágenes (empezando desde el siguiente número)
        let i = allImages.length + 1;
        let consecutiveFails = 0;
        const extensions = ['png', 'jpg', 'jpeg', 'webp'];
        const maxConsecutiveFails = 2;

        console.log("Buscando imágenes adicionales...");

        while (i <= 50 && consecutiveFails < maxConsecutiveFails) {
            let foundInThisStep = false;
            
            for (const ext of extensions) {
                const imgPath = `assets/gallery-${i}.${ext}`;
                const exists = await checkImageExists(imgPath);
                
                if (exists) {
                    console.log(`Imagen nueva encontrada: ${imgPath}`);
                    allImages.push(imgPath);
                    
                    const item = document.createElement('div');
                    item.className = 'gallery-item reveal';
                    item.style.display = 'none'; // Las nuevas siempre se ocultan en el index
                    
                    const img = document.createElement('img');
                    img.src = imgPath;
                    img.alt = `Enzo Fernández Trío - Imagen ${allImages.length}`;
                    img.loading = 'lazy';
                    
                    const currentIndex = allImages.length - 1;
                    img.addEventListener('click', () => openLightbox(currentIndex));
                    
                    item.appendChild(img);
                    galleryGrid.appendChild(item);
                    foundInThisStep = true;
                    consecutiveFails = 0;
                    break;
                }
            }

            if (!foundInThisStep) {
                consecutiveFails++;
            }
            i++;
        }
        
        // Re-asignar eventos a las imágenes iniciales por si acaso
        const finalImages = galleryGrid.querySelectorAll('img');
        finalImages.forEach((img, idx) => {
            img.style.cursor = 'pointer';
            img.onclick = () => openLightbox(idx);
        });

        console.log(`Galería lista. Total: ${allImages.length} imágenes.`);
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
