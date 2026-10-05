import React from "react";
import LazyLoad from "react-lazyload";
import InfiniteScroll from "react-infinite-scroller";
import { Box, CircularProgress, SimpleGrid, Text } from "@chakra-ui/react";
import GameCard from "../GameCard/GameCard";
import { FIRST_PAGE } from "../../constants/index";
import { IGame, IPlatform } from "../../models/gamesModel";

interface CatalogProps {
  games: IGame[];
  platforms: IPlatform[];
  hasMoreItems: boolean;
  loading: boolean;
  error?: boolean;
  idLabelFilter?: number | null;
  loadMore: (page: number) => void;
  onLabelClick: (idLabel: number) => void;
}

function Catalog({
  games,
  platforms,
  hasMoreItems,
  loading,
  error,
  idLabelFilter,
  loadMore,
  onLabelClick,
}: CatalogProps) {
  const loader = (
    <Box key={0} textAlign="center" mt={3}>
      <CircularProgress isIndeterminate />
    </Box>
  ); // Key to remove warning of infinite scroll

  if (error) {
    return (
      <Text fontSize="4xl" textAlign="center" color="red" mb={2}>
        There was an error loading your file.
      </Text>
    );
  }

  if (loading) {
    return loader;
  }

  return (
    <InfiniteScroll
      pageStart={FIRST_PAGE}
      loadMore={loadMore}
      hasMore={hasMoreItems}
      loader={loader}
    >
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {games.map((game) => (
          <LazyLoad key={`card-${game.id}`} height={250}>
            <GameCard
              game={game}
              platformName={platforms.find((p) => p.id === game.platform_id)?.name}
              idLabelFilter={idLabelFilter}
              onLabelClick={onLabelClick}
            />
          </LazyLoad>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
}

export default Catalog;