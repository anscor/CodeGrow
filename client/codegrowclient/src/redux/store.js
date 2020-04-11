/*
 * @Author: Anscor
 * @Date: 2020-04-09 19:54:48
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 13:58:14
 * @Description: Redux Store
 */
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga'

import reducer, { initialState } from './reducer'
import saga from './saga'

const sagaMiddleware = createSagaMiddleware()

export default createStore(reducer, initialState, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);