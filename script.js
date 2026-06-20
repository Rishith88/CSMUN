/* ==========================================================
   CSMUN 2026 — built with ❤️ by Rishith & the CSMUN team.
   If you're reading this, you're cool. Now go debate.
   ========================================================== */
console.log('%c🇺🇳 CSMUN 2026 | Deliberate. Decide. Deliver.', 'font-size:24px;font-weight:bold;color:#facc15;');
console.log('%cBuilt with ❤️ by Rishith & the CSMUN tech squad', 'font-size:14px;color:#99a1af;');
console.log('%c🐛 Found something broken? Congrats — you\'re now QA. Fix it or tweet at us.', 'font-size:12px;color:#6b7280;font-style:italic;');

// ============================================================
// CSMUN 2026 - Optimized Interactions (Performance Edition)
// ============================================================

// ---- Debounce helper ----
function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// ---- Throttle with requestAnimationFrame ----
function rafThrottle(fn) {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                fn(...args);
                ticking = false;
            });
        }
    };
}

// ---- Navbar Scroll Effect (combined with progress + back-to-top) ----
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const heroContent = document.querySelector('.hero-content');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const handleScroll = rafThrottle(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);
    
    // Progress bar
    if (progressBar) {
        progressBar.style.width = ((scrollY / docHeight) * 100) + '%';
    }
    
    // Back to top button
    if (backToTop) {
        backToTop.classList.toggle('show', scrollY > 300);
    }
    
    // Active nav link
    let current = '';
    for (const section of sections) {
        if (scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    }
    for (const link of navLinks) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    }
});

window.addEventListener('scroll', handleScroll, { passive: true });

// ---- Nav Link Fixes ----
// Prevent nav links to the current page from reloading, scroll to top instead
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPage) {
        link.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Countdown Timer with voice on expiry ----
const countdownDate = new Date("Jul 2, 2026 09:00:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = countdownDate - now;

    if (distance <= 0) {
        const gc = document.querySelector('.glass-card');
        if (gc) gc.innerHTML = "<h2 style='color: var(--gold);'>🎉 The CS MUN 4.0 2026 IS LIVE! 🎉</h2>";
        playClickChime();
        return;
    }

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    daysEl.textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
    hoursEl.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    minutesEl.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    secondsEl.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Typewriter Effect for Hero Tagline ----
let typewriterRunning = false;
function initTypewriter() {
    if (typewriterRunning) return;
    typewriterRunning = true;
    const lines = document.querySelectorAll('.typewriter-line');
    const cursor = document.querySelector('.typewriter-cursor');
    if (!lines.length) return;
    
    let lineIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    
    function typeLine() {
        if (lineIndex >= lines.length) {
            if (cursor) cursor.classList.add('idle');
            return;
        }
        
        const line = lines[lineIndex];
        const text = line.getAttribute('data-text');
        
        if (!isTyping) {
            isTyping = true;
            line.classList.add('visible');
        }
        
        if (charIndex < text.length) {
            line.textContent = text.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeLine, 40 + Math.random() * 30);
        } else {
            isTyping = false;
            charIndex = 0;
            lineIndex++;
            setTimeout(typeLine, 500);
        }
    }
    
    setTimeout(typeLine, 1600);
}

// ---- Scroll Reveal Animations (Intersection Observer) ----
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

for (const el of revealElements) revealObserver.observe(el);

// Cards staggered reveal
document.querySelectorAll('.committee-card, .itinerary-card, .secretariat-card, .eb-card, .policy-card').forEach((card, i) => {
    card.classList.add('reveal');
    if (i < 5) card.classList.add('reveal-delay-' + (i + 1));
    revealObserver.observe(card);
});

// ---- Animated Stats Counter ----
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1500;
    const start = performance.now();
    
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.stat-number');
            for (const n of nums) animateCounter(n);
            statObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statObserver.observe(statsSection);

// ---- Back to Top Click + chime ----
if (backToTop) {
    backToTop.addEventListener('click', () => {
        playClickChime();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- FAQ Accordion + subtle chime ----
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        playClickChime();
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(a => a.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ---- Button Ripple Effect + Voice ----
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download, .btn-matrix-dl, nav a').forEach(el => {
    el.addEventListener('click', () => playVoiceEffect());
});

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:rippleAnim 0.6s ease-out;pointer-events:none;width:100px;height:100px;left:${e.clientX - rect.left - 50}px;top:${e.clientY - rect.top - 50}px;`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Inject ripple keyframe if not exists
if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim {to{transform:scale(3);opacity:0}}';
    document.head.appendChild(style);
}

// ---- Preloader ----
const preloader = document.getElementById('preloader');
if (preloader) {
    function hidePreloader() {
        if (preloader.classList.contains('hidden')) return;
        preloader.classList.add('hidden');
        setTimeout(() => { preloader.style.display = 'none'; }, 700);
        if (document.getElementById('introOverlay')) startIntro();
    }
    setTimeout(hidePreloader, 2200);
    window.addEventListener('load', hidePreloader);
}

// ---- Dramatic Intro Sequence ----
function startIntro() {
    const overlay = document.getElementById('introOverlay');
    if (!overlay) return;
    if (sessionStorage.getItem('csmunIntroShown')) {
        overlay.style.display = 'none';
        initTypewriter();
        return;
    }
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    
    // Create particles
    const pc = overlay.querySelector('.intro-particles');
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'intro-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 8 + 6) + 's';
        p.style.animationDelay = (Math.random() * 5) + 's';
        p.style.opacity = Math.random() * 0.4;
        pc.appendChild(p);
    }
    
    const words = overlay.querySelectorAll('.intro-word');
    const welcome = overlay.querySelector('.intro-welcome');
    const enter = overlay.querySelector('.intro-enter');
    const line = overlay.querySelector('.intro-line');
    const divider = overlay.querySelector('.intro-divider');
    const slides = overlay.querySelectorAll('.intro-slide');
    
    // Slideshow: cycle through committee photos
    let slideIndex = 0;
    const cycleSlides = () => {
        slides.forEach(s => s.classList.remove('active'));
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
    };
    if (slides.length > 1) {
        slides[0].classList.add('active');
        setInterval(cycleSlides, 2800);
    }
    
    // Phase 1: Line draws
    setTimeout(() => { if (line) line.classList.add('expand'); }, 400);
    
    // Phase 2: Words appear one by one
    words.forEach((word, i) => {
        setTimeout(() => {
            word.classList.add('revealed');
        }, 1000 + i * 800);
    });
    
    // Phase 3: Divider and welcome message
    setTimeout(() => {
        if (divider) divider.classList.add('expand');
    }, 3400);
    
    setTimeout(() => {
        if (welcome) welcome.classList.add('show');
    }, 3800);
    
    // Phase 4: Enter prompt
    setTimeout(() => {
        if (enter) enter.classList.add('show');
    }, 7000);
    
    // Click/tap to dismiss
    const dismiss = () => {
        overlay.classList.add('fade-out');
        document.body.style.overflow = '';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
        sessionStorage.setItem('csmunIntroShown', 'true');
    };
    
    overlay.addEventListener('click', () => { dismiss(); initTypewriter(); });
    if (enter) enter.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); setTimeout(initTypewriter, 600); });
    
    // Auto-dismiss
    setTimeout(() => {
        dismiss();
        initTypewriter();
    }, 14000);
}

// ---- Easter egg: click "Guide to MUN" title 3 times ----
let eggClicks = 0;
const eggTitle = document.getElementById('easterEgg');
if (eggTitle) {
    eggTitle.style.cursor = 'pointer';
    eggTitle.addEventListener('click', () => {
        eggClicks++;
        if (eggClicks === 3) {
            eggClicks = 0;
            const msgs = [
                '🕊️ "Diplomacy is the art of letting someone else have your way." — Lester B. Pearson',
                '🌍 "The UN wasn\'t built to bring us to heaven, but to save us from hell." — Dag Hammarskjöld',
                '🎤 "In MUN, you don\'t just speak — you represent. That changes how you say things."'
            ];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            const el = document.createElement('div');
            el.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.95);color:var(--gold, #facc15);padding:1rem 2rem;border-radius:1rem;border:1px solid rgba(250,204,21,0.3);z-index:99999;font-size:1rem;max-width:600px;text-align:center;font-family:'Inter',sans-serif;box-shadow:0 0 40px rgba(250,204,21,0.2);animation:fadeInUp 0.5s ease;`;
            el.textContent = msg;
            document.body.appendChild(el);
            setTimeout(() => { el.style.transition = 'opacity 0.5s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 4000);
        }
    });
}

// ---- Replace broken team photos with "Coming Soon" placeholder ----
const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231a1a2e' rx='12'/%3E%3Ccircle cx='100' cy='80' r='35' fill='none' stroke='%23facc15' stroke-width='2' opacity='0.4'/%3E%3Cpath d='M55 165 Q100 115 145 165' fill='none' stroke='%23facc15' stroke-width='2' opacity='0.4'/%3E%3Ctext x='100' y='155' text-anchor='middle' font-family='Inter,sans-serif' font-size='11' font-weight='700' fill='%23facc15'%3ECOMING%3C/text%3E%3Ctext x='100' y='170' text-anchor='middle' font-family='Inter,sans-serif' font-size='11' font-weight='700' fill='%23facc15'%3ESOON%3C/text%3E%3C/svg%3E";
(function() {
    const imgs = document.querySelectorAll('.secretariat-card img, .eb-card img');
    if (imgs.length > 0) {
        imgs.forEach(img => { img.src = placeholderSvg; });
    }
})();

// Mouse-tracking 3D Parallax
let currentMouseX = 0, currentMouseY = 0;

function update3DParallax() {
    if (isMobile) return;
    
    const normalizedX = (currentMouseX / window.innerWidth - 0.5) * 2;
    const normalizedY = (currentMouseY / window.innerHeight - 0.5) * 2;
    
    const skylineLayers = document.querySelectorAll('.skyline-layer');
    skylineLayers.forEach((layer, index) => {
        const depth = index === 0 ? -50 : index === 1 ? -20 : 0;
        const rotateY = normalizedX * (depth / 5);
        const rotateX = -normalizedY * (depth / 5);
        layer.style.transform = `translateZ(${depth}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    
    const depthLayers = document.querySelectorAll('.depth-layer');
    depthLayers.forEach(layer => {
        if (layer.classList.contains('layer-near')) {
            layer.style.transform = `translateX(${normalizedX * 30}px) translateY(${normalizedY * 30}px) translateZ(100px)`;
        } else if (layer.classList.contains('layer-mid')) {
            layer.style.transform = `translateX(${normalizedX * 15}px) translateY(${normalizedY * 15}px)`;
        } else if (layer.classList.contains('layer-far')) {
            layer.style.transform = `translateX(${normalizedX * 7}px) translateY(${normalizedY * 7}px) translateZ(-100px)`;
        }
    });
}

// Initialize 3D globe with grid lines
function init3DGlobe() {
    const globe = document.getElementById('webgl-globe');
    if (globe) {
        const container = globe.parentElement;
        // Add grid lines to globe
        for (let i = 0; i < 5; i++) {
            const gridline = document.createElement('div');
            gridline.className = 'globe-gridline';
            container.appendChild(gridline);
        }
    }
}

// Initialize 3D card interactions
function init3DCardInteractions() {
    const cards = document.querySelectorAll('.committee-card');
    
    cards.forEach(card => {
        if (!isMobile) {
            card.addEventListener('mouseenter', (e) => {
                card.style.transform = 'scale(1.03)';
            });
            card.addEventListener('mouseleave', (e) => {
                card.style.transform = 'scale(1)';
            });
        }
        
        if (isMobile) {
            card.addEventListener('touchstart', (e) => {
                card.style.transform = 'scale(1.03)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 300);
            }, { passive: true });
        }
    });
}

// Scroll-triggered depth effects
function initScrollDepth() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const depthLayers = document.querySelectorAll('.depth-layer');
        
        depthLayers.forEach(layer => {
            if (layer.classList.contains('layer-far')) {
                layer.style.transform = `translateY(${scrollY * 0.1}px) translateZ(-100px)`;
            } else if (layer.classList.contains('layer-mid')) {
                layer.style.transform = `translateY(${scrollY * 0.3}px)`;
            } else if (layer.classList.contains('layer-near')) {
                layer.style.transform = `translateY(${scrollY * 0.5}px) translateZ(100px)`;
            }
        });
    });
}

// Integrate with your existing mousemove tracking
const originalMouseMove = (e) => {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
    update3DParallax();
};
document.addEventListener('mousemove', originalMouseMove);

// Initialize all 3D features when page is ready
document.addEventListener('DOMContentLoaded', () => {
    init3DGlobe();
    init3DCardInteractions();
    initScrollDepth();
});

// ===========================================
// CINEMATIC ANIMATION TRIGGERS & INTERACTIVITY
// ===========================================

// Intersection Observer for scroll-triggered animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active', 'animate-in');
            
            // Stagger committee cards when they come into view
            const cards = entry.target.querySelectorAll('.committee-card');
            cards.forEach((card, index) => {
                card.classList.add(`stagger-${(index % 6) + 1}`);
            });
        }
    });
}, { threshold: 0.15, rootMargin: '-50px' });

// Observe all reveal sections and committee cards
document.querySelectorAll('.reveal, .committee-card').forEach(el => {
    animationObserver.observe(el);
});

// Page transition system for smooth scrolling (no longer intercepts anchor links)
function initPageTransitions() {
    // Add transition overlay to body (kept for potential future use)
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
}

// Countdown number flip animation trigger
function initCountdownAnimation() {
    const countdownNumbers = document.querySelectorAll('.countdown-item span');
    setInterval(() => {
        countdownNumbers.forEach(num => {
            num.style.animation = 'none';
            num.offsetHeight; // Trigger reflow
            num.style.animation = 'number-flip 0.8s ease';
        });
    }, 60000); // Flip every minute
}

// Hero text wave character animation
function initHeroTextAnimation() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            return `<span style="animation-delay: ${i * 0.05}s">${char}</span>`;
        }).join('');
    }
}

// 3D image tilt effect on mouse move for all image containers
function init3DImageTilt() {
    document.querySelectorAll('.image-3d-container').forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            const img = container.querySelector('img');
            if (img) {
                img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
            }
        });
        
        container.addEventListener('mouseleave', () => {
            const img = container.querySelector('img');
            if (img) {
                img.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
            }
        });
    });
}

// Mobile detection utility
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768 
           || navigator.maxTouchPoints > 0;
}

const isMobile = isMobileDevice();

// Ambient particle generator optimized for mobile
function initAmbientParticles() {
}

// Initialize all cinematic animations
document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    initCountdownAnimation();
    initHeroTextAnimation();
    init3DImageTilt();
    initAmbientParticles();
    
    // Trigger initial animations after page loads
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('active');
            }, index * 200);
        });
    }, 2000);
});