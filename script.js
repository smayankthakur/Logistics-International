/* ============================================
   LOGISTICS INTERNATIONAL - SCRIPTS
   Premium Modern Logistics Website
   ============================================ */

// ==========================================
// PARTICLE NETWORK ANIMATION SYSTEM
// ==========================================
class ParticleNetwork {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 60,
            connectionDistance: options.connectionDistance || 120,
            mouseConnectionDistance: options.mouseConnectionDistance || 200,
            particleColor: options.particleColor || 'rgba(63, 100, 116, 0.6)',
            lineColor: options.lineColor || 'rgba(133, 165, 149, 0.15)',
            mouseLineColor: options.mouseLineColor || 'rgba(13, 148, 136, 0.3)',
            particleSpeed: options.particleSpeed || 0.3,
            showMouseConnections: options.showMouseConnections !== false,
            ...options
        };
        
        this.isRunning = false;
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.start();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                radius: Math.random() * 2 + 1,
                baseX: Math.random() * this.canvas.width,
                baseY: Math.random() * this.canvas.height
            });
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 200);
        });
        
        this.canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.parentElement.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    update() {
        // Update particle positions
        this.particles.forEach(p => {
            // Add some organic movement
            p.x += p.vx + Math.sin(Date.now() * 0.001 + p.baseX) * 0.2;
            p.y += p.vy + Math.cos(Date.now() * 0.001 + p.baseY) * 0.2;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // Keep within bounds
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections between particles
        this.drawParticleConnections();
        
        // Draw connections to mouse
        if (this.config.showMouseConnections && this.mouse.x !== null) {
            this.drawMouseConnections();
        }
        
        // Draw particles
        this.drawParticles();
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.fill();
        });
    }
    
    drawParticleConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(133, 165, 149, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawMouseConnections() {
        this.particles.forEach(p => {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseConnectionDistance) {
                const opacity = 1 - (distance / this.config.mouseConnectionDistance);
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(13, 148, 136, ${opacity * 0.5})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resize);
    }
}

// ==========================================
// NAVBAR BEHAVIOR
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// ==========================================
// 3D SCENE INTERACTION
// ==========================================
function init3DScene() {
    const heroSection = document.getElementById('hero-section');
    const sceneInner = document.getElementById('scene-inner');
    
    if (!heroSection || !sceneInner) return;
    
    heroSection.addEventListener('mousemove', function(e) {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const rotateX = y * 15;
        const rotateY = x * 15;
        
        sceneInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        sceneInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;
    
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX - 200 + 'px';
        cursorGlow.style.top = e.clientY - 200 + 'px';
    });
}

// ==========================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
        observer.observe(el);
    });
}

// ==========================================
// TESTIMONIAL SLIDER
// ==========================================
function initTestimonialSlider() {
    const container = document.getElementById('testimonial-container');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!container || slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        
        container.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        
        dots.forEach(function(dot, i) {
            if (i === currentSlide) {
                dot.classList.remove('bg-slate-300');
                dot.style.backgroundColor = '#22a564';
            } else {
                dot.classList.remove('bg-[#22a564]');
                dot.classList.add('bg-slate-300');
                dot.style.backgroundColor = '';
            }
        });
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            stopAutoSlide();
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
            startAutoSlide();
        });
    });
    
    startAutoSlide();
}

// ==========================================
// TRACKING FUNCTIONALITY
// ==========================================
function initTracking() {
    const trackBtn = document.getElementById('track-btn');
    const trackingInput = document.getElementById('tracking-input');
    const trackingResult = document.getElementById('tracking-result');
    const trackingId = document.getElementById('tracking-id');
    
    if (!trackBtn || !trackingInput || !trackingResult) return;
    
    trackBtn.addEventListener('click', function() {
        const id = trackingInput.value.trim();
        if (id) {
            if (trackingId) trackingId.textContent = id;
            trackingResult.classList.remove('hidden');
            trackingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert('Please enter a tracking ID');
        }
    });
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.classList.add('bg-green-500');
        btn.classList.remove('from-[#22a564]', 'to-[#22a564]');
        
        setTimeout(function() {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-500');
            btn.classList.add('from-[#22a564]', 'to-[#22a564]');
            form.reset();
        }, 3000);
    });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// ==========================================
// SERVICE CARDS ENTRANCE ANIMATION
// ==========================================
function initServiceCardsAnimation() {
    setTimeout(function() {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(function() {
                card.style.transition = 'all 0.6s ease-out';
                card.style.transitionDelay = (index * 0.1) + 's';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 500);
}

// ==========================================
// CLIENT LOGOS LOADER
// ==========================================
function initClientLogos() {
    const container = document.getElementById('client-logos');
    if (!container) return;
    
    // Client logo files - dynamically loaded
    const clientLogos = [
        'google.jpg',
        'ibm.jpg',
        'nokia.jpg',
        'toyota.jpg',
        'honda.jpg',
        'nike.jpg',
        'puma.jpg',
        'mobil.jpg',
        'Attero.jpg'
    ];
    
    // Create wrapper for animation
    const track = document.createElement('div');
    track.className = 'client-logos-track';
    
    // Add first set of logos
    clientLogos.forEach(function(logo) {
        const div = document.createElement('div');
        div.className = 'client-logo-item';
        div.innerHTML = `<img src="client/${logo}" alt="Client Logo" loading="lazy">`;
        track.appendChild(div);
    });
    
    // Duplicate for infinite scroll
    clientLogos.forEach(function(logo) {
        const div = document.createElement('div');
        div.className = 'client-logo-item';
        div.innerHTML = `<img src="client/${logo}" alt="Client Logo" loading="lazy">`;
        track.appendChild(div);
    });
    
    container.appendChild(track);
}

// ==========================================
// LOADING SCREEN
// ==========================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    setTimeout(function() {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen first
    initLoadingScreen();
    
    // Initialize navbar
    initNavbar();
    
    // Initialize cursor glow
    initCursorGlow();
    
    // Initialize 3D scene
    init3DScene();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize tracking
    initTracking();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize service cards animation
    initServiceCardsAnimation();
    
    // Initialize client logos
    initClientLogos();
    
    // Initialize particle network animation
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        // Check if mobile - reduce particles for performance
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 30 : 60;
        
        new ParticleNetwork('particle-canvas', {
            particleCount: particleCount,
            connectionDistance: isMobile ? 100 : 120,
            particleColor: isMobile ? 'rgba(63, 100, 116, 0.4)' : 'rgba(63, 100, 116, 0.6)',
            showMouseConnections: !isMobile
        });
    }
});