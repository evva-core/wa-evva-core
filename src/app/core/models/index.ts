export interface Host {
  id: string;
  name: string;
  ipAddress: string; // Changed from 'ip' to 'ipAddress'
  operatingSystem: string;
  architecture: string;
  status: 'online' | 'offline';
  port?: number;
  username?: string;
  description?: string;
  location?: string;
  tags?: string[];
  uptime?: string;
  lastSeen?: Date;
  diskUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
  memoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
  topProcesses?: Process[];
  services?: Service[];
  programs?: Program[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Process {
  id: string;
  name: string;
  memoryUsage: number;
  cpuUsage: number;
  pid: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'error';
  autoManagement: boolean;
  executablePath: string;
  schedule?: Schedule;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  executablePath: string;
  status: 'running' | 'stopped' | 'error';
  schedule?: Schedule;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  type: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  interval?: number; // for hourly repetition
  dayOfWeek?: number; // for weekly (0-6, Sunday = 0)
  dayOfMonth?: number; // for monthly (1-31)
  time: string; // HH:mm format
  enabled: boolean;
  nextRun?: Date;
}

export interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  branch: string;
  targetPath: string;
  hostId: string;
  responsible: string;
  status: 'cloning' | 'ready' | 'updating' | 'error';
  lastClone?: Date;
  lastPull?: Date;
  lastPush?: Date;
  autoSync?: AutoSync;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutoSync {
  id: string;
  enabled: boolean;
  type: 'interval' | 'schedule';
  intervalHours?: number;
  schedule?: {
    dayOfWeek: number;
    time: string;
  };
  nextSync?: Date;
}

export interface DashboardStats {
  totalHosts: number;
  onlineHosts: number;
  offlineHosts: number;
  totalProjects: number;
  activeProjects: number;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface WebSocketMessage {
  type: 'host_status_update' | 'project_sync_update' | 'system_alert' | 'notification';
  data: any;
  timestamp: Date;
}

export interface HostFilter {
  operatingSystem?: string;
  architecture?: string;
  status?: 'online' | 'offline';
  search?: string;
}

export interface ProjectFilter {
  hostId?: string;
  status?: string;
  responsible?: string;
  search?: string;
}

