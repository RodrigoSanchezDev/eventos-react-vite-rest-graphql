import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renderiza el texto por defecto "Cargando..."', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renderiza texto personalizado', () => {
    render(<LoadingSpinner text="Procesando solicitud..." />)
    expect(screen.getByText('Procesando solicitud...')).toBeInTheDocument()
  })

  it('no muestra texto cuando text es vacío', () => {
    render(<LoadingSpinner text="" />)
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  it('aplica tamaño mediano por defecto', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.w-12.h-12')
    expect(spinner).toBeInTheDocument()
  })

  it('aplica tamaño pequeño cuando size="sm"', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    const spinner = container.querySelector('.w-8.h-8')
    expect(spinner).toBeInTheDocument()
  })

  it('aplica tamaño grande cuando size="lg"', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    const spinner = container.querySelector('.w-16.h-16')
    expect(spinner).toBeInTheDocument()
  })

  it('tiene animación de spin', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
