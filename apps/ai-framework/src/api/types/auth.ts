export interface AuthResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data: {
    code: string;
    accessToken: string;
    refreshToken: string;
  };
}
