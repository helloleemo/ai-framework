import { menuApi } from '.';

export const connectOpcdaAPI = () => {
  return menuApi.POST<any>('/api/opc-da/test-connection', {});
};
