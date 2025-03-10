import {configureStore} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { applyMiddleware } from '@reduxjs/toolkit'
import user from './Reducers/user'
import manager from './Reducers/manager'
import state from './Reducers/state'
import participant from './Reducers/participant'
import campaign from './Reducers/campaign'
import admin from './Reducers/admin'
import {legacy_createStore,combineReducers} from 'redux';


const rootReducer = combineReducers({
  manager: manager,
  user: user,
  campaign: campaign,
  participant: participant,
  state: state,
  admin: admin
  
});

//const middleware = [thunk];

const store = legacy_createStore(rootReducer,applyMiddleware(thunk));

export default store;
