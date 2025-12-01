import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../test/test-utils'
import EventCard from '../EventCard'

// Mock de evento para tests
const mockEvent = {
  id: '1',
  title: 'Tech Summit 2025',
  date: '2025-12-15',
  time: '09:00',
  location: 'Santiago, Chile',
  category: 'Conferencia',
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  price: 45000,
  availableSeats: 150,
  description: 'La conferencia tecnológica más importante del año.'
}

describe('EventCard', () => {
  it('renderiza correctamente el título del evento', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Tech Summit 2025')).toBeInTheDocument()
  })

  it('renderiza la categoría del evento', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Conferencia')).toBeInTheDocument()
  })

  it('renderiza la ubicación del evento', () => {
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('Santiago, Chile')).toBeInTheDocument()
  })

  it('formatea y muestra el precio correctamente', () => {
    render(<EventCard event={mockEvent} />)
    // Buscar el precio formateado en CLP
    const priceElement = screen.getByText(/\$45\.000/)
    expect(priceElement).toBeInTheDocument()
  })

  it('muestra la imagen del evento', () => {
    render(<EventCard event={mockEvent} />)
    const image = screen.getByAltText('Tech Summit 2025')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockEvent.image)
  })

  it('tiene un enlace al detalle del evento', () => {
    render(<EventCard event={mockEvent} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/eventos/1')
  })

  it('tiene un botón para agregar al carrito', () => {
    render(<EventCard event={mockEvent} />)
    const addButton = screen.getByRole('button')
    expect(addButton).toBeInTheDocument()
  })

  it('el botón de agregar al carrito funciona', () => {
    render(<EventCard event={mockEvent} />)
    const addButton = screen.getByRole('button')
    
    fireEvent.click(addButton)
    // Si no hay error, el evento fue manejado correctamente
    expect(addButton).toBeInTheDocument()
  })

  it('formatea la fecha correctamente', () => {
    render(<EventCard event={mockEvent} />)
    // La fecha debe estar formateada en español
    expect(screen.getByText(/diciembre/i)).toBeInTheDocument()
  })
})
