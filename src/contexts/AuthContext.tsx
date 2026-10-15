import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Sesion, Usuario } from '../types'
import {
  agregarUsuario,
  borrarSesion,
  buscarUsuarioPorCorreo,
  estaBloqueado,
  guardarSesion,
  incrementarIntentos,
  obtenerIntentosRestantes,
  obtenerUsuarioLogueado,
  resetearIntentos,
} from '../services/storage'

interface ResultadoLogin {
  exito: boolean
  mensaje?: string
}

interface AuthContextValue {
  usuario: Sesion | null
  iniciarSesion: (correo: string, contrasena: string) => ResultadoLogin
  cerrarSesion: () => void
  registrarUsuario: (usuario: Usuario) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Sesion | null>(() => obtenerUsuarioLogueado())
  const navigate = useNavigate()

  function iniciarSesion(correoInput: string, contrasena: string): ResultadoLogin {
    const correo = correoInput.trim()

    if (!correo || !contrasena) {
      return { exito: false, mensaje: 'Debes completar todos los campos' }
    }

    if (!correo.endsWith('@duocuc.cl')) {
      return { exito: false, mensaje: 'El correo debe ser del dominio @duocuc.cl' }
    }

    if (estaBloqueado(correo)) {
      return {
        exito: false,
        mensaje: 'Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.',
      }
    }

    const usuarioEncontrado = buscarUsuarioPorCorreo(correo)

    if (!usuarioEncontrado) {
      return {
        exito: false,
        mensaje: 'Correo o contraseña inválidos',
      }
    }

    if (usuarioEncontrado.contrasena !== contrasena) {
      incrementarIntentos(correo)
      const restantes = obtenerIntentosRestantes(correo)
      return {
        exito: false,
        mensaje: `Correo o contraseña incorrectos. Intentos restantes: ${restantes}`,
      }
    }

    resetearIntentos(correo)

    const usuarioSesion: Sesion = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      apellido: usuarioEncontrado.apellido,
      correo: usuarioEncontrado.correo,
      genero: usuarioEncontrado.genero,
      region: usuarioEncontrado.region,
    }

    guardarSesion(usuarioSesion)
    setUsuario(usuarioSesion)
    return { exito: true }
  }

  function cerrarSesion() {
    borrarSesion()
    setUsuario(null)
    navigate('/')
  }

  function registrarUsuario(nuevo: Usuario) {
    agregarUsuario(nuevo)
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, registrarUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
