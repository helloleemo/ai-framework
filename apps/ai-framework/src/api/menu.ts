import { GET } from './index';
import { MenuResponse } from './types/menu';

export const getMenuItemsAPI = () =>
  GET<MenuResponse>('/api/options/menu-item');
