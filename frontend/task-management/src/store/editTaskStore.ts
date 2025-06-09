import { create } from 'zustand';
import { formatISO } from 'date-fns';
import { Task, UpdateTaskPayload } from '@/types/task';


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
  submitTaskUpdate: (onSuccess?: (updatedTask: Task) => void) => Promise<void>;
}

export const useEditTaskFormStore = create<EditTaskFormState>((set, get) => ({
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

  resetForm: () => set({
    taskId: null,
    taskTitle: '',
    selectedCategory: '',
    taskDescription: '',
    dueDate: undefined,
    isLoading: false,
    error: null,
  }),

  submitTaskUpdate: async (onSuccess) => {
    const state = get();
    const { taskId, taskTitle, selectedCategory, taskDescription, dueDate, setLoading, setError, resetForm } = state;

    if (!taskId) {
        console.error("Attempted to submit update with no task loaded.");
        setError("Cannot save: No task selected for editing.");
        return;
    }

    if (!taskTitle.trim()) {
        setError('Please enter a task title.');
        return;
    }
     if (!selectedCategory) {
        setError('Please select a category.');
        return;
    }

    setLoading(true);
    setError(null);

    const updatedTaskData: UpdateTaskPayload = {
        id: taskId,
        title: taskTitle,
        category: selectedCategory,
        description: taskDescription,
        dueDate: dueDate ? formatISO(dueDate) : null,
    };

    console.log(`Attempting to Update Task ID ${taskId}:`, updatedTaskData);

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTaskData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Task update failed:', errorData);
            setError(`Failed to update task: ${errorData.message || response.statusText}`);
            return;
        }

        const savedTask: Task = await response.json();
        console.log('Task updated successfully:', savedTask);

        if (onSuccess) {
            onSuccess(savedTask);
        }


    } catch (error) {
        console.error('Error submitting task update:', error);
        setError('An unexpected error occurred while updating the task.');
    } finally {
        setLoading(false);
    }
  },
}));