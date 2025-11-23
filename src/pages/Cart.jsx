import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/ui/EmptyState';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-primary-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState 
            message="Tu carrito está vacío"
            action={
              <Link to="/eventos" className="btn-primary px-8 py-3">
                Explorar Eventos
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
            Mi Carrito
          </h1>
          <p className="text-lg text-primary-600">
            {cartItems.length} {cartItems.length === 1 ? 'evento' : 'eventos'} en tu carrito
          </p>
        </div>

        {/* Grid Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lista de items - 8 columnas */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 border border-white/50 
                         shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-40 h-40 object-cover rounded-2xl"
                    />
                  </div>

                  {/* Info del evento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-900 
                                     text-xs font-medium rounded-full mb-2">
                          {item.category}
                        </span>
                        <h3 className="text-xl font-bold text-primary-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-sm text-primary-600 space-x-4">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {item.date}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {item.location}
                          </div>
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ml-4"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Precio y controles */}
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div>
                        <p className="text-sm text-primary-600 mb-1">Precio por entrada</p>
                        <p className="text-2xl font-bold text-gradient">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-xl backdrop-blur-sm bg-primary-100 text-primary-900
                                   hover:bg-primary-200 hover:scale-110 transition-all flex items-center justify-center
                                   font-bold text-xl"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold text-xl text-primary-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-xl backdrop-blur-sm bg-primary-100 text-primary-900
                                   hover:bg-primary-200 hover:scale-110 transition-all flex items-center justify-center
                                   font-bold text-xl"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-primary-600 mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-primary-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón limpiar carrito */}
            <button
              onClick={clearCart}
              className="w-full p-4 rounded-2xl backdrop-blur-xl bg-red-50/80 text-red-600 
                       hover:bg-red-100 border border-red-200 transition-all font-semibold"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Resumen - 4 columnas - Bento Grid */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card de resumen principal */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary-900 to-accent-900 
                          rounded-3xl p-6 shadow-2xl border border-white/20 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">
                Resumen de Compra
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Cargo por servicio</span>
                  <span className="font-semibold">{formatPrice(getCartTotal() * 0.05)}</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal() * 1.05)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-4 bg-white text-primary-900 rounded-xl font-bold text-center
                         hover:scale-105 transition-all shadow-lg mb-3"
              >
                Proceder al Pago
              </Link>

              <Link
                to="/eventos"
                className="block w-full py-3 backdrop-blur-xl bg-white/10 text-white rounded-xl 
                         font-semibold text-center hover:bg-white/20 transition-all border border-white/20"
              >
                Seguir Comprando
              </Link>
            </div>

            {/* Info adicional - Bento style */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 border border-white/50 shadow-lg">
              <h3 className="font-bold text-primary-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Compra Segura
              </h3>
              <p className="text-sm text-primary-600">
                Transacciones protegidas con encriptación SSL de 256 bits
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 border border-white/50 shadow-lg">
              <h3 className="font-bold text-primary-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Métodos de Pago
              </h3>
              <p className="text-sm text-primary-600">
                Aceptamos todas las tarjetas de crédito y débito
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
