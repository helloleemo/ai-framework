import { API_URLS } from '../shared/api/base/api-baseurl';
import { API_ENDPOINTS } from '../shared/api/base/api-endpoint';
import { POST } from '../shared/api/index';
import {
  DecodeTokenResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from './types/auth';

export const loginAPI = (account: string, password: string) =>
  POST<LoginResponse>(API_URLS.AUTH, API_ENDPOINTS.LOGIN, {
    account,
    password,
  });

export const logoutAPI = () =>
  POST<LogoutResponse>(API_URLS.AUTH, API_ENDPOINTS.LOGOUT, {});

export const refreshTokenAPI = (
  code?: string,
  accessToken?: string,
  refreshToken?: string,
) =>
  POST<RefreshTokenResponse>(API_URLS.AUTH, API_ENDPOINTS.REFRESH_TOKEN, {
    code,
    accessToken,
    refreshToken,
  });

export const decodeTokenAPI = (token: string) =>
  POST<DecodeTokenResponse>(
    API_URLS.AUTH,
    `${API_ENDPOINTS.DECODE_TOKEN}?token=${token}`,
    {},
  );
