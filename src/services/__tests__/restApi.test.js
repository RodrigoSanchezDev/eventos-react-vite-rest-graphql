import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { restApi, productionHelpers } from '../restApi'

describe('restApi', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn()
    globalThis.fetch = fetchMock
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getEvents', () => {
    it('retorna datos de eventos correctamente en desarrollo', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: '1', title: 'Test Event' }],
        count: 1
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEvents()
      
      expect(fetchMock).toHaveBeenCalledWith('/api/events')
      expect(result.success).toBe(true)
    })

    it('retorna array vacío cuando no hay eventos', async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEvents()
      
      expect(result.data).toEqual([])
      expect(result.count).toBe(0)
    })

    it('retorna múltiples eventos correctamente', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: '1', title: 'Event 1' },
          { id: '2', title: 'Event 2' },
          { id: '3', title: 'Event 3' }
        ],
        count: 3
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEvents()
      
      expect(result.data).toHaveLength(3)
      expect(result.count).toBe(3)
    })
  })

  describe('getEventById', () => {
    it('retorna un evento específico por ID', async () => {
      const mockResponse = {
        success: true,
        data: { id: '1', title: 'Test Event' }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventById('1')
      
      expect(fetchMock).toHaveBeenCalledWith('/api/events/1')
      expect(result.success).toBe(true)
    })

    it('retorna evento con ID numérico', async () => {
      const mockResponse = {
        success: true,
        data: { id: 5, title: 'Event 5' }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventById(5)
      
      expect(fetchMock).toHaveBeenCalledWith('/api/events/5')
      expect(result.success).toBe(true)
    })

    it('retorna error cuando evento no existe', async () => {
      const mockResponse = {
        success: false,
        message: 'Evento no encontrado'
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventById('999')
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Evento no encontrado')
    })

    it('retorna todos los campos del evento', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          title: 'Complete Event',
          date: '2025-12-15',
          location: 'Santiago',
          category: 'Conferencia',
          price: 50000,
          availableSeats: 100
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventById('1')
      
      expect(result.data).toHaveProperty('title')
      expect(result.data).toHaveProperty('date')
      expect(result.data).toHaveProperty('location')
      expect(result.data).toHaveProperty('category')
      expect(result.data).toHaveProperty('price')
    })
  })

  describe('getEventsByCategory', () => {
    it('retorna eventos filtrados por categoría', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: '1', title: 'Test Event', category: 'Conferencia' }],
        count: 1
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventsByCategory('Conferencia')
      
      expect(fetchMock).toHaveBeenCalledWith('/api/events/category/Conferencia')
      expect(result.success).toBe(true)
    })

    it('retorna array vacío para categoría sin eventos', async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventsByCategory('NoExiste')
      
      expect(result.data).toEqual([])
    })

    it('filtra múltiples categorías correctamente', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: '1', category: 'Taller' },
          { id: '2', category: 'Taller' }
        ],
        count: 2
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getEventsByCategory('Taller')
      
      expect(result.data).toHaveLength(2)
      result.data.forEach(event => {
        expect(event.category).toBe('Taller')
      })
    })
  })

  describe('searchEvents', () => {
    it('busca eventos por query', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: '1', title: 'Tech Event' }],
        count: 1
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.searchEvents('Tech')
      
      expect(fetchMock).toHaveBeenCalledWith('/api/search?q=Tech')
      expect(result.success).toBe(true)
    })

    it('codifica caracteres especiales en la búsqueda', async () => {
      const mockResponse = { success: true, data: [], count: 0 }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await restApi.searchEvents('Tech & Music')
      
      expect(fetchMock).toHaveBeenCalledWith('/api/search?q=Tech%20%26%20Music')
    })

    it('busca eventos por ubicación', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: '1', title: 'Event', location: 'Santiago' }],
        count: 1
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.searchEvents('Santiago')
      
      expect(result.data[0].location).toBe('Santiago')
    })

    it('retorna array vacío cuando no hay resultados', async () => {
      const mockResponse = {
        success: true,
        data: [],
        count: 0
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.searchEvents('xyz123noexiste')
      
      expect(result.data).toEqual([])
      expect(result.count).toBe(0)
    })

    it('codifica espacios en la búsqueda', async () => {
      const mockResponse = { success: true, data: [], count: 0 }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      await restApi.searchEvents('evento importante')
      
      expect(fetchMock).toHaveBeenCalledWith('/api/search?q=evento%20importante')
    })
  })

  describe('createEvent', () => {
    it('crea un nuevo evento con POST', async () => {
      const newEvent = {
        title: 'Nuevo Evento',
        date: '2025-12-20',
        location: 'Santiago'
      }
      
      const mockResponse = {
        success: true,
        data: { ...newEvent, id: '10' },
        message: 'Evento creado exitosamente'
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.createEvent(newEvent)
      
      expect(fetchMock).toHaveBeenCalledWith('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      })
      expect(result.success).toBe(true)
    })

    it('crea evento con todos los campos', async () => {
      const fullEvent = {
        title: 'Evento Completo',
        date: '2025-12-25',
        time: '19:00',
        location: 'Centro de Convenciones',
        category: 'Conferencia',
        description: 'Un evento increíble',
        price: 75000,
        availableSeats: 200
      }
      
      const mockResponse = {
        success: true,
        data: { ...fullEvent, id: '11' },
        message: 'Evento creado exitosamente'
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.createEvent(fullEvent)
      
      expect(result.data.title).toBe('Evento Completo')
      expect(result.data.id).toBe('11')
    })

    it('retorna ID del evento creado', async () => {
      const newEvent = { title: 'Test' }
      
      const mockResponse = {
        success: true,
        data: { ...newEvent, id: '15' },
        message: 'Creado'
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.createEvent(newEvent)
      
      expect(result.data.id).toBeDefined()
    })
  })

  describe('getCategories', () => {
    it('obtiene las categorías únicas', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: '1', category: 'Conferencia' },
          { id: '2', category: 'Taller' },
          { id: '3', category: 'Conferencia' }
        ]
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getCategories()
      
      expect(fetchMock).toHaveBeenCalledWith('/api/events')
      expect(result.success).toBe(true)
      expect(result.data).toContain('Conferencia')
      expect(result.data).toContain('Taller')
    })

    it('retorna categorías sin duplicados', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: '1', category: 'Taller' },
          { id: '2', category: 'Taller' },
          { id: '3', category: 'Taller' }
        ]
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getCategories()
      
      // Verificar que solo hay una instancia de 'Taller'
      const tallerCount = result.data.filter(c => c === 'Taller').length
      expect(tallerCount).toBe(1)
    })

    it('retorna datos cuando success es false', async () => {
      const mockResponse = {
        success: false,
        message: 'Error al obtener eventos'
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getCategories()
      
      expect(result.success).toBe(false)
    })

    it('retorna array vacío cuando no hay eventos', async () => {
      const mockResponse = {
        success: true,
        data: []
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getCategories()
      
      expect(result.data).toEqual([])
    })
  })

  describe('getStats', () => {
    it('obtiene estadísticas generales', async () => {
      const mockResponse = {
        success: true,
        data: {
          totalEvents: 10,
          categories: 4,
          totalSeats: 1500,
          averagePrice: 35000
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getStats()
      
      expect(fetchMock).toHaveBeenCalledWith('/api/stats')
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('totalEvents')
      expect(result.data).toHaveProperty('categories')
    })

    it('retorna todas las propiedades de estadísticas', async () => {
      const mockResponse = {
        success: true,
        data: {
          totalEvents: 5,
          categories: 3,
          totalSeats: 500,
          averagePrice: 25000
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getStats()
      
      expect(result.data).toHaveProperty('totalEvents', 5)
      expect(result.data).toHaveProperty('categories', 3)
      expect(result.data).toHaveProperty('totalSeats', 500)
      expect(result.data).toHaveProperty('averagePrice', 25000)
    })

    it('maneja estadísticas con valores cero', async () => {
      const mockResponse = {
        success: true,
        data: {
          totalEvents: 0,
          categories: 0,
          totalSeats: 0,
          averagePrice: 0
        }
      }
      
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })
      
      const result = await restApi.getStats()
      
      expect(result.data.totalEvents).toBe(0)
    })
  })

  describe('manejo de errores', () => {
    it('getEvents maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.getEvents()).rejects.toThrow('Network error')
    })

    it('getEventById maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.getEventById('1')).rejects.toThrow('Network error')
    })

    it('searchEvents maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.searchEvents('test')).rejects.toThrow('Network error')
    })

    it('createEvent maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.createEvent({ title: 'Test' })).rejects.toThrow('Network error')
    })

    it('getCategories maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.getCategories()).rejects.toThrow('Network error')
    })

    it('getStats maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.getStats()).rejects.toThrow('Network error')
    })

    it('getEventsByCategory maneja errores de red', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      
      await expect(restApi.getEventsByCategory('Taller')).rejects.toThrow('Network error')
    })
  })
})

// Tests para productionHelpers - funciones de lógica de producción
describe('productionHelpers', () => {
  describe('getEventsFromStatic', () => {
    it('retorna todos los eventos con estructura correcta', () => {
      const result = productionHelpers.getEventsFromStatic()
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('count')
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.count).toBe(result.data.length)
    })

    it('los eventos tienen propiedades requeridas', () => {
      const result = productionHelpers.getEventsFromStatic()
      
      if (result.data.length > 0) {
        const event = result.data[0]
        expect(event).toHaveProperty('id')
        expect(event).toHaveProperty('title')
      }
    })
  })

  describe('getEventByIdFromStatic', () => {
    it('encuentra evento por ID numérico', () => {
      const result = productionHelpers.getEventByIdFromStatic(1)
      
      // IDs en events.json son strings, así que parseInt los convierte
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
    })

    it('encuentra evento por ID string', () => {
      const result = productionHelpers.getEventByIdFromStatic('1')
      
      expect(result).toHaveProperty('success')
    })

    it('retorna error para ID inexistente', () => {
      const result = productionHelpers.getEventByIdFromStatic(99999)
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Evento no encontrado')
    })

    it('maneja ID undefined', () => {
      const result = productionHelpers.getEventByIdFromStatic(undefined)
      
      expect(result.success).toBe(false)
    })
  })

  describe('getEventsByCategoryFromStatic', () => {
    it('filtra eventos por categoría', () => {
      const result = productionHelpers.getEventsByCategoryFromStatic('Conferencia')
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('retorna array vacío para categoría inexistente', () => {
      const result = productionHelpers.getEventsByCategoryFromStatic('CategoriaQueNoExiste123')
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
      expect(result.count).toBe(0)
    })

    it('todos los eventos filtrados pertenecen a la categoría', () => {
      const result = productionHelpers.getEventsByCategoryFromStatic('Taller')
      
      result.data.forEach(event => {
        expect(event.category).toBe('Taller')
      })
    })
  })

  describe('searchEventsFromStatic', () => {
    it('busca eventos por título', () => {
      const allEvents = productionHelpers.getEventsFromStatic()
      if (allEvents.data.length > 0) {
        const searchTerm = allEvents.data[0].title.substring(0, 5)
        const result = productionHelpers.searchEventsFromStatic(searchTerm)
        
        expect(result).toHaveProperty('success', true)
        expect(result).toHaveProperty('data')
      }
    })

    it('busca eventos por descripción', () => {
      const allEvents = productionHelpers.getEventsFromStatic()
      if (allEvents.data.length > 0 && allEvents.data[0].description) {
        const searchTerm = allEvents.data[0].description.substring(0, 5)
        const result = productionHelpers.searchEventsFromStatic(searchTerm)
        
        expect(result.success).toBe(true)
      }
    })

    it('retorna array vacío para búsqueda sin resultados', () => {
      const result = productionHelpers.searchEventsFromStatic('xyznoexiste123abc')
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it('búsqueda es case-insensitive', () => {
      const result1 = productionHelpers.searchEventsFromStatic('TECH')
      const result2 = productionHelpers.searchEventsFromStatic('tech')
      
      expect(result1.data.length).toBe(result2.data.length)
    })
  })

  describe('createEventFromStatic', () => {
    it('crea evento con datos proporcionados', () => {
      const eventData = {
        title: 'Nuevo Evento Test',
        description: 'Descripción del evento',
        date: '2025-12-01',
        location: 'Test Location',
        price: 100
      }
      
      const result = productionHelpers.createEventFromStatic(eventData)
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
      expect(result.data.title).toBe(eventData.title)
      expect(result.data.description).toBe(eventData.description)
    })

    it('evento creado tiene ID asignado', () => {
      const eventData = { title: 'Test', description: 'Test' }
      const result = productionHelpers.createEventFromStatic(eventData)
      
      expect(result.data).toHaveProperty('id')
      expect(result.data.id).toBeDefined()
    })

    it('evento creado tiene mensaje de éxito', () => {
      const eventData = { title: 'Test' }
      const result = productionHelpers.createEventFromStatic(eventData)
      
      expect(result).toHaveProperty('message')
      expect(result.message).toContain('demo mode')
    })
  })

  describe('getCategoriesFromStatic', () => {
    it('retorna lista de categorías', () => {
      const result = productionHelpers.getCategoriesFromStatic()
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('categorías son strings', () => {
      const result = productionHelpers.getCategoriesFromStatic()
      
      result.data.forEach(category => {
        expect(typeof category).toBe('string')
      })
    })

    it('no hay categorías duplicadas', () => {
      const result = productionHelpers.getCategoriesFromStatic()
      const uniqueSet = new Set(result.data)
      
      expect(uniqueSet.size).toBe(result.data.length)
    })
  })

  describe('getStatsFromStatic', () => {
    it('retorna estadísticas con estructura correcta', () => {
      const result = productionHelpers.getStatsFromStatic()
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
    })

    it('estadísticas incluyen totalEvents', () => {
      const result = productionHelpers.getStatsFromStatic()
      
      expect(result.data).toHaveProperty('totalEvents')
      expect(typeof result.data.totalEvents).toBe('number')
    })

    it('estadísticas incluyen categories', () => {
      const result = productionHelpers.getStatsFromStatic()
      
      expect(result.data).toHaveProperty('categories')
      expect(typeof result.data.categories).toBe('number')
    })

    it('totalEvents coincide con getEventsFromStatic', () => {
      const stats = productionHelpers.getStatsFromStatic()
      const events = productionHelpers.getEventsFromStatic()
      
      expect(stats.data.totalEvents).toBe(events.count)
    })

    it('estadísticas incluyen totalSeats', () => {
      const result = productionHelpers.getStatsFromStatic()
      
      expect(result.data).toHaveProperty('totalSeats')
      expect(typeof result.data.totalSeats).toBe('number')
    })

    it('estadísticas incluyen averagePrice', () => {
      const result = productionHelpers.getStatsFromStatic()
      
      expect(result.data).toHaveProperty('averagePrice')
      expect(typeof result.data.averagePrice).toBe('number')
    })
  })
})
