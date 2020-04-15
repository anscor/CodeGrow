/*
 * @Author: Anscor
 * @Date: 2020-04-11 13:50:00
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 15:52:59
 * @Description: 总Saga
 */
import { all } from 'redux-saga/effects'

import { default as TopSaga } from '../Top/saga'
import { default as LoginSaga } from '../Login/saga'
import { default as AppSaga } from '../App/saga'
import { default as SubmissionSaga } from '../Submission/saga'
import { default as ProfileSaga } from '../Profile/saga'

export default function* saga() {
    yield all([
        TopSaga(),
        LoginSaga(),
        AppSaga(),
        SubmissionSaga(),
        ProfileSaga()
    ]);
} 
