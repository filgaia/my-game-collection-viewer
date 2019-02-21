//@vendor
import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import get from 'lodash/get';
//@actions
const { actions } = require('../actions/gamesInformation');

const setInitialState = () => Immutable.fromJS({
    games: [],
    hasMoreItems: true
});

const gameInformationReducer = handleActions(
    {
        [actions.loadJsonInformation]: (state, action) =>
            state.merge({
                games: get(action, 'payload.response.games', []),
                hasMoreItems: get(action, 'payload.response.hasMoreItems', false)
            })
    },
    setInitialState()
);

export default gameInformationReducer;
