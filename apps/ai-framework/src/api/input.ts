// import { POST } from '.';
import { POST_urlencoded } from '../shared/api';
import { API_URLS } from '../shared/api/base/api-baseurl';
import { API_ENDPOINTS } from '../shared/api/base/api-endpoint';

export const getInputAPI = (
  client_id: string,
  client_secret: string,
  grant_type: string,
  username: string,
  password: string,
) =>
  POST_urlencoded<any>(API_URLS.INDATA_7014, API_ENDPOINTS.INPUT_AUTH, {
    client_id,
    client_secret,
    grant_type,
    username,
    password,
  });
