import { useState, useEffect } from 'react';
import { restApi } from '../services/restApi';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, price, title

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsResponse, categoriesResponse] = await Promise.all([
        restApi.getEvents(),
        restApi.getCategories()
      ]);

      if (eventsResponse.success) {
        setEvents(eventsResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price':
          return a.price - b.price;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, selectedCategory, searchQuery, sortBy]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await restApi.searchEvents(searchQuery);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('date');
    loadData();
  };

  if (loading && events.length === 0) {
    return <LoadingSpinner text="Cargando eventos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={loadData} />;
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
            Todos los Eventos
          </h1>
          <p className="text-lg text-primary-600">
            Explora {events.length} eventos disponibles
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar eventos por nombre, ubicación o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 pr-24"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-900 
                         text-white text-sm font-medium rounded-lg hover:bg-primary-800 
                         transition-colors duration-200"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="date">Fecha</option>
                <option value="price">Precio</option>
                <option value="title">Nombre</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full btn-secondary"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Active Filters Info */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-primary-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-primary-600">Filtros activos:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-900 
                               text-sm font-medium rounded-full">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-900 
                               text-sm font-medium rounded-full">
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No se encontraron eventos"
            description="Intenta cambiar los filtros o términos de búsqueda"
            action={resetFilters}
            actionLabel="Ver todos los eventos"
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-primary-600">
              Mostrando {filteredEvents.length} de {events.length} eventos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;
