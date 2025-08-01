import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.listAllTasks(paginationDto)
  }

  @Get(':id')
  getTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() creasteTaskDto: CreateTaskDto) {
    console.log(creasteTaskDto)
    return this.tasksService.create(creasteTaskDto);
  }

  @Patch(':id')
  updateTask(@Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {

    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }
}
