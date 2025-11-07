// Servicio de autenticación: firma tokens JWT y valida contra la BD.
import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
	constructor(
		private readonly jwt: JwtService,
		@InjectRepository(User)
		private readonly users: Repository<User>,
	) {}

	// Si no hay usuarios, seed inicial con admin/1234 (solo desarrollo)
	async onModuleInit() {
		const count = await this.users.count();
		if (count === 0) {
			const hash = await bcrypt.hash('1234', 10);
			const u = this.users.create({ username: 'admin', password: hash });
			await this.users.save(u);
			// eslint-disable-next-line no-console
			console.log('Seed: usuario admin creado (password: 1234)');
		}
	}

	// Valida credenciales contra la base de datos
	async validateCredentials(username: string, password: string): Promise<User> {
		const user = await this.users.findOne({ where: { username } });
		if (!user) throw new UnauthorizedException('Credenciales inválidas');
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) throw new UnauthorizedException('Credenciales inválidas');
		return user;
	}

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
