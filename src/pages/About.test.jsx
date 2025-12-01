import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../test/test-utils'
import About from './About'

describe('About', () => {
  it('renderiza el título principal con EventHub', () => {
    render(<About />)
    expect(screen.getByText(/Acerca de/)).toBeInTheDocument()
    expect(screen.getByText(/EventHub/)).toBeInTheDocument()
  })

  it('muestra la descripción de la plataforma', () => {
    render(<About />)
    expect(screen.getByText(/plataforma líder para descubrir y organizar eventos/)).toBeInTheDocument()
  })

  it('muestra la sección de Misión', () => {
    render(<About />)
    expect(screen.getByText('Nuestra Misión')).toBeInTheDocument()
  })

  it('muestra la sección de Visión', () => {
    render(<About />)
    expect(screen.getByText('Nuestra Visión')).toBeInTheDocument()
  })

  it('muestra el contenido de la misión', () => {
    render(<About />)
    expect(screen.getByText(/Democratizar el acceso a eventos/)).toBeInTheDocument()
  })

  it('muestra el contenido de la visión', () => {
    render(<About />)
    expect(screen.getByText(/plataforma de eventos más confiable/)).toBeInTheDocument()
  })

  it('muestra la sección de Stack Tecnológico', () => {
    render(<About />)
    expect(screen.getByText('Stack Tecnológico')).toBeInTheDocument()
  })
})
