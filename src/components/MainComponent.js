import { Component } from "react";
import Container from "react-bootstrap/Container";
import Display from "./DisplayComponent";
import Keypad from "./KeypadComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeoutObj: null,
      containerOffset: 20,
      result: null,
      displayLimitMsg: "LIMIT MET",
      pressedKeyElement: null,
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
      },
    };
    this.updateDisplay = this.updateDisplay.bind(this);
    this.detectKeyStrokeAndUpdateDisplay =
      this.detectKeyStrokeAndUpdateDisplay.bind(this);
    this.resetKeypad = this.resetKeypad.bind(this);
    this.findElementId = this.findElementId.bind(this);
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

  findElementId(key) {
    return (
      this.state.keyToClickableId[key] ||
      this.state.keyToClickableId[+key] ||
      null
    );
  }

  detectKeyStrokeAndUpdateDisplay(event) {
    const key = event.key;
    const elementId = this.findElementId(key);

    if (elementId) {
      this.updateDisplay(key);
      const keyElement = document.getElementById(elementId);
      keyElement.classList.add("keyActive");

      if (this.state.operators.includes(key)) {
        this.setState({
          pressedKeyElement: keyElement
        });
      }
    }
    if (key === "/") event.preventDefault();
  }

  resetKeypad(event) {
    const key = event.key;
    const elementId = this.findElementId(key);

    if (this.state.pressedKeyElement || elementId) {
      const element = this.state.pressedKeyElement 
      || document.getElementById(elementId);

      element.classList.remove("keyActive");

      if (this.state.operators.includes(key)) {
        this.setState({
          pressedKeyElement: null
        });
      }
    }
  }

  /**
   * Becomes a god function! Need to separate out methods.
   * @param {*} key 
   * @returns 
   */
  updateDisplay(key) {
    // Helper methods.
    /**
     * Clear the timeout object stored in the component state.
     * @returns nothing.
     */
    const clearTimeoutObj = () => {
      if (!this.state.timeoutObj) return;

      clearTimeout(this.state.timeoutObj);
      this.setState({
        timeoutObj: null,
      });
    };
    /**
     * Check whether the length of element stored with strings exceeds the length of outer element container minus an offset to prevent numbers in element span from being pushed to the right.
     * @param {HTMLElement} element
     * @returns A boolean of whether the element width exceeds the difference between container width and offset.
     */
    const isExceed = (element, offset = this.state.containerOffset) => {
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

    const displaySpan = document.querySelector("#display > span");
    const opDisplay = document.querySelector("#op-display");
    const opDisplaySpan = opDisplay.firstElementChild;
    const userAgentString = navigator.userAgent;

    if (this.state.result !== null) {
      opDisplaySpan.style.paddingRight = 0;
      displaySpan.style.paddingRight = 0;
    }

    if (!isNaN(+key)) {
      // The key is a number.

      if (this.state.timeoutObj !== null) return;

      if (this.state.result !== null) {
        displaySpan.innerHTML = "";
        opDisplaySpan.innerHTML = "";

        this.setState({
          result: null,
        });
      }

      if (isExceed(opDisplaySpan)) {
        const prevOpDispVal = opDisplaySpan.innerHTML;

        opDisplaySpan.innerHTML = this.state.displayLimitMsg;
        this.setState({
          timeoutObj: setTimeout(() => {
            opDisplaySpan.innerHTML = prevOpDispVal;
            clearTimeoutObj();
          }, 1000),
        });
      } else {
        const validateAndCombine = (element, initialStr) => {
          const elementStr = element.innerHTML;
          let lastIdxOfOp = this.state.operators.reduce((id, op) => {
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
            // The case that lastly input number is zero and the last number is not a decimal number.
            element.innerHTML = elementStr.slice(0, -1) + key;
          } else element.innerHTML += key;
        };

        validateAndCombine(displaySpan, "&nbsp;");
        validateAndCombine(opDisplaySpan, "");
      }
    } else if (key === ".") {
      if (opDisplaySpan.innerHTML.includes(key)) return;

      if (this.state.result !== null) {
        displaySpan.innerHTML = "&nbsp;";
        opDisplaySpan.innerHTML = "0";

        this.setState({
          result: null,
        });
      }

      const validateAndCombine = (element, initialStr) => {
        if (element.innerHTML === initialStr) element.innerHTML = `0${key}`;
        else if (this.state.operators.includes(element.innerHTML))
          element.innerHTML =
            (element.innerHTML === "-" ? "-" : "") + `0${key}`;
        else if (
          this.state.operators.includes(
            element.innerHTML.charAt(element.innerHTML.length - 1)
          )
        )
          element.innerHTML += `0${key}`;
        else element.innerHTML += key;
      };

      validateAndCombine(displaySpan, "&nbsp;");
      validateAndCombine(opDisplaySpan, "0");
    } else {
      if (this.state.result !== null) {
        displaySpan.innerHTML = this.state.result;
        this.setState({
          result: null,
        });
      }
      clearTimeoutObj();

      if (this.state.operators.includes(key)) {
        // Need to separate the case that key is "-" and key is not "-".
        /**
         * Possible cases in displaySpan.innerHTML:
         * 1. Only contains "&nbsp;".
         * 2. Only contains a number (integer or decimal number) or operator.
         * 3. The last character is a digit or decimal.
         * 4. The last character is an operator.
         *    4a. Only the last character is an operator.
         *    4b. The second last character is also an operator.
         */
        const displaySpanStr = displaySpan.innerHTML;
        const lastChar = displaySpanStr.charAt(displaySpanStr.length - 1);
        const nextLastChar = displaySpanStr.charAt(displaySpanStr.length - 2);
        const nextLastCharIsOp = this.state.operators.includes(nextLastChar);

        if (
          displaySpanStr === "&nbsp;" ||
          this.state.operators.includes(displaySpanStr)
        ) {
          displaySpan.innerHTML = key;
        } else if (
          !isNaN(+displaySpanStr) ||
          !isNaN(+lastChar) ||
          lastChar === "."
        ) {
          displaySpan.innerHTML += (lastChar === "." ? "0" : "") + key;
        } else {
          /**
           * Case 1: [0-9.](*)
           * Case 2: [0-9.](*)-
           */
          if (key === "-") {
            if (!nextLastCharIsOp) displaySpan.innerHTML += key;
          } else {
            displaySpan.innerHTML =
              displaySpan.innerHTML.slice(0, !nextLastCharIsOp ? -1 : -2) + key;
          }
        }

        opDisplaySpan.innerHTML = key;
      } else if (key === "=" || key === "Enter") {
        /*
        Calculate the result according to immediate execution logic.
        For example:
        3 + 5 x 6 - 2 / 4 
        = 8 x 6 - 2 / 4
        = 48 - 2 / 4
        = 46 / 4
        = 11.5

        Test string:
        -0+1-2*3/4+-5--6*-7.0/-0.008*9.-10

        */
        const regex = /[\d.](?:[+\-*/])/g;
        let operators = displaySpan.innerHTML.match(regex);
        let operands = displaySpan.innerHTML.replace(regex, ",").split(",");

        if (operators) {
          operands = operands.map((op, id) => {
            if (operators && id < operators.length)
              return (op + operators[id].slice(0, -1));
            else return op;
          });
          operators = operators.map(op => op.slice(1));
        }
        // console.log(operators, operands);
        // return;

        let value;

        if (!operators) {
          if (operands[0] === "-0") operands[0] = "0";
          value = +operands[0] || 0;
        }
        else {
          try {
            value = operators.reduce((sum, operand, id) => {
              switch (operand) {
                case "+":
                  (sum += +operands[id + 1]);
                  break;
                case "-":
                  (sum -= +operands[id + 1]);
                  break;
                case "*":
                  (sum *= +operands[id + 1]);
                  break;
                case "/":
                  const operand = +operands[id + 1];
                  if ([0, -0].includes(operand)) throw new Error("DIV BY 0");
                  (sum /= operand);
                  break;
                default:
                  break;
              }

              return sum;
            }, +operands[0]);
          }
          catch (err) {
            displaySpan.innerHTML = err.message;
            opDisplaySpan.innerHTML = "";
            this.setState({
              result: null,
            });
            return;
          }
        }

        opDisplaySpan.innerHTML = value;

        if (isExceed(opDisplaySpan)) {
          if (userAgentString.includes("Firefox"))
            opDisplaySpan.style.paddingRight = `12px`;
          // opDisplay.scroll({ left: opDisplaySpan.clientWidth });
        }

        this.setState({
          result: value,
        });
      } else {
        displaySpan.innerHTML = "&nbsp;";
        opDisplaySpan.innerHTML = 0;

        opDisplaySpan.style.paddingRight = 0;
        displaySpan.style.paddingRight = 0;

        this.setState({
          result: null,
        });
      }
    }

    if (isExceed(displaySpan, 0)) {
      if (userAgentString.includes("Firefox"))
        displaySpan.style.paddingRight = `12px`;
      displaySpan.parentElement.scroll({ left: displaySpan.clientWidth });
    }
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
