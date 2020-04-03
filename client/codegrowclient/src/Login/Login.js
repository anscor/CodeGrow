/*
 * @Author: Anscor
 * @Date: 2020-04-02 21:01:41
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-03 09:37:56
 * @Description: 登录、注册相关页面
 */
import React, { Component } from 'react';
import { Button, Input } from 'antd';
import { URL } from '../App'

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }

    usernameChange = e => {
        this.setState({ username: e.target.value });
    }

    passwordChange = e => {
        this.setState({ password: e.target.value });
    }

    login = () => {
        fetch(URL + "auth/token/obtain/", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            localStorage.setItem('access', data['access']);
            localStorage.setItem('refresh', data['refresh']);
            // TODO: 跳转
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        return (
            <div>
                <Input placeholder="用户名" allowClear onChange={this.usernameChange} />
                <Input.Password placeholder="密码" allowClear onChange={this.passwordChange} />
                <Button type="primary" onClick={this.login}>登录</Button>
            </div>
        )
    }
}

