import { POST } from '.';
import { API_URLS } from './base/api-baseurl';
import { API_ENDPOINTS } from './base/api-endpoint';
import { API_TOKEN } from './base/api-token';

export const connectOpcdaAPI = () =>
  POST<any>(
    API_URLS.UI_MOXA,
    API_ENDPOINTS.OPCDA_TEST,
    {},
    API_TOKEN.accessToken,
  );
