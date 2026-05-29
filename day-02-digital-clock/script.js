const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function pad(n) {
    return String(n).padStart(2, '0');
}

function tick() {
    const now = new Date();

    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12 || 12;

    document.getElementById('hh').textContent = pad(h);
    document.getElementById('mm').textContent = pad(m);
    document.getElementById('ss').textContent = pad(s);
    document.getElementById('ampm').textContent = ampm;

    document.getElementById('dateline').textContent =
        days[now.getDay()] + ', ' +
        months[now.getMonth()] + ' ' +
        now.getDate() + ', ' +
        now.getFullYear();

    const ticks = document.querySelectorAll('#ticks .tick');
    const active = Math.floor(s / 5);

    ticks.forEach((t, i) => {
        t.classList.toggle('active', i === active);
    });

    const opacity = s % 2 === 0 ? '1' : '0.25';

    document.getElementById('colon1').style.opacity = opacity;
    document.getElementById('colon2').style.opacity = opacity;
}

tick();
setInterval(tick, 1000);