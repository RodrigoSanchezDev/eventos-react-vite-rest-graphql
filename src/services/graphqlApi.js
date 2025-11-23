// GraphQL API usando MSW (Mock Service Worker)
// En desarrollo: MSW intercepta las peticiones
// En producción: Usa datos estáticos del JSON

import eventsData from '../data/events.json';

const GRAPHQL_ENDPOINT = '/graphql';
const IS_PRODUCTION = import.meta.env.PROD;

// Helper para hacer queries GraphQL
async function graphqlRequest(query, variables = {}) {
  // En producción, simular respuestas GraphQL con datos estáticos
  if (IS_PRODUCTION) {
    return handleProductionQuery(query, variables);
  }
  
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  
  return response.json();
}

// Manejador de queries en producción
function handleProductionQuery(query, variables) {
  if (query.includes('GetEventDetails')) {
    const event = eventsData.events.find(e => e.id === parseInt(variables.id));
    return { data: { event: event || null } };
  }
  
  if (query.includes('SearchByOrganizer')) {
    const results = eventsData.events.filter(e => 
      e.organizer?.name?.toLowerCase().includes(variables.organizer.toLowerCase())
    );
    return { data: { events: results } };
  }
  
  if (query.includes('GetAttendees')) {
    const event = eventsData.events.find(e => e.id === parseInt(variables.eventId));
    return {
      data: {
        attendees: {
          total: event ? event.confirmedAttendees : 0,
          availableSeats: event ? event.availableSeats : 0,
          eventId: variables.eventId
        }
      }
    };
  }
  
  if (query.includes('GetUpcomingEvents')) {
    const today = new Date();
    const upcoming = eventsData.events
      .filter(e => new Date(e.date) >= today)
      .slice(0, 5);
    return { data: { upcomingEvents: upcoming } };
  }
  
  return { data: null };
}

// Queries predefinidos
export const graphqlQueries = {
  GET_EVENT_DETAILS: `
    query GetEventDetails($id: ID!) {
      event(id: $id) {
        id
        title
        date
        time
        location
        category
        description
        fullDescription
        price
        availableSeats
        confirmedAttendees
        organizer {
          name
          email
          phone
          website
        }
        rating
        reviewsCount
        tags
        requirements
      }
    }
  `,

  SEARCH_BY_ORGANIZER: `
    query SearchByOrganizer($organizer: String!) {
      events(organizer: $organizer) {
        id
        title
        date
        location
        organizer {
          name
          email
        }
      }
    }
  `,

  GET_ATTENDEES: `
    query GetAttendees($eventId: ID!) {
      attendees(eventId: $eventId) {
        total
        availableSeats
        eventId
      }
    }
  `,

  GET_UPCOMING: `
    query GetUpcomingEvents {
      upcomingEvents {
        id
        title
        date
        time
        location
        category
      }
    }
  `
};

// API exportada
export const graphqlApi = {
  async query(queryString, variables) {
    return graphqlRequest(queryString, variables);
  },

  // Métodos de conveniencia
  async getEventDetails(id) {
    return graphqlRequest(graphqlQueries.GET_EVENT_DETAILS, { id });
  },

  async searchByOrganizer(organizer) {
    return graphqlRequest(graphqlQueries.SEARCH_BY_ORGANIZER, { organizer });
  },

  async getAttendees(eventId) {
    return graphqlRequest(graphqlQueries.GET_ATTENDEES, { eventId });
  },

  async getUpcomingEvents() {
    return graphqlRequest(graphqlQueries.GET_UPCOMING);
  }
};
