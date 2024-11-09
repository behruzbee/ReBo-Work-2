import React from 'react'
import ReactDOM from 'react-dom/client'

import Routing from './routing/index.tsx'

import './app.scss'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routing />
    <ToastContainer/> 
  </React.StrictMode>,
)
