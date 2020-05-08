/*
 * @Author: Anscor
 * @Date: 2020-04-13 17:56:45
 * @LastEditors: Anscor
 * @LastEditTime: 2020-05-08 17:01:56
 * @Description: 提交界面
 */
import React, { useEffect } from "react"
import { connect } from 'react-redux'

import * as Actions from '../redux/actions'
import { Table, Button, Modal, Select, Skeleton, Space } from "antd";
import { useLocation } from "react-router-dom";
import { toLocalDate } from "../Top";
import CodeDetail from "./CodeDetail";

import './index.css'
import CodeTextCmp from "./CodeTextCmp";
import CodeSyntaxCmp from './CodeSyntaxCmp'

const tableColumns = props => [
    { title: "提交ID", dataIndex: "id", key: "id" },
    { title: "提交时间", dataIndex: "submit_time", key: "submit_time" },
    { title: "语言", dataIndex: "language", key: "language" },
    { title: "用时", dataIndex: "time", key: "time" },
    { title: "使用内存", dataIndex: "memory", key: "memory" },
    {
        title: "运行结果",
        dataIndex: "result",
        key: "result",
        render: text => {
            if (text === "Compile Error")
                return <p style={{ color: "green" }}>{text}</p>;
            else if (text === "Accepted")
                return <p style={{ color: "blue" }}>{text}</p>;
            else return <p style={{ color: "red" }}>{text}</p>;
        }
    },
    {
        title: "代码详情",
        dataIndex: "code",
        key: "code",
        render: (_, record) => (<Button
            type="link"
            onClick={() => {
                props.detailClick(props.submissions.find(submission =>
                    submission.id === record.id));
            }}>
            代码详情
        </Button>)
    },
    {
        title: "与上一版本对比",
        dataIndex: "pre",
        key: "pre",
        render: (_, record) => {
            if (record.id ===
                props.submissions[props.submissions.length - 1].id) return "";
            else return (<div style={{ display: "inline-block" }}>
                <Button
                    onClick={() => {
                        props.textCmpClick(record.id);
                    }}
                    type="link">
                    纯文本
                </Button>
                <Button
                    onClick={() => {
                        props.syntaxCmpClick(record.id)
                    }}
                    disabled={
                        props.submissions.find(
                            submission => submission.id === record.id
                        ).result === "Compile Error" ||
                        props.submissions.find(
                            submission => Number(submission.id) < record.id
                        ).result === "Compile Error"
                    }
                    type="link">
                    语法成分
                </Button>
            </div>)
        }
    }
];

const SelectStudent = props => {
    return (<Space style={{ marginBottom: "10px" }}>
        <h1>选择学生：</h1>
        <Skeleton loading={props.users.length === 0} active>
            <Select
                onChange={value => props.onUserChange(value, props.problemId)}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                defaultValue={props.users.length === 0 ? [] : props.users[0].id}
                style={{ width: 200 }}
                optionFilterProp="children"
                showSearch>
                {
                    props.users.map(user => (<Select.Option
                        value={user.id}
                        key={user.id}>
                        {user.profile.studentNumber + "  " + user.profile.name}
                    </Select.Option>))
                }
            </Select>
        </Skeleton>
    </Space>);
};

const SubmissionUI = props => {
    const location = useLocation();
    useEffect(() => {
        props.initialRequest(props.user, location.state.id);
    }, [location, props.user]);
    const data = props.submissions ? props.submissions.map(submission => ({
        key: submission.id,
        id: submission.id,
        submit_time: toLocalDate(submission.submitTime),
        language: submission.language,
        time: submission.time,
        memory: submission.memory,
        result: submission.result,
        code: submission.code
    })) : [];
    return (
        <div>
            <SelectStudent
                users={props.users}
                onUserChange={props.onUserChange}
                problemId={location.state.id} />
            <Table
                columns={tableColumns(props)}
                pagination={10}
                loading={!props.submissions}
                dataSource={data} />
            <Modal
                onCancel={props.detailClose}
                maskClosable={true}
                footer={false}
                centered
                width={800}
                title="代码详情"
                visible={props.detailVisible}>
                <CodeDetail submission={props.submission} />
            </Modal>
            <Modal
                onCancel={props.textCmpClose}
                visible={props.textCmpVisible}
                title="与上一版本对比（纯文本）"
                width={1300}
                centered
                footer={false}
                maskClosable={true}>
                <CodeTextCmp cmps={props.textCmps} />
            </Modal>
            <Modal
                onCancel={props.syntaxCmpClose}
                visible={props.syntaxCmpVisible}
                title="与上一版本对比（语法成分）"
                width={1300}
                centered
                footer={false}
                maskClosable={true}>
                <CodeSyntaxCmp cmps={props.syntaxCmps} />
            </Modal>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.top.user,
    users: state.submission.users,
    submissions: state.submission.submissions,
    detailVisible: state.submission.detailVisible,
    submission: state.submission.submission,
    textCmpVisible: state.submission.textCmpVisible,
    syntaxCmpVisible: state.submission.syntaxCmpVisible,
    textCmps: state.submission.textCmps,
    syntaxCmps: state.submission.syntaxCmps
});

const mapDispatchToProps = dispatch => ({
    initialRequest: (user, id) => {
        dispatch({
            type: Actions.SUBMISSION_FETCH_ALL_USER,
            user: user,
            id: id
        });
    },
    detailClose: () => {
        dispatch({
            type: Actions.SUBMISSION_DETAIL_MODAL_CLOSE
        });
    },
    detailClick: submission => {
        dispatch({
            type: Actions.SUBMISSION_DETAIL_CLICK,
            submission: submission
        });
    },
    textCmpClose: () => {
        dispatch({ type: Actions.SUBMISSION_TEXT_CMP_MODAL_CLOSE });
    },
    textCmpClick: id => {
        dispatch({
            type: Actions.SUBMISSION_TEXT_CMP_CLICK,
            id: id
        });
    },
    syntaxCmpClick: id => {
        dispatch({
            type: Actions.SUBMISSION_SYNTAX_CMP_CLICK,
            id: id
        });
    },
    syntaxCmpClose: () => {
        dispatch({ type: Actions.SUBMISSION_SYNTAX_CMP_MODAL_CLOSE });
    },
    onUserChange: (user, id) => {
        dispatch({
            type: Actions.SUBMISSION_FETCH_SUBMISSIONS,
            user: user,
            id: id
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmissionUI);
