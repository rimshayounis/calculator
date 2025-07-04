const input = document.querySelector('.input');
const buttons = document.querySelectorAll('.button, .wide, .wider');

function myTrim(str) {
    let start = 0, end = str.length - 1;
    while (start <= end && str[start] === ' ') start++;
    while (end >= start && str[end] === ' ') end--;
    let result = '';
    for (let i = start; i <= end; i++) result += str[i];
    return result;
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function evalFunction(func, val) {
    const value = parseFloat(val);
    switch (func) {
        case 'sin': 
        return Math.sin(toRadians(value));
        case 'cos': 
        return Math.cos(toRadians(value));
        case 'tan': 
        return Math.tan(toRadians(value));
        case 'sqrt': 
        return Math.sqrt(value);
        default: return NaN;
    }
}

function isOperator(op) {
    return ['+', '-', '*', '/', '^'].includes(op);
}

function precedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    if (op === '^') return 3;
    return 0;
}

function infixToPostfix(tokens) {
    const output = [];
    const stack = [];

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else if (['sin', 'cos', 'tan', 'sqrt'].includes(token)) {
            stack.push(token);
        } else if (isOperator(token)) {
            while (stack.length && isOperator(stack[stack.length - 1]) &&
                precedence(stack[stack.length - 1]) >= precedence(token)) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); 
            if (['sin', 'cos', 'tan', 'sqrt'].includes(stack[stack.length - 1])) {
                output.push(stack.pop()); 
            }
        }
    }

    while (stack.length) {
        output.push(stack.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    const stack = [];

    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else if (isOperator(token)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': 
                stack.push(a + b); 
                break;
                case '-': 
                stack.push(a - b); 
                break;
                case '*': 
                stack.push(a * b); 
                break;
                case '/': 
                    if (b === 0) 
                        return "Error: Div by 0";
                    stack.push(a / b); 
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
            }
        } else if (['sin', 'cos', 'tan', 'sqrt'].includes(token)) {
            const val = stack.pop();
            stack.push(evalFunction(token, val));
        }
    }

    return stack.pop();
}

function tokenize(expression) {
    return expression.split(' ').filter(token => token !== '');
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        let expression = input.value;

        if (value === '=') {
            const cleanExp = myTrim(expression);
            const tokens = tokenize(cleanExp);

            try {
                const postfix = infixToPostfix(tokens);
                const result = evaluatePostfix(postfix);
                input.value += ' = ' + parseFloat(result).toFixed(4);
            } catch (err) {
                input.value = "Error";
            }

        } else if (value === 'Clear') {
            input.value = '';
        } else {
            if (['+', '-', '*', '/', '^', 'sin', 'cos', 'tan', 'sqrt'].includes(value)) {
                input.value += ' ' + value + ' ';
            } else {
                input.value += value;
            }
        }
    });
});
