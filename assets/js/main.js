// Main JavaScript file
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.handleLoading();
        this.initScrollAnimations();
        this.initTypeWriter();
        this.initContactForm();
        this.initParticles();
        this.initSkillAnimations();
    }

    // Loading screen
    handleLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1500);
        });
    }

    // Scroll animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animateElements = document.querySelectorAll('.info-card, .goal-card, .skill-category, .project-card, .contact-item, .timeline-item');
        
        animateElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });

        // Counter animation for stats
        this.initCounterAnimation();
    }

    // Counter animation
    initCounterAnimation() {
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // Typewriter effect
    initTypeWriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' 
                            ? '2px solid var(--primary-color)' 
                            : 'none';
                    }, 500);
                }
            }, 100);
        });
    }

    // Contact form
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');

                // Simple validation
                if (!name || !email || !message) {
                    this.showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
                    return;
                }

                // Simulate form submission
                this.showNotification('Đang gửi tin nhắn...', 'info');
                
                setTimeout(() => {
                    this.showNotification('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.', 'success');
                    contactForm.reset();
                }, 2000);
            });

            // Form field animations
            const formFields = contactForm.querySelectorAll('input, textarea');
            formFields.forEach(field => {
                field.addEventListener('focus', () => {
                    field.parentElement.classList.add('focused');
                });

                field.addEventListener('blur', () => {
                    if (!field.value) {
                        field.parentElement.classList.remove('focused');
                    }
                });
            });
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            max-width: 300px;
        `;

        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #00d4ff, #4ecdc4)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Particle background
    initParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#00d4ff';
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Skill animations
    initSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(0, 212, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = item.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                
                item.style.position = 'relative';
                item.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Cursor trail effect
    initCursorTrail() {
        const trail = [];
        const trailLength = 10;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY });
            
            if (trail.length > trailLength) {
                trail.shift();
            }
            
            this.updateTrail();
        });
        
        // Create trail elements
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / trailLength};
                transform: scale(${1 - i / trailLength});
                transition: all 0.1s ease;
            `;
            document.body.appendChild(dot);
        }
    }
    
    updateTrail() {
        const dots = document.querySelectorAll('.cursor-trail');
        trail.forEach((point, index) => {
            if (dots[index]) {
                dots[index].style.left = point.x + 'px';
                dots[index].style.top = point.y + 'px';
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some utility functions
const utils = {
    // Debounce function
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
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Navigation functions for header
window.navigateToHome = function(section = '') {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        window.location.href = '../index.html' + section;
    } else {
        if (section) {
            document.querySelector(section)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

window.navigateToAbout = function() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/about.html')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPath.includes('/pages/')) {
        window.location.href = 'about.html';
    } else {
        window.location.href = 'pages/about.html';
    }
};

window.navigateToProjects = function() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/projects.html')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPath.includes('/pages/')) {
        window.location.href = 'projects.html';
    } else {
        window.location.href = 'pages/projects.html';
    }
};

// Export for use in other files
window.PortfolioUtils = utils;