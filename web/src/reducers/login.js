// @vendor
import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import get from 'lodash/get';
// @actions
import loginActions from '../actions/login';

const setInitialState = () => Immutable.fromJS({
  isAuthenticated: false,
  tokenId: null,
  error: '',
});

const loginReducer = handleActions(
  {
    [loginActions.actions.loginSuccess]: (state, action) => state.merge({
      isAuthenticated: true,
      tokenId: get(action, 'payload.tokenId', null),
    }),
    [loginActions.actions.loginFailure]: (state, action) => state.merge({
      isAuthenticated: false,
      tokenId: null,
      error: get(action, 'payload.error', ''),
    }),
    [loginActions.actions.logoutSuccess]: (state) => state.merge({
      isAuthenticated: false,
      tokenId: null,
    }),
  },
  setInitialState(),
);

export default loginReducer;
