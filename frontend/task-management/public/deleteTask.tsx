'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';

interface DeleteTaskButtonProps {
  taskId: string;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ taskId }) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDelete = () => {
    console.log(`Attempting to delete task ID: ${taskId}`);
    deleteTask(taskId);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};

export default DeleteTaskButton;