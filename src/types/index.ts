/**
 * Tipos compartidos de la aplicación: catálogo de servicios, usuarios,
 * sesión, carrito y mapas de persistencia.
 */

/** Roles que puede tener un usuario. */
export type RolUsuario = 'administrador' | 'recepcionista' | 'cliente'

/** Producto/servicio del catálogo. `imagen` es opcional: sin ella se usa la default. */
export interface Servicio {
  codigo: string
  tipo: string
  nombre: string
  duracion: string
  modalidad: string
  precio: number
  cuposIniciales: number
  descripcion: string
  imagen?: string
}

/** Categoría del catálogo; los productos la referencian por nombre (`tipo`). */
export interface Categoria {
  id: string
  nombre: string
}

export type Genero = 'Mujer' | 'Hombre' | 'Otro' | 'NoDice'

/** Registro completo de usuario guardado en localStorage. */
export interface Usuario {
  id: string
  nombre: string
  apellido: string
  correo: string
  fechaNacimiento: string
  contrasena: string
  genero: Genero | ''
  region: string
  direccion: string
  rol: RolUsuario
  avatar?: string
}

/** Datos del usuario en sesión (persistida en `CLAVE_SESION`); nunca incluye la contraseña. */
export interface Sesion {
  id: string
  nombre: string
  apellido: string
  correo: string
  genero: Genero | ''
  region: string
  rol: RolUsuario
}

/** Ítem del carrito: copia del producto + cantidad solicitada. */
export interface CarritoItem extends Servicio {
  cantidad: number
}

/** Contador de intentos fallidos de login por correo. */
export interface RegistroIntentos {
  intentos: number
  bloqueado: boolean
}

/** Mapa correo → intentos. */
export type IntentosMap = Record<string, RegistroIntentos>

/** Mapa código de producto → cupos ya reservados. */
export type ReservadosMap = Record<string, number>
