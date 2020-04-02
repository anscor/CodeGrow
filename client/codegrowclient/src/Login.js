/*
 * @Author: Anscor
 * @Date: 2020-04-02 21:01:41
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-02 21:51:12
 * @Description: file content
 */
import React, { Component } from 'react';
import { Button, Input } from 'antd';

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
        fetch("http://127.0.0.1:8000/auth/token/obtain/", {
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
                <Input placeholder="username" allowClear onChange={this.usernameChange} />
                <Input.Password placeholder="password" allowClear onChange={this.passwordChange} />
                <Button type="primary" onClick={this.login}>登录</Button>
            </div>
        )
    }
}

