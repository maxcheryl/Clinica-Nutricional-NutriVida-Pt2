/** Formatea pesos chilenos: 35000 → "$35.000". */
export function formatPrecio(precio: number): string {
  return '$' + precio.toLocaleString('es-CL')
}
