import React from 'react';

import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import history from '../history';
import { reducers } from './reducers';

const reducer = combineReducers({
    ...reducers,
    router: routerReducer
});

const historyMiddleware = routerMiddleware(history);

const store = createStore(reducer, {}, composeWithDevTools(applyMiddleware(thunk, historyMiddleware)));
export default store;
