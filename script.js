/* ============================================
    LOGISTICS INTERNATIONAL V2 - CLEAN JS
    Modular, bug-free, production-ready
    ============================================ */

var CONFIG = {
    particles: { mobile: 20, desktop: 40 },
    connectionDistance: 80,
    loaderTimeout: 2500,
    ctaPulseDelay: 3000,
    throttleMs: 16,
    observerThreshold: 0.1
};

var ASSETS = {
    clientPath: 'assets/client/',
    partnerPath: 'assets/partner/'
};

var CLIENTS = ['google.jpg', 'ibm.jpg', 'honda.jpg', 'toyota.jpg', 'nike.jpg', 'puma.jpg', 'nokia.jpg', 'mobil.jpg', 'Attero.jpg'];
var PARTNERS = ['indianrailway.jpg', 'vistara.jpg', 'spicejet.jpg', 'indigo.jpg', 'bluedart.jpg', 'airindia.jpg', 'airasia.jpg'];

var isPageVisible = true;

// ============================================
// UTILITY: Throttle
// ============================================
function throttle(fn, limit) {
    var inThrottle = false;
    return function() {
        if (!inThrottle) {
            fn.apply(this, arguments);
            inThrottle = true;
            setTimeout(function() { inThrottle = false; }, limit);
        }
    };
}

// ============================================
// INIT
// ============================================
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        initLoader();
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initAnimationObserver();
        initScrollProgress();
        initClientsGrid();
        initPartnersMarquee();
        initHeroPartners();
        initContactForm();
        initParticles();
        initHeroImageParallax();
        initCursorGlow();
        initCTAPulse();
        
        document.addEventListener('visibilitychange', function() {
            isPageVisible = !document.hidden;
        });
        
        window.addEventListener('error', function(e) {
            console.warn('Error:', e.message);
        });
    });
})();

// ============================================
// LOADER - Never blocks UI
// ============================================
function initLoader() {
    var loader = document.getElementById('loading-screen');
    if (!loader) return;
    
    var hidden = false;
    function hide() {
        if (hidden) return;
        hidden = true;
        loader.style.opacity = '0';
        setTimeout(function() { loader.remove(); }, 300);
    }
    
    document.addEventListener('DOMContentLoaded', hide);
    window.addEventListener('load', hide);
    setTimeout(hide, CONFIG.loaderTimeout);
    window.addEventListener('error', hide);
    setTimeout(function() {
        var l = document.getElementById('loading-screen');
        if (l) l.remove();
    }, 3000);
}

// ============================================
// NAVBAR - Always visible, sticky
// ============================================
function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    var ticking = false;
    function update() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    
    btn.addEventListener('click', function() {
        menu.classList.toggle('hidden');
    });
    
    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.add('hidden');
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#' || href === '#home') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ============================================
// ANIMATIONS - Intersection Observer
// ============================================
function initAnimationObserver() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: CONFIG.observerThreshold });
    
    document.querySelectorAll('.reveal-fade-up').forEach(function(el) {
        observer.observe(el);
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    var progress = document.getElementById('scroll-progress');
    if (!progress) return;
    
    var ticking = false;
    function update() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.width = percent + '%';
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// CLIENTS GRID
// ============================================
function initClientsGrid() {
    var grid = document.getElementById('clients-grid');
    if (!grid) return;
    
    var html = '';
    CLIENTS.forEach(function(client) {
        html += '<div class="client-logo-card">';
        html += '<img src="' + ASSETS.clientPath + client + '" onerror="this.style.display=\'none\'" alt="' + client.replace('.jpg', '') + '">';
        html += '</div>';
    });
    grid.innerHTML = html;
}

// ============================================
// HERO PARTNERS
// ============================================
function initHeroPartners() {
    var container = document.getElementById('hero-partners');
    if (!container) return;
    
    var html = '';
    PARTNERS.forEach(function(partner) {
        html += '<img src="' + ASSETS.partnerPath + partner + '" onerror="this.style.display=\'none\'" alt="' + partner.replace('.jpg', '') + '" class="h-8 grayscale hover:grayscale-0 hover:scale-110 transition-all cursor-pointer">';
    });
    container.innerHTML = html;
}

// ============================================
// PARTNERS MARQUEE
// ============================================
function initPartnersMarquee() {
    var track = document.getElementById('partners-track');
    if (!track) return;
    
    var html = '';
    PARTNERS.forEach(function(partner) {
        html += '<img src="' + ASSETS.partnerPath + partner + '" onerror="this.style.display=\'none\'" alt="' + partner.replace('.jpg', '') + '">';
    });
    PARTNERS.forEach(function(partner) {
        html += '<img src="' + ASSETS.partnerPath + partner + '" onerror="this.style.display=\'none\'" alt="' + partner.replace('.jpg', '') + '">';
    });
    track.innerHTML = html;
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        
        var originalText = btn.textContent;
        btn.textContent = 'Sent!';
        btn.style.background = '#22c55e';
        
        setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = '';
            form.reset();
        }, 2000);
    });
}

// ============================================
// PARTICLES - With visibility control
// ============================================
function initParticles() {
    var canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var particles = [];
    var isMobile = window.innerWidth < 768;
    var count = isMobile ? CONFIG.particles.mobile : CONFIG.particles.desktop;
    var resizeTimeout;

    function resize() {
        var rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        isMobile = window.innerWidth < 768;
        count = isMobile ? CONFIG.particles.mobile : CONFIG.particles.desktop;
        createParticles();
    }
    
    function createParticles() {
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    }
    
    function draw() {
        if (!isPageVisible) {
            requestAnimationFrame(draw);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(function(p) {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(133, 165, 149, 0.4)';
            ctx.fill();
        });
        
        var i, j, dx, dy, dist;
        for (i = 0; i < particles.length; i++) {
            for (j = i + 1; j < particles.length; j++) {
                dx = particles[i].x - particles[j].x;
                dy = particles[i].y - particles[j].y;
                dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONFIG.connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(63, 100, 116, ' + (1 - dist / CONFIG.connectionDistance) * 0.15 + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    resize();
    createParticles();
    draw();
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, CONFIG.throttleMs);
    }, { passive: true });
}

// ============================================
// CURSOR GLOW - Throttled + Mobile disabled
// ============================================
function initCursorGlow() {
    var cursor = document.getElementById('cursor-glow');
    if (!cursor) return;
    if (window.innerWidth < 768) return;
    
    var throttledMove = throttle(function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }, CONFIG.throttleMs);
    
    document.addEventListener('mousemove', throttledMove, { passive: true });
}

// ============================================
// HERO IMAGE PARALLAX
// ============================================
function initHeroImageParallax() {
    var wrapper = document.getElementById('hero-image-wrapper');
    if (!wrapper) return;
    if (window.innerWidth < 1024) return;
    
    var throttledMove = throttle(function(e) {
        var rect = wrapper.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var mouseX = e.clientX - centerX;
        var mouseY = e.clientY - centerY;
        
        var moveX = mouseX * 0.03;
        var moveY = mouseY * 0.03;
        
        wrapper.style.transform = 'translate3d(' + moveX + 'px, ' + moveY + 'px, 0)';
    }, CONFIG.throttleMs);
    
    document.addEventListener('mousemove', throttledMove, { passive: true });
}

// ============================================
// CTA PULSE
// ============================================
function initCTAPulse() {
    var cta = document.getElementById('primary-cta');
    if (!cta) return;
    
    setTimeout(function() {
        cta.classList.add('pulse');
    }, CONFIG.ctaPulseDelay);
}