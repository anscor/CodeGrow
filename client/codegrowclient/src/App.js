import React from 'react';
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache
} from '@apollo/client'
import './App.css'
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';

export const URL = "http://127.0.0.1:8000/";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: URL + "api/"
    })
});

// const ChannelsList = () => {
//     const { loading, error, data } = useQuery(channelListQuery);
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error.message}</p>;
//     if (!data.allUser) return <p></p>;
//     return (<ul>
//         {data.allUser.map(ch => <li key={ch.username}>{ch.username}</li>)}
//     </ul>)
// };

// const channelListQuery = gql`
// {
//   allUser {
//     username
//   }
// }
// `;

const { Header, Content, Footer } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <ApolloProvider client={client}>
                <Layout className='layout'>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <div className="logo">
                            <img src={process.env.PUBLIC_URL + "/logo.png"} alt='logo' />
                            <p>Code Grow</p>
                        </div>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ float: "right" }}>
                            <Menu.Item key="1">HOME</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">关于</Menu.Item>
                            <SubMenu title={
                                <Avatar src="http://ffff.com/" alt="User" ></Avatar>
                            }>
                                <Menu.Item key="10">test</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Header>
                    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, height: '100%' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            {/* <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item> */}
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                            Content
                            <p style={{ height: 1000 }}></p>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Code Grow ©2020 Created by Anscor</Footer>
                </Layout>
            </ApolloProvider>
        );
    }
}

export default App;