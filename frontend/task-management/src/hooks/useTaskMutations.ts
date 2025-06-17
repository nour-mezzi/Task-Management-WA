import { createTask,updateTask, deleteTask } from '@/services/taskService';
import { CreateTaskPayload, Task,UpdateTaskPayload } from '@/types/task';
import {
  useMutation,
  type UseMutationResult,
} from '@tanstack/react-query';

export function useTaskMutation(): UseMutationResult<
  Task,
  Error,
  CreateTaskPayload
> {
  return useMutation<Task, Error, CreateTaskPayload>({
    mutationFn: createTask,
  });
}
export function useEditTaskMutation() {
  return useMutation<Task, Error, UpdateTaskPayload>({
    mutationFn: updateTask,
  });
}

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: deleteTask,
  });
};