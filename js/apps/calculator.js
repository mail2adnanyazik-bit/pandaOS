window.pandaOS = window.pandaOS || {};

window.pandaOS.calculator = {
  title: "Calculator",
  width: 320,
  height: 420,
  getContent: () => `
    <div class="calculator">
      <input type="text" id="calc-display" class="calc-display" readonly value="0">
      <div class="calc-buttons">
        <button class="calc-btn" data-val="7">7</button>
        <button class="calc-btn" data-val="8">8</button>
        <button class="calc-btn" data-val="9">9</button>
        <button class="calc-btn op" data-op="/">/</button>
        
        <button class="calc-btn" data-val="4">4</button>
        <button class="calc-btn" data-val="5">5</button>
        <button class="calc-btn" data-val="6">6</button>
        <button class="calc-btn op" data-op="*">*</button>
        
        <button class="calc-btn" data-val="1">1</button>
        <button class="calc-btn" data-val="2">2</button>
        <button class="calc-btn" data-val="3">3</button>
        <button class="calc-btn op" data-op="-">-</button>
        
        <button class="calc-btn" data-val="0">0</button>
        <button class="calc-btn" data-val=".">.</button>
        <button class="calc-btn" data-val="C">C</button>
        <button class="calc-btn op" data-op="+">+</button>
        
        <button class="calc-btn" data-val="=" style="grid-column: span 4;">=</button>
      </div>
    </div>
  `,
  init: function () {
    const checkExist = setInterval(() => {
      const display = document.getElementById("calc-display");
      if (display) {
        clearInterval(checkExist);
        this.attachEvents();
      }
    }, 100);
  },
  attachEvents: function () {
    const display = document.getElementById("calc-display");
    const buttons = document.querySelectorAll(".calc-btn");
    let expression = "";
    let currentNumber = "";
    let lastResult = null;
    let justCalculated = false;

    function updateDisplay(value) {
      display.value = value || "0";
    }

    function evaluateExpression(expr) {
      try {
        let safeExpr = expr.replace(/[^-()\d/*+.]/g, "");
        if (safeExpr.match(/[+\-*/]$/)) safeExpr = safeExpr.slice(0, -1);
        const result = Function('"use strict";return (' + safeExpr + ")")();
        return isNaN(result) || !isFinite(result) ? "Error" : result.toString();
      } catch (e) {
        return "Error";
      }
    }

    function handleInput(val) {
      if (val === "C") {
        expression = "";
        currentNumber = "";
        lastResult = null;
        justCalculated = false;
        updateDisplay("0");
        return;
      }

      if (val === "=") {
        if (expression === "") return;
        const result = evaluateExpression(expression + currentNumber);
        if (result === "Error") {
          updateDisplay("Error");
          expression = "";
          currentNumber = "";
          lastResult = null;
          justCalculated = false;
          return;
        }
        lastResult = result;
        updateDisplay(result);
        expression = result;
        currentNumber = "";
        justCalculated = true;
        return;
      }

      if (["+", "-", "*", "/"].includes(val)) {
        if (justCalculated) {
          expression = lastResult || "0";
          justCalculated = false;
        }
        if (currentNumber !== "") {
          expression += currentNumber + " " + val + " ";
          currentNumber = "";
        } else if (expression !== "") {
          expression = expression.slice(0, -2) + val + " ";
        } else {
          expression = "0 " + val + " ";
        }
        updateDisplay(expression + (currentNumber || "0"));
        const opBtn = Array.from(buttons).find(
          (btn) => btn.getAttribute("data-op") === val,
        );
        if (opBtn) {
          opBtn.style.backgroundColor = "#0A3A5A";
          setTimeout(() => {
            opBtn.style.backgroundColor = "";
          }, 100);
        }
        return;
      }

      if (justCalculated) {
        expression = "";
        currentNumber = "";
        justCalculated = false;
      }

      if (val === ".") {
        if (currentNumber.includes(".")) return;
        if (currentNumber === "") currentNumber = "0.";
        else currentNumber += ".";
      } else {
        if (currentNumber === "0" && val !== ".") currentNumber = val;
        else currentNumber += val;
      }

      let fullExpr = expression + currentNumber;
      if (fullExpr === "") fullExpr = "0";
      updateDisplay(fullExpr);
    }

    buttons.forEach((btn) => {
      const val = btn.getAttribute("data-val");
      const op = btn.getAttribute("data-op");
      btn.addEventListener("click", () => {
        if (val !== null) handleInput(val);
        else if (op !== null) handleInput(op);
      });
    });

    window.addEventListener("keydown", (e) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      )
        return;

      const key = e.key;
      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handleInput(key);
      } else if (key === ".") {
        e.preventDefault();
        handleInput(".");
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        e.preventDefault();
        handleInput(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleInput("=");
      } else if (key === "Escape" || key === "c" || key === "C") {
        e.preventDefault();
        handleInput("C");
      } else if (key === "Backspace") {
        e.preventDefault();
        if (justCalculated) {
          expression = "";
          currentNumber = "";
          justCalculated = false;
          updateDisplay("0");
        } else if (currentNumber.length > 0) {
          currentNumber = currentNumber.slice(0, -1);
          if (currentNumber === "") currentNumber = "0";
          let fullExpr = expression + currentNumber;
          if (fullExpr === "") fullExpr = "0";
          updateDisplay(fullExpr);
        } else if (expression.length > 0) {
          expression = expression.slice(0, -3);
          updateDisplay(expression + (currentNumber || "0"));
        }
      }
    });
  },
};
