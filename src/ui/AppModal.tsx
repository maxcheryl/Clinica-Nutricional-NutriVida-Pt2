import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'

interface AppModalProps {
  show: boolean
  onHide: () => void
  children: React.ReactNode
}

export default function AppModal({ show, onHide, children }: AppModalProps) {
  const elementoRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<Modal | null>(null)
  const onHideRef = useRef(onHide)
  onHideRef.current = onHide

  useEffect(() => {
    const el = elementoRef.current
    if (!el) return

    if (!modalRef.current) {
      modalRef.current = new Modal(el)
      el.addEventListener('hidden.bs.modal', () => onHideRef.current())
    }

    if (show) {
      modalRef.current.show()
    } else {
      modalRef.current.hide()
    }
  }, [show])

  // Solo al desmontar: limpia backdrop y estado del body
  useEffect(() => {
    return () => {
      modalRef.current?.dispose()
      modalRef.current = null
      document.body.classList.remove('modal-open')
      document.body.style.removeProperty('overflow')
      document.querySelectorAll('.modal-backdrop').forEach((b) => b.remove())
    }
  }, [])

  return (
    <div className="modal fade" ref={elementoRef} tabIndex={-1}>
      {children}
    </div>
  )
}
