/*
 * @Author: Anscor
 * @Date: 2020-04-11 16:07:23
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 22:36:50
 * @Description: 公共模块reducer
 */
import { message } from 'antd';

import * as Actions from '../redux/actionts'

export const initialState = {
    isLogin: false,
    user: null,
    problems: []
}

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_NOT_LOGIN:
            message.error(action.message);
            return Object.assign({}, state, {
                isLogin: false,
                user: null
            });
        case Actions.TOP_LOGIN:
            return Object.assign({}, state, {
                isLogin: false,
                user: null
            });
        case Actions.TOP_FETCH_PROBLEMS_SUCCESS:
            return Object.assign({}, state, {
                problems: action.problems.data.problemSets
            });
        case Actions.TOP_FETCH_USER_SUCCESS:
            return Object.assign({}, state, {
                isLogin: true,
                user: action.user
            });

        default:
            return state;
    }
}
