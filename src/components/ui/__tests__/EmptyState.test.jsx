import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renderiza título por defecto', () => {
    render(<EmptyState />)
    expect(screen.getByText('No hay resultados')).toBeInTheDocument()
  })

  it('renderiza descripción por defecto', () => {
    render(<EmptyState />)
    expect(screen.getByText('No encontramos lo que estás buscando.')).toBeInTheDocument()
  })

  it('renderiza título personalizado', () => {
    render(<EmptyState title="Sin eventos" />)
    expect(screen.getByText('Sin eventos')).toBeInTheDocument()
  })

  it('renderiza descripción personalizada', () => {
    render(<EmptyState description="No hay eventos disponibles en este momento." />)
    expect(screen.getByText('No hay eventos disponibles en este momento.')).toBeInTheDocument()
  })

  it('no muestra botón de acción cuando no se proporciona action y actionLabel', () => {
    render(<EmptyState />)
    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })

  it('muestra botón de acción cuando se proporciona action y actionLabel', () => {
    const actionFn = vi.fn()
    render(<EmptyState action={actionFn} actionLabel="Ver todos" />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Ver todos')
  })

  it('ejecuta la función action al hacer click en el botón', () => {
    const actionFn = vi.fn()
    render(<EmptyState action={actionFn} actionLabel="Reintentar" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(actionFn).toHaveBeenCalledTimes(1)
  })

  it('tiene el icono de estado vacío', () => {
    const { container } = render(<EmptyState />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
