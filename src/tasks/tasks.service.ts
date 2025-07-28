import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {

  listAllTasks() {
    return [
      { id: 1, title: 'Task One', description: 'This is the first task' },
    ]
  }
}
