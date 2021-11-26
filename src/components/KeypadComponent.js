import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Keypad() {
  return (
    <Row>
      <Container id="keypad">
        <Row>
          <Col xs={6} id="clear">
            AC
          </Col>
          <Col id="divide" className="operand">
            /
          </Col>
          <Col id="multiply" className="operand">
            *
          </Col>
        </Row>
        <Row>
          <Col id="seven">7</Col>
          <Col id="eight">8</Col>
          <Col id="nine">9</Col>
          <Col id="subtract" className="operand">
            -
          </Col>
        </Row>
        <Row>
          <Col id="four">4</Col>
          <Col id="five">5</Col>
          <Col id="six">6</Col>
          <Col id="add" className="operand">
            +
          </Col>
        </Row>
        <Row>
          <Col xs={9} className="no-border">
            <Row>
              <Col id="one">1</Col>
              <Col id="two">2</Col>
              <Col id="three">3</Col>
            </Row>
            <Row>
              <Col xs={8} id="zero">
                0
              </Col>
              <Col xs={4} id="decimal">
                .
              </Col>
            </Row>
          </Col>
          <Col xs={3} id="equals">
            =
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
