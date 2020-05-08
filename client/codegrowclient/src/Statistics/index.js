/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:35:15
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-08 10:38:36
 * @Description: 提交统计界面
 */

import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { PieChart, GroupedColumnLineChart } from '@opd/g2plot-react'
import { Table, Empty, Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';
import { GroupedColumnLine } from '@antv/g2plot'

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
    label: {
        type: "spider"
    },
    forceFit: true,
    radius: 1,
    angleField: "count",
    colorField: "result"
};

const genGroupData = days => {
    const total = days.map(day => ({
        day: day.day,
        count: day.total,
        type: "提交总数"
    }));
    const accept = days.map(day => ({
        day: day.day,
        count: day.accept,
        type: "正确数"
    }));
    return total.concat(accept);
};

const genLineData = days => {
    return days.map(day => ({
        day: day.day,
        "正确率": Number((day.accept / day.total * 100).toFixed(2))
    }));
};

const genConfig = days => ({
    xAxis: {
        visible: true,
        title: {
            visible: true,
            text: "日期"
        },
        tickCount: 5
    },
    forceFit: true,
    lineConfig: {
        label: {
            visible: true,
            type: "point"
        }
    },
    columnConfig: {
        label: {
            visible: true,
            position: "top"
        }
    },
    data: [genGroupData(days), genLineData(days)],
    groupField: "type",
    xField: "day",
    yField: ["count", "正确率"]
});

const Pie = props => {
    let item = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    if (props.total && props.total.length !== 0)
        item = <PieChart {...pieConfig} data={
            props.total.map(result => ({
                result: result.result,
                count: result.count
            }))} />;
    return (<Skeleton loading={props.loading} active>
        {item}
    </Skeleton>);
};

const Days = props => {
    let item = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    if (props.days && props.days.length !== 0)
        item = <GroupedColumnLineChart {...genConfig(props.days)} />;
    return (<Skeleton loading={props.loading} active>
        {item}
    </Skeleton>);
};

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
                    onChange: selectedUsers => {
                        props.onSelectedUsersChange(
                            selectedUsers,
                            location.state.id
                        )
                    },
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
                <Pie total={props.statistics.total} loading={props.picLoading} />
            </div>
            <div className="statistics-day">
                <Days days={props.statistics.days} loading={props.picLoading} />
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
    statistics: state.statistics.statistics,
    picLoading: state.statistics.picLoading
});

const mapDispathcToProps = (dispatch) => ({
    fetchUsers: (user, id) => {
        dispatch({
            type: Actions.STATISTICS_FETCH_USERS,
            user: user,
            id: id
        });
    },
    onSelectedUsersChange: (selectedUsers, id) => {
        dispatch({
            type: Actions.STATISTICS_SELECTED_USERS_CHANGED,
            selectedUsers: selectedUsers,
            id: id
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
