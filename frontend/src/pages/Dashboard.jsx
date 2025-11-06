// Dashboard: lista, crea, completa y elimina tareas usando la API
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { clearToken } from '../utils/auth'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/tasks')
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const { data } = await api.post('/tasks', { title })
    setTasks((t) => [...t, data])
    setTitle('')
  }

  const toggle = async (task) => {
    const { data } = await api.put(`/tasks/${task.id}`, { completed: !task.completed })
    setTasks((t) => t.map((x) => (x.id === task.id ? data : x)))
  }

  const remove = async (id) => {
    await api.delete(`/tasks/${id}`)
    setTasks((t) => t.filter((x) => x.id !== id))
  }

  const logout = () => {
    clearToken()
    navigate('/login')
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">Tareas</h1>
        <button onClick={logout} className="btn btn-outline-secondary btn-sm">Salir</button>
      </div>

      <form onSubmit={add} className="input-group mb-3">
        <input
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button type="submit" className="btn btn-primary">
          Agregar
        </button>
      </form>

      {loading ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Cargando...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hay tareas. ¡Crea la primera!
        </div>
      ) : (
        <ul className="list-group">
          {tasks.map((t) => (
            <li key={t.id} className="list-group-item d-flex align-items-center justify-content-between">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle(t)}
                  id={`task-${t.id}`}
                />
                <label className="form-check-label ms-2" htmlFor={`task-${t.id}`}>
                  <span className={t.completed ? 'text-decoration-line-through text-muted' : ''}>{t.title}</span>
                </label>
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => remove(t.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
