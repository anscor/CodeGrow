/*
 * @Author: Anscor
 * @Date: 2020-04-10 16:46:56
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 11:55:44
 * @Description: Home
 */
import React from 'react'
import { Table } from 'antd';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import * as Actions from '../redux/actions'
import { toLocalDate } from '../Top'

const setColumns = [
    { title: "题目集ID", dataIndex: "id", key: "id" },
    { title: "题目集名称", dataIndex: "name", key: "name" },
    { title: "题目集描述", dataIndex: "description", key: "description" },
    { title: "创建时间", dataIndex: "create_time", key: "create_time" },
]

const HomeUI = props => {
    const problemColumns = [
        { title: "题目ID", dataIndex: "id", key: "id" },
        { title: "题目名称", dataIndex: "name", key: "name" },
        { title: "题目标签", dataIndex: "label", key: "label" },
        { title: "题目描述", dataIndex: "description", key: "description" },
        { title: "创建时间", dataIndex: "create_time", key: "create_time" },
        {
            title: "", dataIndex: "submissions",
            key: "submissions",
            render: (_, record) => {
                return (<Link
                    to={{
                        pathname: "/submission/",
                        state: {
                            id: record.id
                        }
                    }}
                    disabled={props.disabled}>
                    我的提交
            </Link>);
            }
        },
    ];
    const data = props.problems ? props.problems.map(problemSet => ({
        key: problemSet.id,
        id: problemSet.id,
        name: problemSet.name,
        description: problemSet.description,
        create_time: toLocalDate(problemSet.createTime)
    })) : [];
    const problemRender = record => (
        <Table
            columns={problemColumns}
            pagination={false}
            style={{ marginBottom: "30px" }}
            dataSource={props.problems.find(problem =>
                problem.id == record.id).problems.map(problem => ({
                    key: problem.id,
                    id: problem.id,
                    name: problem.name,
                    label: problem.label,
                    description: problem.description,
                    create_time: toLocalDate(problem.createTime)
                }))} />
    );
    return (
        <Table
            columns={setColumns}
            pagination={false}
            dataSource={data}
            loading={!props.problems}
            expandable={{
                expandedRowRender: problemRender
            }} />
    );
};

const mapStateToProps = state => {
    return {
        problems: state.top.problems,
        disabled: state.home.disabled
    }
}

const mapDispatchToProps = {
    onClick: () => ({ type: Actions.HOME_MY_SUBMISSIONS_CLICK })
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeUI);
