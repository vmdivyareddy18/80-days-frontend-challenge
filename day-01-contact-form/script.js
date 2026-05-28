
let currentInput = '';
let expression = '';
let justCalculated = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay(val) {
    resultEl.textContent = formatNumber(val) || '0';
}

function formatNumber(n) {
    if (n === '' || n === '-') return n;
    const num = parseFloat(n);
    if (isNaN(num)) return n;
    // Limit display to avoid overflow
    if (Math.abs(num) >= 1e12) return num.toExponential(4);
    // Remove trailing zeros for integers
    const s = String(n);
    return s;
}

function setExpression(expr) {
    // Replace * and / for display
    expressionEl.textContent = expr.replace(/\*/g, '×').replace(/\//g, '÷');
}

function inputNum(n) {
    if (justCalculated) {
        currentInput = '';
        expression = '';
        justCalculated = false;
    }
    if (currentInput === '0' && n !== '.') currentInput = '';
    currentInput += n;
    updateDisplay(currentInput);
    setExpression(expression + currentInput);
}

function inputDot() {
    if (justCalculated) {
        currentInput = '0';
        expression = '';
        justCalculated = false;
    }
    if (currentInput.includes('.')) return;
    if (currentInput === '') currentInput = '0';
    currentInput += '.';
    updateDisplay(currentInput);
    setExpression(expression + currentInput);
}

function inputOp(op) {
    justCalculated = false;
    if (currentInput === '' && expression !== '') {
        // Replace last operator
        expression = expression.slice(0, -1) + op;
        setExpression(expression);
        return;
    }
    if (currentInput !== '') {
        expression += currentInput + op;
        currentInput = '';
        setExpression(expression);
    }
}

function calculate() {
    if (currentInput === '' && expression === '') return;
    const full = expression + currentInput;
    if (!full) return;
    try {
        // Safe eval via Function
        let result = Function('"use strict"; return (' + full + ')')();
        // Round floating point issues
        result = parseFloat(result.toPrecision(12));
        setExpression(full.replace(/\*/g, '×').replace(/\//g, '÷') + ' =');
        currentInput = String(result);
        expression = '';
        updateDisplay(currentInput);
        flashResult();
        justCalculated = true;
    } catch {
        resultEl.textContent = 'Error';
        setTimeout(clearAll, 1000);
    }
}

function clearAll() {
    currentInput = '';
    expression = '';
    justCalculated = false;
    updateDisplay('0');
    setExpression('');
}

function toggleSign() {
    if (currentInput === '' || currentInput === '0') return;
    currentInput = currentInput.startsWith('-')
        ? currentInput.slice(1)
        : '-' + currentInput;
    updateDisplay(currentInput);
    setExpression(expression + currentInput);
}

function percent() {
    if (currentInput === '') return;
    currentInput = String(parseFloat(currentInput) / 100);
    updateDisplay(currentInput);
    setExpression(expression + currentInput);
}

function flashResult() {
    resultEl.classList.add('flash');
    setTimeout(() => resultEl.classList.remove('flash'), 300);
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') inputNum(e.key);
    else if (e.key === '.') inputDot();
    else if (e.key === '+') inputOp('+');
    else if (e.key === '-') inputOp('-');
    else if (e.key === '*') inputOp('*');
    else if (e.key === '/') { e.preventDefault(); inputOp('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') {
        if (currentInput) {
            currentInput = currentInput.slice(0, -1);
            updateDisplay(currentInput || '0');
            setExpression(expression + currentInput);
        }
    }
    else if (e.key === 'Escape') clearAll();
    else if (e.key === '%') percent();
});

// Ripple effect on buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const rx = ((e.clientX - rect.left) / rect.width * 100) + '%';
        const ry = ((e.clientY - rect.top) / rect.height * 100) + '%';
        this.style.setProperty('--rx', rx);
        this.style.setProperty('--ry', ry);
        this.classList.add('ripple');
        setTimeout(() => this.classList.remove('ripple'), 300);
    });
});

