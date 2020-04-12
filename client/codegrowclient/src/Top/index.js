/*
 * @Author: Anscor
 * @Date: 2020-04-11 16:06:22
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 17:43:58
 * @Description: 公共模块
 */
import { put, call } from 'redux-saga/effects'

import { URL } from '../App'
import * as Actions from '../redux/actions'

export const fetchData = (url, method, args) => {
    return fetch(url, {
        method: method,
        body: JSON.stringify(args),
        headers: {
            "content-type": "application/json"
        }
    }).then(res => {
        if (res.status === 400) throw new Error("请求参数错误！");
        if (res.status >= 500) throw new Error("服务器错误！");
        return { res: res, err: undefined };
    }).catch(err => {
        console.log(err);
        return { res: undefined, err: err.message };
    });
}

export const fetchApi = (query, auth, token) => {
    let headers = new Headers({
        "content-type": "application/json"
    });
    token = token || localStorage.getItem("access");
    if (auth)
        headers.append("Authorization", "Bearer " + token);
    return fetch(URL + "api/", {
        method: "POST",
        body: JSON.stringify({ query: query }),
        headers: headers
    }).then(res => {
        if (res.status === 400) throw new Error("请求参数错误！");
        if (res.status >= 500) throw new Error("服务器错误！");
        if (res.status !== 200) throw new Error(res.statusText);
        return res.json();
    }).then(data => {
        return { data, undefined };
    }).catch(err => {
        console.log(err);
        err = err.message;
        return { undefined, err };
    });
}

export function* defaultError(type, err) {
    yield put({ type: type });
    yield put({ type: Actions.TOP_MESSAGE, message: err });
}

function* refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
        yield call(defaultError, Actions.TOP_NOT_LOGIN, "没有登录！");
    } else {
        const { res, err } =
            yield call(fetchData, URL + "auth/token/refresh/", "POST", { refresh: refresh });
        if (res) {
            if (res.status !== 200)
                yield call(defaultError,
                    Actions.TOP_NOT_LOGIN, "身份验证已过期，请重新登录！");
            else {
                res.json().then(data => {
                    localStorage.setItem("access", data["access"]);
                });
                yield call(fetchUser);
            }
        } else yield call(defaultError, Actions.TOP_NOT_LOGIN, err);
    }
}

export function* verifyToken() {
    const access = localStorage.getItem("access");
    if (!access)
        yield call(defaultError, Actions.TOP_NOT_LOGIN, "没有登录！");
    else {
        const { res, err } =
            yield call(fetchData, URL + "auth/token/verify/", "POST", { token: access });
        if (res) {
            if (res.status !== 200) {
                yield call(refreshToken);
            } else
                yield call(fetchUser);
        } else yield call(defaultError, Actions.TOP_NOT_LOGIN, err);
    }
}

export function* fetchUser(token) {
    const { data, err } = yield call(fetchApi, `{
        user {
            id
            username
            email
            profile {
            name
            alias
            sex
            age
            avatar
            studentNumber
            phone
            createTime
            updateTime
            }
        }
    }`, true, token);
    if (data) {
        if (data.data.user)
            yield put({ type: Actions.TOP_LOGIN, user: data.data.user });
        else yield call(defaultError, Actions.TOP_NOT_LOGIN, "没有登录！");
    }
    else yield put({ type: Actions.TOP_MESSAGE, message: err });
}

export function* fetchProblems() {
    const { data, err } = yield call(fetchApi, `{
        problemSets {
            id
            name
            description
            createTime
            problems {
                id
                name
                description
                label
                createTime
            }
        }
    }`);
    if (data) yield put({
        type: Actions.TOP_FETCH_PROBLEMS_SUCCESS,
        problems: data.data.problemSets
    });
    else yield put({ type: Actions.TOP_MESSAGE, message: err });
}
