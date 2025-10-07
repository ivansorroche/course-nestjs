import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { ResponseTaskDto } from './dto/response-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  // private tasks: Task[] = [
  //   { id: 1, name: 'Task One', description: 'This is the first task', completed: false },
  //   { id: 2, name: 'Task Two', description: 'This is the second task', completed: true },
  // ];

  async listAllTasks(paginationDto: PaginationDto): Promise<ResponseTaskDto[]> {
    const { limit = 2, offset = 0 } = paginationDto

    const list = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return list;
  }

  async getTaskById(id: number): Promise<ResponseTaskDto> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (task?.name) return task

    throw new NotFoundException('Essa tarefa não existe');
  }

  async create(createTaskDto: CreateTaskDto, tokenPayloadParam: PayloadTokenDto): Promise<ResponseTaskDto> {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          userId: tokenPayloadParam.sub,
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false
        }
      })
      return newTask;
    } catch (error) {
      throw new HttpException('Falha ao cadastrar task.', HttpStatus.BAD_REQUEST);

    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, tokenPayloadParam: PayloadTokenDto): Promise<ResponseTaskDto> {
    const findTask = await this.prisma.task.findUnique({
      where: { id },
    })
    if (!findTask) throw new NotFoundException('Essa tarefa não existe');
    if (findTask.userId !== tokenPayloadParam.sub) {
      throw new HttpException('Você não tem permissão para editar essa tarefa', HttpStatus.FORBIDDEN);
    }

    const taskToUpdate = await this.prisma.task.update({
      where: { id },
      data: {
        name: updateTaskDto.name ?? findTask.name,
        description: updateTaskDto.description ?? findTask.description,
        completed: updateTaskDto.completed ?? findTask.completed
      }
    })
    return taskToUpdate;
  }

  async delete(id: number, tokenPayloadParam: PayloadTokenDto) {
    try {
      const itemToDelete = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!itemToDelete) throw new NotFoundException('Essa tarefa não existe');

      if (itemToDelete.userId !== tokenPayloadParam.sub && itemToDelete.id) {
        throw new HttpException('Você não tem permissão para editar essa tarefa', HttpStatus.FORBIDDEN);
      }

      await this.prisma.task.delete({
        where: { id },
      });
      return { message: 'Tarefa deletada com sucesso' };

    } catch (error) {
      throw new HttpException('Erro ao deletar está tarefa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
