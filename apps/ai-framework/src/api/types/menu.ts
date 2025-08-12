export interface MenuItem {
  name: string;
  icon: string | null;
  children: MenuItem[] | null;
}

export interface MenuResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data: MenuItem[];
}
