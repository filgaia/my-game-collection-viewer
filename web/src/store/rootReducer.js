import { combineReducers } from 'redux';
import gamesInformation from '../reducers/gamesInformation';
import login from '../reducers/login';

export default combineReducers({
  gamesInformation,
  login,
});
