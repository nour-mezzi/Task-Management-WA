// frontend/task-management/src/lib/auth.ts
export function login(token: string) {
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
