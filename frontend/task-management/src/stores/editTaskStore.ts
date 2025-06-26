import { create } from 'zustand';
import { Task } from '@/types/task';

interface EditTaskFormState {
  taskId: string | null;
  taskTitle: string;
  selectedCategory: string;
  taskDescription: string;
  dueDate: Date | undefined;
  isLoading: boolean;
  error: string | null;

  loadTaskForEditing: (task: Task) => void;
  setTaskTitle: (title: string) => void;
  setSelectedCategory: (category: string) => void;
  setTaskDescription: (description: string) => void;
  setDueDate: (date: Date | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

export const useEditTaskFormStore = create<EditTaskFormState>((set) => ({
  taskId: null,
  taskTitle: '',
  selectedCategory: '',
  taskDescription: '',
  dueDate: undefined,
  isLoading: false,
  error: null,

  loadTaskForEditing: (task) => {
    set({
      taskId: task.id,
      taskTitle: task.title,
      selectedCategory: task.category || '',
      taskDescription: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      isLoading: false,
      error: null,
    });
  },

  setTaskTitle: (title) => set({ taskTitle: title }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setTaskDescription: (description) => set({ taskDescription: description }),
  setDueDate: (date) => set({ dueDate: date }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetForm: () =>
    set({
      taskId: null,
      taskTitle: '',
      selectedCategory: '',
      taskDescription: '',
      dueDate: undefined,
      isLoading: false,
      error: null,
    }),
}));
