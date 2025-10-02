import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,

  ) { }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.listAllTasks(paginationDto)
  }

  @Get(':id')
  getTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  createTask(
    @Body() creasteTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    console.log(tokenPayloadParam, "+++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    return this.tasksService.create(creasteTaskDto, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {

    return this.tasksService.update(id, updateTaskDto, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteTask(
    @Param("id", ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    return this.tasksService.delete(id, tokenPayloadParam);
  }
}
