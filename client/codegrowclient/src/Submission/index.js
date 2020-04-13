/*
 * @Author: Anscor
 * @Date: 2020-04-13 17:56:45
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-13 21:52:16
 * @Description: 提交界面
 */
import React, { useEffect } from "react"
import { connect } from 'react-redux'

import * as Actions from '../redux/actions'
import { Table, Button, Modal } from "antd";
import { useLocation } from "react-router-dom";
import { toLocalDate } from "../Top";

const columns = [
    { title: "提交ID", dataIndex: "id", key: "id" },
    { title: "提交时间", dataIndex: "submit_time", key: "submit_time" },
    { title: "语言", dataIndex: "language", key: "language" },
    { title: "用时", dataIndex: "time", key: "time" },
    { title: "使用内存", dataIndex: "memory", key: "memory" },
    { title: "运行结果", dataIndex: "result", key: "result" },
    {
        title: "代码详情",
        dataIndex: "code",
        key: "code",
        render: () => (
            <Button type="link">
                代码详情
                <Modal>

                </Modal>
            </Button>
        )
    },
    {
        title: "",
        dataIndex: "pre",
        key: "pre",
        render: () => (
            <Button type="link">
                与上一版本对比
            </Button>
        )
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
        result: submission.result
    })) : [];
    return (
        <Table
            columns={columns}
            pagination={10}
            loading={!props.submissions}
            dataSource={data} />
    );
}

const mapStateToProps = state => ({
    submissions: state.submission.submissions
});

const mapDispatchToProps = dispatch => ({
    initialRequest: id => {
        dispatch({
            type: Actions.SUBMISSION_FETCH_SUBMISSIONS,
            id: id
        });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmissionUI);
