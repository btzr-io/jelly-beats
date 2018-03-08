//import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import _reducers from './redux/reducers'

const reducers = combineReducers(_reducers)
const store = createStore(reducers, {})

export default store
