// ── Curated palette seeds ──────────────────────────────────────
const palettes = [
    ['#1A73E8', '#0D47A1', '#1565C0'],
    ['#E53935', '#C62828', '#B71C1C'],
    ['#43A047', '#2E7D32', '#1B5E20'],
    ['#FB8C00', '#E65100', '#BF360C'],
    ['#8E24AA', '#6A1B9A', '#4A148C'],
    ['#00ACC1', '#00838F', '#006064'],
    ['#F4511E', '#BF360C', '#7F0000'],
    ['#3949AB', '#283593', '#1A237E'],
    ['#039BE5', '#0277BD', '#01579B'],
    ['#00897B', '#00695C', '#004D40'],
    ['#FFB300', '#F57F17', '#E65100'],
    ['#D81B60', '#AD1457', '#880E4F'],
    ['#5E35B1', '#4527A0', '#311B92'],
    ['#546E7A',
    ];

let history = [];
let current = '#1A73E8';

// ── Helpers ───────────────────────────────────────────────────
function hexToRgb(hex) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

function luminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function randomHex() {
    const p = palettes[Math.floor(Math.random() * palettes.length)];
    const base = p[Math.floor(Math.random() * p.length)];
    const [r, g, b] = hexToRgb(base);
    const nr = Math.min(255, Math.max(0, r + Math.floor((Math.random() - 0.5) * 60)));
    const ng = Math.min(255, Math.max(0, g + Math.floor((Math.random() - 0.5) * 60)));
    const nb = Math.min(255, Math.max(0, b + Math.floor((Math.random() - 0.5) * 60)));
    return '#' + [nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// ── Apply a color to the UI ───────────────────────────────────
function applyColor(hex, addHistory) {
    const [r, g, b] = hexToRgb(hex);
    const lum = luminance(r, g, b);
    const fg = lum > 145 ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.95)';
    const fgBorder = lum > 145 ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.38)';
    const pillBg = lum > 145 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)';
    const pillBdr = lum > 145 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)';
    const btnBg = lum > 145 ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.18)';
    const btnBdr = lum > 145 ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.55)';

    // Page + swatch background
    document.body.style.background = hex;
    const swatch = document.getElementById('swatch');
    swatch.style.background = hex;
    swatch.style.borderColor = fgBorder;

    // Hex code
    document.getElementById('color-code').textContent = hex;
    document.getElementById('color-code').style.color = fg;

    // Labels / toast
    document.getElementById('top-label').style.color = fg;
    document.getElementById('hist-label').style.color = fg;
    document.getElementById('copy-toast').style.color = fg;

    // RGB pills
    document.getElementById('r-pill').textContent = 'R: ' + r;
    document.getElementById('g-pill').textContent = 'G: ' + g;
    document.getElementById('b-pill').textContent = 'B: ' + b;
    ['r-pill', 'g-pill', 'b-pill'].forEach(id => {
        const el = document.getElementById(id);
        el.style.color = fg;
        el.style.background = pillBg;
        el.style.borderColor = pillBdr;
    });

    // Code wrap
    const wrap = document.querySelector('.color-code-wrap');
    wrap.style.borderColor = fgBorder;
    wrap.style.background = lum > 145 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.18)';

    // Flip button
    const btn = document.getElementById('flip-btn');
    btn.style.color = fg;
    btn.style.borderColor = btnBdr;
    btn.style.background = btnBg;

    // History
    if (addHistory && current !== hex) {
        history.unshift(current);
        if (history.length > 7) history.pop();
        renderHistory();
    }
    current = hex;
}

// ── Flip to a new random color ────────────────────────────────
function flipColor() {
    const hex = randomHex();
    const swatch = document.getElementById('swatch');
    swatch.classList.remove('pulse');
    void swatch.offsetWidth; // trigger reflow to restart animation
    swatch.classList.add('pulse');
    applyColor(hex, true);
}

// ── Render history dots ───────────────────────────────────────
function renderHistory() {
    const row = document.getElementById('history-row');
    row.innerHTML = '';
    history.forEach(hex => {
        const dot = document.createElement('div');
        dot.className = 'hist-dot';
        dot.style.background = hex;
        dot.title = hex;
        dot.onclick = () => applyColor(hex, false);
        row.appendChild(dot);
    });
}

// ── Copy hex to clipboard ─────────────────────────────────────
function copyHex() {
    navigator.clipboard.writeText(current).catch(() => { });
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1200);
}



// ── Init ──────────────────────────────────────────────────────
applyColor('#1A73E8', false);

