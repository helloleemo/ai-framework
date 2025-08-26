export interface MenuItem {
  name: string;
  children: MenuItem[] | null;
  label?: string | null;
  type?: 'input' | 'output' | 'transform';
  description?: string | null;
}

export interface MenuResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data: MenuItem[];
}
