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
    };
    this.updateDisplay = this.updateDisplay.bind(this);
    this.detectKeyStrokeAndUpdateDisplay =
      this.detectKeyStrokeAndUpdateDisplay.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.detectKeyStrokeAndUpdateDisplay);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "keydown",
      this.detectKeyStrokeAndUpdateDisplay
    );
  }

  detectKeyStrokeAndUpdateDisplay(event) {
    console.log(event.key);
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
      if (key === "AC") {
        clearTimeoutObj();
        displaySpan.innerHTML = "&nbsp;";
        opDisplaySpan.innerHTML = 0;
      } else if (this.state.operators.includes(key)) {
        clearTimeoutObj();
        displaySpan.innerHTML += key;
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
