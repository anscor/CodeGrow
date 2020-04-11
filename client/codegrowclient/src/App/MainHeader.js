/*
 * @Author: Anscor
 * @Date: 2020-04-10 16:23:01
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-10 16:36:21
 * @Description: Main Header
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons'

const HeaderLogo = () => (
    <Link to="/">
        <div className="logo">
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt='logo' />
            <p>Code Grow</p>
        </div>
    </Link>
);

const UserMenu = props => (
    <Dropdown overlay={
        <Menu onClick={props.menuClick}>
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

const HeaderMenu = props => (
    <div id="menu_box">
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            onClick={props.menuClick}>
            <Menu.Item key="home">HOME</Menu.Item>
            <Menu.Item key="about">关于</Menu.Item>
            <UserMenu />
        </Menu>
    </div>
);

export default () => (
    <Layout.Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <HeaderLogo />
        <HeaderMenu />
    </Layout.Header>
);