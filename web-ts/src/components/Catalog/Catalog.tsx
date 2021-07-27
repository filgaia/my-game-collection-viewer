import React, { useEffect } from "react";
import LazyLoad from "react-lazyload";
import InfiniteScroll from "react-infinite-scroller";

import {
  Box,
  CircularProgress,
  Image,
  ScaleFade,
  SimpleGrid,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import useGames from "../../hooks/useGames";
import constants from "../../constants/index";
import { IGame, IProp } from "../../models/gamesModel";

function Catalog() {
  const { gamesInformation, initGames, loadGames } = useGames();
  let catalogContainer = null;

  useEffect(() => {
    initGames(); // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildLoader = () => {
    return (
      <div key={0}>
        <CircularProgress isIndeterminate />
      </div>
    ); // Key to remove warning of infinite scroll
  };

  const buildError = () => {
    return (
      <Text fontSize="4xl" textAlign="center" color="red" gutterBottom>
        There was an error loading your file.
      </Text>
    );
  };

  const getPlatform = (game: IGame) =>
    gamesInformation.platforms.find((item) => item.id === game.platform_id)
      ?.name;

  const buildItems = () => {
    return gamesInformation.games.map((item, key) => (
      <Box w="100%" key={key} p={2}>
        <LazyLoad height={250}>
          <Tooltip
            label={`${getPlatform(item)} - ${item.name}`}
            aria-label={item.name}
          >
            <ScaleFade initialScale={0.8} in>
              <Image
                borderRadius="full"
                boxSize="250px"
                src={item.image_url_medium}
                alt={item.name}
                fallbackSrc="https://via.placeholder.com/250"
                my={0}
                mx="auto"
              />
            </ScaleFade>
          </Tooltip>
        </LazyLoad>
      </Box>
    ));
  };

  const buildCatalog = (items: JSX.Element[], loader: JSX.Element) => {
    const source = gamesInformation.idLabelFilter ? "sourceFiltered" : "source";
    const params: IProp = {
      source: gamesInformation[source] as IGame[],
      propGames: "games",
      propMoreItems: "hasMoreItems",
    };

    return (
      <InfiniteScroll
        pageStart={constants.FIRST_PAGE}
        loadMore={(page) => loadGames(page, params)}
        hasMore={gamesInformation.hasMoreItems}
        loader={loader}
      >
        <SimpleGrid columns={4} spacing={10}>
          {items}
        </SimpleGrid>
      </InfiniteScroll>
    );
  };

  const loader = buildLoader();
  const items = buildItems();
  const errorMessage = buildError();

  if (gamesInformation.error) {
    catalogContainer = errorMessage;
  } else if (gamesInformation.loading) {
    catalogContainer = loader;
  } else {
    catalogContainer = buildCatalog(items, loader);
  }

  console.log({ gamesInformation });

  return <React.Fragment>{catalogContainer}</React.Fragment>;
}

export default Catalog;
