// frontend/task-management/src/lib/auth.ts
export function login(token: string) {
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
export async function signupUser(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const res = await fetch('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Signup failed');

  localStorage.setItem('token', data.token);
}
