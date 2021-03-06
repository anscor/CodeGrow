/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:42:36
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-08 16:24:08
 * @Description: file content
 */

import * as Actions from '../redux/actions'

export const initialState = {
    user: undefined,
    users: [],
    selectedUsers: [],
    tableLoading: true,
    tableScrollY: 0,
    statistics: {
        "total": [],
        "days": []
    },
    picLoading: true
};

export default (state = {}, action) => {
    switch (action.type) {
        case Actions.TOP_INIT_ALL:
            return initialState;
        case Actions.STATISTICS_FETCH_USERS:
            return Object.assign({}, state, {
                picLoading: true,
                users: [],
                tableLoading: true,
                selectedUsers: []
            });
        case Actions.STATISTICS_SET_USERS:
            return Object.assign({}, state, {
                users: action.users,
                tableLoading: action.users.length === 0
            });
        case Actions.STATISTICS_SELECTED_USERS_CHANGED:
            return Object.assign({}, state, {
                selectedUsers: action.selectedUsers,
                picLoading: true
            });
        case Actions.STATISTICS_SET_TABLE_SCROLL_Y:
            return Object.assign({}, state, {
                tableScrollY: action.y
            });
        case Actions.STATISTICS_SET_STATISTICS:
            return Object.assign({}, state, {
                statistics: action.statistics,
                picLoading: false
            });
        default:
            return state;
    }
};
