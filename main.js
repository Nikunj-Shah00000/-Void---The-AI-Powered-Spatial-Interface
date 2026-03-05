// Main Application Controller
class VoidApp {
    constructor() {
        this.currentUser = null;
        this.handTracking = null;
        this.threeScene = null;
        this.ai = null;
        this.ui = null;
        
        this.init();
    }
    
    async init() {
        this.initEventListeners();
        this.initCustomCursor();
        this.initScrollEffects();
        this.initParticles();
        this.loadComponents();
    }
    
    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                this.navigateTo(target);
            });
        });
        
        // Buttons
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showModal('loginModal');
        });
        
        document.getElementById('launchBtn').addEventListener('click', () => {
            this.navigateTo('#demo');
            this.startDemo();
        });
        
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
            document.getElementById('menuToggle').classList.toggle('active');
        });
        
        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
        
        // Resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });
        
        document.addEventListener('mouseenter', () => {
            gsap.to([cursor, follower], {
                opacity: 1,
                duration: 0.3
            });
        });
        
        document.addEventListener('mouseleave', () => {
            gsap.to([cursor, follower], {
                opacity: 0,
                duration: 0.3
            });
        });
        
        // Hover effects
        document.querySelectorAll('a, button, .orb, .about-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                follower.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
    
    initScrollEffects() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('.about-card, .feature-slide, .contact-form').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1
            });
        });
        
        // Parallax effect
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 200,
            opacity: 0.5
        });
    }
    
    initParticles() {
        particlesJS('hero-canvas', {
            particles: {
                number: { value: 100 },
                color: { value: '#8b5cf6' },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#8b5cf6',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            }
        });
    }
    
    async loadComponents() {
        // Initialize Three.js scene
        this.threeScene = new ThreeScene('hero-canvas');
        this.threeScene.init();
        
        // Load hand tracking
        this.handTracking = new HandTracker();
        await this.handTracking.init();
        
        // Initialize AI
        this.ai = new AIIntegration();
        
        // Initialize UI controller
        this.ui = new UIController(this);
    }
    
    navigateTo(target) {
        const section = document.querySelector(target);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Close mobile menu
        document.querySelector('.nav-menu').classList.remove('active');
        document.getElementById('menuToggle').classList.remove('active');
    }
    
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
    
    startDemo() {
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                window.demoActive = true;
                if (this.threeScene) {
                    this.threeScene.startDemo();
                }
            }, 1000);
        }
    }
    
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    handleResize() {
        if (this.threeScene) {
            this.threeScene.handleResize();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VoidApp();
});

// Global functions
function startExperience() {
    window.app.startDemo();
}

function watchDemo() {
    // Open demo video modal or scroll to demo section
    window.app.navigateTo('#demo');
}

function closeModal(modalId) {
    window.app.closeModal(modalId);
}

function showSignup() {
    closeModal('loginModal');
    // Show signup modal
    alert('Sign up functionality coming soon!');
}

function resetScene() {
    if (window.app && window.app.threeScene) {
        window.app.threeScene.reset();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function captureSnapshot() {
    if (window.app && window.app.threeScene) {
        const dataURL = window.app.threeScene.capture();
        const link = document.createElement('a');
        link.download = 'void-snapshot.png';
        link.href = dataURL;
        link.click();
    }
}

function sendAIPrompt() {
    const input = document.getElementById('aiPrompt');
    if (input.value) {
        if (window.app && window.app.ai) {
            window.app.ai.generate(input.value);
        }
        input.value = '';
    }
}

function setPrompt(text) {
    document.getElementById('aiPrompt').value = text;
}