import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {

  private tasks: Task[] = [
    { id: 1, name: 'Task One', description: 'This is the first task', completed: false },
    { id: 2, name: 'Task Two', description: 'This is the second task', completed: true },
  ];

  listAllTasks() {
    return this.tasks
  }

  getTaskById(id: number) {
    const item = this.tasks.find(task => task.id === id);
    if (item) return item;
    // throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND);
    throw new NotFoundException('Essa tarefa não existe');
  }

  create(createTaskDto: CreateTaskDto) {
    const newId = this.tasks.length + 1;
    const newTask: Task = {
      id: newId,
      ...createTaskDto,
      completed: false
    }

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex <= 0) {
      throw new NotFoundException('Essa tarefa não existe')
    }
    const tasktoUpdate = this.tasks[taskIndex];
    this.tasks[taskIndex] = { ...tasktoUpdate, ...updateTaskDto };
    return tasktoUpdate
  }

  delete(id: number) {
    const newList = this.tasks.filter(task => task.id !== id);
    if (newList.length < this.tasks.length) {
      this.tasks = newList;
      return "Tarefa deletada com sucesso";
    }
    throw new NotFoundException('Essa tarefa não existe');

  }

}
