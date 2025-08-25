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
  dataSourceId: string | null,
  nodeId: string | '',
  connectionString: string,
  account: string,
  password: string,
) => {
  return menuApi.POST<any>('/api/opc-ua/browse', {
    dataSourceId,
    nodeId,
    connectionString,
    account,
    password,
  });
};

export const readNodesAPI = (
  dataSourceId: string | null,
  connectionString: string,
  account: string,
  password: string,
  nodeId: [],
) => {
  return menuApi.POST<any>('/api/opc-ua/read-node', {
    dataSourceId,
    connectionString,
    account,
    password,
    nodeId,
  });
};
