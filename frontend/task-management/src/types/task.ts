export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category?: string | null; 
  description?: string | null; 
  dueDate?: string | null; 
}

export interface CreateTaskPayload {
    title: string;
    category: string;
    description: string; 
    dueDate: string | null;
}
export interface UpdateTaskPayload {
    id: string; 
    title: string;
    category: string;
    description: string;
    dueDate: string | null;
}