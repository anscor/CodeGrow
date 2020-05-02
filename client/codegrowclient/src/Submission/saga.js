/*
 * @Author: Anscor
 * @Date: 2020-04-13 19:20:54
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-01 17:22:50
 * @Description: 提交模块saga
 */

import { take, put, call, all } from 'redux-saga/effects'

import * as Actions from '../redux/actions'
import { fetchApi } from '../Top'

function* fetchSubmission(id) {
    const { data, err } = yield call(fetchApi, `{
        submissions(problemId: ${id}) {
            id
            code
            result
            memory
            time
            language
            compileErrorInfo
            submitTime
            ip
        }
    }`, true);
    if (data)
        yield put({
            type: Actions.SUBMISSION_FETCH_SUBMISSIONS_SUCCESS,
            submissions: data.data.submissions
        });
    else
        yield put({ type: Actions.TOP_MESSAGE, message: err });
}

function* fetchCodeTextCmp(id) {
    const { data, err } = yield call(fetchApi, `{
        codeTextCmp(submissionId: ${id}) {
            order
            oldSymbol
            oldLineNumber
            oldLine
            newSymbol
            newLineNumber
            newLine
        }
    }`, true);
    if (data)
        yield put({
            type: Actions.SUBMISSION_FETCH_TEXT_CMP_SUCCESS,
            textCmps: data.data.codeTextCmp
        });
    else
        yield put({ type: Actions.TOP_MESSAGE, message: err });
}

function* fetchCodeSyntaxCmp(id) {
    const { data, err } = yield call(fetchApi, `{
        codeSyntaxCmp(submissionId: ${id}) {
            order
            oldLineNumber
            oldLine
            newLineNumber
            newLine
            isSame
        }
    }`, true);
    if (data)
        yield put({
            type: Actions.SUBMISSION_FETCH_SYNTAX_CMP_SUCCESS,
            syntaxCmps: data.data.codeSyntaxCmp
        });
    else
        yield put({ type: Actions.TOP_MESSAGE, message: err });
}

function* fetchSubmissionSaga() {
    while (true) {
        const action = yield take(Actions.SUBMISSION_FETCH_SUBMISSIONS);
        yield call(fetchSubmission, action.id);
    }
}

function* fetchCodeTextCmpSaga() {
    while (true) {
        const action = yield take(Actions.SUBMISSION_TEXT_CMP_CLICK);
        yield call(fetchCodeTextCmp, action.id);
    }
}
function* fetchCodeSyntaxCmpSaga() {
    while (true) {
        const action = yield take(Actions.SUBMISSION_SYNTAX_CMP_CLICK);
        yield call(fetchCodeSyntaxCmp, action.id);
    }
}

export default function* saga() {
    yield all([
        fetchCodeSyntaxCmpSaga(),
        fetchCodeTextCmpSaga(),
        fetchSubmissionSaga()
    ]);
}
