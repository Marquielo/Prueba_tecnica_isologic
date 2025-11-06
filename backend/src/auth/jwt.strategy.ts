// Estrategia JWT: extrae el token del header Authorization: Bearer <token>
// y valida su firma con el secreto configurado.
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'devsecret',
      ignoreExpiration: false,
    });
  }

  // Retorna el usuario validado que se inyectará en los handlers si se requiere.
  async validate(payload: any) {
    // Puedes enriquecer el objeto con más datos si fuera necesario
    return { userId: payload.sub, username: payload.username };
  }
}
