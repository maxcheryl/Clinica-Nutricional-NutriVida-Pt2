import { useState, type FormEvent } from 'react'
import { EDAD_MAXIMA, OPCIONES_GENERO, OPCIONES_REGION } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { buscarUsuarioPorCorreo } from '../services/storage'
import type { Genero } from '../types'
import { esDominioDuoc, validarContrasena } from '../utils/validators'
import PasswordInput from '../ui/PasswordInput'

export default function PerfilPage() {
  const { usuario, actualizarPerfil } = useAuth()
  const { showToast } = useToast()

  const usuarioCompleto = usuario ? buscarUsuarioPorCorreo(usuario.correo) : undefined

  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [apellido, setApellido] = useState(usuario?.apellido ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(usuarioCompleto?.fechaNacimiento ?? '')
  const [correo, setCorreo] = useState(usuario?.correo ?? '')
  const [genero, setGenero] = useState<Genero | ''>(usuario?.genero ?? '')
  const [direccion, setDireccion] = useState(usuarioCompleto?.direccion ?? '')
  const [region, setRegion] = useState(usuario?.region ?? '')
  const [contrasenaActual, setContrasenaActual] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [errorContrasena, setErrorContrasena] = useState<string | null>(null)

  const hoy = new Date().toISOString().split('T')[0]

  function calcularEdadLocal(fecha: string): number {
    if (!fecha) return 0
    const nacimiento = new Date(fecha)
    const actual = new Date()
    let edad = actual.getFullYear() - nacimiento.getFullYear()
    const mes = actual.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && actual.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const edad = calcularEdadLocal(fechaNacimiento)

  function manejarSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setErrorContrasena(null)

    if (!nombre.trim() || !apellido.trim() || !correo.trim() || !fechaNacimiento || !direccion.trim() || !region || !genero) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (!esDominioDuoc(correo.trim())) {
      setError('El correo debe ser del dominio @duocuc.cl')
      return
    }

    if (fechaNacimiento > hoy) {
      setError('La fecha de nacimiento no puede ser futura')
      return
    }

    if (calcularEdadLocal(fechaNacimiento) < 14) {
      setError('El perfil es solo para personas mayores a 14 años')
      return
    }

    if (calcularEdadLocal(fechaNacimiento) > EDAD_MAXIMA) {
      setError(`La edad máxima permitida es de ${EDAD_MAXIMA} años`)
      return
    }

    const quiereCambiarContrasena =
      contrasenaActual.trim() !== '' || nuevaContrasena !== '' || confirmarNuevaContrasena !== ''

    if (quiereCambiarContrasena) {
      if (!contrasenaActual || !nuevaContrasena || !confirmarNuevaContrasena) {
        setErrorContrasena('Para cambiar la contraseña completa: contraseña actual, nueva contraseña y confirmación')
        return
      }

      if (usuarioCompleto?.contrasena !== contrasenaActual) {
        setErrorContrasena('La contraseña actual es incorrecta')
        return
      }

      if (nuevaContrasena !== confirmarNuevaContrasena) {
        setErrorContrasena('Las contraseñas no coinciden')
        return
      }

      if (!validarContrasena(nuevaContrasena)) {
        setErrorContrasena('La contraseña debe contener 8 carácteres, una mayúscula, una minúscula y un número')
        return
      }
    }

    actualizarPerfil({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      correo: correo.trim(),
      fechaNacimiento,
      genero,
      direccion: direccion.trim(),
      region,
      ...(quiereCambiarContrasena ? { contrasena: nuevaContrasena } : {}),
    })

    setContrasenaActual('')
    setNuevaContrasena('')
    setConfirmarNuevaContrasena('')

    showToast(
      quiereCambiarContrasena
        ? 'Perfil y contraseña actualizados correctamente'
        : 'Perfil actualizado correctamente',
      'success',
    )
  }

  if (!usuario) return null

  const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`
  const inicial = usuario.nombre.charAt(0).toUpperCase()

  return (
    <main className="pt-5">
      <section className="py-5 mt-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 700 }}
                  >
                    {inicial}
                  </div>
                  <h2 className="fw-bold text-dark mb-1">{nombreCompleto}</h2>
                  <span className="badge bg-primary rounded-pill px-3 py-1 text-capitalize">
                    {usuario.rol}
                  </span>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}

                <form onSubmit={manejarSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="perfil-nombre" className="form-label">
                        Nombre <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="perfil-nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="perfil-apellido" className="form-label">
                        Apellido <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="perfil-apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="perfil-fecha" className="form-label">
                        Fecha de nacimiento <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="perfil-fecha"
                        value={fechaNacimiento}
                        max={hoy}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                      />
                      {fechaNacimiento && (
                        <small className="text-muted">Edad: {edad} años</small>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="perfil-correo" className="form-label">
                        Correo electrónico <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="perfil-correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="perfil-direccion" className="form-label">
                        Dirección <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="perfil-direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="perfil-region" className="form-label">
                        Región <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="perfil-region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option value="">Selecciona una región</option>
                        {OPCIONES_REGION.map((r) => (
                          <option key={r.valor} value={r.valor}>
                            {r.etiqueta}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rol</label>
                      <input
                        type="text"
                        className="form-control"
                        value={usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                        disabled
                      />
                      <small className="text-muted">El rol no puede modificarse</small>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="perfil-genero" className="form-label">
                        Género <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="perfil-genero"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value as Genero | '')}
                      >
                        <option value="">Selecciona</option>
                        {OPCIONES_GENERO.map((g) => (
                          <option key={g.valor} value={g.valor}>
                            {g.etiqueta}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h6 className="fw-bold text-dark mb-3">
                    <i className="bi bi-shield-lock me-1" />
                    Cambiar contraseña
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label htmlFor="perfil-contrasena-actual" className="form-label">
                        Contraseña actual <span className="text-danger">*</span>
                      </label>
                      <PasswordInput
                        id="perfil-contrasena-actual"
                        value={contrasenaActual}
                        onChange={setContrasenaActual}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="perfil-nueva-contrasena" className="form-label">
                        Nueva contraseña <span className="text-danger">*</span>
                      </label>
                      <PasswordInput
                        id="perfil-nueva-contrasena"
                        value={nuevaContrasena}
                        onChange={setNuevaContrasena}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="perfil-confirmar-contrasena" className="form-label">
                        Confirmar nueva contraseña <span className="text-danger">*</span>
                      </label>
                      <PasswordInput
                        id="perfil-confirmar-contrasena"
                        value={confirmarNuevaContrasena}
                        onChange={setConfirmarNuevaContrasena}
                      />
                    </div>
                    <div className="col-12">
                      <small className="text-muted">
                        Deja los tres campos vacíos para mantener tu contraseña actual. La nueva
                        contraseña debe tener 8 carácteres, una mayúscula, una minúscula y un número.
                      </small>
                    </div>
                  </div>

                  {errorContrasena && (
                    <div className="alert alert-danger mt-3">{errorContrasena}</div>
                  )}

                  <div className="mt-4">
                    <button type="submit" className="btn btn-success rounded-pill px-5">
                      <i className="bi bi-check-lg me-1" />
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
