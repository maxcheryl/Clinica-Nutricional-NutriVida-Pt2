export function formatPrecio(precio: number): string {
  return '$' + precio.toLocaleString('es-CL')
}
