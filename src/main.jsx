import React from 'react'

import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
} from 'react-router-dom'

import {
  Toaster,
} from 'react-hot-toast'

import App from './App'

import './index.css'

/* AUTH CONTEXT */

import {
  AuthProvider,
} from './context/AuthContext.jsx'

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <Toaster
          position='top-right'
        />

        <App />

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>

)