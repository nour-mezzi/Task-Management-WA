'use client';

import React from 'react';
import { useCreateTaskFormStore } from '@/store/createTaskStore';
import { useTaskMutation } from '@/hooks/useTaskMutations';
import { formatISO } from 'date-fns';
import "@/styles/auth.css";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"

export default function CreateTaskPage() {
  const {
    taskTitle,
    selectedCategory,
    taskDescription,
    dueDate,
    error,
    setTaskTitle,
    setSelectedCategory,
    setTaskDescription,
    setDueDate,
    setError,
    resetForm,
  } = useCreateTaskFormStore();

  const mutation = useTaskMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    if (!selectedCategory.trim()) {
      setError('Category is required');
      return;
    }

    setError(null);

    const payload = {
      title: taskTitle,
      category: selectedCategory,
      description: taskDescription || '',
      dueDate: dueDate ? formatISO(dueDate) : undefined,
    };

    try {
      await mutation.mutateAsync(payload);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Task creation failed.');
    }
  };

  return (
  <div className="split-layout-card-section">
        <Card className="w-full max-w-sm split-layout-the-card">
          <CardHeader>
            <CardTitle>Create new Task</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              
      <Input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task Title"
        required
      />

      <Input
        type="text"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        placeholder="Category"
        required
      />

      <Textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Description (optional)"
      />

      <Input
        type="date"
        value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      

      {mutation.error && (
        <p style={{ color: 'red' }}>
          {mutation.error.message || 'An error occurred'}
        </p>
      )}
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Create Task'}
      </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    
  );
}
