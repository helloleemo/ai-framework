import { GET } from '..';

export const API_ENDPOINTS = {
  // AUTH
  TOKEN: '/connect/token',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  DECODE_TOKEN: '/api/auth/decode-token',
  // redirection
  GET_TOKENS: '/connect/token',
  GET_REFRESH_TOKEN: '/connect/token',
  SLM_LOGOUT: '/SLM/Logout',

  // MENU
  MENU_ITEM: '/api/options/menu-item',

  // OPC UA
  OPCUA_TEST: '/api/opc-ua/test-connection',
  OPCUA_BROWSE: '/api/opc-ua/browse',
  OPCUA_READ_NODE: '/api/opc-ua/read-node',

  // OPC DA
  OPCDA_TEST: '/api/opc-da/test-connection',

  // INPUT - AUTH
  INPUT_AUTH: '/connect/token',

  // INPUT (indata)
  GET_TAGS: '/api/server/tag/list',
  GET_TAGS_VALUES: '/api/server/tags/value',

  // PIPELINE
  PIPELINE_TOKEN: '/auth/token',
  DAG_TEMPLATE: '/api/dags/template_dags',
  DAG_CREATE: '/api/dags',
  DAG: `/api/dags`,
  ALL_DAGS: '/api/dags/all_dags',
};
