# Frontend (React + Vite)

## Requisitos
- Node.js LTS y npm

## Variables
- VITE_API_BASE (opcional): URL base del backend. Por defecto usa `http://localhost:3000`.

## Ejecutar
```powershell
cd frontend
npm install
npm run dev
```
Abrir la URL que muestre Vite (p. ej. http://localhost:5173).

## Estructura
- `src/api/axios.js`: cliente HTTP con token
- `src/utils/auth.js`: manejo de token en localStorage
- `src/pages/Login.jsx`: login y guardado de token
- `src/pages/Dashboard.jsx`: CRUD de tareas
- `src/App.jsx`: rutas y protección
- `src/main.jsx`: entrada de la app
