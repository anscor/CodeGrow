import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

localStorage.setItem('access', '')
localStorage.setItem('refresh', '')

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);