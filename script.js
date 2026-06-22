
console.log('%c🇺🇳 CSMUN 2026 | Deliberate. Decide. Deliver.', 'font-size:24px;font-weight:bold;color:#facc15;');
console.log('%cBuilt with ❤️ by Sailesh, Jaswanth, Vedansh and Rishith', 'font-size:14px;color:#99a1af;');
console.log('%c🐛 Found something broken? Congrats — you\'re now QA. Fix it or tweet at us.', 'font-size:12px;color:#6b7280;font-style:italic;');




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

// ===========================================
// GOATED INTERACTIVE ANIMATIONS — CSMUN 2026
// ===========================================

// ---- 1. Mouse Glow Aura Tracking ----
const mouseGlow = document.getElementById('mouseGlow');
const mouseGlowRing = document.getElementById('mouseGlowRing');

if (mouseGlow && !isMobile) {
    const updateMouseGlow = rafThrottle((e) => {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
        if (mouseGlowRing) {
            mouseGlowRing.style.left = e.clientX + 'px';
            mouseGlowRing.style.top = e.clientY + 'px';
        }
    });
    document.addEventListener('mousemove', updateMouseGlow);
    document.addEventListener('mouseenter', () => mouseGlow.classList.remove('hidden'));
    document.addEventListener('mouseleave', () => mouseGlow.classList.add('hidden'));
}

// ---- 2. Ambient Particle Generator ----
function spawnAmbientParticles() {
    const container = document.getElementById('ambientParticles');
    if (!container) return;
    
    const count = isMobile ? 15 : 30;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'ambient-particle' + (Math.random() > 0.8 ? ' glow' : '');
        p.style.setProperty('--p-x', Math.random() * 100 + '%');
        p.style.setProperty('--p-size', (Math.random() * 4 + 2) + 'px');
        p.style.setProperty('--p-duration', (Math.random() * 10 + 8) + 's');
        p.style.setProperty('--p-delay', (Math.random() * 12) + 's');
        p.style.setProperty('--p-opacity', (Math.random() * 0.5 + 0.3));
        p.style.setProperty('--p-drift', (Math.random() - 0.5) * 100 + 'px');
        p.style.left = Math.random() * 100 + '%';
        container.appendChild(p);
    }
}
spawnAmbientParticles();

// ---- 3. Magnetic Button Effect (preserves CSS hover transforms) ----
document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        if (isMobile) return;
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        // Preserve the CSS hover transform (-3px lift + scale) then add magnetic offset
        this.style.transform = `translate(${x}px, ${y}px) translateY(-3px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = ''; // CSS hover takes over naturally
    });
});

// ---- 4. Click Particle Burst ----
function createClickParticles(x, y) {
    const colors = ['#facc15', '#ffe066', '#e6b800', '#ffd700', '#fff4b8'];
    const count = isMobile ? 8 : 20;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        const size = Math.random() * 6 + 3;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.setProperty('--x-dir', Math.random());
        p.style.setProperty('--y-dir', Math.random());
        p.style.boxShadow = '0 0 6px ' + colors[0] + ', 0 0 12px rgba(250,204,21,0.3)';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .btn-primary, .btn-secondary, .btn-download, .faq-question, .intro-enter, nav a, .back-to-top')) return;
    createClickParticles(e.clientX, e.clientY);
});

// ---- 5. Hero Title Character Animation ----
function animateHeroTitle() {
    const title = document.querySelector('.hero-title .line1');
    if (!title || title.dataset.animated) return;
    title.dataset.animated = 'true';
    const text = title.textContent;
    title.textContent = '';
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = (0.3 + i * 0.06) + 's';
        title.appendChild(span);
    });
}

// Run hero title animation after preloader
setTimeout(animateHeroTitle, 2500);

// ---- 6. Countdown Flip Animation ----
let prevCountdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
const origUpdate = updateCountdown;
updateCountdown = function() {
    const now = Date.now();
    const distance = countdownDate - now;
    if (distance <= 0) {
        const gc = document.querySelector('.glass-card');
        if (gc) gc.innerHTML = "<h2 style='color: var(--gold);'>🎉 The CS MUN 4.0 2026 IS LIVE! 🎉</h2>";
        return;
    }
    const val = (t) => String(Math.floor(t)).padStart(2, '0');
    const days = val(distance / 86400000);
    const hours = val((distance % 86400000) / 3600000);
    const minutes = val((distance % 3600000) / 60000);
    const seconds = val((distance % 60000) / 1000);
    
    const ids = { days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds' };
    Object.entries(ids).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const newVal = { days, hours, minutes, seconds }[key];
        if (prevCountdown[key] !== newVal && prevCountdown[key] !== '00') {
            el.classList.remove('flip');
            void el.offsetWidth;
            el.classList.add('flip');
        }
        el.textContent = newVal;
        prevCountdown[key] = newVal;
    });
};

// ---- 7. 3D Tilt Cards ----
document.querySelectorAll('.committee-card, .glass-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        if (isMobile) return;
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        // Preserve existing hover lift transform + add tilt
        this.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = ''; // CSS hover takes over
    });
});

// ---- 8. Observer for new reveal classes ----
const newRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            newRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal-clip, .reveal-clip-left, .reveal-clip-right, .reveal-dramatic').forEach(el => {
    newRevealObserver.observe(el);
});

// ---- 9. Letterbox bars animation on scroll ----
const letterbox = document.getElementById('letterboxBars');
if (letterbox) {
    let lbTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(lbTimer);
        if (window.scrollY < 100) {
            letterbox.classList.add('active');
        } else {
            letterbox.classList.remove('active');
        }
    }, { passive: true });
    // Activate briefly on page load
    setTimeout(() => letterbox.classList.add('active'), 500);
    setTimeout(() => letterbox.classList.remove('active'), 3000);
}

console.log('%c✨ GOATED animations activated — CSMUN 2026 is CINEMATIC ✨', 'font-size:16px;font-weight:bold;color:#facc15;');

