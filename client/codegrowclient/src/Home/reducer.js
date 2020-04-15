/*
 * @Author: Anscor
 * @Date: 2020-04-12 22:00:09
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 22:03:54
 * @Description: 主页reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    disabled: false
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.HOME_MY_SUBMISSIONS_CLICK:
            return state;

        default:
            return state;
    }
};
