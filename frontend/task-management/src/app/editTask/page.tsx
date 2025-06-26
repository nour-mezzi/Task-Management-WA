'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import '@/styles/auth.css';

import { useEditTaskFormStore } from '@/stores/editTaskStore';
import { Task } from '@/types/task';
import { useEditTaskMutation } from '@/hooks/useTaskMutations';
import { UpdateTaskPayload } from '@/types/task';

import { z } from 'zod';

const taskSchema = z.object({
  taskTitle: z.string().min(1, "Task title is required"),
  selectedCategory: z.string().min(1, "Category is required"),
  taskDescription: z.string().optional(),
  dueDate: z.date().optional(),
});

interface EditTaskFormProps {
  initialTaskData: Task;
  categories: { value: string; label: string; }[];
  onSave?: (updatedTask: Task) => void;
  onCancel?: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  initialTaskData,
  categories,
  onSave,
  onCancel
}) => {
  const {
    taskId,
    taskTitle,
    selectedCategory,
    taskDescription,
    dueDate,
    error,
    loadTaskForEditing,
    setTaskTitle,
    setSelectedCategory,
    setTaskDescription,
    setDueDate,
    setError,
    resetForm,
  } = useEditTaskFormStore();

  const mutation = useEditTaskMutation();

  useEffect(() => {
    if (initialTaskData) {
      loadTaskForEditing(initialTaskData);
    }
    return () => {
      resetForm();
    };
  }, [initialTaskData, loadTaskForEditing, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = taskSchema.safeParse({
      taskTitle,
      selectedCategory,
      taskDescription,
      dueDate,
    });

    if (!result.success) {
      const issues = result.error.issues.map(issue => issue.message).join('\n');
      setError(issues);
      return;
    }

    if (!taskId) return;

    const payload: UpdateTaskPayload = {
      id: taskId,
      title: taskTitle,
      category: selectedCategory,
      description: taskDescription,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };

    try {
      const updated = await mutation.mutateAsync(payload);
      onSave?.(updated);
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    }
  };

  const dueDateButtonClasses = cn(
    "w-full justify-start text-left font-normal",
    !dueDate && "text-muted-foreground"
  );

  return (
    <div className="split-layout-card-section">
      <Card className="w-full max-w-sm split-layout-the-card">
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Modify task details and save changes</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}
          {taskId ? (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-title">Task Title</Label>
                  <Input
                    id="edit-task-title"
                    type="text"
                    placeholder="e.g., Buy groceries"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    required
                  >
                    <SelectTrigger id="edit-task-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-task-description"
                    placeholder="Add details about the task..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-task-due-date">Due Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={dueDateButtonClasses}
                        disabled={mutation.isPending}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <CardFooter className="flex justify-end gap-2 p-0 pt-6">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <p className="p-4 text-center text-gray-500">Loading task data...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTaskForm;
