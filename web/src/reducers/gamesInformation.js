// @vendor
import Immutable from 'immutable';
import { handleActions, combineActions } from 'redux-actions';
import get from 'lodash/get';
// @actions
import { actions } from '../actions/gamesInformation';
// @constants
import { CATALOG_TAB, ITEMS_BY_PAGE } from '../constants/index';

const setInitialState = () => Immutable.fromJS({
  asc: false,
  filterDrawer: false,
  games: [],
  hasMoreItems: true,
  hasMoreItemsWishList: true,
  idLabelFilter: null,
  importDrawer: false,
  labels: [],
  loading: true,
  platforms: [],
  source: [],
  sourceFiltered: [],
  sourceWishList: [],
  tab: CATALOG_TAB,
  wishList: [],
});

const shortDataByName = (state, action) => {
  const isCatalog = state.get('tab') === CATALOG_TAB;
  const idLabelFilter = state.get('idLabelFilter');
  let source = 'source';
  if (!isCatalog) {
    source = 'sourceWishList';
  } else if (idLabelFilter) {
    source = 'sourceFiltered';
  }
  const view = isCatalog ? 'games' : 'wishList';
  const hasItems = isCatalog ? 'hasMoreItems' : 'hasMoreItemsWishList';

  return state.merge({
    asc: !state.get('asc'),
    [source]: get(action, 'payload.response.source', []),
    [view]: [],
    [hasItems]: true,
    loading: false,
  });
};

const gameInformationReducer = handleActions(
  {
    [actions.loadJsonInformation]: (state, action) => state.merge({
      loading: false,
      source: get(action, 'payload.response.games', []),
      sourceWishList: get(action, 'payload.response.gamesInWishList', []),
      labels: get(action, 'payload.response.labels', []),
      platforms: get(action, 'payload.response.platforms', []),
    }),
    [actions.loadGamesInformation]: (state, action) => state.mergeDeep({
      loading: false,
      [get(action, 'payload.response.propGames')]: get(action, 'payload.response.games', []),
      [get(action, 'payload.response.propMoreItems')]: get(action, 'payload.response.hasMoreItems', false),
    }),
    [combineActions(
      actions.shortDataByName,
      actions.setInformationFilter,
    )]: (state) => state.merge({
      loading: true,
    }),
    [actions.shortDataByNameSuccess]: (state, action) => shortDataByName(state, action),
    [actions.setInformationFilterSuccess]: (state, action) => state.merge({
      games: [],
      sourceFiltered: get(action, 'payload.response.sourceFiltered', []),
      idLabelFilter: get(action, 'payload.response.idLabelFilter', null),
      loading: false,
      hasMoreItems: true,
    }),
    [actions.setTab]: (state, action) => state.merge({
      tab: get(action, 'payload.tab'),
    }),
    [actions.resetFilteredValues]: (state) => state.merge({
      games: state.get('source').slice(0, ITEMS_BY_PAGE),
      sourceFiltered: [],
      idLabelFilter: null,
    }),
    [actions.toggleDrawer]: (state, action) => state.merge({
      [get(action, 'payload.response.drawer')]: get(action, 'payload.response.open', false),
    }),
    [actions.importFile]: (state) => state.merge({
      games: [],
      wishList: [],
      importDrawer: false,
      error: false,
      loading: true,
    }),
    [actions.importFileError]: (state) => state.merge({
      error: true,
      importDrawer: false,
    }),
  },
  setInitialState(),
);

export default gameInformationReducer;
