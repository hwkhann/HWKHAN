// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const typingText = document.querySelector('.typing-text');

// Navigation Menu Toggle
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Remove mobile menu if open
            if (navLinks) navLinks.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('active');

            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Typing Animation
const textToType = "I'm a Full Stack Developer";
let charIndex = 0;
let typingInterval = null;

function typeText() {
    if (typingText && charIndex < textToType.length) {
        typingText.textContent = textToType.slice(0, charIndex + 1);
        charIndex++;
        typingInterval = setTimeout(typeText, 100);
    }
}

// Start typing animation after a delay
if (typingText) {
    setTimeout(typeText, 1500);
}

// Clean up typing animation on page unload
window.addEventListener('unload', () => {
    if (typingInterval) {
        clearTimeout(typingInterval);
    }
});

// Animate skill bars on scroll
const progressBars = document.querySelectorAll('.progress');
if (progressBars.length > 0) {
    progressBars.forEach(progress => {
        if (progress) {
            gsap.to(progress, {
                scaleX: 1,
                duration: 1.5,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: progress,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    });
}

// Contact Form Handling
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    // Contact Form Animation
    gsap.from(contactForm, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: contactForm,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Form Submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const messageInput = document.querySelector('#message');
        
        if (!nameInput || !emailInput || !messageInput) {
            console.error('Form inputs not found');
            return;
        }

        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // Basic form validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            // Add your form submission logic here
            console.log('Form submitted:', formData);
            
            // Clear form
            contactForm.reset();
            
            // Show success message
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        }
    });
}

// About Section Animations
const aboutText = document.querySelector('.about-text');
const skillItems = document.querySelectorAll('.skill');

// Text animation
if (aboutText) {
    gsap.from(aboutText, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: aboutText,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
}

// Skills animation with stagger
if (skillItems.length > 0) {
    gsap.from(skillItems, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.skills',
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
}

// Rotating cube animation enhancement
const cube = document.querySelector('.rotating-cube');
if (cube) {
    gsap.to(cube, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });

    // Add hover effect to cube with error handling
    const handleCubeHover = (scale) => {
        gsap.to(cube, {
            scale,
            duration: 0.3
        });
    };

    cube.addEventListener('mouseenter', () => handleCubeHover(1.2));
    cube.addEventListener('mouseleave', () => handleCubeHover(1));
}

// Parallax Effect for Hero Section
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Cleanup function for GSAP animations
window.addEventListener('unload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
