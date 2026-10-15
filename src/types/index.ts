export type TipoServicio = 'Consulta' | 'Plan especializado' | 'Evaluación' | 'Taller grupal'

export interface Servicio {
  codigo: string
  tipo: TipoServicio
  nombre: string
  duracion: string
  modalidad: string
  precio: number
  cuposIniciales: number
  descripcion: string
}

export type Genero = 'Mujer' | 'Hombre' | 'Otro' | 'NoDice'

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
}

export interface Sesion {
  id: string
  nombre: string
  apellido: string
  correo: string
  genero: Genero | ''
  region: string
}

export interface CarritoItem extends Servicio {
  cantidad: number
}

export interface RegistroIntentos {
  intentos: number
  bloqueado: boolean
}

export type IntentosMap = Record<string, RegistroIntentos>

export type ReservadosMap = Record<string, number>
