/*
 * @Author: Anscor
 * @Date: 2020-04-11 13:50:00
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-04 10:50:48
 * @Description: 总Saga
 */
import { all } from 'redux-saga/effects'

import { default as TopSaga } from '../Top/saga'
import { default as LoginSaga } from '../Login/saga'
import { default as AppSaga } from '../App/saga'
import { default as SubmissionSaga } from '../Submission/saga'
import { default as ProfileSaga } from '../Profile/saga'
import { default as StatisticsSaga } from '../Statistics/saga'

export default function* saga() {
    yield all([
        TopSaga(),
        LoginSaga(),
        AppSaga(),
        SubmissionSaga(),
        ProfileSaga(),
        StatisticsSaga()
    ]);
} 
