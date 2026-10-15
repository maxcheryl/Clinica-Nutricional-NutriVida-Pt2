import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { EDAD_MAXIMA, OPCIONES_GENERO, OPCIONES_REGION } from '../constants'
import { useAuth } from '../contexts/AuthContext'
import { buscarUsuarioPorCorreo } from '../services/storage'
import type { Genero } from '../types'
import PasswordInput from '../ui/PasswordInput'
import { calcularEdad, esDominioDuoc, validarContrasena } from '../utils/validators'

export default function RegistroPage() {
  const hoy = new Date().toISOString().split('T')[0]
  const { registrarUsuario } = useAuth()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [genero, setGenero] = useState<Genero | ''>('')
  const [region, setRegion] = useState('')
  const [direccion, setDireccion] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const [mensajeRegistro, setMensajeRegistro] = useState<string | null>(null)
  const [esExito, setEsExito] = useState(false)
  const [mensajeContrasena, setMensajeContrasena] = useState<string | null>(null)

  function limpiarMensajes() {
    setMensajeRegistro(null)
    setMensajeContrasena(null)
    setEsExito(false)
  }

  function mostrarError(mensaje: string) {
    setMensajeRegistro(mensaje)
    setEsExito(false)
  }

  function manejarSubmit(e: FormEvent) {
    e.preventDefault()
    limpiarMensajes()

    if (
      !nombre ||
      !apellido ||
      !correo ||
      !fechaNacimiento ||
      !contrasena ||
      !confirmarContrasena ||
      !genero ||
      !region ||
      !direccion
    ) {
      mostrarError('Todos los campos son obligatorios')
      return
    }

    if (contrasena !== confirmarContrasena) {
      setMensajeContrasena('Contraseñas no coinciden')
      return
    }

    if (!validarContrasena(contrasena)) {
      mostrarError('La contraseña debe contener 8 carácteres, una mayúscula, una minúscula y un número')
      return
    }

    if (!esDominioDuoc(correo)) {
      mostrarError('El dominio del correo debe ser @duocuc.cl')
      return
    }

    const edad = calcularEdad(fechaNacimiento)
    if (edad < 14) {
      mostrarError('El registro es solo para personas mayores a 14 años')
      return
    }
    if (edad > EDAD_MAXIMA) {
      mostrarError(`La edad máxima permitida es de ${EDAD_MAXIMA} años`)
      return
    }

    if (!aceptaTerminos) {
      mostrarError('Debes aceptar los términos y condiciones para registrarte')
      return
    }

    if (buscarUsuarioPorCorreo(correo)) {
      mostrarError('El correo ya se encuentra registrado')
      return
    }

    registrarUsuario({
      id: crypto.randomUUID(),
      nombre,
      apellido,
      correo,
      fechaNacimiento,
      contrasena,
      genero,
      region,
      direccion,
      rol: 'cliente',
    })

    setMensajeRegistro('Registro realizado con éxito')
    setEsExito(true)
    setNombre('')
    setApellido('')
    setCorreo('')
    setFechaNacimiento('')
    setContrasena('')
    setConfirmarContrasena('')
    setGenero('')
    setRegion('')
    setDireccion('')
    setAceptaTerminos(false)
  }

  return (
    <main className="pt-5">
      <section className="py-4 py-md-5">
        <div className="container">
          <div className="card-auth">
            <div className="card-body p-4 p-md-5">
              <div className="text-center">
                <div className="auth-icon">
                  <i className="bi bi-person-plus" />
                </div>
                <h1 className="auth-title">Crear cuenta</h1>
                <p className="auth-subtitle">Regístrate para acceder a nuestros servicios</p>
              </div>

              <form id="formCrearCuenta" onSubmit={manejarSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre<span className="obligatorio">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label">
                      Apellido<span className="obligatorio">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico<span className="obligatorio">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="correo@duocuc.cl"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="fechaNacimiento" className="form-label">
                      Fecha de nacimiento<span className="obligatorio">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fechaNacimiento"
                      max={hoy}
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="pass" className="form-label">
                      Contraseña<span className="obligatorio">*</span>
                    </label>
                    <PasswordInput
                      id="pass"
                      placeholder="••••••••"
                      value={contrasena}
                      onChange={setContrasena}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPass" className="form-label">
                      Confirmar contraseña<span className="obligatorio">*</span>
                    </label>
                    <PasswordInput
                      id="confirmPass"
                      placeholder="••••••••"
                      value={confirmarContrasena}
                      onChange={setConfirmarContrasena}
                    />
                  </div>
                  <div
                    id="mensajeContrasena"
                    className={`alert alert-danger mb-0${mensajeContrasena ? '' : ' d-none'}`}
                  >
                    {mensajeContrasena ?? 'Contraseñas no coinciden'}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="genero" className="form-label">
                      Género<span className="obligatorio">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="genero"
                      value={genero}
                      onChange={(e) => setGenero(e.target.value as Genero | '')}
                    >
                      <option value="" disabled>
                        Seleccione
                      </option>
                      {OPCIONES_GENERO.map((op) => (
                        <option key={op.valor} value={op.valor}>
                          {op.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="region" className="form-label">
                      Región<span className="obligatorio">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="" disabled>
                        Seleccione
                      </option>
                      {OPCIONES_REGION.map((op) => (
                        <option key={op.valor} value={op.valor}>
                          {op.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="direccion" className="form-label">
                      Dirección<span className="obligatorio">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      placeholder="Calle y número"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="aceptaTerminos"
                        checked={aceptaTerminos}
                        onChange={(e) => setAceptaTerminos(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="aceptaTerminos">
                        Acepto los términos y condiciones de registro
                        <span className="obligatorio">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="d-grid mt-2">
                    <button type="submit" className="btn btn-success btn-lg">
                      <i className="bi bi-person-plus me-2" />
                      Crear cuenta
                    </button>
                  </div>
                </div>
              </form>

              <div
                id="mensajeRegistro"
                className={`alert ${esExito ? 'alert-success' : 'alert-danger'}${mensajeRegistro ? '' : ' d-none'} mt-3`}
              >
                {mensajeRegistro ?? 'Mensaje error de registro'}
              </div>

              <div className="text-center mt-3 pt-2">
                <p className="mb-0 text-secondary">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="auth-link">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
