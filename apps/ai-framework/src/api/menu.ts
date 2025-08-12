import { GET, POST } from './index';
import { AuthResponse } from './types/auth';

export const login = (account: string, password: string) =>
  POST<AuthResponse>('/api/options/menu-item', { account, password });

export const getMenuItems = () => GET('/api/options/menu-item');
