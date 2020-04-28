/*
 * @Author: Anscor
 * @Date: 2020-04-15 15:46:00
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-28 16:18:33
 * @Description: 用户账户设置
 */
import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Select, InputNumber } from 'antd';

import * as Actions from '../redux/actions'

import './index.css'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14, offset: 1 },
};

const ProfileUI = props => {
    if (!props.user) return "";
    const profile = props.user.profile;
    return (<div className="setting-box">
        <Form
            {...formItemLayout}
            size="large"
            onFinish={props.updateProfile}
            initialValues={{
                name: profile.name,
                email: profile.email,
                age: profile.age,
                alias: profile.alias,
                phone: profile.phone,
                sex: profile.sex
            }}
            className="setting">
            <Form.Item label="用户名">
                <span>{props.user.username}</span>
            </Form.Item>
            <Form.Item name="password" label="密码"
                rules={[{ max: 16, type: "string", message: "最大长度为16位！" }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item name="name" label="姓名">
                <Input />
            </Form.Item>
            <Form.Item label="学工号" help="为0时表示未设置">
                <span>{profile.studentNumber}</span>
            </Form.Item>
            <Form.Item
                name="email"
                rules={[{ type: "email", message: "邮箱格式错误！" }]}
                label="E-Mail">
                <Input />
            </Form.Item>
            <Form.Item name="age" label="年龄"
                rules={[{
                    max: 100, min: 1, type: "integer",
                    message: "只能设置1-100之间的数据"
                }]}>
                <InputNumber />
            </Form.Item>
            <Form.Item name="sex" label="性别">
                <Select>
                    <Select.Option value="男">男</Select.Option>
                    <Select.Option value="女">女</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="alias" label="昵称"
                rules={[{ type: "string", max: 64, message: "超过最大长度！" }]}>
                <Input />
            </Form.Item>
            <Form.Item name="phone" label="电话"
                rules={[{
                    pattern: /^1[3-9]\d{9}$/,
                    message: "电话格式错误！"
                }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item
                wrapperCol={{ span: 12, offset: 7 }}>
                <Button
                    loading={props.loading}
                    htmlType="submit"
                    type="primary">
                    提交
                </Button>
            </Form.Item>
        </Form>
        <div className="setting-avatar"></div>
    </div>);
};

const mapStateToProps = state => ({
    user: state.top.user,
    loading: state.profile.loading
});

const mapDispatchToProps = {
    updateProfile: e => ({ type: Actions.PROFILE_UPDATE, data: e })
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileUI);
