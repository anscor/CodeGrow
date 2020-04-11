/*
 * @Author: Anscor
 * @Date: 2020-04-11 16:51:19
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 22:24:23
 * @Description: 公共模块saga
 */

import { take, fork, all } from 'redux-saga/effects'
import { message } from 'antd'

import * as Actions from '../redux/actionts'
import { verifyToken, fetchProblems } from './index'

function* initialRequest() {
    while (true) {
        yield take(Actions.APP_INITIAL_REQUEST);
        yield fork(verifyToken);
        yield fork(fetchProblems);
    }
}

function* defaultMessage() {
    while (true) {
        const action = yield take(Actions.TOP_MESSAGE);
        message.error(action.message);
    }
}

export default function* saga() {
    yield all([
        initialRequest(),
        defaultMessage()
    ]);
}
