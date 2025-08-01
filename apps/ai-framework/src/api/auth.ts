import { api } from './index';

export function login(email: string, password: string) {
  return api('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
