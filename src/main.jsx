import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { HypeProvider } from './context/HypeContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HypeProvider>
      <App />
      <Analytics />
    </HypeProvider>
  </StrictMode>,
)

