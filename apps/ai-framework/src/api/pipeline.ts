export async function getAuthPipelineAPI(
  grant_type: string,
  username: string,
  password: string,
  scope: string,
  client_id: string,
  client_secret: string
) {
  const body = new URLSearchParams({
    grant_type,
    username,
    password,
    scope,
    client_id,
    client_secret,
  }).toString();

  const res = await fetch('http://192.168.0.20:8000/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });
  return res.json();
}

export async function getDagTemplate() {
  const res = await fetch('http://192.168.0.20:8000/api/dags/template_dags', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('pipelineToken')}`,
    },
  });
  console.log('getDagTemplate', res);
  return res.json();
}

export async function createDag(data: any) {
  const res = await fetch('http://192.168.0.20:8000/api/dags', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('pipelineToken')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('createDag', res);
  return res.json();
}
