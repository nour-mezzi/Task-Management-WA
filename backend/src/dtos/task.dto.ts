import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
