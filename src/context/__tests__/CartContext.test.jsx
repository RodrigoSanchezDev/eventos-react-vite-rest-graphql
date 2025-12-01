import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Componente de prueba para acceder al contexto
const TestComponent = () => {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount,
    isCartOpen,
    toggleCart 
  } = useCart()
  
  return (
    <div>
      <span data-testid="cart-count">{getCartCount()}</span>
      <span data-testid="cart-total">{getCartTotal()}</span>
      <span data-testid="cart-open">{isCartOpen ? 'open' : 'closed'}</span>
      <span data-testid="cart-items">{JSON.stringify(cartItems)}</span>
      <button onClick={() => addToCart({ id: '1', title: 'Test Event', price: 10000 })}>
        Add Item
      </button>
      <button onClick={() => removeFromCart('1')}>
        Remove Item
      </button>
      <button onClick={() => updateQuantity('1', 5)}>
        Update Quantity
      </button>
      <button onClick={() => clearCart()}>
        Clear Cart
      </button>
      <button onClick={toggleCart}>
        Toggle Cart
      </button>
    </div>
  )
}

// Wrapper para renderizar con el provider
const renderWithCart = (ui) => {
  return render(
    <CartProvider>
      {ui}
    </CartProvider>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
  })

  describe('useCart hook', () => {
    it('lanza error cuando se usa fuera del provider', () => {
      // Suprimir errores de consola para este test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<TestComponent />)
      }).toThrow('useCart debe ser usado dentro de CartProvider')
      
      consoleSpy.mockRestore()
    })

    it('no lanza error cuando se usa dentro del provider', () => {
      expect(() => {
        renderWithCart(<TestComponent />)
      }).not.toThrow()
    })
  })

  describe('addToCart', () => {
    it('agrega un item al carrito', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    })

    it('incrementa la cantidad si el item ya existe', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      fireEvent.click(screen.getByText('Add Item'))
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    })

    it('abre el carrito al agregar un item', () => {
      renderWithCart(<TestComponent />)
      
      expect(screen.getByTestId('cart-open')).toHaveTextContent('closed')
      fireEvent.click(screen.getByText('Add Item'))
      expect(screen.getByTestId('cart-open')).toHaveTextContent('open')
    })
  })

  describe('removeFromCart', () => {
    it('elimina un item del carrito', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
      
      fireEvent.click(screen.getByText('Remove Item'))
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    })
  })

  describe('updateQuantity', () => {
    it('actualiza la cantidad de un item', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      fireEvent.click(screen.getByText('Update Quantity'))
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('5')
    })

    it('elimina el item si la cantidad es 0 o menor', () => {
      const TestComponentWithZero = () => {
        const { addToCart, updateQuantity, getCartCount } = useCart()
        return (
          <div>
            <span data-testid="count">{getCartCount()}</span>
            <button onClick={() => addToCart({ id: '1', title: 'Test', price: 100 })}>Add</button>
            <button onClick={() => updateQuantity('1', 0)}>Set Zero</button>
          </div>
        )
      }
      
      renderWithCart(<TestComponentWithZero />)
      
      fireEvent.click(screen.getByText('Add'))
      expect(screen.getByTestId('count')).toHaveTextContent('1')
      
      fireEvent.click(screen.getByText('Set Zero'))
      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })
  })

  describe('clearCart', () => {
    it('elimina todos los items del carrito', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      fireEvent.click(screen.getByText('Add Item'))
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
      
      fireEvent.click(screen.getByText('Clear Cart'))
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    })
  })

  describe('getCartTotal', () => {
    it('calcula el total correctamente', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      expect(screen.getByTestId('cart-total')).toHaveTextContent('10000')
      
      fireEvent.click(screen.getByText('Add Item'))
      expect(screen.getByTestId('cart-total')).toHaveTextContent('20000')
    })
  })

  describe('toggleCart', () => {
    it('alterna el estado del carrito', () => {
      renderWithCart(<TestComponent />)
      
      expect(screen.getByTestId('cart-open')).toHaveTextContent('closed')
      
      fireEvent.click(screen.getByText('Toggle Cart'))
      expect(screen.getByTestId('cart-open')).toHaveTextContent('open')
      
      fireEvent.click(screen.getByText('Toggle Cart'))
      expect(screen.getByTestId('cart-open')).toHaveTextContent('closed')
    })
  })

  describe('localStorage', () => {
    it('carga el carrito desde localStorage al iniciar', () => {
      const savedCart = [{ id: '1', title: 'Saved Event', price: 5000, quantity: 2 }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart))
      
      renderWithCart(<TestComponent />)
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    })

    it('guarda el carrito en localStorage al cambiar', () => {
      renderWithCart(<TestComponent />)
      
      fireEvent.click(screen.getByText('Add Item'))
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'eventhub-cart',
        expect.any(String)
      )
    })
  })
})
