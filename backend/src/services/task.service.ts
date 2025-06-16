import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const tasks: Task[] = [];

export const TaskService = {
  getAll: () => tasks,

  create: (title: string): Task => {
    const task = { id: uuidv4(), title, completed: false };
    tasks.push(task);
    return task;
  },

  delete: (id: string): boolean => {
    const index = tasks.findIndex(t => t.id === id);
    if (index >= 0) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  }
};
