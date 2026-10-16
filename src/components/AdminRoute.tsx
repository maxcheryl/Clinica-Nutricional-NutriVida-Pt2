/**
 * Guard de rutas: solo administradores. Sin sesión → /login;
 * sesión sin rol → /acceso-denegado.
 */
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { esAdmin } from '../utils/permissions'

interface AdminRouteProps {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (!esAdmin(usuario)) return <Navigate to="/acceso-denegado" replace />
  return <>{children}</>
}
