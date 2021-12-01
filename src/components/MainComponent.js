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
      displayLimitMsg: "DIGIT LIMIT MET",
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
      document.getElementById(elementId).classList.add("keyActive");
    }
    if (key === "/") event.preventDefault();
  }

  resetKeypad(event) {
    const elementId = this.findElementId(event.key);

    if (elementId) {
      document.getElementById(elementId).classList.remove("keyActive");
    }
  }

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
    const isExceed = (element) => {
      const parent = element.parentElement;
      const elementComputedStyles = getComputedStyle(parent);
      return (
        element.clientWidth >=
        parent.clientWidth -
          parseFloat(elementComputedStyles.paddingLeft) -
          parseFloat(elementComputedStyles.paddingRight) -
          this.state.containerOffset
      );
    };

    const displaySpan = document.querySelector("#display > span");
    const opDisplay = document.querySelector("#op-display");
    const opDisplaySpan = opDisplay.firstElementChild;

    if (!isNaN(+key) || key === ".") {
      if (
        this.state.timeoutObj !== null ||
        (key === "." && opDisplaySpan.innerHTML.includes(key))
      )
        return;

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
        if (key === ".") {
          const validateAndCombine = (element, initialStr) => {
            element.innerHTML =
              element.innerHTML === initialStr
                ? `0${key}`
                : element.innerHTML +
                  (this.state.operators.includes(element.innerHTML)
                    ? "0"
                    : "") +
                  key;
          };

          validateAndCombine(displaySpan, "&nbsp;");
          validateAndCombine(opDisplaySpan, "0");
        } else {
          const validateAndCombine = (element, initialStr) => {
            element.innerHTML = [
              initialStr,
              "0",
              ...[this.state.operators[0], ...this.state.operators.slice(2)],
            ].includes(element.innerHTML)
              ? key
              : element.innerHTML + key;
          };

          validateAndCombine(displaySpan, "&nbsp;");
          validateAndCombine(opDisplaySpan, "");
        }
      }
    } else {
      clearTimeoutObj();

      if (this.state.operators.includes(key)) {
        if (displaySpan.innerHTML === "&nbsp;") {
          displaySpan.innerHTML = key;
          opDisplaySpan.innerHTML = key;
          return;
        }

        const lastChar = displaySpan.innerHTML.charAt(
          displaySpan.innerHTML.length - 1
        );
        const secondLastChar = displaySpan.innerHTML.charAt(
          displaySpan.innerHTML.length - 2
        );

        // The case that the last character is an operator.
        if (this.state.operators.includes(lastChar)) {
          if (
            key === "-" &&
            lastChar === "-" &&
            this.state.operators.includes(secondLastChar)
          )
            return;

          displaySpan.innerHTML =
            (displaySpan.innerHTML.length > 1
              ? lastChar !== "-"
                ? displaySpan.innerHTML
                : displaySpan.innerHTML.slice(0, -1)
              : "") + key;
        } else {
          displaySpan.innerHTML += key;
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

        1+2-3*4/5+-6-7.0 = 1 + 2 - 3 * 4 / 5 + (-6) - 7.0
        */
        const regex = /(?<=[0-9.]+)[\+\-\*\/]/gi;
        const operators = displaySpan.innerHTML.match(regex);
        const operands = displaySpan.innerHTML
          .replace(regex, ",")
          .split(",")
          .map((element) => (element = +element));

        if (!operators) opDisplaySpan.innerHTML = operands[0] || 0;
        else {
          let value =
            operators === null
              ? +operands[0]
              : operators.reduce((sum, operand, id) => {
                  switch (operand) {
                    case "+":
                      return (sum += operands[id + 1]);
                    case "-":
                      return (sum -= operands[id + 1]);
                    case "*":
                      return (sum *= operands[id + 1]);
                    case "/":
                      return (sum /= operands[id + 1]);
                  }
                }, operands[0]);

          opDisplaySpan.innerHTML = value;
          if (isExceed(opDisplaySpan)) {
            opDisplaySpan.style.paddingRight =
              getComputedStyle(opDisplay).paddingRight;
            opDisplay.scroll({ left: opDisplaySpan.clientWidth });
          }
        }
      } else {
        displaySpan.innerHTML = "&nbsp;";
        opDisplaySpan.innerHTML = 0;
        opDisplaySpan.style.paddingRight = 0;
      }
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
