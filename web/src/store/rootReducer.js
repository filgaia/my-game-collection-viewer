import { combineReducers } from 'redux';
import gamesInformation from '../reducers/gamesInformation';
import login from '../reducers/login';

export const rootReducer = combineReducers({
    gamesInformation,
    login
});
