import type { Sesion } from '../types'

export function esAdmin(usuario: Sesion | null): boolean {
  return usuario?.rol === 'administrador'
}

export function esRecepcionista(usuario: Sesion | null): boolean {
  return usuario?.rol === 'recepcionista'
}

export function esCliente(usuario: Sesion | null): boolean {
  return usuario?.rol === 'cliente'
}

export function puedeGestionarStock(usuario: Sesion | null): boolean {
  return esAdmin(usuario) || esRecepcionista(usuario)
}

export function puedeCrearClientes(usuario: Sesion | null): boolean {
  return esAdmin(usuario) || esRecepcionista(usuario)
}

export function puedeAdministrar(usuario: Sesion | null): boolean {
  return esAdmin(usuario)
}
