/**
 * Capa de persistencia: única fuente de verdad de la aplicación en localStorage.
 * Todo pasa por aquí (usuarios, sesión, intentos, productos, categorías,
 * carrito y reservas); los contextos solo reflejan estos datos en React.
 */
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
/** Lee todos los usuarios (normaliza `rol` a 'cliente' en registros antiguos sin rol). */
export function obtenerUsuarios(): Usuario[] {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  if (datos === null) return []
  const usuarios = JSON.parse(datos) as Usuario[]
  return usuarios.map((u) => ({ ...u, rol: u.rol ?? 'cliente' }))
}

/** Reemplaza la lista completa de usuarios en localStorage. */
export function guardarUsuarios(usuarios: Usuario[]): void {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

/** Agrega un usuario al final de la lista (no valida duplicados: eso lo hacen los formularios). */
export function agregarUsuario(usuario: Usuario): void {
  const usuarios = obtenerUsuarios()
  usuarios.push(usuario)
  guardarUsuarios(usuarios)
}

/** Busca por correo sin importar mayúsculas/minúsculas. */
export function buscarUsuarioPorCorreo(correo: string): Usuario | undefined {
  const usuarios = obtenerUsuarios()
  return usuarios.find((usuario) => usuario.correo.toLowerCase() === correo.toLowerCase())
}

/** Busca por id: se usa para refrescar la sesión sin depender del correo (evita colisiones). */
export function buscarUsuarioPorId(id: string): Usuario | undefined {
  return obtenerUsuarios().find((usuario) => usuario.id === id)
}

/** Aplica un merge parcial sobre el usuario con ese correo (clave: correo original). */
export function actualizarUsuario(correo: string, datos: Partial<Usuario>): void {
  const usuarios = obtenerUsuarios()
  const indice = usuarios.findIndex((u) => u.correo === correo)
  if (indice === -1) return
  usuarios[indice] = { ...usuarios[indice], ...datos }
  guardarUsuarios(usuarios)
}

/** Elimina por correo (si hubiera duplicados, borría a todos). */
export function eliminarUsuario(correo: string): void {
  const usuarios = obtenerUsuarios().filter((u) => u.correo !== correo)
  guardarUsuarios(usuarios)
}

/** One-time: completa el rol 'cliente' en usuarios guardados antes de existir roles. */
export function migrarUsuariosSinRol(): void {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  if (datos === null) return
  const usuarios = JSON.parse(datos) as Usuario[]
  const migrados = usuarios.map((u) => ({ ...u, rol: u.rol ?? 'cliente' }))
  guardarUsuarios(migrados)
}

/** Crea el admin inicial si la lista de usuarios está vacía (al arrancar la app). */
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
/** Devuelve la sesión persistida o null si no hay nadie logueado. */
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
/** Mapa correo → intentos fallidos, para bloquear cuentas después de MAX_INTENTOS. */
export function obtenerIntentos(): IntentosMap {
  const datos = localStorage.getItem(CLAVE_INTENTOS)
  if (datos === null) return {}
  return JSON.parse(datos) as IntentosMap
}

export function guardarIntentos(intentos: IntentosMap): void {
  localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(intentos))
}

/** Suma un intento fallido y marca la cuenta como bloqueada al llegar a MAX_INTENTOS. */
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

/** Reinicia los contadores tras un login exitoso. */
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

/** Cuántos intentos le quedan antes del bloqueo (MAX_INTENTOS si nunca falló). */
export function obtenerIntentosRestantes(correo: string): number {
  const intentos = obtenerIntentos()
  if (!intentos[correo]) return MAX_INTENTOS
  return MAX_INTENTOS - intentos[correo].intentos
}

// ==================== PRODUCTOS ====================
/** Lee el catálogo; si está vacío, siembra los productos iniciales. */
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

/** Merge parcial por código; los campos no incluidos (p. ej. `imagen`) se conservan. */
export function actualizarProducto(codigo: string, datos: Partial<Servicio>): void {
  const productos = obtenerProductos()
  const indice = productos.findIndex((p) => p.codigo === codigo)
  if (indice === -1) return
  productos[indice] = { ...productos[indice], ...datos }
  guardarProductos(productos)
}

/**
 * Elimina el producto y limpia sus rastros: lo saca del carrito y borra
 * sus reservas, para que no queden ítems fantasma de un código inexistente.
 */
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
/** Categorías iniciales; los productos las referencian por `tipo` = nombre. */
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

/** Renombra la categoría y arrastra el cambio a los productos que la usan (`tipo`). */
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

/**
 * Elimina la categoría solo si ningún producto la usa.
 * @returns false si estaba en uso (el caller muestra el motivo).
 */
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

/** Agrega una unidad (o inserta con cantidad 1). La validación de cupos la hace el caller. */
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

/** Resta una unidad; al llegar a 0 elimina el ítem del carrito. */
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

/** Unidades de un producto en el carrito (0 si no está). */
export function cantidadEnCarrito(codigo: string): number {
  const item = obtenerCarrito().find((i) => i.codigo === codigo)
  return item ? item.cantidad : 0
}

// ==================== CUPOS ====================
/** Mapa código → cupos ya reservados confirmados (tras "Confirmar reserva"). */
export function obtenerReservados(): ReservadosMap {
  const datos = localStorage.getItem(CLAVE_RESERVADOS)
  if (datos === null) return {}
  return JSON.parse(datos) as ReservadosMap
}

export function guardarReservados(reservados: ReservadosMap): void {
  localStorage.setItem(CLAVE_RESERVADOS, JSON.stringify(reservados))
}

/**
 * Cupos libres de un producto: stock inicial − lo que hay en carrito − ya reservado.
 * Puede ser negativo si el admin redujo el stock con ítems en carritos (el UI lo acota a 0).
 */
export function obtenerCupoDisponible(codigo: string): number {
  const servicio = buscarProductoPorCodigo(codigo)
  if (!servicio) return 0
  const enCarrito = cantidadEnCarrito(codigo)
  const reservados = obtenerReservados()[codigo] || 0
  return servicio.cuposIniciales - enCarrito - reservados
}

/**
 * Cupos retenidos = carrito + reservados de un producto.
 * Al editar stock desde los paneles, lo que se ingresa son cupos LIBRES,
 * así que al guardar se le suma esto para obtener el nuevo `cuposIniciales`.
 */
export function cuposRetenidos(codigo: string): number {
  return cantidadEnCarrito(codigo) + (obtenerReservados()[codigo] || 0)
}
