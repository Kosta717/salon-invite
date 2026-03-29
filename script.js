// ===== SPLASH SCREEN =====
document.addEventListener('DOMContentLoaded', () => {
    const splashOverlay = document.getElementById('splashOverlay');
    const musicYes = document.getElementById('musicYes');
    const musicNo = document.getElementById('musicNo');
    const bgMusic = document.getElementById('bgMusic');

    function closeSplash(playMusic) {
        if (playMusic && bgMusic) {
            bgMusic.play().catch(() => {
                // Music file not available yet — silent fail
            });
        }
        splashOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        
        const heroInner = document.querySelector('.hero-inner');
        if (heroInner) {
            heroInner.classList.add('show');
        }

        // Remove splash from DOM after animation
        setTimeout(() => {
            splashOverlay.remove();
        }, 800);
    }

    // Prevent scrolling while splash is open
    document.body.style.overflow = 'hidden';

    musicYes.addEventListener('click', () => closeSplash(true));
    musicNo.addEventListener('click', () => closeSplash(false));

    // ===== SCROLL DOWN BUTTON =====
    const scrollDown = document.getElementById('scrollDown');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ===== SCROLL ANIMATIONS (IntersectionObserver) =====
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for multiple elements appearing together
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ===== RSVP FORM HANDLING =====
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('guestName').value.trim(),
                surname: document.getElementById('guestSurname').value.trim(),
                phone: document.getElementById('guestPhone').value.trim(),
                timestamp: new Date().toISOString()
            };

            // Save to localStorage
            const responses = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
            responses.push(formData);
            localStorage.setItem('rsvpResponses', JSON.stringify(responses));

            // Show success message
            rsvpForm.style.display = 'none';
            rsvpSuccess.classList.add('show');

            // Create confetti effect
            createConfetti();
        });
    }

    // ===== PHONE INPUT FORMATTING =====
    const phoneInput = document.getElementById('guestPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    // Russian phone format
                    let formatted = '+7';
                    if (value.length > 1) formatted += ' (' + value.substring(1, 4);
                    if (value.length > 4) formatted += ') ' + value.substring(4, 7);
                    if (value.length > 7) formatted += '-' + value.substring(7, 9);
                    if (value.length > 9) formatted += '-' + value.substring(9, 11);
                    e.target.value = formatted;
                }
            }
        });
    }

    // ===== CONFETTI EFFECT =====
    function createConfetti() {
        const colors = ['#7A9E78', '#B8C9B5', '#C5A467', '#D4BC8A', '#4A7248'];
        const container = document.querySelector('.rsvp-section');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: 0;
                opacity: 0;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 10;
            `;
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            container.appendChild(confetti);

            // Animate
            const duration = Math.random() * 2000 + 1500;
            const delay = Math.random() * 500;
            
            confetti.animate([
                { 
                    transform: `translateY(-20px) rotate(0deg)`, 
                    opacity: 1 
                },
                { 
                    transform: `translateY(${container.offsetHeight}px) rotate(${Math.random() * 720}deg)`, 
                    opacity: 0 
                }
            ], {
                duration: duration,
                delay: delay,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            // Remove after animation
            setTimeout(() => confetti.remove(), duration + delay + 100);
        }
    }

    // ===== PARALLAX-LIKE EFFECT ON HERO =====
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroInner = document.querySelector('.hero-inner');
                if (heroInner && scrollY < window.innerHeight) {
                    heroInner.style.transform = `translateY(${scrollY * 0.3}px)`;
                    heroInner.style.opacity = 1 - (scrollY / window.innerHeight) * 0.5;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});
