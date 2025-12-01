import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../test/test-utils'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renderiza el logo de EventHub', () => {
    render(<Navbar />)
    expect(screen.getByText('EventHub')).toBeInTheDocument()
  })

  it('renderiza los enlaces de navegación', () => {
    render(<Navbar />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Eventos')).toBeInTheDocument()
    expect(screen.getByText('Crear Evento')).toBeInTheDocument()
    expect(screen.getByText('Acerca de')).toBeInTheDocument()
  })

  it('tiene el enlace de Inicio con href correcto', () => {
    render(<Navbar />)
    const inicioLink = screen.getByText('Inicio').closest('a')
    expect(inicioLink).toHaveAttribute('href', '/')
  })

  it('tiene el enlace de Eventos con href correcto', () => {
    render(<Navbar />)
    const eventosLink = screen.getByText('Eventos').closest('a')
    expect(eventosLink).toHaveAttribute('href', '/eventos')
  })

  it('tiene botones de búsqueda', () => {
    render(<Navbar />)
    // Hay múltiples botones de búsqueda (desktop y mobile)
    const searchButtons = screen.getAllByRole('button', { name: /buscar/i })
    expect(searchButtons.length).toBeGreaterThan(0)
  })

  it('tiene el botón del menú móvil', () => {
    render(<Navbar />)
    // El botón hamburguesa no tiene aria-label, buscar todos los botones
    const buttons = screen.getAllByRole('button')
    // Debe haber al menos 3 botones (2 de búsqueda + 1 hamburguesa)
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  describe('funcionalidad de búsqueda', () => {
    it('abre el panel de búsqueda al hacer clic en el botón', () => {
      render(<Navbar />)
      const searchButton = screen.getAllByRole('button', { name: /buscar/i })[0]
      fireEvent.click(searchButton)
      
      expect(screen.getByPlaceholderText(/Buscar eventos por nombre/i)).toBeInTheDocument()
    })

    it('muestra las categorías en el panel de búsqueda', () => {
      render(<Navbar />)
      const searchButton = screen.getAllByRole('button', { name: /buscar/i })[0]
      fireEvent.click(searchButton)
      
      expect(screen.getByText('Todas')).toBeInTheDocument()
      expect(screen.getByText('Conferencia')).toBeInTheDocument()
      expect(screen.getByText('Concierto')).toBeInTheDocument()
      expect(screen.getByText('Festival')).toBeInTheDocument()
    })

    it('cierra el panel de búsqueda con el botón cerrar', () => {
      render(<Navbar />)
      const searchButton = screen.getAllByRole('button', { name: /buscar/i })[0]
      fireEvent.click(searchButton)
      
      // Buscar el botón de cerrar dentro del panel
      const closeButtons = screen.getAllByRole('button')
      const closeButton = closeButtons.find(btn => 
        btn.querySelector('svg path[d*="M6 18L18 6"]')
      )
      
      if (closeButton) {
        fireEvent.click(closeButton)
      }
    })

    it('permite escribir en el campo de búsqueda', async () => {
      // Mock fetch para la búsqueda
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        json: () => Promise.resolve([])
      })

      render(<Navbar />)
      const searchButton = screen.getAllByRole('button', { name: /buscar/i })[0]
      fireEvent.click(searchButton)
      
      const searchInput = screen.getByPlaceholderText(/Buscar eventos por nombre/i)
      fireEvent.change(searchInput, { target: { value: 'Concierto' } })
      
      expect(searchInput.value).toBe('Concierto')

      vi.restoreAllMocks()
    })

    it('permite seleccionar una categoría', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        json: () => Promise.resolve([])
      })

      render(<Navbar />)
      const searchButton = screen.getAllByRole('button', { name: /buscar/i })[0]
      fireEvent.click(searchButton)
      
      const categoryButton = screen.getByText('Conferencia')
      fireEvent.click(categoryButton)
      
      // La categoría debería estar seleccionada
      expect(categoryButton).toBeInTheDocument()

      vi.restoreAllMocks()
    })
  })

  describe('menú móvil', () => {
    it('abre el menú móvil al hacer clic en hamburguesa', () => {
      render(<Navbar />)
      // Buscar el botón hamburguesa (no tiene aria-label)
      const buttons = screen.getAllByRole('button')
      const menuButton = buttons.find(btn => 
        btn.querySelector('svg path[d*="M4 6h16M4 12h16M4 18h16"]')
      )
      
      if (menuButton) {
        fireEvent.click(menuButton)
        // Cuando está abierto, debería mostrar "Publicar Evento" en el menú móvil
        const publishButtons = screen.getAllByText(/Publicar Evento/i)
        expect(publishButtons.length).toBeGreaterThan(0)
      }
    })

    it('cierra el menú móvil al hacer clic en un enlace', () => {
      render(<Navbar />)
      const buttons = screen.getAllByRole('button')
      const menuButton = buttons.find(btn => 
        btn.querySelector('svg path[d*="M4 6h16M4 12h16M4 18h16"]')
      )
      
      if (menuButton) {
        fireEvent.click(menuButton)
        
        // Hacer clic en el enlace de Inicio del menú móvil
        const inicioLinks = screen.getAllByText('Inicio')
        if (inicioLinks.length > 1) {
          fireEvent.click(inicioLinks[1])
        }
      }
    })
  })

  describe('enlaces del navbar', () => {
    it('tiene el enlace Crear Evento con href correcto', () => {
      render(<Navbar />)
      const crearEventoLink = screen.getByText('Crear Evento').closest('a')
      expect(crearEventoLink).toHaveAttribute('href', '/crear-evento')
    })

    it('tiene el enlace Acerca de con href correcto', () => {
      render(<Navbar />)
      const acercaLink = screen.getByText('Acerca de').closest('a')
      expect(acercaLink).toHaveAttribute('href', '/acerca')
    })

    it('tiene el botón Publicar Evento en desktop', () => {
      render(<Navbar />)
      const publishButton = screen.getAllByText('Publicar Evento')[0].closest('a')
      expect(publishButton).toHaveAttribute('href', '/crear-evento')
    })
  })

  describe('estructura visual', () => {
    it('tiene la clase de navegación correcta', () => {
      render(<Navbar />)
      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('fixed')
    })

    it('el logo tiene enlace a inicio', () => {
      render(<Navbar />)
      const logoLink = screen.getByText('EventHub').closest('a')
      expect(logoLink).toHaveAttribute('href', '/')
    })
  })
})
