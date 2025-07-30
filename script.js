// 📌 Настройки Telegram
const BOT_TOKEN = '8153656575:AAFFR94qtQOQKz4xm9-ggRvNFKhh0-tHBio'; // Замени на свой
const CHAT_ID = '208643020'; // Замени на свой

// Автоформат номера телефона
document.getElementById('userPhone').addEventListener('input', function () {
    let digits = this.value.replace(/\D/g, '');

    // Начало с 7 или 8 — преобразуем к формату +7
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;

    let formatted = '+7';
    if (digits.length > 1) formatted += '(' + digits.substring(1, 4);
    if (digits.length > 4) formatted += ')' + digits.substring(4, 7);
    if (digits.length > 7) formatted += '-' + digits.substring(7, 9);
    if (digits.length > 9) formatted += '-' + digits.substring(9, 11);

    this.value = formatted;
});

document.getElementById('userPhone').addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && this.value === '+7') e.preventDefault();
});

// Только буквы в имени
document.getElementById('userName').addEventListener('input', function () {
    this.value = this.value.replace(/[^А-Яа-яЁёA-Za-z ]/g, '');
});

// Экранирование HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Получить название услуги
function getServiceName(serviceKey) {
    const services = {
        'basic': 'Базовый пакет (14 900 ₽)',
        'premium': 'Премиум (23 900 ₽)',
        'vip': 'VIP комплекс (54 900 ₽)'
    };
    return services[serviceKey] || serviceKey;
}

// Обработка отправки формы
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

    if (!formData.name || !formData.phone || !formData.address) {
        alert('Пожалуйста, заполните обязательные поля (имя, телефон и адрес)');
        return;
    }

    const message = `🚗 <b>Новая заявка</b>\n\n` +
        `👤 <b>Имя:</b> ${escapeHtml(formData.name)}\n` +
        `📞 <b>Телефон:</b> ${escapeHtml(formData.phone)}\n` +
        `📍 <b>Адрес:</b> ${escapeHtml(formData.address)}\n` +
        (formData.car ? `🚘 <b>Авто:</b> ${escapeHtml(formData.car)}\n` : '') +
        (formData.service ? `🔧 <b>Услуга:</b> ${escapeHtml(getServiceName(formData.service))}\n` : '') +
        (formData.comment ? `📝 <b>Комментарий:</b> ${escapeHtml(formData.comment)}` : '');

    if (!message.trim()) {
        alert('Сообщение пустое, невозможно отправить');
        return;
    }

    console.log("Отправляем сообщение:", message);

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Ответ Telegram:", data);
            if (data.ok) {
                document.getElementById('telegramForm').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
            } else {
                alert('❌ Ошибка при отправке. Проверьте данные.');
                console.error('Telegram API error:', data);
            }
        })
        .catch(error => {
            alert('❌ Сбой отправки. Проверьте подключение.');
            console.error('Ошибка:', error);
        });
});

// Ручная ссылка
document.getElementById('manualLink')?.addEventListener('click', function (e) {
    e.preventDefault();
    alert('Скопируйте этот номер и напишите нам в Telegram или WhatsApp: +7 (917) 772 10-10');
});
