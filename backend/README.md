# Backend (NestJS + PostgreSQL)

Este directorio contiene la API (NestJS, TypeORM, JWT). Mantengo la documentación completa en el README principal de la raíz del repositorio.

## Guía completa
Ver: [../README.md](../README.md)

## Scripts básicos
```powershell
npm run start:dev   # desarrollo (watch)
npm run build       # compilar
npm run start:prod  # producción
```

## Estructura rápida
- auth/ → login JWT y seed usuario admin
- tasks/ → CRUD de tareas protegido
- users/ → entidad User (username + password hasheado)

## Nota
TypeORM está en synchronize=true solo para desarrollo.
