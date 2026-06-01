let mode = 'metric';

// ── BMI Categories ─────────────────────────────────────
const CATEGORIES = [
    { max: 18.5, label: 'Underweight', color: '#3b82f6', status: 'Below healthy range' },
    { max: 25, label: 'Normal weight', color: '#16a34a', status: 'Within healthy range' },
    { max: 30, label: 'Overweight', color: '#ca8a04', status: 'Above healthy range' },
    { max: Infinity, label: 'Obese', color: '#dc2626', status: 'Well above healthy range' }
];

function getCategory(bmi) {
    return CATEGORIES.find(c => bmi < c.max);
}

// Map BMI (15–45) → percentage (0–100) for gauge position
function bmiToPercent(bmi) {
    const MIN = 15, MAX = 45;
    return Math.min(100, Math.max(0, ((bmi - MIN) / (MAX - MIN)) * 100));
}

// ── Unit Toggle ────────────────────────────────────────
function setUnit(unit) {
    mode = unit;

    document.getElementById('btn-metric').classList.toggle('active', unit === 'metric');
    document.getElementById('btn-imperial').classList.toggle('active', unit === 'imperial');

    document.getElementById('field-height-metric').style.display = unit === 'metric' ? '' : 'none';
    document.getElementById('field-height-imperial').style.display = unit === 'imperial' ? '' : 'none';
    document.getElementById('field-weight-metric').style.display = unit === 'metric' ? '' : 'none';
    document.getElementById('field-weight-imperial').style.display = unit === 'imperial' ? '' : 'none';

    // Hide result when switching units
    document.getElementById('result-card').classList.remove('show');
    document.getElementById('err-msg').style.display = 'none';
}

// ── Calculate ──────────────────────────────────────────
function calculate() {
    const err = document.getElementById('err-msg');
    err.style.display = 'none';

    let heightM, weightKg;

    if (mode === 'metric') {
        const cm = parseFloat(document.getElementById('height-cm').value);
        const kg = parseFloat(document.getElementById('weight-kg').value);

        if (!cm || !kg || cm < 50 || cm > 280 || kg < 10 || kg > 500) {
            err.style.display = 'block';
            return;
        }
        heightM = cm / 100;
        weightKg = kg;

    } else {
        const ft = parseFloat(document.getElementById('height-ft').value) || 0;
        const inch = parseFloat(document.getElementById('height-in').value) || 0;
        const lbs = parseFloat(document.getElementById('weight-lbs').value);
        const totalInches = ft * 12 + inch;

        if (!totalInches || !lbs || totalInches < 20 || lbs < 22) {
            err.style.display = 'block';
            return;
        }
        heightM = totalInches * 0.0254;
        weightKg = lbs * 0.453592;
    }

    // BMI = weight(kg) / height(m)²
    const bmi = weightKg / (heightM * heightM);
    const bmiDisplay = parseFloat(bmi.toFixed(1));
    const cat = getCategory(bmiDisplay);

    // Update DOM
    document.getElementById('bmi-val').textContent = bmiDisplay.toFixed(1);
    document.getElementById('bmi-cat').textContent = cat.label;
    document.getElementById('bmi-cat').style.color = cat.color;
    document.getElementById('d-cat').textContent = cat.label;
    document.getElementById('d-bmi').textContent = bmiDisplay.toFixed(1);
    document.getElementById('d-status').textContent = cat.status;

    // Move gauge marker
    const marker = document.getElementById('bmi-marker');
    marker.style.left = bmiToPercent(bmiDisplay) + '%';
    marker.style.color = cat.color;

    document.getElementById('result-card').classList.add('show');
}

// Allow Enter key to trigger calculation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') calculate();
});

