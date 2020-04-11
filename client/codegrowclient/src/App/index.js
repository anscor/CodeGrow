import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { Layout, Modal } from 'antd';
import "antd/dist/antd.css"

import * as Actions from "../redux/actionts"
import MainHeader from './MainHeader'
import MainContent from './MainContent'
import Login from '../Login'
import "./index.css"

export const URL = "http://127.0.0.1:8000/";

const AppUI = props => {
    useEffect(props.initialRequest);
    return (
        <Layout className='layout'>
            <MainHeader />
            <MainContent />
            <Modal
                title="登录"
                visible={props.visible}
                closable={false}
                footer={null}
                width="350px"
                onCancel={props.onCancel}>
                <Login />
            </Modal>
            <Layout.Footer style={{ textAlign: 'center' }}>
                Code Grow ©2020 Created by Anscor
            </Layout.Footer>
        </Layout>
    );
}

const mapStateToProps = (state) => {
    return {
        visible: state.app.visible,
        isLogin: state.top.isLogin,
        client: state.top.client
    };
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => ({ type: Actions.APP_MODAL_CANCEL }),
    initialRequest: () => {
        dispatch({ type: Actions.APP_INITIAL_REQUEST });
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppUI);

