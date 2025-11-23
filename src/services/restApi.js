// REST API usando MSW (Mock Service Worker)
// En desarrollo: MSW intercepta las peticiones
// En producción: Usa datos estáticos del JSON

import eventsData from '../data/events.json';

const API_BASE_URL = '/api';
const IS_PRODUCTION = import.meta.env.PROD;

export const restApi = {
  // GET: Obtener todos los eventos
  async getEvents() {
    if (IS_PRODUCTION) {
      return {
        success: true,
        data: eventsData.events,
        count: eventsData.events.length
      };
    }
    const response = await fetch(`${API_BASE_URL}/events`);
    return response.json();
  },

  // GET: Obtener evento por ID
  async getEventById(id) {
    if (IS_PRODUCTION) {
      const event = eventsData.events.find(e => e.id === parseInt(id));
      return event 
        ? { success: true, data: event }
        : { success: false, message: 'Evento no encontrado' };
    }
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return response.json();
  },

  // GET: Filtrar eventos por categoría
  async getEventsByCategory(category) {
    if (IS_PRODUCTION) {
      const filtered = eventsData.events.filter(e => e.category === category);
      return {
        success: true,
        data: filtered,
        count: filtered.length
      };
    }
    const response = await fetch(`${API_BASE_URL}/events/category/${category}`);
    return response.json();
  },

  // GET: Buscar eventos
  async searchEvents(query) {
    if (IS_PRODUCTION) {
      const lowerQuery = query.toLowerCase();
      const results = eventsData.events.filter(event =>
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
    }
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // POST: Crear nuevo evento
  async createEvent(eventData) {
    if (IS_PRODUCTION) {
      const newEvent = {
        ...eventData,
        id: eventsData.events.length + 1
      };
      return {
        success: true,
        data: newEvent,
        message: 'Evento creado exitosamente (demo mode)'
      };
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
      const categories = [...new Set(eventsData.events.map(e => e.category))];
      return {
        success: true,
        data: categories,
        count: categories.length
      };
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
      const events = eventsData.events;
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
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  }
};
