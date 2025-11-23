import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Inicio', path: '/' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Crear Evento', path: '/crear-evento' },
    { name: 'Acerca de', path: '/acerca' },
  ];

  const categories = [
    'Todas',
    'Conferencia',
    'Concierto',
    'Festival',
    'Taller',
    'Exposición',
    'Deportivo',
    'Networking'
  ];

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/src/data/events.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  // Search and filter events
  const handleSearch = async (query, category) => {
    const events = await fetchEvents();
    
    let filtered = events;

    // Filter by category
    if (category && category !== 'Todas') {
      filtered = filtered.filter(event => event.category === category);
    }

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    setSearchResults(filtered);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleSearch(searchQuery, category);
  };

  // Handle search input change
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query, selectedCategory);
  };

  // Handle event click
  const handleEventClick = (eventId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCategory('');
    setIsMobileMenuOpen(false);
    navigate(`/eventos/${eventId}`);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto z-50 backdrop-blur-xl bg-white border border-white/40 rounded-2xl shadow-2xl shadow-primary-900/10">
      <div className="px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-900 to-accent-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-primary-900">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-5 py-2 text-sm font-medium text-primary-700 hover:text-primary-900 
                         hover:bg-white/50 backdrop-blur-sm rounded-lg transition-all duration-300
                         hover:shadow-md relative group"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-primary-700 hover:text-primary-900 hover:bg-white/50 
                       rounded-lg transition-all duration-300 hover:scale-110"
              aria-label="Buscar eventos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Link to="/crear-evento" className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-900 to-accent-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
              Publicar Evento
            </Link>
          </div>

          {/* Mobile Search & Menu buttons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Button Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-primary-700 hover:text-primary-900 hover:bg-white/50 
                       rounded-lg transition-all duration-300"
              aria-label="Buscar eventos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-primary-700 hover:bg-primary-50"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 backdrop-blur-xl bg-white/50">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-primary-700 hover:text-primary-900 
                           hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/crear-evento"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mx-4 mt-2 btn-primary text-center"
              >
                Publicar Evento
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Smart Search Panel */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-primary-900/20 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          
          {/* Search Panel */}
          <div 
            ref={searchRef}
            className="relative w-full max-w-3xl backdrop-blur-xl bg-white/95 rounded-2xl 
                     shadow-2xl border border-white/40 animate-fade-in"
          >
            {/* Search Header */}
            <div className="p-4 md:p-6 border-b border-primary-100">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Buscar eventos por nombre, descripción o ubicación..."
                  className="flex-1 text-lg font-medium text-primary-900 placeholder-primary-400 
                           bg-transparent border-none outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                              ${selectedCategory === category || (category === 'Todas' && !selectedCategory)
                                ? 'bg-gradient-to-r from-primary-900 to-accent-700 text-white shadow-lg scale-105'
                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                              }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6">
              {searchQuery || selectedCategory ? (
                searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(event.id)}
                        className="w-full flex items-start gap-4 p-4 rounded-xl 
                                 bg-gradient-to-br from-primary-50/50 to-white
                                 hover:from-primary-50 hover:to-primary-50/50
                                 border border-primary-100 hover:border-primary-300
                                 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                                 text-left group"
                      >
                        {/* Event Image */}
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0 
                                   shadow-md group-hover:shadow-xl transition-shadow"
                        />
                        
                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-primary-900 mb-1 
                                       group-hover:text-accent-700 transition-colors truncate">
                            {event.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium bg-primary-900/10 
                                         text-primary-900 rounded-full">
                              {event.category}
                            </span>
                            <span className="text-sm text-primary-600">
                              {new Date(event.date).toLocaleDateString('es-CL')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-primary-700 line-clamp-2 mb-2">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.location}
                            </span>
                            <span className="text-base md:text-lg font-bold text-accent-700">
                              ${event.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-primary-300 mb-4" fill="none" 
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-primary-600 mb-2">
                      No se encontraron eventos
                    </p>
                    <p className="text-sm text-primary-500">
                      Intenta con otros términos de búsqueda o categorías
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-primary-400 mb-4" fill="none" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-primary-700 mb-2">
                    Busca eventos increíbles
                  </p>
                  <p className="text-sm text-primary-500">
                    Escribe algo o selecciona una categoría para comenzar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
