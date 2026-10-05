import React from "react";
import { Box, Icon, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { MdFavorite, MdLibraryBooks } from "react-icons/md";
import Catalog from "../Catalog/Catalog";
import useGames from "../../hooks/useGames";
import { CATALOG_TAB, WISHLIST_TAB } from "../../constants/index";
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
    _selected: { color: "#1976d2", borderColor: "#1976d2" },
  };

  const buildPanel = (
    active: boolean,
    games: IGame[],
    hasMoreItems: boolean,
    params: IProp
  ) =>
    active ? (
      <Catalog
        games={games}
        platforms={info.platforms}
        hasMoreItems={hasMoreItems}
        loading={info.loading}
        error={info.error}
        idLabelFilter={info.idLabelFilter}
        loadMore={(page) => loadGames(page, params)}
        onLabelClick={handleLabelClick}
      />
    ) : null;

  return (
    <Tabs isFitted index={info.tab} onChange={setTab} w="100%">
      <TabList bg="#f5f5f5" boxShadow="0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)">
        <Tab sx={tabStyles}>
          <Icon as={MdLibraryBooks} w={5} h={5} />
          Catalog
        </Tab>
        <Tab sx={tabStyles}>
          <Icon as={MdFavorite} w={5} h={5} />
          Wishlist
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={3}>
          {buildPanel(info.tab === CATALOG_TAB, info.games, info.hasMoreItems, catalogParams)}
        </TabPanel>
        <TabPanel p={3}>
          {buildPanel(info.tab === WISHLIST_TAB, info.wishList, info.hasMoreItemsWishList, wishListParams)}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Main;