
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;

function updateDisplay() {
    display.value = current;
}

function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
            if (b === 0) throw new Error("Cannot divide by zero");
            return a / b;
        default: return b;
    }
}

function formatResult(number) {
    if (!Number.isFinite(number)) {
        throw new Error("Invalid result");
    }
    return String(Number(number.toPrecision(10)));
}

function inputNumber(value) {
    if (waitingForNumber) {
        current = value === "." ? "0." : value;
        waitingForNumber = false;
    } else if (value === ".") {
        if (!current.includes(".")) current += ".";
    } else {
        current = current === "0" ? value : current + value;
    }
    updateDisplay();
}

function chooseOperator(nextOperator) {
    const value = Number(current);

    if (operator && !waitingForNumber) {
        try {
            current = formatResult(
                calculate(previous, value, operator)
            );
        } catch (error) {
            current = "Error";
            previous = null;
            operator = null;
            waitingForNumber = true;
            updateDisplay();
            return;
        }
        updateDisplay();
    } else if (current === "Error") {
        return;
    }

    previous = Number(current);
    operator = nextOperator;
    waitingForNumber = true;
}

function showResult() {
    if (operator === null || previous === null) return;

    try {
        current = formatResult(
            calculate(previous, Number(current), operator)
        );
    } catch (error) {
        current = "Error";
    }

    previous = null;
    operator = null;
    waitingForNumber = true;
    updateDisplay();
}

function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    waitingForNumber = false;
    updateDisplay();
}

function deleteLast() {
    if (waitingForNumber || current === "Error") {
        current = "0";
        waitingForNumber = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : "0";

        if (current === "-") current = "0";
    }
    updateDisplay();
}

function percentage() {
    if (current !== "Error") {
        current = formatResult(Number(current) / 100);
        waitingForNumber = true;
        updateDisplay();
    }
}

function changeSign() {
    if (current !== "Error" && Number(current) !== 0) {
        current = String(-Number(current));
        updateDisplay();
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.value !== undefined) {
        const value = button.dataset.value;

        if ("0123456789.".includes(value) && value.length === 1) {
            inputNumber(value);
        } else {
            chooseOperator(value);
        }
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteLast();
            break;
        case "percent":
            percentage();
            break;
        case "sign":
            changeSign();
            break;
        case "calculate":
            showResult();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        inputNumber(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        showResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});

updateDisplay();
