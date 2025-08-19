export interface OpcuaConnection {
  connectionString: string;
  account: string;
  password: string;
}

export interface OpcuaConnectionResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data?: any;
}

export interface OpcuaBrowseResponse {
  dataSourceId: string;
  nodeId: string;
  connectionString: string;
  account: string;
  password: string;
}

export interface OpcuaBrowseResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data?: OpcuaBrowseNode[];
}

export interface OpcuaBrowseNode {
  nodeId: string;
  browseName: string;
  displayName: string;
  nodeClass: string;
  hasChildren: boolean;
}
