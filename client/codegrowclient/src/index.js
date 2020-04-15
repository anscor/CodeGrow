import React from 'react'
import ReactDOM from "react-dom"
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import store from './redux/store'
import App from './App'

ReactDOM.render(
    <Provider store={store}>
        <Router history={createBrowserHistory()}>
            <Route path="/" component={App} />
        </Router>
    </Provider>,
    document.getElementById("root")
);