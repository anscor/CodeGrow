/*
 * @Author: Anscor
 * @Date: 2020-04-13 17:56:45
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-14 18:41:50
 * @Description: 提交界面
 */
import React, { useEffect } from "react"
import { connect } from 'react-redux'

import * as Actions from '../redux/actions'
import { Table, Button, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { toLocalDate } from "../Top";
import CodeDetail from "./CodeDetail";

import './index.css'

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
        render: (text, record) => (<Button
            type="link"
            onClick={() => {
                props.detailClick(props.submissions.find(submission =>
                    submission.id === record.id));
            }}>
            代码详情
        </Button>)
    },
    {
        title: "",
        dataIndex: "pre",
        key: "pre",
        render: () => (<Button
            type="link">
            与上一版本对比
        </Button>)
    }
];

const SubmissionUI = props => {
    const location = useLocation();
    useEffect(() => {
        props.initialRequest(location.state.id);
    }, [location]);
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
        </div>
    );
}

const mapStateToProps = state => ({
    submissions: state.submission.submissions,
    detailVisible: state.submission.detailVisible,
    submission: state.submission.submission
});

const mapDispatchToProps = dispatch => ({
    initialRequest: id => {
        dispatch({
            type: Actions.SUBMISSION_FETCH_SUBMISSIONS,
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
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmissionUI);
