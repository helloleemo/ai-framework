import { GET } from './index';
import { MenuResponse } from './types/menu';

export const getMenuItems = () => GET<MenuResponse>('/api/options/menu-item');
