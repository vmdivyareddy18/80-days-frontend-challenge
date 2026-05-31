
let remaining = 0;
let interval = null;
let running = false;

const dispH = document.getElementById('dispH');
const dispM = document.getElementById('dispM');
const dispS = document.getElementById('dispS');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const banner = document.getElementById('doneBanner');

function pad(n) { return String(n).padStart(2, '0'); }

function updateDisplay(secs) {
    dispH.textContent = pad(Math.floor(secs / 3600));
    dispM.textContent = pad(Math.floor((secs % 3600) / 60));
    dispS.textContent = pad(secs % 60);
}

function getInputSeconds() {
    const h = parseInt(document.getElementById('inputH').value) || 0;
    const m = parseInt(document.getElementById('inputM').value) || 0;
    const s = parseInt(document.getElementById('inputS').value) || 0;
    return h * 3600 + m * 60 + s;
}

function setInputsDisabled(d) {
    ['inputH', 'inputM', 'inputS'].forEach(id =>
        document.getElementById(id).disabled = d
    );
}

function startTimer() {
    if (running) return;
    if (remaining === 0) {
        remaining = getInputSeconds();
        if (remaining <= 0) return;
    }
    banner.style.display = 'none';
    running = true;
    setInputsDisabled(true);
    btnStart.disabled = true;
    btnPause.disabled = false;
    interval = setInterval(tick, 1000);
}

function tick() {
    remaining--;
    updateDisplay(remaining);
    if (remaining <= 0) {
        clearInterval(interval);
        running = false;
        btnStart.disabled = false;
        btnPause.disabled = true;
        banner.style.display = 'flex';
        if (document.getElementById('alarmCheck').checked) playAlarm();
    }
}

function pauseTimer() {
    if (!running) return;
    clearInterval(interval);
    running = false;
    btnStart.disabled = false;
    btnPause.disabled = true;
}

function resetTimer() {
    clearInterval(interval);
    running = false;
    remaining = 0;
    banner.style.display = 'none';
    btnStart.disabled = false;
    btnPause.disabled = true;
    setInputsDisabled(false);
    updateDisplay(0);
    ['inputH', 'inputM', 'inputS'].forEach(id =>
        document.getElementById(id).value = 0
    );
}

function playAlarm() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [880, 1100, 880, 1320].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            const t = ctx.currentTime + i * 0.28;
            gain.gain.setValueAtTime(0.35, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc.start(t);
            osc.stop(t + 0.25);
        });
    } catch (e) { }
}

updateDisplay(0);