import './style.css'
import { translations } from './translations.js'
import ComponentLoader from './components/ComponentLoader.js'

// Portfolio JavaScript - Theme Switching and Animations
class PortfolioApp {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'aqua';
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = translations;
        this.componentLoader = new ComponentLoader();
        this.init();
    }

    async init() {
        // โหลด components ก่อน
        await this.loadComponents();
        
        this.initTheme();
        this.initLanguage();
        this.initThemeSidebar();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initScrollAnimations();
        this.initNavbarEffects();
        this.initTypingAnimation();
        this.initParticleEffects();
        this.initIntersectionObserver();
    }

    /**
     * โหลด components ทั้งหมด
     */
    async loadComponents() {
        try {
            const componentConfigs = [
                {
                    targetSelector: '#header-container',
                    componentName: 'Header',
                    filePath: '/src/components/Header.html'
                },
                {
                    targetSelector: '#hero-container',
                    componentName: 'Hero',
                    filePath: '/src/components/Hero.html'
                },
                {
                    targetSelector: '#about-container',
                    componentName: 'About',
                    filePath: '/src/components/About.html'
                },
                {
                    targetSelector: '#projects-container',
                    componentName: 'Projects',
                    filePath: '/src/components/Projects.html'
                },
                {
                    targetSelector: '#contact-container',
                    componentName: 'Contact',
                    filePath: '/src/components/Contact.html'
                },
                {
                    targetSelector: '#theme-sidebar-container',
                    componentName: 'ThemeSidebar',
                    filePath: '/src/components/ThemeSidebar.html'
                }
            ];

            await this.componentLoader.loadMultipleComponents(componentConfigs);
            console.log('🎉 All components loaded successfully!');
        } catch (error) {
            console.error('❌ Error loading components:', error);
            // ถ้าโหลด components ไม่ได้ ให้แสดง error message
            this.showComponentLoadError();
        }
    }

    /**
     * แสดง error message เมื่อโหลด components ไม่ได้
     */
    showComponentLoadError() {
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-base-100">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-error mb-4">Component Loading Error</h1>
                    <p class="text-lg text-base-content/70 mb-6">Failed to load page components. Please refresh the page.</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        <i class="fas fa-refresh mr-2"></i>
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }

    // Theme Management
    initTheme() {
        this.setTheme(this.currentTheme);
    }

    // Language Management
    initLanguage() {
        this.setLanguage(this.currentLanguage);
        this.initLanguageToggle();
    }

    getStoredLanguage() {
        return localStorage.getItem('portfolio-language');
    }

    setStoredLanguage(language) {
        localStorage.setItem('portfolio-language', language);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        this.setStoredLanguage(language);
        this.updateLanguageDisplay();
        this.translateContent();
        document.documentElement.setAttribute('lang', language === 'th' ? 'th' : 'en');
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'th' : 'en';
        this.setLanguage(newLanguage);
    }

    updateLanguageDisplay() {
        const languageDisplay = document.getElementById('current-language');
        if (languageDisplay) {
            languageDisplay.textContent = this.currentLanguage.toUpperCase();
        }
    }

    initLanguageToggle() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    translateContent() {
        const t = this.translations[this.currentLanguage];
        
        // Update navigation
        const navLinks = {
            'home': t.nav.home,
            'about': t.nav.about,
            'skills': t.nav.skills,
            'contact': t.nav.contact
        };

        Object.keys(navLinks).forEach(href => {
            const links = document.querySelectorAll(`a[href="#${href}"]`);
            links.forEach(link => {
                if (!link.closest('#theme-sidebar')) { // Skip theme sidebar links
                    link.textContent = navLinks[href];
                }
            });
        });

        // Update hero section
        this.updateElement('.hero-name', t.hero.name);
        this.updateElement('.hero-name-local', t.hero.nameLocal);
        this.updateElement('.hero-job-title', t.hero.jobTitle);
        this.updateElement('.hero-description', t.hero.description);
        this.updateElement('.hero-learn-more', t.hero.learnMore);
        this.updateElement('.hero-get-in-touch', t.hero.getInTouch);

        // Update about section
        this.updateElement('.about-title', t.about.title);
        this.updateElement('.personal-info-title', t.about.personalInfo);
        this.updateElement('.expertise-title', t.about.expertise);
        this.updateElement('.mobile-dev-title', t.about.mobileDevTitle);
        this.updateElement('.mobile-dev-desc', t.about.mobileDevDesc);
        this.updateElement('.collaboration-title', t.about.collaborationTitle);
        this.updateElement('.collaboration-desc', t.about.collaborationDesc);

        // Update skills section
        this.updateElement('.skills-title', t.skills.title);

        // Update contact section
        this.updateElement('.contact-title', t.contact.title);
        this.updateElement('.contact-description', t.contact.description);

        // Update footer
        this.updateElement('.footer-rights', t.footer.rights);

        // Update theme sidebar
        this.updateElement('.themes-title', t.themes.title);
        this.updateElement('.themes-subtitle', t.themes.subtitle);
    }

    updateElement(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.updateThemeToggle();
        this.closeThemeSidebar();
    }

    toggleTheme() {
        const themes = ['aqua', 'lofi', 'business', 'dark', 'light', 'retro', 'cyberpunk', 'valentine'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    updateThemeToggle() {
        // Update active theme in sidebar
        document.querySelectorAll('.theme-option').forEach(option => {
            const theme = option.getAttribute('data-theme');
            const checkIcon = option.querySelector('.theme-check');
            if (theme === this.currentTheme) {
                checkIcon.classList.remove('opacity-0');
                checkIcon.classList.add('opacity-100');
            } else {
                checkIcon.classList.remove('opacity-100');
                checkIcon.classList.add('opacity-0');
            }
        });
        
        // Update current theme display
        const currentDisplay = document.getElementById('current-theme-display');
        if (currentDisplay) {
            currentDisplay.textContent = this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);
        }
    }

    // Theme Sidebar
    initThemeSidebar() {
        const toggleBtn = document.getElementById('theme-sidebar-toggle');
        const bottomToggleBtn = document.getElementById('bottom-theme-sidebar-toggle');
        const quickToggleBtn = document.getElementById('quick-theme-toggle');
        const closeBtn = document.getElementById('theme-sidebar-close');
        const sidebar = document.getElementById('theme-sidebar');
        const overlay = document.getElementById('theme-sidebar-overlay');

        // Open sidebar (main button)
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.openThemeSidebar();
            });
        }

        // Open sidebar (bottom button)
        if (bottomToggleBtn) {
            bottomToggleBtn.addEventListener('click', () => {
                this.openThemeSidebar();
            });
        }

        // Quick theme cycle (bottom button)
        if (quickToggleBtn) {
            quickToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Close sidebar
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeThemeSidebar();
            });
        }

        // Close on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeThemeSidebar();
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeThemeSidebar();
            }
        });

        // Theme option click handling with event delegation
        const themeGrid = document.querySelector('#theme-sidebar .space-y-3');
        if (themeGrid) {
            themeGrid.addEventListener('click', (e) => {
                const themeOption = e.target.closest('.theme-option');
                if (themeOption) {
                    const theme = themeOption.getAttribute('data-theme');
                    if (theme) {
                        this.setTheme(theme);
                    }
                }
            });
        }
    }

    openThemeSidebar() {
        const sidebar = document.getElementById('theme-sidebar');
        const overlay = document.getElementById('theme-sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('translate-x-full');
            sidebar.classList.add('translate-x-0');
            
            overlay.classList.remove('invisible', 'opacity-0');
            overlay.classList.add('visible', 'opacity-100');
        }
    }

    closeThemeSidebar() {
        const sidebar = document.getElementById('theme-sidebar');
        const overlay = document.getElementById('theme-sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('translate-x-full');
            
            overlay.classList.remove('visible', 'opacity-100');
            overlay.classList.add('invisible', 'opacity-0');
        }
    }

    // Mobile Menu
    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = this.createMobileMenu();

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                this.toggleMenuIcon(menuToggle);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    this.resetMenuIcon(menuToggle);
                }
            });
        }
    }

    createMobileMenu() {
        const nav = document.querySelector('nav');
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'md:hidden bg-base-200 bg-opacity-95 backdrop-blur-lg hidden';
        mobileMenu.innerHTML = `
            <div class="px-6 py-4 space-y-4">
                <a href="#home" class="block hover:text-primary transition-colors">Home</a>
            <a href="#about" class="block hover:text-primary transition-colors">About</a>
            <a href="#skills" class="block hover:text-primary transition-colors">Skills</a>
            <a href="#projects" class="block hover:text-primary transition-colors">Projects</a>
            <a href="#contact" class="block hover:text-primary transition-colors">Contact</a>
            </div>
        `;
        
        nav.appendChild(mobileMenu);
        
        // Add click handlers to close menu
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                this.resetMenuIcon(document.getElementById('menu-toggle'));
            });
        });

        return mobileMenu;
    }

    toggleMenuIcon(button) {
        const icon = button.querySelector('i');
        icon.className = icon.className.includes('fa-bars') ? 'fas fa-times' : 'fas fa-bars';
    }

    resetMenuIcon(button) {
        const icon = button.querySelector('i');
        icon.className = 'fas fa-bars';
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Navbar Effects
    initNavbarEffects() {
        const nav = document.querySelector('nav');
        let lastScrollY = window.scrollY;
        let isNavbarVisible = true;

        // Create hover area at top of screen
        const hoverArea = document.createElement('div');
        hoverArea.className = 'fixed top-0 left-0 w-full h-20 z-40';
        hoverArea.style.pointerEvents = 'none';
        document.body.appendChild(hoverArea);

        // Show navbar on hover at top of screen
        const showNavbar = () => {
            nav.style.transform = 'translateY(0)';
            isNavbarVisible = true;
        };

        const hideNavbar = () => {
            if (window.scrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
                isNavbarVisible = false;
            }
        };

        // Mouse events for top area
        document.addEventListener('mousemove', (e) => {
            if (e.clientY <= 80 && window.scrollY > 200 && !isNavbarVisible) {
                showNavbar();
            } else if (e.clientY > 120 && window.scrollY > 200 && isNavbarVisible) {
                hideNavbar();
            }
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Background opacity
            if (currentScrollY > 100) {
                nav.classList.add('bg-opacity-95');
            } else {
                nav.classList.remove('bg-opacity-95');
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                hideNavbar();
            } else if (currentScrollY < lastScrollY || currentScrollY <= 200) {
                showNavbar();
            }

            lastScrollY = currentScrollY;
        });

        // Keep navbar visible when hovering over it
        nav.addEventListener('mouseenter', showNavbar);
        
        // Hide after leaving navbar (with delay)
        nav.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (window.scrollY > 200) {
                    hideNavbar();
                }
            }, 1000);
        });
    }

    // Typing Animation
    initTypingAnimation() {
        const nameElement = document.querySelector('.animate-typing');
        if (nameElement) {
            // Reset animation on theme change
            const observer = new MutationObserver(() => {
                nameElement.style.animation = 'none';
                nameElement.offsetHeight; // Trigger reflow
                nameElement.style.animation = null;
            });
            
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme']
            });
        }
    }

    // Particle Effects
    initParticleEffects() {
        const heroSection = document.getElementById('home');
        if (heroSection) {
            this.createFloatingParticles(heroSection);
        }
    }

    createFloatingParticles(container) {
        // Remove existing particles
        container.querySelectorAll('.floating-particle').forEach(p => p.remove());

        // Create new particles
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = `floating-particle particle-${i + 1}`;
            container.appendChild(particle);
        }
    }

    // Scroll Animations
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-fade-in-up');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
    }

    // Intersection Observer
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 1s ease-out';
                }
            });
        }, observerOptions);

        // Observe fade-in elements
        document.querySelectorAll('.animate-fade-in-up').forEach(el => {
            observer.observe(el);
        });

        // Observe skill cards for hover effects
        document.querySelectorAll('.skill-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
    
    // Add loading indicator
    document.body.classList.add('loaded');
});

// Handle theme changes from system preferences
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        if (!localStorage.getItem('portfolio-theme')) {
            const newTheme = mediaQuery.matches ? 'lofi' : 'aqua';
            window.portfolioApp?.setTheme(newTheme);
        }
    });
}