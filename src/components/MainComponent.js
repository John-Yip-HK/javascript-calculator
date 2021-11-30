import { Component } from "react";
import Container from "react-bootstrap/Container";
import Display from "./DisplayComponent";
import Keypad from "./KeypadComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeoutObj: null,
      opDisplayOffset: 20,
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
    const clearTimeoutObj = () => {
      if (!this.state.timeoutObj) return;

      clearTimeout(this.state.timeoutObj);
      this.setState({
        timeoutObj: null,
      });
    };

    const displaySpan = document.querySelector("#display > span");
    const opDisplay = document.querySelector("#op-display");
    const opDisplayStyles = getComputedStyle(opDisplay);
    const opDisplaySpan = opDisplay.firstElementChild;
    /*
    Check whether length of string stored shown in opDisplaySpan exceeds the length of 
    out opDisplay div container minus an offset to prevent numbers in opDisplay span from 
    being pushed to the right.
    */
    const isExceed =
      opDisplaySpan.clientWidth >=
      opDisplay.clientWidth -
        parseFloat(opDisplayStyles.paddingLeft) -
        parseFloat(opDisplayStyles.paddingRight) -
        this.state.opDisplayOffset;

    if (!isNaN(+key) || key === ".") {
      if (
        this.state.timeoutObj !== null ||
        (key === "." && opDisplaySpan.innerHTML.includes(key))
      )
        return;

      if (isExceed) {
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
          displaySpan.innerHTML =
            displaySpan.innerHTML === "&nbsp;"
              ? `0${key}`
              : displaySpan.innerHTML +
                (this.state.operators.includes(displaySpan.innerHTML)
                  ? "0"
                  : "") +
                key;

          opDisplaySpan.innerHTML =
            opDisplaySpan.innerHTML === "0"
              ? `0${key}`
              : opDisplaySpan.innerHTML +
                (this.state.operators.includes(opDisplaySpan.innerHTML)
                  ? "0"
                  : "") +
                key;
        } else {
          displaySpan.innerHTML = ["&nbsp;", "0"].includes(
            displaySpan.innerHTML
          )
            ? key
            : displaySpan.innerHTML + key;

          opDisplaySpan.innerHTML = ["", "0"].includes(opDisplaySpan.innerHTML)
            ? key
            : opDisplaySpan.innerHTML + key;
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

        if (this.state.operators.includes(lastChar)) {
          if (key !== "-") {
            displaySpan.innerHTML = displaySpan.innerHTML.slice(0, -1) + key;
          } else {
            if (
              lastChar === "-" &&
              this.state.operators.includes(secondLastChar)
            )
              return;
            displaySpan.innerHTML += key;
          }
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
        console.log(value);
      } else {
        displaySpan.innerHTML = "&nbsp;";
        opDisplaySpan.innerHTML = 0;
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
