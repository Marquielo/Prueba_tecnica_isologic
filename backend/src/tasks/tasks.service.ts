// Servicio de tareas: ahora usa TypeORM para persistir en PostgreSQL.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly repo: Repository<Task>,
	) {}

	// Obtener todas las tareas
	async findAll(): Promise<Task[]> {
		return this.repo.find();
	}

	// Crear una nueva tarea con completed=false por defecto
	async create(title: string): Promise<Task> {
		const task = this.repo.create({ title, completed: false });
		return this.repo.save(task);
	}

	// Actualizar una tarea por id (title/completed)
	async update(
		id: number,
		dto: Partial<Omit<Task, 'id'>>,
	): Promise<Task | null> {
		const existing = await this.repo.findOne({ where: { id } });
		if (!existing) return null;
		const merged = this.repo.merge(existing, dto);
		return this.repo.save(merged);
	}

	// Eliminar una tarea por id
	async remove(id: number): Promise<boolean> {
		const res = await this.repo.delete(id);
		return (res.affected ?? 0) > 0;
	}
}
