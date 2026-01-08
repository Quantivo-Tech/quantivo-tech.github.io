import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SmoothScrollProvider } from './components/smooth-scroll-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>,
)
