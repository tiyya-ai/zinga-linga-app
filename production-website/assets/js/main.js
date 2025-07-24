// Main JavaScript for Zinga Linga Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeForms();
    initializeModals();
    initializeLoadingStates();
    initializeAccessibility();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Active navigation highlighting
    window.addEventListener('scroll', highlightActiveSection);
}

// Highlight active navigation section
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
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

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations and scroll effects
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .module-card, .contact-method');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animate-in class
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-letter');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Form handling
function initializeForms() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Purchase form
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchaseForm);
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }

    // Form validation
    initializeFormValidation();
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateContactForm(data)) {
        return;
    }

    // Show loading
    showLoading();
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading();
        showSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
        e.target.reset();
    }, 2000);
}

// Handle purchase form submission
function handlePurchaseForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validatePurchaseForm(data)) {
        return;
    }

    // Show loading
    showLoading();
    
    // Simulate processing
    setTimeout(() => {
        hideLoading();
        closePurchaseModal();
        showSuccessMessage('Thank you for your interest! We\'ll send you payment instructions via email.');
    }, 2000);
}

// Handle newsletter form submission
function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!validateEmail(email)) {
        showErrorMessage('Please enter a valid email address.');
        return;
    }

    // Show loading
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    // Simulate subscription
    setTimeout(() => {
        button.textContent = 'Subscribed!';
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            e.target.reset();
        }, 2000);
    }, 1000);
}

// Form validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    clearFieldError(field);
    
    if (required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    if (type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function validateContactForm(data) {
    let isValid = true;
    
    if (!data.name) {
        showErrorMessage('Please enter your name.');
        isValid = false;
    }
    
    if (!data.email || !validateEmail(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        isValid = false;
    }
    
    if (!data.subject) {
        showErrorMessage('Please select a subject.');
        isValid = false;
    }
    
    if (!data.message) {
        showErrorMessage('Please enter your message.');
        isValid = false;
    }
    
    return isValid;
}

function validatePurchaseForm(data) {
    let isValid = true;
    
    if (!data['parent-name']) {
        showErrorMessage('Please enter the parent/guardian name.');
        isValid = false;
    }
    
    if (!data['parent-email'] || !validateEmail(data['parent-email'])) {
        showErrorMessage('Please enter a valid email address.');
        isValid = false;
    }
    
    if (!data['child-name']) {
        showErrorMessage('Please enter the child\'s name.');
        isValid = false;
    }
    
    if (!data['child-age']) {
        showErrorMessage('Please select the child\'s age.');
        isValid = false;
    }
    
    if (!document.getElementById('terms-agree').checked) {
        showErrorMessage('Please agree to the Terms of Service and Privacy Policy.');
        isValid = false;
    }
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Modal functionality
function initializeModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closePurchaseModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePurchaseModal();
        }
    });
}

// Show purchase modal
function showPurchaseModal(moduleType) {
    const modal = document.getElementById('purchase-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    let content = '';
    
    switch (moduleType) {
        case 'kiki':
            modalTitle.textContent = 'Get Kiki\'s African Animal Alphabet';
            content = `
                <div class="module-preview">
                    <img src="./assets/images/kiki.png" alt="Kiki" style="width: 100px; height: 100px; object-fit: contain;">
                    <h4>Kiki's African Animal Alphabet</h4>
                    <p>Perfect for ages 1-3 years</p>
                    <div class="price-display">
                        <span class="price">$11.00</span>
                        <span class="price-note">One-time purchase • Lifetime access</span>
                    </div>
                </div>
            `;
            break;
        case 'tano':
            modalTitle.textContent = 'Get Tano\'s Jungle Songs';
            content = `
                <div class="module-preview">
                    <img src="./assets/images/tano.png" alt="Tano" style="width: 100px; height: 100px; object-fit: contain;">
                    <h4>Tano's Jungle Songs</h4>
                    <p>Perfect for ages 2-6 years</p>
                    <div class="price-display">
                        <span class="price">$6.99</span>
                        <span class="price-note">One-time purchase • Lifetime access</span>
                    </div>
                </div>
            `;
            break;
        case 'bundle':
            modalTitle.textContent = 'Get Complete Adventure Bundle';
            content = `
                <div class="module-preview">
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                        <img src="./assets/images/kiki.png" alt="Kiki" style="width: 80px; height: 80px; object-fit: contain;">
                        <img src="./assets/images/tano.png" alt="Tano" style="width: 80px; height: 80px; object-fit: contain;">
                    </div>
                    <h4>Complete Adventure Bundle</h4>
                    <p>Both modules included • Perfect for ages 1-6 years</p>
                    <div class="price-display">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <span style="text-decoration: line-through; color: #999;">$17.99</span>
                            <span class="price">$14.99</span>
                            <span style="background: #EF476F; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem;">Save $3</span>
                        </div>
                        <span class="price-note">Complete bundle • Lifetime access</span>
                    </div>
                </div>
            `;
            break;
    }
    
    modalContent.innerHTML = content;
    modal.classList.add('active');
    
    // Focus management for accessibility
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }
}

// Close purchase modal
function closePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    modal.classList.remove('active');
}

// Demo video functionality
function playDemo() {
    const videoContainer = document.getElementById('demo-video');
    
    // Replace with actual video embed or player
    videoContainer.innerHTML = `
        <div style="background: #000; color: white; padding: 2rem; text-align: center; border-radius: 12px;">
            <h3>Demo Video</h3>
            <p>This is where the demo video would play.</p>
            <p>In a real implementation, you would embed your actual video here.</p>
            <button onclick="closeDemo()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #FF6B35; color: white; border: none; border-radius: 8px; cursor: pointer;">Close Demo</button>
        </div>
    `;
}

function closeDemo() {
    const videoContainer = document.getElementById('demo-video');
    videoContainer.innerHTML = `
        <div class="play-button" onclick="playDemo()">
            <span class="play-icon">▶</span>
        </div>
        <img src="./assets/images/demo-thumbnail.jpg" alt="Demo Video Thumbnail" loading="lazy">
    `;
}

// Loading states
function initializeLoadingStates() {
    // Add loading styles
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            color: #EF476F;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        
        .form-input.error {
            border-color: #EF476F;
        }
        
        .module-preview {
            text-align: center;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        
        .module-preview h4 {
            margin: 1rem 0 0.5rem;
            color: #073B4C;
        }
        
        .price-display {
            margin-top: 1rem;
        }
        
        .price-display .price {
            font-size: 2rem;
            font-weight: 700;
            color: #FF6B35;
            display: block;
        }
        
        .price-display .price-note {
            font-size: 0.8rem;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

function showLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('active');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.remove('active');
}

// Message functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-toast');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-toast ${type}`;
    messageEl.textContent = message;
    
    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#06D6A0' : '#EF476F'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        font-family: 'Mali', cursive;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 5000);
}

// Accessibility features
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #073B4C;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 4000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        const modal = document.querySelector('.modal.active');
        if (modal && e.key === 'Tab') {
            trapFocus(e, modal);
        }
    });
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const criticalImages = [
        './assets/images/logo.png',
        './assets/images/kiki.png',
        './assets/images/tano.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}