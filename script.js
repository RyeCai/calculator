const display = document.querySelector('#display');
let displayVal = "0";
let decimal = false;
let operation = "";
let operatorUsed = false;
let pi = false;
let op1 = "0";
let op2 = "";

const allButtons = document.querySelectorAll("button");
allButtons.forEach(button => button.addEventListener("click", buttonClick));
// const numberList = document.querySelectorAll("div.number");
// const operationList = document.querySelectorAll("div.operation");
// const unaryButtons = document.querySelectorAll("div.unary");
// const clearButton = document.getElementById("clear");
// const backButton = document.getElementById("delete");
// numberList.forEach(node => node.addEventListener("click", displayNumber));
// operationList.forEach(node => node.addEventListener("click", displayOperation));
// unaryButtons.forEach(node => node.addEventListener("click", displayUnary));
// clearButton.addEventListener("click", clear);
// backButton.addEventListener("click", backspace);
window.addEventListener("keydown", keyPress);

function operate(operator, operand1, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
    case "mod":
      return operand1 % operand2;
    case "^":
      return operand1 ** operand2;
  }
}

function keyPress(e) {
  const key = document.querySelector(`button[data-key="${e.keyCode}"]`);
  if (!key) return;

  switch (key.classList[0]) {
    case "number":
      displayNumber(key);
      break;
    case "operation":
      displayOperation(key);
      break;
    case "unary":
      displayUnary(key);
      break;
    case "delete":
      backspace();
      break;
    case "clear":
      clear();
      break;
  }
}

function buttonClick(e) {
  switch (e.target.classList[0]) {
    case "number":
      displayNumber(e.target);
      break;
    case "operation":
      displayOperation(e.target);
      break;
    case "unary":
      displayUnary(e.target);
      break;
    case "delete":
      backspace();
      break;
    case "clear":
      clear();
      break;
  }
}

function displayUnary(target) {
  if (display.textContent === "0") return;
  if (op2 === "") {
    switch (target.id) {
      case "abs":
        displayVal = Math.abs(display.textContent).toString();
        op1 = displayVal;
        display.textContent = displayVal;
        break;
      case "sqrt":
        displayVal = Math.sqrt(display.textContent).toString();
        op1 = displayVal;
        display.textContent = displayVal;
        break;
      case "negate":
        displayVal = (-display.textContent).toString();
        op1 = displayVal;
        display.textContent = displayVal;
        break;
    }
  } else {
    switch (target.id) {
      case "abs":
        displayVal = Math.abs(display.textContent);
        op2 = displayVal.toString();
        display.textContent = displayVal;
        break;
      case "sqrt":
        displayVal = Math.sqrt(display.textContent);
        op2 = displayVal.toString();
        display.textContent = displayVal;
        break;
      case "negate":
        displayVal = -display.textContent;
        op2 = displayVal.toString();
        display.textContent = displayVal;
        break;
    }
  }
}

function displayNumber(target) {
  const buttonContent = target.textContent;

  if (operatorUsed && op2 === "") displayVal = "0";

  if (buttonContent === ".") {
    if (!decimal) {
      decimal = true;
      displayVal += buttonContent;
    }
  } else if (target.id === "pi") {
    displayVal = Math.PI;
    pi = true;
  } else if (displayVal === "0" || pi) {
    displayVal = buttonContent;
    if (pi) pi = false;
  } else {
    displayVal += buttonContent;
  }
  if (operatorUsed) {
    op2 = displayVal;
  } else {
    op1 = displayVal;
  }
  display.textContent = displayVal;
}

function displayOperation(target) {
  let operator = target.textContent.trim();
  let curTarget = (operator === "m" || operator === "mod") ? document.getElementById('mod') : target;

  //most recent operator being pressed
  if (op2 === "") {
    if (operatorUsed) {
      document.querySelector(".pressed").classList.remove("pressed");
    } else if (operator === "=") {
      return;
    }
    curTarget.classList.add("pressed");
    operatorUsed = true;
    operation = operator;
  } else {
    if (op2 === "0" && operation === "/") {
      clear();
      alert("Division by 0");
      return;
    }
    op1 = operate(operation, +op1, +op2).toString();
    display.textContent = op1;
    op2 = "";
    document.querySelector(".pressed").classList.remove("pressed");
    operatorUsed = false;
    operation = operator;
    if (operation !== "=") {
      curTarget.classList.add("pressed");
      operatorUsed = true;
    } else {
      displayVal = "0";
    }
  }
}

function clear() {
  displayVal = "0";
  decimal = false;
  operation = "";
  operatorUsed = false;
  pi = false;
  op1 = "0";
  op2 = "";
  if (document.querySelector(".pressed")) {
    document.querySelector(".pressed").classList.remove("pressed");
  }
  display.textContent = displayVal;
}

function backspace() {
  if (displayVal === "0") return;
  let lastChar = displayVal[displayVal.length - 1];
  if (displayVal.length === 1 || displayVal.length === 2 && displayVal[0] === "-" || displayVal === "Infinity") {
    displayVal = "0";
  } else if (pi) {
    displayVal = "0";
    pi = false;
  } else {
    displayVal = displayVal.slice(0, -1);
    if (lastChar === ".") decimal = false;
  }
  display.textContent = displayVal;
}