import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'

// Wrapper con todos los providers necesarios
export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <CartProvider>
          {children}
        </CartProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-exportar todo de testing-library
export * from '@testing-library/react'
export { renderWithProviders as render }
