/*
 * @Author: Anscor
 * @Date: 2020-04-09 21:12:36
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 16:07:37
 * @Description: App Reducer
 */

import * as ActionTypes from "../redux/actions"

export const initialState = {
    visible: false
};

export default (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.APP_MODAL_CANCEL:
            return Object.assign({}, state, {
                visible: false
            });

        default:
            return state;
    }
}