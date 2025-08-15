import { getAuthPipelineAPI } from '@/api/pipeline';

const credentials = {
  grant_type: 'password',
  username: 'admin',
  password: 'admin',
  scope: '',
  client_id: '',
  client_secret: '',
};

function tokenTaker(): boolean {
  getAuthPipelineAPI(
    credentials.grant_type,
    credentials.username,
    credentials.password,
    credentials.scope,
    credentials.client_id,
    credentials.client_secret
  ).then((res) => {
    console.log('Token response:', res);
    localStorage.setItem('pipelineToken', res.access_token);
    return true;
  });
  return false;
}

export default tokenTaker;
