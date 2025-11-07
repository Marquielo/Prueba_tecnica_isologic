import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

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

    // Conexión a PostgreSQL con TypeORM. Usamos variables de entorno y autoLoadEntities
    // para que recoja automáticamente las entidades declaradas en los módulos.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER || 'tasks_user',
      password: process.env.DB_PASS || 'postgres1234',
      database: process.env.DB_NAME || 'tasks_db',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo. En producción usar migraciones.
    }),

    // Módulo de autenticación (login, estrategia JWT)
    AuthModule,

    // Módulo de tareas (CRUD protegido por JWT)
    TasksModule,
  ],
})
export class AppModule {}
