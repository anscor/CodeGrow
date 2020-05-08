/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:42:40
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-08 10:40:35
 * @Description: file content
 */

import { take, call, all, put, fork } from 'redux-saga/effects'

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

function* fetchStatistics(selectedUsers, id) {
    const init_statistics = ({
        "total": [],
        "days": []
    });
    if (!selectedUsers) yield put({
        type: Actions.STATISTICS_SET_STATISTICS,
        statistics: init_statistics
    });

    const { data, err } = yield call(fetchApi, `{
        submissionStatistics(problemId: ${id}, queryUsers: [${selectedUsers}]) {
            total {
                result
                count
            }
            days {
                day
                total
                accept
            }
        }
    }`, true);
    if (data) {
        yield put({
            type: Actions.STATISTICS_SET_STATISTICS,
            statistics: data.data.submissionStatistics
        });
    } else {
        yield put({
            type: Actions.STATISTICS_SET_STATISTICS,
            statistics: init_statistics
        });
        yield put({ type: Actions.TOP_MESSAGE, message: err });
    }
}

function* fetchUsersSaga() {
    while (true) {
        const action = yield take(Actions.STATISTICS_FETCH_USERS);
        yield fork(fetchStatistics, [], action.id);
        yield call(fetchUsers, action.user, action.id);
    }
}

function* fetchStatisticsSaga() {
    while (true) {
        const action = yield take(Actions.STATISTICS_SELECTED_USERS_CHANGED);
        yield call(fetchStatistics, action.selectedUsers, action.id);
    }
}

export default function* saga() {
    yield all([
        fetchUsersSaga(),
        fetchStatisticsSaga()
    ]);
}
