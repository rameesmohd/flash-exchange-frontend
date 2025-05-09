import React ,{Suspense}from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/Store.js'
import { Spin } from 'antd'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>
    <Suspense fallback={<React.Fragement className={'w-screen h-screen flex justify-center items-center'}><Spin/></React.Fragement>}>
      <App />
    </Suspense>
  </Provider>
  </React.StrictMode>
)
