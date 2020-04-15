/*
 * @Author: Anscor
 * @Date: 2020-04-12 22:00:09
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 12:12:21
 * @Description: 主页reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    disabled: false
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        case Actions.HOME_MY_SUBMISSIONS_CLICK:
            return state;

        default:
            return state;
    }
};
