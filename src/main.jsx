// index.jsx
import React, { Suspense, lazy, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import { Spin } from 'antd';
import App from './App.jsx'

// Full-screen Fallback Spinner
const Fallback = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      zIndex: 9999,
    }}
  >
    <Spin size="large" />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  </Provider>
);
