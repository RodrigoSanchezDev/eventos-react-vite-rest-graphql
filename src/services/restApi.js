// REST API usando MSW (Mock Service Worker)
// En desarrollo: MSW intercepta las peticiones
// En producción: Usa datos estáticos del JSON

import eventsData from '../data/events.json';

const API_BASE_URL = '/api';
const IS_PRODUCTION = import.meta.env.PROD;

// Funciones de producción exportadas para testing
export const productionHelpers = {
  getEventsFromStatic: () => ({
    success: true,
    data: eventsData,
    count: eventsData.length
  }),

  getEventByIdFromStatic: (id) => {
    const event = eventsData.find(e => e.id === id || e.id === String(id) || e.id === parseInt(id));
    return event 
      ? { success: true, data: event }
      : { success: false, message: 'Evento no encontrado' };
  },

  getEventsByCategoryFromStatic: (category) => {
    const filtered = eventsData.filter(e => e.category === category);
    return {
      success: true,
      data: filtered,
      count: filtered.length
    };
  },

  searchEventsFromStatic: (query) => {
    const lowerQuery = query.toLowerCase();
    const results = eventsData.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery) ||
      event.category.toLowerCase().includes(lowerQuery)
    );
    return {
      success: true,
      data: results,
      count: results.length
    };
  },

  createEventFromStatic: (eventData) => {
    const newEvent = {
      ...eventData,
      id: (eventsData.length + 1).toString()
    };
    return {
      success: true,
      data: newEvent,
      message: 'Evento creado exitosamente (demo mode)'
    };
  },

  getCategoriesFromStatic: () => {
    const categories = [...new Set(eventsData.map(e => e.category))];
    return {
      success: true,
      data: categories,
      count: categories.length
    };
  },

  getStatsFromStatic: () => {
    const events = eventsData;
    const categories = [...new Set(events.map(e => e.category))];
    const totalSeats = events.reduce((sum, e) => sum + e.availableSeats, 0);
    const averagePrice = events.reduce((sum, e) => sum + e.price, 0) / events.length;

    return {
      success: true,
      data: {
        totalEvents: events.length,
        categories: categories.length,
        totalSeats,
        averagePrice: Math.round(averagePrice)
      }
    };
  }
};

export const restApi = {
  // GET: Obtener todos los eventos
  async getEvents() {
    if (IS_PRODUCTION) {
      return productionHelpers.getEventsFromStatic();
    }
    const response = await fetch(`${API_BASE_URL}/events`);
    return response.json();
  },

  // GET: Obtener evento por ID
  async getEventById(id) {
    if (IS_PRODUCTION) {
      return productionHelpers.getEventByIdFromStatic(id);
    }
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return response.json();
  },

  // GET: Filtrar eventos por categoría
  async getEventsByCategory(category) {
    if (IS_PRODUCTION) {
      return productionHelpers.getEventsByCategoryFromStatic(category);
    }
    const response = await fetch(`${API_BASE_URL}/events/category/${category}`);
    return response.json();
  },

  // GET: Buscar eventos
  async searchEvents(query) {
    if (IS_PRODUCTION) {
      return productionHelpers.searchEventsFromStatic(query);
    }
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // POST: Crear nuevo evento
  async createEvent(eventData) {
    if (IS_PRODUCTION) {
      return productionHelpers.createEventFromStatic(eventData);
    }
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },

  // GET: Obtener categorías únicas
  async getCategories() {
    if (IS_PRODUCTION) {
      return productionHelpers.getCategoriesFromStatic();
    }
    const response = await fetch(`${API_BASE_URL}/events`);
    const data = await response.json();
    
    if (data.success) {
      const categories = [...new Set(data.data.map(e => e.category))];
      return {
        success: true,
        data: categories,
        count: categories.length
      };
    }
    return data;
  },

  // GET: Estadísticas generales
  async getStats() {
    if (IS_PRODUCTION) {
      return productionHelpers.getStatsFromStatic();
    }
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  }
};
