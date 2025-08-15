import { menuApi } from './index';
import { MenuResponse } from './types/menu';

export const getMenuItemsAPI = () =>
  menuApi.GET<MenuResponse>('/api/options/menu-item');
