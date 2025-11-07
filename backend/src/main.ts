// Carga de variables de entorno desde .env (PORT, JWT_SECRET, etc.)
import * as dotenv from 'dotenv';

// Herramientas base de Nest y validación global de DTOs
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// Módulo raíz de la aplicación
import { AppModule } from './app.module.js';

async function bootstrap() {
  // 1) Inicializar variables de entorno
  dotenv.config();

  // 2) Leer SOLO desde variables de entorno (sin valores por defecto en código)
  //    Así evito "exponer" un puerto por hardcode y fuerzo la configuración vía .env
  const portStr = process.env.PORT;
  if (!portStr) throw new Error('Falta la variable de entorno PORT');
  const port = Number(portStr);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('La variable PORT debe ser un número de puerto válido');
  }

  //    HOST opcional: por seguridad, si no viene, uso 127.0.0.1 (solo local)
  //    Usa 0.0.0.0 si necesitas exponerlo en la red (p. ej., contenedores o LAN)
  const host = process.env.HOST || '127.0.0.1';

  // 3) Crear la aplicación Nest a partir del AppModule
  const app = await NestFactory.create(AppModule);

  // 3) Habilitar CORS para permitir que el frontend (otro puerto) consuma la API
  app.enableCors();

  // 4) Activar validación global de DTOs:
  //    - whitelist: elimina propiedades no declaradas en los DTOs
  //    - forbidNonWhitelisted: lanza error si llegan propiedades desconocidas
  //    - transform: convierte tipos (por ejemplo, string a number en params) y aplica DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 5) Levantar el servidor usando exclusivamente lo definido en variables de entorno
  await app.listen(port, host);

  // 6) Mensaje informativo en consola (minimalista para no exponer detalles)
  // eslint-disable-next-line no-console
  console.log('API iniciada');
}
bootstrap();
