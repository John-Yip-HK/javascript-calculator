import { Component } from "react";
import Container from "react-bootstrap/Container";
import Display from "./DisplayComponent";
import Keypad from "./KeypadComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeoutObj: null,
      result: null,
      hasError: false,
      pressedElements: [],
      operators: ["+", "-", "*", "/"],
      keyToClickableId: {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        0: "zero",
        ".": "decimal",
        Escape: "clear",
        "/": "divide",
        "*": "multiply",
        "+": "add",
        "-": "subtract",
        "=": "equals",
        Enter: "equals",
        Backspace: "backspace",
      },
    };
    this.updateDisplay = this.updateDisplay.bind(this);
    this.detectKeyStrokeAndUpdateDisplay =
      this.detectKeyStrokeAndUpdateDisplay.bind(this);
    this.resetKeypad = this.resetKeypad.bind(this);

    this.updateDisplayWithNumberOrDecimal =
      this.updateDisplayWithNumberOrDecimal.bind(this);
    this.updateDisplayWithOperators =
      this.updateDisplayWithOperators.bind(this);
    this.calculateResult = this.calculateResult.bind(this);
    this.resetCalculator = this.resetCalculator.bind(this);
    this.backspace = this.backspace.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.detectKeyStrokeAndUpdateDisplay);
    document.addEventListener("keyup", this.resetKeypad);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "keydown",
      this.detectKeyStrokeAndUpdateDisplay
    );
    document.removeEventListener("keyup", this.resetKeypad);
  }

  detectKeyStrokeAndUpdateDisplay(event) {
    const key = event.key;
    const elementId = this.state.keyToClickableId[key] || null;

    if (elementId) {
      this.updateDisplay(key);
      const keyElement = document.getElementById(elementId);
      keyElement.classList.add("keyActive");
      this.state.pressedElements.push(elementId);
    }
    if (key === "/") event.preventDefault();
  }

  resetKeypad() {
    /*
    Clear keyActive classes for all elements which id 
    is stored in pressedElements array to prevent clickable keypads
    from being unable to restore the unclicked styling when they
    are pressed and released at the same time.
    */
    while (this.state.pressedElements.length > 0) {
      const keyElement = document.getElementById(
        this.state.pressedElements.pop()
      );
      keyElement.classList.remove("keyActive");
    }
  }

  /*
   * Need to fix jumping to another line problem when "-" is typed into a number just not exceeding limit.
   */
  updateDisplay(key) {
    const spanObjs = {
      displaySpan: document.getElementById("display-text"),
      opDisplaySpan: document.getElementById("op-display-text"),
    };

    // Helper methods.

    /**
     * Check whether the length of element stored with strings exceeds the length of outer div container minus an offset to prevent span element from being pushed to the right.
     * @param {HTMLElement} element
     * @returns A boolean of whether the element width exceeds the difference between container width and offset.
     */
    const isExceed = (element, offset = 0) => {
      const parent = element.parentElement;
      const parentComputedStyles = getComputedStyle(parent);

      return (
        element.clientWidth >=
        parent.clientWidth -
          parseFloat(parentComputedStyles.paddingLeft) -
          parseFloat(parentComputedStyles.paddingRight) -
          offset
      );
    };

    /**
     * Create a right padding when span width exceeds width of its outer container.
     * @param {HTMLElement} span
     */
    const createRightPadding = (span) => {
      if (navigator.userAgent.includes("Firefox"))
        span.style.paddingRight = getComputedStyle(
          span.parentElement
        ).paddingRight;
    };

    /**
     * Reset related styling of spans.
     */
    const resetSpanRelatedStyling = () => {
      spanObjs.opDisplaySpan.style.paddingRight = 0;
      spanObjs.displaySpan.style.paddingRight = 0;

      spanObjs.displaySpan.parentElement.style.textAlign = "right";
      spanObjs.opDisplaySpan.parentElement.style.textAlign = "right";
    };

    /**
     * Reset inner HTML content of spans.
     */
    const resetSpanInnerHTML = () => {
      spanObjs.displaySpan.innerHTML = "";
      spanObjs.opDisplaySpan.innerHTML = "0";
    };

    /**
     * Clear the timeout object stored in the component state.
     * @returns nothing.
     */
    const clearTimeoutObj = () => {
      if (this.state.timeoutObj) {
        clearTimeout(this.state.timeoutObj);
        this.setState({
          timeoutObj: null,
        });
      }
    };

    const decodeMathFormula = (formulaStr = spanObjs.displaySpan.innerHTML) => {
      formulaStr = formulaStr.replace("--", "+");

      const regex = /[\d.](?:[+\-*/])/g;
      let operators = formulaStr.match(regex);
      let operands = formulaStr.replace(regex, ",").split(",");

      if (operators) {
        operands = operands.map((op, id) => {
          if (operators && id < operators.length)
            return op + operators[id].slice(0, -1);
          else return op;
        });
        operators = operators.map((op) => op.slice(1));
      }

      return {
        operators: operators,
        operands: operands,
      };
    };

    // End of helper functions.

    // Reset right padding for both spans if result is not null.
    if (this.state.result !== null) {
      resetSpanRelatedStyling();
    }

    // Reset display value of spans if error has occured.
    if (this.state.hasError) {
      resetSpanInnerHTML();
      resetSpanRelatedStyling();

      this.setState({
        hasError: false,
      });
    }

    if (!isNaN(+key) || key === ".") {
      this.updateDisplayWithNumberOrDecimal(
        key,
        spanObjs,
        isExceed,
        resetSpanInnerHTML,
        clearTimeoutObj
      );
    } else if (this.state.operators.includes(key)) {
      this.updateDisplayWithOperators(key, spanObjs, clearTimeoutObj);
    } else if (key === "=" || key === "Enter") {
      this.calculateResult(
        spanObjs,
        clearTimeoutObj,
        isExceed,
        createRightPadding,
        decodeMathFormula
      );
    } else if (key === "DEL" || key === "Backspace") {
      this.backspace(
        spanObjs,
        isExceed,
        resetSpanRelatedStyling,
        decodeMathFormula
      );
    } else {
      this.resetCalculator(
        clearTimeoutObj,
        resetSpanInnerHTML,
        resetSpanRelatedStyling
      );
    }

    if (isExceed(spanObjs.displaySpan)) {
      createRightPadding(spanObjs.displaySpan);
      spanObjs.displaySpan.parentElement.scroll({
        left: spanObjs.displaySpan.clientWidth,
      });
    }
  }

  updateDisplayWithNumberOrDecimal(
    key,
    spanObjs,
    isExceed,
    resetSpanInnerHTML,
    clearTimeoutObj
  ) {
    /**
     * Add the provided key in the way specified in callback function.
     *
     * @param {HTMLElement} element The key-receiving span element.
     * @param {String} initialStr A default string inside the element.
     * @param {Function} callback A callback function receiving element and initialStr to decide how to add a key into inner HTML of the element.
     */
    const validateAndCombine = (element, initialStr, callback) => {
      callback(element, initialStr);
    };

    /**
     * Set up a timeout object if the onDisplaySpan width exceeds
     * @returns true if a timeout object is set. False otherwise.
     */
    const hasSetUpTimeoutObj = () => {
      if (isExceed(spanObjs.opDisplaySpan, 20)) {
        const prevOpDispVal = spanObjs.opDisplaySpan.innerHTML;

        spanObjs.opDisplaySpan.innerHTML = "LIMIT MET";
        this.setState({
          timeoutObj: setTimeout(() => {
            spanObjs.opDisplaySpan.innerHTML = prevOpDispVal;
            clearTimeoutObj();
          }, 1000),
        });

        return true;
      } else return false;
    };

    if (
      (key === "." && spanObjs.opDisplaySpan.innerHTML.includes(key)) ||
      this.state.timeoutObj !== null
    )
      return;

    if (this.state.result !== null) {
      resetSpanInnerHTML();

      this.setState({
        result: null,
      });
    }

    if (!hasSetUpTimeoutObj()) {
      let callbackFn;
      if (key === ".") {
        callbackFn = (element, initialStr) => {
          const decimalWithZero = "0.";

          // If key is a decimal.
          if (element.innerHTML === initialStr)
            element.innerHTML = decimalWithZero;
          else if (this.state.operators.includes(element.innerHTML))
            element.innerHTML =
              (element.innerHTML === "-" ? "-" : "") + decimalWithZero;
          else if (
            this.state.operators.includes(
              element.innerHTML.charAt(element.innerHTML.length - 1)
            )
          )
            element.innerHTML += decimalWithZero;
          else element.innerHTML += key;
        };
      } else {
        callbackFn = (element, initialStr) => {
          // If key is not a decimal.
          const elementStr = element.innerHTML;
          const lastIdxOfOp = this.state.operators.reduce((id, op) => {
            id = Math.max(id, elementStr.lastIndexOf(op));
            return id;
          }, -1);

          if ([initialStr, "0", "+", "*", "/"].includes(elementStr))
            element.innerHTML = key;
          else if (
            elementStr.charAt(elementStr.length - 1) === "0" &&
            lastIdxOfOp !== -1 &&
            elementStr.slice(lastIdxOfOp + 1) === "0"
          ) {
            // The case that the last digit is zero and the last number is not a decimal number.
            element.innerHTML = elementStr.slice(0, -1) + key;
          } else element.innerHTML += key;
        };
      }

      validateAndCombine(spanObjs.displaySpan, "", callbackFn);
      validateAndCombine(spanObjs.opDisplaySpan, "", callbackFn);
    }
  }

  updateDisplayWithOperators(key, spanObjs, clearTimeoutObj) {
    if (this.state.result !== null) {
      spanObjs.displaySpan.innerHTML = this.state.result;

      this.setState({
        result: null,
      });
    }
    clearTimeoutObj();

    // Need to separate the case that key is "-" and key is not "-".
    /**
     * Possible cases in spanObjs.displaySpan.innerHTML:
     * 1. Only contains "&nbsp;".
     * 2. Only contains a number (integer or decimal number) or operator.
     * 3. The last character is a digit or decimal.
     * 4. The last character is an operator.
     *    4a. Only the last character is an operator.
     *    4b. The second last character is also an operator.
     */
    const displaySpanStr = spanObjs.displaySpan.innerHTML;
    const lastChar = displaySpanStr.charAt(displaySpanStr.length - 1);
    const nextLastChar = displaySpanStr.charAt(displaySpanStr.length - 2);
    const nextLastCharIsOp = this.state.operators.includes(nextLastChar);

    if (
      displaySpanStr === "" ||
      this.state.operators.includes(displaySpanStr)
    ) {
      spanObjs.displaySpan.innerHTML = key;
    } else if (
      !isNaN(+displaySpanStr) ||
      !isNaN(+lastChar) ||
      lastChar === "."
    ) {
      spanObjs.displaySpan.innerHTML += (lastChar === "." ? "0" : "") + key;
    } else {
      /**
       * Case 1: [0-9.](*)-
       * Case 2: [0-9.](*)
       */
      if (key === "-") {
        if (!nextLastCharIsOp) {
          spanObjs.displaySpan.innerHTML += key;
        }
      } else {
        spanObjs.displaySpan.innerHTML =
          spanObjs.displaySpan.innerHTML.slice(0, !nextLastCharIsOp ? -1 : -2) +
          key;
      }
    }

    spanObjs.opDisplaySpan.innerHTML = key;
  }

  backspace(spanObjs, isExceed, resetSpanRelatedStyling, decodeMathFormula) {
    spanObjs.displaySpan.innerHTML = spanObjs.displaySpan.innerHTML.slice(
      0,
      -1
    );
    spanObjs.opDisplaySpan.innerHTML = spanObjs.opDisplaySpan.innerHTML.slice(
      0,
      -1
    );

    if (spanObjs.displaySpan.innerHTML.length < 1) {
      spanObjs.displaySpan.innerHTML = "";
    }

    if (spanObjs.opDisplaySpan.innerHTML.length < 1) {
      if (spanObjs.displaySpan.innerHTML.length > 0) {
        let { operators, operands } = decodeMathFormula();

        if (operands[operands.length - 1] === "") {
          spanObjs.opDisplaySpan.innerHTML = operators[operators.length - 1];
        } else {
          spanObjs.opDisplaySpan.innerHTML = operands[operands.length - 1];
        }
      } else {
        spanObjs.opDisplaySpan.innerHTML = "0";
      }
    }

    if (!isExceed(spanObjs.displaySpan)) {
      resetSpanRelatedStyling();
    }
  }

  calculateResult(
    spanObjs,
    clearTimeoutObj,
    isExceed,
    createRightPadding,
    decodeMathFormula
  ) {
    clearTimeoutObj();

    // Calculate the result according to fomula logic.
    let { operators, operands } = decodeMathFormula();

    // console.log(operators, operands);
    // return;

    let value;

    try {
      let lastOperand = operands[operands.length - 1];

      if (lastOperand === "" || lastOperand === "-") {
        throw new Error("ERROR,FORMULA");
      } else if (lastOperand.slice(-1) === ".") {
        throw new Error("ERROR,LAST OPERAND");
      } else if (!operators) {
        if (operands[0] === "-0") operands[0] = "0";
        value = +operands[0] || 0;
      } else {
        const calculateValue = (operators, operands) => {
          const stack = [+operands.shift()];

          while (operators.length > 0) {
            const operator = operators.shift();
            const operand = +operands.shift();

            if (operator === "+" || operator === "-") {
              stack.push(operator, operand);
            } else {
              if (operator === "*") {
                stack.push(stack.pop() * operand);
              } else {
                if ([0, -0].includes(operand))
                  throw new Error("ERROR,DIV BY 0");
                stack.push(stack.pop() / operand);
              }
            }
          }

          while (stack.length > 1) {
            const operandOne = stack.shift();
            const operator = stack.shift();

            if (operator === "+") {
              stack.unshift(operandOne + stack.shift());
            } else {
              stack.unshift(operandOne - stack.shift());
            }
          }

          return stack[0];
        };

        value = calculateValue(operators, operands);
      }
    } catch (err) {
      [spanObjs.displaySpan.innerHTML, spanObjs.opDisplaySpan.innerHTML] =
        err.message.split(",");

      spanObjs.displaySpan.parentElement.style.textAlign = "left";
      spanObjs.opDisplaySpan.parentElement.style.textAlign = "left";

      this.setState({
        result: null,
        hasError: true,
      });
      return;
    }

    spanObjs.opDisplaySpan.innerHTML = value;

    if (isExceed(spanObjs.opDisplaySpan)) {
      createRightPadding(spanObjs.opDisplaySpan);
    }

    this.setState({
      result: value,
    });
  }

  resetCalculator(
    clearTimeoutObj,
    resetSpanInnerHTML,
    resetSpanRelatedStyling
  ) {
    clearTimeoutObj();
    resetSpanInnerHTML();
    resetSpanRelatedStyling();

    this.setState({
      result: null,
    });
  }

  render() {
    return (
      <Container id="calculator-body">
        <Display />
        <Keypad updateDisplay={this.updateDisplay} />
      </Container>
    );
  }
}

export default Main;
