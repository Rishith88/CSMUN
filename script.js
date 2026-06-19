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

// ---- ElevenLabs Configuration ----
// Get your free API key at https://elevenlabs.io
const ELEVEN_LABS_API_KEY = '5a4f2fcc23f20b3299558feff81c6d0537c784fb2bba7e95a23dc8f8d34cfc35'; // <-- Paste your API key here
const ELEVEN_VOICE_ID = 'ODq5zmih8GrVes37Dizd'; // Patrick — deep, cinematic male voice

// ---- Cinematic Music + Voice (ElevenLabs) ----
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// Synthesized cinematic drone/sting
let musicNodes = [];
function stopCinematicMusic() {
    musicNodes.forEach(n => { try { n.stop(); } catch (_) {} });
    musicNodes = [];
}

function playCinematicIntro() {
    try {
        const ctx = getAudioCtx();
        const t = ctx.currentTime;

        // Low orchestral pad
        const padGain = ctx.createGain();
        padGain.gain.setValueAtTime(0, t);
        padGain.gain.linearRampToValueAtTime(0.06, t + 1.5);
        padGain.gain.linearRampToValueAtTime(0.04, t + 6);
        padGain.gain.linearRampToValueAtTime(0.001, t + 13);
        padGain.connect(ctx.destination);

        [55, 65, 82, 110].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq + i * 0.5, t);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, t);
            filter.frequency.linearRampToValueAtTime(800, t + 4);
            osc.connect(filter);
            filter.connect(gain);
            gain.gain.setValueAtTime(0.15 - i * 0.03, t);
            gain.connect(padGain);
            osc.start(t);
            osc.stop(t + 14);
            musicNodes.push(osc);
        });

        // Cinematic rise
        const riseOsc = ctx.createOscillator();
        const riseGain = ctx.createGain();
        riseOsc.type = 'sine';
        riseOsc.frequency.setValueAtTime(80, t + 1);
        riseOsc.frequency.exponentialRampToValueAtTime(1200, t + 3.5);
        riseGain.gain.setValueAtTime(0, t + 1);
        riseGain.gain.linearRampToValueAtTime(0.08, t + 2.5);
        riseGain.gain.linearRampToValueAtTime(0, t + 4);
        riseOsc.connect(riseGain);
        riseGain.connect(ctx.destination);
        riseOsc.start(t + 1);
        riseOsc.stop(t + 4);
        musicNodes.push(riseOsc);

        // Deep timpani hit
        const timpOsc = ctx.createOscillator();
        const timpGain = ctx.createGain();
        timpOsc.type = 'triangle';
        timpOsc.frequency.setValueAtTime(60, t + 3.5);
        timpOsc.frequency.exponentialRampToValueAtTime(25, t + 4.5);
        timpGain.gain.setValueAtTime(0.2, t + 3.5);
        timpGain.gain.exponentialRampToValueAtTime(0.001, t + 5);
        timpOsc.connect(timpGain);
        timpGain.connect(ctx.destination);
        timpOsc.start(t + 3.5);
        timpOsc.stop(t + 5);
        musicNodes.push(timpOsc);
    } catch (_) {}
}

// Pre-fetch ElevenLabs audio early so it's ready when needed
let prefetchedVoice = null;
function prefetchVoice(text) {
    return new Promise(resolve => {
        if (!ELEVEN_LABS_API_KEY) { resolve(null); return; }
        fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVEN_LABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                voice_settings: { stability: 0.4, similarity_boost: 0.85 }
            })
        })
        .then(res => { if (!res.ok) throw new Error(`API error: ${res.status}`); return res.blob(); })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.addEventListener('ended', () => URL.revokeObjectURL(url));
            prefetchedVoice = audio;
            resolve(audio);
        })
        .catch(e => {
            console.warn('ElevenLabs prefetch failed:', e);
            prefetchedVoice = null;
            resolve(null);
        });
    });
}

function playPrefetchedVoice() {
    if (prefetchedVoice) {
        prefetchedVoice.play();
    } else {
        fallbackSpeak("Welcome to CSMUN. Here we debate with passion, confidence and utmost diplomacy. We believe in Deliberare, Decernere, Perficere which translates to Deliberate, Decide, Deliver.");
    }
}

// Fallback: Web Speech API
function fallbackSpeak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.65; u.pitch = 0.25; u.volume = 1; u.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const deep = voices.find(v => v.name.includes('Daniel') || v.name.includes('James') || v.name.includes('Google UK') || v.name.includes('Male'));
    if (deep) u.voice = deep;
    window.speechSynthesis.speak(u);
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
        return;
    }
    
// Pre-load voices for fallback
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Start cinematic music and pre-fetch voice
    playCinematicIntro();
    prefetchVoice("Welcome to CSMUN. Here we debate with passion, confidence and utmost diplomacy. We believe in Deliberare, Decernere, Perficere which translates to Deliberate, Decide, Deliver.");
    
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
    
    // Phase 3: Divider and welcome message + voice
    setTimeout(() => {
        if (divider) divider.classList.add('expand');
    }, 3400);
    
    setTimeout(() => {
        if (welcome) welcome.classList.add('show');
        playPrefetchedVoice();
    }, 3800);
    
    // Phase 4: Enter prompt
    setTimeout(() => {
        if (enter) enter.classList.add('show');
    }, 7000);
    
    // Click/tap to dismiss
    const dismiss = () => {
        stopCinematicMusic();
        if (prefetchedVoice) { prefetchedVoice.pause(); prefetchedVoice = null; }
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
    
    // Auto-dismiss
    setTimeout(dismiss, 14000);
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

// ---- Custom Cursor ----
(function() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function smoothRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(smoothRing);
    }
    smoothRing();

    document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .btn-download, .btn-matrix-dl, .committee-card, nav a').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));
})();

// ---- Replace broken team photos with "Coming Soon" placeholder ----
const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231a1a2e' rx='12'/%3E%3Ccircle cx='100' cy='80' r='35' fill='none' stroke='%23facc15' stroke-width='2' opacity='0.4'/%3E%3Cpath d='M55 165 Q100 115 145 165' fill='none' stroke='%23facc15' stroke-width='2' opacity='0.4'/%3E%3Ctext x='100' y='155' text-anchor='middle' font-family='Inter,sans-serif' font-size='11' font-weight='700' fill='%23facc15'%3ECOMING%3C/text%3E%3Ctext x='100' y='170' text-anchor='middle' font-family='Inter,sans-serif' font-size='11' font-weight='700' fill='%23facc15'%3ESOON%3C/text%3E%3C/svg%3E";
(function() {
    const imgs = document.querySelectorAll('.secretariat-card img, .eb-card img');
    if (imgs.length > 0) {
        imgs.forEach(img => { img.src = placeholderSvg; });
    }
})();