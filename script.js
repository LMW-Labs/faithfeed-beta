// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const betaForm = document.getElementById('betaForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

if (betaForm) {
    betaForm.addEventListener('submit', async (e) => {
        // Don't prevent default - let FormSpree handle it
        // But we'll handle the UI feedback

        // Disable button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Joining...';
        submitBtn.querySelector('.btn-arrow').style.opacity = '0';

        // Wait for FormSpree to process (it will redirect or show success)
        // We'll use a timeout to show success state
        setTimeout(() => {
            // Hide form
            betaForm.style.display = 'none';

            // Show success message
            successMessage.classList.add('show');

            // Scroll to success message
            successMessage.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Track conversion (if you add analytics later)
            if (window.gtag) {
                gtag('event', 'beta_signup', {
                    'event_category': 'engagement',
                    'event_label': 'Beta Waitlist'
                });
            }
        }, 1500);
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.stat-card, .benefit-card, .feature-item, .timeline-item');

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
};

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();

    // Add parallax effect to background gradients
    const bgGradient = document.querySelector('.bg-gradient');
    const bgGradient2 = document.querySelector('.bg-gradient-2');

    if (bgGradient && bgGradient2) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;

            bgGradient.style.transform = `translate(${x}px, ${y}px)`;
            bgGradient2.style.transform = `translate(${-x}px, ${-y}px)`;
        });
    }

    // Animate stats counter (optional enhancement)
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerForStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const text = statElement.textContent;

                // Only animate if it contains a number
                if (text.match(/\d+/)) {
                    statElement.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        statElement.style.transform = 'scale(1)';
                    }, 300);
                }

                observerForStats.unobserve(statElement);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observerForStats.observe(stat);
    });

    // Add loading animation for images if they exist
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });

    // Prevent form resubmission on page refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
});

// Add floating animation to beta badge
const betaBadge = document.querySelector('.beta-badge');
if (betaBadge) {
    let floatDirection = 1;
    let floatPosition = 0;

    setInterval(() => {
        floatPosition += floatDirection * 0.5;
        if (Math.abs(floatPosition) > 3) {
            floatDirection *= -1;
        }
        betaBadge.style.transform = `translateY(${floatPosition}px)`;
    }, 50);
}

// Easter egg: Konami code activates confetti (if you want to add confetti library later)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiSequence.join('')) {
        // Trigger special effect
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});
