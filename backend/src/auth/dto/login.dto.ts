// DTO para el login: valida el payload recibido en /auth/login
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  // Nombre de usuario (demo: "admin")
  @IsString({ message: 'El nombre de usuario debe ser una cadena' })
  @MinLength(1, { message: 'El nombre de usuario es requerido' })
  username!: string;

  // Contraseña (demo: "1234")
  @IsString({ message: 'La contraseña debe ser una cadena' })
  @MinLength(1, { message: 'La contraseña es requerida' })
  password!: string;
}
