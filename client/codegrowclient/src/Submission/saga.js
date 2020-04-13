/*
 * @Author: Anscor
 * @Date: 2020-04-13 19:20:54
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-13 21:38:52
 * @Description: 提交模块saga
 */

import { take, put, call } from 'redux-saga/effects'

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

export default function* saga() {
    while (true) {
        const action = yield take(Actions.SUBMISSION_FETCH_SUBMISSIONS);
        console.log(action);
        yield call(fetchSubmission, action.id);
    }
}
