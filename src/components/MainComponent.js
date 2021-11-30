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
    if (
      event.key in this.state.keyToClickableId ||
      +event.key in this.state.keyToClickableId
    ) {
      this.updateDisplay(event.key);
      document
        .getElementById(
          this.state.keyToClickableId[event.key] ||
            this.state.keyToClickableId[+event.key]
        )
        .classList.add("keyActive");
    }
    if (event.key !== "F12") event.preventDefault();
  }

  resetKeypad(event) {
    if (
      event.key in this.state.keyToClickableId ||
      +event.key in this.state.keyToClickableId
    ) {
      document
        .getElementById(
          this.state.keyToClickableId[event.key] ||
            this.state.keyToClickableId[+event.key]
        )
        .classList.remove("keyActive");
    }
  }

  updateDisplay(key) {
    const clearTimeoutObj = () => {
      clearTimeout(this.state.timeoutObj);
      this.setState({
        timeoutObj: null,
      });
    };
    const displaySpan = document.querySelector("#display > span");
    const opDisplay = document.querySelector("#op-display");
    const opDisplayStyles = getComputedStyle(opDisplay);
    const opDisplaySpan = opDisplay.firstElementChild;
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
        displaySpan.innerHTML = [
          "&nbsp;",
          "0",
          ...this.state.operators,
        ].includes(displaySpan.innerHTML)
          ? key
          : displaySpan.innerHTML + key;

        opDisplaySpan.innerHTML = ["", "0", ...this.state.operators].includes(
          opDisplaySpan.innerHTML
        )
          ? key
          : opDisplaySpan.innerHTML + key;
      }
    } else {
      clearTimeoutObj();
      if (key === "AC" || key === "Escape") {
        displaySpan.innerHTML = "&nbsp;";
        opDisplaySpan.innerHTML = 0;
      } else if (this.state.operators.includes(key)) {
        if (
          this.state.operators.includes(
            displaySpan.innerHTML.charAt(displaySpan.innerHTML.length - 1)
          )
        ) {
          displaySpan.innerHTML = displaySpan.innerHTML.slice(0, -1) + key;
        } else {
          displaySpan.innerHTML += key;
        }
        opDisplaySpan.innerHTML = key;
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
