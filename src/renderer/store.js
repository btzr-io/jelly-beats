import { createStore, combineReducers } from 'redux'
import reducerList from './redux/reducers'

const reducers = combineReducers(reducerList)
const store = createStore(reducers, { app: null })
export default store
