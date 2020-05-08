/*
 * @Author: Anscor
 * @Date: 2020-04-09 20:08:14
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-04 10:49:03
 * @Description: Redux Reducer
 */
import { combineReducers } from 'redux';

import {
    default as LoginReducer,
    initialState as LoginState
} from '../Login/reducer'
import {
    default as AppReducer,
    initialState as AppState
} from '../App/reducer'
import {
    default as TopReducer,
    initialState as TopState
} from '../Top/reducer'
import {
    default as HomeReducer,
    initialState as HomeState
} from '../Home/reducer'
import {
    default as SubmissionReducer,
    initialState as SubmissionState
} from '../Submission/reducer'

import {
    default as ProfileReducer,
    initialState as ProfileState
} from '../Profile/reducer'

import {
    default as StatisticsReducer,
    initialState as StatisticsState
} from '../Statistics/reducer'

export const initialState = {
    top: TopState,
    app: AppState,
    login: LoginState,
    home: HomeState,
    submission: SubmissionState,
    profile: ProfileState,
    statistics: StatisticsState
};

export default combineReducers({
    top: TopReducer,
    login: LoginReducer,
    app: AppReducer,
    home: HomeReducer,
    submission: SubmissionReducer,
    profile: ProfileReducer,
    statistics: StatisticsReducer
});