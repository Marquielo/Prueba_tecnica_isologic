// Controlador de autenticación: expone el endpoint de login.
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// POST /auth/login
	// Recibe credenciales, valida usuario demo y devuelve un JWT.
	@Post('login')
	async login(@Body() dto: LoginDto) {
		const isValid = dto.username === 'admin' && dto.password === '1234';
		if (!isValid) {
			// Mensaje en español para el consumidor de la API
			throw new UnauthorizedException('Credenciales inválidas');
		}

		// Firma el token con el usuario como sujeto
		return this.authService.signToken(dto.username);
	}
}
