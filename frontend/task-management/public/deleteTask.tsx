'use client';

import React from 'react';
import { useDeleteTask } from '@/hooks/useTaskMutations';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteTaskButtonProps {
  taskId: string;
  onDeleted?: () => void;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({ taskId, onDeleted }) => {
  const deleteTaskMutation = useDeleteTask();

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      if (onDeleted) onDeleted();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={deleteTaskMutation.isPending}
    >
      {deleteTaskMutation.isPending ? 'Deleting...' : <Trash2 className="w-4 h-4" />}
    </Button>
  );
};

export default DeleteTaskButton;
