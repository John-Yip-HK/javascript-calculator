import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Keypad(props) {
  return (
    <Row className="row-container" id="keypad-container">
      <Container id="keypad">
        <Row>
          <Col
            xs={6}
            id="clear"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            AC
          </Col>
          <Col
            id="divide"
            className="operand clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            /
          </Col>
          <Col
            id="multiply"
            className="operand clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            *
          </Col>
        </Row>
        <Row>
          <Col
            id="seven"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            7
          </Col>
          <Col
            id="eight"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            8
          </Col>
          <Col
            id="nine"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            9
          </Col>
          <Col
            id="subtract"
            className="operand clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            -
          </Col>
        </Row>
        <Row>
          <Col
            id="four"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            4
          </Col>
          <Col
            id="five"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            5
          </Col>
          <Col
            id="six"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            6
          </Col>
          <Col
            id="add"
            className="operand clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            +
          </Col>
        </Row>
        <Row>
          <Col xs={9} className="no-border nested-row">
            <Row>
              <Col
                id="one"
                className="clickable"
                onClick={(key) => props.updateDisplay(key.target.innerHTML)}
              >
                1
              </Col>
              <Col
                id="two"
                className="clickable"
                onClick={(key) => props.updateDisplay(key.target.innerHTML)}
              >
                2
              </Col>
              <Col
                id="three"
                className="clickable"
                onClick={(key) => props.updateDisplay(key.target.innerHTML)}
              >
                3
              </Col>
            </Row>
            <Row>
              <Col
                xs={8}
                id="zero"
                className="clickable"
                onClick={(key) => props.updateDisplay(key.target.innerHTML)}
              >
                0
              </Col>
              <Col
                id="decimal"
                className="clickable"
                onClick={(key) => props.updateDisplay(key.target.innerHTML)}
              >
                .
              </Col>
            </Row>
          </Col>
          <Col
            id="equals"
            className="clickable"
            onClick={(key) => props.updateDisplay(key.target.innerHTML)}
          >
            =
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
