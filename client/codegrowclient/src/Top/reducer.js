/*
 * @Author: Anscor
 * @Date: 2020-04-11 16:07:23
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 16:03:58
 * @Description: 公共模块reducer
 */
import { message } from 'antd';

import * as Actions from '../redux/actions'

export const initialState = {
    isLogin: undefined,
    user: null,
    problems: []
}

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_NOT_LOGIN:
            return Object.assign({}, state, {
                isLogin: false,
                user: null
            });
        case Actions.TOP_LOGIN:
            return Object.assign({}, state, {
                isLogin: true,
                user: action.user
            });
        case Actions.TOP_FETCH_PROBLEMS_SUCCESS:
            return Object.assign({}, state, {
                problems: action.problems
            });
        // case Actions.TOP_FETCH_USER_SUCCESS:
        //     return Object.assign({}, state, {
        //         isLogin: true,
        //         user: action.user
        //     });

        default:
            return state;
    }
}
