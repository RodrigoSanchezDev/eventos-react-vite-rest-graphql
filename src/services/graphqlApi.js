// GraphQL API usando MSW (Mock Service Worker)
// Las peticiones GraphQL son interceptadas por MSW

const GRAPHQL_ENDPOINT = '/graphql';

// Helper para hacer queries GraphQL
async function graphqlRequest(query, variables = {}) {
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
