/**
 * Verificadores de rol sobre la sesión actual; se usan en las rutas
 * protegidas (AdminRoute/StaffRoute) y en el navbar.
 */
import type { Sesion } from '../types'

export function esAdmin(usuario: Sesion | null): boolean {
  return usuario?.rol === 'administrador'
}

export function esRecepcionista(usuario: Sesion | null): boolean {
  return usuario?.rol === 'recepcionista'
}

/** Admin o recepcionista: puede operar la pestaña de stock de Gestión. */
export function puedeGestionarStock(usuario: Sesion | null): boolean {
  return esAdmin(usuario) || esRecepcionista(usuario)
}
