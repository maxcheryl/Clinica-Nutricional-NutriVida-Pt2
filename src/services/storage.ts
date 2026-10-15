import {
  CLAVE_CARRITO,
  CLAVE_INTENTOS,
  CLAVE_RESERVADOS,
  CLAVE_SESION,
  CLAVE_USUARIOS,
  MAX_INTENTOS,
} from '../constants'
import { getServicioPorCodigo } from '../data/servicios'
import type { CarritoItem, IntentosMap, ReservadosMap, Servicio, Sesion, Usuario } from '../types'

// ==================== USUARIOS ====================
export function obtenerUsuarios(): Usuario[] {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  if (datos === null) return []
  return JSON.parse(datos) as Usuario[]
}

export function guardarUsuarios(usuarios: Usuario[]): void {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

export function agregarUsuario(usuario: Usuario): void {
  const usuarios = obtenerUsuarios()
  usuarios.push(usuario)
  guardarUsuarios(usuarios)
}

export function buscarUsuarioPorCorreo(correo: string): Usuario | undefined {
  const usuarios = obtenerUsuarios()
  return usuarios.find((usuario) => usuario.correo === correo)
}

// ==================== SESIÓN ====================
export function obtenerUsuarioLogueado(): Sesion | null {
  const datos = localStorage.getItem(CLAVE_SESION)
  if (datos === null) return null
  return JSON.parse(datos) as Sesion
}

export function guardarSesion(sesion: Sesion): void {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
}

export function borrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION)
}

// ==================== INTENTOS FALLIDOS ====================
export function obtenerIntentos(): IntentosMap {
  const datos = localStorage.getItem(CLAVE_INTENTOS)
  if (datos === null) return {}
  return JSON.parse(datos) as IntentosMap
}

export function guardarIntentos(intentos: IntentosMap): void {
  localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(intentos))
}

export function incrementarIntentos(correo: string): void {
  const intentos = obtenerIntentos()
  if (!intentos[correo]) {
    intentos[correo] = { intentos: 0, bloqueado: false }
  }
  intentos[correo].intentos++
  if (intentos[correo].intentos >= MAX_INTENTOS) {
    intentos[correo].bloqueado = true
  }
  guardarIntentos(intentos)
}

export function resetearIntentos(correo: string): void {
  const intentos = obtenerIntentos()
  if (intentos[correo]) {
    intentos[correo].intentos = 0
    intentos[correo].bloqueado = false
    guardarIntentos(intentos)
  }
}

export function estaBloqueado(correo: string): boolean {
  const intentos = obtenerIntentos()
  return Boolean(intentos[correo] && intentos[correo].bloqueado)
}

export function obtenerIntentosRestantes(correo: string): number {
  const intentos = obtenerIntentos()
  if (!intentos[correo]) return MAX_INTENTOS
  return MAX_INTENTOS - intentos[correo].intentos
}

// ==================== CARRITO ====================
export function obtenerCarrito(): CarritoItem[] {
  const datos = localStorage.getItem(CLAVE_CARRITO)
  if (datos === null) return []
  return JSON.parse(datos) as CarritoItem[]
}

export function guardarCarrito(carrito: CarritoItem[]): void {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

export function agregarAlCarrito(servicio: Servicio): boolean {
  const carrito = obtenerCarrito()
  const existe = carrito.find((item) => item.codigo === servicio.codigo)
  if (existe) {
    existe.cantidad++
  } else {
    carrito.push({ ...servicio, cantidad: 1 })
  }
  guardarCarrito(carrito)
  return true
}

export function reducirCantidad(codigo: string): void {
  const carrito = obtenerCarrito()
  const item = carrito.find((i) => i.codigo === codigo)
  if (item) {
    item.cantidad--
    if (item.cantidad <= 0) {
      guardarCarrito(carrito.filter((i) => i.codigo !== codigo))
    } else {
      guardarCarrito(carrito)
    }
  }
}

export function eliminarDelCarrito(codigo: string): void {
  const carrito = obtenerCarrito().filter((i) => i.codigo !== codigo)
  guardarCarrito(carrito)
}

export function vaciarCarrito(): void {
  localStorage.removeItem(CLAVE_CARRITO)
}

export function contarCarrito(): number {
  return obtenerCarrito().reduce((sum, item) => sum + item.cantidad, 0)
}

export function serviciosEnCarrito(): number {
  return obtenerCarrito().length
}

export function cantidadEnCarrito(codigo: string): number {
  const item = obtenerCarrito().find((i) => i.codigo === codigo)
  return item ? item.cantidad : 0
}

// ==================== CUPOS ====================
export function obtenerReservados(): ReservadosMap {
  const datos = localStorage.getItem(CLAVE_RESERVADOS)
  if (datos === null) return {}
  return JSON.parse(datos) as ReservadosMap
}

export function guardarReservados(reservados: ReservadosMap): void {
  localStorage.setItem(CLAVE_RESERVADOS, JSON.stringify(reservados))
}

export function obtenerCupoDisponible(codigo: string): number {
  const servicio = getServicioPorCodigo(codigo)
  if (!servicio) return 0
  const enCarrito = cantidadEnCarrito(codigo)
  const reservados = obtenerReservados()[codigo] || 0
  return servicio.cuposIniciales - enCarrito - reservados
}
