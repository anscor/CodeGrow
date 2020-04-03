import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import 'antd/dist/antd.css'
import './index.css'

import { Button } from 'antd'

import App from './App';
import Login from './Login/Login'

localStorage.setItem('access', '')
localStorage.setItem('refresh', '')

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: this.props.isLogin ? true : false
        }
    }

    buttonClick = e => {
        // 如果已经登录，则跳转到主页
        if (this.state.isLogin) this.props.history.push("/main/");
        // 否则弹出登录窗口
    }

    render() {
        return (
            <div className="bg" style={{ backgroundImage: "url(" + process.env.PUBLIC_URL + "/bg.jpg)" }}>
                <div className="logo">
                    <img src={process.env.PUBLIC_URL + "/logo.png"} alt="logo" />
                    <h1>Code Grow</h1>
                </div>
                <div className="jumpButton">
                    <Link to="/main/">
                        <Button type="primary"
                            size="large"
                            ghost={
                                this.state.isLogin ? true : false
                            }
                            onClick={this.buttonClick}>
                            {this.state.isLogin ? "主页 ->>" : "登录"}
                        </Button>
                    </Link>
                </div>
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