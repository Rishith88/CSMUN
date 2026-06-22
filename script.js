
console.log('%c🇺🇳 CSMUN 2026 | Deliberate. Decide. Deliver.', 'font-size:24px;font-weight:bold;color:#facc15;');
console.log('%cBuilt with ❤️ by Sailesh, Jaswanth, Vedansh and Rishith', 'font-size:14px;color:#99a1af;');
console.log('%c🐛 Found something broken? Congrats — you\'re now QA. Fix it or tweet at us.', 'font-size:12px;color:#6b7280;font-style:italic;');




// ---- 3D TILT CARDS ----
document.querySelectorAll('.committee-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    });
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    });
});

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
    
    // Navbar: show after scrolling past the hero section, hide when at top
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        navbar.classList.toggle('visible', scrollY > heroBottom - 80);
    } else {
        // No hero section on this page (e.g. guide, team, resources) — show navbar immediately
        navbar.classList.add('visible');
    }
    
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
handleScroll(); // Initialize navbar state on page load

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

// ---- Hamburger Menu Toggle ----
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    function toggleMenu(forceClose = false) {
        const isOpen = navMenu.classList.contains('open');
        if (forceClose && !isOpen) return;
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    // Close menu on outside click / tap backdrop
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            toggleMenu(true);
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu(true);
        }
    });
}

// ---- Back to Top Click + chime ----
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- FAQ Accordion + subtle chime ----
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(a => a.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ---- Button Ripple Effect ----
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
        setTimeout(initTypewriter, 800);
    }
    setTimeout(hidePreloader, 2200);
    window.addEventListener('load', hidePreloader);
}



// ---- Registration Form Handler ----
const registrationForm = document.getElementById('registrationForm');
const formStatus = document.getElementById('form-status');

if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('fullName');
        
        // Simulate form submission
        formStatus.style.color = 'var(--gold)';
        formStatus.textContent = 'Submitting...';
        
        setTimeout(() => {
            formStatus.style.color = '#22c55e'; // A nice green
            formStatus.innerHTML = `Thank you, ${name}! Your registration has been received. We will be in touch shortly.`;
            this.reset();
        }, 1500);
    });
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
// =============================================
// 3D ENHANCED FEATURES (Friend's Additions)
// =============================================



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

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
 || window.innerWidth <= 768;

// ---- CURSOR TRAIL EFFECT ----
if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 600);
    });
}

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
}
if (!isMobile) {
 document.addEventListener('mousemove', (e) => {
 currentMouseX = e.clientX;
 currentMouseY = e.clientY;
 requestAnimationFrame(update3DParallax);
 });
}


// ==================== HORIZONTAL SCROLLING ROADMAP ==================== 

const roadmapSection = document.querySelector('.committees-roadmap-section');
const roadmapWrapper = document.getElementById('roadmapWrapper');
const roadmapTrack = document.getElementById('roadmapTrack');
const roadmapCards = document.querySelectorAll('.roadmap-card');
const roadmapProgress = document.getElementById('roadmapProgress');
const scrollHint = document.getElementById('scrollHint');

if (roadmapSection && roadmapTrack && roadmapCards.length > 0) {
 const totalCards = roadmapCards.length;
 
 function updateRoadmap() {
 const sectionTop = roadmapSection.offsetTop;
 const sectionHeight = roadmapSection.offsetHeight;
 const scrollY = window.scrollY;
 
 // Calculate scroll progress through the section
 const scrollProgress = (scrollY - sectionTop) / sectionHeight;
 const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
 
 // Update progress bar
 if (roadmapProgress) {
 roadmapProgress.style.width = (clampedProgress * 100) + '%';
 }
 
 // Hide scroll hint after first scroll
 if (scrollHint && clampedProgress > 0.05) {
 scrollHint.classList.add('hidden');
 }
 
 // Calculate which card should be active
 const activeIndex = Math.floor(clampedProgress * totalCards);
 const clampedIndex = Math.min(activeIndex, totalCards - 1);
 
 // Horizontal scroll distance with HAIRPIN BENDS
 // Cards 0-2 move left, card 3 turns back right, cards 4-5 move left again
 let translateX = 0;
 
 if (clampedIndex === 0) {
 translateX = 0;
 } else if (clampedIndex === 1) {
 translateX = -100; // Move left
 } else if (clampedIndex === 2) {
 translateX = -200; // Continue left
 } else if (clampedIndex === 3) {
 translateX = -150; // HAIRPIN BEND - move back right
 } else if (clampedIndex === 4) {
 translateX = -250; // Move left again
 } else if (clampedIndex === 5) {
 translateX = -350; // Final position
 }
 
 roadmapTrack.style.transform = `translateX(${translateX}vw)`;
 
 // Set active card
 roadmapCards.forEach((card, index) => {
 if (index === clampedIndex) {
 card.classList.add('active');
 } else {
 card.classList.remove('active');
 }
 });
 }
 
 // Throttled scroll handler
 const handleRoadmapScroll = rafThrottle(updateRoadmap);
 window.addEventListener('scroll', handleRoadmapScroll, { passive: true });
 
 // Initialize on load
 updateRoadmap();
}

function initCommitteeRoad() {
    const container = document.getElementById('committeesRoad');
    const svg = document.getElementById('roadSvg');
    const path = document.getElementById('roadPath');
    if (!container || !svg || !path) return;
    const cards = container.querySelectorAll('.road-card');
    if (!cards.length) return;

    let pathLength = 0;

    function buildPath() {
        const containerRect = container.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const W = containerRect.width;
        const H = container.offsetHeight;

        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

        // Add gradient and glow defs
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.innerHTML = `
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stop-color="#ffe066" stop-opacity="1"/>
                    <stop offset="40%"  stop-color="#facc15" stop-opacity="1"/>
                    <stop offset="100%" stop-color="#e6b800" stop-opacity="0.7"/>
                </linearGradient>
                <filter id="roadGlow">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            `;
            svg.insertBefore(defs, svg.firstChild);
        }

        // Add a blurred glow path behind the main path
        let glowPath = svg.querySelector('#roadGlow-path');
        if (!glowPath) {
            glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            glowPath.setAttribute('id', 'roadGlow-path');
            glowPath.setAttribute('fill', 'none');
            glowPath.setAttribute('stroke', '#facc15');
            glowPath.setAttribute('stroke-width', '10');
            glowPath.setAttribute('stroke-linecap', 'round');
            glowPath.setAttribute('opacity', '0.25');
            glowPath.setAttribute('filter', 'url(#roadGlow)');
            svg.insertBefore(glowPath, path);
        }

        const points = [];
        cards.forEach(card => {
            const r = card.getBoundingClientRect();
            const x = (r.left + window.scrollX) - (containerRect.left + window.scrollX) + r.width / 2;
            const y = (r.top + window.scrollY) - containerTop + r.height / 2;
            points.push({ x, y });
        });

        // Build a smooth S-curve path with big sweeping bends between each card
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const dy = p1.y - p0.y;
            // Control points: pull strongly outward toward the opposite side for a wide S
            const cp1x = p0.x;
            const cp1y = p0.y + dy * 0.45;
            const cp2x = p1.x;
            const cp2y = p1.y - dy * 0.45;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }

        path.setAttribute('d', d);
        path.setAttribute('stroke', 'url(#roadGradient)');
        path.setAttribute('filter', 'url(#roadGlow)');
        glowPath.setAttribute('d', d);

        pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        glowPath.style.strokeDasharray = pathLength;
        glowPath.style.strokeDashoffset = pathLength;
    }

    function updateOnScroll() {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const scrolled = vh - rect.top;
        let progress = scrolled / total;
        progress = Math.max(0, Math.min(1, progress));
        const offset = pathLength * (1 - progress);
        path.style.strokeDashoffset = offset;
        const glowPath = document.getElementById('roadGlow-path');
        if (glowPath) glowPath.style.strokeDashoffset = offset;
    }

    buildPath();
    updateOnScroll();

 window.addEventListener('resize', debounce(() => { buildPath(); updateOnScroll(); }, 200));
    window.addEventListener('scroll', rafThrottle(updateOnScroll), { passive: true });
}

window.addEventListener('load', () => setTimeout(initCommitteeRoad, 300));