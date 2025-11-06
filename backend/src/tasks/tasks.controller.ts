// Controlador de tareas: expone endpoints CRUD protegidos con JWT.
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service.js';

@UseGuards(AuthGuard('jwt')) // Protege todas las rutas de este controlador
@Controller('tasks')
export class TasksController {
	constructor(private readonly tasks: TasksService) {}

	// GET /tasks → lista todas las tareas
	@Get()
	findAll() {
		return this.tasks.findAll();
	}

	// POST /tasks → crea una tarea nueva (requiere { title })
	@Post()
	create(@Body() body: { title?: string }) {
		const title = body?.title?.trim();
		if (!title) {
			throw new BadRequestException('El título es requerido');
		}
		return this.tasks.create(title);
	}

	// PUT /tasks/:id → actualiza título o estado completed
	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() dto: { title?: string; completed?: boolean },
	) {
		const updated = this.tasks.update(Number(id), dto);
		if (!updated) {
			throw new NotFoundException('Tarea no encontrada');
		}
		return updated;
	}

	// DELETE /tasks/:id → elimina una tarea
	@Delete(':id')
	remove(@Param('id') id: string) {
		const ok = this.tasks.remove(Number(id));
		if (!ok) {
			throw new NotFoundException('Tarea no encontrada');
		}
		// 204 sin contenido — Nest devolverá 200 si retornamos algo; aquí no devolvemos body.
	}
}
