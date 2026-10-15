import { useState, type FormEvent } from 'react'
import { OPCIONES_ROL } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import {
  agregarCategoria,
  agregarProducto,
  agregarUsuario,
  actualizarCategoria,
  actualizarProducto,
  actualizarUsuario,
  buscarUsuarioPorCorreo,
  eliminarCategoria,
  eliminarProducto,
  eliminarUsuario,
  obtenerCategorias,
  obtenerProductos,
  obtenerUsuarios,
} from '../services/storage'
import type { Categoria, RolUsuario, Servicio, Usuario } from '../types'
import AppModal from '../ui/AppModal'
import PasswordInput from '../ui/PasswordInput'
import { formatPrecio } from '../utils/format'
import { validarContrasena, esDominioDuoc } from '../utils/validators'

type Pestana = 'usuarios' | 'productos' | 'categorias'

const USUARIO_VACIO: Omit<Usuario, 'id'> = {
  nombre: '',
  apellido: '',
  correo: '',
  fechaNacimiento: '',
  contrasena: '',
  genero: '',
  region: '',
  direccion: '',
  rol: 'cliente',
}

const PRODUCTO_VACIO: Omit<Servicio, 'codigo'> = {
  tipo: '',
  nombre: '',
  duracion: '',
  modalidad: 'Presencial',
  precio: 0,
  cuposIniciales: 0,
  descripcion: '',
}

export default function PanelAdministracionPage() {
  const { showToast } = useToast()
  const { usuario } = useAuth()
  const [pestana, setPestana] = useState<Pestana>('usuarios')

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => obtenerUsuarios())
  const [productos, setProductos] = useState<Servicio[]>(() => obtenerProductos())
  const [categorias, setCategorias] = useState<Categoria[]>(() => obtenerCategorias())

  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [formUsuario, setFormUsuario] = useState(USUARIO_VACIO)
  const [modalPropiaCuentaAbierto, setModalPropiaCuentaAbierto] = useState(false)
  const [confirmacion, setConfirmacion] = useState<{
    mensaje: string
    onConfirmar: () => void
  } | null>(null)

  const [modalProductoAbierto, setModalProductoAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Servicio | null>(null)
  const [formProducto, setFormProducto] = useState(PRODUCTO_VACIO)

  const [modalCategoriaAbierto, setModalCategoriaAbierto] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
  const [nombreCategoria, setNombreCategoria] = useState('')

  const [errorForm, setErrorForm] = useState<string | null>(null)

  function refrescar() {
    setUsuarios(obtenerUsuarios())
    setProductos(obtenerProductos())
    setCategorias(obtenerCategorias())
  }

  // ==================== USUARIOS ====================
  function abrirNuevoUsuario() {
    setUsuarioEditando(null)
    setFormUsuario(USUARIO_VACIO)
    setErrorForm(null)
    setModalUsuarioAbierto(true)
  }

  function abrirEditarUsuario(u: Usuario) {
    setUsuarioEditando(u)
    setFormUsuario({
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      fechaNacimiento: u.fechaNacimiento,
      contrasena: u.contrasena,
      genero: u.genero,
      region: u.region,
      direccion: u.direccion,
      rol: u.rol,
    })
    setErrorForm(null)
    setModalUsuarioAbierto(true)
  }

  function guardarUsuario(e: FormEvent) {
    e.preventDefault()
    setErrorForm(null)

    if (
      !formUsuario.nombre.trim() ||
      !formUsuario.apellido.trim() ||
      !formUsuario.correo.trim() ||
      !formUsuario.contrasena.trim() ||
      !formUsuario.region.trim() ||
      !formUsuario.direccion.trim()
    ) {
      setErrorForm('Todos los campos son obligatorios')
      return
    }
    if (!esDominioDuoc(formUsuario.correo.trim())) {
      setErrorForm('El correo debe ser del dominio @duocuc.cl')
      return
    }
    if (!validarContrasena(formUsuario.contrasena)) {
      setErrorForm('La contraseña debe contener 8 carácteres, una mayúscula, una minúscula y un número')
      return
    }
    if (!usuarioEditando && buscarUsuarioPorCorreo(formUsuario.correo.trim())) {
      setErrorForm('El correo ya se encuentra registrado')
      return
    }

    const editandoCuentaPropia = Boolean(usuarioEditando && esUsuarioActual(usuarioEditando.correo))

    if (usuarioEditando) {
      actualizarUsuario(usuarioEditando.correo, {
        ...formUsuario,
        rol: editandoCuentaPropia && usuario ? usuario.rol : formUsuario.rol,
        correo: formUsuario.correo.trim(),
      })
      showToast('Usuario actualizado correctamente', 'success')
    } else {
      agregarUsuario({
        id: crypto.randomUUID(),
        ...formUsuario,
        correo: formUsuario.correo.trim(),
      })
      showToast('Usuario creado correctamente', 'success')
    }
    setModalUsuarioAbierto(false)
    refrescar()
  }

  function esUsuarioActual(correo: string): boolean {
    return Boolean(usuario && correo.toLowerCase() === usuario.correo.toLowerCase())
  }

  function pedirConfirmacion(mensaje: string, onConfirmar: () => void) {
    setConfirmacion({ mensaje, onConfirmar })
  }

  function manejarEliminarUsuario(correo: string) {
    if (esUsuarioActual(correo)) {
      setModalPropiaCuentaAbierto(true)
      return
    }
    pedirConfirmacion(`¿Eliminar al usuario ${correo}?`, () => {
      eliminarUsuario(correo)
      showToast('Usuario eliminado', 'warning')
      refrescar()
    })
  }

  // ==================== PRODUCTOS ====================
  function abrirNuevoProducto() {
    setProductoEditando(null)
    setFormProducto({ ...PRODUCTO_VACIO, tipo: categorias[0]?.nombre ?? '' })
    setErrorForm(null)
    setModalProductoAbierto(true)
  }

  function abrirEditarProducto(p: Servicio) {
    setProductoEditando(p)
    setFormProducto({
      tipo: p.tipo,
      nombre: p.nombre,
      duracion: p.duracion,
      modalidad: p.modalidad,
      precio: p.precio,
      cuposIniciales: p.cuposIniciales,
      descripcion: p.descripcion,
    })
    setErrorForm(null)
    setModalProductoAbierto(true)
  }

  function guardarProducto(e: FormEvent) {
    e.preventDefault()
    setErrorForm(null)

    if (
      !formProducto.nombre.trim() ||
      !formProducto.tipo ||
      formProducto.precio <= 0 ||
      formProducto.cuposIniciales < 0
    ) {
      setErrorForm('Completa los campos obligatorios (nombre, categoría, precio, stock)')
      return
    }

    if (productoEditando) {
      actualizarProducto(productoEditando.codigo, formProducto)
      showToast('Producto actualizado correctamente', 'success')
    } else {
      const prefijo = formProducto.tipo.charAt(0).toUpperCase() + formProducto.tipo.charAt(1)
      const codigo = `${prefijo}${Date.now().toString().slice(-4)}`
      agregarProducto({ codigo, ...formProducto })
      showToast('Producto creado correctamente', 'success')
    }
    setModalProductoAbierto(false)
    refrescar()
  }

  function manejarEliminarProducto(codigo: string) {
    pedirConfirmacion(`¿Eliminar el producto ${codigo}?`, () => {
      eliminarProducto(codigo)
      showToast('Producto eliminado', 'warning')
      refrescar()
    })
  }

  // ==================== CATEGORÍAS ====================
  function abrirNuevaCategoria() {
    setCategoriaEditando(null)
    setNombreCategoria('')
    setErrorForm(null)
    setModalCategoriaAbierto(true)
  }

  function abrirEditarCategoria(c: Categoria) {
    setCategoriaEditando(c)
    setNombreCategoria(c.nombre)
    setErrorForm(null)
    setModalCategoriaAbierto(true)
  }

  function guardarCategoria(e: FormEvent) {
    e.preventDefault()
    setErrorForm(null)

    if (!nombreCategoria.trim()) {
      setErrorForm('El nombre es obligatorio')
      return
    }

    const duplicada = categorias.some(
      (c) => c.nombre.toLowerCase() === nombreCategoria.trim().toLowerCase() && c.id !== categoriaEditando?.id
    )
    if (duplicada) {
      setErrorForm('Ya existe una categoría con ese nombre')
      return
    }

    if (categoriaEditando) {
      actualizarCategoria(categoriaEditando.id, nombreCategoria.trim())
      showToast('Categoría actualizada', 'success')
    } else {
      agregarCategoria(nombreCategoria.trim())
      showToast('Categoría creada', 'success')
    }
    setModalCategoriaAbierto(false)
    refrescar()
  }

  function manejarEliminarCategoria(id: string) {
    const cat = categorias.find((c) => c.id === id)
    if (!cat) return
    pedirConfirmacion(`¿Eliminar la categoría "${cat.nombre}"?`, () => {
      const ok = eliminarCategoria(id)
      if (ok) {
        showToast('Categoría eliminada', 'warning')
      } else {
        showToast(`No se puede eliminar: hay productos usando "${cat.nombre}"`, 'danger')
      }
      refrescar()
    })
  }

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container-fluid px-3 px-md-4">
          <div className="mb-4">
            <h1 className="section-title text-start mb-1">Panel de Administración</h1>
            <p className="text-muted mb-0">Gestiona usuarios, productos y categorías de la tienda</p>
          </div>

          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link${pestana === 'usuarios' ? ' active' : ''}`}
                onClick={() => setPestana('usuarios')}
              >
                <i className="bi bi-people me-1" />
                Usuarios ({usuarios.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link${pestana === 'productos' ? ' active' : ''}`}
                onClick={() => setPestana('productos')}
              >
                <i className="bi bi-box me-1" />
                Productos ({productos.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link${pestana === 'categorias' ? ' active' : ''}`}
                onClick={() => setPestana('categorias')}
              >
                <i className="bi bi-tags me-1" />
                Categorías ({categorias.length})
              </button>
            </li>
          </ul>

          {/* PESTAÑA USUARIOS */}
          {pestana === 'usuarios' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Usuarios registrados</h5>
                <button className="btn btn-success rounded-pill px-4" onClick={abrirNuevoUsuario}>
                  <i className="bi bi-person-plus me-1" />
                  Nuevo usuario
                </button>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Región</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u.correo}>
                          <td>{u.nombre} {u.apellido}</td>
                          <td>{u.correo}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                u.rol === 'administrador'
                                  ? 'bg-danger'
                                  : u.rol === 'recepcionista'
                                    ? 'bg-warning text-dark'
                                    : 'bg-success'
                              }`}
                            >
                              {u.rol}
                            </span>
                          </td>
                          <td>{u.region}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill me-2"
                              onClick={() => abrirEditarUsuario(u)}
                            >
                              <i className="bi bi-pencil me-1" />
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => manejarEliminarUsuario(u.correo)}
                            >
                              <i className="bi bi-trash me-1" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA PRODUCTOS */}
          {pestana === 'productos' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Productos</h5>
                <button className="btn btn-success rounded-pill px-4" onClick={abrirNuevoProducto}>
                  <i className="bi bi-plus-lg me-1" />
                  Nuevo producto
                </button>
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
                        <th>Stock</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.codigo}>
                          <td><code>{p.codigo}</code></td>
                          <td>{p.nombre}</td>
                          <td>{p.tipo}</td>
                          <td>{formatPrecio(p.precio)}</td>
                          <td>{p.cuposIniciales}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill me-2"
                              onClick={() => abrirEditarProducto(p)}
                            >
                              <i className="bi bi-pencil me-1" />
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => manejarEliminarProducto(p.codigo)}
                            >
                              <i className="bi bi-trash me-1" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA CATEGORÍAS */}
          {pestana === 'categorias' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Categorías</h5>
                <button className="btn btn-success rounded-pill px-4" onClick={abrirNuevaCategoria}>
                  <i className="bi bi-plus-lg me-1" />
                  Nueva categoría
                </button>
              </div>
              <div className="card-body px-4 pb-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Productos asociados</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((c) => (
                        <tr key={c.id}>
                          <td>{c.nombre}</td>
                          <td>{productos.filter((p) => p.tipo === c.nombre).length}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill me-2"
                              onClick={() => abrirEditarCategoria(c)}
                            >
                              <i className="bi bi-pencil me-1" />
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => manejarEliminarCategoria(c.id)}
                            >
                              <i className="bi bi-trash me-1" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL USUARIO */}
      <AppModal show={modalUsuarioAbierto} onHide={() => setModalUsuarioAbierto(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">
                {usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalUsuarioAbierto(false)}
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body">
              {errorForm && <div className="alert alert-danger">{errorForm}</div>}
              <form onSubmit={guardarUsuario}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formUsuario.nombre}
                      onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellido *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formUsuario.apellido}
                      onChange={(e) => setFormUsuario({ ...formUsuario, apellido: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formUsuario.correo}
                      onChange={(e) => setFormUsuario({ ...formUsuario, correo: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contraseña *</label>
                    <PasswordInput
                      value={formUsuario.contrasena}
                      onChange={(v) => setFormUsuario({ ...formUsuario, contrasena: v })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formUsuario.fechaNacimiento}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setFormUsuario({ ...formUsuario, fechaNacimiento: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rol *</label>
                    <select
                      className="form-select"
                      value={formUsuario.rol}
                      disabled={Boolean(usuarioEditando && esUsuarioActual(usuarioEditando.correo))}
                      onChange={(e) =>
                        setFormUsuario({ ...formUsuario, rol: e.target.value as RolUsuario })
                      }
                    >
                      {OPCIONES_ROL.map((r) => (
                        <option key={r.valor} value={r.valor}>
                          {r.etiqueta}
                        </option>
                      ))}
                    </select>
                    {usuarioEditando && esUsuarioActual(usuarioEditando.correo) && (
                      <small className="text-muted">No puedes cambiar tu propio rol</small>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Región *</label>
                    <select
                      className="form-select"
                      value={formUsuario.region}
                      onChange={(e) => setFormUsuario({ ...formUsuario, region: e.target.value })}
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
                  <div className="col-12">
                    <label className="form-label">Dirección *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formUsuario.direccion}
                      onChange={(e) => setFormUsuario({ ...formUsuario, direccion: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-3 px-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setModalUsuarioAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4">
                    {usuarioEditando ? 'Guardar cambios' : 'Crear usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AppModal>

      {/* MODAL PRODUCTO */}
      <AppModal show={modalProductoAbierto} onHide={() => setModalProductoAbierto(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">
                {productoEditando ? 'Editar producto' : 'Nuevo producto'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalProductoAbierto(false)}
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body">
              {errorForm && <div className="alert alert-danger">{errorForm}</div>}
              <form onSubmit={guardarProducto}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formProducto.nombre}
                      onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Categoría *</label>
                    <select
                      className="form-select"
                      value={formProducto.tipo}
                      onChange={(e) => setFormProducto({ ...formProducto, tipo: e.target.value })}
                    >
                      <option value="">Selecciona</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.nombre}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Precio (CLP) *</label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      value={formProducto.precio}
                      onChange={(e) =>
                        setFormProducto({ ...formProducto, precio: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      value={formProducto.cuposIniciales}
                      onChange={(e) =>
                        setFormProducto({ ...formProducto, cuposIniciales: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Duración</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: 50 min"
                      value={formProducto.duracion}
                      onChange={(e) => setFormProducto({ ...formProducto, duracion: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Modalidad</label>
                    <select
                      className="form-select"
                      value={formProducto.modalidad}
                      onChange={(e) =>
                        setFormProducto({ ...formProducto, modalidad: e.target.value })
                      }
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Online (video)">Online (video)</option>
                      <option value="Presencial (grupo)">Presencial (grupo)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formProducto.descripcion}
                      onChange={(e) =>
                        setFormProducto({ ...formProducto, descripcion: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-3 px-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setModalProductoAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4">
                    {productoEditando ? 'Guardar cambios' : 'Crear producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AppModal>

      {/* MODAL CATEGORÍA */}
      <AppModal show={modalCategoriaAbierto} onHide={() => setModalCategoriaAbierto(false)}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">
                {categoriaEditando ? 'Editar categoría' : 'Nueva categoría'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalCategoriaAbierto(false)}
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body">
              {errorForm && <div className="alert alert-danger">{errorForm}</div>}
              <form onSubmit={guardarCategoria}>
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombreCategoria}
                  onChange={(e) => setNombreCategoria(e.target.value)}
                />
                <div className="modal-footer border-0 pt-3 px-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setModalCategoriaAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4">
                    {categoriaEditando ? 'Guardar cambios' : 'Crear categoría'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AppModal>

      {/* MODAL NO ELIMINAR CUENTA PROPIA */}
      <AppModal
        show={modalPropiaCuentaAbierto}
        onHide={() => setModalPropiaCuentaAbierto(false)}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">Eliminar usuario</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalPropiaCuentaAbierto(false)}
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body text-center">
              <i
                className="bi bi-exclamation-triangle-fill text-danger"
                style={{ fontSize: '3rem' }}
              />
              <p className="fw-bold text-dark mt-3 mb-0">No puedes eliminarte a ti mismo</p>
              <small className="text-muted">
                Tu cuenta de administrador debe permanecer activa para gestionar el sistema.
              </small>
            </div>
            <div className="modal-footer border-0 pt-2 justify-content-center">
              <button
                type="button"
                className="btn btn-success rounded-pill px-4"
                onClick={() => setModalPropiaCuentaAbierto(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </AppModal>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <AppModal show={confirmacion !== null} onHide={() => setConfirmacion(null)}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">Confirmar eliminación</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setConfirmacion(null)}
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body text-center">
              <i
                className="bi bi-exclamation-triangle-fill text-danger"
                style={{ fontSize: '3rem' }}
              />
              <p className="fw-bold text-dark mt-3 mb-0">{confirmacion?.mensaje}</p>
              <small className="text-muted">Esta acción no se puede deshacer.</small>
            </div>
            <div className="modal-footer border-0 pt-2 justify-content-center">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={() => setConfirmacion(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-pill px-4"
                onClick={() => {
                  confirmacion?.onConfirmar()
                  setConfirmacion(null)
                }}
              >
                <i className="bi bi-trash me-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </AppModal>
    </main>
  )
}
