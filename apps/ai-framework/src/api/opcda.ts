import { POST } from '.';
import { API_URLS } from './api/api-baseurl';
import { API_ENDPOINTS } from './api/api-endpoint';

export const connectOpcdaAPI = () =>
  POST<any>(API_URLS.UI_MOXA, API_ENDPOINTS.OPCDA_TEST, {}, 'accessToken');
