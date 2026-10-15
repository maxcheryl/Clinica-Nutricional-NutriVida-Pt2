import { useState } from 'react'

interface PasswordInputProps {
  value: string
  onChange: (valor: string) => void
  id?: string
  placeholder?: string
}

export default function PasswordInput({ value, onChange, id, placeholder }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="input-group">
      <input
        type={visible ? 'text' : 'password'}
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} />
      </button>
    </div>
  )
}
