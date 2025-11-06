// Módulo de autenticación: agrupa controlador, servicio y la estrategia JWT.
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [
    // Passport provee el mecanismo de guardas (AuthGuard('jwt'))
    PassportModule,
    // JwtModule para firmar y verificar tokens. Configuramos el secreto aquí.
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devsecret',
      // La expiración se definirá al momento de firmar en el servicio.
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
