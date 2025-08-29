import { POST } from '../shared/api';
import { API_URLS } from '../shared/api/base/api-baseurl';
import { API_ENDPOINTS } from '../shared/api/base/api-endpoint';
import { API_TOKEN } from '../shared/api/base/api-token';

export const connectOpcdaAPI = () =>
  POST<any>(
    API_URLS.UI_MOXA,
    API_ENDPOINTS.OPCDA_TEST,
    {},
    API_TOKEN.accessToken,
  );
