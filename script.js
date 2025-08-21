// -------------------------------
// VARIABLES GLOBALES
// -------------------------------
let countdownInterval;

// -------------------------------
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// -------------------------------
document.addEventListener('DOMContentLoaded', function() {
    initializeWelcomeScreen();
    initializeNavigation();
    initializeCountdown();
    initializeMessageCards();
    initializeTimeline();
    initializePhotoGallery();
    initializeSurpriseSection();
    initializeModal();
    createFloatingHearts();
    initializeScrollAnimations();
});

function initializeWelcomeScreen() {
    const enterBtn = document.getElementById('enter-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const navbar = document.getElementById('navbar');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');

    enterBtn.addEventListener('click', function() {
        // Ocultar pantalla de bienvenida
        welcomeScreen.classList.add('hidden');

        // Mostrar contenido principal y navbar tras un pequeño delay
        setTimeout(() => {
            navbar.classList.add('visible');
            mainContent.classList.add('visible');

            // Iniciar confeti y música de fondo al mismo tiempo
            startConfetti();
            bgMusic.play().catch(() => console.log("No se pudo reproducir la música de fondo"));
        }, 300); // pequeño delay para suavizar animación
    });
}

// -------------------------------
// NAVEGACIÓN SUAVE
// -------------------------------
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// -------------------------------
// CONTADOR REGRESIVO
// -------------------------------
function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    const now = new Date();
    let targetDate = new Date(now.getFullYear(), now.getMonth(), 23, 0, 0, 0);
    if (targetDate < now) targetDate.setMonth(targetDate.getMonth() + 1);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">Días</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">Horas</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Minutos</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Segundos</span>
                </div>
            `;
        } else {
            countdownElement.innerHTML = `
                <div class="birthday-message">
                    <h2>¡Es tu día especial! 🎉</h2>
                    <p>¡Feliz Cumpleaños mi amor!</p>
                </div>
            `;
            clearInterval(countdownInterval);
            triggerBirthdayAnimation();
        }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// -------------------------------
// TARJETAS DE MENSAJES
// -------------------------------
function initializeMessageCards() {
    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            if (this.classList.contains('flipped')) createHeartBurst(this);
        });
        card.addEventListener('mouseenter', function() {
            createSparkles(this);
        });
    });
}

// -------------------------------
// TIMELINE DE RECUERDOS
// -------------------------------
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const dates = ['Enero 2023', 'Marzo 2023', 'Junio 2023', 'Septiembre 2023'];
    timelineItems.forEach((item, index) => {
        if (dates[index]) item.setAttribute('data-date', dates[index]);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                createMemorySparkles(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    timelineItems.forEach(item => observer.observe(item));
}

// -------------------------------
// GALERÍA DE FOTOS
// -------------------------------
function initializePhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.filter = 'brightness(1.2)';
            setTimeout(() => { this.style.transform = ''; this.style.filter = ''; }, 300);
            showPhotoMessage(index + 1);
            createPhotoHearts(this);
        });

        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// -------------------------------
// SECCIÓN SORPRESA
// -------------------------------
function initializeSurpriseSection() {
    const giftBox = document.getElementById('gift-box');
    const surpriseContent = document.getElementById('surprise-content');
    const playSongBtn = document.getElementById('play-song');
    const showWishesBtn = document.getElementById('show-wishes');
    const specialMusic = document.getElementById('special-music');
    const miniPlayer = document.getElementById('mini-player');
    let giftOpened = false;

    giftBox.addEventListener('click', function() {
        if (!giftOpened) {
            this.classList.add('opened');
            giftOpened = true;
            setTimeout(() => {
                surpriseContent.classList.remove('hidden');
                surpriseContent.classList.add('visible');
                createMagicSparkles();
                playOpenGiftSound();
            }, 500);
        }
    });

    playSongBtn.addEventListener('click', function() {
        if (specialMusic.paused) {
            specialMusic.currentTime = 0;
            specialMusic.play().catch(() => console.log("No se pudo reproducir la canción especial."));
            miniPlayer.classList.remove('hidden');
            this.innerHTML = '<i class="fas fa-pause"></i> Pausar canción';
        } else {
            specialMusic.pause();
            this.innerHTML = '<i class="fas fa-music"></i> Mi canción para ti';
        }
        createMusicNotes();
    });

    document.getElementById('close-mini-player').addEventListener('click', () => {
        if (!specialMusic.paused) specialMusic.pause();
        miniPlayer.classList.add('hidden');
        playSongBtn.innerHTML = '<i class="fas fa-music"></i> Mi canción para ti';
    });

    showWishesBtn.addEventListener('click', function() {
        showWishesModal();
    });
}

// -------------------------------
// MODAL DE DESEOS
// -------------------------------
function initializeModal() {
    const modal = document.getElementById('wishes-modal');
    const closeModal = document.querySelector('.close-modal');

    closeModal.addEventListener('click', function() {
        modal.classList.remove('visible');
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('visible');
    });
}

// -------------------------------
// EFECTOS VISUALES Y PARTICULAS
// -------------------------------
// Aquí van createFloatingHearts, createHeartBurst, createSparkles, createMemorySparkles, createPhotoHearts, createMagicSparkles, createMusicNotes, startConfetti

// -------------------------------
// ANIMACIONES DE SCROLL
// -------------------------------
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const animatedElements = document.querySelectorAll('.message-card, .photo-item, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// -------------------------------
// EVENTOS GLOBALES
// -------------------------------
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('hero-title')) {
        createHeartBurst(e.target);
        e.target.style.animation = 'heartbeat 0.5s ease';
        setTimeout(() => e.target.style.animation = '', 500);
    }

    if (e.target.closest('.birthday-cake')) {
        const cake = e.target.closest('.birthday-cake');
        cake.style.animation = 'bounce 0.5s ease';
        createMagicSparkles();
        setTimeout(() => { cake.style.animation = 'float 3s ease-in-out infinite'; }, 500);
    }
});

window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = '¿Seguro que quieres irte? ¡Aún hay más sorpresas por descubrir! 💕';
    return e.returnValue;
});

// -------------------------------
// UTILIDADES
// -------------------------------
function isMobile() {
    return window.innerWidth <= 768;
}

// -------------------------------
// ADAPTACIÓN MÓVIL PARA PARTICULAS
// -------------------------------
if (isMobile()) {
    const originalCreateSparkles = createSparkles;
    createSparkles = function(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 2; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
            sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
            sparkle.style.fontSize = '16px';
            sparkle.style.zIndex = '999';
            sparkle.style.pointerEvents = 'none';

            sparkle.animate([
                { opacity: 0, transform: 'scale(0) rotate(0deg)' },
                { opacity: 1, transform: 'scale(1) rotate(180deg)' },
                { opacity: 0, transform: 'scale(0) rotate(360deg)' }
            ], { duration: 1500, easing: 'ease-in-out' });

            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1500);
        }
    };
}

function initializePhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');

    photoItems.forEach(item => {
        const img = item.querySelector('img'); // foto dentro del item

        item.addEventListener('click', function() {
            if (img) {
                img.classList.add('visible'); // mostrar la foto
            }

            // Opcional: animación al pulsar
            item.style.transform = 'scale(1.05)';
            setTimeout(() => { item.style.transform = ''; }, 200);
        });
    });
}

const music = document.getElementById('special-music');
music.volume = 0.6;