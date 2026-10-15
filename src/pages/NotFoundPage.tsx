import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <div className="text-center py-5">
            <div
              className="p-5 bg-white rounded-4 shadow-sm border d-inline-block"
              style={{ maxWidth: '500px' }}
            >
              <i className="bi bi-emoji-frown text-warning" style={{ fontSize: '3rem' }} />
              <h3 className="fw-bold mt-3 text-dark">Página no encontrada</h3>
              <p className="text-muted mt-2 mb-4">
                La página que buscas no existe o la dirección es incorrecta. Verifica la URL o
                vuelve al inicio.
              </p>
              <Link to="/" className="btn btn-success rounded-pill px-4">
                <i className="bi bi-house-door me-1" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
