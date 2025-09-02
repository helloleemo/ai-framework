export interface MenuItem {
  name: string;
  children: MenuItem[] | null;
  label?: string | null;
  type?: 'input' | 'output' | 'transform';
  intro?: string | null;
  description?: string | null;
}

export interface MenuResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data: MenuItem[];
}
