import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Display() {
  return (
    <Row className="row-container" id="display-container">
      <Col id="display">
        <span id="display-text"></span>
      </Col>
      <hr />
      <Col id="op-display">
        <span id="op-display-text">0</span>
      </Col>
    </Row>
  );
}
