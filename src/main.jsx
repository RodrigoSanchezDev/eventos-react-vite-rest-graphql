import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Inicializar MSW antes de renderizar la app
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { startMocking } = await import('./mocks/browser');
    await startMocking();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
