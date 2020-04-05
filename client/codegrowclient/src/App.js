import React from 'react';
import { Link, Route, useRouteMatch } from 'react-router-dom'
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    gql,
    ApolloLink,
    concat
} from '@apollo/client'
import { Query } from '@apollo/react-components'
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Skeleton, message } from 'antd';
import {
    SettingOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';

import ToIndex from './toIndex'
import { checkToken } from './Login/Login'
import Home from './Home'
import About from './About';
import './App.css'

export const URL = "http://127.0.0.1:8000/";

const { Header, Content, Footer } = Layout;

// Header中Logo部分
const HeaderLogo = () => {
    return (
        // 点击Logo跳转到Index页面
        <Link to="/">
            <div className="logo">
                <img src={process.env.PUBLIC_URL + "/logo.png"} alt='logo' />
                <p>Code Grow</p>
            </div>
        </Link>
    );
}


// 用户信息部分
class UserMenu extends React.Component {
    menuClick = e => {
        switch (e.key) {
            case "setting":
                break;
            case "logout":
                // 清除Token
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                // 跳转到Index
                window.location.href = "/";
                break;
            default:
                break;
        }
    }

    render() {
        if (this.props.isLogin) return (
            <Query query={gql`{
                user {
                    username
                    email
                    profile {
                        name
                        alias
                        sex
                        age
                        studentId
                        createTime
                        updateTime
                    }
                }
            }`}>
                {({ loading, error, data }) => {
                    // 正在请求用户信息数据
                    if (loading) return <Avatar icon={<UserOutlined />} />;
                    // 出错
                    if (error) {
                        message.error(error.message);
                        console.log(error.message);
                        return (
                            <Avatar icon={<UserOutlined />} />
                        );
                    }
                    console.log(data);
                    return (
                        <Dropdown overlay={
                            <Menu onClick={this.menuClick}>
                                <Menu.Item key="setting">
                                    <SettingOutlined />
                                    账号设置
                                    </Menu.Item>
                                <Menu.Item key="logout">
                                    <LogoutOutlined />
                                    退出登录
                                    </Menu.Item>
                            </Menu>
                        }>
                            <Avatar src={process.env.PUBLIC_URL + "/logo.png"} />
                        </Dropdown>
                    );
                }}
            </Query>
        );
        else return <Avatar icon={<UserOutlined />} />;
    }
}

// Header中菜单部分

class HeaderMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfoLoading: true
        }
    }

    menuClick = e => {
        switch (e.key) {
            case "home":
                this.props.history.push("/main/");
                break;
            case "about":
                this.props.history.push("/main/about/");
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div id="menu_box">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['home']}
                    onClick={this.menuClick}>
                    <Menu.Item key="home">HOME</Menu.Item>
                    <Menu.Item key="about">关于</Menu.Item>
                    <UserMenu isLogin={this.props.isLogin} />
                </Menu>
            </div>
        );
    }
}

// 整个Header
const MainHeader = (props) => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <HeaderLogo history={props.history} />
            <HeaderMenu history={props.history} isLogin={props.isLogin} />
        </Header>
    );
}

// 整个内容
const MainContent = (props) => {
    const match = useRouteMatch();
    return (
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, height: '100%' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item></Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                <Skeleton loading={!props.loading} active>
                    <Route exact path={`${match.path}/`}>
                        <Home />
                    </Route>
                    <Route path={`${match.path}/about/`}>
                        <About />
                    </Route>
                </Skeleton>
            </div>
        </Content>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 是否已经登录
            isLogin: this.props.isLogin,
            message: undefined,
            client: undefined
        };
    }

    componentDidMount() {
        checkToken(this.handleCheck);
    }

    // 检查Token合法性
    handleCheck = (ok, message) => {
        console.log(ok);

        if (!ok) {
            this.setState({ isLogin: false, message: message });
            return;

        }
        // 如果合法则再通过Token获取用户信息
        const httpLink = new HttpLink({
            uri: URL + "api/"
        });
        const auth = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                    authorization: "Bearer " + localStorage.getItem('access'),
                }
            });
            return forward(operation);
        });
        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: concat(auth, httpLink),
        });
        this.setState({ isLogin: true, client: client });
    }

    render() {
        // 如果已经登录或验证数据未返回
        if (this.state.isLogin !== false) {
            return (
                <ApolloProvider
                    client={this.state.client ||
                        new ApolloClient({
                            uri: URL + "api/",
                            cache: new InMemoryCache()
                        })}>
                    <Layout className='layout'>
                        <MainHeader history={this.props.history}
                            isLogin={this.state.isLogin} />
                        <MainContent history={this.props.history}
                            loading={this.state.isLogin}
                            isLogin={this.state.isLogin} />
                        <Footer style={{ textAlign: 'center' }}>
                            Code Grow ©2020 Created by Anscor
                        </Footer>
                    </Layout>
                </ApolloProvider>
            );
        }
        // 没有登录则跳转到Index页面
        else return <ToIndex message={this.state.message} />;
    }
}

export default App;