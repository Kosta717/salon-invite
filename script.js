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
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('guestName').value.trim(),
                surname: document.getElementById('guestSurname').value.trim(),
                phone: document.getElementById('guestPhone').value.trim(),
                timestamp: new Date().toISOString()
            };

            // --- ОПЦИЯ 1: Отправка в Telegram (Рекомендуется) ---
            // Для работы нужно создать бота в @BotFather и узнать свой CHAT_ID
            const TELEGRAM_BOT_TOKEN = ''; // Пример: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ'
            const TELEGRAM_CHAT_ID = ''; // Пример: '-1001234567890' (или свой личный ID)
            
            if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
                const message = `🎉 Новая заявка (Республика Красоты)!\n\nИмя: ${formData.name}\nФамилия: ${formData.surname}\nТелефон: ${formData.phone}`;
                try {
                    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
                    });
                } catch (error) {
                    console.error('Ошибка отправки в Telegram:', error);
                }
            }

            // --- ОПЦИЯ 2: Отправка на Email через Formspree ---
            // Зарегистрируйтесь на formspree.io, создайте форму и вставьте её ID сюда
            const FORMSPREE_ID = ''; // Пример: 'xabcdefg'
            
            if (FORMSPREE_ID) {
                try {
                    await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                        method: 'POST',
                        body: new FormData(rsvpForm),
                        headers: { 'Accept': 'application/json' }
                    });
                } catch (error) {
                    console.error('Ошибка отправки на Formspree:', error);
                }
            }

            // --- ОПЦИЯ 3: Сохранение прямо в Google Таблицу (Рекомендуется для баз данных) ---
            // Скрипт для создания Web App в Google Таблицах я предоставил вам в чате
            const GOOGLE_APP_URL = 'https://script.google.com/macros/s/AKfycbx1NeGOiFUDMYh-oUiPumDaHagiWso-iwDN_1xULjL2T-Ox8hE0kAATc6wpIahtoPiI/exec'; // Вставьте сюда URL вашего развернутого веб-приложения (Web App)
            
            if (GOOGLE_APP_URL) {
                try {
                    await fetch(GOOGLE_APP_URL, {
                        method: 'POST',
                        mode: 'no-cors', // Это важно, чтобы браузер не блокировал запрос (CORS)
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                } catch (error) {
                    console.error('Ошибка отправки в Google Таблицу:', error);
                }
            }

            // Сохраняем в localStorage как резервную копию в браузере
            const responses = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
            responses.push(formData);
            localStorage.setItem('rsvpResponses', JSON.stringify(responses));

            // Показываем сообщение об успехе
            rsvpForm.style.display = 'none';
            rsvpSuccess.classList.add('show');

            // Восстанавливаем кнопку (на случай если форма будет показана снова)
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;

            // Запускаем конфетти
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
        if (!container) return;
        
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        const fragment = document.createDocumentFragment();
        const confettis = [];
        
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
            fragment.appendChild(confetti);
            
            const duration = Math.random() * 2000 + 1500;
            const delay = Math.random() * 500;
            confettis.push({ el: confetti, duration, delay });
        }
        
        container.appendChild(fragment);

        confettis.forEach(({ el, duration, delay }) => {
            el.animate([
                { transform: `translateY(-20px) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${container.offsetHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duration,
                delay: delay,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            setTimeout(() => el.remove(), duration + delay + 100);
        });
    }

    // ===== PARALLAX-LIKE EFFECT ON HERO =====
    let ticking = false;
    const heroInner = document.querySelector('.hero-inner');
    
    if (heroInner) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroInner.style.transform = `translateY(${scrollY * 0.3}px)`;
                        heroInner.style.opacity = 1 - (scrollY / window.innerHeight) * 0.5;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
});
