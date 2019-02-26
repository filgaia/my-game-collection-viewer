//@vendor
import { createActions } from 'redux-actions';
import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
// @constants
import { backup } from './../data/db.json';
import { ITEMS_BY_PAGE } from './../constants/index';

const actions = createActions(
    'LOAD_JSON_INFORMATION',
    'LOAD_GAMES_INFORMATION',
    'LOAD_WISH_LIST_INFORMATION',

    'SHORT_DATA_BY_NAME',
    'SHORT_DATA_BY_NAME_SUCCESS'
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

    dispatch(actions.loadJsonInformation({ response: { games, gamesInWishList, platforms } }));
};

const loadGames = (params) => (dispatch) => {
    const load = ITEMS_BY_PAGE;
    const start = params.page * load;
    const games = params.source.slice(0, start + load);
    const hasMoreItems = games.length > params.source.length;
    dispatch(actions.loadGamesInformation({
        response: {
            propGames: params.propGames,
            games,
            propMoreItems: params.propMoreItems,
            hasMoreItems
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

const shortByName = () => (dispatch, getState) => {
    const gamesInformation = getState().gamesInformation;

    const source = reverseList(gamesInformation.get('source').slice(0), gamesInformation.get('asc'));
    const sourceWishList = reverseList(gamesInformation.get('sourceWishList').slice(0), gamesInformation.get('asc'));

    dispatch(actions.shortDataByName());
    setTimeout(() => {
        dispatch(actions.shortDataByNameSuccess({ response: { source, sourceWishList } }));
    }, 500);
};

export {
    actions,
    initGames,
    loadGames,
    shortByName
};
