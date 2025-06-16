// index.jsx
import React, { Suspense, lazy, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import { Spin } from 'antd';
import App from './App.jsx'
import FullPageLoader from './components/client/common/FullPageLoader.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={<FullPageLoader />}>
      <App />
    </Suspense>
  </Provider>
);
