import React from 'react';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, gql, useQuery } from '@apollo/client'
import './App.css'

import Login from './Login'

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "http://127.0.0.1:8000/api/"
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

class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Login />
            </ApolloProvider>
        );
    }
}

export default App;