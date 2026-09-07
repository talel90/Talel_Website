/**
 * Personal Portfolio Website - Main JavaScript
 * Features: Typewriter effect, scroll animations, navigation highlighting
 */

// ========================================
// Typewriter Effect
// ========================================
class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.texts = JSON.parse(element.dataset.texts || '[]');
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;

        if (this.texts.length > 0) {
            this.type();
        }
    }

    type() {
        const fullText = this.texts[this.currentIndex];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentText === fullText) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}
// ========================================
// Mouse Reveal Lines Effect
// ========================================
class MouseRevealLines {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.pageHeight = 0;

        this.init();
    }

    createSVGLines() {
        // Generate lines that cover the full page height
        const pageHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        this.pageHeight = pageHeight;

        // Generate horizontal curved lines every 150px
        let horizontalLines = '';
        for (let y = 100; y < pageHeight; y += 150) {
            const offset = (y % 300) - 150;
            horizontalLines += `<path d="M-100,${y} Q${200 + offset},${y + 50} 400,${y - 30} T800,${y + 20} T1200,${y - 40} T1600,${y + 30} T2000,${y - 20} T2400,${y + 40}"/>`;
        }

        // Generate vertical/diagonal curved lines
        let verticalLines = '';
        for (let x = 0; x < 2000; x += 250) {
            const offset = (x % 500) - 250;
            verticalLines += `<path d="M${x},-50 Q${x + 150 + offset},400 ${x + 50},800 T${x + 100},1600 T${x + 50},2400 T${x + 150},3200 T${x},4000 T${x + 100},4800 T${x + 50},5600 T${x + 150},6400"/>`;
        }

        return `
        <svg width="100%" height="${pageHeight}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;">
            <defs>
                <mask id="mouseMask">
                    <rect width="100%" height="100%" fill="black"/>
                    <circle cx="0" cy="0" r="200" fill="white" id="maskCircle">
                        <animate attributeName="r" values="180;220;180" dur="3s" repeatCount="indefinite"/>
                    </circle>
                </mask>
            </defs>
            <g mask="url(#mouseMask)" stroke="#08519C" stroke-width="1.5" fill="none" opacity="0.7">
                ${horizontalLines}
                ${verticalLines}
            </g>
        </svg>`;
    }

    init() {
        // Create the lines container
        this.linesContainer = document.createElement('div');
        this.linesContainer.classList.add('reveal-lines');
        this.linesContainer.innerHTML = this.createSVGLines();
        document.body.appendChild(this.linesContainer);

        this.maskCircle = document.getElementById('maskCircle');

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.pageX;
            this.mouseY = e.pageY;
        });

        // Update SVG height when page resizes
        window.addEventListener('resize', () => {
            this.linesContainer.innerHTML = this.createSVGLines();
            this.maskCircle = document.getElementById('maskCircle');
        });

        this.animate();
    }

    animate() {
        // Smooth follow
        this.currentX += (this.mouseX - this.currentX) * 0.1;
        this.currentY += (this.mouseY - this.currentY) * 0.1;

        if (this.maskCircle) {
            this.maskCircle.setAttribute('cx', this.currentX);
            this.maskCircle.setAttribute('cy', this.currentY);
        }

        requestAnimationFrame(() => this.animate());
    }
}
// ========================================
// One-Time Typewriter (triggers once on scroll into view)
// ========================================
class OneTimeTypewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.text = element.dataset.typewriterText || element.textContent;
        this.typeSpeed = options.typeSpeed || 80;
        this.hasTyped = false;

        // Create inner structure: text span + cursor span
        this.element.innerHTML = `<span class="typewriter-text"></span><span class="typewriter-title-cursor">|</span>`;
        this.textSpan = this.element.querySelector('.typewriter-text');
        this.cursorSpan = this.element.querySelector('.typewriter-title-cursor');
        this.element.classList.add('typewriter-title');

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasTyped) {
                    this.hasTyped = true;
                    this.type();
                    observer.unobserve(this.element);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    type() {
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < this.text.length) {
                this.textSpan.textContent = this.text.substring(0, index + 1);
                index++;
            } else {
                clearInterval(typeInterval);
                this.cursorSpan.classList.add('fade-out');
            }
        }, this.typeSpeed);
    }
}

// ========================================
// Scroll Reveal Animation
// ========================================
class ScrollReveal {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, this.options);

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

// ========================================
// Navigation
// ========================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navLinkItems = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');

        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking a link
        this.navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.highlightActiveSection();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navLinks.classList.remove('active');
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    highlightActiveSection() {
        const scrollPos = window.scrollY + window.innerHeight / 3;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ========================================
// Smooth Scroll (for browsers without native support)
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// Scroll Indicator
// ========================================
class ScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        if (this.indicator) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.indicator.style.opacity = '0';
                this.indicator.style.pointerEvents = 'none';
            } else {
                this.indicator.style.opacity = '1';
                this.indicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ========================================
// About Section Slideshow
// ========================================
class Slideshow {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = container.querySelectorAll('.about-slide');
        this.interval = options.interval || 4000;
        this.currentIndex = 0;

        if (this.slides.length > 1) {
            this.start();
        }
    }

    start() {
        setInterval(() => this.next(), this.interval);
    }

    next() {
        this.slides[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.slides[this.currentIndex].classList.add('active');
    }
}

// ========================================
// Collapsible Skills
// ========================================
class CollapsibleSkills {
    constructor() {
        this.categoryTitles = document.querySelectorAll('.skill-category-title[data-collapsible]');
        if (this.categoryTitles.length > 0) {
            this.init();
        }
    }

    init() {
        this.categoryTitles.forEach(title => {
            title.addEventListener('click', () => this.toggle(title));
        });
    }

    toggle(title) {
        const category = title.closest('.skill-category');
        category.classList.toggle('collapsed');
    }
}

// ========================================
// Timeline Image Swap
// ========================================
class ImageSwap {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = container.querySelectorAll('.swap-slide');
        this.interval = options.interval || 5000;
        this.currentIndex = 0;

        if (this.slides.length > 1) {
            this.start();
        }
    }

    start() {
        setInterval(() => this.next(), this.interval);
    }

    next() {
        this.slides[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.slides[this.currentIndex].classList.add('active');
    }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typewriter
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        new Typewriter(typewriterElement, {
            typeSpeed: 50,
            deleteSpeed: 25,
            pauseTime: 1800
        });
    }

    // Initialize scroll reveal
    new ScrollReveal({
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });

    // Initialize navigation
    new Navigation();

    // Initialize smooth scroll
    new SmoothScroll();

    // Initialize scroll indicator
    new ScrollIndicator();

    // Initialize about slideshow
    const slideshowContainer = document.querySelector('.about-slideshow');
    if (slideshowContainer) {
        new Slideshow(slideshowContainer, { interval: 4000 });
    }

    // Initialize timeline image swap
    const swapContainers = document.querySelectorAll('.timeline-image-swap');
    swapContainers.forEach(container => {
        new ImageSwap(container, { interval: 5000 });
    });

    // Initialize collapsible skills
    new CollapsibleSkills();

    // Initialize one-time typewriter for all section titles
    document.querySelectorAll('.section .section-title').forEach(title => {
        new OneTimeTypewriter(title, { typeSpeed: 80 });
    });

    // Initialize mouse reveal lines effect (desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
        new MouseRevealLines();
    }

    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});

// ========================================
// Utility: Debounce function for performance
// ========================================
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}
// ========================================
// Optional: Parallax effect for hero background
// ========================================
class ParallaxBackground {
    constructor(element) {
        this.element = element;
        if (this.element) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            this.element.style.transform = `translateY(${rate}px)`;
        }, 10, true));
    }
}