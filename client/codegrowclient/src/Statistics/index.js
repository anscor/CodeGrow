/*
 * @Author: Anscor
 * @Date: 2020-05-04 10:35:15
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-04 23:10:37
 * @Description: 提交统计界面
 */

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { PieChart, OverlappedComboChart } from '@opd/g2plot-react'

import './index.css'
import { Table } from 'antd';

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
    title: {
        visible: true,
        text: "提交统计"
    },
    description: {
        visible: true,
        text: "对提交的结果进行统计"
    },
    label: {
        type: "spider"
    },
    forceFit: true,
    radius: 1,
    angleField: "count",
    colorField: "result"
};

const pieData = [
    {
        result: "CE",
        count: 100
    },
    {
        result: "AC",
        count: 10
    },
    {
        result: "RE",
        count: 253
    }
];

const overStackData = [
    {
        type: "提交总数",
        count: 40,
        day: "10"
    },
    {
        type: "提交总数",
        count: 8,
        day: "11"
    },
    {
        type: "提交总数",
        count: 17,
        day: "12"
    },
    {
        type: "提交总数",
        count: 35,
        day: "13"
    },
    {
        type: "正确",
        count: 10,
        day: "10"
    },

    {
        type: "正确",
        count: 5,
        day: "11"
    },
    {
        type: "正确",
        count: 12,
        day: "12"
    },
    {
        type: "正确",
        count: 20,
        day: "13"
    }
];

const overLineData = [
    {
        acc_ratio: 0.25,
        day: "10"
    },
    {
        acc_ratio: 0.625,
        day: "11"
    },
    {
        acc_ratio: 0.7,
        day: "12"
    },
    {
        acc_ratio: 0.57,
        day: "13"
    },
];

const overConfig = {
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
        visible: false,
    },
    layers: [
        {
            type: "groupedColumn",
            name: "每日提交数与正确数",
            xField: "day",
            yField: "count",
            groupField: "type",
            data: overStackData,
            label: {
                visible: true
            },
        },
        {
            type: "line",
            name: "每日正确率",
            xField: "day",
            yField: "acc_ratio",
            data: overLineData,
            color: "#f8ca45",
            label: {
                visible: true
            },
        }
    ]
};

const StatisticsUI = props => {
    useEffect(() => {
        const box = document.getElementsByClassName("statistics-box")[0];
        const header = document.getElementsByTagName("header")[0];
        const footer = document.getElementsByTagName("footer")[0];
        box.style.height = (document.documentElement.offsetHeight -
            header.offsetHeight - footer.offsetHeight - 64) + "px";
    }, []);
    return (<div className="statistics-box">
        <div className="user-select">
            <Table columns={columns} />
        </div>
        <div className="statistics">
            <div className="statistics-pic">
                <PieChart {...pieConfig} data={pieData} />
            </div>
            <div className="statistics-day">
                <OverlappedComboChart {...overConfig} />
            </div>
        </div>
    </div>);
};

const mapStateToProps = state => ({
    user: state.top.user,
});

const mapDispathcToProps = () => ({

});

export default connect(
    mapStateToProps,
    mapDispathcToProps
)(StatisticsUI);
