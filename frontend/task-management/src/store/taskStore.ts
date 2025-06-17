import { create } from 'zustand';
import { Task } from '@/types/task'; 

interface TaskUiState {
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
}

export const useTaskUiStore = create<TaskUiState>((set) => ({
  filterCategory: null,
  setFilterCategory: (category) => set({ filterCategory: category }),
}));


interface TaskStoreState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTaskToList: (task: Task) => void;
  removeTaskFromList: (taskId: string) => void;
  updateTaskInList: (updatedTask: Task) => void;
}

export const useTaskStore = create<TaskStoreState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTaskToList: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTaskFromList: (taskId) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) })),
  updateTaskInList: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),
}));
