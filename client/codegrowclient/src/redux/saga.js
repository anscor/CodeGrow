/*
 * @Author: Anscor
 * @Date: 2020-04-11 13:50:00
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 16:32:49
 * @Description: 总Saga
 */
import { all } from 'redux-saga/effects'

import { default as TopSaga } from '../Top/saga'
import { default as LoginSaga } from '../Login/saga'

export default function* saga() {
    yield all([
        TopSaga(),
        LoginSaga()
    ]);
} 
