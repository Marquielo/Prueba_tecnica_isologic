// Página de Login: envía credenciales a /auth/login y guarda el token
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { setToken } from '../utils/auth'
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa'

export default function Login() {
  const [username, setU] = useState('admin')
  const [password, setP] = useState('1234')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { username, password })
      setToken(data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 text-center mb-4">Iniciar sesión</h1>
              <form onSubmit={onSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label">Usuario</label>
                  <input
                    className="form-control"
                    value={username}
                    onChange={(e) => setU(e.target.value)}
                    placeholder="admin"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setP(e.target.value)}
                    placeholder="1234"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Entrar
                </button>
              </form>
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}

              {/* Separador visual para futuros inicios de sesión sociales */}
              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted" style={{ fontSize: '.9rem' }}>o continuar con</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Botones de redes sociales (solo iconos; placeholders sin funcionalidad por ahora)
                 Usamos react-icons para evitar depender de CDNs externos */}
              <div className="d-flex justify-content-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: 44, height: 44 }}
                  aria-label="Google (próximamente)"
                  title="Google (próximamente)"
                  disabled
                >
                  <FaGoogle size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: 44, height: 44 }}
                  aria-label="Facebook (próximamente)"
                  title="Facebook (próximamente)"
                  disabled
                >
                  <FaFacebookF size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: 44, height: 44 }}
                  aria-label="Apple (próximamente)"
                  title="Apple (próximamente)"
                  disabled
                >
                  <FaApple size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '.9rem' }}>
            Usuario demo: <code>admin</code> / Contraseña: <code>1234</code>
          </p>
        </div>
      </div>
    </div>
  )
}
