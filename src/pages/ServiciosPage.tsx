/**
 * Catálogo público: filtros combinados (categoría, precio y búsqueda libre),
 * tarjetas de producto y alta de ítems al carrito revalidando cupos.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRECIO_MAX, PRECIO_MIN } from '../constants'
import { getBadgeClass, getTipoIcon } from '../data/servicios'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'
import Breadcrumb from '../layout/Breadcrumb'
import { obtenerCategorias, obtenerProductos } from '../services/storage'
import { formatPrecio } from '../utils/format'

export default function ServiciosPage() {
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroBusqueda, setFiltroBusqueda] = useState('')
  const { agregarAlCarrito, cupoDisponible } = useCart()
  const { showToast } = useToast()

  const productos = useMemo(() => obtenerProductos(), [])
  const categorias = useMemo(() => obtenerCategorias(), [])
  // Tope del slider: el mayor entre el precio sembrado y los precios reales
  // del catálogo, para que productos nuevos más caros sigan siendo filtrables.
  const precioTope = useMemo(
    () => Math.max(PRECIO_MAX, ...productos.map((p) => p.precio)),
    [productos],
  )
  const [filtroPrecioMax, setFiltroPrecioMax] = useState(precioTope)

  // Filtros en cascada: categoría → precio máximo → búsqueda por texto libre.
  const filtrados = useMemo(() => {
    let lista =
      filtroTipo === 'todos' ? [...productos] : productos.filter((s) => s.tipo === filtroTipo)
    lista = lista.filter((s) => s.precio <= filtroPrecioMax)
    if (filtroBusqueda.trim() !== '') {
      const q = filtroBusqueda.toLowerCase().trim()
      lista = lista.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.descripcion.toLowerCase().includes(q) ||
          s.tipo.toLowerCase().includes(q) ||
          s.modalidad.toLowerCase().includes(q),
      )
    }
    return lista
  }, [productos, filtroTipo, filtroPrecioMax, filtroBusqueda])

  function restablecerFiltros() {
    setFiltroTipo('todos')
    setFiltroPrecioMax(precioTope)
    setFiltroBusqueda('')
  }

  function agregarDesdeCatalogo(codigo: string) {
    const servicio = productos.find((s) => s.codigo === codigo)
    if (!servicio) return
    const disponibles = cupoDisponible(codigo)
    if (disponibles <= 0) {
      showToast(`"${servicio.nombre}" no tiene cupos disponibles`, 'danger')
      return
    }
    agregarAlCarrito(servicio)
    showToast(`"${servicio.nombre}" agregado a tu reserva`, 'success')
  }

  return (
    <main className="pt-5">
      {/* HERO / ENCABEZADO DE SERVICIOS */}
      <section className="servicios-hero mt-3">
        <div className="container text-center">
          <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Servicios' }]} centered />
          <h1 className="section-title mb-2">Nuestros Servicios</h1>
          <p className="section-subtitle mb-3">
            Encuentra la atención nutricional personalizada que se adapta a tus metas y estilo de
            vida
          </p>

          <div className="d-flex justify-content-center flex-wrap gap-2 pt-1">
            <span className="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill">
              <i className="bi bi-shield-check text-success me-1" /> Profesionales acreditados
            </span>
            <span className="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill">
              <i className="bi bi-camera-video text-success me-1" /> Presencial y Online
            </span>
            <span className="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill">
              <i className="bi bi-heart-pulse text-success me-1" /> Planes a tu medida
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL: FILTROS Y CATÁLOGO */}
      <section className="py-5">
        <div className="container">
          {/* BARRA DE FILTROS */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-search" />
                  </span>
                  <input
                    type="text"
                    id="buscador-servicio"
                    className="form-control bg-light border-start-0"
                    placeholder="Buscar servicio..."
                    value={filtroBusqueda}
                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-tag" />
                  </span>
                  <select
                    id="filtro-categoria"
                    className="form-select bg-light border-start-0"
                    aria-label="Seleccionar categoría"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="todos">Todas las categorías</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 col-sm-8 col-lg-4">
                <div className="d-flex align-items-center gap-2 px-1">
                  <span className="text-muted small text-nowrap">
                    Hasta: <strong id="precio-valor" className="text-success">{formatPrecio(filtroPrecioMax)}</strong>
                  </span>
                  <input
                    type="range"
                    className="form-range flex-grow-1"
                    id="precio-max"
                    min={PRECIO_MIN}
                    max={precioTope}
                    step={5000}
                    value={filtroPrecioMax}
                    aria-label="Precio máximo"
                    onChange={(e) => setFiltroPrecioMax(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-4 col-lg-2 text-sm-end">
                <button
                  className="btn btn-outline-secondary rounded-pill w-100"
                  id="btn-reset"
                  title="Restablecer filtros"
                  onClick={restablecerFiltros}
                >
                  <i className="bi bi-arrow-counterclockwise me-1" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* CONTADOR */}
          <div className="d-flex justify-content-between align-items-center mb-4 text-muted small">
            <span id="contador-servicios">
              <strong className="text-dark">{filtrados.length}</strong>{' '}
              {filtrados.length === 1 ? 'servicio disponible' : 'servicios disponibles'}
            </span>
            <span className="d-none d-sm-inline">
              <i className="bi bi-info-circle me-1" />
              Precios en pesos chilenos (CLP)
            </span>
          </div>

          {/* CATÁLOGO */}
          <div className="row g-4" id="catalogo">
            {filtrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="p-5 bg-white rounded-4 shadow-sm border">
                  <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }} />
                  <h4 className="mt-3 fw-bold text-dark">No se encontraron servicios</h4>
                  <p className="text-muted mb-4">
                    No hay resultados que coincidan con tu búsqueda o los filtros seleccionados.
                  </p>
                  <button
                    className="btn btn-outline-success rounded-pill px-4"
                    onClick={restablecerFiltros}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1" />
                    Restablecer filtros
                  </button>
                </div>
              </div>
            ) : (
              filtrados.map((servicio) => {
                const cupos = cupoDisponible(servicio.codigo)
                const hayCupos = cupos > 0
                return (
                  <div className="col-md-6 col-lg-4" key={servicio.codigo}>
                    <div className="card card-catalogo h-100">
                      <div className="card-body d-flex flex-column p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className={`badge ${getBadgeClass(servicio.tipo)} rounded-pill px-3 py-1`}>
                            <i className={`bi ${getTipoIcon(servicio.tipo)} me-1`} />
                            {servicio.tipo}
                          </span>
                          <span
                            className={`badge ${hayCupos ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} rounded-pill px-2 py-1`}
                          >
                            <i className={`bi ${hayCupos ? 'bi-check-circle' : 'bi-x-circle'} me-1`} />
                            {hayCupos ? `${cupos} cupos` : 'Agotado'}
                          </span>
                        </div>

                        <h5 className="card-title fw-bold text-dark mb-2">{servicio.nombre}</h5>

                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {servicio.duracion && servicio.duracion !== '—' && (
                            <span className="badge bg-light text-secondary border fw-normal">
                              <i className="bi bi-clock me-1 text-primary" />
                              {servicio.duracion}
                            </span>
                          )}
                          <span className="badge bg-light text-secondary border fw-normal">
                            <i className="bi bi-geo-alt me-1 text-success" />
                            {servicio.modalidad}
                          </span>
                        </div>

                        <p className="card-text text-secondary small flex-grow-1 mb-4">
                          {servicio.descripcion}
                        </p>

                        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                          <div>
                            <span className="d-block text-muted small" style={{ fontSize: '0.75rem' }}>
                              Valor
                            </span>
                            <span className="fs-5 fw-bold text-dark">{formatPrecio(servicio.precio)}</span>
                          </div>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/servicios/${servicio.codigo}`}
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              title={`Ver detalles de ${servicio.nombre}`}
                            >
                              Detalle
                            </Link>
                            {hayCupos ? (
                              <button
                                className="btn btn-sm btn-success rounded-pill px-3 d-flex align-items-center gap-1"
                                onClick={() => agregarDesdeCatalogo(servicio.codigo)}
                                title="Agregar a reserva"
                              >
                                <i className="bi bi-cart-plus" /> Reservar
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-secondary rounded-pill px-3 disabled"
                                disabled
                                title="Sin cupos disponibles"
                              >
                                <i className="bi bi-x-circle" /> Agotado
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* ASESORÍA */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mt-5 bg-white">
            <div className="row align-items-center g-3">
              <div className="col-lg-8 text-center text-lg-start">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-2">
                  <span className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle icon-circle-sm">
                    <i className="bi bi-chat-dots fs-5" />
                  </span>
                  <h5 className="fw-bold mb-0 text-dark">¿Tienes dudas sobre qué servicio elegir?</h5>
                </div>
                <p className="text-muted mb-0 small">
                  Nuestro equipo puede guiarte para seleccionar la opción más adecuada para tus
                  necesidades de salud o rendimiento.
                </p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <Link to="/#contacto" className="btn btn-success rounded-pill px-4">
                  <i className="bi bi-envelope me-1" />
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
