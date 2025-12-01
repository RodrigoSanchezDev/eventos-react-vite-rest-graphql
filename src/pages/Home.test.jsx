import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../test/test-utils'
import Home from './Home'
import { restApi } from '../services/restApi'

// Mock de restApi
vi.mock('../services/restApi', () => ({
  restApi: {
    getEvents: vi.fn(),
    getStats: vi.fn()
  }
}))

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra loading spinner mientras carga', () => {
    // Configurar mock que nunca resuelve para mantener el estado de loading
    restApi.getEvents.mockReturnValue(new Promise(() => {}))
    restApi.getStats.mockReturnValue(new Promise(() => {}))
    
    render(<Home />)
    
    expect(screen.getByText('Cargando eventos destacados...')).toBeInTheDocument()
  })

  it('renderiza el contenido principal después de cargar', async () => {
    restApi.getEvents.mockResolvedValue({
      success: true,
      data: [
        { id: '1', title: 'Test Event', date: '2025-12-15', price: 10000, category: 'Conferencia', location: 'Santiago' }
      ]
    })
    restApi.getStats.mockResolvedValue({
      success: true,
      data: {
        totalEvents: 10,
        categories: 4,
        totalSeats: 1500,
        averagePrice: 35000
      }
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Descubre experiencias/)).toBeInTheDocument()
    })
  })

  it('muestra el título del hero section', async () => {
    restApi.getEvents.mockResolvedValue({ success: true, data: [] })
    restApi.getStats.mockResolvedValue({ 
      success: true, 
      data: { totalEvents: 10, categories: 4, totalSeats: 1500, averagePrice: 35000 } 
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/inspiran/)).toBeInTheDocument()
    })
  })

  it('muestra el enlace para explorar eventos', async () => {
    restApi.getEvents.mockResolvedValue({ success: true, data: [] })
    restApi.getStats.mockResolvedValue({ 
      success: true, 
      data: { totalEvents: 10, categories: 4, totalSeats: 1500, averagePrice: 35000 } 
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(/Explorar Eventos/)).toBeInTheDocument()
    })
  })

  it('muestra mensaje de error cuando falla la carga', async () => {
    restApi.getEvents.mockRejectedValue(new Error('Network error'))
    restApi.getStats.mockRejectedValue(new Error('Network error'))
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
    })
  })

  it('renderiza eventos destacados', async () => {
    restApi.getEvents.mockResolvedValue({
      success: true,
      data: [
        { id: '1', title: 'Tech Summit 2025', date: '2025-12-15', price: 45000, category: 'Conferencia', location: 'Santiago', image: 'test.jpg' },
        { id: '2', title: 'Music Festival', date: '2025-12-20', price: 30000, category: 'Concierto', location: 'Valparaíso', image: 'test2.jpg' }
      ]
    })
    restApi.getStats.mockResolvedValue({ 
      success: true, 
      data: { totalEvents: 2, categories: 2, totalSeats: 300, averagePrice: 37500 } 
    })
    
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Tech Summit 2025')).toBeInTheDocument()
    })
  })

  it('limita los eventos destacados a 6', async () => {
    const events = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      title: `Event ${i + 1}`,
      date: '2025-12-15',
      price: 10000,
      category: 'Conferencia',
      location: 'Santiago',
      image: 'test.jpg'
    }))
    
    restApi.getEvents.mockResolvedValue({ success: true, data: events })
    restApi.getStats.mockResolvedValue({ 
      success: true, 
      data: { totalEvents: 10, categories: 1, totalSeats: 1000, averagePrice: 10000 } 
    })
    
    render(<Home />)
    
    await waitFor(() => {
      // Solo debe mostrar los primeros 6 eventos
      expect(screen.getByText('Event 1')).toBeInTheDocument()
      expect(screen.getByText('Event 6')).toBeInTheDocument()
      expect(screen.queryByText('Event 7')).not.toBeInTheDocument()
    })
  })
})
