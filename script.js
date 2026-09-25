// Background Floating Hearts Animation
const bgHearts = document.getElementById('bgHearts');
if (bgHearts) {
    for (let i = 0; i < 22; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        const size = Math.random() * 20 + 10;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${Math.random() * 4 + 4}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        bgHearts.appendChild(heart);
    }
}

// Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionSection = document.getElementById('questionSection');
const wizardSection = document.getElementById('wizardSection');

let yesBtnScale = 1;
let currentStep = 1;

// Global Selected Booking State
const bookingData = {
    place: '',
    date: '',
    time: '',
    treat: '',
    note: ''
};

// THEMED SUB-CHOICES MAP FOR EACH PLACE
const placeThemeMap = {
    '☕ Shinam Qahvaxona': {
        icon: '☕',
        title: 'Qahvaxonada nimani afzal ko\'rasiz?',
        subtitle: 'Sevimli kofe va shirinligingizni tanlang:',
        options: [
            { icon: '☕', name: 'Cappuccino + Cheesecake', desc: 'Latofatli ta\'m va yumshoq sirnik' },
            { icon: '🍵', name: 'Matcha Latte + Croissant', desc: 'Yashil choyli latte va qarsillama kruassan' },
            { icon: '🍫', name: 'Issiq Shokolad + Brownie', desc: 'To\'yingan shokoladli lazzat' },
            { icon: '🍹', name: 'Espresso Tonic + Macarons', desc: 'Muzdek kofe va mevali makaronlar' },
            { icon: '🌹', name: 'Ofitsiantdan surpriz buyurtma', desc: 'Menga nimadir tanlab bering!' }
        ]
    },
    '🍕 Mazali Pitseriya': {
        icon: '🍕',
        title: 'Pitseriyada qaysi menyuni xohlaysiz?',
        subtitle: 'Sevimli pitsa va ichimligingizni tanlang:',
        options: [
            { icon: '🍕', name: 'Pepperoni + Muzdek Cola', desc: 'Achchiqroq sosiskalar va klassik ta\'m' },
            { icon: '🧀', name: '4 Pishloqli Pitsa + Fanta', desc: 'Erib ketadigan pishloqlar jamlanmasi' },
            { icon: '🍄', name: 'Qo\'ziqorinli va Tovuqli + Choy', desc: 'Mayin va to\'yimli pitsa' },
            { icon: '🥗', name: 'Sezar Pitsa + Meva sharbati', desc: 'Yengil va estetik ta\'m' },
            { icon: '🎁', name: 'Oshpazdan maxsus pitsa', desc: 'Eng sara pitssani tanlaymiz!' }
        ]
    },
    '🌳 Parkda Sayr': {
        icon: '🌳',
        title: 'Parkdagi sayrimiz qanday o\'tsin?',
        subtitle: 'Sayrdagi eng yoqimli mashg\'ulotni tanlang:',
        options: [
            { icon: '🚴', name: 'Velosiped yoki Samokatda uchish', desc: 'Aktiv va qiziqarli sayr' },
            { icon: '🍦', name: 'Muzqaymoq va muzdek kokteyl bilan sayr', desc: 'Shirin suhbatlar va muzqaymoq' },
            { icon: '📸', name: 'Rasmga tushish va foto-sessiya', desc: 'Chiroyli xotiralar muhrlaymiz' },
            { icon: '🦆', name: 'Ko\'l atrofida o\'tirish va suhbatlashish', desc: 'Tinch va samimiy muhit' },
            { icon: '🎧', name: 'Musiqa tinglab piknik qilish', desc: 'Maysazorda sokin hordiq' }
        ]
    },
    '🍿 Kinoza': {
        icon: '🍿',
        title: 'Qaysi janrdagi kinoga tushamiz?',
        subtitle: 'Birgalikda tomosha qiladigan filmimiz janri:',
        options: [
            { icon: '🎬', name: 'Kulgili Komediya', desc: 'Maroqli va miriqib kulish uchun' },
            { icon: '💖', name: 'Romantik Sevgi filmi', desc: 'Tuyg\'ular va issiq hislarga boy film' },
            { icon: '🍿', name: 'Fantastika va Sarguzasht (Sci-Fi)', desc: 'Yuqori effektlar va shiddat' },
            { icon: '👻', name: 'Triller / Sirli kino', desc: 'Hayajonli va kutilmagan syujet' },
            { icon: '🎟️', name: 'Trenddagi premyera film', desc: 'Eng sara kino namoyishi' }
        ]
    },
    '🍦 Muzqaymoqxona': {
        icon: '🍦',
        title: 'Qaysi turdagi muzqaymoqni xohlaysiz?',
        subtitle: 'Muzdek va shirin lazzatni tanlang:',
        options: [
            { icon: '🍓', name: 'Qulupnayli va Mevali Sorbet', desc: 'Meva bo\'laklari va yangilik' },
            { icon: '🍫', name: 'Shokoladli va Yong\'oqli Shart', desc: 'To\'yingan shokolad va yong\'oq' },
            { icon: '🍦', name: 'Klassik Vanilli va Karamelli', desc: 'Yumshoq krem va karamel' },
            { icon: '🧇', name: 'Vafli stakanchadagi assorti', desc: 'Har xil ta\'mlar miksi' },
            { icon: '🍨', name: 'Katta mevali desert uyi', desc: 'Ikki kishi uchun maxsus desert' }
        ]
    },
    '🎨 San\'at & Galereya': {
        icon: '🎨',
        title: 'Qaysi turdagi ko\'rgazmaga boramiz?',
        subtitle: 'Madaniy hordiq yo\'nalishini tanlang:',
        options: [
            { icon: '🖼️', name: 'Zamonaviy San\'at va Kartinalar', desc: 'Estetik va zamonaviy ijod' },
            { icon: '📷', name: 'Fotosuratlar va Mualliflik Galereyasi', desc: 'Chiroyli kadrlar va san\'at' },
            { icon: '🔮', name: 'Interaktiv 3D Illuziyalar Ko\'rgazmasi', desc: 'Qiziqarli rasmlar va illyuziya' },
            { icon: '🏛️', name: 'Tarixiy va Milliy eksponatlar', desc: 'Boy tarix va madaniyat' },
            { icon: '🎨', name: 'Master-klass: Birga rasm chizish', desc: 'O\'z kartinamizni yaratamiz!' }
        ]
    }
};

// Playful "No" button movement
function moveNoButton() {
    yesBtnScale += 0.15;
    yesBtn.style.transform = `scale(${yesBtnScale})`;

    const x = Math.random() * 180 - 90;
    const y = Math.random() * 120 - 60;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

if (noBtn) {
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

// "Ha" button click -> Opens Wizard
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        questionSection.classList.remove('active');
        wizardSection.classList.add('active');

        // Confetti burst
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
        });
        
        goToStep(1);
    });
}

// Wizard Steps Navigation
function goToStep(stepNumber) {
    currentStep = stepNumber;

    // If moving to step 3, ensure themed options are rendered
    if (stepNumber === 3) {
        renderThemedStep3(bookingData.place);
    }

    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Update Progress bar & step dots
    const progressPercent = ((stepNumber - 1) / 4) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    document.querySelectorAll('.step-dot').forEach(dot => {
        const step = parseInt(dot.getAttribute('data-step'));
        if (step <= stepNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// STEP 1: Select Option Card (Place)
function selectCardOption(category, value, element) {
    document.querySelectorAll(`.option-card[data-category="${category}"]`).forEach(card => {
        card.classList.remove('selected');
    });

    element.classList.add('selected');
    bookingData[category] = value;

    // Prepare Step 3 dynamic content immediately
    renderThemedStep3(value);

    // Enable Next button in step 1
    const step1Next = document.getElementById('step1Next');
    if (step1Next) step1Next.disabled = false;
}

// DYNAMICALLY RENDER STEP 3 OPTIONS BASED ON SELECTED PLACE
function renderThemedStep3(placeName) {
    const theme = placeThemeMap[placeName] || placeThemeMap['☕ Shinam Qahvaxona'];

    // Update Header
    document.getElementById('step3Icon').innerText = theme.icon;
    document.getElementById('step3Title').innerText = theme.title;
    document.getElementById('step3Subtitle').innerText = theme.subtitle;

    // Update Items Container
    const container = document.getElementById('themedTreatsList');
    container.innerHTML = '';

    theme.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'treat-item';
        
        // If previously selected, mark selected
        if (bookingData.treat === `${opt.icon} ${opt.name}`) {
            item.classList.add('selected');
        }

        item.onclick = function() {
            selectTreat(`${opt.icon} ${opt.name}`, item);
        };

        item.innerHTML = `
            <div class="treat-content">
                <div class="treat-name">${opt.icon} ${opt.name}</div>
                <div class="treat-desc">${opt.desc}</div>
            </div>
            <i class="fa-regular fa-circle-check check-icon"></i>
        `;

        container.appendChild(item);
    });
}

// STEP 2: Quick Date & Time handlers
function setQuickDate(dateText) {
    const today = new Date();
    let selectedDate = dateText;

    if (dateText === 'Bugun') {
        selectedDate = today.toISOString().split('T')[0];
    } else if (dateText === 'Ertaga') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        selectedDate = tomorrow.toISOString().split('T')[0];
    } else if (dateText === 'Dam olish kuni') {
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
        selectedDate = nextSaturday.toISOString().split('T')[0];
    }

    bookingData.date = selectedDate;
    document.getElementById('customDate').value = (selectedDate.includes('-') ? selectedDate : '');
    
    // Highlight pill
    document.querySelectorAll('#step2 .badge-group .pill-badge').forEach(b => {
        if (b.innerText === dateText) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function setQuickTime(timeStr) {
    bookingData.time = timeStr;
    document.getElementById('customTime').value = timeStr;

    document.querySelectorAll('.time-pill').forEach(b => {
        if (b.innerText === timeStr) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function updateDateTimeSelection() {
    const dateVal = document.getElementById('customDate').value;
    const timeVal = document.getElementById('customTime').value;

    if (dateVal) bookingData.date = dateVal;
    if (timeVal) bookingData.time = timeVal;
}

// STEP 3: Treat selection
function selectTreat(treatName, element) {
    document.querySelectorAll('#themedTreatsList .treat-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    bookingData.treat = treatName;
}

// STEP 4 -> 5: Prepare Ticket Screen
function prepareTicketStep() {
    const noteVal = document.getElementById('noteInput').value;
    bookingData.note = noteVal;

    // Default fallbacks if empty
    if (!bookingData.date) bookingData.date = 'Kelishilgan kuni';
    if (!bookingData.time) bookingData.time = '18:00';
    if (!bookingData.treat) bookingData.treat = '✨ Ajoyib reja';

    // Populate Ticket HTML
    document.getElementById('summaryPlace').innerText = bookingData.place || 'Tanlanmadi';
    document.getElementById('summaryDate').innerText = bookingData.date;
    document.getElementById('summaryTime').innerText = bookingData.time;
    document.getElementById('summaryTreat').innerText = bookingData.treat;
    
    const noteRow = document.getElementById('summaryNoteRow');
    if (bookingData.note.trim()) {
        document.getElementById('summaryNote').innerText = bookingData.note;
        noteRow.style.display = 'flex';
    } else {
        noteRow.style.display = 'none';
    }

    goToStep(5);
}

// STEP 5: Submit Booking to Backend API
async function submitBooking() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saqlanmoqda...';

    try {
        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
            // Hide ticket step navigation & show success display
            document.getElementById('step5').style.display = 'none';
            document.querySelector('.progress-bar-container').style.display = 'none';
            
            const successScreen = document.getElementById('finalSuccessScreen');
            if (successScreen) successScreen.style.display = 'block';

            // Confetti Fireworks!
            confettiFireworks();

            // Start countdown timer if valid date was picked
            startCountdownTimer(bookingData.date, bookingData.time);
        } else {
            alert('Xatolik yuz berdi: ' + (result.error || 'Qaytadan urinib ko\'ring'));
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<span>Uchrashuvni Tasdiqlash & Yuborish 💌</span>';
        }
    } catch (err) {
        console.error('API Error:', err);
        document.getElementById('step5').style.display = 'none';
        document.querySelector('.progress-bar-container').style.display = 'none';
        document.getElementById('finalSuccessScreen').style.display = 'block';
        confettiFireworks();
    }
}

// Confetti Fireworks Helper
function confettiFireworks() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Countdown Timer logic
function startCountdownTimer(dateStr, timeStr) {
    const countdownElement = document.getElementById('countdownTimer');
    if (!countdownElement) return;

    let targetDate;
    if (dateStr.includes('-')) {
        targetDate = new Date(`${dateStr}T${timeStr || '18:00'}:00`);
    } else {
        targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            countdownElement.innerText = "🎉 Uchrashuv vaqti keldi!";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let text = '';
        if (days > 0) text += `${days} kun `;
        text += `${hours} soat ${mins} daqiqa`;

        countdownElement.innerText = text;
    }

    update();
    setInterval(update, 60000);
}