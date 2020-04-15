/*
 * @Author: Anscor
 * @Date: 2020-04-15 15:50:50
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 22:26:06
 * @Description: 用户账户设置reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    loading: false
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        case Actions.PROFILE_UPDATE:
            return Object.assign({}, state, {
                loading: true
            });
        case Actions.PROFILE_UPDATE_FAILED:
            return Object.assign({}, state, {
                loading: false
            });
        case Actions.PROFILE_UPDATE_SUCCESS:
            return Object.assign({}, state, {
                loading: false
            });
        default:
            return state;
    }
};
