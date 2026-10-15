import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()
  const { totalUnidades } = useCart()
  const enInicio = location.pathname === '/'
  const enServicios = location.pathname.startsWith('/servicios')

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  function irASeccion(hash: string) {
    if (location.pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#' + hash)
    }
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={() => window.scrollTo(0, 0)}>
            <img src="/assets/img/icons/logo.png" alt="NutriVida" className="brand-logo" />
            <span className="brand-text">Clínica NutriVida</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link${enInicio ? ' active' : ''}`}
                  to="/"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link border-0 bg-transparent"
                  onClick={() => irASeccion('nosotros')}
                >
                  Quiénes somos
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link border-0 bg-transparent"
                  onClick={() => irASeccion('contacto')}
                >
                  Contáctanos
                </button>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link${enServicios ? ' active' : ''}`}
                  to="/servicios"
                  aria-current={enServicios ? 'page' : undefined}
                >
                  Servicios
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              {usuario ? (
                <>
                  <li className="nav-item" id="infoUsuario">
                    <span className="nav-link" id="nombreUsuario">
                      Hola, {usuario.nombre}
                    </span>
                  </li>
                  <li className="nav-item mb-2" id="botonCerrarSesion">
                    <button
                      type="button"
                      id="btnCerrarSesion"
                      className="btn btn-success ms-lg-2"
                      onClick={cerrarSesion}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item" id="botonIniciarSesion">
                  <Link className="nav-link" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="btn btn-success ms-lg-2" to="/carrito">
                  <i className="bi bi-cart2 me-2" />
                  Mi reserva{' '}
                  <span
                    className="badge bg-danger rounded-pill ms-1 badge-carrito"
                    style={{ display: totalUnidades > 0 ? 'inline' : 'none' }}
                  >
                    {totalUnidades}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
