// ============================================================
// CSMUN 2026 - Optimized Interactions (Performance Edition)
// ============================================================

// ---- Voice / Audio Effects (lazy, pooled) ----
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// Play a short gavel-like "voice" effect (throttled, no per-hover spam)
let lastVoiceTime = 0;
function playVoiceEffect() {
    const now = Date.now();
    if (now - lastVoiceTime < 400) return; // throttle: max 2.5/sec
    lastVoiceTime = now;
    try {
        const ctx = getAudioCtx();
        const t = ctx.currentTime;
        
        // Low percussive thump (like a gavel strike)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
    } catch (_) {}
}

function playClickChime() {
    try {
        const ctx = getAudioCtx();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, t);
        osc.frequency.exponentialRampToValueAtTime(990, t + 0.04);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
    } catch (_) {}
}

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
        document.querySelector('.glass-card').innerHTML = "<h2 style='color: var(--gold);'>🎉 The CS MUN 4.0 2026 IS LIVE! 🎉</h2>";
        playClickChime();
        return;
    }

    document.getElementById("days").textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
    document.getElementById("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
    document.getElementById("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
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
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            startIntro();
        }, 2200);
    }
});

// ---- Voice Narration (Web Speech API) ----
function speak(text, delay = 0) {
    setTimeout(() => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.75;
        utterance.pitch = 0.5;
        utterance.volume = 1;
        utterance.lang = 'en-US';
        const voices = window.speechSynthesis.getVoices();
        const deep = voices.find(v => v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('James') || v.name.includes('Google UK'));
        if (deep) utterance.voice = deep;
        window.speechSynthesis.speak(utterance);
    }, delay);
}

// ---- Dramatic Intro Sequence ----
function startIntro() {
    const overlay = document.getElementById('introOverlay');
    if (!overlay) return;
    if (sessionStorage.getItem('csmunIntroShown')) {
        overlay.style.display = 'none';
        return;
    }
    
    // Pre-load voices
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    
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
    
    // Phase 1: Line draws
    setTimeout(() => { if (line) line.classList.add('expand'); }, 400);
    
    // Phase 2: Words appear one by one with 3D flip + voice
    words.forEach((word, i) => {
        setTimeout(() => {
            word.classList.add('revealed');
            // Speak the Latin word
            speak(word.textContent, 100);
            // Particle burst effect
            for (let j = 0; j < 8; j++) {
                const burst = document.createElement('div');
                const bx = (Math.random() - 0.5) * 80;
                const by = (Math.random() - 0.5) * 80;
                burst.style.cssText = `
                    position: absolute; width: 4px; height: 4px;
                    background: var(--gold); border-radius: 50%;
                    pointer-events: none; z-index: 10;
                    --bx: ${bx}px; --by: ${by}px;
                    left: ${50 + (Math.random() - 0.5) * 20}%;
                    top: ${50 + (Math.random() - 0.5) * 20}%;
                    animation: introParticleBurst 0.8s ease forwards;
                `;
                overlay.querySelector('.intro-content').appendChild(burst);
                setTimeout(() => burst.remove(), 800);
            }
        }, 1000 + i * 800);
    });
    
    // Phase 3: Divider and welcome message + voice
    setTimeout(() => {
        if (divider) divider.classList.add('expand');
    }, 3400);
    
    setTimeout(() => {
        if (welcome) welcome.classList.add('show');
        speak("Welcome to CSMUN 2026. Where passion meets diplomacy. Where voices shape tomorrow.", 500);
    }, 3800);
    
    // Speak the motto
    setTimeout(() => {
        speak("Deliberate. Decide. Deliver.", 300);
    }, 5500);
    
    // Phase 4: Enter prompt
    setTimeout(() => {
        if (enter) enter.classList.add('show');
    }, 5000);
    
    // Click/tap to dismiss
    const dismiss = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        overlay.classList.add('fade-out');
        document.body.style.overflow = '';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
        sessionStorage.setItem('csmunIntroShown', 'true');
    };
    
    overlay.addEventListener('click', dismiss);
    if (enter) enter.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
    
    // Auto-dismiss after 8 seconds
    setTimeout(dismiss, 8000);
}

// Inject intro burst keyframe
if (!document.getElementById('burstStyle')) {
    const s = document.createElement('style');
    s.id = 'burstStyle';
    s.textContent = `
        @keyframes introParticleBurst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--bx, 50px), var(--by, -50px)) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(s);
}