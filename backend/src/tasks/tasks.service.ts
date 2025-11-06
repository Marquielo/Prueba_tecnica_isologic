// Servicio de tareas: mantiene un arreglo en memoria con operaciones CRUD.
import { Injectable } from '@nestjs/common';

export type Task = { id: number; title: string; completed: boolean };

@Injectable()
export class TasksService {
	// Almacenamiento en memoria (suficiente para la prueba técnica)
	private tasks: Task[] = [];
	private idSeq = 1;

	// Obtener todas las tareas
	findAll(): Task[] {
		return this.tasks;
	}

	// Crear una nueva tarea con completed=false por defecto
	create(title: string): Task {
		const task: Task = { id: this.idSeq++, title, completed: false };
		this.tasks.push(task);
		return task;
	}

	// Actualizar una tarea por id (title/completed)
	update(id: number, dto: Partial<Omit<Task, 'id'>>): Task | null {
		const idx = this.tasks.findIndex((t) => t.id === id);
		if (idx === -1) return null;
		this.tasks[idx] = { ...this.tasks[idx], ...dto };
		return this.tasks[idx];
	}

	// Eliminar una tarea por id
	remove(id: number): boolean {
		const len = this.tasks.length;
		this.tasks = this.tasks.filter((t) => t.id !== id);
		return this.tasks.length !== len;
	}
}
