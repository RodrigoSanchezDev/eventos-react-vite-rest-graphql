// REST API usando MSW (Mock Service Worker)
// Las peticiones son interceptadas por MSW y devuelven datos mockeados

const API_BASE_URL = '/api';

export const restApi = {
  // GET: Obtener todos los eventos
  async getEvents() {
    const response = await fetch(`${API_BASE_URL}/events`);
    return response.json();
  },

  // GET: Obtener evento por ID
  async getEventById(id) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return response.json();
  },

  // GET: Filtrar eventos por categoría
  async getEventsByCategory(category) {
    const response = await fetch(`${API_BASE_URL}/events/category/${category}`);
    return response.json();
  },

  // GET: Buscar eventos
  async searchEvents(query) {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // POST: Crear nuevo evento
  async createEvent(eventData) {
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
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  }
};
