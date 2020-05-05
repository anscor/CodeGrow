/*
 * @Author: Anscor
 * @Date: 2020-04-10 16:46:56
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-04 10:33:57
 * @Description: Home
 */
import React from 'react'
import { Table, Modal, Button } from 'antd';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';

import * as Actions from '../redux/actions'
import { toLocalDate } from '../Top'

const setColumns = [
    { title: "题目集ID", dataIndex: "id", key: "id" },
    { title: "题目集名称", dataIndex: "name", key: "name" },
    { title: "题目集描述", dataIndex: "description", key: "description" },
    { title: "创建时间", dataIndex: "create_time", key: "create_time" },
];

const MarkdownRender = props => {
    const newProps = {
        ...props,
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: {
            ...props.renderers,
            math: (props) =>
                <MathJax.Node formula={props.value} />,
            inlineMath: (props) =>
                <MathJax.Node inline formula={props.value} />
        }
    };
    return (
        <MathJax.Provider input="tex">
            <ReactMarkdown {...newProps} />
        </MathJax.Provider>
    );
};

const HomeUI = props => {
    const data = props.problems ? props.problems.map(problemSet => ({
        key: problemSet.id,
        id: problemSet.id,
        name: problemSet.name,
        description: problemSet.description,
        create_time: toLocalDate(problemSet.createTime)
    })) : [];
    const problemRender = record => {
        const problemColumns = [
            { title: "题目ID", dataIndex: "id", key: "id" },
            { title: "题目标签", dataIndex: "label", key: "label" },
            {
                title: "题目名称",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (<Button
                    onClick={() => props.descClick(record.description)}
                    type="link">
                    {text}
                </Button>)
            },
            { title: "创建时间", dataIndex: "create_time", key: "create_time" },
            {
                title: "提交统计",
                dataIndex: "submission_statistics",
                key: "submission_statistics",
                render: (_, record) => (<Link to={{
                    pathname: "/statistics/",
                    state: {
                        id: record.id
                    }
                }}>
                    提交统计
                </Link>)
            },
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
        return (<Table
            columns={problemColumns}
            pagination={false}
            style={{ marginBottom: "30px" }}
            dataSource={props.problems.find(problem =>
                problem.id === record.id).problems.map(problem => ({
                    key: problem.id,
                    id: problem.id,
                    name: problem.name,
                    label: problem.label,
                    description: problem.description,
                    create_time: toLocalDate(problem.createTime)
                }))} />);
    }
    return (
        <div>
            <Table
                columns={setColumns}
                pagination={false}
                dataSource={data}
                loading={!props.problems}
                expandable={{
                    expandedRowRender: problemRender
                }} />
            <Modal
                maskClosable={true}
                footer={false}
                centered
                width={800}
                title="题目描述"
                visible={props.visible}
                onCancel={props.descClose}>
                <MarkdownRender source={JSON.parse(`{"t": "${props.desc}"}`).t} />
            </Modal>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        problems: state.top.problems,
        disabled: state.home.disabled,
        visible: state.home.visible,
        desc: state.home.desc,
        user: state.top.user
    }
}

const mapDispatchToProps = {
    onClick: () => ({ type: Actions.HOME_MY_SUBMISSIONS_CLICK }),
    descClose: () => ({ type: Actions.HOME_DESC_CLOSE }),
    descClick: desc => ({ type: Actions.HOME_DESC_CLICK, desc: desc })
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeUI);
