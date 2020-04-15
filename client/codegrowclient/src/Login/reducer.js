/*
 * @Author: Anscor
 * @Date: 2020-04-09 20:05:26
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 19:36:28
 * @Description: login reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    loading: false
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.LOGIN_LOGIN:
            return Object.assign({}, state, {
                loading: true
            });
        case Actions.LOGIN_LOGIN_FAILED:
            return Object.assign({}, state, {
                loading: false
            });
        default:
            return state;
    }
}