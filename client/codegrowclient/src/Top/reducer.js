/*
 * @Author: Anscor
 * @Date: 2020-04-11 16:07:23
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-13 16:57:52
 * @Description: 公共模块reducer
 */
import * as Actions from '../redux/actions'

export const initialState = {
    isLogin: undefined,
    user: null,
    problems: undefined
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

        default:
            return state;
    }
}
