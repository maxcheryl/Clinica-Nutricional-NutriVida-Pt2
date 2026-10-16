/**
 * Miga de pan: el último ítem se muestra como página actual (sin enlace)
 * y el primero lleva ícono de casa.
 */
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  /** Ruta del enlace; sin `to` (o en el último ítem) se renderiza como texto. */
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  centered?: boolean
  navClassName?: string
  olClassName?: string
}

export default function Breadcrumb({
  items,
  centered = false,
  navClassName = '',
  olClassName = '',
}: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={navClassName}>
      <ol className={`breadcrumb${centered ? ' justify-content-center mb-2' : ''}${olClassName ? ` ${olClassName}` : ''}`}>
        {items.map((item, index) => {
          const esUltimo = index === items.length - 1
          const esInicio = index === 0
          return (
            <li
              key={item.label}
              className={`breadcrumb-item${esUltimo ? ' active text-success fw-semibold' : ''}`}
              aria-current={esUltimo ? 'page' : undefined}
            >
              {esUltimo || !item.to ? (
                item.label
              ) : (
                <Link to={item.to} className="text-decoration-none text-muted">
                  {esInicio && <i className="bi bi-house-door me-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
