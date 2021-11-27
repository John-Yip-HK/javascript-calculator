import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Keypad() {
  return (
    <Row className="row-container" id="keypad-container">
      <Container id="keypad">
        <Row>
          <Col xs={6} id="clear" className="clickable">
            AC
          </Col>
          <Col id="divide" className="operand clickable">
            /
          </Col>
          <Col id="multiply" className="operand clickable">
            *
          </Col>
        </Row>
        <Row>
          <Col id="seven" className="clickable">
            7
          </Col>
          <Col id="eight" className="clickable">
            8
          </Col>
          <Col id="nine" className="clickable">
            9
          </Col>
          <Col id="subtract" className="operand clickable">
            -
          </Col>
        </Row>
        <Row>
          <Col id="four" className="clickable">
            4
          </Col>
          <Col id="five" className="clickable">
            5
          </Col>
          <Col id="six" className="clickable">
            6
          </Col>
          <Col id="add" className="operand clickable">
            +
          </Col>
        </Row>
        <Row>
          <Col xs={9} className="no-border nested-row">
            <Row>
              <Col id="one" className="clickable">
                1
              </Col>
              <Col id="two" className="clickable">
                2
              </Col>
              <Col id="three" className="clickable">
                3
              </Col>
            </Row>
            <Row>
              <Col xs={8} id="zero" className="clickable">
                0
              </Col>
              <Col id="decimal" className="clickable">
                .
              </Col>
            </Row>
          </Col>
          <Col id="equals" className="clickable">
            =
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
