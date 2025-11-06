// Utilidades para manejo del token JWT en el almacenamiento del navegador (localStorage).
// Nota: guardamos el token bajo la clave fija 'token' para que el interceptor de axios lo lea.

/**
 * Guarda el token de autenticación en localStorage.
 * @param {string} t - Token JWT devuelto por el backend (access_token).
 */
export const setToken = (t) => localStorage.setItem('token', t)

/**
 * Obtiene el token de autenticación desde localStorage.
 * @returns {string|null} El token si existe; de lo contrario, null.
 */
export const getToken = () => localStorage.getItem('token')

/**
 * Elimina el token de autenticación de localStorage (cierra sesión en el cliente).
 */
export const clearToken = () => localStorage.removeItem('token')

/**
 * Indica si el usuario se considera autenticado en el cliente.
 * Regla simple: si existe un token no vacío en localStorage, se asume sesión iniciada.
 * (El backend validará realmente el token en cada request protegido.)
 * @returns {boolean} true si hay token; false si no lo hay.
 */
export const isAuthed = () => Boolean(getToken())
