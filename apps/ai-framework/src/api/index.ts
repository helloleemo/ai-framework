// const url = process.env.API_DOMAIN || 'http://localhost:5280';
export const API_URLS = {
  AUTH: 'http://192.168.0.101:5290',
  MENU: 'http://192.168.0.101:5280',
  PIPELINE: 'http://192.168.0.20:8000',
  DEFAULT: '',
};

export function apiDomain(baseUrl: string, token?: string) {
  return {
    async GET<T>(endpoint: string): Promise<T> {
      const accessToken = localStorage.getItem(token ?? 'accessToken') ?? '';
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return handleResponse<T>(res);
    },

    async POST<T>(endpoint: string, data: unknown): Promise<T> {
      const accessToken = localStorage.getItem(token ?? 'accessToken') ?? '';
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      console.log('post', { endpoint, data, res });

      return handleResponse<T>(res);
    },
    async PUT<T>(endpoint: string, data: unknown): Promise<T> {
      const accessToken = localStorage.getItem(token ?? 'accessToken') ?? '';
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      console.log('put', { endpoint, data, res });
      return handleResponse<T>(res);
    },

    async DELETE<T>(endpoint: string): Promise<T> {
      const accessToken = localStorage.getItem(token ?? 'accessToken') ?? '';
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('delete', { endpoint, res });
      return handleResponse<T>(res);
    },
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  console.log('Response:', res);
  return res.json();
}

export const authApi = apiDomain(API_URLS.AUTH, 'accessToken');
export const menuApi = apiDomain(API_URLS.MENU, 'accessToken');
export const pipelineApi = apiDomain(API_URLS.PIPELINE, 'pipelineToken');
