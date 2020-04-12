/*
 * @Author: Anscor
 * @Date: 2020-04-02 21:01:41
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-12 17:31:35
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

// export default class Login extends Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             loading: false
//         }
//     }

//     login = e => {
//         this.setState({ loading: true });
//         fetch(URL + "auth/token/obtain/", {
//             method: "POST",
//             body: JSON.stringify(e),
//             headers: {
//                 'content-type': 'application/json'
//             }
//         }).then(res => {
//             if (res.status !== 200) {
//                 this.setState({ loading: false });
//                 throw new Error("登录失败！");
//             }
//             return res.json();
//         }).then(data => {
//             // 设置获取到的Token
//             localStorage.setItem('access', data['access']);
//             localStorage.setItem('refresh', data['refresh']);
//             message.success("登录成功！");
//             // 跳转到主页
//             this.props.history.push({
//                 pathname: "/main/",
//                 state: {
//                     isLogin: true
//                 }
//             });
//         }).catch((err) => {
//             // 其他错误
//             message.error(err.toString());
//             this.setState({ loading: false });
//             console.log(err);
//         })
//     }

//     loginClick = () => {
//         this.setState({ loading: true });
//     }

//     render() {
//         return (
//             <Form
//                 name="normal_login"
//                 onFinish={this.login}
//                 className="login-form"
//                 initialValues={{ remember: true }}>
//                 <Form.Item
//                     name="username"
//                     rules={[{ required: true, message: "请输入用户名/邮箱/电话/学工号！" }]}>
//                     <Input
//                         prefix={<UserOutlined className="site-form-item-icon" />}
//                         placeholder="用户名/邮箱/电话/学工号" />
//                 </Form.Item>
//                 <Form.Item
//                     name="password"
//                     rules={[{ required: true, message: "请输入密码！" }]}>
//                     <Input
//                         prefix={<LockOutlined className="site-form-item-icon" />}
//                         type="password"
//                         placeholder="密码" />
//                 </Form.Item>
//                 <Form.Item>
//                     <Form.Item name="remember" valuePropName="checked" noStyle>
//                         <Checkbox checked>记住我</Checkbox>
//                     </Form.Item>
//                     <a className="login-form-forgot" href="javascript;">忘记密码？</a>
//                 </Form.Item>
//                 <Form.Item>
//                     <Button type="primary" htmlType="submit"
//                         className="login-form-button"
//                         loading={this.state.loading}
//                         onClick={this.loginClick}>
//                         登录
//                     </Button>
//                 </Form.Item>
//             </Form>
//         )
//     }
// }