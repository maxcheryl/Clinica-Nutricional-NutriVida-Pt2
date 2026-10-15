import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBadgeClass, getTipoIcon, servicios } from '../data/servicios'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import Breadcrumb from '../layout/Breadcrumb'
import AppModal from '../ui/AppModal'
import { formatPrecio } from '../utils/format'

export default function CarritoPage() {
  const { carrito, totalUnidades, cupoDisponible, agregarAlCarrito, reducirCantidad, eliminarDelCarrito, vaciarCarrito, confirmarReserva } =
    useCart()
  const { usuario } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [modalVaciarAbierto, setModalVaciarAbierto] = useState(false)
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false)
  const [modalExitoAbierto, setModalExitoAbierto] = useState(false)

  const total = carrito.reduce((sum, s) => sum + s.precio * s.cantidad, 0)

  function agregarDesdeCarrito(codigo: string) {
    const disponibles = cupoDisponible(codigo)
    if (disponibles <= 0) {
      showToast('No hay más cupos disponibles', 'warning')
      return
    }
    const servicio = servicios.find((s) => s.codigo === codigo)
    if (servicio) agregarAlCarrito(servicio)
  }

  function reducirDesdeCarrito(codigo: string) {
    reducirCantidad(codigo)
  }

  function eliminarDelCarritoCompleto(codigo: string) {
    eliminarDelCarrito(codigo)
  }

  function manejarConfirmarReserva() {
    if (!usuario) {
      setModalLoginAbierto(true)
      return
    }
    confirmarReserva()
    setModalExitoAbierto(true)
  }

  function manejarConfirmarVaciar() {
    vaciarCarrito()
    setModalVaciarAbierto(false)
  }

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <Breadcrumb
            navClassName="mb-2"
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Servicios', to: '/servicios' },
              { label: 'Mi reserva' },
            ]}
          />
          <div className="mb-4">
            <h1 className="section-title text-start mb-1">Mi Reserva</h1>
            <p className="text-muted mb-0">
              Revisa y confirma los servicios seleccionados para tu atención nutricional
            </p>
          </div>

          <div id="carrito-container">
            {carrito.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-3">
                <div className="mb-3">
                  <div
                    className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-cart3 fs-1" />
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-2">Tu carrito de reserva está vacío</h3>
                <p className="text-muted mx-auto mb-4" style={{ maxWidth: '480px' }}>
                  Aún no has agregado ningún servicio o consulta. Explora nuestras opciones y
                  agenda tu atención nutricional hoy mismo.
                </p>
                <div>
                  <Link
                    to="/servicios"
                    className="btn btn-success rounded-pill px-4 py-2 fw-semibold"
                  >
                    <i className="bi bi-grid me-2" />
                    Explorar catálogo de servicios
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-3">
                    <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark">
                        <i className="bi bi-calendar2-check text-success me-2" />
                        Servicios seleccionados ({carrito.length})
                      </span>
                      <button
                        className="btn btn-sm text-danger text-decoration-none fw-semibold p-0"
                        onClick={() => setModalVaciarAbierto(true)}
                        title="Vaciar todo el carrito"
                      >
                        <i className="bi bi-trash3 me-1" />
                        Vaciar carrito
                      </button>
                    </div>

                    {/* TABLA DESKTOP */}
                    <div className="card-body p-0 carrito-desktop-table d-none d-md-block">
                      <div className="table-responsive">
                        <table className="table align-middle mb-0">
                          <thead className="table-light text-muted small text-uppercase">
                            <tr>
                              <th className="ps-4 py-3" style={{ minWidth: '250px' }}>
                                Servicio
                              </th>
                              <th className="py-3 text-center" style={{ minWidth: '140px' }}>
                                Cantidad
                              </th>
                              <th className="py-3 text-end" style={{ minWidth: '120px' }}>
                                Subtotal
                              </th>
                              <th className="pe-4 py-3 text-end" style={{ width: '50px' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {carrito.map((servicio) => {
                              const cupos = cupoDisponible(servicio.codigo)
                              return (
                                <tr className="border-bottom" key={servicio.codigo}>
                                  <td className="ps-4 py-3">
                                    <div className="d-flex align-items-center gap-3">
                                      <div
                                        className="bg-light rounded-3 text-success d-flex align-items-center justify-content-center"
                                        style={{ width: '44px', height: '44px', flexShrink: 0 }}
                                      >
                                        <i className={`bi ${getTipoIcon(servicio.tipo)} fs-5`} />
                                      </div>
                                      <div>
                                        <Link
                                          to={`/servicios/${servicio.codigo}`}
                                          className="text-decoration-none text-dark fw-bold d-block mb-1"
                                        >
                                          {servicio.nombre}
                                        </Link>
                                        <div className="d-flex flex-wrap gap-2 align-items-center">
                                          <span className={`badge ${getBadgeClass(servicio.tipo)} rounded-pill`}>
                                            {servicio.tipo}
                                          </span>
                                          <span className="text-muted small">
                                            <i className="bi bi-clock me-1" />
                                            {servicio.duracion}
                                          </span>
                                          <span className="text-muted small">•</span>
                                          <span className="text-muted small">
                                            {formatPrecio(servicio.precio)} c/u
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 text-center">
                                    <div className="d-inline-flex align-items-center bg-light border rounded-pill px-2 py-1">
                                      <button
                                        className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none"
                                        onClick={() => reducirDesdeCarrito(servicio.codigo)}
                                        title="Disminuir cantidad"
                                        style={{ fontSize: '1rem', lineHeight: 1 }}
                                      >
                                        <i className="bi bi-dash-lg" />
                                      </button>
                                      <span
                                        className="fw-bold px-2 text-dark"
                                        style={{ minWidth: '24px', textAlign: 'center' }}
                                      >
                                        {servicio.cantidad}
                                      </span>
                                      {cupos > 0 ? (
                                        <button
                                          className="btn btn-sm btn-link text-success p-0 px-2 text-decoration-none"
                                          onClick={() => agregarDesdeCarrito(servicio.codigo)}
                                          title="Aumentar cantidad"
                                          style={{ fontSize: '1rem', lineHeight: 1 }}
                                        >
                                          <i className="bi bi-plus-lg" />
                                        </button>
                                      ) : (
                                        <button
                                          className="btn btn-sm btn-link text-muted p-0 px-2 text-decoration-none"
                                          disabled
                                          title="Sin cupos disponibles"
                                          style={{ fontSize: '1rem', lineHeight: 1 }}
                                        >
                                          <i className="bi bi-plus-lg" />
                                        </button>
                                      )}
                                    </div>
                                    {cupos <= 2 && cupos > 0 && (
                                      <div
                                        className="text-warning small mt-1"
                                        style={{ fontSize: '0.72rem' }}
                                      >
                                        ¡Últimos {cupos} cupos!
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 text-end">
                                    <span className="fw-bold text-dark fs-6">
                                      {formatPrecio(servicio.precio * servicio.cantidad)}
                                    </span>
                                  </td>
                                  <td className="pe-4 py-3 text-end">
                                    <button
                                      className="btn btn-sm btn-outline-danger border-0 rounded-circle d-inline-flex align-items-center justify-content-center"
                                      style={{ width: '32px', height: '32px' }}
                                      onClick={() => eliminarDelCarritoCompleto(servicio.codigo)}
                                      title="Eliminar servicio"
                                    >
                                      <i className="bi bi-trash" />
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* CARDS MOBILE */}
                    <div className="card-body p-3 carrito-mobile-card d-md-none">
                      {carrito.map((servicio) => {
                        const cupos = cupoDisponible(servicio.codigo)
                        return (
                          <div className="border rounded-3 p-3 mb-3" key={servicio.codigo}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="flex-grow-1">
                                <Link
                                  to={`/servicios/${servicio.codigo}`}
                                  className="text-decoration-none text-dark fw-bold d-block mb-1"
                                >
                                  {servicio.nombre}
                                </Link>
                                <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                                  <span className={`badge ${getBadgeClass(servicio.tipo)} rounded-pill`}>
                                    {servicio.tipo}
                                  </span>
                                  <span className="text-muted small">
                                    <i className="bi bi-clock me-1" />
                                    {servicio.duracion}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="btn btn-sm btn-outline-danger border-0 rounded-circle flex-shrink-0 ms-2"
                                style={{ width: '32px', height: '32px' }}
                                onClick={() => eliminarDelCarritoCompleto(servicio.codigo)}
                                title="Eliminar"
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-inline-flex align-items-center bg-light border rounded-pill px-2 py-1">
                                <button
                                  className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none"
                                  onClick={() => reducirDesdeCarrito(servicio.codigo)}
                                  style={{ fontSize: '1rem', lineHeight: 1 }}
                                >
                                  <i className="bi bi-dash-lg" />
                                </button>
                                <span
                                  className="fw-bold px-2 text-dark"
                                  style={{ minWidth: '24px', textAlign: 'center' }}
                                >
                                  {servicio.cantidad}
                                </span>
                                {cupos > 0 ? (
                                  <button
                                    className="btn btn-sm btn-link text-success p-0 px-2 text-decoration-none"
                                    onClick={() => agregarDesdeCarrito(servicio.codigo)}
                                    style={{ fontSize: '1rem', lineHeight: 1 }}
                                  >
                                    <i className="bi bi-plus-lg" />
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-link text-muted p-0 px-2 text-decoration-none"
                                    disabled
                                    style={{ fontSize: '1rem', lineHeight: 1 }}
                                  >
                                    <i className="bi bi-plus-lg" />
                                  </button>
                                )}
                              </div>
                              <span className="fw-bold text-success">
                                {formatPrecio(servicio.precio * servicio.cantidad)}
                              </span>
                            </div>
                            {cupos <= 2 && cupos > 0 && (
                              <div className="text-warning small mt-2" style={{ fontSize: '0.72rem' }}>
                                ¡Últimos {cupos} cupos!
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Link to="/servicios" className="btn btn-outline-secondary rounded-pill px-4">
                      <i className="bi bi-arrow-left me-2" />
                      Agregar más servicios
                    </Link>
                    <span className="text-muted small d-none d-sm-inline">
                      <i className="bi bi-info-circle me-1" />
                      Precios en pesos chilenos (CLP)
                    </span>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div
                    className="card border-0 shadow-sm rounded-4 bg-white p-4 carrito-sidebar position-sticky"
                    style={{ top: '95px' }}
                  >
                    <h5 className="fw-bold text-dark mb-3">Resumen de reserva</h5>

                    <div className="d-flex justify-content-between text-muted mb-2">
                      <span>Servicios distintos</span>
                      <span className="fw-semibold text-dark">{carrito.length}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-3">
                      <span>Total sesiones / cupos</span>
                      <span className="fw-semibold text-dark">{totalUnidades}</span>
                    </div>

                    <hr className="my-3 text-secondary opacity-25" />

                    <div className="d-flex justify-content-between align-items-baseline mb-4">
                      <div>
                        <span className="text-muted small d-block">Total estimado</span>
                        <span className="fw-bold fs-3 text-success">{formatPrecio(total)}</span>
                      </div>
                      <span className="badge bg-light text-muted border">CLP</span>
                    </div>

                    <button
                      className="btn btn-success w-100 rounded-pill fw-medium py-2 mb-2"
                      onClick={manejarConfirmarReserva}
                    >
                      <i className="bi bi-calendar-check me-2" />
                      Confirmar reserva(s)
                    </button>

                    <Link
                      to="/servicios"
                      className="btn btn-light border w-100 rounded-pill fw-medium py-2 mb-3 text-muted"
                    >
                      <i className="bi bi-plus-circle me-1" />
                      Ver otros servicios
                    </Link>

                    <div className="p-3 bg-light rounded-3 text-muted small mt-2">
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-shield-check text-success fs-5 flex-shrink-0 mt-n1" />
                        <div>
                          <strong className="d-block text-dark mb-1">Reserva garantizada</strong>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                            Atención personalizada con nutricionistas certificados. Confirmación
                            inmediata tras agendar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal confirmar vaciar */}
      <AppModal show={modalVaciarAbierto} onHide={() => setModalVaciarAbierto(false)}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">
                <i className="bi bi-trash text-danger me-2" />
                Vaciar carrito
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalVaciarAbierto(false)}
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body text-muted">
              ¿Estás seguro de que deseas eliminar todos los servicios de tu carrito de reservas?
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={() => setModalVaciarAbierto(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-pill px-4"
                onClick={manejarConfirmarVaciar}
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </AppModal>

      {/* Modal login requerido */}
      <AppModal show={modalLoginAbierto} onHide={() => setModalLoginAbierto(false)}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">
                <i className="bi bi-person-lock text-warning me-2" />
                Inicio de sesión requerido
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalLoginAbierto(false)}
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body text-muted">
              Debes iniciar sesión con tu cuenta para poder confirmar y registrar tu reserva.
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={() => setModalLoginAbierto(false)}
              >
                Cancelar
              </button>
              <Link to="/login" className="btn btn-success rounded-pill px-4">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </AppModal>

      {/* Modal éxito reserva */}
      <AppModal show={modalExitoAbierto} onHide={() => setModalExitoAbierto(false)}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow text-center p-4">
            <div className="mb-3">
              <div
                className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center icon-circle"
                style={{ width: '70px', height: '70px' }}
              >
                <i className="bi bi-check-circle fs-1" />
              </div>
            </div>
            <h4 className="fw-bold text-dark mb-2">¡Reserva(s) confirmada!</h4>
            <p className="text-muted mb-4">
              Tus servicios han sido agendados exitosamente. Te esperamos en Clínica NutriVida.
            </p>
            <div>
              <button
                type="button"
                className="btn btn-success rounded-pill px-5"
                onClick={() => {
                  setModalExitoAbierto(false)
                  navigate('/')
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </AppModal>
    </main>
  )
}
