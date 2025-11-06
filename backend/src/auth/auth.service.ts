// Servicio de autenticación: firma tokens JWT y centraliza la lógica de auth.
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private readonly jwt: JwtService) {}

	// Firma un token JWT con el usuario como sujeto.
	// Devuelve un objeto con la clave access_token (convención común en APIs).
		signToken(username: string) {
			const payload = { sub: username, username };

			// Expiración: si JWT_EXPIRES es un número válido (segundos), lo usamos; si no, 3600s (1h)
			const expiresRaw = process.env.JWT_EXPIRES;
			const expiresIn = Number.isFinite(Number(expiresRaw)) ? Number(expiresRaw) : 3600;

			return {
				access_token: this.jwt.sign(payload, {
					secret: process.env.JWT_SECRET || 'devsecret',
					expiresIn,
				}),
			};
		}
}
