//@vendor
import { createActions } from 'redux-actions';
import get from 'lodash/get';
// @constants
import { backup } from './../data/db.json';

const actions = createActions(
    'LOAD_JSON_INFORMATION'
);

const loadJson = (page = 0) => (dispatch, getState) => {
    const load = 20;
    const start = page * load;
    const games = get(backup, 'Game', []).slice(0, start + load);
    const hasMoreItems = games.length >= length;
    dispatch(actions.loadJsonInformation({ response: { games, hasMoreItems } }));
};


export {
    actions,
    loadJson
};
