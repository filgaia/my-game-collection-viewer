import { createStore, applyMiddleware } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

const configureStore = () => {
  const middleware = [
    thunk,
    reduxImmutableStateInvariant(),
  ];

  const store = createStore(
    rootReducer,
    applyMiddleware(...middleware),
  );

  return store;
};

export default configureStore;
