document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        this.innerHTML = navLinks.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Testimonials carousel
    const carousel = document.querySelector('.testimonials-carousel');
    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const indicators = carousel.querySelectorAll('.indicator');

    let currentIndex = 0;
    const itemCount = items.length;

    function updateCarousel() {
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + itemCount) % itemCount;
        updateCarousel();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto-rotate carousel
    let carouselInterval = setInterval(nextSlide, 5000);

    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }

    // Sticky header on scroll
    const header = document.querySelector('.top-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;
    });

    // Animation on scroll
    const animateElements = document.querySelectorAll('.feature-card, .process-step, .section-title, .gallery-item, .pricing-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
        observer.observe(el);
    });
});
// Автозаполнение телефона
document.getElementById('userPhone').addEventListener('input', function (e) {
    // Получаем текущее значение без форматирования
    let digits = this.value.replace(/\D/g, '');

    // Удаляем лишние цифры после +7
    if (digits.length > 1 && digits.startsWith('7')) {
        digits = '7' + digits.substring(1).replace(/7/g, '');
    }

    // Форматируем номер
    let formatted = '+7';
    if (digits.length > 1) {
        formatted += '(' + digits.substring(1, 4);
    }
    if (digits.length > 4) {
        formatted += ')' + digits.substring(4, 7);
    }
    if (digits.length > 7) {
        formatted += '-' + digits.substring(7, 9);
    }
    if (digits.length > 9) {
        formatted += '-' + digits.substring(9, 11);
    }

    this.value = formatted;
});

// Обработка удаления (Backspace)
document.getElementById('userPhone').addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && this.value === '+7') {
        e.preventDefault(); // Запрещаем удаление +7
    }
});
// Валидация имени (только буквы)
document.getElementById('userName').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^А-Яа-яЁёA-Za-z ]/g, '');
});

// Отправка формы
document.getElementById('telegramForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('userName').value.trim(),
        phone: document.getElementById('userPhone').value.trim(),
        car: document.getElementById('carBrand').value.trim(),
        address: document.getElementById('pickupAddress').value.trim(),
        service: document.getElementById('service').value,
        comment: document.getElementById('comment').value.trim()
    };

    // Проверка обязательных полей
    if (!formData.name || !formData.phone || !formData.address) {
        alert('Пожалуйста, заполните обязательные поля (имя, телефон и адрес)');
        return;
    }

    // Форматируем сообщение
    const message = `🚗 Новая заявка на мойку:\n\n` +
        `👤 Имя: ${formData.name}\n` +
        `📞 Телефон: ${formData.phone}\n` +
        `📍 Адрес забора: ${formData.address}\n` +
        (formData.car ? `🚘 Автомобиль: ${formData.car}\n` : '') +
        (formData.service ? `🔧 Услуга: ${getServiceName(formData.service)}\n` : '') +
        (formData.comment ? `📝 Комментарий: ${formData.comment}` : '');

    // Ваш Telegram username (без @)
    const telegramUsername = "baslanovm"; // ЗАМЕНИТЕ НА СВОЙ

    // Открываем Telegram
    window.open(`https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`, '_blank');

    // Показываем сообщение об успехе
    document.getElementById('telegramForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
});

function getServiceName(serviceKey) {
    const services = {
        'basic': 'Базовый пакет (14 900 ₽)',
        'premium': 'Премиум (23 900 ₽)',
        'vip': 'VIP комплекс (54 900 ₽)'
    };
    return services[serviceKey] || serviceKey;
}

// Ручная отправка если Telegram не открылся
document.getElementById('manualLink').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Скопируйте этот номер и напишите нам в Telegram или Whatsapp: +7 917 772 1010');
});
