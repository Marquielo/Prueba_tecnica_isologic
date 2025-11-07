# Prueba Técnica – Gestión de Tareas (ISOLOGIC)

Voy dejando mi bitácora paso a paso, con los comandos que uso. Trabajo en Windows PowerShell.

## Contexto

Estoy construyendo una API en Nest.js con autenticación por token (JWT) y un CRUD de tareas. Más adelante voy a agregar un frontend en React, pero acá dejo documentado exactamente hasta dónde llegué hoy.

## Convenciones
- Código fuente: en inglés para nombres de clases, funciones, variables y DTOs, siguiendo convenciones de TypeScript/NestJS.
- API: claves de respuesta en inglés (por ejemplo, `access_token`, `title`, `completed`) y mensajes de error para el usuario en español cuando corresponde.

---

## Inicio rápido

- Backend
```powershell
cd "c:\Users\marce\OneDrive\Documentos\GitHub\Prueba_tecnica_isologic\backend"
Copy-Item .env.example .env -Force
npm install
npm run start:dev
```

- Frontend
```powershell
cd "c:\Users\marce\OneDrive\Documentos\GitHub\Prueba_tecnica_isologic\frontend"
npm install
npm run dev
```

Login demo: usuario `admin`, contraseña `1234`.

## Estructura actual del repo

- `backend/` — proyecto Nest.js (auth + tasks)
- `frontend/` — app React + Vite (Login y Dashboard)

---

## Prerrequisitos

- Tener Node.js LTS y npm instalados.

Verifiqué versiones con:

```powershell
node -v
npm -v
```

Si no aparecían, instalé Node LTS desde https://nodejs.org y reabrí la terminal.

---

## Lo que hice hasta ahora (paso a paso)

1) Inicialicé el proyecto Nest en la carpeta `backend`

```powershell
cd "c:\Users\marce\OneDrive\Documentos\GitHub\Prueba_tecnica_isologic"
npx @nestjs/cli new backend --package-manager npm
```

- Esto me creó el esqueleto de una app Nest con `AppModule`, `AppController` y `AppService`.

2) Entré a la carpeta del backend e instalé dependencias

```powershell
cd backend
npm install
```

3) Generé el módulo de autenticación (Auth)

```powershell
npx nest g module auth
```

- Qué hace: crea `src/auth/auth.module.ts` y lo registra en `AppModule`. Un módulo agrupa controladores/servicios relacionados.

4) Generé el controlador de Auth (sin archivo de pruebas)

```powershell
npx nest g controller auth --no-spec
```

- Qué hace: crea `src/auth/auth.controller.ts` con el decorador `@Controller('auth')`. El controlador recibe las peticiones HTTP (por ejemplo, `POST /auth/login`). `--no-spec` evita generar el archivo de tests.

5) Generé el servicio de Auth (sin archivo de pruebas)

```powershell
npx nest g service auth --no-spec
```

- Qué hace: crea `src/auth/auth.service.ts` con `@Injectable()` y lo añade a `providers` del módulo. Aquí irá la lógica (por ejemplo, firmar el JWT).

6) Generé el módulo de Tareas (Tasks)

```powershell
npx nest g module tasks
```

- Qué hace: crea `src/tasks/tasks.module.ts` y lo agrega a `AppModule`.

7) Generé el controlador de Tasks (sin archivo de pruebas)

```powershell
npx nest g controller tasks --no-spec
```

- Qué hace: crea `src/tasks/tasks.controller.ts` con `@Controller('tasks')`. Aquí expondré los endpoints `GET/POST/PUT/DELETE`.

8) Generé el servicio de Tasks (sin archivo de pruebas)

```powershell
npx nest g service tasks --no-spec
```

- Qué hace: crea `src/tasks/tasks.service.ts` y lo registra como `provider`. Aquí implementaré el CRUD en memoria.

> Nota: El archivo `backend/src/app.controller.ts` sigue con el endpoint raíz `GET /` que devuelve el "Hello World!" por defecto de Nest.

---

## Dónde quedaron los archivos creados

- `src/auth/auth.module.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.service.ts`
- `src/tasks/tasks.module.ts`
- `src/tasks/tasks.controller.ts`
- `src/tasks/tasks.service.ts`

---

## Estado actual

- Login con JWT implementado (`POST /auth/login`) con usuario demo `admin/1234`.
- CRUD de tareas protegido con token (`GET/POST/PUT/DELETE /tasks`).
- Frontend funcional: Login guarda token; Dashboard lista/crea/actualiza/borra tareas.
- Persistencia en memoria (array) para la versión inicial y versión con PostgreSQL (rama `prueba_tecnica_isologic_mas_db`) usando TypeORM.

---

## Cómo levantar este proyecto (backend + frontend)

### Requisitos previos
- Node.js 18+ y npm
- Git
- PostgreSQL 17 (solo necesario para la rama con base de datos)

### Clonar la rama con base de datos (si se usa persistencia real)
```
git clone --branch prueba_tecnica_isologic_mas_db --single-branch https://github.com/Marquielo/Prueba_tecnica_isologic.git Prueba_tecnica_isologic
cd Prueba_tecnica_isologic/backend
```

### Instalar dependencias y preparar entorno
```
npm ci
Copy-Item .env.example .env -Force
```

Si estoy en la rama con DB, edito `.env` (o uso los valores por defecto):
```
PORT=3000
HOST=127.0.0.1
JWT_SECRET=devsecret
JWT_EXPIRES=3600
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=tasks_user
DB_PASS=postgres1234
DB_NAME=tasks_db
```

### Crear base de datos (solo primera vez, rama con DB)
```
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h 127.0.0.1 -U postgres -d postgres -c "CREATE USER tasks_user WITH PASSWORD 'postgres1234' LOGIN;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -h 127.0.0.1 -U postgres -d postgres -c "CREATE DATABASE tasks_db OWNER tasks_user;"
```

### Iniciar backend (desarrollo)
```
npm run start:dev
```
Se crean (TypeORM synchronize) las tablas `users` y `tasks`. Si `users` está vacía, se inserta `admin/1234` automáticamente.

### Probar login y CRUD rápido (PowerShell)
```
$base='http://127.0.0.1:3000'
$loginBody=@{username='admin';password='1234'} | ConvertTo-Json
$login=Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType 'application/json' -Body $loginBody
$token=$login.access_token
$headers=@{Authorization="Bearer $token"}

Invoke-RestMethod -Method Get -Uri "$base/tasks" -Headers $headers | ConvertTo-Json -Depth 5
$task=Invoke-RestMethod -Method Post -Uri "$base/tasks" -Headers $headers -ContentType 'application/json' -Body (@{ title='Tarea 1' } | ConvertTo-Json)
$id=$task.id
Invoke-RestMethod -Method Put -Uri "$base/tasks/$id" -Headers $headers -ContentType 'application/json' -Body (@{ completed=$true } | ConvertTo-Json)
Invoke-RestMethod -Method Delete -Uri "$base/tasks/$id" -Headers $headers
Invoke-RestMethod -Method Get -Uri "$base/tasks" -Headers $headers | ConvertTo-Json -Depth 5
```

### Ejecutar frontend
```
cd ..\frontend
npm ci
npm run dev
```
Uso `VITE_API_BASE` en `frontend/.env` si el backend corre en otra URL/puerto.

### Verificación opcional en PostgreSQL
```
SELECT id, username FROM users;
SELECT id, title, completed FROM tasks ORDER BY id;
```

### Troubleshooting rápido
| Problema | Causa | Solución |
|----------|-------|----------|
| 401 en /tasks | Falta token | Asegurar header Authorization Bearer <token> |
| Cannot PUT /tasks/ | ID vacío | Revisar variable `$id` antes de llamar PUT |
| ECONNREFUSED 5432 | Postgres apagado | Iniciar servicio PostgreSQL |
| password authentication failed | Credenciales mal | Revisar `.env` y usuario BD |
| CORS en frontend | Falta enableCors() | Confirmar `app.enableCors()` en `main.ts` |

---

## Próximos pasos (lo que haré después)

1) Instalar paquetes de JWT y validación:

```powershell
npm i @nestjs/jwt @nestjs/passport passport passport-jwt class-validator class-transformer dotenv
```

2) Configuración global (en `main.ts`): habilitar CORS y `ValidationPipe`.

3) Auth:
- `POST /auth/login` aceptando `{ username, password }` con usuario demo `admin/1234`.
- Firmar un JWT y devolver `{ access_token }`.
- Crear `JwtStrategy` y proteger rutas con `AuthGuard('jwt')`.

4) Tasks:
- Implementar CRUD en memoria en `tasks.service.ts`.
- Exponer `GET/POST/PUT/DELETE /tasks` en `tasks.controller.ts` y protegerlos con JWT.

5) Variables de entorno:
- Usaré `backend/.env` basado en `backend/.env.example` (ya incluido) con `PORT`, `JWT_SECRET`, `JWT_EXPIRES`.

6) Probar con PowerShell (`Invoke-RestMethod`) una vez que los endpoints estén listos.

---

## Notas para quien siga estos pasos

- Si `nest` no aparece como comando, usa siempre `npx nest ...` o instala la CLI global con `npm i -g @nestjs/cli` y reabre la terminal.
- Mantén los nombres de módulos/controladores/servicios en minúsculas para que los paths sean consistentes.
- Los `--no-spec` los uso para ir rápido; más adelante puedo agregar tests.

---

## Notas técnicas (abreviado) para evitar errores de tipos

- Error: `Type 'string' is not assignable to type 'number | StringValue | undefined'.`
	- Causa común 1 (puerto): las variables de entorno son strings. Asegura que el puerto sea un número antes de pasarlo a `app.listen`.
		- Solución aplicada en `main.ts`:
			```ts
			const port = parseInt(process.env.PORT ?? '3000', 10);
			await app.listen(port);
			```
	- Causa común 2 (JWT expiresIn): según la versión de `@nestjs/jwt`, `expiresIn` puede no aceptar strings libres como `'1h'` en `JwtModule.register`.
		- Evita configurarlo en `JwtModule.register`; define la expiración al firmar el token en el servicio de Auth:
			```ts
			// Ejemplo (AuthService):
			this.jwt.sign(payload, {
				secret: process.env.JWT_SECRET || 'devsecret',
				expiresIn: process.env.JWT_EXPIRES || '1h', // puede ser '1h' o segundos (por ej. 3600)
			});
			```
		- Alternativa: usa segundos (`3600`) para evitar ambigüedad de tipo.

	---

	## Cómo probar la API (PowerShell)

	1) Backend corriendo
	```powershell
	cd "c:\Users\marce\OneDrive\Documentos\GitHub\Prueba_tecnica_isologic\backend"
	npm run start:dev
	```

	2) Login y token
	```powershell
	$body = @{ username = "admin"; password = "1234" } | ConvertTo-Json
	$login = Invoke-RestMethod -Method POST -Uri http://localhost:3000/auth/login -ContentType "application/json" -Body $body
	$token = $login.access_token
	```

	3) Verificar protección (sin token → 401)
	```powershell
	Invoke-RestMethod -Method GET -Uri http://localhost:3000/tasks
	```

	4) CRUD de tareas (con token)
	```powershell
	# Listar
	Invoke-RestMethod -Method GET -Uri http://localhost:3000/tasks -Headers @{ Authorization = "Bearer $token" }

	# Crear
	$createBody = @{ title = "Mi primera tarea" } | ConvertTo-Json
	$created = Invoke-RestMethod -Method POST -Uri http://localhost:3000/tasks -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } -Body $createBody
	$id = $created.id

	# Completar
	$updateBody = @{ completed = $true } | ConvertTo-Json
	Invoke-RestMethod -Method PUT -Uri http://localhost:3000/tasks/$id -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } -Body $updateBody

	# Eliminar
	Invoke-RestMethod -Method DELETE -Uri http://localhost:3000/tasks/$id -Headers @{ Authorization = "Bearer $token" }

	# Confirmar
	Invoke-RestMethod -Method GET -Uri http://localhost:3000/tasks -Headers @{ Authorization = "Bearer $token" }
	```

	---

	## Frontend – cómo ejecutar (React + Vite)

	1) Instalar y levantar
	```powershell
	cd "c:\Users\marce\OneDrive\Documentos\GitHub\Prueba_tecnica_isologic\frontend"
	npm install
	npm run dev
	```
	Abre la URL que muestra Vite (por ejemplo, `http://localhost:5173`).

	2) Variables opcionales
	- `VITE_API_BASE`: URL del backend. Por defecto `http://localhost:3000`.
	- Para usarla, crea `frontend/.env` con:
	```
	VITE_API_BASE=http://localhost:3000
	```

	3) Flujo esperado
	- Iniciar sesión con `admin / 1234` → redirige a Dashboard.
	- Crear, completar y eliminar tareas.
	- “Salir” cierra sesión (borra token) y vuelve a Login.

	### Troubleshooting (Frontend)
	- 401 en las peticiones: verifica que exista `token` en LocalStorage y que se envíe el header `Authorization: Bearer <token>` (pestaña Network del navegador).
	- CORS: el backend debe tener `app.enableCors()` en `src/main.ts`.
	- Backend en otro puerto/host: define `VITE_API_BASE` como se indica arriba y reinicia `npm run dev`.
	- Iconos sociales en blanco o error de integridad SRI: quité el CDN de Font Awesome y usé `react-icons`. Si aparece el error de SRI, haz Ctrl+F5 y verifica que `frontend/index.html` no tenga el link al CDN de FA.

	---

	## Estado para entrega

	- Backend (Nest.js) con endpoints:
		- `POST /auth/login` (JWT), `GET/POST/PUT/DELETE /tasks` (protegidos por token).
	- Frontend (React + Vite): Login y Dashboard (CRUD), token en headers.
	- Persistencia en memoria (válido para la prueba).
	- Documentación: este README con pasos de ejecución de BE/FE y pruebas rápidas.

	Estructura del repo:
	- `backend/`
	- `frontend/`
	- `README.md`

	---

	## Variables de entorno del backend

	Uso variables de entorno y valido que existan al arrancar. Si falta `PORT`, no inicia.

	```
	PORT=3000
	HOST=127.0.0.1
	JWT_SECRET=devsecret
	JWT_EXPIRES=1h
	```

	- HOST 127.0.0.1 limita el acceso a localhost. Usa `0.0.0.0` si necesitas exponer en red.
	- No hardcodeo el puerto: lo leo desde `.env` (más seguro y portable).

	---

	## Endpoints (resumen)

	- Auth
		- POST `/auth/login`
			- Body: `{ "username": "admin", "password": "1234" }`
			- 200: `{ "access_token": "..." }`

	- Tasks (con `Authorization: Bearer <token>`)
		- GET `/tasks` → 200 lista de tareas
		- POST `/tasks` → 201 crea `{ title }`
		- PUT `/tasks/:id` → 200 actualiza `{ title?, completed? }`
		- DELETE `/tasks/:id` → 204 elimina
