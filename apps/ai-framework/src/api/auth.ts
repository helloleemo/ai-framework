import { GET, POST } from './index';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  DecodeTokenResponse,
} from './types/auth';

export const loginAPI = (account: string, password: string) =>
  POST<LoginResponse>('/api/auth/login', { account, password });

export const logoutAPI = () => POST<LogoutResponse>('/api/auth/logout', '');

export const refreshTokenAPI = (
  code: string,
  accessToken: string,
  refreshToken: string
) =>
  POST<RefreshTokenResponse>('/api/auth/refresh-token', {
    code,
    accessToken,
    refreshToken,
  });

export const decodeTokenAPI = (token: string) =>
  POST<DecodeTokenResponse>(`/api/auth/decode-token?token=${token}`, {});
