import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Button, Modal } from 'antd'

import 'antd/dist/antd.css'
import './index.css'

import App from './App';
import Login from './Login/Login'

(function () {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    if (access === null || refresh === null) {
        localStorage.setItem('access', '')
        localStorage.setItem('refresh', '')
    }
}());

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: localStorage.getItem('access') ? true : false,
            visible: false
        }
    }

    buttonClick = e => {
        // 如果已经登录，则跳转到主页
        if (this.state.isLogin) this.props.history.push("/main/");
        // 否则弹出登录窗口
        this.setState({ visible: true });
    }

    render() {
        return (
            <div className="bg" style={{ backgroundImage: "url(" + process.env.PUBLIC_URL + "/bg.jpg)" }}>
                <div className="logo">
                    <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" />
                    <h1>Code Grow</h1>
                </div>
                <div className="jumpButton">
                    <Button type="primary"
                        size="large"
                        ghost={
                            this.state.isLogin ? true : false
                        }
                        onClick={this.buttonClick}>
                        {this.state.isLogin ? "主页 ->>" : "登录"}
                    </Button>
                </div>
                <Modal
                    title="登录"
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                    width="350px"
                    onCancel={e => this.setState({ visible: false })}>
                    <Login history={this.props.history} />
                </Modal>
            </div>
        );
    }
}

ReactDOM.render(
    <Router>
        <Route exact path="/" component={Index} />
        <Route path="/main/" component={App} />
        <Route path="/login/" component={Login} />
    </Router>,
    document.getElementById('root')
);