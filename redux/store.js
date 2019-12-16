import allReducers from './allReducers'
import {createStore} from 'redux'

const store=createStore(allReducers)
export default store