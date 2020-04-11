/*
 * @Author: Anscor
 * @Date: 2020-04-02 21:01:41
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-11 14:06:20
 * @Description: 登录、注册相关页面
 */
import React, { Component } from 'react';
import { Button, Input, Form, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { URL } from '../App'

import './index.css'

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    login = e => {
        this.setState({ loading: true });
        fetch(URL + "auth/token/obtain/", {
            method: "POST",
            body: JSON.stringify(e),
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200) {
                this.setState({ loading: false });
                throw new Error("登录失败！");
            }
            return res.json();
        }).then(data => {
            // 设置获取到的Token
            localStorage.setItem('access', data['access']);
            localStorage.setItem('refresh', data['refresh']);
            message.success("登录成功！");
            // 跳转到主页
            this.props.history.push({
                pathname: "/main/",
                state: {
                    isLogin: true
                }
            });
        }).catch((err) => {
            // 其他错误
            message.error(err.toString());
            this.setState({ loading: false });
            console.log(err);
        })
    }

    loginClick = () => {
        this.setState({ loading: true });
    }

    render() {
        return (
            <Form
                name="normal_login"
                onFinish={this.login}
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
                        loading={this.state.loading}
                        onClick={this.loginClick}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}


function refreshToken(handleCheck) {
    /**
     * @description: 刷新Token
     * @param {type} 
     * @return: 
     */
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
        handleCheck(false, "没有登录！");
        return;
    }

    fetch(URL + "auth/token/refresh/", {
        method: "POST",
        body: JSON.stringify({
            refresh: refresh
        }),
        headers: {
            "content-type": "application/json"
        }
    }).then(res => {
        if (res.status === 400) throw new Error("请求参数错误！");
        if (res.status >= 500) throw new Error("服务器错误！");
        // 刷新失败
        if (res.status !== 200) throw new Error("身份验证已过期，请重新登录！");
        return res.json();
    }).then(data => {
        // 成功刷新Token
        localStorage.setItem('access', data['access']);
        handleCheck(true);
    }).catch(err => {
        // 其他错误
        message.error(err.message);
        handleCheck(false, err.message);
        console.log(err);
    });
}

export function checkToken(handleCheck) {
    /**
     * @description: 检查Token合法性，如果不合法尝试刷新Token
     * @param {type} 
     * @return: 
     */
    const access = localStorage.getItem('access');

    if (!access) {
        handleCheck(false, "没有登录！");
        return;
    };

    fetch(URL + "auth/token/verify/", {
        method: "POST",
        body: JSON.stringify({
            token: access
        }),
        headers: {
            "content-type": "application/json"
        }
    }).then(res => {
        if (res.status === 400) throw new Error("请求参数错误！");
        if (res.status >= 500) throw new Error("服务器错误！");
        // Token不合法时尝试刷新
        if (res.status !== 200) {
            refreshToken(handleCheck);
            return;
        }
        // 此Token合法
        handleCheck(true);
    }).catch(err => {
        // 其他错误
        message.error(err.message);
        handleCheck(false, err.message);
        console.log(err);
    });
}
