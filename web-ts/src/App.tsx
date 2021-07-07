import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Main from "./components/Main/Main";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Container maxW="container.xl" centerContent>
          <Header></Header>
          <Main></Main>
          <Footer></Footer>
        </Container>
      </ChakraProvider>
    </div>
  );
}

export default App;
