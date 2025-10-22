import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

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

export interface RecentActivity {
  id: string;
  type: 'host_online' | 'host_offline' | 'project_updated' | 'service_started' | 'service_stopped';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly endpoint = '/api/v1/dashboard';

  constructor(private http: HttpService) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.endpoint}/stats`);
  }

  getRecentActivities(): Observable<ApiResponse<RecentActivity[]>> {
    return this.http.get<ApiResponse<RecentActivity[]>>(`${this.endpoint}/activities`);
  }

  getDashboardData(): Observable<ApiResponse<DashboardData>> {
    return this.http.get<ApiResponse<DashboardData>>(`${this.endpoint}/data`);
  }
}