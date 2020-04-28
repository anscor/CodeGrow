/*
 * @Author: Anscor
 * @Date: 2020-04-12 22:00:09
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-28 17:22:48
 * @Description: 主页reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    disabled: false,
    visible: false,
    desc: ""
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        case Actions.HOME_MY_SUBMISSIONS_CLICK:
            return state;
        case Actions.HOME_DESC_CLOSE:
            return Object.assign({}, state, {
                visible: false
            });
        case Actions.HOME_DESC_CLICK:
            return Object.assign({}, state, {
                visible: true,
                desc: action.desc
            });
        default:
            return state;
    }
};
