export interface AdapterStatus {
  isConnected: boolean;
  platform: string;
  message?: string;
}

export interface BaseAdapter {
  getStatus(): AdapterStatus;
}
