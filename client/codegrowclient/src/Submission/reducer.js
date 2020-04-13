/*
 * @Author: Anscor
 * @Date: 2020-04-13 19:01:38
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-13 19:56:23
 * @Description: 提交模块reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    submissions: undefined
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.SUBMISSION_FETCH_SUBMISSIONS_SUCCESS:
            return Object.assign({}, state, {
                submissions: action.submissions
            });

        default:
            return state;
    }
};
