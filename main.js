/* ═══════════════════════════════════════════════════════════════
   RapidMed — Main JavaScript
   Handles: header scroll, mobile nav, scroll reveal animations
═══════════════════════════════════════════════════════════════ */

// ── Header scroll effect ──
const header = document.getElementById('site-header');
let lastScroll = 0;

function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
}
window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// ── Mobile navigation toggle ──
const mobileToggle = document.getElementById('mobile-toggle');
const mainNav = document.getElementById('main-nav');

mobileToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    });
});

// ── Scroll reveal animations ──
function initScrollReveal() {
    const revealSelectors = [
        '.service-card',
        '.usp-item',
        '.testimonial-card',
        '.blog-card',
        '.section-header',
        '.breakout-content',
        '.hero-content',
        '.hero-image-wrap',
    ];

    const elements = document.querySelectorAll(revealSelectors.join(','));
    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Stagger sibling reveals
                    const parent = entry.target.parentElement;
                    const siblings = Array.from(parent.querySelectorAll('.reveal'));
                    const index = siblings.indexOf(entry.target);
                    const delay = Math.min(index * 100, 400);

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    elements.forEach(el => observer.observe(el));
}

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ── Counter animation for USP stats (if any numeric stat spans are added) ──
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    handleHeaderScroll();
    initCarousel();
});

// ── Carousel functionality ──
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const images = document.querySelectorAll('.carousel-image');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!carousel || images.length === 0) return;

    let currentIndex = 0;

    // Create dots
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = (index + images.length) % images.length;
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto-advance carousel every 5 seconds
    setInterval(nextSlide, 5000);
}
