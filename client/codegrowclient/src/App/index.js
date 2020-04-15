import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { Layout, Modal } from 'antd';
import "antd/dist/antd.css"

import * as Actions from "../redux/actions"
import MainHeader from './MainHeader'
import MainContent from './MainContent'
import Login from '../Login'
import "./index.css"

export const URL = "http://127.0.0.1:8000/";

const AppUI = props => {
    useEffect(() => {
        if (props.isLogin) return;
        props.initialRequest();
    });
    return (
        <Layout className='layout'>
            <MainHeader
                mainMenuClick={props.mainMenuClick}
                userMenuClick={props.userMenuClick} />
            <MainContent />
            <Modal
                title="登录"
                visible={props.visible}
                closable={false}
                footer={null}
                width="350px"
                maskClosable={false}>
                <Login />
            </Modal>
            <Layout.Footer style={{ textAlign: 'center' }}>
                Code Grow ©2020 Created by Anscor
            </Layout.Footer>
        </Layout>
    );
};

const mapStateToProps = state => {
    return {
        visible: state.top.isLogin === false,
        isLogin: state.top.isLogin
    };
};

const mapDispatchToProps = dispatch => ({
    initialRequest: () => {
        dispatch({ type: Actions.APP_INITIAL_REQUEST });
    },
    mainMenuClick: e => {
        dispatch({ type: Actions.APP_MAIN_MENU_CLICK, key: e.key });
    },
    userMenuClick: e => {
        dispatch({ type: Actions.APP_USER_MENU_CLICK, key: e.key });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);

