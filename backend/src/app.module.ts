import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  // imports: lista de módulos que esta app utiliza. Incluye JwtModule con la clave y expiración.
  imports: [
    // Configuración de JWT leyendo variables de entorno definidas en .env.
    // Secret y expiración por defecto para desarrollo si no existen variables.
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devsecret',
      // Nota: evitamos tipados conflictivos de expiresIn aquí.
      // Definiremos la expiración explícitamente al firmar el token en AuthService.
    }),

    // Módulo de autenticación (login, estrategia JWT)
    AuthModule,

    // Módulo de tareas (CRUD protegido por JWT)
    TasksModule,
  ],
})
export class AppModule {}
