import { UMBRAL_POCOS_CUPOS } from '../constants'

interface StockBadgeProps {
  disponible: number
}

export default function StockBadge({ disponible }: StockBadgeProps) {
  return (
    <>
      <span className="badge bg-secondary rounded-pill">{disponible}</span>
      {disponible <= 0 && (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill ms-1">
          <i className="bi bi-x-circle me-1" />
          Agotado
        </span>
      )}
      {disponible > 0 && disponible <= UMBRAL_POCOS_CUPOS && (
        <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill ms-1">
          <i className="bi bi-exclamation-triangle me-1" />
          Pocos cupos
        </span>
      )}
    </>
  )
}
