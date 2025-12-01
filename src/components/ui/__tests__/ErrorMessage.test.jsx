import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  it('renderiza el título "Algo salió mal"', () => {
    render(<ErrorMessage />)
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
  })

  it('muestra mensaje de error por defecto cuando no se proporciona mensaje', () => {
    render(<ErrorMessage />)
    expect(screen.getByText(/No pudimos cargar la información/)).toBeInTheDocument()
  })

  it('muestra mensaje de error personalizado', () => {
    render(<ErrorMessage message="Error de conexión" />)
    expect(screen.getByText('Error de conexión')).toBeInTheDocument()
  })

  it('muestra botón de reintentar cuando se proporciona retry', () => {
    const retryFn = vi.fn()
    render(<ErrorMessage retry={retryFn} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('no muestra botón de reintentar cuando no se proporciona retry', () => {
    render(<ErrorMessage />)
    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })

  it('ejecuta la función retry al hacer click en el botón', () => {
    const retryFn = vi.fn()
    render(<ErrorMessage retry={retryFn} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(retryFn).toHaveBeenCalledTimes(1)
  })

  it('tiene el icono de error', () => {
    const { container } = render(<ErrorMessage />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
