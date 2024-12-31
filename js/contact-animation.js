// Contact section animations and form handling
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const contactSection = document.querySelector('.contact');
    const contactTitle = contactSection?.querySelector('h2');
    const contactContent = contactSection?.querySelector('.contact-content');
    const contactForm = document.getElementById('contact-form');
    
    if (!contactSection || !contactTitle || !contactContent || !contactForm) {
        console.error('Required contact elements not found');
        return;
    }

    // Create notification element
    const createNotification = () => {
        const notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
        return notification;
    };

    const notification = createNotification();

    // Show notification
    const showNotification = (message, type = 'error') => {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    };

    // Form validation messages
    const errorMessages = {
        name: {
            valueMissing: 'Please enter your name',
            tooShort: 'Name must be at least 2 characters',
            tooLong: 'Name must be less than 50 characters'
        },
        email: {
            valueMissing: 'Please enter your email',
            typeMismatch: 'Please enter a valid email address',
            patternMismatch: 'Please enter a valid email address'
        },
        message: {
            valueMissing: 'Please enter your message',
            tooShort: 'Message must be at least 10 characters',
            tooLong: 'Message must be less than 1000 characters'
        }
    };

    // Show input error
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        if (errorDisplay) {
            errorDisplay.textContent = message;
        }
    };

    // Clear input error
    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error');
        if (errorDisplay) {
            errorDisplay.textContent = '';
        }
    };

    // Validate single input
    const validateInput = (input) => {
        clearError(input);
        
        if (!input.validity.valid) {
            const inputName = input.name;
            const errorMessages = {
                valueMissing: errorMessages[inputName]?.valueMissing,
                typeMismatch: errorMessages[inputName]?.typeMismatch,
                patternMismatch: errorMessages[inputName]?.patternMismatch,
                tooShort: errorMessages[inputName]?.tooShort,
                tooLong: errorMessages[inputName]?.tooLong
            };

            for (const [error, message] of Object.entries(errorMessages)) {
                if (input.validity[error] && message) {
                    showError(input, message);
                    return false;
                }
            }
        }
        return true;
    };

    // Handle input events
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        ['input', 'blur'].forEach(eventType => {
            input.addEventListener(eventType, () => validateInput(input));
        });
    });

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        let isValid = true;

        // Validate all inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        try {
            // Disable submit button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                const loadingSpinner = document.createElement('span');
                loadingSpinner.className = 'loading-spinner';
                submitButton.appendChild(loadingSpinner);
                submitButton.textContent = 'Sending...';
            }

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Simulate API call (replace with your actual email sending logic)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success handling
            form.reset();
            showNotification('Message sent successfully!', 'success');

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    };

    // Add form submission listener
    contactForm.addEventListener('submit', handleSubmit);

    // Intersection Observer for animations
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === contactTitle) {
                    entry.target.classList.add('animate');
                } else if (entry.target === contactContent) {
                    entry.target.classList.add('animate');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.2
    });

    observer.observe(contactTitle);
    observer.observe(contactContent);

    // Cleanup function
    const cleanup = () => {
        observer.disconnect();
        contactForm.removeEventListener('submit', handleSubmit);
        inputs.forEach(input => {
            ['input', 'blur'].forEach(eventType => {
                input.removeEventListener(eventType, () => {});
            });
        });
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    };

    // Add cleanup on page unload
    window.addEventListener('unload', cleanup);
});
