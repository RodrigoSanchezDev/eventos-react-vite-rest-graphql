import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restApi } from '../services/restApi';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsResponse, statsResponse] = await Promise.all([
        restApi.getEvents(),
        restApi.getStats()
      ]);

      if (eventsResponse.success) {
        // Mostrar solo los primeros 6 eventos
        setFeaturedEvents(eventsResponse.data.slice(0, 6));
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando eventos destacados..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={loadHomeData} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop" 
            alt="Evento"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-900/85 to-accent-900/90"></div>
        </div>
        
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Descubre experiencias que <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">inspiran</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100/90 mb-8 leading-relaxed backdrop-blur-sm">
              Conecta con eventos únicos: conferencias, conciertos, talleres y más. 
              Tu próxima gran experiencia está a un clic de distancia.
            </p>
            <div className="flex flex-row gap-3 sm:gap-4">
              <Link to="/eventos" className="group relative flex-1 sm:flex-initial px-6 sm:px-8 py-4 bg-white text-primary-900 font-semibold rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden text-center">
                <span className="relative z-10">Explorar Eventos</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/crear-evento" className="group relative flex-1 sm:flex-initial px-6 sm:px-8 py-4 backdrop-blur-sm bg-white/10 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 text-center">
                <span className="relative z-10">Publicar Evento</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats Section */}
      {stats && (
        <section className="relative py-20 overflow-hidden">
          {/* Background with gradient mesh */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Bento Grid Layout - Rectangular Perfecto */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              
              {/* Card Grande 1 - Total Events (2x2) */}
              <div className="col-span-2 row-span-2 group">
                <div className="relative h-full min-h-[280px] md:min-h-[360px] backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 
                              rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] transition-all duration-500">
                  {/* Animated background particles */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  </div>
                  
                  <div className="relative h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-6xl md:text-7xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-500">
                        {stats.totalEvents}<span className="text-3xl">+</span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-white/90">Eventos Activos</div>
                  </div>
                </div>
              </div>

              {/* Card Mediana 1 - Categorías */}
              <div className="col-span-1 row-span-1 group">
                <div className="relative h-full min-h-[140px] md:min-h-[170px] backdrop-blur-xl bg-gradient-to-br from-pink-500/90 to-rose-600/90 
                              rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] hover:rotate-1 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="text-5xl md:text-6xl font-black text-white group-hover:scale-110 transition-transform duration-500">
                      {stats.categories}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-white/90">Categorías</div>
                  </div>
                </div>
              </div>

              {/* Card Mediana 2 - Precio Promedio */}
              <div className="col-span-1 row-span-1 group">
                <div className="relative h-full min-h-[140px] md:min-h-[170px] backdrop-blur-xl bg-gradient-to-br from-emerald-500/90 to-teal-600/90 
                              rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] hover:-rotate-1 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-500">
                      ${new Intl.NumberFormat('es-CL').format(stats.averagePrice)}
                    </div>
                    <div className="text-sm md:text-base font-semibold text-white/90">Precio Promedio</div>
                  </div>
                </div>
              </div>

              {/* Card Grande 2 - Cupos Disponibles (2x1) */}
              <div className="col-span-2 row-span-1 group">
                <div className="relative h-full min-h-[140px] md:min-h-[170px] backdrop-blur-xl bg-gradient-to-br from-orange-500/90 to-amber-600/90 
                              rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 overflow-hidden
                              hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-5 right-5 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"></div>
                  </div>
                  <div className="relative h-full flex items-center justify-between">
                    <div>
                      <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-500">
                        {stats.totalSeats.toLocaleString()}<span className="text-2xl">+</span>
                      </div>
                      <div className="text-base md:text-lg font-semibold text-white/90">Cupos Disponibles</div>
                    </div>
                    <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl
                                  group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Bento Grid Featured Events */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gradient mb-3">
                Eventos Destacados
              </h2>
              <p className="text-lg text-primary-600 font-medium">
                Los mejores eventos seleccionados para ti
              </p>
            </div>
            <Link 
              to="/eventos" 
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-primary-900/90 
                       text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                       hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Ver todos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Bento Grid Asimétrico para eventos */}
          <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[280px]">
            {featuredEvents.slice(0, 6).map((event, index) => {
              // Patrón Bento asimétrico: grande, mediano, pequeño
              const patterns = [
                'col-span-12 md:col-span-8 row-span-2', // Grande
                'col-span-12 md:col-span-4 row-span-1', // Mediano alto
                'col-span-12 md:col-span-4 row-span-1', // Mediano
                'col-span-12 md:col-span-5 row-span-1', // Mediano ancho
                'col-span-12 md:col-span-7 row-span-2', // Grande horizontal
                'col-span-12 md:col-span-5 row-span-1', // Mediano
              ];
              
              return (
                <Link 
                  key={event.id} 
                  to={`/eventos/${event.id}`}
                  className={`${patterns[index]} group relative overflow-hidden rounded-3xl
                            backdrop-blur-xl bg-white/80 border border-white/40 shadow-2xl
                            hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500`}
                >
                  {/* Event Image Background */}
                  <div className="absolute inset-0">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/50 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full p-6 md:p-8 flex flex-col justify-end">
                    {/* Category Badge */}
                    <div className="absolute top-6 right-6">
                      <span className="inline-flex items-center px-4 py-2 backdrop-blur-xl bg-white/90 
                                   text-xs font-bold text-primary-900 rounded-full shadow-lg
                                   border border-white/50 group-hover:scale-110 transition-transform duration-300">
                        {event.category}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-black text-white line-clamp-2 
                                   group-hover:text-blue-200 transition-colors duration-300">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-semibold">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-semibold">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <span className="text-3xl font-black text-white">
                          ${new Intl.NumberFormat('es-CL').format(event.price)}
                        </span>
                        <span className="inline-flex items-center gap-2 text-white font-semibold
                                     group-hover:gap-3 transition-all duration-300">
                          Ver más
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/eventos" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Ver todos los eventos
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50 to-accent-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-4">
              ¿Por qué elegir EventHub?
            </h2>
            <p className="text-xl text-primary-600 font-medium max-w-2xl mx-auto">
              La plataforma más completa para descubrir y organizar eventos
            </p>
          </div>

          {/* Bento Grid Features - Rectangular Responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Feature 1 - Grande (Búsqueda Inteligente) */}
            <div className="md:col-span-2 md:row-span-1 group">
              <div className="relative h-full min-h-[300px] md:min-h-[280px] backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                            rounded-3xl p-8 md:p-10 shadow-lg border border-white/50 overflow-hidden
                            hover:scale-[1.02] hover:shadow-blue-500/20 transition-all duration-500">
                {/* Animated orbs */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
                
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center w-20 h-20 backdrop-blur-sm bg-gradient-to-br from-blue-500 to-purple-600 
                                  rounded-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-primary-900 mb-4 group-hover:text-blue-600 transition-colors">
                      Búsqueda Inteligente
                    </h3>
                  </div>
                  <p className="text-lg text-primary-600 font-medium leading-relaxed">
                    Encuentra el evento perfecto con nuestro sistema de búsqueda avanzado, filtros por categoría, 
                    fecha, ubicación y más. IA que aprende de tus preferencias.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Compra Segura */}
            <div className="group">
              <div className="relative h-full min-h-[220px] backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                            rounded-3xl p-8 shadow-lg border border-white/50 overflow-hidden
                            hover:scale-[1.02] hover:shadow-emerald-500/20 transition-all duration-500">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl opacity-10"></div>
                
                <div className="relative h-full flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-emerald-500 to-teal-600 
                                  rounded-2xl flex items-center justify-center shadow-lg
                                  group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-primary-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      Compra 100% Segura
                    </h3>
                    <p className="text-sm md:text-base text-primary-600 font-medium">
                      Transacciones protegidas con encriptación de última generación y garantía de reembolso.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Tiempo Real */}
            <div className="group">
              <div className="relative h-full min-h-[220px] backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 
                            rounded-3xl p-8 shadow-lg border border-white/50 overflow-hidden
                            hover:scale-[1.02] hover:shadow-orange-500/20 transition-all duration-500">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl opacity-10"></div>
                
                <div className="relative h-full flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-orange-500 to-pink-600 
                                  rounded-2xl flex items-center justify-center shadow-lg
                                  group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-primary-900 mb-2 group-hover:text-orange-600 transition-colors">
                      Tiempo Real
                    </h3>
                    <p className="text-sm md:text-base text-primary-600 font-medium">
                      Actualizaciones instantáneas de disponibilidad, cambios y notificaciones push personalizadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Experiencias Únicas */}
            <div className="group">
              <div className="relative h-full min-h-[200px] backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 
                            rounded-3xl p-6 shadow-md border border-white/50 overflow-hidden
                            hover:scale-[1.02] hover:rotate-2 transition-all duration-500">
                <div className="relative h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-violet-500 to-purple-600 
                                rounded-2xl flex items-center justify-center shadow-lg
                                group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span className="text-base md:text-lg font-bold text-primary-900">Experiencias Únicas</span>
                </div>
              </div>
            </div>

            {/* Feature 5 - Comunidad Activa */}
            <div className="group">
              <div className="relative h-full min-h-[200px] backdrop-blur-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 
                            rounded-3xl p-6 shadow-md border border-white/50 overflow-hidden
                            hover:scale-[1.02] hover:-rotate-2 transition-all duration-500">
                <div className="relative h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 backdrop-blur-sm bg-gradient-to-br from-rose-500 to-red-600 
                                rounded-2xl flex items-center justify-center shadow-lg
                                group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-base md:text-lg font-bold text-primary-900">Comunidad Activa</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section - Bento Style */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-purple-900 to-accent-900"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[160px] md:auto-rows-[200px]">
            
            {/* Main CTA Card */}
            <div className="col-span-12 md:col-span-8 row-span-4 md:row-span-2 group">
              <div className="relative h-full backdrop-blur-2xl bg-white/10 rounded-3xl p-8 md:p-12 
                            shadow-2xl border border-white/20 overflow-hidden
                            hover:scale-[1.02] transition-all duration-500">
                {/* Animated orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
                
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/20 
                                  rounded-full text-white font-semibold text-sm mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Gratis para siempre
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                      ¿Organizas <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">eventos</span>?
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium leading-relaxed max-w-2xl">
                      Publica tus eventos gratis y llega a miles de personas interesadas. 
                      Sin comisiones, sin límites, sin trucos.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/crear-evento" 
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-900 
                               font-bold rounded-xl shadow-2xl hover:shadow-white/20 
                               transition-all duration-300 hover:scale-105 active:scale-95 group">
                      <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Publicar mi Evento
                    </Link>
                    <Link 
                      to="/acerca" 
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 backdrop-blur-sm bg-white/10 
                               border-2 border-white/30 text-white font-bold rounded-xl 
                               hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95">
                      Saber más
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card 1 */}
            <div className="col-span-6 md:col-span-4 row-span-1 group">
              <div className="relative h-full backdrop-blur-xl bg-white/10 rounded-3xl p-6 
                            shadow-2xl border border-white/20 overflow-hidden
                            hover:scale-[1.02] hover:rotate-2 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-between">
                  <div className="w-12 h-12 backdrop-blur-sm bg-white/20 rounded-2xl flex items-center justify-center
                                group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white mb-1">10K+</div>
                    <div className="text-sm font-semibold text-white/80">Organizadores</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card 2 */}
            <div className="col-span-6 md:col-span-4 row-span-1 group">
              <div className="relative h-full backdrop-blur-xl bg-white/10 rounded-3xl p-6 
                            shadow-2xl border border-white/20 overflow-hidden
                            hover:scale-[1.02] hover:-rotate-2 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-between">
                  <div className="w-12 h-12 backdrop-blur-sm bg-white/20 rounded-2xl flex items-center justify-center
                                group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white mb-1">500K+</div>
                    <div className="text-sm font-semibold text-white/80">Asistentes Felices</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
