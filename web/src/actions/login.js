// @vendor
import { createActions } from 'redux-actions';

const actions = createActions(
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGOUT_SUCCESS',
);

export {
  actions,
};
