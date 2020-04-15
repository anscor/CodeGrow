/*
 * @Author: Anscor
 * @Date: 2020-04-09 21:12:36
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 12:13:46
 * @Description: App Reducer
 */

import * as Actions from "../redux/actions"

export const initialState = {
    visible: false
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        case Actions.APP_MODAL_CANCEL:
            return Object.assign({}, state, {
                visible: false
            });

        default:
            return state;
    }
}