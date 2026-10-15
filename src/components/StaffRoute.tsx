import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { puedeGestionarStock } from '../utils/permissions'

interface StaffRouteProps {
  children: ReactNode
}

export default function StaffRoute({ children }: StaffRouteProps) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (!puedeGestionarStock(usuario)) return <Navigate to="/acceso-denegado" replace />
  return <>{children}</>
}
