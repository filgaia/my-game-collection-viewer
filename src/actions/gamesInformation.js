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

    'SHORT_GAMES_BY_NAME',
    'SHORT_GAMES_BY_NAME_SUCCESS'
);

const initGames = () => (dispatch) => {
    const games = get(backup, 'Game', []).slice(0);
    const gamesLabels = get(backup, 'GameLabel', []);
    const labels = get(backup, 'Label', []);
    const platforms = get(backup, 'Platform', []);

    const gamesWithLabels = games.map(game => {
        const gameLabels = filter(gamesLabels, gameLabel => gameLabel.game_id === game.id);
        game.labels = gameLabels.map(gameLabel => find(labels, label => label.id === gameLabel.label_id));
        return game;
    });

    dispatch(actions.loadJsonInformation({ response: { games: gamesWithLabels, platforms } }));
};

const loadGames = (page = 0) => (dispatch, getState) => {
    const gamesInformation = getState().gamesInformation;
    const load = ITEMS_BY_PAGE;
    const start = page * load;
    const games = gamesInformation.get('source').slice(0, start + load);
    const hasMoreItems = games.length >= length;
    dispatch(actions.loadGamesInformation({ response: { games, hasMoreItems } }));
};

const shortByName = () => (dispatch, getState) => {
    const gamesInformation = getState().gamesInformation;
    const asc = gamesInformation.get('asc');
    let source = gamesInformation.get('source').slice(0);
    source = source.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    });

    if (asc) {
        source = source.reverse();
    }

    dispatch(actions.shortGamesByName());
    setTimeout(() => {
        dispatch(actions.shortGamesByNameSuccess({ response: { source } }));
    }, 500);
};

export {
    actions,
    initGames,
    loadGames,
    shortByName
};
