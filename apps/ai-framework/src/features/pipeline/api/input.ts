import { API_TOKEN } from '@/shared/api/base/api-token';
import { GET_withParams, POST, POST_urlencoded } from '../../../shared/api';
import { API_URLS } from '../../../shared/api/base/api-baseurl';
import { API_ENDPOINTS } from '../../../shared/api/base/api-endpoint';

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

export const getTagsIndataAPI = (params: Record<string, unknown>) =>
  GET_withParams<unknown>(
    API_URLS.INDATA_17000,
    API_ENDPOINTS.GET_TAGS,
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    API_TOKEN.accessToken,
  );

export const getTagsValuesAPI = (body: any) =>
  POST<any>(
    API_URLS.INDATA_17000,
    API_ENDPOINTS.GET_TAGS_VALUES,
    body,
    API_TOKEN.accessToken,
  );
