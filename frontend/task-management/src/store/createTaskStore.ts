import { create } from 'zustand';

interface CreateTaskFormState {
  taskTitle: string;
  selectedCategory: string;
  taskDescription: string;
  dueDate: Date | null;
  error: string | null;

  setTaskTitle: (title: string) => void;
  setSelectedCategory: (category: string) => void;
  setTaskDescription: (description: string) => void;
  setDueDate: (date: Date | null) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

export const useCreateTaskFormStore = create<CreateTaskFormState>((set) => ({
  taskTitle: '',
  selectedCategory: '',
  taskDescription: '',
  dueDate: null,
  error: null,

  setTaskTitle: (title) => set({ taskTitle: title }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setTaskDescription: (description) => set({ taskDescription: description }),
  setDueDate: (date) => set({ dueDate: date }),
  setError: (error) => set({ error }),
  resetForm: () =>
    set({
      taskTitle: '',
      selectedCategory: '',
      taskDescription: '',
      dueDate: null,
      error: null,
    }),
}));
