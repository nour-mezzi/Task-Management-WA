import * as api from '@/lib/api';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';

export const getTasks = async (): Promise<Task[]> => {
  return await api.fetchTasks();
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  return await api.createTask(payload);
};

export const updateTask = async (payload: UpdateTaskPayload): Promise<Task> => {
  return await api.updateTask(payload.id, payload);
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.deleteTask(id);
};
