/*
 * @Author: Anscor
 * @Date: 2020-04-11 13:50:00
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 17:42:15
 * @Description: 总Saga
 */
import { all } from 'redux-saga/effects'

import { default as TopSaga } from '../Top/saga'

export default function* saga() {
    yield all([
        TopSaga()
    ]);
} 
