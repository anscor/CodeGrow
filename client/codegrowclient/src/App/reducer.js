/*
 * @Author: Anscor
 * @Date: 2020-04-09 21:12:36
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 16:10:32
 * @Description: App Reducer
 */

import * as ActionTypes from "../redux/actionts"

export const initialState = {
    visible: false,
    client: undefined,
};

export default (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.APP_MODAL_CANCEL:
            return Object.assign({}, state, {
                visible: false
            });
        case ActionTypes.APP_INITIAL_REQUEST:
            return state;

        default:
            return state;
    }
}