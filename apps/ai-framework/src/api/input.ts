// import { POST } from '.';
import { API_URLS } from './api/api-baseurl';
import { API_ENDPOINTS } from './api/api-endpoint';

export const getInputAPI = (
  client_id: string,
  client_secret: string,
  grant_type: string,
  username: string,
  password: string,
) =>
  POST<any>(API_URLS.INDATA_7014, API_ENDPOINTS.INPUT_AUTH, {
    client_id,
    client_secret,
    grant_type,
    username,
    password,
  });

export async function POST<T>(
  baseUrl: string,
  endpoint: string,
  data: any,
  token?: string,
): Promise<T> {
  const accessToken = localStorage.getItem(token ?? '');
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${accessToken}`,
    },
    body: new URLSearchParams(data).toString(),
  });

  return handleResponse<T>(res);
}

// res
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}
