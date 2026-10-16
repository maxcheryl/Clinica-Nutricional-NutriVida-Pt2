/**
 * Toast global de la app: `showToast(mensaje, tipo)` muestra una notificación
 * flotante (bootstrap) abajo a la derecha durante 2,5 segundos.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Toast } from 'bootstrap'

type TipoToast = 'success' | 'warning' | 'danger'

interface ToastContextValue {
  showToast: (mensaje: string, tipo: TipoToast) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [mensaje, setMensaje] = useState('')
  const [tipo, setTipo] = useState<TipoToast>('success')
  const [clave, setClave] = useState(0)
  const toastRef = useRef<HTMLDivElement>(null)
  const bsToastRef = useRef<Toast | null>(null)

  const showToast = useCallback((msg: string, t: TipoToast) => {
    setMensaje(msg)
    setTipo(t)
    setClave((c) => c + 1)
  }, [])

  useEffect(() => {
    if (clave === 0 || !toastRef.current) return
    bsToastRef.current = new Toast(toastRef.current, { delay: 2500 })
    bsToastRef.current.show()
  }, [clave])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="position-fixed bottom-0 end-0 p-3 toast-container">
        <div
          ref={toastRef}
          className={`toast align-items-center text-bg-${tipo} border-0 shadow-lg`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{mensaje}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Cerrar"
            ></button>
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}
