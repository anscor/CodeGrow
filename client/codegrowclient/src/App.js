import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache
} from '@apollo/client'
import './App.css'
import { Layout, Menu, Breadcrumb, Avatar, Dropdown } from 'antd';
import {
    SettingOutlined,
    PoweroffOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom'

import ToIndex from './toIndex'

export const URL = "http://127.0.0.1:8000/";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: URL + "api/"
    })
});

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

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

const UserInfo = () => {
    return (
        <Dropdown overlay={
            <Menu onClick={e => {
                console.log(e.key);
            }}>
                <Menu.Item key="setting">
                    <SettingOutlined />
                    设置
                </Menu.Item>
                <Menu.Item key="logout">
                    <PoweroffOutlined />
                    退出登录
                </Menu.Item>
            </Menu>
        }>
            <Avatar src={process.env.PUBLIC_URL + "/logo.png"} />
        </Dropdown>
    );
}

// Header中菜单部分
const HeaderMenu = () => {
    return (
        <div id="menu_box">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
                <Menu.Item key="home">HOME</Menu.Item>
                <Menu.Item key="about">关于</Menu.Item>
                {/* 用户信息显示部分 */}
                {/* <SubMenu title={
                    <Avatar src="http://ffff.com/" alt="User" ></Avatar>
                }>
                    <Menu.Item key="setting">
                        <SettingOutlined />
                        设置
                </Menu.Item>
                    <Menu.Item key="logout">
                        <PoweroffOutlined />
                        退出登录
                </Menu.Item>
                </SubMenu> */}
                <UserInfo />
            </Menu>
        </div>
    );
}

// 整个Header
const MainHeader = () => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <HeaderLogo />
            <HeaderMenu />
        </Header>
    );
}

// 整个内容
const MainContent = () => {
    return (
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, height: '100%' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item></Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                Content
                <p style={{ height: 1000 }}></p>
            </div>
        </Content>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 是否已经登录
            isLogin: this.props.isLogin || localStorage.getItem('access')
        };
    }

    render() {
        // 如果已经登录则渲染此页面
        if (this.state.isLogin) {
            return (
                <ApolloProvider client={client}>
                    <Layout className='layout'>
                        <MainHeader />
                        <MainContent />
                        <Footer style={{ textAlign: 'center' }}>
                            Code Grow ©2020 Created by Anscor
                    </Footer>
                    </Layout>
                </ApolloProvider>
            );
        }
        // 没有登录则跳转到Index页面
        else return <ToIndex />
    }
}

export default App;