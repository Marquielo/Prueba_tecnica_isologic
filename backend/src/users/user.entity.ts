// Entidad User para manejar credenciales en la base de datos.
// Se almacena password hasheado (bcrypt) y un username único.
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  username!: string;

  // Hash bcrypt (72 chars máx teórico), dejamos 100 por holgura.
  @Column({ type: 'varchar', length: 100 })
  password!: string;
}
