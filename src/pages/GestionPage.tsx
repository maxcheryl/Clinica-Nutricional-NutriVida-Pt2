import { useState, type FormEvent } from 'react'
import { EDAD_MAXIMA, OPCIONES_GENERO, STOCK_MAXIMO } from '../constants'
import { useToast } from '../contexts/ToastContext'
import {
  agregarUsuario,
  actualizarProducto,
  buscarUsuarioPorCorreo,
  cuposRetenidos,
  obtenerCupoDisponible,
  obtenerProductos,
} from '../services/storage'
import type { Genero, Servicio } from '../types'
import PasswordInput from '../ui/PasswordInput'
import StockBadge from '../ui/StockBadge'
import { formatPrecio } from '../utils/format'
import { validarContrasena, esDominioDuoc, calcularEdad } from '../utils/validators'

type Pestana = 'stock' | 'clientes'

export default function GestionPage() {
  const { showToast } = useToast()
  const [pestana, setPestana] = useState<Pestana>('stock')
  const [productos, setProductos] = useState<Servicio[]>(() => obtenerProductos())
  const [stockEditado, setStockEditado] = useState<Record<string, number>>({})
  const [errorStock, setErrorStock] = useState<string | null>(null)
  const hoy = new Date().toISOString().split('T')[0]
  const fechaMinima = new Date()
  fechaMinima.setFullYear(fechaMinima.getFullYear() - EDAD_MAXIMA)
  const minFecha = fechaMinima.toISOString().split('T')[0]

  const [formCliente, setFormCliente] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    fechaNacimiento: '',
    contrasena: '',
    genero: '',
    region: '',
    direccion: '',
  })
  const [errorCliente, setErrorCliente] = useState<string | null>(null)

  function manejarStockChange(codigo: string, valor: number) {
    setErrorStock(null)
    setStockEditado({ ...stockEditado, [codigo]: valor })
  }

  function guardarStock(codigo: string) {
    setErrorStock(null)
    const nuevoStock = stockEditado[codigo]
    if (nuevoStock === undefined) return
    if (!Number.isInteger(nuevoStock) || nuevoStock < 0 || nuevoStock > STOCK_MAXIMO) {
      setErrorStock(`El stock de ${codigo} debe ser un número entero entre 0 y ${STOCK_MAXIMO}`)
      return
    }
    actualizarProducto(codigo, { cuposIniciales: nuevoStock + cuposRetenidos(codigo) })
    setProductos(obtenerProductos())
    setStockEditado({ ...stockEditado, [codigo]: undefined as unknown as number })
    showToast('Stock actualizado correctamente', 'success')
  }

  function manejarCrearCliente(e: FormEvent) {
    e.preventDefault()
    setErrorCliente(null)

    if (
      !formCliente.nombre.trim() ||
      !formCliente.apellido.trim() ||
      !formCliente.correo.trim() ||
      !formCliente.contrasena.trim() ||
      !formCliente.fechaNacimiento ||
      !formCliente.genero ||
      !formCliente.region.trim() ||
      !formCliente.direccion.trim()
    ) {
      setErrorCliente('Todos los campos son obligatorios')
      return
    }
    if (!esDominioDuoc(formCliente.correo.trim())) {
      setErrorCliente('El correo debe ser del dominio @duocuc.cl')
      return
    }
    if (!validarContrasena(formCliente.contrasena)) {
      setErrorCliente('La contraseña debe contener 8 carácteres, una mayúscula, una minúscula y un número')
      return
    }
    if (formCliente.fechaNacimiento > hoy) {
      setErrorCliente('La fecha de nacimiento no puede ser posterior al día de hoy')
      return
    }
    if (calcularEdad(formCliente.fechaNacimiento) < 14) {
      setErrorCliente('El usuario es solo para personas mayores a 14 años')
      return
    }
    if (calcularEdad(formCliente.fechaNacimiento) > EDAD_MAXIMA) {
      setErrorCliente(`La edad máxima permitida es de ${EDAD_MAXIMA} años`)
      return
    }
    if (buscarUsuarioPorCorreo(formCliente.correo.trim())) {
      setErrorCliente('El correo ya se encuentra registrado')
      return
    }

    agregarUsuario({
      id: crypto.randomUUID(),
      nombre: formCliente.nombre.trim(),
      apellido: formCliente.apellido.trim(),
      correo: formCliente.correo.trim(),
      fechaNacimiento: formCliente.fechaNacimiento,
      contrasena: formCliente.contrasena,
      genero: formCliente.genero as Genero | '',
      region: formCliente.region,
      direccion: formCliente.direccion.trim(),
      rol: 'cliente',
    })

    showToast('Cliente registrado correctamente', 'success')
    setFormCliente({
      nombre: '',
      apellido: '',
      correo: '',
      fechaNacimiento: '',
      contrasena: '',
      genero: '',
      region: '',
      direccion: '',
    })
  }

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <div className="mb-4">
            <h1 className="section-title text-start mb-1">Gestión</h1>
            <p className="text-muted mb-0">Administra el stock de productos y registra clientes</p>
          </div>

          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link${pestana === 'stock' ? ' active' : ''}`}
                onClick={() => setPestana('stock')}
              >
                <i className="bi bi-box me-1" />
                Stock de productos ({productos.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link${pestana === 'clientes' ? ' active' : ''}`}
                onClick={() => setPestana('clientes')}
              >
                <i className="bi bi-person-plus me-1" />
                Registrar cliente
              </button>
            </li>
          </ul>

          {/* PESTAÑA STOCK */}
          {pestana === 'stock' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-3 px-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-box-seam me-2" />
                  Stock de productos
                </h5>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock actual</th>
                        <th>Nuevo stock</th>
                        <th className="text-end">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.codigo}>
                          <td><code>{p.codigo}</code></td>
                          <td>{p.nombre}</td>
                          <td>{p.tipo}</td>
                          <td>{formatPrecio(p.precio)}</td>
                          <td>
                            <StockBadge
                              disponible={Math.max(0, obtenerCupoDisponible(p.codigo))}
                            />
                          </td>
                          <td style={{ width: '120px' }}>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              min={0}
                              max={STOCK_MAXIMO}
                              step={1}
                              value={
                                stockEditado[p.codigo] ??
                                Math.max(0, obtenerCupoDisponible(p.codigo))
                              }
                              onChange={(e) =>
                                manejarStockChange(
                                  p.codigo,
                                  e.target.value.trim() === '' ? Number.NaN : Number(e.target.value),
                                )
                              }
                            />
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-success rounded-pill"
                              onClick={() => guardarStock(p.codigo)}
                            >
                              <i className="bi bi-check-lg me-1" />
                              Guardar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {errorStock && (
                  <div className="alert alert-danger mt-3 mb-0">{errorStock}</div>
                )}
              </div>
            </div>
          )}

          {/* PESTAÑA REGISTRAR CLIENTE */}
          {pestana === 'clientes' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-3 px-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-person-plus me-2" />
                  Registrar cliente
                </h5>
              </div>
              <div className="card-body px-4 pb-4">
                <form onSubmit={manejarCrearCliente} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formCliente.nombre}
                        onChange={(e) => setFormCliente({ ...formCliente, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Apellido *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formCliente.apellido}
                        onChange={(e) => setFormCliente({ ...formCliente, apellido: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Correo *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="usuario@duocuc.cl"
                        value={formCliente.correo}
                        onChange={(e) => setFormCliente({ ...formCliente, correo: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contraseña *</label>
                      <PasswordInput
                        placeholder="Mín. 8 caracteres, mayúscula, minúscula y número"
                        value={formCliente.contrasena}
                        onChange={(v) => setFormCliente({ ...formCliente, contrasena: v })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fecha de nacimiento *</label>
                      <input
                        type="date"
                        className="form-control"
                        max={hoy}
                        min={minFecha}
                        value={formCliente.fechaNacimiento}
                        onChange={(e) =>
                          setFormCliente({ ...formCliente, fechaNacimiento: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Región *</label>
                      <select
                        className="form-select"
                        value={formCliente.region}
                        onChange={(e) => setFormCliente({ ...formCliente, region: e.target.value })}
                      >
                        <option value="">Selecciona</option>
                        <option value="Metropolitana">Metropolitana</option>
                        <option value="Biobio">Biobío</option>
                        <option value="Araucania">La Araucanía</option>
                        <option value="Valparaiso">Valparaíso</option>
                        <option value="Coquimbo">Coquimbo</option>
                        <option value="Maule">Maule</option>
                        <option value="Antofagasta">Antofagasta</option>
                        <option value="Atacama">Atacama</option>
                        <option value="Arica">Arica y Parinacota</option>
                        <option value="Tarapaca">Tarapacá</option>
                        <option value="O'Higgins">O'Higgins</option>
                        <option value="Nuble">Ñuble</option>
                        <option value="Rios">Los Ríos</option>
                        <option value="Lagos">Los Lagos</option>
                        <option value="Aysen">Aysén</option>
                        <option value="Magallanes">Magallanes</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Género *</label>
                      <select
                        className="form-select"
                        value={formCliente.genero}
                        onChange={(e) => setFormCliente({ ...formCliente, genero: e.target.value })}
                      >
                        <option value="">Selecciona</option>
                        {OPCIONES_GENERO.map((g) => (
                          <option key={g.valor} value={g.valor}>
                            {g.etiqueta}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Dirección *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formCliente.direccion}
                        onChange={(e) => setFormCliente({ ...formCliente, direccion: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <span className="badge bg-info text-dark rounded-pill">
                        El usuario se creará con rol Cliente
                      </span>
                    </div>
                  </div>
                  {errorCliente && <div className="alert alert-danger mt-3 mb-0">{errorCliente}</div>}
                  <div className="mt-4">
                    <button type="submit" className="btn btn-success rounded-pill px-4">
                      <i className="bi bi-person-plus me-1" />
                      Registrar cliente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
