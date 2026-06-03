const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const W = 800, H = 450;

let pattern = 'waves';
let bg = '#0f0c29', ac = '#8a6fff', s2 = '#00d4aa';
let speedMult = 1, density = 5, size = 5;
let t = 0;

// --- Helpers ---
function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function lerpColor(a, b, n) {
    const [ar, ag, ab] = hexToRgb(a), [br, bg2, bb] = hexToRgb(b);
    return `rgb(${Math.round(ar + (br - ar) * n)},${Math.round(ag + (bg2 - ag) * n)},${Math.round(ab + (bb - ab) * n)})`;
}

// --- Particles state ---
const particles = Array.from({ length: 200 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
}));

// --- Blobs state ---
const blobs = Array.from({ length: 6 }, (_, i) => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 80 + Math.random() * 120,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
    color: i % 2 === 0 ? 'ac' : 's2'
}));

// --- Draw functions ---
function drawWaves() {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const count = Math.round(density * 1.5) + 2;
    for (let i = 0; i < count; i++) {
        const prog = i / count;
        const amp = (size / 10) * 60 + 20;
        const freq = (density / 10) * 0.015 + 0.003;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
            const y = H * 0.5 + H * 0.25 * prog
                - amp * Math.sin(freq * x * 2 + t + i * 1.1)
                - amp * 0.5 * Math.sin(freq * x * 3.3 + t * 1.3 + i);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        const col = lerpColor(ac, s2, prog);
        ctx.fillStyle = col + '55'; ctx.fill();
        ctx.strokeStyle = col + 'aa'; ctx.lineWidth = 1.5; ctx.stroke();
    }
}

function updateParticles() {
    const count = Math.round(density * 15) + 20;
    for (let i = 0; i < count; i++) {
        const p = particles[i % particles.length];
        p.x += p.vx * speedMult; p.y += p.vy * speedMult;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
    }
}

function drawParticles() {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const count = Math.round(density * 15) + 20;
    const pr = (size / 10) * 4 + 1;
    for (let i = 0; i < count; i++) {
        const p = particles[i % particles.length];
        const col = i % 2 === 0 ? ac : s2;
        ctx.beginPath(); ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = col + 'cc'; ctx.fill();
        const thresh = (density / 10) * 120 + 60;
        for (let j = i + 1; j < Math.min(i + 6, count); j++) {
            const q = particles[j % particles.length];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < thresh) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                const alpha = Math.round((1 - d / thresh) * 80).toString(16).padStart(2, '0');
                ctx.strokeStyle = ac + alpha;
                ctx.lineWidth = .5; ctx.stroke();
            }
        }
    }
}

function drawGrid() {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const step = Math.round((11 - density) * 20) + 15;
    const lw = (size / 10) * 2 + .3;
    for (let x = 0; x <= W; x += step) {
        const bright = Math.abs(Math.sin(x * .02 + t)) * .6 + .15;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = ac + Math.round(bright * 200).toString(16).padStart(2, '0');
        ctx.lineWidth = lw; ctx.stroke();
    }
    for (let y = 0; y <= H; y += step) {
        const bright = Math.abs(Math.sin(y * .02 + t * .7)) * .6 + .15;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = s2 + Math.round(bright * 200).toString(16).padStart(2, '0');
        ctx.lineWidth = lw; ctx.stroke();
    }
    for (let x = 0; x <= W; x += step) {
        for (let y = 0; y <= H; y += step) {
            const glow = Math.abs(Math.sin(x * .02 + y * .015 + t));
            if (glow > .5) {
                ctx.beginPath(); ctx.arc(x, y, (size / 10) * 3 + 1, 0, Math.PI * 2);
                ctx.fillStyle = lerpColor(ac, s2, x / W) + '88'; ctx.fill();
            }
        }
    }
}

function drawBlobs() {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (const b of blobs) {
        const col = b.color === 'ac' ? ac : s2;
        const r = b.r * (size / 5 + .5);
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, col + '99'); grad.addColorStop(1, col + '00');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
        b.x += b.vx * speedMult; b.y += b.vy * speedMult;
        if (b.x < -b.r || b.x > W + b.r) b.vx *= -1;
        if (b.y < -b.r || b.y > H + b.r) b.vy *= -1;
    }
}

function drawNoise() {
    const id = ctx.createImageData(W, H);
    const d = id.data;
    const [br, bg2, bb] = hexToRgb(bg);
    const [ar, ag, ab] = hexToRgb(ac);
    const [sr, sg, sb] = hexToRgb(s2);
    const freq = (density / 10) * .02 + .004;
    const scale = size / 5 + .5;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const n = Math.sin(x * freq + t) * Math.cos(y * freq * .7 + t * .8)
                + Math.sin((x + y) * freq * .5 + t * .6);
            const n2 = Math.sin(x * freq * .4 + t * .5) * Math.cos(y * freq * .3 + t * .9) * scale;
            const v = (n + n2 + 2) / 4;
            d[i] = Math.round(br + (v > .5 ? ar : sr) * v);
            d[i + 1] = Math.round(bg2 + (v > .5 ? ag : sg) * v);
            d[i + 2] = Math.round(bb + (v > .5 ? ab : sb) * v);
            d[i + 3] = 255;
        }
    }
    ctx.putImageData(id, 0, 0);
}

function drawLines() {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const count = Math.round(density * 3) + 5;
    for (let i = 0; i < count; i++) {
        const prog = i / count;
        const phase = t + i * 0.7;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
            const y = H * prog + Math.sin(x * .008 + phase) * 30 + Math.cos(x * .015 + phase * .6) * 15;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const alpha = Math.round(120 + prog * 80).toString(16);
        ctx.strokeStyle = lerpColor(ac, s2, prog) + alpha;
        ctx.lineWidth = (size / 10) * 4 + .5;
        ctx.stroke();
    }
}

// --- Animation loop ---
function animate() {
    if (speedMult > 0) t += 0.012 * speedMult;
    if (pattern === 'particles') updateParticles();
    switch (pattern) {
        case 'waves': drawWaves(); break;
        case 'particles': drawParticles(); break;
        case 'grid': drawGrid(); break;
        case 'blobs': drawBlobs(); break;
        case 'noise': drawNoise(); break;
        case 'lines': drawLines(); break;
    }
    requestAnimationFrame(animate);
}
animate();

// --- Controls ---
document.querySelectorAll('#pattern-pills .pill').forEach(p => {
    p.onclick = () => {
        document.querySelectorAll('#pattern-pills .pill').forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        pattern = p.dataset.v;
    };
});

document.querySelectorAll('#speed-btns .speed-btn').forEach(b => {
    b.onclick = () => {
        document.querySelectorAll('#speed-btns .speed-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        speedMult = parseFloat(b.dataset.v);
    };
});

document.getElementById('c-bg').oninput = e => { bg = e.target.value; };
document.getElementById('c-ac').oninput = e => { ac = e.target.value; };
document.getElementById('c-s2').oninput = e => { s2 = e.target.value; };

document.getElementById('density').oninput = e => {
    density = parseInt(e.target.value);
    document.getElementById('density-out').textContent = e.target.value;
};

document.getElementById('size').oninput = e => {
    size = parseInt(e.target.value);
    document.getElementById('size-out').textContent = e.target.value;
};

document.getElementById('dl-btn').onclick = () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'background.png';
    a.click();
};

