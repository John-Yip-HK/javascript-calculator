import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Display() {
  return (
    <Row className="row-container" id="display-container">
      <Col id="display">012345678</Col>
      <hr />
      <Col id="operand-and-operator-display"></Col>
    </Row>
  );
}
