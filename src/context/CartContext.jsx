import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Hook personalizado para usar el carrito
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar del localStorage al iniciar
    const savedCart = localStorage.getItem('eventhub-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('eventhub-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (event, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === event.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === event.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...event, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (eventId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== eventId));
  };

  const updateQuantity = (eventId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(eventId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === eventId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
