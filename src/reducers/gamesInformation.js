//@vendor
import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import get from 'lodash/get';
//@actions
const { actions } = require('../actions/gamesInformation');

const setInitialState = () => Immutable.fromJS({
    asc: false,
    loading: true,
    source: [],
    games: [],
    hasMoreItems: true
});

const gameInformationReducer = handleActions(
    {
        [actions.loadJsonInformation]: (state, action) =>
            state.merge({
                loading: false,
                source: get(action, 'payload.response.games', [])
            }),
        [actions.loadGamesInformation]: (state, action) =>
            state.merge({
                loading: false,
                games: get(action, 'payload.response.games', []),
                hasMoreItems: get(action, 'payload.response.hasMoreItems', false)
            }),
        [actions.shortGamesByName]: (state) =>
            state.merge({
                loading: true
            }),
        [actions.shortGamesByNameSuccess]: (state, action) =>
            state.merge({
                asc: !state.get('asc'),
                source: get(action, 'payload.response.source', []),
                games: [],
                loading: false
            })
    },
    setInitialState()
);

export default gameInformationReducer;
