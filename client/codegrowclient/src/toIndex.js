/*
 * @Author: Anscor
 * @Date: 2020-04-04 18:56:14
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-05 09:59:47
 * @Description: 跳转到Index界面进行登录
 */

import React, { Component } from 'react'
import { Result, Button } from 'antd'

export default class ToIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            waitTime: 5
        }
    }

    componentDidMount() {
        // 设置跳转计时器
        this.timer = setInterval(() => {
            this.setState({ waitTime: this.state.waitTime - 1 });
        }, 1000);

        // 计时器归零时跳转
        setTimeout(() => {
            clearInterval(this.timer);
            window.location.href = "/";
        }, this.state.waitTime * 1000);
    }

    // 立即跳转
    buttonClick = () => {
        clearInterval(this.timer);
        window.location.href = "/";
    }

    render() {
        const message = (this.props.message || "请先登录") + "，";
        return (<Result
            title={message + this.state.waitTime + "秒后跳转..."}
            extra={
                <Button type="primary" onClick={this.buttonClick}>
                    立即跳转
                </Button>
            }
        />);
    }
}

