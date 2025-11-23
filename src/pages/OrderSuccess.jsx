import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-primary-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full 
                        bg-gradient-to-br from-green-500 to-emerald-600 mb-6 
                        animate-bounce shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} 
                    d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">
            ¡Compra Exitosa!
          </h1>
          <p className="text-xl text-primary-600">
            Hemos recibido tu orden #{orderData.orderId}
          </p>
        </div>

        {/* Bento Grid con información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Confirmación enviada */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                        rounded-3xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 
                            flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-primary-900 mb-2">Confirmación Enviada</h3>
                <p className="text-sm text-primary-600">
                  Te enviamos un email a <span className="font-semibold">{orderData.orderData.email}</span> con todos los detalles
                </p>
              </div>
            </div>
          </div>

          {/* Entradas digitales */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                        rounded-3xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 
                            flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-primary-900 mb-2">Entradas Digitales</h3>
                <p className="text-sm text-primary-600">
                  Tus entradas con código QR están listas para descargar en tu email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles de la orden */}
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 md:p-8 border border-white/50 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Detalles de tu Orden</h2>
          
          {/* Eventos comprados */}
          <div className="space-y-4 mb-6">
            {orderData.orderData.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-primary-50">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-primary-900">{item.title}</h3>
                    <p className="text-sm text-primary-600">
                      {item.quantity} {item.quantity === 1 ? 'entrada' : 'entradas'}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-primary-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-primary-200 pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-primary-900">
              <span>Total Pagado</span>
              <span className="text-gradient text-3xl">
                {formatPrice(orderData.orderData.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Información adicional - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 
                        rounded-2xl p-5 border border-white/50 shadow-md text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 
                          flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-primary-900 mb-1">Recordatorios</h3>
            <p className="text-xs text-primary-600">
              Te enviaremos recordatorios antes del evento
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 
                        rounded-2xl p-5 border border-white/50 shadow-md text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 
                          flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-primary-900 mb-1">Ubicación</h3>
            <p className="text-xs text-primary-600">
              Guarda la ubicación en tu calendario
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 
                        rounded-2xl p-5 border border-white/50 shadow-md text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 
                          flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-primary-900 mb-1">Soporte</h3>
            <p className="text-xs text-primary-600">
              Estamos aquí para ayudarte 24/7
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary px-8 py-4 text-center text-lg"
          >
            Volver al Inicio
          </Link>
          <Link
            to="/eventos"
            className="btn-secondary px-8 py-4 text-center text-lg"
          >
            Ver Más Eventos
          </Link>
        </div>

        {/* Compartir en redes */}
        <div className="mt-8 text-center">
          <p className="text-sm text-primary-600 mb-4">¡Comparte tu experiencia!</p>
          <div className="flex justify-center gap-3">
            <button className="w-12 h-12 rounded-full backdrop-blur-xl bg-blue-500/10 hover:bg-blue-500/20 
                             flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full backdrop-blur-xl bg-sky-500/10 hover:bg-sky-500/20 
                             flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full backdrop-blur-xl bg-pink-500/10 hover:bg-pink-500/20 
                             flex items-center justify-center transition-all hover:scale-110">
              <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
