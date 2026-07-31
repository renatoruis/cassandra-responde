import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SecretPage } from './pages/SecretPage'
import './styles/global.css'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isSecret = path === '/segredo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isSecret ? <SecretPage /> : <App />}</StrictMode>,
)
