import React from "react";
import { Container } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Container maxW="container.xl" centerContent>
        <Header></Header>
        <Footer></Footer>
      </Container>
    </div>
  );
}

export default App;
