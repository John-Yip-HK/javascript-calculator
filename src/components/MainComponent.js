import { Component } from "react";
import Container from "react-bootstrap/Container";
import Display from "./DisplayComponent";
import Keypad from "./KeypadComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   inputString: "",
    // };
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  updateDisplay(key) {
    if (!isNaN(+key)) {
      const display = document.getElementById("display");
      const opDisplay = document.getElementById("operand-and-operator-display");

      display.innerHTML =
        display.innerHTML === "&nbsp;" || display.innerHTML === "0"
          ? key
          : display.innerHTML + key;
      opDisplay.innerHTML =
        opDisplay.innerHTML === "" || opDisplay.innerHTML === "0"
          ? key
          : opDisplay.innerHTML + key;
    } else {
      if (key === "AC") {
        document.getElementById("display").innerHTML = "&nbsp;";
        document.getElementById("operand-and-operator-display").innerHTML = 0;
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
