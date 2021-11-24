import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Keypad() {
  return (
    <Row>
      <Container id="keypad">
        <Row>
          <Col id="clear">AC</Col>
          <Col id="divide">/</Col>
          <Col id="multiply">*</Col>
        </Row>
        <Row>
          <Col id="seven">7</Col>
          <Col id="eight">8</Col>
          <Col id="nine">9</Col>
          <Col id="subtract">-</Col>
        </Row>
        <Row>
          <Col id="four">4</Col>
          <Col id="five">5</Col>
          <Col id="six">6</Col>
          <Col id="add">+</Col>
        </Row>
        <Row>
          <Col id="one">1</Col>
          <Col id="two">2</Col>
          <Col id="three">3</Col>
          <Col id="equals">=</Col>
        </Row>
        <Row>
          <Col xs={6} id="zero">
            0
          </Col>
          <Col xs={2} id="decimal">
            .
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
