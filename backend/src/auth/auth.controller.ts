// Controlador de autenticación: expone el endpoint de login.
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// POST /auth/login
	// Recibe credenciales, valida contra la base de datos y devuelve un JWT.
	@Post('login')
	async login(@Body() dto: LoginDto) {
		const user = await this.authService.validateCredentials(
			dto.username,
			dto.password,
		);
		// Firma el token con el usuario como sujeto
		return this.authService.signToken(user.username);
	}
}
