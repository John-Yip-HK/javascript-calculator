import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Display() {
  return (
    <Row className="row-container" id="display-container">
      <Col id="display">&nbsp;</Col>
      <hr />
      <Col id="operand-and-operator-display">0</Col>
    </Row>
  );
}
