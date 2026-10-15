import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import StaffRoute from './components/StaffRoute'
import PageLayout from './layout/PageLayout'
import ScrollToTop from './layout/ScrollToTop'
import AccesoDenegadoPage from './pages/AccesoDenegadoPage'
import CarritoPage from './pages/CarritoPage'
import DetallePage from './pages/DetallePage'
import GestionPage from './pages/GestionPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PanelAdministracionPage from './pages/PanelAdministracionPage'
import PerfilPage from './pages/PerfilPage'
import RegistroPage from './pages/RegistroPage'
import ServiciosPage from './pages/ServiciosPage'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<PageLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/servicios" element={<ServiciosPage />} />
              <Route path="/servicios/:codigo" element={<DetallePage />} />
              <Route path="/carrito" element={<CarritoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegistroPage />} />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <PerfilPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gestion"
                element={
                  <StaffRoute>
                    <GestionPage />
                  </StaffRoute>
                }
              />
              <Route path="/gestionVendedor" element={<Navigate to="/gestion" replace />} />
              <Route
                path="/panelAdministracion"
                element={
                  <AdminRoute>
                    <PanelAdministracionPage />
                  </AdminRoute>
                }
              />
              <Route path="/acceso-denegado" element={<AccesoDenegadoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
