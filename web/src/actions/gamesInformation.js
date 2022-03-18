// @vendor
import { createActions } from 'redux-actions';
import JSZip from 'jszip';
import get from 'lodash/get';
// @helpers
import { getSource } from '../utilities/index';
// @constants
import db from '../data/db.json';
import { ITEMS_BY_PAGE } from '../constants/index';

const actions = createActions(
  'IMPORT_FILE',
  'IMPORT_FILE_ERROR',

  'LOAD_JSON_INFORMATION',
  'LOAD_GAMES_INFORMATION',
  'LOAD_WISH_LIST_INFORMATION',

  'SET_INFORMATION_FILTER',
  'SET_INFORMATION_FILTER_SUCCESS',
  'SET_TAB',

  'SHORT_DATA_BY_NAME',
  'SHORT_DATA_BY_NAME_SUCCESS',

  'RESET_FILTERED_VALUES',

  'TOGGLE_DRAWER',
);

const initGames = (source) => (dispatch) => {
  const json = source || db.backup;
  const allGames = get(json, 'Game', []).slice(0);
  const gamesLabels = get(json, 'GameLabel', []).slice(0);
  const labels = get(json, 'Label', []).slice(0);
  const platforms = get(json, 'Platform', []).slice(0);

  const gamesWithLabels = allGames.map((game) => {
    const gameLabels = gamesLabels.filter((gameLabel) => gameLabel.game_id === game.id);
    return {
      ...game,
      labels: gameLabels.map((gameLabel) => labels.find(
        (label) => label.id === gameLabel.label_id,
      )),
    };
  });

  const games = gamesWithLabels.filter((game) => !get(game, 'is_wishlist_item', false));
  const gamesInWishList = gamesWithLabels.filter((game) => get(game, 'is_wishlist_item', false));

  dispatch(actions.loadJsonInformation({
    response: {
      games, gamesInWishList, labels, platforms,
    },
  }));
};

const importFile = (file) => (dispatch) => {
  const zip = new JSZip();
  const fullname = get(file, 'name', '').split('.');
  const [name] = fullname;

  if (name) {
    zip.loadAsync(file).then(() => {
      zip.file(name).async('string').then((data) => {
        const json = JSON.parse(data);
        dispatch(actions.importFile());
        dispatch(initGames(get(json, 'backup')));
      });
    }).catch((e) => {
      dispatch(actions.importFileError({ error: get(e, 'Error', '') }));
    });
  }
};

const getListByPage = (page, source) => {
  const load = ITEMS_BY_PAGE;
  const start = page * load;
  const games = source.slice(start, start + load);
  const hasMoreItems = source.length > (start + games.length);
  return {
    games,
    hasMoreItems,
  };
};

const loadGames = (page, params) => (dispatch) => {
  const listGames = getListByPage(page, params.source);

  dispatch(actions.loadGamesInformation({
    response: {
      propGames: params.propGames,
      propMoreItems: params.propMoreItems,
      ...listGames,
    },
  }));
};

const reverseList = (s, asc) => {
  let source = s;

  source = source.sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

  if (asc) {
    source = source.reverse();
  }

  return source;
};

const setLabelFilter = (idLabelFilter) => (dispatch, getState) => {
  if (idLabelFilter) {
    const source = getState().gamesInformation.get('source');
    const sourceFiltered = source.filter((game) => {
      const label = game.labels.find((l) => l.id === idLabelFilter);
      return !!label;
    });
    const page = 0;
    const listGames = getListByPage(page, sourceFiltered);
    dispatch(actions.setInformationFilter());
    setTimeout(() => {
      dispatch(actions.setInformationFilterSuccess({
        response: {
          idLabelFilter,
          sourceFiltered,
          ...listGames,
        },
      }));
    }, 500);
  } else {
    dispatch(actions.resetFilteredValues());
  }
};

const shortByName = () => (dispatch, getState) => {
  const { gamesInformation } = getState();
  const tab = gamesInformation.get('tab');
  const idLabelFilter = gamesInformation.get('idLabelFilter');
  const data = getSource(tab, idLabelFilter);
  const source = reverseList(gamesInformation.get(data).slice(0), gamesInformation.get('asc'));

  dispatch(actions.shortDataByName());
  setTimeout(() => {
    dispatch(actions.shortDataByNameSuccess({ response: { source } }));
  }, 500);
};

export {
  actions,
  importFile,
  initGames,
  loadGames,
  setLabelFilter,
  shortByName,
};
