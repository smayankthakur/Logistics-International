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
// 3D SCENE INTERACTION (Hero Truck Section)
// ==========================================
function init3DScene() {
    // The hero section now uses a static truck image instead of 3D scene
    // This function kept for potential future 3D elements
    const truckContainer = document.querySelector('.truck-container');
    if (!truckContainer) return;
    
    // Add subtle parallax effect to truck on mouse move
    truckContainer.addEventListener('mousemove', function(e) {
        const rect = truckContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const truckWrapper = truckContainer.querySelector('.truck-wrapper');
        if (truckWrapper) {
            truckWrapper.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        }
    });
    
    truckContainer.addEventListener('mouseleave', function() {
        const truckWrapper = truckContainer.querySelector('.truck-wrapper');
        if (truckWrapper) {
            truckWrapper.style.transform = '';
        }
    });
}

// ==========================================
// CURSOR GLOW EFFECT
// ==========================================
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;
    
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
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
    
    // Initialize image animations (reveal on scroll)
    initImageReveal();
    
    // Initialize image parallax on images
    initImageParallax();
    
    // Initialize hero particles
    initHeroParticles();
    
    // Initialize image cluster parallax
    initImageClusterParallax();
    
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
    
    // Initialize scroll progress
    initScrollProgress();
    
    // Initialize CTA interactions
    initCTAInteractions();
});

// ==========================================
// IMAGE REVEAL ON SCROLL
// ==========================================
function initImageReveal() {
    const images = document.querySelectorAll('.premium-image, .reveal-on-scroll, .image-container');
    
    if (images.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    images.forEach(img => observer.observe(img));
}

// ==========================================
// SCROLL PROGRESS INDICATOR
// ==========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ==========================================
// CTA INTERACTIONS (RIPPLE + FEEDBACK)
// ==========================================
function initCTAInteractions() {
    const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: rippleEffect 0.6s ease-out forwards;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple keyframes if not exists
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: translate(-50%, -50%) scale(20);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// IMAGE PARALLAX ON MOUSE MOVE
// ==========================================
function initImageParallax() {
    const containers = document.querySelectorAll('.parallax-image, .premium-image, .image-container');
    
    if (containers.length === 0) return;
    
    containers.forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const moveX = x * 15;
            const moveY = y * 15;
            
            const img = container.querySelector('img');
            if (img) {
                img.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;
            }
        });
        
        container.addEventListener('mouseleave', () => {
            const img = container.querySelector('img');
            if (img) {
                img.style.transform = 'translate3d(0, 0, 0) scale(1)';
            }
        });
    });
}

// ==========================================
// IMAGE CLUSTER PARALLAX
// ==========================================
function initImageClusterParallax() {
    const cluster = document.getElementById('image-cluster');
    if (!cluster) return;
    
    const layers = cluster.querySelectorAll('.image-layer');
    const cards = cluster.querySelectorAll('.image-card');
    
    cluster.addEventListener('mousemove', (e) => {
        const rect = cluster.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Move each layer at different speeds
        layers.forEach((layer, index) => {
            const speed = (index + 1) * 8;
            const moveX = x * speed;
            const moveY = y * speed;
            
            if (layer.classList.contains('layer-back')) {
                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, -30px) scale(1.1)`;
            } else if (layer.classList.contains('layer-mid')) {
                layer.style.transform = `translate3d(${moveX * 1.5}px, ${moveY * 1.5}px, 0) scale(1)`;
            } else if (layer.classList.contains('layer-front')) {
                layer.style.transform = `translate3d(${moveX * 2}px, ${moveY * 2}px, 30px) scale(0.95)`;
            }
        });
        
        // Move individual cards slightly
        cards.forEach((card, index) => {
            const speed = (index + 1) * 5;
            const cardX = x * speed;
            const cardY = y * speed;
            card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0)`;
        });
    });
    
    cluster.addEventListener('mouseleave', () => {
        layers.forEach((layer, index) => {
            if (layer.classList.contains('layer-back')) {
                layer.style.transform = 'translate3d(0, 0, -30px) scale(1.1)';
            } else if (layer.classList.contains('layer-mid')) {
                layer.style.transform = 'translate3d(0, 0, 0) scale(1)';
            } else if (layer.classList.contains('layer-front')) {
                layer.style.transform = 'translate3d(0, 0, 30px) scale(0.95)';
            }
        });
        
        cards.forEach(card => {
            card.style.transform = 'translate3d(0, 0, 0)';
        });
    });
}
    
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
    
    // Initialize hero particles (separate canvas for hero)
    initHeroParticles();
    
    // Initialize parallax effect
    initParallax();
});

// ==========================================
// HERO PARTICLES (Lightweight for Hero)
// ==========================================
function initHeroParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 50;
    
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(133, 165, 149, ${p.alpha})`;
            ctx.fill();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(63, 100, 116, ${opacity})`;
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
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// ==========================================
// PARALLAX EFFECT
// ==========================================
function initParallax() {
    const hero = document.getElementById('hero-parallax');
    if (!hero) return;
    
    const textEl = hero.querySelector('.parallax-text');
    const imagesEl = hero.querySelector('.parallax-images');
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        targetX = x * 30;
        targetY = y * 20;
    });
    
    hero.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });
    
    function animate() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        
        if (textEl) {
            textEl.style.transform = `translate3d(${currentX * 0.5}px, ${currentY * 0.5}px, 0)`;
        }
        
        if (imagesEl) {
            imagesEl.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// 3D LOGISTICS SCENE (Three.js)
// ==========================================
function init3DScene() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') {
        console.log('Three.js not loaded, using fallback');
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    camera.position.z = 5;
    
    // Colors
    const colorPrimary = new THREE.Color(0x3f6474);
    const colorSecondary = new THREE.Color(0x85a595);
    const colorAccent = new THREE.Color(0x22a564);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Point lights
    const light1 = new THREE.PointLight(colorPrimary, 1, 100);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(colorSecondary, 0.8, 100);
    light2.position.set(-5, -5, 5);
    scene.add(light2);
    
    // Create network sphere
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    
    // Wireframe sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: colorPrimary,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereGroup.add(sphere);
    
    // Inner glow sphere
    const innerGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: colorAccent,
        transparent: true,
        opacity: 0.1
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    sphereGroup.add(innerSphere);
    
    // Network nodes
    const nodes = [];
    const nodePositions = [
        { x: 2, y: 0.5, z: 0.5 },
        { x: -1.5, y: 1.5, z: 0.8 },
        { x: 1, y: -1.5, z: 1 },
        { x: -0.5, y: 2, z: -0.5 },
        { x: 1.8, y: -0.8, z: -0.8 },
        { x: -2, y: -1, z: 0.3 },
        { x: 0.5, y: 1.2, z: 1.5 },
        { x: -1, y: -0.5, z: -1.2 }
    ];
    
    nodePositions.forEach((pos, i) => {
        const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? colorAccent : colorSecondary,
            transparent: true,
            opacity: 0.8
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(pos.x, pos.y, pos.z);
        sphereGroup.add(node);
        nodes.push({ mesh: node, originalPos: { ...pos }, phase: Math.random() * Math.PI * 2 });
    });
    
    // Connection lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: colorSecondary,
        transparent: true,
        opacity: 0.2
    });
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const points = [];
            points.push(new THREE.Vector3(nodes[i].originalPos.x, nodes[i].originalPos.y, nodes[i].originalPos.z));
            points.push(new THREE.Vector3(nodes[j].originalPos.x, nodes[j].originalPos.y, nodes[j].originalPos.z));
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            sphereGroup.add(line);
        }
    }
    
    // Animated flight paths (arcs)
    const arcs = [];
    const arcPositions = [
        { start: 0, end: 1 },
        { start: 2, end: 3 },
        { start: 4, end: 5 },
        { start: 6, end: 7 }
    ];
    
    arcPositions.forEach(arc => {
        const startNode = nodes[arc.start];
        const endNode = nodes[arc.end];
        
        const midX = (startNode.originalPos.x + endNode.originalPos.x) / 2;
        const midY = (startNode.originalPos.y + endNode.originalPos.y) / 2 + 0.5;
        const midZ = (startNode.originalPos.z + endNode.originalPos.z) / 2;
        
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(startNode.originalPos.x, startNode.originalPos.y, startNode.originalPos.z),
            new THREE.Vector3(midX, midY, midZ),
            new THREE.Vector3(endNode.originalPos.x, endNode.originalPos.y, endNode.originalPos.z)
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: colorAccent,
            transparent: true,
            opacity: 0.4
        });
        const line = new THREE.Line(geometry, material);
        sphereGroup.add(line);
        
        // Animated dot along arc
        const dotGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: colorAccent });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        sphereGroup.add(dot);
        
        arcs.push({ curve, dot, phase: Math.random() * Math.PI * 2 });
    });
    
    // Floating cargo containers
    const containerGroup = new THREE.Group();
    scene.add(containerGroup);
    
    const containerPositions = [
        { x: 3.5, y: 0.5, z: 0 },
        { x: -3.5, y: -0.5, z: 0.5 },
        { x: 3, y: 1.5, z: -1 },
        { x: -3, y: 1, z: -0.5 }
    ];
    
    containerPositions.forEach((pos, i) => {
        const boxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? colorPrimary : colorSecondary,
            transparent: true,
            opacity: 0.6
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(pos.x, pos.y, pos.z);
        containerGroup.add(box);
    });
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Rotate sphere slowly
        sphereGroup.rotation.y += 0.002;
        sphereGroup.rotation.x = Math.sin(time * 0.3) * 0.1;
        
        // Mouse interaction
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;
        
        sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.05;
        sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.05;
        
        // Animate nodes (floating effect)
        nodes.forEach(node => {
            node.mesh.position.y = node.originalPos.y + Math.sin(time * 2 + node.phase) * 0.1;
            node.mesh.position.x = node.originalPos.x + Math.cos(time * 1.5 + node.phase) * 0.05;
        });
        
        // Animate arc dots
        arcs.forEach(arc => {
            const t = (time * 0.5 + arc.phase) % 1;
            const point = arc.curve.getPoint(t);
            arc.dot.position.copy(point);
        });
        
        // Animate containers
        containerGroup.children.forEach((box, i) => {
            box.position.y += Math.sin(time * 2 + i) * 0.003;
            box.rotation.y += 0.002;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}