/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:42:36
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-04 10:49:15
 * @Description: file content
 */

import * as Actions from '../redux/actions'

export const initialState = {

};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        default:
            return state;
    }
};
