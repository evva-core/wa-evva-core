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



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly endpoint = '/api/v1/dashboard';

  constructor(private http: HttpService) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.endpoint}/stats`);
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.endpoint}/activities`);
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.endpoint}/data`);
  }
}