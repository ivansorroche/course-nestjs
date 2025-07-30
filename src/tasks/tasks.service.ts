import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {

  private tasks: Task[] = [
    { id: 1, name: 'Task One', description: 'This is the first task', completed: false },
    { id: 2, name: 'Task Two', description: 'This is the second task', completed: true },
  ];

  listAllTasks() {
    return this.tasks
  }

  getTaskById(id: string) {
    return this.tasks.find(task => task.id === Number(id));
  }

  create(body: any) {
    const newId = this.tasks.length + 1;
    const newTask: Task = {
      id: newId,
      ...body,
    }

    this.tasks.push(newTask);
    return newTask;
  }

}
