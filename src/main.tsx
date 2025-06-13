import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Temporary development CORS workaround
if (import.meta.env.DEV) {
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:5173';
  axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
