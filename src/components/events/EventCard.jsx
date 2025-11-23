import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const EventCard = ({ event }) => {
  const { addToCart } = useCart();
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(event, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <Link to={`/eventos/${event.id}`} className="block group">
      <div className="relative overflow-hidden h-full rounded-2xl backdrop-blur-sm bg-white/80 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 
                     group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1.5 backdrop-blur-md bg-white/90 
                         text-xs font-semibold text-primary-900 rounded-full shadow-lg
                         border border-white/50 group-hover:scale-110 transition-transform duration-300">
              {event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <h3 className="text-lg font-bold text-primary-900 mb-3 line-clamp-2 
                       group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-700 
                       group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4">
            {/* Date */}
            <div className="flex items-center text-sm text-primary-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.date)} - {event.time}</span>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-primary-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{event.location}</span>
            </div>

            {/* Seats */}
            <div className="flex items-center text-sm text-primary-600">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{event.availableSeats} cupos disponibles</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-primary-100/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-900 to-accent-700 bg-clip-text text-transparent">
                {formatPrice(event.price)}
              </span>
              <span className="text-sm font-semibold text-primary-700 group-hover:text-primary-900 
                           flex items-center transition-all duration-300 group-hover:gap-2 gap-1">
                Ver detalles
                <svg className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full py-2 backdrop-blur-xl bg-gradient-to-r from-primary-900 to-accent-900 
                       text-white rounded-xl font-semibold text-sm
                       hover:scale-105 hover:shadow-lg transition-all duration-300
                       flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
