/*
 * @Author: Anscor
 * @Date: 2020-04-10 16:40:15
 * @LastEditors: Anscor
 * @LastEditTime: 2020-04-15 11:55:02
 * @Description: Main Content
 */

import React from 'react'
import { Layout, Breadcrumb } from 'antd'
import { Route } from 'react-router-dom'

import Home from '../Home'
import About from '../About'
import Submission from '../Submission'

export default () => {
    return (
        <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, height: '100%' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item></Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                <Route exact path="/" component={Home} />
                <Route path="/about/" component={About} />
                <Route path="/submission/" component={Submission} />
            </div>
        </Layout.Content>
    );
}
