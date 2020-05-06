/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:35:15
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-06 22:13:30
 * @Description: 提交统计界面
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { PieChart, OverlappedComboChart } from '@opd/g2plot-react'
import { Table, Empty } from 'antd';
import { useLocation } from 'react-router-dom';

import * as Actions from '../redux/actions'
import './index.css'

const columns = [
    {
        title: "学号",
        dataIndex: "student_number",
        key: "student_number",
        sorter: (a, b) => a.student_number - b.student_number,
    },
    {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name === b.name) return 0;
            else return 1;
        }
    },
    {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name === b.name) return 0;
            else return 1;
        }
    },
];

const pieConfig = {
    // title: {
    //     visible: true,
    //     text: "提交统计"
    // },
    // description: {
    //     visible: true,
    //     text: "对提交的结果进行统计"
    // },
    label: {
        type: "spider"
    },
    tooltip: {
        visible: false
    },
    forceFit: true,
    radius: 1,
    angleField: "count",
    colorField: "result"
};

const genOverStackData = statistics => {
    return [];
};
// [
//     {
//         type: "提交总数",
//         count: 40,
//         day: "10"
//     },
//     {
//         type: "提交总数",
//         count: 8,
//         day: "11"
//     },
//     {
//         type: "提交总数",
//         count: 17,
//         day: "12"
//     },
//     {
//         type: "提交总数",
//         count: 35,
//         day: "13"
//     },
//     {
//         type: "正确",
//         count: 10,
//         day: "10"
//     },

//     {
//         type: "正确",
//         count: 5,
//         day: "11"
//     },
//     {
//         type: "正确",
//         count: 12,
//         day: "12"
//     },
//     {
//         type: "正确",
//         count: 20,
//         day: "13"
//     }
// ];

// const genOverLineData = [
//     {
//         acc_ratio: 0.25,
//         day: "10"
//     },
//     {
//         acc_ratio: 0.625,
//         day: "11"
//     },
//     {
//         acc_ratio: 0.7,
//         day: "12"
//     },
//     {
//         acc_ratio: 0.57,
//         day: "13"
//     },
// ];

const genOverLineData = statistics => {
    return [];
};

const genOverConfig = statistics => ({
    title: {
        visible: true,
        text: "每日提交"
    },
    xAxis: {
        visible: true,
        title: {
            visible: true,
            text: "日期"
        }
    },
    yAxis: {
        visible: false
    },
    tooltip: {
        visible: false
    },
    layers: [
        {
            type: "groupedColumn",
            name: "提交数与正确数",
            xField: "day",
            yField: "count",
            groupField: "type",
            data: genOverStackData(statistics),
            tooltip: {
                visible: false
            },
            label: {
                visible: true
            },
        },
        {
            type: "line",
            name: "正确率",
            xField: "day",
            yField: "acc_ratio",
            data: genOverLineData(statistics),
            color: "#f8ca45",
            tooltip: {
                visible: false
            },
            label: {
                visible: true
            },
        }
    ]
});

const StatisticsUI = props => {
    const location = useLocation();
    useEffect(() => {
        const box = document.getElementsByClassName("statistics-box")[0];
        const header = document.getElementsByTagName("header")[0];
        const footer = document.getElementsByTagName("footer")[0];
        box.style.height = (document.documentElement.offsetHeight -
            header.offsetHeight - footer.offsetHeight - 64) + "px";
    }, []);
    useEffect(() => {
        props.fetchUsers(props.user, location.state.id);
    }, [props.user, location]);
    useEffect(() => {
        const box = document.getElementsByClassName("statistics-box")[0];
        const th = document.getElementsByClassName("ant-table-header")[0];
        if (!box || !th) return;
        props.setTableScrollY(box.offsetHeight - th.offsetHeight - 5);
    }, [props.tableLoading]);

    return (<div className="statistics-box">
        <div className="user-select">
            <Table
                rowSelection={{
                    hideDefaultSelections: true,
                    selectedRowKeys: props.selectedUsers,
                    onChange: props.onSelectedUsersChange,
                    getCheckboxProps: () => ({
                        disabled: props.users.length <= 1
                    })
                }}
                dataSource={props.users.map(user => ({
                    key: user.profile.studentNumber,
                    student_number: user.profile.studentNumber,
                    name: user.profile.name,
                    email: user.profile.email
                }))}
                columns={columns}
                pagination={false}
                scroll={{ scrollToFirstRowOnChange: true, y: props.tableScrollY }}
                loading={props.tableLoading} />
        </div>
        <div className="statistics">
            <div style={{ height: "5%" }}><h1>提交统计</h1></div>
            <div className="statistics-pic">
                {
                    props.statistics.total.length === 0 ? <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        <PieChart {...pieConfig} data={
                            props.statistics.total.map(result => ({
                                result: result.result,
                                count: result.count
                            }))} />
                }
            </div>
            <div className="statistics-day">
                {
                    props.statistics.days.length === 0 ? <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        <OverlappedComboChart {...genOverConfig(props.statistics)} />
                }
            </div>
        </div>
    </div>);
};

const mapStateToProps = state => ({
    user: state.top.user,
    users: state.statistics.users,
    selectedUsers: state.statistics.selectedUsers,
    tableLoading: state.statistics.tableLoading,
    tableScrollY: state.statistics.tableScrollY,
    statistics: state.statistics.statistics
});

const mapDispathcToProps = (dispatch) => ({
    fetchUsers: (user, id) => {
        dispatch({
            type: Actions.STATISTICS_FETCH_USERS,
            user: user,
            id: id
        });
    },
    onSelectedUsersChange: selectedUsers => {
        dispatch({
            type: Actions.STATISTICS_SELECTED_USERS_CHANGED,
            selectedUsers: selectedUsers
        });
    },
    setTableScrollY: y => {
        dispatch({
            type: Actions.STATISTICS_SET_TABLE_SCROLL_Y,
            y: y
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispathcToProps
)(StatisticsUI);
