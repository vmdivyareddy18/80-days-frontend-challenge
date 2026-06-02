// --- Character counter ---
const msgEl = document.getElementById('message');
const ccEl = document.getElementById('charCount');

msgEl.addEventListener('input', () => {
    const n = msgEl.value.length;
    ccEl.textContent = n + ' / 500';
    ccEl.className = 'char-count' + (n > 450 ? ' warn' : '') + (n >= 500 ? ' over' : '');
});

// --- Validation rules ---
const rules = [
    {
        fieldId: 'field-fname',
        check: () => document.getElementById('fname').value.trim().length > 0,
        inputId: 'fname'
    },
    {
        fieldId: 'field-lname',
        check: () => document.getElementById('lname').value.trim().length > 0,
        inputId: 'lname'
    },
    {
        fieldId: 'field-email',
        check: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value.trim()),
        inputId: 'email'
    },
    {
        fieldId: 'field-subject',
        check: () => document.getElementById('subject').value !== '',
        inputId: 'subject'
    },
    {
        fieldId: 'field-message',
        check: () => msgEl.value.trim().length >= 20,
        inputId: 'message'
    }
];

function validate() {
    let valid = true;
    rules.forEach(r => {
        const wrapper = document.getElementById(r.fieldId);
        if (r.check()) {
            wrapper.classList.remove('invalid');
        } else {
            wrapper.classList.add('invalid');
            valid = false;
        }
    });
    return valid;
}

// Clear invalid state on input
rules.forEach(r => {
    const el = document.getElementById(r.inputId);
    const event = r.inputId === 'subject' ? 'change' : 'input';
    el.addEventListener(event, () => {
        document.getElementById(r.fieldId).classList.remove('invalid');
    });
});

// --- Submit ---
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading');
    btn.innerHTML = 'Sending&hellip; <i class="ti ti-loader-2 spin" aria-hidden="true" style="font-size:16px"></i>';

    // Simulate async send — replace setTimeout with your actual fetch/XHR call
    setTimeout(() => {
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('successMsg').style.display = 'block';
    }, 1400);
});

// --- Reset ---
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('contactForm').reset();
    ccEl.textContent = '0 / 500';
    ccEl.className = 'char-count';
    document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
    const btn = document.getElementById('submitBtn');
    btn.classList.remove('loading');
    btn.innerHTML = 'Send message <i class="ti ti-arrow-right" aria-hidden="true"></i>';
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('successMsg').style.display = 'none';
});