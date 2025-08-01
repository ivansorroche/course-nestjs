import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  private tasks: Task[] = [
    { id: 1, name: 'Task One', description: 'This is the first task', completed: false },
    { id: 2, name: 'Task Two', description: 'This is the second task', completed: true },
  ];

  async listAllTasks() {
    const list = await this.prisma.task.findMany();
    return list
  }

  async getTaskById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (task?.name) return task

    throw new NotFoundException('Essa tarefa não existe');
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false
      }
    })
    return newTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const findTask = await this.prisma.task.findUnique({
      where: { id },
    })
    if (!findTask) throw new NotFoundException('Essa tarefa não existe');

    const taskToUpdate = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto
    })
    return taskToUpdate;
  }

  async delete(id: number) {
    try {
      const itemToDelete = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!itemToDelete) throw new NotFoundException('Essa tarefa não existe');

      await this.prisma.task.delete({
        where: { id },
      });
      return { message: 'Tarefa deletada com sucesso' };

    } catch (error) {
      throw new HttpException('Erro ao deletar está tarefa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
