import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Keypad(props) {
  const keyPressCallback = (event) =>
    props.updateDisplay(event.target.innerHTML);

  return (
    <Row className="row-container" id="keypad-container">
      <Container id="keypad">
        <Row>
          <Col
            xs={6}
            id="clear"
            className="clickable"
            onClick={keyPressCallback}
          >
            AC
          </Col>
          <Col
            id="divide"
            className="operand clickable"
            onClick={keyPressCallback}
          >
            /
          </Col>
          <Col
            id="multiply"
            className="operand clickable"
            onClick={keyPressCallback}
          >
            *
          </Col>
        </Row>
        <Row>
          <Col id="seven" className="clickable" onClick={keyPressCallback}>
            7
          </Col>
          <Col id="eight" className="clickable" onClick={keyPressCallback}>
            8
          </Col>
          <Col id="nine" className="clickable" onClick={keyPressCallback}>
            9
          </Col>
          <Col
            id="subtract"
            className="operand clickable"
            onClick={keyPressCallback}
          >
            -
          </Col>
        </Row>
        <Row>
          <Col id="four" className="clickable" onClick={keyPressCallback}>
            4
          </Col>
          <Col id="five" className="clickable" onClick={keyPressCallback}>
            5
          </Col>
          <Col id="six" className="clickable" onClick={keyPressCallback}>
            6
          </Col>
          <Col
            id="add"
            className="operand clickable"
            onClick={keyPressCallback}
          >
            +
          </Col>
        </Row>
        <Row>
          <Col xs={9} className="no-border nested-row">
            <Row>
              <Col id="one" className="clickable" onClick={keyPressCallback}>
                1
              </Col>
              <Col id="two" className="clickable" onClick={keyPressCallback}>
                2
              </Col>
              <Col id="three" className="clickable" onClick={keyPressCallback}>
                3
              </Col>
            </Row>
            <Row>
              <Col
                xs={8}
                id="zero"
                className="clickable"
                onClick={keyPressCallback}
              >
                0
              </Col>
              <Col
                id="decimal"
                className="clickable"
                onClick={keyPressCallback}
              >
                .
              </Col>
            </Row>
          </Col>
          <Col id="equals" className="clickable" onClick={keyPressCallback}>
            =
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
