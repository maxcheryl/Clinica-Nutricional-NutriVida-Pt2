/**
 * Contexto de autenticación: sesión actual, login/logout, registro y
 * actualización de perfil. Toda escritura de usuarios pasa por storage.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Sesion, Usuario } from '../types'
import { DOMINIO_CORREO } from '../constants'
import {
  agregarUsuario,
  actualizarUsuario,
  borrarSesion,
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  estaBloqueado,
  guardarSesion,
  incrementarIntentos,
  migrarUsuariosSinRol,
  obtenerIntentosRestantes,
  obtenerUsuarioLogueado,
  resetearIntentos,
  sembrarAdminSiFalta,
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
  actualizarPerfil: (datos: Partial<Usuario>) => void
  refrescarSesion: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Sesion | null>(() => obtenerUsuarioLogueado())
  const navigate = useNavigate()

  useEffect(() => {
    migrarUsuariosSinRol()
    sembrarAdminSiFalta()
  }, [])

  /** Proyecta un Usuario completo a los datos públicos de sesión (sin contraseña). */
  function aSesion(u: Usuario): Sesion {
    return {
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      genero: u.genero,
      region: u.region,
      rol: u.rol,
    }
  }

  function iniciarSesion(correoInput: string, contrasena: string): ResultadoLogin {
    const correo = correoInput.trim().toLowerCase()

    if (!correo || !contrasena) {
      return { exito: false, mensaje: 'Debes completar todos los campos' }
    }

    if (!correo.endsWith(DOMINIO_CORREO)) {
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

    const usuarioSesion: Sesion = aSesion(usuarioEncontrado)

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

  /**
   * Actualiza el perfil del usuario en sesión y reconstruye la sesión con el
   * registro fresco (buscado por id: sobrevive a cambios de correo).
   */
  function actualizarPerfil(datos: Partial<Usuario>) {
    if (!usuario) return
    actualizarUsuario(usuario.correo, datos)
    const usuarioActualizado = buscarUsuarioPorId(usuario.id)
    if (usuarioActualizado) {
      const nuevaSesion: Sesion = aSesion(usuarioActualizado)
      guardarSesion(nuevaSesion)
      setUsuario(nuevaSesion)
    }
  }

  /** Relee el registro de la sesión actual por id y la sincroniza (edición desde paneles). */
  function refrescarSesion() {
    if (!usuario) return
    const usuarioActualizado = buscarUsuarioPorId(usuario.id)
    if (!usuarioActualizado) return
    const nuevaSesion: Sesion = aSesion(usuarioActualizado)
    guardarSesion(nuevaSesion)
    setUsuario(nuevaSesion)
  }

  return (
    <AuthContext.Provider
      value={{ usuario, iniciarSesion, cerrarSesion, registrarUsuario, actualizarPerfil, refrescarSesion }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
