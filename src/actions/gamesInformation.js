//@vendor
import { createActions } from 'redux-actions';
import get from 'lodash/get';
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

    'RESET_FILTERED_VALUES',

    'TOGGLE_DRAWER'
);

const initGames = () => (dispatch) => {
    const allGames = get(backup, 'Game', []).slice(0);
    const gamesLabels = get(backup, 'GameLabel', []).slice(0);
    const labels = get(backup, 'Label', []).slice(0);
    const platforms = get(backup, 'Platform', []).slice(0);

    const gamesWithLabels = allGames.map(game => {
        const gameLabels = gamesLabels.filter(gameLabel => gameLabel.game_id === game.id);
        return Object.assign({}, game, {
            labels: gameLabels.map(gameLabel => labels.find(label => label.id === gameLabel.label_id))
        });
    });

    const games = gamesWithLabels.filter(game => !get(game, 'is_wishlist_item', false));
    const gamesInWishList = gamesWithLabels.filter(game => get(game, 'is_wishlist_item', false));

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

        const source = getState().gamesInformation.get('source');
        const sourceFiltered = source.filter(game => {
            const label = game.labels.find(label => label.id === idLabelFilter);
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
