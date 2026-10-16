import type { Sesion } from '../types'

export function esAdmin(usuario: Sesion | null): boolean {
  return usuario?.rol === 'administrador'
}

export function esRecepcionista(usuario: Sesion | null): boolean {
  return usuario?.rol === 'recepcionista'
}

export function puedeGestionarStock(usuario: Sesion | null): boolean {
  return esAdmin(usuario) || esRecepcionista(usuario)
}
