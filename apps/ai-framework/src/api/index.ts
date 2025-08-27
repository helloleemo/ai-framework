// res
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}

// GET
export async function GET<T>(
  baseUrl: string,
  endpoint: string,
  token?: string,
): Promise<T> {
  const accessToken = localStorage.getItem(token ?? '');
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse<T>(res);
}

// POST
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
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<T>(res);
}

// PUT
export async function PUT<T>(
  baseUrl: string,
  endpoint: string,
  data: unknown,
  token?: string,
): Promise<T> {
  const accessToken = localStorage.getItem(token ?? '');
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<T>(res);
}

// DELETE
export async function DELETE<T>(
  baseUrl: string,
  endpoint: string,
  token?: string,
): Promise<T> {
  const accessToken = localStorage.getItem(token ?? '');
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse<T>(res);
}

// // API
// export const authApi = {
//   getToken: () =>
//     POST(API_URLS.AUTH, API_ENDPOINTS.TOKEN, {
//       client_id: 'api-client',
//       client_secret: 'api-client',
//     }),
// };

// export const menuApi = {
//   getMenuItems: () => GET(API_URLS.UI_MOXA, API_ENDPOINTS.MENU_ITEM),
// };

// export const pipelineApi = {
//   getDagTemplate: () => GET(API_URLS.PIPELINE, API_ENDPOINTS.DAG_TEMPLATE),
//   createDag: (data: any) => POST(API_URLS.PIPELINE, API_ENDPOINTS.DAG, data),
// };
