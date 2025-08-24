export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] };
}

export interface Host {
  id: number;
  name: string;
  operatingSystem: string;
  ipAddress: string;
  architecture: string;
  isActive: boolean;
  port: number;
  description: string;
  location: string;
  uniqueId: string;
}

export interface DiskUsage {
  name: string;
  usedSpaceGB: number;
  totalSpaceGB: number;
  usagePercentage: number;
}

export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
}

export interface NetworkInfo {
  bytesIn: string;
  bytesOut: string;
}

export interface DetailedHost extends Host {
  status: 'online' | 'offline';
  disks: DiskUsage[];
  memoryUsage: MemoryUsage;
  topProcesses: Process[];
  services: Service[];
  programs: Program[];
  lastSeen: Date;
  uptime: string;
  cpuUsage: number;
  networkInfo: NetworkInfo;
}

//Virá do cb-agent
export interface Process {
  id: number;
  name: string;
  memoryUsagePercentage: number;
  memoryUsageMB: number;
  cpuUsage: number;
}
//Virá do cb-agent
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
  hostName?: string;
  responsible: string;
  status: 'cloning' | 'ready' | 'updating' | 'error'|'syncing';
  lastSync: Date;
  lastClone?: Date;
  lastPull?: Date;
  lastPush?: Date;
  autoSync?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDockerEnabled: boolean;
  dockerConfig?: DockerConfig;
}

export interface DockerConfig {
  useDockerCompose: boolean;
  containerPort: number;
  hostPort: number;
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