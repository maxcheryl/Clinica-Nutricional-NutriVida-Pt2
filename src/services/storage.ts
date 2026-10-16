import {
  ADMIN_INICIAL_CORREO,
  ADMIN_INICIAL_PASSWORD,
  CLAVE_CARRITO,
  CLAVE_CATEGORIAS,
  CLAVE_INTENTOS,
  CLAVE_PRODUCTOS,
  CLAVE_RESERVADOS,
  CLAVE_SESION,
  CLAVE_USUARIOS,
  MAX_INTENTOS,
} from '../constants'
import { servicios as serviciosSeed } from '../data/servicios'
import type { CarritoItem, Categoria, IntentosMap, ReservadosMap, Servicio, Sesion, Usuario } from '../types'

// ==================== USUARIOS ====================
export function obtenerUsuarios(): Usuario[] {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  if (datos === null) return []
  const usuarios = JSON.parse(datos) as Usuario[]
  return usuarios.map((u) => ({ ...u, rol: u.rol ?? 'cliente' }))
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
  return usuarios.find((usuario) => usuario.correo.toLowerCase() === correo.toLowerCase())
}

export function buscarUsuarioPorId(id: string): Usuario | undefined {
  return obtenerUsuarios().find((usuario) => usuario.id === id)
}

export function actualizarUsuario(correo: string, datos: Partial<Usuario>): void {
  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex((u) => u.correo === correo)
  if (indice === -1) return
  usuarios[indice] = { ...usuarios[indice], ...datos }
  guardarUsuarios(usuarios)
}

export function eliminarUsuario(correo: string): void {
  const usuarios = obtenerUsuarios().filter((u) => u.correo !== correo)
  guardarUsuarios(usuarios)
}

export function migrarUsuariosSinRol(): void {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  if (datos === null) return
  const usuarios = JSON.parse(datos) as Usuario[]
  const migrados = usuarios.map((u) => ({ ...u, rol: u.rol ?? 'cliente' }))
  guardarUsuarios(migrados)
}

export function sembrarAdminSiFalta(): void {
  if (buscarUsuarioPorCorreo(ADMIN_INICIAL_CORREO)) return
  agregarUsuario({
    id: crypto.randomUUID(),
    nombre: 'Admin',
    apellido: 'NutriVida',
    correo: ADMIN_INICIAL_CORREO,
    fechaNacimiento: '1990-01-01',
    contrasena: ADMIN_INICIAL_PASSWORD,
    genero: 'NoDice',
    region: 'Metropolitana',
    direccion: 'Milano 01591, Temuco',
    rol: 'administrador',
  })
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

// ==================== PRODUCTOS ====================
export function obtenerProductos(): Servicio[] {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS)
  if (datos === null) {
    guardarProductos(serviciosSeed)
    return [...serviciosSeed]
  }
  return JSON.parse(datos) as Servicio[]
}

export function guardarProductos(productos: Servicio[]): void {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
}

export function agregarProducto(producto: Servicio): void {
  const productos = obtenerProductos()
  productos.push(producto)
  guardarProductos(productos)
}

export function actualizarProducto(codigo: string, datos: Partial<Servicio>): void {
  const productos = obtenerProductos()
  const indice = productos.findIndex((p) => p.codigo === codigo)
  if (indice === -1) return
  productos[indice] = { ...productos[indice], ...datos }
  guardarProductos(productos)
}

export function eliminarProducto(codigo: string): void {
  guardarProductos(obtenerProductos().filter((p) => p.codigo !== codigo))
  guardarCarrito(obtenerCarrito().filter((i) => i.codigo !== codigo))
  const reservados = obtenerReservados()
  if (codigo in reservados) {
    delete reservados[codigo]
    guardarReservados(reservados)
  }
}

export function buscarProductoPorCodigo(codigo: string): Servicio | undefined {
  return obtenerProductos().find((p) => p.codigo === codigo)
}

// ==================== CATEGORÍAS ====================
const CATEGORIAS_SEED: Categoria[] = [
  { id: crypto.randomUUID(), nombre: 'Consulta' },
  { id: crypto.randomUUID(), nombre: 'Plan especializado' },
  { id: crypto.randomUUID(), nombre: 'Evaluación' },
  { id: crypto.randomUUID(), nombre: 'Taller grupal' },
]

export function obtenerCategorias(): Categoria[] {
  const datos = localStorage.getItem(CLAVE_CATEGORIAS)
  if (datos === null) {
    guardarCategorias(CATEGORIAS_SEED)
    return [...CATEGORIAS_SEED]
  }
  return JSON.parse(datos) as Categoria[]
}

export function guardarCategorias(categorias: Categoria[]): void {
  localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categorias))
}

export function agregarCategoria(nombre: string): void {
  const categorias = obtenerCategorias()
  categorias.push({ id: crypto.randomUUID(), nombre })
  guardarCategorias(categorias)
}

export function actualizarCategoria(id: string, nombre: string): void {
  const categorias = obtenerCategorias()
  const indice = categorias.findIndex((c) => c.id === id)
  if (indice === -1) return
  const nombreAnterior = categorias[indice].nombre
  categorias[indice] = { ...categorias[indice], nombre }
  guardarCategorias(categorias)
  if (nombreAnterior !== nombre) {
    const productos = obtenerProductos()
    if (productos.some((p) => p.tipo === nombreAnterior)) {
      guardarProductos(
        productos.map((p) => (p.tipo === nombreAnterior ? { ...p, tipo: nombre } : p)),
      )
    }
  }
}

export function eliminarCategoria(id: string): boolean {
  const categorias = obtenerCategorias()
  const categoria = categorias.find((c) => c.id === id)
  if (!categoria) return false
  const enUso = obtenerProductos().some((p) => p.tipo === categoria.nombre)
  if (enUso) return false
  guardarCategorias(categorias.filter((c) => c.id !== id))
  return true
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

export function agregarAlCarrito(servicio: Servicio): void {
  const carrito = obtenerCarrito()
  const existe = carrito.find((item) => item.codigo === servicio.codigo)
  if (existe) {
    existe.cantidad++
  } else {
    carrito.push({ ...servicio, cantidad: 1 })
  }
  guardarCarrito(carrito)
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
  const servicio = buscarProductoPorCodigo(codigo)
  if (!servicio) return 0
  const enCarrito = cantidadEnCarrito(codigo)
  const reservados = obtenerReservados()[codigo] || 0
  return servicio.cuposIniciales - enCarrito - reservados
}

export function cuposRetenidos(codigo: string): number {
  return cantidadEnCarrito(codigo) + (obtenerReservados()[codigo] || 0)
}
