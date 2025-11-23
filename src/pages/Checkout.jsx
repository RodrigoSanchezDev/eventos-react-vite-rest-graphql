import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Datos personales
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Datos de pago
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Datos de facturación
    address: '',
    city: '',
    region: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular proceso de pago
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now();
      clearCart();
      navigate('/order-success', { state: { orderId, orderData: { ...formData, items: cartItems, total: getCartTotal() * 1.05 } } });
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
            Checkout
          </h1>
          <p className="text-lg text-primary-600">
            Completa tu información para finalizar la compra
          </p>
        </div>

        {/* Grid Bento Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Formulario - 8 columnas */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Datos Personales */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 md:p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                              flex items-center justify-center text-white font-bold mr-3">
                  1
                </div>
                Datos Personales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 md:p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 
                              flex items-center justify-center text-white font-bold mr-3">
                  2
                </div>
                Método de Pago
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Número de Tarjeta *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength="19"
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Nombre en la Tarjeta *
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="JUAN PEREZ"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Vencimiento *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      value={formData.expiryDate}
                      onChange={handleChange}
                      maxLength="5"
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               backdrop-blur-sm bg-white/80"
                      placeholder="MM/AA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength="4"
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               backdrop-blur-sm bg-white/80"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de Facturación */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 md:p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 
                              flex items-center justify-center text-white font-bold mr-3">
                  3
                </div>
                Datos de Facturación
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             backdrop-blur-sm bg-white/80"
                    placeholder="Av. Principal 123"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               backdrop-blur-sm bg-white/80"
                      placeholder="Santiago"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Región *
                    </label>
                    <input
                      type="text"
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               backdrop-blur-sm bg-white/80"
                      placeholder="Metropolitana"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-900 mb-2">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-primary-200 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               backdrop-blur-sm bg-white/80"
                      placeholder="8320000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de Orden - 4 columnas */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Resumen */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary-900 to-accent-900 
                          rounded-3xl p-6 shadow-2xl border border-white/20 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">
                Resumen de Orden
              </h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-white/90 text-sm">
                    <span className="flex-1 truncate">{item.title} x{item.quantity}</span>
                    <span className="font-semibold ml-2">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/20 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Cargo por servicio (5%)</span>
                  <span className="font-semibold">{formatPrice(getCartTotal() * 0.05)}</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal() * 1.05)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-primary-900 rounded-xl font-bold text-center
                         hover:scale-105 transition-all shadow-lg disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar y Pagar'
                )}
              </button>

              <p className="text-xs text-white/60 text-center mt-4">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </div>

            {/* Info de seguridad */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 border border-white/50 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary-900 mb-1">Pago 100% Seguro</h3>
                  <p className="text-sm text-primary-600">
                    Tus datos están protegidos con encriptación SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
