import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { graphqlApi, graphqlQueries, handleProductionQuery } from '../graphqlApi'

describe('graphqlApi', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn()
    globalThis.fetch = fetchMock
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('query', () => {
    it('envía query GraphQL con método POST', async () => {
      const mockResponse = {
        data: { events: [] }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const query = `query { events { id title } }`
      await graphqlApi.query(query)
      
      expect(fetchMock).toHaveBeenCalledWith('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {}
        })
      })
    })

    it('incluye variables en la petición', async () => {
      const mockResponse = { data: { event: null } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const query = `query GetEvent($id: ID!) { event(id: $id) { id } }`
      const variables = { id: '1' }
      
      await graphqlApi.query(query, variables)
      
      expect(fetchMock).toHaveBeenCalledWith('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables
        })
      })
    })

    it('retorna datos correctamente', async () => {
      const mockResponse = {
        data: { events: [{ id: '1', title: 'Test' }] }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.query('{ events { id title } }')
      
      expect(result.data.events).toHaveLength(1)
    })

    it('maneja variables complejas', async () => {
      const mockResponse = { data: { event: { id: '1' } } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const query = `query GetEvent($id: ID!, $includeDetails: Boolean) { event(id: $id) { id } }`
      const variables = { id: '1', includeDetails: true }
      
      await graphqlApi.query(query, variables)
      
      const calledBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(calledBody.variables.id).toBe('1')
      expect(calledBody.variables.includeDetails).toBe(true)
    })
  })

  describe('getEventDetails', () => {
    it('obtiene detalles de un evento específico', async () => {
      const mockResponse = {
        data: {
          event: {
            id: '1',
            title: 'Tech Summit',
            date: '2025-12-15',
            location: 'Santiago'
          }
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getEventDetails('1')
      
      expect(result.data.event.id).toBe('1')
      expect(result.data.event.title).toBe('Tech Summit')
    })

    it('usa la query predefinida GET_EVENT_DETAILS', async () => {
      const mockResponse = { data: { event: null } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await graphqlApi.getEventDetails('1')
      
      const calledBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(calledBody.query).toContain('GetEventDetails')
      expect(calledBody.variables.id).toBe('1')
    })

    it('retorna null cuando evento no existe', async () => {
      const mockResponse = { data: { event: null } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getEventDetails('999')
      
      expect(result.data.event).toBeNull()
    })

    it('retorna todos los campos del evento', async () => {
      const mockResponse = {
        data: {
          event: {
            id: '1',
            title: 'Complete Event',
            date: '2025-12-15',
            time: '19:00',
            location: 'Centro',
            category: 'Conferencia',
            description: 'Descripción',
            fullDescription: 'Descripción completa',
            price: 50000,
            availableSeats: 100,
            confirmedAttendees: 50,
            organizer: {
              name: 'Org',
              email: 'org@test.com',
              phone: '123456',
              website: 'http://test.com'
            },
            rating: 4.5,
            reviewsCount: 10,
            tags: ['tech'],
            requirements: ['laptop']
          }
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getEventDetails('1')
      
      expect(result.data.event).toHaveProperty('organizer')
      expect(result.data.event).toHaveProperty('rating')
      expect(result.data.event).toHaveProperty('tags')
    })

    it('funciona con ID numérico', async () => {
      const mockResponse = { data: { event: { id: '5' } } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await graphqlApi.getEventDetails(5)
      
      const calledBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(calledBody.variables.id).toBe(5)
    })
  })

  describe('searchByOrganizer', () => {
    it('busca eventos por organizador', async () => {
      const mockResponse = {
        data: {
          events: [
            { id: '1', title: 'Event 1', organizer: { name: 'Tech Corp' } }
          ]
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.searchByOrganizer('Tech Corp')
      
      expect(result.data.events).toHaveLength(1)
    })

    it('usa la query SEARCH_BY_ORGANIZER', async () => {
      const mockResponse = { data: { events: [] } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await graphqlApi.searchByOrganizer('Test Org')
      
      const calledBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(calledBody.query).toContain('SearchByOrganizer')
      expect(calledBody.variables.organizer).toBe('Test Org')
    })

    it('retorna array vacío cuando no hay resultados', async () => {
      const mockResponse = { data: { events: [] } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.searchByOrganizer('NoExiste')
      
      expect(result.data.events).toEqual([])
    })

    it('retorna múltiples eventos del mismo organizador', async () => {
      const mockResponse = {
        data: {
          events: [
            { id: '1', organizer: { name: 'Org' } },
            { id: '2', organizer: { name: 'Org' } },
            { id: '3', organizer: { name: 'Org' } }
          ]
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.searchByOrganizer('Org')
      
      expect(result.data.events).toHaveLength(3)
    })
  })

  describe('getAttendees', () => {
    it('obtiene información de asistentes', async () => {
      const mockResponse = {
        data: {
          attendees: {
            total: 50,
            availableSeats: 100,
            eventId: '1'
          }
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getAttendees('1')
      
      expect(result.data.attendees.total).toBe(50)
      expect(result.data.attendees.availableSeats).toBe(100)
    })

    it('usa la query GET_ATTENDEES', async () => {
      const mockResponse = { data: { attendees: { total: 0, availableSeats: 0, eventId: '1' } } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await graphqlApi.getAttendees('1')
      
      const calledBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(calledBody.query).toContain('GetAttendees')
      expect(calledBody.variables.eventId).toBe('1')
    })

    it('retorna cero cuando no hay asistentes', async () => {
      const mockResponse = {
        data: {
          attendees: {
            total: 0,
            availableSeats: 200,
            eventId: '5'
          }
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getAttendees('5')
      
      expect(result.data.attendees.total).toBe(0)
    })

    it('incluye eventId en la respuesta', async () => {
      const mockResponse = {
        data: {
          attendees: {
            total: 10,
            availableSeats: 90,
            eventId: '3'
          }
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getAttendees('3')
      
      expect(result.data.attendees.eventId).toBe('3')
    })
  })

  describe('getUpcomingEvents', () => {
    it('obtiene eventos próximos', async () => {
      const mockResponse = {
        data: {
          upcomingEvents: [
            { id: '1', title: 'Upcoming Event 1' },
            { id: '2', title: 'Upcoming Event 2' }
          ]
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getUpcomingEvents()
      
      expect(result.data.upcomingEvents).toHaveLength(2)
    })

    it('usa la query GET_UPCOMING', async () => {
      const mockResponse = { data: { upcomingEvents: [] } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await graphqlApi.getUpcomingEvents()
      
      const calledBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      expect(calledBody.query).toContain('GetUpcomingEvents')
    })

    it('retorna array vacío cuando no hay eventos próximos', async () => {
      const mockResponse = { data: { upcomingEvents: [] } }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getUpcomingEvents()
      
      expect(result.data.upcomingEvents).toEqual([])
    })

    it('retorna eventos con campos correctos', async () => {
      const mockResponse = {
        data: {
          upcomingEvents: [
            {
              id: '1',
              title: 'Event',
              date: '2025-12-20',
              time: '18:00',
              location: 'Santiago',
              category: 'Conferencia'
            }
          ]
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getUpcomingEvents()
      
      expect(result.data.upcomingEvents[0]).toHaveProperty('id')
      expect(result.data.upcomingEvents[0]).toHaveProperty('title')
      expect(result.data.upcomingEvents[0]).toHaveProperty('date')
      expect(result.data.upcomingEvents[0]).toHaveProperty('location')
    })
  })

  describe('graphqlQueries', () => {
    it('tiene la query GET_EVENT_DETAILS definida', () => {
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('GetEventDetails')
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('event(id: $id)')
    })

    it('tiene la query SEARCH_BY_ORGANIZER definida', () => {
      expect(graphqlQueries.SEARCH_BY_ORGANIZER).toContain('SearchByOrganizer')
      expect(graphqlQueries.SEARCH_BY_ORGANIZER).toContain('organizer')
    })

    it('tiene la query GET_ATTENDEES definida', () => {
      expect(graphqlQueries.GET_ATTENDEES).toContain('GetAttendees')
      expect(graphqlQueries.GET_ATTENDEES).toContain('eventId')
    })

    it('tiene la query GET_UPCOMING definida', () => {
      expect(graphqlQueries.GET_UPCOMING).toContain('GetUpcomingEvents')
      expect(graphqlQueries.GET_UPCOMING).toContain('upcomingEvents')
    })

    it('GET_EVENT_DETAILS incluye campos de organizador', () => {
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('organizer')
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('name')
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('email')
    })

    it('GET_EVENT_DETAILS incluye campos de rating', () => {
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('rating')
      expect(graphqlQueries.GET_EVENT_DETAILS).toContain('reviewsCount')
    })

    it('GET_UPCOMING incluye campos básicos', () => {
      expect(graphqlQueries.GET_UPCOMING).toContain('id')
      expect(graphqlQueries.GET_UPCOMING).toContain('title')
      expect(graphqlQueries.GET_UPCOMING).toContain('date')
    })
  })

  describe('manejo de errores', () => {
    it('query maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(graphqlApi.query('{ events { id } }')).rejects.toThrow('Network error')
    })

    it('getEventDetails maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(graphqlApi.getEventDetails('1')).rejects.toThrow('Network error')
    })

    it('searchByOrganizer maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(graphqlApi.searchByOrganizer('Tech')).rejects.toThrow('Network error')
    })

    it('getAttendees maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(graphqlApi.getAttendees('1')).rejects.toThrow('Network error')
    })

    it('getUpcomingEvents maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(graphqlApi.getUpcomingEvents()).rejects.toThrow('Network error')
    })
  })

  describe('respuestas GraphQL con errores', () => {
    it('retorna errores de GraphQL correctamente', async () => {
      const mockResponse = {
        data: null,
        errors: [{ message: 'Event not found' }]
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getEventDetails('invalid')
      
      expect(result.errors).toBeDefined()
      expect(result.errors[0].message).toBe('Event not found')
    })

    it('maneja múltiples errores GraphQL', async () => {
      const mockResponse = {
        data: null,
        errors: [
          { message: 'Error 1' },
          { message: 'Error 2' }
        ]
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.query('{ invalid }')
      
      expect(result.errors).toHaveLength(2)
    })

    it('retorna datos parciales con errores', async () => {
      const mockResponse = {
        data: { event: { id: '1' } },
        errors: [{ message: 'Partial error' }]
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await graphqlApi.getEventDetails('1')
      
      expect(result.data).toBeDefined()
      expect(result.errors).toBeDefined()
    })
  })
})

// Tests para handleProductionQuery - función de lógica de producción GraphQL
describe('handleProductionQuery', () => {
  describe('GetEventDetails query', () => {
    it('retorna evento por ID numérico', () => {
      const query = 'query GetEventDetails($id: ID!) { event(id: $id) { id title } }'
      const variables = { id: 1 }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result).toHaveProperty('data')
      expect(result.data).toHaveProperty('event')
    })

    it('retorna evento por ID string', () => {
      const query = 'query GetEventDetails { event { id } }'
      const variables = { id: '1' }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toHaveProperty('event')
    })

    it('retorna null para evento inexistente', () => {
      const query = 'query GetEventDetails { event { id } }'
      const variables = { id: 99999 }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data.event).toBeNull()
    })

    it('maneja ID como string numérico', () => {
      const query = 'query GetEventDetails { event { id } }'
      const variables = { id: '1' }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toHaveProperty('event')
    })
  })

  describe('SearchByOrganizer query', () => {
    it('busca eventos por organizador', () => {
      const query = 'query SearchByOrganizer($organizer: String!) { events { id } }'
      const variables = { organizer: 'Tech' }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result).toHaveProperty('data')
      expect(result.data).toHaveProperty('events')
      expect(Array.isArray(result.data.events)).toBe(true)
    })

    it('búsqueda de organizador es case-insensitive', () => {
      const query = 'query SearchByOrganizer { events { id } }'
      const variables1 = { organizer: 'TECH' }
      const variables2 = { organizer: 'tech' }
      
      const result1 = handleProductionQuery(query, variables1)
      const result2 = handleProductionQuery(query, variables2)
      
      expect(result1.data.events.length).toBe(result2.data.events.length)
    })

    it('retorna array vacío para organizador inexistente', () => {
      const query = 'query SearchByOrganizer { events { id } }'
      const variables = { organizer: 'OrganizadorQueNoExiste12345' }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data.events).toEqual([])
    })
  })

  describe('GetAttendees query', () => {
    it('retorna información de asistentes para evento existente', () => {
      const query = 'query GetAttendees($eventId: ID!) { attendees { total } }'
      const variables = { eventId: 1 }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toHaveProperty('attendees')
      expect(result.data.attendees).toHaveProperty('total')
      expect(result.data.attendees).toHaveProperty('availableSeats')
      expect(result.data.attendees).toHaveProperty('eventId')
    })

    it('retorna 0 asistentes para evento inexistente', () => {
      const query = 'query GetAttendees { attendees { total } }'
      const variables = { eventId: 99999 }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data.attendees.total).toBe(0)
      expect(result.data.attendees.availableSeats).toBe(0)
    })

    it('acepta eventId como string', () => {
      const query = 'query GetAttendees { attendees { total } }'
      const variables = { eventId: '1' }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data.attendees).toHaveProperty('eventId', '1')
    })
  })

  describe('GetUpcomingEvents query', () => {
    it('retorna lista de eventos próximos', () => {
      const query = 'query GetUpcomingEvents { upcomingEvents { id } }'
      const variables = {}
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toHaveProperty('upcomingEvents')
      expect(Array.isArray(result.data.upcomingEvents)).toBe(true)
    })

    it('limita resultados a 5 eventos', () => {
      const query = 'query GetUpcomingEvents { upcomingEvents { id } }'
      const variables = {}
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data.upcomingEvents.length).toBeLessThanOrEqual(5)
    })

    it('eventos próximos tienen fecha futura', () => {
      const query = 'query GetUpcomingEvents { upcomingEvents { id date } }'
      const variables = {}
      
      const result = handleProductionQuery(query, variables)
      const today = new Date()
      
      result.data.upcomingEvents.forEach(event => {
        if (event.date) {
          expect(new Date(event.date) >= today).toBe(true)
        }
      })
    })
  })

  describe('Unknown queries', () => {
    it('retorna data null para query no reconocida', () => {
      const query = 'query UnknownQuery { unknown { field } }'
      const variables = {}
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toBeNull()
    })

    it('maneja query vacía', () => {
      const result = handleProductionQuery('', {})
      
      expect(result.data).toBeNull()
    })

    it('maneja query con solo espacios', () => {
      const result = handleProductionQuery('   ', {})
      
      expect(result.data).toBeNull()
    })
  })

  describe('Query matching', () => {
    it('detecta GetEventDetails en cualquier parte del query', () => {
      const query = '# Comment\nquery GetEventDetails { event { id } }'
      const variables = { id: 1 }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toHaveProperty('event')
    })

    it('detecta SearchByOrganizer en query compleja', () => {
      const query = `
        query SearchByOrganizer($organizer: String!) {
          events(organizer: $organizer) {
            id
            title
            organizer { name }
          }
        }
      `
      const variables = { organizer: 'test' }
      
      const result = handleProductionQuery(query, variables)
      
      expect(result.data).toHaveProperty('events')
    })
  })
})
