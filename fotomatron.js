// ===== Global State =====
let stream = null;
let cameraView = null;
let compositeCanvas = null;
let compositeCtx = null;
let photos = [];
let currentPhotoIndex = 0;
let photoCount = 4;
let timeBetweenPhotos = 3;
let countdownTime = 3;
let isSessionRunning = false;
let isCountingDown = false;
let countdownTimeout = null;
let photoTimeout = null;
let selectedProps = {
    filter: null,
    hat: null,
    glasses: null,
    background: null,
    effect: null
};
let currentPropTab = 'filters';

// Prop definitions
const propsData = {
    filters: [
        { id: 'none', name: 'Normal', emoji: '\ud83d\udcf8', type: 'filter' },
        { id: 'sepia', name: 'Sepia', emoji: '\ud83d\udf8a', type: 'filter' },
        { id: 'grayscale', name: 'B/N', emoji: '\u26aa', type: 'filter' },
        { id: 'invert', name: 'Negativo', emoji: '\ud83d\udd33', type: 'filter' },
        { id: 'blur', name: 'Desenfocado', emoji: '\ud83c\udf2b\ufe0f', type: 'filter' },
        { id: 'vintage', name: 'Vintage', emoji: '\ud83d\udcfc', type: 'filter' },
        { id: 'warm', name: 'Calido', emoji: '\ud83d\udd25', type: 'filter' },
        { id: 'cool', name: 'Frio', emoji: '\u2744\ufe0f', type: 'filter' }
    ],
    hats: [
        { id: 'cowboy', name: 'Vaquero', emoji: '\ud83e\udd20', type: 'hat' },
        { id: 'crown', name: 'Corona', emoji: '\ud83d\udc51', type: 'hat' },
        { id: 'santa', name: 'Santa', emoji: '\ud83c\udf85', type: 'hat' },
        { id: 'party', name: 'Fiesta', emoji: '\ud83c\udf89', type: 'hat' },
        { id: 'chef', name: 'Chef', emoji: '\ud83d\udc69\u200d\ud83c\udf73', type: 'hat' },
        { id: 'pirate', name: 'Pirata', emoji: '\u2620\ufe0f', type: 'hat' },
        { id: 'graduation', name: 'Graduacion', emoji: '\ud83c\udf93\ufe0f', type: 'hat' },
        { id: 'witch', name: 'Bruja', emoji: '\ud83e\uddda', type: 'hat' }
    ],
    glasses: [
        { id: 'sunglasses', name: 'Gafas de Sol', emoji: '\ud83d\ude0e', type: 'glasses' },
        { id: 'nerd', name: 'Nerd', emoji: '\ud83d\udc53', type: 'glasses' },
        { id: 'heart', name: 'Corazones', emoji: '\ud83d\udc95', type: 'glasses' },
        { id: 'star', name: 'Estrellas', emoji: '\u2b50', type: 'glasses' },
        { id: '3d', name: '3D', emoji: '\ud83d\udc53', type: 'glasses' },
        { id: 'monocle', name: 'Monoculo', emoji: '\ud83e\udd30', type: 'glasses' },
        { id: 'swim', name: 'Natacion', emoji: '\ud83c\udfca', type: 'glasses' },
        { id: 'vr', name: 'VR', emoji: '\ud83d\uddfa\ufe0f', type: 'glasses' }
    ],
    backgrounds: [
        { id: 'none', name: 'Ninguno', emoji: '\u2b1c', type: 'background' },
        { id: 'beach', name: 'Playa', emoji: '\ud83c\udf76\ufe0f', type: 'background' },
        { id: 'space', name: 'Espacio', emoji: '\ud83d\ude80', type: 'background' },
        { id: 'city', name: 'Ciudad', emoji: '\ud83c\udf99\ufe0f', type: 'background' },
        { id: 'forest', name: 'Bosque', emoji: '\ud83c\udf33', type: 'background' },
        { id: 'sunset', name: 'Atardecer', emoji: '\ud83c\udf05', type: 'background' },
        { id: 'party', name: 'Fiesta', emoji: '\ud83c\udf82', type: 'background' },
        { id: 'winter', name: 'Invierno', emoji: '\u2744\ufe0f', type: 'background' }
    ],
    effects: [
        { id: 'none', name: 'Ninguno', emoji: '\u2728', type: 'effect' },
        { id: 'bokeh', name: 'Bokeh', emoji: '\ud83d\udcab', type: 'effect' },
        { id: 'sparkles', name: 'Destellos', emoji: '\u2728', type: 'effect' },
        { id: 'hearts', name: 'Corazones', emoji: '\ud83d\udc96', type: 'effect' },
        { id: 'stars', name: 'Estrellas', emoji: '\ud83c\udf1f', type: 'effect' },
        { id: 'bubbles', name: 'Burbujas', emoji: '\ud83e\uddf7', type: 'effect' },
        { id: 'fireworks', name: 'Fuegos', emoji: '\ud83c\udf86', type: 'effect' },
        { id: 'glitch', name: 'Glitch', emoji: '\ud83d\udcfa', type: 'effect' }
    ]
};

// Background colors for different backgrounds
const backgroundColors = {
    none: '#000000',
    beach: '#87CEEB',
    space: '#000000',
    city: '#2F4F4F',
    forest: '#228B22',
    sunset: '#FF8C00',
    party: '#FF69B4',
    winter: '#E0F6FF'
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    cameraView = document.getElementById('cameraView');
    compositeCanvas = document.getElementById('compositeCanvas');
    compositeCtx = compositeCanvas.getContext('2d');
    createPhotoSlots();
    loadProps();
    initializeCamera();
});

// ===== Camera Functions =====
async function initializeCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
        });
        cameraView.srcObject = stream;
        updateStatus('Camara lista');
    } catch (error) {
        showErrorModal('No se pudo acceder a la camara: ' + error.message);
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// ===== Photo Booth Functions =====
function startPhotoBooth() {
    if (!stream) {
        showErrorModal('Camara no disponible.');
        return;
    }
    if (isSessionRunning) return;
    isSessionRunning = true;
    photos = [];
    currentPhotoIndex = 0;
    updateStatus('Preparate!');
    document.getElementById('startBtn').disabled = true;
    document.getElementById('takePhotoBtn').disabled = false;
    document.getElementById('stopBtn').disabled = false;
    startCountdown();
}

function startCountdown() {
    if (isCountingDown) return;
    isCountingDown = true;
    let countdown = countdownTime;
    const countdownDisplay = document.getElementById('countdownDisplay');
    const statusText = document.getElementById('statusText');
    countdownDisplay.style.display = 'block';
    statusText.style.display = 'none';
    function updateCountdown() {
        countdownDisplay.textContent = countdown;
        if (countdown <= 0) {
            countdownDisplay.style.display = 'none';
            statusText.style.display = 'block';
            updateStatus('Sonrie!');
            isCountingDown = false;
            takePhoto();
            return;
        }
        countdown--;
        countdownTimeout = setTimeout(updateCountdown, 1000);
    }
    updateCountdown();
}

function takePhoto() {
    if (!stream || !isSessionRunning) return;
    playShutterSound();
    capturePhoto().then(() => {
        currentPhotoIndex++;
        if (currentPhotoIndex >= photoCount) {
            endPhotoSession();
            return;
        }
        updateStatus(`Foto ${currentPhotoIndex}/${photoCount}. Siguiente en ${timeBetweenPhotos}s...`);
        photoTimeout = setTimeout(() => {
            playBeepSound();
            takePhoto();
        }, timeBetweenPhotos * 1000);
    });
}

async function capturePhoto() {
    return new Promise((resolve) => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const videoWidth = cameraView.videoWidth;
        const videoHeight = cameraView.videoHeight;
        tempCanvas.width = videoWidth;
        tempCanvas.height = videoHeight;
        tempCtx.drawImage(cameraView, 0, 0, videoWidth, videoHeight);
        applyPropsToImage(tempCanvas, tempCtx);
        tempCanvas.toBlob((blob) => {
            const photoUrl = URL.createObjectURL(blob);
            photos.push(photoUrl);
            updatePhotoStrip();
            triggerConfetti();
            resolve();
        }, 'image/jpeg', 0.92);
    });
}

function applyPropsToImage(canvas, ctx) {
    const width = canvas.width;
    const height = canvas.height;
    if (selectedProps.background && selectedProps.background !== 'none') {
        const bgColor = backgroundColors[selectedProps.background] || '#000000';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(cameraView, 0, 0, width, height);
    }
    if (selectedProps.filter && selectedProps.filter !== 'none') {
        applyFilter(ctx, width, height, selectedProps.filter);
    }
    if (selectedProps.hat && selectedProps.hat !== 'none') {
        applyHat(ctx, width, height, selectedProps.hat);
    }
    if (selectedProps.glasses && selectedProps.glasses !== 'none') {
        applyGlasses(ctx, width, height, selectedProps.glasses);
    }
    if (selectedProps.effect && selectedProps.effect !== 'none') {
        applyEffect(ctx, width, height, selectedProps.effect);
    }
}

function endPhotoSession() {
    isSessionRunning = false;
    if (countdownTimeout) clearTimeout(countdownTimeout);
    if (photoTimeout) clearTimeout(photoTimeout);
    document.getElementById('startBtn').disabled = false;
    document.getElementById('takePhotoBtn').disabled = true;
    document.getElementById('stopBtn').disabled = true;
    updateStatus('Sesion completada!');
    if (photos.length > 0) {
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('shareBtn').disabled = false;
    }
    triggerConfetti();
    playCelebrationSound();
}

function stopPhotoBooth() {
    if (!isSessionRunning) return;
    isSessionRunning = false;
    if (countdownTimeout) clearTimeout(countdownTimeout);
    if (photoTimeout) clearTimeout(photoTimeout);
    document.getElementById('startBtn').disabled = false;
    document.getElementById('takePhotoBtn').disabled = true;
    document.getElementById('stopBtn').disabled = true;
    updateStatus('Sesion detenida');
}

// ===== Filter Functions =====
function applyFilter(ctx, width, height, filterId) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    switch (filterId) {
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
            }
            break;
        case 'grayscale':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            break;
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;
        case 'vintage':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.1);
                data[i + 1] = Math.min(255, data[i + 1] * 0.9);
                data[i + 2] = Math.min(255, data[i + 2] * 0.8);
            }
            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 20 - 10;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
            }
            break;
        case 'warm':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.1);
                data[i + 1] = Math.min(255, data[i + 1] * 0.95);
                data[i + 2] = Math.min(255, data[i + 2] * 0.85);
            }
            break;
        case 'cool':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 0.85);
                data[i + 1] = Math.min(255, data[i + 1] * 0.95);
                data[i + 2] = Math.min(255, data[i + 2] * 1.1);
            }
            break;
    }
    ctx.putImageData(imageData, 0, 0);
}

// ===== Hat Drawing Functions =====
function applyHat(ctx, width, height, hatId) {
    const hatSize = Math.min(width, height) * 0.3;
    const x = width / 2 - hatSize / 2;
    const y = height * 0.15;
    ctx.save();
    switch (hatId) {
        case 'cowboy':
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 2, hatSize / 2, hatSize / 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 2, hatSize / 1.5, hatSize / 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + hatSize / 2, y + hatSize / 4);
            ctx.lineTo(x + hatSize / 2, y + hatSize / 2);
            ctx.stroke();
            break;
        case 'crown':
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 2, hatSize / 2, hatSize / 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const pointX = x + hatSize / 2 + Math.cos(angle) * hatSize / 2;
                const pointY = y + hatSize / 2 + Math.sin(angle) * hatSize / 4;
                ctx.beginPath();
                ctx.moveTo(pointX, pointY);
                ctx.lineTo(pointX + Math.cos(angle) * hatSize / 4, pointY + Math.sin(angle) * hatSize / 4);
                ctx.lineTo(pointX + Math.cos(angle + 0.2) * hatSize / 6, pointY + Math.sin(angle + 0.2) * hatSize / 6);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'santa':
            ctx.fillStyle = '#FF0000';
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + hatSize / 2);
            ctx.quadraticCurveTo(x + hatSize / 2, y - hatSize / 4, x + hatSize, y + hatSize / 2);
            ctx.lineTo(x, y + hatSize / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(x, y + hatSize / 2);
            ctx.quadraticCurveTo(x + hatSize / 2, y - hatSize / 4, x + hatSize, y + hatSize / 2);
            ctx.stroke();
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.ellipse(x + hatSize, y + hatSize / 2, hatSize / 8, hatSize / 8, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'party':
            ctx.fillStyle = getRandomColor();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + hatSize / 2, y);
            ctx.lineTo(x, y + hatSize);
            ctx.lineTo(x + hatSize, y + hatSize);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'chef':
            ctx.fillStyle = '#FFF';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 2, hatSize / 2, hatSize / 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 4, hatSize / 4, hatSize / 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'pirate':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + hatSize / 2);
            ctx.quadraticCurveTo(x + hatSize / 2, y - hatSize / 4, x + hatSize / 1.5, y + hatSize / 4);
            ctx.quadraticCurveTo(x + hatSize / 2, y + hatSize / 2, x, y + hatSize / 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 3, y + hatSize / 4, hatSize / 10, hatSize / 10, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'graduation':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(x + hatSize / 4, y, hatSize / 2, hatSize / 4);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 4, hatSize / 12, hatSize / 8, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'witch':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#8B0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y + hatSize / 2);
            ctx.lineTo(x + hatSize / 2, y - hatSize / 4);
            ctx.lineTo(x + hatSize, y + hatSize / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(x + hatSize / 2, y + hatSize / 2, hatSize / 1.5, hatSize / 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
    }
    ctx.restore();
}

// ===== Glasses Drawing Functions =====
function applyGlasses(ctx, width, height, glassesId) {
    const glassesWidth = width * 0.4;
    const glassesHeight = height * 0.15;
    const x = width / 2 - glassesWidth / 2;
    const y = height * 0.4;
    ctx.save();
    switch (glassesId) {
        case 'sunglasses':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(x + glassesWidth / 4, y + glassesHeight / 2 - 2, glassesWidth / 2, 4);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x - glassesWidth / 8, y + glassesHeight / 2);
            ctx.lineTo(x - glassesWidth / 2, y + glassesHeight / 2);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + glassesWidth + glassesWidth / 8, y + glassesHeight / 2);
            ctx.lineTo(x + glassesWidth + glassesWidth / 2, y + glassesHeight / 2);
            ctx.stroke();
            break;
        case 'nerd':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 5, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 5, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.rect(x + glassesWidth / 4 + glassesWidth / 5, y + glassesHeight / 2 - 1, glassesWidth / 2 - glassesWidth / 5 * 2, 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, y + glassesHeight / 2);
            ctx.lineTo(x - glassesWidth / 3, y + glassesHeight / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + glassesWidth, y + glassesHeight / 2);
            ctx.lineTo(x + glassesWidth + glassesWidth / 3, y + glassesHeight / 2);
            ctx.stroke();
            break;
        case 'heart':
            ctx.fillStyle = '#FF69B4';
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 3;
            drawHeart(ctx, x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 5);
            drawHeart(ctx, x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 5);
            ctx.beginPath();
            ctx.moveTo(x + glassesWidth / 4 + glassesWidth / 10, y + glassesHeight / 2);
            ctx.quadraticCurveTo(x + glassesWidth / 2, y + glassesHeight / 4, x + glassesWidth * 3/4 - glassesWidth / 10, y + glassesHeight / 2);
            ctx.stroke();
            break;
        case 'star':
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            drawStar(ctx, x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 5, glassesWidth / 8);
            drawStar(ctx, x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 5, glassesWidth / 8);
            ctx.beginPath();
            ctx.moveTo(x + glassesWidth / 4 + glassesWidth / 6, y + glassesHeight / 2);
            ctx.lineTo(x + glassesWidth * 3/4 - glassesWidth / 6, y + glassesHeight / 2);
            ctx.stroke();
            break;
        case '3d':
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 5, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0000FF';
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 5, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 5 + 3, glassesHeight / 2 + 3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 5 + 3, glassesHeight / 2 + 3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(x + glassesWidth / 4 + glassesWidth / 5, y + glassesHeight / 2 - 2, glassesWidth / 2 - glassesWidth / 5 * 2, 4);
            ctx.fill();
            break;
        case 'monocle':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 2, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + glassesWidth / 2 + glassesWidth / 4, y + glassesHeight / 2);
            ctx.quadraticCurveTo(x + glassesWidth, y + glassesHeight / 4, x + glassesWidth + glassesWidth / 4, y + glassesHeight / 2);
            ctx.stroke();
            break;
        case 'swim':
            ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';
            ctx.strokeStyle = '#0064C8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(x + glassesWidth / 4 + glassesWidth / 8, y + glassesHeight / 2 - 2, glassesWidth / 2 - glassesWidth / 4, 4);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x - glassesWidth / 8, y + glassesHeight / 2);
            ctx.quadraticCurveTo(x - glassesWidth / 2, y - glassesHeight / 2, x + glassesWidth + glassesWidth / 2, y + glassesHeight / 2);
            ctx.stroke();
            break;
        case 'vr':
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.rect(x, y, glassesWidth, glassesHeight);
            ctx.fill();
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth / 4, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + glassesWidth * 3/4, y + glassesHeight / 2, glassesWidth / 4, glassesHeight / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + glassesHeight / 2);
            ctx.lineTo(x - glassesWidth / 3, y + glassesHeight / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + glassesWidth, y + glassesHeight / 2);
            ctx.lineTo(x + glassesWidth + glassesWidth / 3, y + glassesHeight / 2);
            ctx.stroke();
            break;
    }
    ctx.restore();
}

// ===== Effect Functions =====
function applyEffect(ctx, width, height, effectId) {
    switch (effectId) {
        case 'bokeh':
            for (let i = 0; i < 10; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 20 + 10;
                const opacity = Math.random() * 0.3 + 0.1;
                const color = getRandomPastelColor();
                ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                ctx.beginPath();
                ctx.ellipse(x, y, size / 2, size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'sparkles':
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 8 + 4;
                const angle = Math.random() * Math.PI * 2;
                ctx.fillStyle = '#FFF';
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let j = 0; j < 5; j++) {
                    const outerRadius = size;
                    const innerRadius = size / 2;
                    const outerX = x + Math.cos(angle + j * Math.PI * 2 / 5) * outerRadius;
                    const outerY = y + Math.sin(angle + j * Math.PI * 2 / 5) * outerRadius;
                    const innerX = x + Math.cos(angle + (j + 0.5) * Math.PI * 2 / 5) * innerRadius;
                    const innerY = y + Math.sin(angle + (j + 0.5) * Math.PI * 2 / 5) * innerRadius;
                    if (j === 0) ctx.moveTo(outerX, outerY);
                    else ctx.lineTo(outerX, outerY);
                    ctx.lineTo(innerX, innerY);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'hearts':
            for (let i = 0; i < 8; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 15 + 10;
                const color = getRandomColor();
                ctx.fillStyle = color;
                ctx.strokeStyle = darkenColor(color, 30);
                ctx.lineWidth = 1;
                drawHeart(ctx, x, y, size);
            }
            break;
        case 'stars':
            for (let i = 0; i < 12; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const outerRadius = Math.random() * 10 + 8;
                const innerRadius = outerRadius / 2;
                const angle = Math.random() * Math.PI * 2;
                const color = getRandomColor();
                ctx.fillStyle = color;
                ctx.strokeStyle = darkenColor(color, 30);
                ctx.lineWidth = 1;
                drawStar(ctx, x, y, outerRadius, innerRadius, angle);
            }
            break;
        case 'bubbles':
            for (let i = 0; i < 10; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 25 + 10;
                const opacity = Math.random() * 0.4 + 0.2;
                ctx.fillStyle = `rgba(200, 255, 255, ${opacity})`;
                ctx.strokeStyle = `rgba(100, 200, 255, ${opacity + 0.2})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(x, y, size / 2, size / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity + 0.3})`;
                ctx.beginPath();
                ctx.ellipse(x - size / 4, y - size / 4, size / 6, size / 6, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'fireworks':
            for (let i = 0; i < 3; i++) {
                const centerX = Math.random() * width;
                const centerY = Math.random() * height / 2 + height / 4;
                const color = getRandomVibrantColor();
                const particleCount = 15;
                for (let j = 0; j < particleCount; j++) {
                    const angle = (j / particleCount) * Math.PI * 2;
                    const distance = Math.random() * 50 + 20;
                    const x = centerX + Math.cos(angle) * distance;
                    const y = centerY + Math.sin(angle) * distance;
                    const size = Math.random() * 4 + 2;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.ellipse(x, y, size / 2, size / 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        case 'glitch':
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (Math.random() < 0.05) {
                    const shift = Math.floor(Math.random() * 20) - 10;
                    const newIdx = Math.max(0, Math.min(data.length - 4, i + shift * 4));
                    data[i] = data[newIdx];
                    data[i + 1] = data[newIdx + 1];
                    data[i + 2] = data[newIdx + 2];
                }
            }
            for (let y = 0; y < height; y += Math.random() * 50 + 10) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    if (Math.random() < 0.3) {
                        data[idx] = 255 - data[idx];
                        data[idx + 1] = 255 - data[idx + 1];
                        data[idx + 2] = 255 - data[idx + 2];
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
            break;
    }
}

// ===== UI Functions =====
function createPhotoSlots() {
    const photoStrip = document.getElementById('photoStrip');
    photoStrip.innerHTML = '';
    for (let i = 0; i < photoCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'photo-slot';
        slot.id = `photoSlot${i}`;
        slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
        photoStrip.appendChild(slot);
    }
}

function updatePhotoStrip() {
    for (let i = 0; i < photoCount; i++) {
        const slot = document.getElementById(`photoSlot${i}`);
        if (i < photos.length) {
            slot.innerHTML = `<img src="${photos[i]}" alt="Foto ${i + 1}">`;
            slot.classList.add('filled');
        } else {
            slot.innerHTML = `<span class="slot-number">${i + 1}</span>`;
            slot.classList.remove('filled');
        }
    }
}

function loadProps() {
    const propsGrid = document.getElementById('propsGrid');
    propsGrid.innerHTML = '';
    const props = propsData[currentPropTab];
    props.forEach(prop => {
        const propItem = document.createElement('div');
        propItem.className = 'prop-item';
        propItem.id = `prop-${prop.type}-${prop.id}`;
        propItem.innerHTML = `<div class="prop-emoji">${prop.emoji}</div><div class="prop-name">${prop.name}</div>`;
        if (selectedProps[prop.type] === prop.id) propItem.classList.add('selected');
        propItem.onclick = () => selectProp(prop.type, prop.id);
        propsGrid.appendChild(propItem);
    });
}

function switchPropTab(tab) {
    currentPropTab = tab;
    document.querySelectorAll('.prop-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
        if (tabBtn.textContent.trim() === getTabName(tab)) tabBtn.classList.add('active');
    });
    loadProps();
}

function getTabName(tab) {
    const tabNames = { filters: 'Filtros', hats: 'Sombreros', glasses: 'Gafas', backgrounds: 'Fondos', effects: 'Efectos' };
    return tabNames[tab] || tab;
}

function selectProp(type, id) {
    if (selectedProps[type] === id) selectedProps[type] = null;
    else selectedProps[type] = id;
    loadProps();
    updateStatus(`Accesorio: ${getPropName(type, id) || 'Ninguno'}`);
}

function getPropName(type, id) {
    if (!id || id === 'none') return null;
    const props = propsData[type];
    if (!props) return null;
    const prop = props.find(p => p.id === id);
    return prop ? prop.name : null;
}

function selectPhotoCount(count) {
    photoCount = parseInt(count);
    document.querySelectorAll('.photo-option').forEach(option => {
        option.classList.remove('selected');
        if (parseInt(option.dataset.count) === count) option.classList.add('selected');
    });
    createPhotoSlots();
    updateStatus(`Fotos: ${photoCount}`);
}

function updateTimeBetweenPhotos(value) {
    timeBetweenPhotos = parseInt(value);
    document.getElementById('timeBetweenPhotosValue').textContent = `${value}s`;
    updateStatus(`Tiempo entre fotos: ${value}s`);
}

function updateCountdownTime(value) {
    countdownTime = parseInt(value);
    document.getElementById('countdownTimeValue').textContent = `${value}s`;
    updateStatus(`Cuenta atras: ${value}s`);
}

function updateStatus(message) {
    document.getElementById('statusText').textContent = message;
}

function clearPhotos() {
    photos = [];
    updatePhotoStrip();
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('shareBtn').disabled = true;
    updateStatus('Fotos eliminadas');
}

// ===== Download Functions =====
function downloadPhotoStrip() {
    if (photos.length === 0) return;
    const stripCanvas = document.createElement('canvas');
    const stripCtx = stripCanvas.getContext('2d');
    const photoWidth = 200, photoHeight = 250, margin = 20;
    const stripWidth = photoWidth * photos.length + margin * (photos.length + 1);
    const stripHeight = photoHeight + margin * 2;
    stripCanvas.width = stripWidth; stripCanvas.height = stripHeight;
    stripCtx.fillStyle = '#1a1a2e'; stripCtx.fillRect(0, 0, stripWidth, stripHeight);
    stripCtx.strokeStyle = '#4ecdc4'; stripCtx.lineWidth = 4;
    stripCtx.strokeRect(10, 10, stripWidth - 20, stripHeight - 20);
    stripCtx.fillStyle = '#ffe66d'; stripCtx.font = 'bold 24px Comic Sans MS, cursive';
    stripCtx.textAlign = 'center';
    stripCtx.fillText('Super Fotomatron Divertido', stripWidth / 2, 40);
    stripCtx.fillStyle = '#ff6b6b'; stripCtx.font = '16px Comic Sans MS, cursive';
    stripCtx.fillText(new Date().toLocaleDateString('es-ES'), stripWidth / 2, 65);
    let photosLoaded = 0;
    photos.forEach((photoUrl, index) => {
        const img = new Image();
        img.onload = () => {
            const x = margin + index * (photoWidth + margin);
            const y = margin + 80;
            stripCtx.strokeStyle = '#ff6b6b'; stripCtx.lineWidth = 3;
            stripCtx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10);
            stripCtx.drawImage(img, x, y, photoWidth, photoHeight);
            stripCtx.fillStyle = '#ffe66d'; stripCtx.font = 'bold 20px Comic Sans MS, cursive';
            stripCtx.fillText(`${index + 1}`, x + photoWidth / 2, y + photoHeight + 30);
            photosLoaded++;
            if (photosLoaded === photos.length) {
                const link = document.createElement('a');
                link.download = `fotomatron-${new Date().toISOString().slice(0, 10)}.jpg`;
                link.href = stripCanvas.toDataURL('image/jpeg', 0.92);
                link.click(); updateStatus('Descarga completada!');
            }
        };
        img.onerror = () => { photosLoaded++; if (photosLoaded === photos.length) updateStatus('Error al crear tira'); };
        img.src = photoUrl;
    });
}

async function sharePhotoStrip() {
    if (photos.length === 0) return;
    try {
        const stripCanvas = document.createElement('canvas');
        const stripCtx = stripCanvas.getContext('2d');
        const photoWidth = 200, photoHeight = 250, margin = 20;
        const stripWidth = photoWidth * photos.length + margin * (photos.length + 1);
        const stripHeight = photoHeight + margin * 2;
        stripCanvas.width = stripWidth; stripCanvas.height = stripHeight;
        stripCtx.fillStyle = '#1a1a2e'; stripCtx.fillRect(0, 0, stripWidth, stripHeight);
        stripCtx.strokeStyle = '#4ecdc4'; stripCtx.lineWidth = 4;
        stripCtx.strokeRect(10, 10, stripWidth - 20, stripHeight - 20);
        stripCtx.fillStyle = '#ffe66d'; stripCtx.font = 'bold 24px Comic Sans MS, cursive';
        stripCtx.textAlign = 'center';
        stripCtx.fillText('Super Fotomatron Divertido', stripWidth / 2, 40);
        stripCtx.fillStyle = '#ff6b6b'; stripCtx.font = '16px Comic Sans MS, cursive';
        stripCtx.fillText(new Date().toLocaleDateString('es-ES'), stripWidth / 2, 65);
        const images = await Promise.all(photos.map(photoUrl => {
            return new Promise(resolve => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => resolve(null); img.src = photoUrl; });
        }));
        images.forEach((img, index) => {
            if (!img) return;
            const x = margin + index * (photoWidth + margin); const y = margin + 80;
            stripCtx.strokeStyle = '#ff6b6b'; stripCtx.lineWidth = 3;
            stripCtx.strokeRect(x - 5, y - 5, photoWidth + 10, photoHeight + 10);
            stripCtx.drawImage(img, x, y, photoWidth, photoHeight);
            stripCtx.fillStyle = '#ffe66d'; stripCtx.font = 'bold 20px Comic Sans MS, cursive';
            stripCtx.fillText(`${index + 1}`, x + photoWidth / 2, y + photoHeight + 30);
        });
        const blob = await new Promise(resolve => stripCanvas.toBlob(resolve, 'image/jpeg', 0.92));
        if (navigator.share) {
            await navigator.share({ title: 'Super Fotomatron Divertido', text: 'Mira mi tira de fotos!', files: [new File([blob], `fotomatron-${new Date().toISOString().slice(0, 10)}.jpg`, { type: 'image/jpeg' })] });
            updateStatus('Compartido!');
        } else downloadPhotoStrip();
    } catch (error) { console.error('Error sharing:', error); updateStatus('Error al compartir'); downloadPhotoStrip(); }
}

// ===== Error Handling =====
function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('active');
}

function closeErrorModal() {
    document.getElementById('errorModal').classList.remove('active');
    initializeCamera();
}

// ===== Effects Functions =====
function triggerConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    confettiContainer.innerHTML = '';
    confettiContainer.classList.add('active');
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff9ff3', '#54a0ff', '#a55eea'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confettiContainer.appendChild(confetti);
    }
    setTimeout(() => confettiContainer.classList.remove('active'), 3000);
}

function playShutterSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 0.1;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
        const envelope = audioCtx.createGain();
        envelope.gain.setValueAtTime(0.5, audioCtx.currentTime);
        envelope.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        noise.connect(envelope); envelope.connect(audioCtx.destination);
        noise.start(audioCtx.currentTime); noise.stop(audioCtx.currentTime + 0.1);
    } catch (error) {}
}

function playBeepSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
        oscillator.start(audioCtx.currentTime); oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (error) {}
}

function playCelebrationSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const frequencies = [440, 550, 660];
        frequencies.forEach(freq => {
            const osc = audioCtx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.5);
        });
    } catch (error) {}
}

// ===== Helper Functions =====
function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y, x, y + size / 2);
    ctx.bezierCurveTo(x + size, y, x + size / 2, y - size / 2, x, y - size / 2);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
}

function drawStar(ctx, x, y, outerRadius, innerRadius, rotation = 0) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const outerAngle = rotation + i * Math.PI * 2 / 5;
        const innerAngle = rotation + (i + 0.5) * Math.PI * 2 / 5;
        const outerX = x + Math.cos(outerAngle) * outerRadius;
        const outerY = y + Math.sin(outerAngle) * outerRadius;
        const innerX = x + Math.cos(innerAngle) * innerRadius;
        const innerY = y + Math.sin(innerAngle) * innerRadius;
        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
}

function getRandomColor() {
    const colors = ['#FF69B4', '#FF6347', '#FFD700', '#9370DB', '#32CD32', '#1E90FF', '#FF8C00', '#FF1493'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomPastelColor() {
    const colors = ['#FFD1DC', '#FFE5B4', '#B5EAD7', '#C7CEEA', '#E2F0CB', '#FFB7B7', '#F8C8DC', '#B2E2E2'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomVibrantColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + (R * 0x10000) + (G * 0x100) + B).toString(16).slice(1);
}

// ===== Cleanup =====
window.addEventListener('beforeunload', function() {
    stopCamera();
    photos.forEach(url => URL.revokeObjectURL(url));
});
