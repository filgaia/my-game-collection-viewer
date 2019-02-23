//@vendor
import { createActions } from 'redux-actions';
import get from 'lodash/get';
// @constants
import { backup } from './../data/db.json';

const actions = createActions(
    'LOAD_JSON_INFORMATION',
    'LOAD_GAMES_INFORMATION',

    'SHORT_GAMES_BY_NAME',
    'SHORT_GAMES_BY_NAME_SUCCESS'
);

const initGames = () => (dispatch) => {
    const games = get(backup, 'Game', []).slice(0);
    dispatch(actions.loadJsonInformation({ response: { games } }));
};

const loadGames = (page = 0) => (dispatch, getState) => {
    const gamesInformation = getState().gamesInformation;
    const load = 20;
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
