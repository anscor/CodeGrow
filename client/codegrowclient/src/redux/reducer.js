/*
 * @Author: Anscor
 * @Date: 2020-04-09 20:08:14
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 16:54:39
 * @Description: Redux Reducer
 */
import { combineReducers } from 'redux';

import { default as LoginReducer, initialState as LoginState } from '../Login/reducer'
import { default as AppReducer, initialState as AppState } from '../App/reducer'
import { default as TopReducer, initialState as TopState } from '../Top/reducer'

export const initialState = {
    top: TopState,
    app: AppState,
    login: LoginState
};

export default combineReducers({
    top: TopReducer,
    login: LoginReducer,
    app: AppReducer
});