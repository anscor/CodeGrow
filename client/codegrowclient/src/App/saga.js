/*
 * @Author: Anscor
 * @Date: 2020-04-13 17:07:52
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-08 10:40:13
 * @Description: App saga
 */
import { put, call, take, all } from 'redux-saga/effects'

import * as Actions from '../redux/actions'

const doUserMenuClick = (key, history) => {
    switch (key) {
        case "logout":
            localStorage.clear();
            window.location.href = "/";
            put({ type: Actions.TOP_INIT_ALL });
            break;
        case "setting":
            history.push("/profile/");
            break;
        default:
            break;
    }
};

const doMainMenuClick = key => {
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
        yield call(doUserMenuClick, action.key, action.history);
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
