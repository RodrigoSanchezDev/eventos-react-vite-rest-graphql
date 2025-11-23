import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { restApi } from '../services/restApi';
import { graphqlApi } from '../services/graphqlApi';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [eventBasic, setEventBasic] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos básicos con REST API
      const restResponse = await restApi.getEventById(id);
      
      if (!restResponse.success) {
        setError('Evento no encontrado');
        return;
      }

      setEventBasic(restResponse.data);

      // Cargar detalles extendidos con GraphQL API
      const graphqlResponse = await graphqlApi.getEventDetails(id);
      
      if (graphqlResponse.data?.event) {
        setEventDetails(graphqlResponse.data.event);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (loading) {
    return <LoadingSpinner text="Cargando detalles del evento..." />;
  }

  if (error || !eventBasic) {
    return (
      <ErrorMessage 
        message={error || 'Evento no encontrado'} 
        retry={() => navigate('/eventos')} 
      />
    );
  }

  const event = eventDetails || eventBasic;

  return (
    <div className="min-h-screen bg-primary-50 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm">
          <Link to="/" className="text-primary-600 hover:text-primary-900 transition-colors">
            Inicio
          </Link>
          <span className="text-primary-400">/</span>
          <Link to="/eventos" className="text-primary-600 hover:text-primary-900 transition-colors">
            Eventos
          </Link>
          <span className="text-primary-400">/</span>
          <span className="text-primary-900 font-medium">{event.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="card overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Title and Category */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-900 
                               text-sm font-medium rounded-full mb-3">
                    {event.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
                    {event.title}
                  </h1>
                  {event.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(event.rating) ? 'text-yellow-400' : 'text-primary-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-primary-600">
                        {event.rating} ({event.reviewsCount} reseñas)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-primary-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-primary-600 mb-1">Fecha y hora</p>
                    <p className="font-medium text-primary-900">{formatDate(event.date)}</p>
                    <p className="text-sm text-primary-700">{event.time} hrs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-primary-600 mb-1">Ubicación</p>
                    <p className="font-medium text-primary-900">{event.location}</p>
                  </div>
                </div>

                {event.confirmedAttendees && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" fill="none" 
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-primary-600 mb-1">Asistentes</p>
                      <p className="font-medium text-primary-900">
                        {event.confirmedAttendees} confirmados
                      </p>
                      <p className="text-sm text-primary-700">
                        {event.availableSeats} cupos disponibles
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-primary-600 mb-1">Precio</p>
                    <p className="text-2xl font-bold text-primary-900">{formatPrice(event.price)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-primary-200">
                <h2 className="text-xl font-semibold text-primary-900 mb-3">
                  Descripción
                </h2>
                <p className="text-primary-700 leading-relaxed">
                  {event.fullDescription || event.description}
                </p>
              </div>

              {/* Tags */}
              {event.tags && (
                <div className="pt-6 border-t border-primary-200">
                  <h2 className="text-xl font-semibold text-primary-900 mb-3">
                    Etiquetas
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-900 text-sm 
                                 font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {event.schedule && (
                <div className="pt-6 border-t border-primary-200">
                  <h2 className="text-xl font-semibold text-primary-900 mb-4">
                    Agenda del Evento
                  </h2>
                  <div className="space-y-3">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <span className="flex-shrink-0 w-16 text-sm font-medium text-primary-700">
                          {item.time}
                        </span>
                        <span className="text-primary-900">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && (
                <div className="pt-6 border-t border-primary-200">
                  <h2 className="text-xl font-semibold text-primary-900 mb-3">
                    Requisitos e Información Importante
                  </h2>
                  <p className="text-primary-700">{event.requirements}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-6">
              {/* Price */}
              <div>
                <p className="text-sm text-primary-600 mb-2">Precio por entrada</p>
                <p className="text-3xl font-bold text-primary-900">{formatPrice(event.price)}</p>
              </div>

              {/* Quantity selector */}
              <div>
                <p className="text-sm font-semibold text-primary-900 mb-3">Cantidad</p>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl backdrop-blur-sm bg-primary-100 text-primary-900
                             hover:bg-primary-200 hover:scale-110 transition-all flex items-center justify-center
                             font-bold text-xl"
                  >
                    −
                  </button>
                  <span className="w-16 text-center font-bold text-2xl text-primary-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl backdrop-blur-sm bg-primary-100 text-primary-900
                             hover:bg-primary-200 hover:scale-110 transition-all flex items-center justify-center
                             font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => addToCart(event, quantity)}
                className="w-full btn-primary py-4 text-lg"
              >
                Agregar al Carrito
              </button>

              {/* Organizer */}
              {event.organizer && (
                <div className="pt-6 border-t border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-900 mb-3">
                    Organizado por
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium text-primary-900">{event.organizer.name}</p>
                    {event.organizer.email && (
                      <a 
                        href={`mailto:${event.organizer.email}`}
                        className="flex items-center text-sm text-primary-600 hover:text-primary-900 
                                 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" 
                             viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {event.organizer.email}
                      </a>
                    )}
                    {event.organizer.phone && (
                      <a 
                        href={`tel:${event.organizer.phone}`}
                        className="flex items-center text-sm text-primary-600 hover:text-primary-900 
                                 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" 
                             viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {event.organizer.phone}
                      </a>
                    )}
                    {event.organizer.website && (
                      <a 
                        href={`https://${event.organizer.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 hover:text-primary-900 
                                 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" 
                             viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {event.organizer.website}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="pt-6 border-t border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-3">
                  Compartir evento
                </h3>
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-primary-100 text-primary-900 
                                   rounded-lg hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="flex-1 px-4 py-2 bg-primary-100 text-primary-900 
                                   rounded-lg hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="flex-1 px-4 py-2 bg-primary-100 text-primary-900 
                                   rounded-lg hover:bg-primary-200 transition-colors">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" 
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
