/**
 * Validaciones reutilizables de formularios: contraseñas, correo institucional y edad.
 */
import { DOMINIO_CORREO } from '../constants'

/** Contraseña válida: 8+ caracteres con mayúscula, minúscula y número. */
export function validarContrasena(contrasena: string): boolean {
  return (
    /.{8,}/.test(contrasena) &&
    /[A-Z]/.test(contrasena) &&
    /[a-z]/.test(contrasena) &&
    /[0-9]/.test(contrasena)
  )
}

/** true si el correo termina en el dominio institucional (`@duocuc.cl`). */
export function esDominioDuoc(correo: string): boolean {
  return correo.trim().toLowerCase().endsWith(DOMINIO_CORREO)
}

/**
 * Edad en años (con decimales) a partir de la fecha de nacimiento.
 * 365.25: promedio que incorpora los años bisiestos.
 */
export function calcularEdad(fechaNacimiento: string): number {
  const fechaActual = new Date()
  const fechaIngresada = new Date(fechaNacimiento)
  return (fechaActual.getTime() - fechaIngresada.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
}
