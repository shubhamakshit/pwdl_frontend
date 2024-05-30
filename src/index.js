import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {uuid} from "./uuid";
import {io} from "socket.io-client";

//check if localStorage has clientId if not create one (uuid4) and store it in localStorage
if (!localStorage.getItem("clientId")) {
    localStorage.setItem("clientId", uuid());
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
