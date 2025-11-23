import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FloatingCart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isCartOpen, toggleCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 backdrop-blur-xl bg-gradient-to-br from-primary-900 to-accent-900 
                   rounded-full shadow-2xl flex items-center justify-center
                   hover:scale-110 hover:rotate-12 transition-all duration-300 group"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        {/* Badge con número de items */}
        {getCartCount() > 0 && (
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-600 
                         rounded-full flex items-center justify-center text-white text-xs font-bold
                         animate-bounce shadow-lg">
            {getCartCount()}
          </span>
        )}
      </button>

      {/* Panel del carrito desplegable */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 transition-transform duration-300 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full backdrop-blur-2xl bg-white/95 shadow-2xl border-l border-white/50 flex flex-col">
          
          {/* Header */}
          <div className="p-6 backdrop-blur-xl bg-gradient-to-r from-primary-900 to-accent-900 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Mi Carrito</h2>
                <p className="text-sm text-white/80">{getCartCount()} {getCartCount() === 1 ? 'entrada' : 'entradas'}</p>
              </div>
              <button
                onClick={toggleCart}
                className="w-10 h-10 rounded-full backdrop-blur-sm bg-white/20 flex items-center justify-center
                         hover:bg-white/30 hover:rotate-90 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lista de items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">Tu carrito está vacío</h3>
                <p className="text-primary-600 mb-6">Agrega entradas para tus eventos favoritos</p>
                <Link
                  to="/eventos"
                  onClick={toggleCart}
                  className="btn-primary px-6 py-3"
                >
                  Ver Eventos
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="backdrop-blur-xl bg-white/80 rounded-2xl p-4 border border-white/50 
                           hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-primary-900 mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-primary-600 mb-2">{item.category}</p>
                      <p className="text-lg font-bold text-gradient">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg backdrop-blur-sm bg-primary-100 text-primary-900
                                 hover:bg-primary-200 transition-colors flex items-center justify-center
                                 font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-semibold text-primary-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg backdrop-blur-sm bg-primary-100 text-primary-900
                                 hover:bg-primary-200 transition-colors flex items-center justify-center
                                 font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-3 text-right">
                    <span className="text-sm text-primary-600">Subtotal: </span>
                    <span className="font-bold text-primary-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer con total y botones */}
          {cartItems.length > 0 && (
            <div className="p-6 backdrop-blur-xl bg-white/95 border-t border-primary-200">
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary-900">Total</span>
                  <span className="text-2xl font-bold text-gradient">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="block w-full btn-primary py-4 text-center text-lg font-semibold"
                >
                  Ir al Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={toggleCart}
                  className="block w-full btn-secondary py-4 text-center font-semibold"
                >
                  Ver Carrito Completo
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay oscuro cuando el carrito está abierto */}
      {isCartOpen && (
        <div
          onClick={toggleCart}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}
    </>
  );
};

export default FloatingCart;
