//@vendor
import { createActions } from 'redux-actions';
import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
// @constants
import { backup } from './../data/db.json';
import { ITEMS_BY_PAGE, CATALOG_TAB } from './../constants/index';

const actions = createActions(
    'LOAD_JSON_INFORMATION',
    'LOAD_GAMES_INFORMATION',
    'LOAD_WISH_LIST_INFORMATION',

    'SET_INFORMATION_FILTER',
    'SET_TAB',

    'SHORT_DATA_BY_NAME',
    'SHORT_DATA_BY_NAME_SUCCESS',

    'RESET_FILTERED_VALUES'
);

const initGames = () => (dispatch) => {
    const allGames = get(backup, 'Game', []).slice(0);
    const gamesLabels = get(backup, 'GameLabel', []);
    const labels = get(backup, 'Label', []);
    const platforms = get(backup, 'Platform', []);

    const gamesWithLabels = allGames.map(game => {
        const gameLabels = filter(gamesLabels, gameLabel => gameLabel.game_id === game.id);
        game.labels = gameLabels.map(gameLabel => find(labels, label => label.id === gameLabel.label_id));
        return game;
    });

    const games = filter(gamesWithLabels, game => !game.is_wishlist_item);
    const gamesInWishList = filter(gamesWithLabels, game => game.is_wishlist_item);

    dispatch(actions.loadJsonInformation({ response: { games, gamesInWishList, labels, platforms } }));
};

const getListByPage = (page, source) => {
    const load = ITEMS_BY_PAGE;
    const start = page * load;
    const games = source.slice(start, start + load);
    const hasMoreItems = source.length > games.length;
    return {
        games,
        hasMoreItems
    };
};

const loadGames = (page, params) => (dispatch) => {
    const listGames = getListByPage(page, params.source);
    dispatch(actions.loadGamesInformation({
        response: {
            propGames: params.propGames,
            propMoreItems: params.propMoreItems,
            ...listGames
        }
    }));
};

const reverseList = (source, asc) => {
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

        const gamesInformation = getState().gamesInformation;
        const sourceFiltered = filter(gamesInformation.get('source'), game => {
            const label = find(game.labels, label => label.id === idLabelFilter);
            return !!label;
        });
        const page = 0;
        const listGames = getListByPage(page, sourceFiltered);
        dispatch(actions.setInformationFilter({
            response: {
                idLabelFilter,
                sourceFiltered,
                ...listGames
            }
        }));
    } else {
        dispatch(actions.resetFilteredValues());
    }
};

const shortByName = () => (dispatch, getState) => {
    const gamesInformation = getState().gamesInformation;
    const tab = gamesInformation.get('tab');
    const idLabelFilter = gamesInformation.get('idLabelFilter');
    let data = 'source';
    if (tab !== CATALOG_TAB) {
        data = 'sourceWishList';
    } else if (idLabelFilter) {
        data = 'sourceFiltered';
    }
    const source = reverseList(gamesInformation.get(data).slice(0), gamesInformation.get('asc'));

    dispatch(actions.shortDataByName());
    setTimeout(() => {
        dispatch(actions.shortDataByNameSuccess({ response: { source } }));
    }, 500);
};

export {
    actions,
    initGames,
    loadGames,
    setLabelFilter,
    shortByName
};
