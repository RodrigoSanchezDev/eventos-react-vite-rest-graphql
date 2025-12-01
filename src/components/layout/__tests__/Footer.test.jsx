import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../../test/test-utils'
import Footer from '../Footer'

describe('Footer', () => {
  it('renderiza el logo de EventHub', () => {
    render(<Footer />)
    expect(screen.getByText('EventHub')).toBeInTheDocument()
  })

  it('muestra la descripción de la plataforma', () => {
    render(<Footer />)
    expect(screen.getByText(/Tu plataforma de confianza/i)).toBeInTheDocument()
  })

  it('muestra el año actual en el copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
  })

  it('muestra el texto de desarrollado con React + Vite', () => {
    render(<Footer />)
    expect(screen.getByText(/Desarrollado con React \+ Vite/i)).toBeInTheDocument()
  })

  describe('enlaces de producto', () => {
    it('muestra enlace Explorar Eventos', () => {
      render(<Footer />)
      const link = screen.getByText('Explorar Eventos')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/eventos')
    })

    it('muestra enlace Crear Evento', () => {
      render(<Footer />)
      const link = screen.getByText('Crear Evento')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/crear-evento')
    })

    it('muestra enlace Categorías', () => {
      render(<Footer />)
      const link = screen.getByText('Categorías')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/eventos?filter=all')
    })
  })

  describe('enlaces de compañía', () => {
    it('muestra enlace Acerca de', () => {
      render(<Footer />)
      const link = screen.getByText('Acerca de')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/acerca')
    })

    it('muestra enlace Contacto', () => {
      render(<Footer />)
      const link = screen.getByText('Contacto')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/contacto')
    })

    it('muestra enlace Blog', () => {
      render(<Footer />)
      const link = screen.getByText('Blog')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/blog')
    })
  })

  describe('enlaces legales', () => {
    it('muestra enlace Privacidad', () => {
      render(<Footer />)
      const link = screen.getByText('Privacidad')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/privacidad')
    })

    it('muestra enlace Términos', () => {
      render(<Footer />)
      const link = screen.getByText('Términos')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/terminos')
    })

    it('muestra enlace Cookies', () => {
      render(<Footer />)
      const link = screen.getByText('Cookies')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/cookies')
    })
  })

  describe('secciones', () => {
    it('muestra la sección producto', () => {
      render(<Footer />)
      expect(screen.getByText('producto')).toBeInTheDocument()
    })

    it('muestra la sección compañia', () => {
      render(<Footer />)
      expect(screen.getByText('compañia')).toBeInTheDocument()
    })

    it('muestra la sección legal', () => {
      render(<Footer />)
      expect(screen.getByText('legal')).toBeInTheDocument()
    })
  })

  describe('redes sociales', () => {
    it('tiene enlaces a redes sociales', () => {
      render(<Footer />)
      // Los enlaces de redes sociales tienen href="#"
      const socialLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href') === '#'
      )
      // Debería haber 3 enlaces de redes sociales (Facebook, Twitter, YouTube)
      expect(socialLinks.length).toBe(3)
    })
  })

  it('tiene la estructura correcta del footer', () => {
    render(<Footer />)
    const footer = document.querySelector('footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('bg-primary-900')
  })
})
