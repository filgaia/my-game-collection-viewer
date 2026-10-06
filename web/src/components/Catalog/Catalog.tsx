import React from "react";
import LazyLoad from "react-lazyload";
import InfiniteScroll from "react-infinite-scroller";
import { Box, CircularProgress, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import GameCard from "../GameCard/GameCard";
import LoadOwn from "../LoadOwn/LoadOwn";
import { FIRST_PAGE } from "../../constants/index";
import { IGame, IPlatform } from "../../models/gamesModel";

interface CatalogProps {
  games: IGame[];
  total: number;
  platforms: IPlatform[];
  hasMoreItems: boolean;
  loading: boolean;
  error?: boolean;
  idLabelFilter?: number | null;
  loadMore: (page: number) => void;
  onLabelClick: (idLabel: number) => void;
  onLoadShared?: (key: string) => Promise<void>;
}

function Catalog({
  games,
  total,
  platforms,
  hasMoreItems,
  loading,
  error,
  idLabelFilter,
  loadMore,
  onLabelClick,
  onLoadShared,
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
      <Flex align="center" justify="space-between" wrap="wrap" gap={3} mb={3}>
        <Text fontWeight={500} data-testid="total-count">
          Total: {total}
        </Text>
        {onLoadShared && <LoadOwn onLoad={onLoadShared} />}
      </Flex>
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