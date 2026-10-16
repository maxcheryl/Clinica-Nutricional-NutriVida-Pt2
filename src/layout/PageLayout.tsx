/**
 * Estructura común de todas las páginas: Navbar + contenido de la ruta (Outlet) + Footer.
 */
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

export default function PageLayout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
