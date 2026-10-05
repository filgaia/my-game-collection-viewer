import React, { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Main from "./components/Main/Main";
import useGames from "./hooks/useGames";

function App() {
  const games = useGames();
  const { initGames, shortByName } = games;

  useEffect(() => {
    initGames(); // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <ChakraProvider>
        <Header onSort={shortByName} />
        <Main games={games} />
        <Footer />
      </ChakraProvider>
    </div>
  );
}

export default App;