import { Component } from "react";
import Container from "react-bootstrap/Container";
import Display from "./DisplayComponent";
import Keypad from "./KeypadComponent";

class Main extends Component {
  render() {
    return (
      <Container id="calculator-body">
        <Display />
        <Keypad />
      </Container>
    );
  }
}

export default Main;
