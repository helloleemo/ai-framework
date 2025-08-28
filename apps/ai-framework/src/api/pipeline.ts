import { fi } from 'date-fns/locale';
import { POST, POST_urlencoded } from '.';
import { API_URLS } from './api/api-baseurl';
import { API_ENDPOINTS } from './api/api-endpoint';
import { API_TOKEN } from './api/api-token';

export const getAuthPipelineAPI = (
  grant_type: string,
  username: string,
  password: string,
  scope: string,
  client_id: string,
  client_secret: string,
) =>
  POST_urlencoded<any>(API_URLS.PIPELINE, API_ENDPOINTS.PIPELINE_TOKEN, {
    grant_type,
    username,
    password,
    scope,
    client_id,
    client_secret,
  });

export const getDagTemplateAPI = () =>
  POST<any>(
    API_URLS.PIPELINE,
    API_ENDPOINTS.DAG_TEMPLATE,
    {},
    API_TOKEN.pipelineToken,
  );

export const createDagAPI = (data: any) =>
  POST<any>(
    API_URLS.PIPELINE,
    API_ENDPOINTS.DAG_CREATE,
    data,
    API_TOKEN.pipelineToken,
  );

export const pipelineTokenTaker = () => {
  //
  const credentials = {
    grant_type: 'password',
    username: 'admin',
    password: 'admin',
    scope: '',
    client_id: '',
    client_secret: '',
  };
  //
  const fetchData = async () => {
    try {
      const res = await getAuthPipelineAPI(
        credentials.grant_type,
        credentials.username,
        credentials.password,
        credentials.scope,
        credentials.client_id,
        credentials.client_secret,
      );
      console.log('水管偷肯取得！', res);
      localStorage.setItem('pipelineToken', res.access_token);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      //
    }
  };

  //
  fetchData();
};
