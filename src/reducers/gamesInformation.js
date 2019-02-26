//@vendor
import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import get from 'lodash/get';
//@actions
import { actions } from '../actions/gamesInformation';
// @constants
import { CATALOG_TAB } from '../constants/index';

const setInitialState = () => Immutable.fromJS({
    asc: false,
    games: [],
    hasMoreItems: true,
    hasMoreItemsWishList: true,
    loading: true,
    platforms: [],
    source: [],
    sourceWishList: [],
    tab: CATALOG_TAB,
    wishList: []
});

const shortDataByName = (state, action) => {
    const isCatalog = state.get('tab') === CATALOG_TAB;
    const source = isCatalog ? 'source' : 'sourceWishList';
    const view = isCatalog ? 'games' : 'wishList';
    const hasItems = isCatalog ? 'hasMoreItems' : 'hasMoreItemsWishList';

    return state.merge({
        asc: !state.get('asc'),
        [source]: get(action, 'payload.response.source', []),
        [view]: [],
        [hasItems]: true,
        loading: false
    });
};

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
            state.mergeDeep({
                loading: false,
                [get(action, 'payload.response.propGames')]: get(action, 'payload.response.games', []),
                [get(action, 'payload.response.propMoreItems')]: get(action, 'payload.response.hasMoreItems', false)
            }),
        [actions.shortDataByName]: (state) =>
            state.merge({
                loading: true
            }),
        [actions.shortDataByNameSuccess]: (state, action) =>
            shortDataByName(state, action),
        [actions.setTab]: (state, action) =>
            state.merge({
                tab: get(action, 'payload.tab')
            })
    },
    setInitialState()
);

export default gameInformationReducer;
