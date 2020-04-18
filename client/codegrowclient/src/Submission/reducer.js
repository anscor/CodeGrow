/*
 * @Author: Anscor
 * @Date: 2020-04-13 19:01:38
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 12:12:40
 * @Description: 提交模块reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    submissions: undefined,
    detailVisible: false,
    textCmpVisible: false,
    submission: undefined,
    cmps: undefined,
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
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
        case Actions.SUBMISSION_TEXT_CMP_CLICK:
            return Object.assign({}, state, {
                textCmpVisible: true
            });
        case Actions.SUBMISSION_TEXT_CMP_MODAL_CLOSE:
            return Object.assign({}, state, {
                textCmpVisible: false
            });
        case Actions.SUBMISSION_FETCH_TEXT_CMP_SUCCESS:
            return Object.assign({}, state, {
                cmps: action.cmps
            });
        default:
            return state;
    }
};
