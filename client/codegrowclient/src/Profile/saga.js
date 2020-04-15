/*
 * @Author: Anscor
 * @Date: 2020-04-15 15:51:39
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 22:25:37
 * @Description: 用户账户设置saga
 */
import { take, put, call } from 'redux-saga/effects'

import * as Actions from '../redux/actions'
import { fetchApi, defaultError } from '../Top'
import { message } from 'antd';

function* update(data) {
    const isProfile =
        data.email || data.name || data.age || data.sex || data.alias || data.phone;

    let first = true;
    let email, password, profile;
    if (data.password) password = `, password: "${data.password}"`;
    else password = ``;
    if (data.email)
        email = `, email: "${data.email}"`;
    else email = ``;

    let name, age, sex, alias, phone;
    if (data.name) {
        name = `${first ? `` : `, `}name: "${data.name}"`;
        first = false;
    } else name = ``;
    if (data.age) {
        age = `${first ? `` : `, `}age: ${data.age}`;
        first = false;
    } else age = ``;
    if (data.sex && data.sex !== "未知") {
        sex = `${first ? `` : `, `}sex: "${data.sex}"`;
        first = false;
    } else sex = ``;
    if (data.alias) {
        alias = `${first ? `` : `, `}alias: "${data.alias}"`;
        first = false;
    } else alias = ``;
    if (data.phone) {
        phone = `${first ? `` : `, `}phone: "${data.phone}"`;
        first = false;
    } else phone = ``;

    if (isProfile)
        profile = `, profile: {${name}${age}${sex}${alias}${phone}}`
    else profile = ``;

    const res = yield call(fetchApi, `mutation updateUser {
        updateUser(input: {id: 1${password}${email}${profile}}) {
            user {
                username
                id
                email
                profile {
                    age
                    alias
                    avatar
                    createTime
                    name
                    phone
                    sex
                    studentNumber
                    updateTime
                }
            }
            ok
            errors {
                field
                messages
            }
        }
    }`, true);
    if (res.data) {
        const resData = res.data.data.updateUser;
        if (resData.ok) {
            message.info("更新成功！");
            if (data.password) {
                localStorage.clear();
                window.location.href = "/";
                yield put({ type: Actions.TOP_INIT_ALL });
            } else {
                yield put({ type: Actions.PROFILE_UPDATE_SUCCESS });
                yield put({
                    type: Actions.TOP_USER_PROFILE_UPDATED,
                    user: resData.user
                });
            }
        } else {
            yield resData.errors.forEach(element => {
                put({
                    type: Actions.TOP_MESSAGE,
                    message: element.field + ":" + element.messages[0]
                });
            });
        }
    } else
        yield call(defaultError, Actions.PROFILE_UPDATE_FAILED, res.err);
}

export default function* saga() {
    while (true) {
        const action = yield take(Actions.PROFILE_UPDATE);
        yield call(update, action.data);
    }
}
