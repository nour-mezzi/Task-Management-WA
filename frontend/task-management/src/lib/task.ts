import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';

let tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Buy groceries',
    completed: false,
    category: 'shopping',
    description: 'Milk, eggs, bread',
    dueDate: null,
  },
  {
    id: uuidv4(),
    title: 'Walk the dog',
    completed: true,
    category: 'personal',
    description: null,
    dueDate: null,
  },
  {
    id: uuidv4(),
    title: 'Finish report',
    completed: false,
    category: 'work',
    description: 'Complete Q3 financial report',
    dueDate: '2023-12-31T23:59:59.999Z',
  },
];

// Get all tasks
export function getAllTasks(): Task[] {
  return tasks;
}

// Get a task by ID
export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

// Create a new task
export function createTask(payload: CreateTaskPayload): Task {
  const newTask: Task = {
    id: uuidv4(),
    title: payload.title,
    completed: false,
    category: payload.category,
    description: payload.description || null,
    dueDate: payload.dueDate || null,
  };

  tasks.push(newTask);
  return newTask;
}

// Update existing task
export function updateTask(id: string, payload: UpdateTaskPayload): Task | null {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  const updatedTask: Task = {
    ...tasks[taskIndex],
    title: payload.title,
    category: payload.category,
    description: payload.description || null,
    dueDate: payload.dueDate || null,
  };

  tasks[taskIndex] = updatedTask;
  return updatedTask;
}

// Delete a task
export function deleteTask(id: string): boolean {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < initialLength;
}
