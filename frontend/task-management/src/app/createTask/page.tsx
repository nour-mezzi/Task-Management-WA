'use client';

import React from 'react';
import { useCreateTaskFormStore } from '@/store/createTaskStore';
import { useTaskMutation } from '@/hooks/useTaskMutations';
import { formatISO } from 'date-fns';

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Task Title"
        required
      />

      <input
        type="text"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        placeholder="Category"
        required
      />

      <textarea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Description (optional)"
      />

      <input
        type="date"
        value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Create Task'}
      </button>

      {mutation.error && (
        <p style={{ color: 'red' }}>
          {mutation.error.message || 'An error occurred'}
        </p>
      )}
    </form>
  );
}
