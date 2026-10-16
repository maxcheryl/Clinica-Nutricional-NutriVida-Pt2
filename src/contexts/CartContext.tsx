/**
 * Contexto del carrito: mantiene en React el carrito y las reservas
 * (persistidos en storage) y expone el cálculo de cupos libres por producto.
 */
import { createContext, useContext, useState } from 'react'
import type { CarritoItem, ReservadosMap, Servicio } from '../types'
import {
  agregarAlCarrito as storageAgregar,
  buscarProductoPorCodigo,
  eliminarDelCarrito as storageEliminar,
  guardarReservados,
  obtenerCarrito,
  obtenerReservados,
  reducirCantidad as storageReducir,
  vaciarCarrito as storageVaciar,
} from '../services/storage'

interface CartContextValue {
  carrito: CarritoItem[]
  reservados: ReservadosMap
  totalUnidades: number
  cupoDisponible: (codigo: string) => number
  agregarAlCarrito: (servicio: Servicio) => void
  reducirCantidad: (codigo: string) => void
  eliminarDelCarrito: (codigo: string) => void
  vaciarCarrito: () => void
  confirmarReserva: () => void
  sincronizar: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoItem[]>(() => obtenerCarrito())
  const [reservados, setReservados] = useState<ReservadosMap>(() => obtenerReservados())

  const totalUnidades = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  /**
   * Cupos libres: lee el producto fresco de storage pero usa el carrito y
   * las reservas del estado en memoria del contexto.
   */
  function cupoDisponible(codigo: string): number {
    const servicio = buscarProductoPorCodigo(codigo)
    if (!servicio) return 0
    const enCarrito = carrito.find((i) => i.codigo === codigo)?.cantidad ?? 0
    const yaReservados = reservados[codigo] || 0
    return servicio.cuposIniciales - enCarrito - yaReservados
  }

  function agregarAlCarrito(servicio: Servicio) {
    storageAgregar(servicio)
    setCarrito(obtenerCarrito())
  }

  function reducirCantidad(codigo: string) {
    storageReducir(codigo)
    setCarrito(obtenerCarrito())
  }

  function eliminarDelCarrito(codigo: string) {
    storageEliminar(codigo)
    setCarrito(obtenerCarrito())
  }

  function vaciarCarrito() {
    storageVaciar()
    setCarrito([])
  }

  /**
   * Confirma la reserva: suma el carrito a "reservados" y lo vacía.
   * No revalida cupos aquí (lo hace CarritoPage antes de llamar).
   */
  function confirmarReserva() {
    const nuevosReservados = { ...reservados }
    carrito.forEach((item) => {
      nuevosReservados[item.codigo] = (nuevosReservados[item.codigo] || 0) + item.cantidad
    })
    guardarReservados(nuevosReservados)
    setReservados(nuevosReservados)
    storageVaciar()
    setCarrito([])
  }

  /** Relee carrito y reservas desde storage (p. ej. tras eliminar un producto en un panel). */
  function sincronizar() {
    setCarrito(obtenerCarrito())
    setReservados(obtenerReservados())
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        reservados,
        totalUnidades,
        cupoDisponible,
        agregarAlCarrito,
        reducirCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        confirmarReserva,
        sincronizar,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
