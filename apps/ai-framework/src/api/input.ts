export async function fetchToken() {
  const url = '';

  const body = new URLSearchParams({
    client_id: 'api-client',
    client_secret: 'api-client',
    grant_type: 'password',
    username: 'sa',
    password: '0x90133115',
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return res.json();
}
