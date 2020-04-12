/*
 * @Author: Anscor
 * @Date: 2020-04-10 16:46:56
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 22:00:03
 * @Description: Home
 */
import React from 'react'
import { Skeleton, Table, Button } from 'antd';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import * as Actions from '../redux/actions'

const setColumns = [
    { title: "题目集ID", dataIndex: "id", key: "id" },
    { title: "题目集名称", dataIndex: "name", key: "name" },
    { title: "题目集描述", dataIndex: "description", key: "description" },
    { title: "创建时间", dataIndex: "create_time", key: "create_time" },
]

const toLocalDate = date => {
    date = new Date(date);
    return date.toLocaleString('zh', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

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
            render: () => (<Button
                type="link"
                disabled={props.disabled}
                onClick={props.onClick}>
                <Link to="/submissions">
                    我的提交
            </Link>
            </Button>)
        },
    ]
    return (
        <Skeleton active loading={props.problems === undefined} >
            <Table
                columns={setColumns}
                pagination={false}
                dataSource={props.problems.map(problemSet => ({
                    key: problemSet.id,
                    id: problemSet.id,
                    name: problemSet.name,
                    description: problemSet.description,
                    create_time: toLocalDate(problemSet.createTime)
                }))}
                expandable={{
                    expandedRowRender: record => {
                        return (
                            <Table
                                columns={problemColumns}
                                pagination={false}
                                style={{ marginBottom: "30px" }}
                                dataSource={props.problems.find(problem => problem.id == record.id).problems.map(problem => ({
                                    key: problem.id,
                                    id: problem.id,
                                    name: problem.name,
                                    label: problem.label,
                                    description: problem.description,
                                    create_time: toLocalDate(problem.createTime)
                                }))} />
                        )
                    }
                }} />
        </Skeleton>
    );
};

const mapStateToProps = state => {
    return {
        problems: state.top.problems,
        disabled: state.home.disabled
    }
}

const mapDispatchToProps = {
    onClick: e => ({ type: Actions.HOME_MY_SUBMISSIONS_CLICK })
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeUI);

// export default props => (
//     <p style={{ height: "100vh" }}></p>
// );
