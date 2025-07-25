// Component loader
class ComponentLoader {
    static async loadComponent(componentPath, containerId) {
        try {
            const response = await fetch(componentPath);
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
    }

    static async loadAllComponents() {
        await Promise.all([
            this.loadComponent('components/header.html', 'header-container'),
            this.loadComponent('components/footer.html', 'footer-container')
        ]);
        
        // Initialize navigation after header is loaded
        this.initializeNavigation();
    }

    static initializeNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.header');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        });

        // Active navigation link
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    static updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Load components first
    ComponentLoader.loadAllComponents();

    // Smooth scrolling
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});