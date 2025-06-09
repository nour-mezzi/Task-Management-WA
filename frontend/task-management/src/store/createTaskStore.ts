import { create } from 'zustand';
import { formatISO } from 'date-fns';
import { CreateTaskPayload, Task } from '@/types/task'; 
import { useTaskStore } from '@/store/taskStore'; 


interface CreateTaskFormState {
  taskTitle: string;
  selectedCategory: string;
  taskDescription: string;
  dueDate: Date | undefined;
  isLoading: boolean;
  error: string | null;

  setTaskTitle: (title: string) => void;
  setSelectedCategory: (category: string) => void;
  setTaskDescription: (description: string) => void;
  setDueDate: (date: Date | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
  submitTask: () => Promise<void>;
}

export const useCreateTaskFormStore = create<CreateTaskFormState>((set, get) => ({
  taskTitle: '',
  selectedCategory: '',
  taskDescription: '',
  dueDate: undefined,
  isLoading: false,
  error: null,

  setTaskTitle: (title) => set({ taskTitle: title }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setTaskDescription: (description) => set({ taskDescription: description }),
  setDueDate: (date) => set({ dueDate: date }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  resetForm: () => set({
    taskTitle: '',
    selectedCategory: '',
    taskDescription: '',
    dueDate: undefined,
    isLoading: false,
    error: null,
  }),

  submitTask: async () => {
    const state = get();
    const { taskTitle, selectedCategory, taskDescription, dueDate, setLoading, setError, resetForm } = state;

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

    const taskData: CreateTaskPayload = {
        title: taskTitle,
        category: selectedCategory,
        description: taskDescription,
        dueDate: dueDate ? formatISO(dueDate) : null,
    };

    console.log('Attempting to Create Task:', taskData);

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Task creation failed:', errorData);
            setError(`Failed to create task: ${errorData.message || response.statusText}`);
            return;
        }

        const createdTask: Task = await response.json(); 
        console.log('Task created successfully:', createdTask);

       
        useTaskStore.getState().addTaskToList(createdTask);

        resetForm();

    } catch (error) {
        console.error('Error submitting task:', error);
        setError('An unexpected error occurred while creating the task.');
    } finally {
        setLoading(false);
    }
  },
}));