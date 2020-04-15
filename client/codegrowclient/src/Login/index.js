/*
 * @Author: Anscor
 * @Date: 2020-04-02 21:01:41
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 11:56:19
 * @Description: 登录、注册相关页面
 */
import React from 'react';
import { Button, Input, Form, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from 'react-redux';

import * as Actions from '../redux/actions'
import './index.css'

const LoginUI = props => {
    return (
        <Form
            name="normal_login"
            onFinish={props.login}
            className="login-form"
            initialValues={{ remember: true }}>
            <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入用户名/邮箱/电话/学工号！" }]}>
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="用户名/邮箱/电话/学工号" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "请输入密码！" }]}>
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码" />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox checked>记住我</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="javascript;">忘记密码？</a>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit"
                    className="login-form-button"
                    loading={props.loading}>
                    登录
                    </Button>
            </Form.Item>
        </Form>
    );
};

const mapStateToProps = state => {
    return {
        loading: state.login.loading
    };
}

const mapDispatchToProps = {
    login: e => ({ type: Actions.LOGIN_LOGIN, data: e })
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginUI);