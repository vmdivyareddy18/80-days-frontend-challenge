
// Set today's date in masthead
const now = new Date();
document.getElementById('today-date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
document.querySelector('#footer-date span').textContent = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Limit date input
const dobInput = document.getElementById('dob');
dobInput.max = now.toISOString().split('T')[0];
dobInput.min = '1900-01-01';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ZODIAC = [
    [1, 20, 'Aquarius'], [2, 19, 'Pisces'], [3, 21, 'Aries'], [4, 20, 'Taurus'],
    [5, 21, 'Gemini'], [6, 21, 'Cancer'], [7, 23, 'Leo'], [8, 23, 'Virgo'],
    [9, 23, 'Libra'], [10, 23, 'Scorpio'], [11, 22, 'Sagittarius'], [12, 22, 'Capricorn']
];
const MILESTONES = [
    [1, '1st Birthday'], [5, 'Starting School'], [10, 'A Decade'], [13, 'Becoming a Teen'],
    [16, 'Sweet Sixteen'], [18, 'Adulthood'], [21, '21st'], [25, 'Quarter Century'],
    [30, 'The Thirties'], [40, 'Fabulous Forty'], [50, 'Half Century'], [60, 'Diamond Years'],
    [65, 'Retirement Age'], [70, 'Platinum Years'], [75, '75th'], [100, 'The Centennial']
];

function getZodiac(m, d) {
    for (const [mo, day, name] of ZODIAC) {
        if (m === mo && d < day) return name;
    }
    return ZODIAC[(m - 1) % 12][2];
}

function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function fmt(n) { return n.toLocaleString(); }

function calcAge(dob, today) {
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if (days < 0) {
        months--;
        const prev = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prev.getDate();
    }
    if (months < 0) { years--; months += 12; }
    return { years, months, days };
}

function calculate() {
    const val = dobInput.value;
    if (!val) return;
    const dob = new Date(val + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dob >= today) return;

    const { years, months, days } = calcAge(dob, today);

    // Hero
    document.getElementById('hero-years').textContent = years;
    document.getElementById('hero-exact').textContent = `${years} years, ${months} months, ${days} days`;

    // Born
    document.getElementById('born-day').textContent = DAYS[dob.getDay()];
    document.getElementById('born-details').innerHTML =
        `${MONTHS[dob.getMonth()]} ${ordinal(dob.getDate())}, ${dob.getFullYear()}<br>${getZodiac(dob.getMonth() + 1, dob.getDate())}`;

    // Birthday countdown
    let nextBd = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBd <= today) nextBd.setFullYear(today.getFullYear() + 1);
    const daysLeft = Math.ceil((nextBd - today) / 86400000);
    document.getElementById('bday-countdown').textContent =
        daysLeft === 0 ? '🎉 Happy Birthday!' : `Next birthday in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;

    // Stats
    const totalMs = today - dob;
    const totalDays = Math.floor(totalMs / 86400000);
    document.getElementById('stat-months').textContent = fmt(years * 12 + months);
    document.getElementById('stat-weeks').textContent = fmt(Math.floor(totalDays / 7));
    document.getElementById('stat-days').textContent = fmt(totalDays);
    document.getElementById('stat-hours').textContent = fmt(totalDays * 24);

    // Year progress
    const yr = today.getFullYear();
    const yearStart = new Date(yr, 0, 1);
    const yearEnd = new Date(yr + 1, 0, 1);
    const pct = Math.round(((today - yearStart) / (yearEnd - yearStart)) * 100);
    document.getElementById('year-label').textContent = `Year ${yr}`;
    document.getElementById('year-pct').textContent = `${pct}%`;
    setTimeout(() => { document.getElementById('year-bar').style.width = pct + '%'; }, 100);

    // Milestones
    const tbody = document.getElementById('milestone-body');
    tbody.innerHTML = '';
    for (const [age, label] of MILESTONES) {
        const target = new Date(dob.getFullYear() + age, dob.getMonth(), dob.getDate());
        const past = years >= age;
        const daysAway = Math.ceil((target - today) / 86400000);
        const tr = document.createElement('tr');
        tr.className = past ? 'past' : 'future';
        tr.innerHTML = `
        <td><span class="ms-age">${ordinal(age)}</span></td>
        <td class="ms-label">${label}</td>
        <td class="ms-date">${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
        <td class="ms-status ${past ? 'past-tag' : 'future-tag'}">
          ${past ? '<span class="check">✓</span> ' + target.getFullYear() : 'In ' + fmt(daysAway) + 'd'}
        </td>`;
        tbody.appendChild(tr);
    }

    // Show results
    document.getElementById('placeholder').style.display = 'none';
    const r = document.getElementById('results');
    r.classList.add('visible');
}

// Auto-calculate on date change
dobInput.addEventListener('change', calculate);

