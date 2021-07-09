//@vendor
import get from "lodash/get";
// @constants
import { CATALOG_TAB, ITEMS_BY_PAGE } from "../constants/index";
import { actionTypes } from "../actionTypes/gamesTypes";
import { IActionType, ICatalog } from "../models/gamesModel";

const shortDataByName = (state: ICatalog, action: IActionType): ICatalog => {
  const isCatalog = state.tab === CATALOG_TAB;
  const idLabelFilter = state.idLabelFilter;
  let source = "source";
  if (!isCatalog) {
    source = "sourceWishList";
  } else if (idLabelFilter) {
    source = "sourceFiltered";
  }
  const view = isCatalog ? "games" : "wishList";
  const hasItems = isCatalog ? "hasMoreItems" : "hasMoreItemsWishList";

  return {
    ...state,
    asc: !state.asc,
    [source]: get(action, "payload.response.source", []),
    [view]: [],
    [hasItems]: true,
    loading: false,
  };
};

function gamesReducer(state: ICatalog, action: IActionType): ICatalog {
  switch (action.type) {
    case actionTypes.LOAD_JSON_INFORMATION: {
      return {
        ...state,
        loading: false,
        source: get(action, "payload.response.games", []),
        sourceWishList: get(action, "payload.response.gamesInWishList", []),
        labels: get(action, "payload.response.labels", []),
        platforms: get(action, "payload.response.platforms", []),
      };
    }
    case actionTypes.LOAD_GAMES_INFORMATION: {
      return {
        ...state,
        loading: false,
        [get(action, "payload.response.propGames")]: get(
          action,
          "payload.response.games",
          []
        ),
        [get(action, "payload.response.propMoreItems")]: get(
          action,
          "payload.response.hasMoreItems",
          false
        ),
      };
    }
    case actionTypes.SHORT_DATA_BY_NAME:
    case actionTypes.SET_INFORMATION_FILTER: {
      return {
        ...state,
        loading: true,
      };
    }
    case actionTypes.SHORT_DATA_BY_NAME_SUCCESS: {
      return shortDataByName(state, action);
    }
    case actionTypes.SET_INFORMATION_FILTER_SUCCESS: {
      return {
        ...state,
        games: [],
        sourceFiltered: get(action, "payload.response.sourceFiltered", []),
        idLabelFilter: get(action, "payload.response.idLabelFilter", null),
        loading: false,
        hasMoreItems: true,
      };
    }
    case actionTypes.SET_TAB: {
      return {
        ...state,
        tab: get(action, "payload.tab"),
      };
    }
    case actionTypes.RESET_FILTERED_VALUES: {
      return {
        ...state,
        games: state.source?.slice(0, ITEMS_BY_PAGE),
        sourceFiltered: [],
        idLabelFilter: null,
      };
    }
    case actionTypes.TOGGLE_DRAWER: {
      return {
        ...state,
        [get(action, "payload.response.drawer")]: get(
          action,
          "payload.response.open",
          false
        ),
      };
    }
    case actionTypes.IMPORT_FILE: {
      return {
        ...state,
        games: [],
        wishList: [],
        importDrawer: false,
        error: false,
        loading: true,
      };
    }
    case actionTypes.IMPORT_FILE_ERROR: {
      return {
        ...state,
        error: true,
        importDrawer: false,
      };
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
}

export default gamesReducer;
