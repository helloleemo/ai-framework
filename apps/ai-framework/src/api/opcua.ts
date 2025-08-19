import { authApi, menuApi } from '.';
// import {
//   OpcuaBrowse,
//   OpcuaBrowseResponse,
//   OpcuaConnection,
//   OpcuaConnectionResponse,
// } from './types/opcua';

export const connectOpcuaAPI = (
  connectionString: string,
  account: string,
  password: string,
) => {
  return menuApi.POST<any>('/api/opc-ua/test-connection', {
    connectionString,
    account,
    password,
  });
};

export const getTagsAPI = (
  connectionString: string,
  account: string,
  password: string,
  nodeId?: string,
  dataSourceId?: string,
) => {
  return menuApi.POST<any>('/api/opc-ua/browse', {
    dataSourceId,
    nodeId,
    connectionString,
    account,
    password,
  });
};
