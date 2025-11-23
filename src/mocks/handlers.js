import { http, HttpResponse, delay, graphql } from 'msw';
import eventsData from '../data/events.json';

// Simular delay de red realista (200-500ms)
const networkDelay = () => delay(Math.random() * 300 + 200);

// Handlers para REST API
export const restHandlers = [
  // GET /api/events - Obtener todos los eventos
  http.get('/api/events', async () => {
    await networkDelay();
    return HttpResponse.json({
      success: true,
      data: eventsData,
      message: 'Eventos obtenidos exitosamente'
    });
  }),

  // GET /api/events/:id - Obtener un evento por ID
  http.get('/api/events/:id', async ({ params }) => {
    await networkDelay();
    const { id } = params;
    const event = eventsData.find(e => String(e.id) === String(id));
    
    if (!event) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Evento no encontrado'
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: event
    });
  }),

  // GET /api/events/category/:category - Filtrar por categoría
  http.get('/api/events/category/:category', async ({ params }) => {
    await networkDelay();
    const { category } = params;
    const filtered = eventsData.filter(e => 
      e.category.toLowerCase() === category.toLowerCase()
    );

    return HttpResponse.json({
      success: true,
      data: filtered
    });
  }),

  // POST /api/events - Crear nuevo evento
  http.post('/api/events', async ({ request }) => {
    await networkDelay();
    const newEvent = await request.json();
    
    const eventWithId = {
      ...newEvent,
      id: String(eventsData.length + 1),
      date: newEvent.date || new Date().toISOString().split('T')[0]
    };

    return HttpResponse.json(
      {
        success: true,
        data: eventWithId,
        message: 'Evento creado exitosamente'
      },
      { status: 201 }
    );
  }),

  // GET /api/stats - Obtener estadísticas
  http.get('/api/stats', async () => {
    await networkDelay();
    
    const totalEvents = eventsData.length;
    const categories = [...new Set(eventsData.map(e => e.category))].length;
    const totalSeats = eventsData.reduce((sum, e) => sum + e.availableSeats, 0);
    const averagePrice = Math.round(
      eventsData.reduce((sum, e) => sum + e.price, 0) / eventsData.length
    );

    return HttpResponse.json({
      success: true,
      data: {
        totalEvents,
        categories,
        totalSeats,
        averagePrice
      }
    });
  }),

  // GET /api/search?q=query - Buscar eventos
  http.get('/api/search', async ({ request }) => {
    await networkDelay();
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() || '';

    const results = eventsData.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );

    return HttpResponse.json({
      success: true,
      data: results,
      count: results.length
    });
  })
];

// Handlers para GraphQL API
export const graphqlHandlers = [
  // Query: getEventDetails
  graphql.query('GetEventDetails', async ({ variables }) => {
    await networkDelay();
    const { id } = variables;
    const event = eventsData.find(e => String(e.id) === String(id));

    if (!event) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Evento no encontrado',
            extensions: { code: 'NOT_FOUND' }
          }
        ]
      });
    }

    return HttpResponse.json({
      data: {
        event
      }
    });
  }),

  // Query: searchByOrganizer
  graphql.query('SearchByOrganizer', async ({ variables }) => {
    await networkDelay();
    const { organizer } = variables;
    
    // Como no tenemos campo organizer, filtramos por title o descripción
    const results = eventsData.filter(event =>
      event.title.toLowerCase().includes(organizer.toLowerCase()) ||
      event.description.toLowerCase().includes(organizer.toLowerCase())
    );

    return HttpResponse.json({
      data: {
        events: results
      }
    });
  }),

  // Query: getAttendees
  graphql.query('GetAttendees', async ({ variables }) => {
    await networkDelay();
    const { eventId } = variables;
    const event = eventsData.find(e => String(e.id) === String(eventId));

    if (!event) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Evento no encontrado',
            extensions: { code: 'NOT_FOUND' }
          }
        ]
      });
    }

    // Simular asistentes
    const totalSeats = event.availableSeats;
    const attendeesCount = Math.floor(Math.random() * 50) + 10;

    return HttpResponse.json({
      data: {
        attendees: {
          total: attendeesCount,
          availableSeats: totalSeats,
          eventId: event.id
        }
      }
    });
  }),

  // Query: getUpcomingEvents
  graphql.query('GetUpcomingEvents', async () => {
    await networkDelay();
    const today = new Date();
    
    const upcoming = eventsData
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    return HttpResponse.json({
      data: {
        upcomingEvents: upcoming
      }
    });
  })
];

// Combinar todos los handlers
export const handlers = [...restHandlers, ...graphqlHandlers];
