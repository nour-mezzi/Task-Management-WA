// utils/taskApi.ts

import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task'
import { getAuthHeader } from './api'

const API_BASE = 'http://localhost:3000/api/tasks'

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE, {
    headers: {
      ...getAuthHeader(),
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch task ${id}: ${res.statusText}`)
  }
  return res.json()
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || `Failed to create task: ${res.statusText}`)
  }
  return res.json()
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || `Failed to update task: ${res.statusText}`)
  }
  return res.json()
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || `Failed to delete task: ${res.statusText}`)
  }
}
