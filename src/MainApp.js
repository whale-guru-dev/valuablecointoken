import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';

import App from './app';

import 'react-notifications-component/dist/theme.css';
import './App.css';

function MainApp() {
  return (
    <Router>
      <ReactNotification />
        <App/>
    </Router>
  );
}

export default MainApp;
