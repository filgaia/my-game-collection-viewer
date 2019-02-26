//@vendor
import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import get from 'lodash/get';
//@actions
import { actions } from '../actions/gamesInformation';

const setInitialState = () => Immutable.fromJS({
    asc: false,
    loading: true,
    source: [],
    sourceWishList: [],
    games: [],
    wishList: [],
    platforms: [],
    hasMoreItems: true,
    hasMoreItemsWishList: true
});

const gameInformationReducer = handleActions(
    {
        [actions.loadJsonInformation]: (state, action) =>
            state.merge({
                loading: false,
                source: get(action, 'payload.response.games', []),
                sourceWishList: get(action, 'payload.response.gamesInWishList', []),
                platforms: get(action, 'payload.response.platforms', []),
            }),
        [actions.loadGamesInformation]: (state, action) =>
            state.merge({
                loading: false,
                [get(action, 'payload.response.propGames')]: get(action, 'payload.response.games', []),
                [get(action, 'payload.response.propMoreItems')]: get(action, 'payload.response.hasMoreItems', false)
            }),
        [actions.shortDataByName]: (state) =>
            state.merge({
                loading: true
            }),
        [actions.shortDataByNameSuccess]: (state, action) =>
            state.merge({
                asc: !state.get('asc'),
                source: get(action, 'payload.response.source', []),
                sourceWishList: get(action, 'payload.response.sourceWishList', []),
                games: [],
                wishList: [],
                loading: false
            })
    },
    setInitialState()
);

export default gameInformationReducer;
