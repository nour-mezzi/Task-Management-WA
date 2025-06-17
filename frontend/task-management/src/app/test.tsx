import React from 'react';
import { useMutation } from '@tanstack/react-query';

async function fakeCreateTask(data: { title: string }) {
  return new Promise((resolve) => setTimeout(() => resolve({ id: '1', title: data.title }), 1000));
}

export default function TestMutation() {
  const mutation = useMutation(fakeCreateTask);

  return (
    <div>
      <button disabled={mutation.isLoading} onClick={() => mutation.mutate({ title: 'test' })}>
        {mutation.isLoading ? 'Loading...' : 'Create'}
      </button>
      {mutation.isError && <p>Error: {(mutation.error as Error).message}</p>}
    </div>
  );
}
