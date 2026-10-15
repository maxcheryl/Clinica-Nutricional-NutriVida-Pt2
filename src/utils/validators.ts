export function validarContrasena(contrasena: string): boolean {
  return (
    /.{8,}/.test(contrasena) &&
    /[A-Z]/.test(contrasena) &&
    /[a-z]/.test(contrasena) &&
    /[0-9]/.test(contrasena)
  )
}

export function esDominioDuoc(correo: string): boolean {
  return correo.endsWith('@duocuc.cl')
}

export function calcularEdad(fechaNacimiento: string): number {
  const fechaActual = new Date()
  const fechaIngresada = new Date(fechaNacimiento)
  return (fechaActual.getTime() - fechaIngresada.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
}
