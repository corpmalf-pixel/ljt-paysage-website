// ===================================
// LJT PAYSAGE - INTERACTIONS
// ===================================

(function() {
    'use strict';

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and expertise items
    const animatedElements = document.querySelectorAll(
        '.service-card, .expertise-item, .narrative-section'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // ===================================
    // SCROLL HEADER EFFECT
    // ===================================

    let lastScrollY = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });

    // ===================================
    // SMOOTH SCROLL LINKS
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // CONTACT FORM HANDLING
    // ===================================

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Veuillez remplir tous les champs.', 'error');
                return;
            }

            // Email regex validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Show success message (in production, this would send data to a backend)
            showNotification(
                'Merci ! Nous avons reçu votre demande. Nous vous contacterons très bientôt.',
                'success'
            );

            // Reset form
            contactForm.reset();
        });
    }

    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            animation: 'slideUpNotif 0.3s ease-out',
            maxWidth: '400px'
        });

        if (type === 'success') {
            notification.style.backgroundColor = '#2d5a3d';
            notification.style.color = '#ffffff';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#c84c4c';
            notification.style.color = '#ffffff';
        } else {
            notification.style.backgroundColor = '#f0f0f0';
            notification.style.color = '#2c2c2c';
        }

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================

    document.addEventListener('keydown', function(e) {
        // Skip to main content on focus
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            document.querySelector('main, section').focus();
        }
    });

    // ===================================
    // PERFORMANCE MONITORING
    // ===================================

    if ('PerformanceObserver' in window) {
        try {
            // Monitor Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitor Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // Monitor Interaction to Next Paint
            const inpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('INP:', entry.processingDuration);
                }
            });
            inpObserver.observe({ entryTypes: ['event'] });
        } catch (e) {
            console.log('Performance monitoring not available');
        }
    }

    // ===================================
    // ADD ANIMATION KEYFRAMES
    // ===================================

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUpNotif {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // ACCESSIBILITY - FOCUS VISIBLE
    // ===================================

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // ===================================
    // LAZY LOADING IMAGE SUPPORT
    // ===================================

    if ('IntersectionObserver' in window && 'loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }

    // ===================================
    // SERVICE WORKER REGISTRATION (PWA)
    // ===================================

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js')
                .then(function(registration) {
                    console.log('Service Worker registered successfully:', registration);
                })
                .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }

    console.log('LJT Paysage - Site initialized');
})();
