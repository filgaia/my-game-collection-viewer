import React from "react";
import { Box, Icon, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { MdFavorite, MdLibraryBooks, MdLock } from "react-icons/md";
import Catalog from "../Catalog/Catalog";
import Unlocks from "../Unlocks/Unlocks";
import useGames from "../../hooks/useGames";
import { CATALOG_TAB, UNLOCKS_TAB, WISHLIST_TAB } from "../../constants/index";
import { IGame, IProp } from "../../models/gamesModel";

type GamesApi = ReturnType<typeof useGames>;

function Main({ games: api }: { games: GamesApi }) {
  const { gamesInformation: info, loadGames, setLabelFilter, setTab } = api;

  const catalogParams: IProp = {
    source: (info.idLabelFilter ? info.sourceFiltered : info.source) as IGame[],
    propGames: "games",
    propMoreItems: "hasMoreItems",
  };
  const wishListParams: IProp = {
    source: info.sourceWishList,
    propGames: "wishList",
    propMoreItems: "hasMoreItemsWishList",
  };

  const handleLabelClick = (idLabel: number) =>
    setLabelFilter(info.idLabelFilter === idLabel ? null : idLabel);

  const tabStyles = {
    flexDirection: "column",
    gap: "2px",
    py: 2,
    fontSize: "0.8125rem",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.6)",
    _dark: { color: "whiteAlpha.700" },
    _selected: { color: "#1976d2", borderColor: "#1976d2", _dark: { color: "blue.200", borderColor: "blue.200" } },
  };

  const buildPanel = (
    active: boolean,
    games: IGame[],
    hasMoreItems: boolean,
    params: IProp
  ) =>
    active ? (
      <Catalog
        key={`${info.tab}-${api.loadCount}`}
        games={games}
        total={params.source.length}
        platforms={info.platforms}
        hasMoreItems={hasMoreItems}
        loading={info.loading}
        error={info.error}
        idLabelFilter={info.idLabelFilter}
        loadMore={(page) => loadGames(page, params)}
        onLabelClick={handleLabelClick}
        onLoadShared={api.loadShared}
      />
    ) : null;

  return (
    <Tabs isFitted index={info.tab} onChange={setTab} w="100%">
      <TabList position="sticky" top={0} zIndex={10} bg="#f5f5f5" _dark={{ bg: "gray.800" }} boxShadow="0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)">
        <Tab sx={tabStyles}>
          <Icon as={MdLibraryBooks} w={5} h={5} />
          Catalog
        </Tab>
        <Tab sx={tabStyles}>
          <Icon as={MdFavorite} w={5} h={5} />
          Wishlist
        </Tab>
        <Tab sx={tabStyles} isDisabled={!info.remote}>
          <Icon as={MdLock} w={5} h={5} />
          Unlocks
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={3}>
          {buildPanel(info.tab === CATALOG_TAB, info.games, info.hasMoreItems, catalogParams)}
        </TabPanel>
        <TabPanel p={3}>
          {buildPanel(info.tab === WISHLIST_TAB, info.wishList, info.hasMoreItemsWishList, wishListParams)}
        </TabPanel>
        <TabPanel p={3}>
          {info.tab === UNLOCKS_TAB && (
            <Unlocks collection={info.source} platforms={info.platforms} wishlist={info.sourceWishList} />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Main;

