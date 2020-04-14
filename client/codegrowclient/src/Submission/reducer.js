/*
 * @Author: Anscor
 * @Date: 2020-04-13 19:01:38
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-14 17:15:51
 * @Description: 提交模块reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    submissions: undefined,
    detailVisible: false,
    submission: undefined
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.SUBMISSION_FETCH_SUBMISSIONS_SUCCESS:
            return Object.assign({}, state, {
                submissions: action.submissions
            });
        case Actions.SUBMISSION_DETAIL_MODAL_CLOSE:
            return Object.assign({}, state, {
                detailVisible: false
            });
        case Actions.SUBMISSION_DETAIL_CLICK:
            return Object.assign({}, state, {
                detailVisible: true,
                submission: action.submission
            });

        default:
            return state;
    }
};
