import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, ScrollRestoration } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import router from './router.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
