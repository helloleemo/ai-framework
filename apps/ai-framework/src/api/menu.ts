import { API_URLS } from '../shared/api/base/api-baseurl';
import { API_ENDPOINTS } from '../shared/api/base/api-endpoint';
import { API_TOKEN } from '../shared/api/base/api-token';
import { GET } from '../shared/api/index';
import { MenuResponse } from './types/menu';

export const getMenuItemsAPI = async (): Promise<MenuResponse> => {
  return GET<MenuResponse>(
    API_URLS.UI_MOXA,
    API_ENDPOINTS.MENU_ITEM,
    API_TOKEN.accessToken,
  );
};
