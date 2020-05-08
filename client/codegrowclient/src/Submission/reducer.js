/*
 * @Author: Anscor
 * @Date: 2020-04-13 19:01:38
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-08 17:03:26
 * @Description: 提交模块reducer
 */

import * as Actions from '../redux/actions'

export const initialState = {
    user: undefined,
    users: [],
    submissions: undefined,
    detailVisible: false,
    textCmpVisible: false,
    syntaxCmpVisible: false,
    submission: undefined,
    textCmps: undefined,
    syntaxCmps: undefined
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        case Actions.SUBMISSION_SET_USERS:
            return Object.assign({}, state, {
                users: action.users
            });
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
                textCmpVisible: true,
                textCmps: undefined
            });
        case Actions.SUBMISSION_TEXT_CMP_MODAL_CLOSE:
            return Object.assign({}, state, {
                textCmpVisible: false
            });
        case Actions.SUBMISSION_FETCH_TEXT_CMP_SUCCESS:
            return Object.assign({}, state, {
                textCmps: action.textCmps
            });
        case Actions.SUBMISSION_SYNTAX_CMP_CLICK:
            return Object.assign({}, state, {
                syntaxCmpVisible: true,
                syntaxCmps: undefined
            });
        case Actions.SUBMISSION_SYNTAX_CMP_MODAL_CLOSE:
            return Object.assign({}, state, {
                syntaxCmpVisible: false
            });
        case Actions.SUBMISSION_FETCH_SYNTAX_CMP_SUCCESS:
            return Object.assign({}, state, {
                syntaxCmps: action.syntaxCmps
            });
        default:
            return state;
    }
};
