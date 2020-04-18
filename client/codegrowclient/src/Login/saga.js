/*
 * @Author: Anscor
 * @Date: 2020-04-12 16:28:58
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 12:23:01
 * @Description: 登录模块saga
 */

import { take, call } from 'redux-saga/effects'

import { fetchData, fetchUser, defaultError } from '../Top'
import * as Actions from '../redux/actions'
import { URL } from '../App'

function* login(data) {
    const { res, err } =
        yield call(fetchData, URL + "auth/token/obtain/", "POST", data);
    if (res) {
        if (res.status !== 200)
            yield call(defaultError, Actions.LOGIN_LOGIN_FAILED, res.statusText);
        else {
            yield res.json().then(data => {
                localStorage.setItem("access", data["access"]);
                localStorage.setItem("refresh", data["refresh"]);
            });
            yield call(fetchUser);
        }
    } else
        yield call(defaultError, Actions.LOGIN_LOGIN_FAILED, err);
}

export default function* saga() {
    while (true) {
        const action = yield take(Actions.LOGIN_LOGIN);
        yield call(login, action.data);
    }
}
