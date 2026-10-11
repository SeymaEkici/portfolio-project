import { api } from '@/lib/api';
import { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<{ user: User }> {
  const response = await api.post('/auth/login', credentials);
  return response.data.data;
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/auth/me');
  return response.data.data.user;
}