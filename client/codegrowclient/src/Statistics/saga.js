/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:42:40
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-06 21:25:57
 * @Description: file content
 */

import { take, call, all, put } from 'redux-saga/effects'

import * as Actions from '../redux/actions'
import { fetchApi } from '../Top'

function* fetchUsers(user, id) {
    if (!user) yield put({
        type: Actions.STATISTICS_SET_USERS,
        users: []
    });
    else if (!user.isTeacher && !user.isAdmin) yield put({
        type: Actions.STATISTICS_SET_USERS,
        users: [user]
    });
    else {
        const { data, err } = yield call(fetchApi, `{
            allUser(problemId: ${id}) {
                id
                username
                email
                isTeacher
                isAdmin
                profile {
                    createTime
                    updateTime
                    name
                    alias
                    avatar
                    phone
                    sex
                    studentNumber
                    age
                }
            }
        }`, true);
        if (data) yield put({
            type: Actions.STATISTICS_SET_USERS,
            users: data.data.allUser
        });
        else {
            yield put({ type: Actions.STATISTICS_SET_USERS, users: [user] });
            yield put({ type: Actions.TOP_MESSAGE, message: err });
        }
    }
}

function* fetchStatistics(selectedUsers) {

}

function* fetchUsersSaga() {
    while (true) {
        const action = yield take(Actions.STATISTICS_FETCH_USERS);
        yield call(fetchUsers, action.user, action.id);
    }
}

function* fetchStatisticsSaga() {
    while (true) {
        const action = yield take(Actions.STATISTICS_SELECTED_USERS_CHANGED);
        yield call(fetchUsers, action.selectedUsers);
    }
}

export default function* saga() {
    yield all([
        fetchUsersSaga(),
        fetchStatisticsSaga()
    ]);
}
