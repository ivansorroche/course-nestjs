import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,

  ) { }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: "Limite de tarefas a ser buscadas"
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 9,
    description: "Itens que deseja pular"
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.listAllTasks(paginationDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa pelo id' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1
  })
  getTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar tarefa' })
  createTask(
    @Body() creasteTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    return this.tasksService.create(creasteTaskDto, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar tarefa' })
  @Patch(':id')
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {

    return this.tasksService.update(id, updateTaskDto, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar tarefa' })
  @Delete(':id')
  deleteTask(
    @Param("id", ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayloadParam: PayloadTokenDto
  ) {
    return this.tasksService.delete(id, tokenPayloadParam);
  }
}
