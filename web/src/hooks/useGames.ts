//@vendor
import React from "react";
import JSZip from "jszip";
import get from "lodash/get";
// @helpers
import { getSource } from "./../utilities/index";
import { fetchDekuDealsGames, DEFAULT_SHARE_KEY } from "./../utilities/dekudeals";
// @constants
import { backup } from "./../data/db.json";
import { ITEMS_BY_PAGE, UNLOCKS_TAB } from "./../constants/index";
import { actionTypes } from "../actionTypes/gamesTypes";
import gamesReducer from "../reducers/gamesReducer";
import setInitialState from "../defaultState/gamesDefault";
import { IGames, IGame, IGameLabel, ILabel, IProp } from "../models/gamesModel";

export default function useGames({ reducer = gamesReducer } = {}) {
  const [gamesInformation, dispatch] = React.useReducer(
    gamesReducer,
    setInitialState()
  );
  const [loadCount, setLoadCount] = React.useState(0);

  const importFile = (file: File) => {
    const zip = new JSZip();
    const fullname = get(file, "name", "").split(".");
    let name: string = "";

    if (fullname.length > 0) {
      name = fullname[0];
    }

    if (name !== "") {
      zip
        .loadAsync(file)
        .then(() => {
          zip
            .file(name)
            ?.async("string")
            .then((data) => {
              const json = JSON.parse(data);
              dispatch({ type: actionTypes.IMPORT_FILE });
              dispatch({
                type: actionTypes.INIT_GAMES,
                payload: get(json, "backup"),
              });
            });
        })
        .catch((e) => {
          dispatch({
            type: actionTypes.IMPORT_FILE_ERROR,
            payload: { error: get(e, "Error", "") },
          });
        });
    }
  };

  const initGames = (json: IGames = backup) => {
    const allGames = json.Game?.slice(0);
    const gamesLabels = json.GameLabel?.slice(0);
    const labels = json.Label?.slice(0);
    const platforms = get(json, "Platform", []).slice(0);

    const gamesWithLabels = allGames.map((game: IGame) => {
      const gameLabels = gamesLabels.filter(
        (gameLabel: IGameLabel) => gameLabel.game_id === game.id
      );

      return Object.assign({}, game, {
        labels: gameLabels.map((gameLabel: IGameLabel) =>
          labels.find((label: ILabel) => label.id === gameLabel.label_id)
        ),
      });
    });

    const games = gamesWithLabels.filter(
      (game: IGame) => !get(game, "is_wishlist_item", false)
    );
    const gamesInWishList = gamesWithLabels.filter((game: IGame) =>
      get(game, "is_wishlist_item", false)
    );

    dispatch({
      type: actionTypes.LOAD_JSON_INFORMATION,
      payload: {
        response: { games, gamesInWishList, labels, platforms },
      },
    });
  };

  // Deku Deals is the source of truth; db.json is used when it cannot be loaded.
  // The build-time snapshot shows up fast, then the live list is fetched in the background
  // and only replaces it when it changed.
  const initRemoteGames = async () => {
    let snapshot: string | null = null;
    try {
      const response = await fetchDekuDealsGames(DEFAULT_SHARE_KEY);
      snapshot = JSON.stringify(response);
      applyShared(response);
    } catch {
      initGames();
    }
    if (import.meta.env.DEV || !DEFAULT_SHARE_KEY) return;
    try {
      const live = await fetchDekuDealsGames(DEFAULT_SHARE_KEY, true);
      if (JSON.stringify(live) !== snapshot) applyShared(live);
    } catch {
      // keep what is already shown
    }
  };

  const applyShared = (response: Awaited<ReturnType<typeof fetchDekuDealsGames>>) => {
    setLoadCount((count) => count + 1);
    dispatch({
      type: actionTypes.LOAD_JSON_INFORMATION,
      payload: { response: { ...response, remote: true } },
    });
  };

  // Loads another user's public collection; the current data is kept if it fails
  const loadShared = async (key: string) => {
    applyShared(await fetchDekuDealsGames(key));
  };

  const getListByPage = (page: number, source: IGame[], current: IGame[]) => {
    const load = ITEMS_BY_PAGE;
    const start = page * load;
    const games = source.slice(start, start + load);
    const hasMoreItems = source.length > start + games.length;
    return {
      games: current.concat(games),
      hasMoreItems,
    };
  };

  const loadGames = (page: number, params: IProp) => {
    const listGames = getListByPage(
      page,
      params.source,
      gamesInformation[params.propGames] as IGame[]
    );

    dispatch({
      type: actionTypes.LOAD_GAMES_INFORMATION,
      payload: {
        response: {
          propGames: params.propGames,
          propMoreItems: params.propMoreItems,
          ...listGames,
        },
      },
    });
  };

  const reverseList = (source: IGame[], asc: boolean) => {
    source = source.sort((a: IGame, b: IGame) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    if (asc) {
      source = source.reverse();
    }

    return source;
  };

  const setLabelFilter = (idLabelFilter: any) => {
    if (idLabelFilter) {
      const source = gamesInformation.source;
      const sourceFiltered = source.filter((game) => {
        const label = game?.labels?.find((label) => label.id === idLabelFilter);
        return !!label;
      });
      const page = 0;
      const listGames = getListByPage(page, sourceFiltered, []);

      dispatch({ type: actionTypes.SET_INFORMATION_FILTER });

      setTimeout(
        () =>
          dispatch({
            type: actionTypes.SET_INFORMATION_FILTER_SUCCESS,
            payload: {
              response: {
                idLabelFilter,
                sourceFiltered,
                ...listGames,
              },
            },
          }),
        500
      );
    } else {
      dispatch({ type: actionTypes.RESET_FILTERED_VALUES });
    }
  };

  const setTab = (tab: number) => {
    dispatch({ type: actionTypes.SET_TAB, payload: { tab } });
  };

  const shortByName = () => {
    const tab = gamesInformation.tab;
    if (tab === UNLOCKS_TAB) return;
    const idLabelFilter = gamesInformation.idLabelFilter;
    let data = getSource(tab, idLabelFilter);
    const source = reverseList(
      (gamesInformation[data] as [])?.slice(0),
      gamesInformation.asc
    );

    dispatch({ type: actionTypes.SHORT_DATA_BY_NAME });

    setTimeout(
      () =>
        dispatch({
          type: actionTypes.SHORT_DATA_BY_NAME_SUCCESS,
          payload: { response: { source } },
        }),
      500
    );
  };

  return {
    gamesInformation,
    importFile,
    initGames,
    initRemoteGames,
    loadCount,
    loadShared,
    loadGames,
    setLabelFilter,
    setTab,
    shortByName,
  };
}



