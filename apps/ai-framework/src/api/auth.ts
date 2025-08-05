import { get, post } from './index';

interface User {
  id: string;
  name: string;
  email: string;
}

export const fetchUserList = () => get<User[]>('/api/users');
export const fetchUserById = (id: string) => get<User>(`/api/users/${id}`);
export const createUser = (data: { name: string; email: string }) =>
  post<User>('/api/users', data);
