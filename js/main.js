// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navigation Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const textToType = "I'm a Full Stack Developer";
let charIndex = 0;

function typeText() {
    if (charIndex < textToType.length) {
        typingText.textContent = textToType.slice(0, charIndex + 1);
        charIndex++;
        setTimeout(typeText, 100);
    }
}

// Start typing animation after a delay
setTimeout(typeText, 1500);

// Animate skill bars on scroll
const skills = document.querySelectorAll('.progress');
skills.forEach(skill => {
    gsap.to(skill, {
        scaleX: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
            trigger: skill,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// Contact Form Animation
const contactForm = document.querySelector('#contact-form');
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
    
    const formData = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        message: document.querySelector('#message').value
    };

    // Add your form submission logic here
    console.log('Form submitted:', formData);
    
    // Clear form
    contactForm.reset();
    
    // Show success message
    alert('Message sent successfully!');
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
});
