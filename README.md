# Prueba Técnica – Gestión de Tareas (ISOLOGIC)

Bitácora paso a paso de lo que fui haciendo, con comandos y explicaciones como si se lo contara a otra persona. Todo está pensado para Windows PowerShell.

## Contexto

Quiero construir una API en Nest.js con autenticación por token (JWT) y un CRUD de tareas. Más adelante agregaré un frontend en React, pero aquí documento hasta el punto exacto donde voy hoy.

## Convenciones de idioma

- Documentación y archivos de guía (README, comentarios explicativos, issues): Español (Chile).
- Código fuente (nombres de clases, funciones, variables, DTOs): Inglés, siguiendo convenciones de TypeScript/NestJS.
- API: claves de respuesta en inglés (por ejemplo, `access_token`, `title`, `completed`); mensajes de error orientados al usuario en español cuando corresponda.

## Estructura actual del repo

- `backend/` — proyecto Nest.js ya inicializado

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

- Estructura base lista con módulos de `auth` y `tasks` generados.
- Aún NO implementé la lógica de login ni el CRUD; solo está el esqueleto.

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
