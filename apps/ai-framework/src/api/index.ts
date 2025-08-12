// const url = process.env.API_DOMAIN || 'http://localhost:5280';
const url = 'http://localhost:5280'; // 完成記得關掉

export async function GET<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(res);
}

export async function POST<T>(endpoint: string, data: unknown): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('post', { endpoint, data, res });

  return handleResponse<T>(res);
}

export async function PUT<T>(endpoint: string, data: unknown): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('put', { endpoint, data, res });
  return handleResponse<T>(res);
}

export async function DELETE<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('delete', { endpoint, res });
  return handleResponse<T>(res);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  console.log('Response:', res);
  return res.json();
}
