import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types/task';

interface TaskState {
  tasks: Task[];
  addTaskToList: (task: Task) => void; // Action to add a task to the list (e.g., after API success)
  deleteTask: (taskId: string) => void; // Action to remove a task from the list
  
}

export const useTaskStore = create<TaskState>((set) => ({
  //remove after integration of BD
  tasks: [
    
    { id: uuidv4(), title: 'Buy groceries', completed: false, category: 'shopping', description: 'Milk, eggs, bread', dueDate: null },
    { id: uuidv4(), title: 'Walk the dog', completed: true, category: 'personal', description: null, dueDate: null },
    { id: uuidv4(), title: 'Finish report', completed: false, category: 'work', description: 'Complete Q3 financial report', dueDate: '2023-12-31T23:59:59.999Z' },
  ],

  addTaskToList: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}));