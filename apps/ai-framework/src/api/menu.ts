import { API_URLS } from './base/api-baseurl';
import { API_ENDPOINTS } from './base/api-endpoint';
import { API_TOKEN } from './base/api-token';
import { GET } from './index';
import { MenuResponse } from './types/menu';

export const getMenuItemsAPI = async (): Promise<MenuResponse> => {
  return GET<MenuResponse>(
    API_URLS.UI_MOXA,
    API_ENDPOINTS.MENU_ITEM,
    API_TOKEN.accessToken,
  );
};
