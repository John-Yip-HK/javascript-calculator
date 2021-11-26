import Main from "./components/MainComponent";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  return (
    <Container id="outer-container" className="align-items-center">
      <Main />
    </Container>
  );
}

export default App;
