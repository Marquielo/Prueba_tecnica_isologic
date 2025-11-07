// Entidad Task para persistencia en PostgreSQL con TypeORM.
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  // Identificador autoincremental
  @PrimaryGeneratedColumn()
  id!: number;

  // Título de la tarea (requerido)
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  // Estado de completado, por defecto false
  @Column({ type: 'boolean', default: false })
  completed!: boolean;
}
