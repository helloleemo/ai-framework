export interface MenuItem {
  name: string;
  icon: string | null;
  children: MenuItem[] | null;
  type?: 'input' | 'output' | 'transform';
}

export interface MenuResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data: MenuItem[];
}
