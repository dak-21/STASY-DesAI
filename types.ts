
export type SystemStatus = 
  | 'Normal' 
  | 'High Density Cell Detected' 
  | 'High Density Warning' 
  | 'Critical Density Cell Detected' 
  | 'CRITICAL RISK'
  | 'Initializing'
  | 'Error';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'system';
}

export interface BoundingBox {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  vx: number;
  vy: number;
}

export interface GridCell {
  count: number;
  status: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface EmergencyContact {
  role: string;
  status: 'Idle' | 'Notified' | 'Dispatched';
  eta?: string;
}
