import { authApi } from './index';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  DecodeTokenResponse,
} from './types/auth';

export const loginAPI = (account: string, password: string) =>
  authApi.POST<LoginResponse>('/api/auth/login', { account, password });

export const logoutAPI = () =>
  authApi.POST<LogoutResponse>('/api/auth/logout', '');

export const refreshTokenAPI = (
  code?: string,
  accessToken?: string,
  refreshToken?: string,
) =>
  authApi.POST<RefreshTokenResponse>('/api/auth/refresh-token', {
    code,
    accessToken,
    refreshToken,
  });

export const decodeTokenAPI = (token: string) =>
  authApi.POST<DecodeTokenResponse>(
    `/api/auth/decode-token?token=${token}`,
    {},
  );
