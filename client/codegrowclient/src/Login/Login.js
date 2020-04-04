/*
 * @Author: Anscor
 * @Date: 2020-04-02 21:01:41
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-04 21:48:14
 * @Description: 登录、注册相关页面
 */
import React, { Component } from 'react';
import { Button, Input, Form, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { URL } from '../App'

import './Login.css'

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
        }).then(res => res.json()).then(data => {
            localStorage.setItem('access', data['access']);
            localStorage.setItem('refresh', data['refresh']);
            message.success("登录成功！");
            this.props.history.push({
                pathname: "/main/",
                state: {
                    isLogin: true,
                    // history: this.props.history
                }
            })
        }).catch((err) => {
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
                    rules={[{ required: true, message: "请输入用户名！" }]}>
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="用户名" />
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
                    <a className="login-form-forgot" href="#">忘记密码？</a>
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


function refreshToken(refresh) {
    /**
     * @description: 刷新Token
     * @param {type} 
     * @return: 
     */
    refresh = refresh || localStorage.getItem('refresh');
    if (!refresh) return {
        ok: false,
        message: "没有登录！"
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
        if (res.status == 400) return {
            ok: false,
            message: "请求参数错误！"
        };
        if (res.status >= 500) return {
            ok: false,
            message: "服务器错误！"
        };
        // 401表示此refresh不合法
        if (res.status != 200) return {
            ok: false,
            message: "身份验证已过期，请重新登录！"
        };
        res.json();
    }).then(data => {
        // 成功刷新Token
        localStorage.setItem('access', data['access']);
    }).catch(err => {
        // 其他错误
        message.error(err.toString());
        console.log(err);
    });
    return {
        ok: true
    }
}

export function checkToken(access) {
    /**
     * @description: 检查Token合法性，如果不合法尝试刷新Token
     * @param {type} 
     * @return: 
     */
    access = access || localStorage.getItem('access');

    if (!access) return {
        ok: false,
        message: "没有登录！"
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
        if (res.status == 400) return {
            ok: false,
            message: "请求参数错误！"
        };
        if (res.status >= 500) return {
            ok: false,
            message: "服务器错误！"
        };
        // 401表示此refresh不合法
        if (res.status != 200) {
            let { ok, message } = refreshToken();
            // 刷新失败
            if (!ok) return {
                ok: false,
                message: message
            };
            // 刷新成功
            return {
                ok: true
            };
        }
        res.json();
    }).then(data => {
        // 此token合法
        console.log(data)
        return {
            ok: true
        }
    }).catch(err => {
        // 其他错误
        message.error(err.toString());
        console.log(err);
    });
}
