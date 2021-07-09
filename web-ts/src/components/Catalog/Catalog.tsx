import React, { useEffect } from "react";
import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import useGames from "../../hooks/useGames";

function Catalog() {
  const { gamesInformation, initGames } = useGames();

  useEffect(() => {
    initGames(); // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const games = gamesInformation.source.slice(0, 10); // Temporal showing 10 games

  const gamesCatalog = games.map((item, key) => (
    <ListItem key={key}>{item.name}</ListItem>
  ));

  console.log({ gamesInformation });

  return (
    <Box w="100%" textAlign="left" p={2}>
      <UnorderedList>{gamesCatalog}</UnorderedList>
    </Box>
  );
}

export default Catalog;
