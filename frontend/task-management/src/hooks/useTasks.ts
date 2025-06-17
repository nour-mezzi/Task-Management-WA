import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';

// API Utility
const api = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error creating resource');
    }
    return res.json();
  },

  put: async <T>(url: string, data: any): Promise<T> => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error updating resource');
    }
    return res.json();
  },

  delete: async (url: string): Promise<void> => {
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error deleting resource');
    }
  },
};

// Fetch all tasks
export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: () => api.get<Task[]>('/api/tasks'),
  });
};

// Create a new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskPayload>({
    mutationFn: (newTask) => api.post<Task>('/api/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

//Update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskPayload>({
    mutationFn: ({ id, ...update }) => api.put<Task>(`/api/tasks/${id}`, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (taskId) => api.delete(`/api/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
