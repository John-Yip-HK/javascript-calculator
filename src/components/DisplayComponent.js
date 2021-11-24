import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Display() {
  return (
    <Row id="display-container">
      <Col id="display"></Col>
      <hr />
      <Col id="operand-and-operator-display"></Col>
    </Row>
  );
}