const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'bookings.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Public papkasi bo'lmasa loyiha ildizidan xizmat ko'rsatish
app.use(express.static(__dirname));

// Data directory va faylni tekshirish va yaratish
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Yordamchi funksiyalar: JSON DB o'qish va yozish
function getBookings() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Fayldan o\'qishda xatolik:', err);
        return [];
    }
}

function saveBookings(bookings) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
    } catch (err) {
        console.error('Faylga yozishda xatolik:', err);
    }
}

// Telegram ga xabar yuborish funksiyasi
function sendTelegramNotification(booking) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '@Dilmurodjon04070';

    if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
        console.log(`⚠️ Telegram BOT_TOKEN hali kiritilmadi. Xabar @Dilmurodjon04070 manziliga yuborilishi uchun .env fayliga TELEGRAM_BOT_TOKEN ni kiriting.`);
        return;
    }

    const message = 
`💖 *YANGI UCHRASHUV BELGILANDI!* 💖
👤 *Qabul qiluvchi:* ${chatId}

📍 *Joy:* ${booking.place || 'Tanlanmagan'}
📅 *Sana:* ${booking.date || 'Tanlanmagan'}
⏰ *Vaqt:* ${booking.time || 'Tanlanmagan'}
✨ *Tanlangan reja/menyu:* ${booking.treat || 'Tanlanmagan'}
💬 *Xabar:* ${booking.note ? `"${booking.note}"` : 'Izoh yo\'q'}

⏱ *Vaqt stampi:* ${new Date(booking.createdAt).toLocaleString('uz-UZ')}`;

    const postData = JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = https.request(options, (res) => {
        let responseString = '';
        res.on('data', (chunk) => { responseString += chunk; });
        res.on('end', () => {
            console.log(`📲 Telegramga (@Dilmurodjon04070) yuborish natijasi:`, responseString);
        });
    });

    req.on('error', (e) => {
        console.error('❌ Telegramga yuborishda xatolik:', e.message);
    });

    req.write(postData);
    req.end();
}

// === SAHIFA ROUTLARI (Vercel uchun muhim) ===
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// === API ENDPOINTLARI ===

// 1. Yangi uchrashuv booking yaratish
app.post('/api/booking', (req, res) => {
    const { place, date, time, treat, note } = req.body;

    if (!place) {
        return res.status(400).json({ success: false, error: 'Joy tanlanishi shart!' });
    }

    const newBooking = {
        id: 'date_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        place,
        date: date || 'Yaqin kunlarda',
        time: time || 'Kelishiladi',
        treat: treat || 'Kofe',
        note: note || '',
        createdAt: new Date().toISOString(),
        status: 'accepted'
    };

    const bookings = getBookings();
    bookings.unshift(newBooking);
    saveBookings(bookings);

    // Telegram botga bildirishnoma yuborish
    sendTelegramNotification(newBooking);

    res.json({
        success: true,
        message: 'Uchrashuv muvaffaqiyatli saqlandi! 💖',
        booking: newBooking
    });
});

// 2. Barcha uchrashuvlarni olish (Admin paneli uchun)
app.get('/api/bookings', (req, res) => {
    const bookings = getBookings();
    res.json({
        success: true,
        total: bookings.length,
        bookings
    });
});

// 3. Uchrashuvni o'chirish (Admin paneli uchun)
app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    let bookings = getBookings();
    const initialLen = bookings.length;
    bookings = bookings.filter(b => b.id !== id);

    if (bookings.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Topilmadi' });
    }

    saveBookings(bookings);
    res.json({ success: true, message: 'Uchrashuv o\'chirildi' });
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`Admin paneli: http://localhost:${PORT}/admin.html`);
});