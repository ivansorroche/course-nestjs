import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  findAll() {
    return this.tasksService.listAllTasks()
  }

  @Get(':id')
  getTaskById(@Param("id") id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() body: any) {
    console.log(body)
    return this.tasksService.create(body);
  }

  @Patch(':id')
  updateTask(@Param("id") id: string, @Body() body: any) {
    console.log(id)
    console.log(body)
    return "atualizando a task de id " + id + " com os dados: " + JSON.stringify(body);
  }

  @Delete(':id')
  deleteTask(@Param("id") id: string) {
    return "Deletando a task de id " + id;
  }
}
