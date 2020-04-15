/*
 * @Author: Anscor
 * @Date: 2020-04-13 17:07:52
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 12:21:45
 * @Description: App saga
 */
import { put, call, take, all } from 'redux-saga/effects'

import * as Actions from '../redux/actions'

const doUserMenuClick = key => {
    switch (key) {
        case "logout":
            localStorage.clear();
            window.location.href = "/";
            put({ type: Actions.TOP_INIT_ALL });
            break;
        case "setting":
            break;
        default:
            break;
    }
};

const doMainMenuClick = key => {
    console.log(key);
    switch (key) {
        case "home":
            break;
        case "about":
            break;
        default:
            break;
    }
};

function* userMenu() {
    while (true) {
        const action = yield take(Actions.APP_USER_MENU_CLICK);
        yield call(doUserMenuClick, action.key);
    }
}

function* mainMenu() {
    while (true) {
        const action = yield take(Actions.APP_MAIN_MENU_CLICK);
        yield call(doMainMenuClick, action.key);
    }
}

export default function* saga() {
    yield all([
        userMenu(),
        mainMenu()
    ])
}
