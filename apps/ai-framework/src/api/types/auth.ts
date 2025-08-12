export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode?: string;
  data: {
    code: string;
    accessToken: string;
    refreshToken: string;
  };
}
export interface LogoutResponse {
  success: boolean;
  message: string;
  statusCode?: string;
  data: any;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  statusCode?: string;
  data: {
    code: string;
    accessToken: string;
    refreshToken: string;
  } | null;
}

export interface DecodeTokenResponse {
  success: boolean;
  message: string;
  statusCode?: string;
  data: any;
}
