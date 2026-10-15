import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PasswordInput from '../ui/PasswordInput'

export default function LoginPage() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  function manejarSubmit(e: FormEvent) {
    e.preventDefault()
    const resultado = iniciarSesion(correo, contrasena)
    if (resultado.exito) {
      navigate('/')
    } else {
      setMensaje(resultado.mensaje ?? null)
    }
  }

  return (
    <main className="pt-5">
      <section className="py-4 py-md-5">
        <div className="container">
          <div className="card-auth">
            <div className="card-body p-4 p-md-5">
              <div className="text-center">
                <div className="auth-icon">
                  <i className="bi bi-person-circle" />
                </div>
                <h1 className="auth-title">Iniciar sesión</h1>
                <p className="auth-subtitle">Ingresa tus datos para acceder a tu cuenta</p>
              </div>

              <form id="formIniciarSesion" onSubmit={manejarSubmit}>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    placeholder="correo@duocuc.cl"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="inputPass" className="form-label">
                    Contraseña
                  </label>
                  <PasswordInput
                    id="inputPass"
                    placeholder="••••••••"
                    value={contrasena}
                    onChange={setContrasena}
                  />
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-success btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2" />
                    Iniciar sesión
                  </button>
                </div>
              </form>

              <div id="mensajeLogin" className={`alert alert-danger${mensaje ? '' : ' d-none'}`}>
                {mensaje ?? 'Correo o contraseña incorrectas, intentelo nuevamente'}
              </div>

              <div className="text-center pt-2">
                <p className="mb-0 text-secondary">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/registro" className="auth-link">
                    Crear cuenta
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
