import { POST } from '.';
import { API_URLS } from './base/api-baseurl';
import { API_ENDPOINTS } from './base/api-endpoint';
import { API_TOKEN } from './base/api-token';

export const connectOpcuaAPI = (
  connectionString: string,
  account: string,
  password: string,
) =>
  POST<any>(
    API_URLS.UI_MOXA,
    API_ENDPOINTS.OPCUA_TEST,
    {
      connectionString,
      account,
      password,
    },
    API_TOKEN.accessToken,
  );

export const getTagsAPI = (
  dataSourceId: string | null,
  nodeId: string | '',
  connectionString: string,
  account: string,
  password: string,
) =>
  POST<any>(API_URLS.UI_MOXA, API_ENDPOINTS.OPCUA_BROWSE, {
    dataSourceId,
    nodeId,
    connectionString,
    account,
    password,
  });

export const readNodesAPI = (
  dataSourceId: string | null,
  connectionString: string,
  account: string,
  password: string,
  nodeId: string[],
) =>
  POST<any>(API_URLS.UI_MOXA, API_ENDPOINTS.OPCUA_READ_NODE, {
    dataSourceId,
    connectionString,
    account,
    password,
    nodeId,
  });
