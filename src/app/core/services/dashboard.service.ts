import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { DashboardStats, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly endpoint = '/dashboard';

  constructor(private http: HttpService) {}

  // Get dashboard statistics
  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.endpoint}/stats`);
  }

  // Get recent activities
  getRecentActivities(limit: number = 10): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/activities?limit=${limit}`);
  }

  // Get system health metrics
  getSystemHealth(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/system-health`);
  }

  // Get host status overview
  getHostStatusOverview(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/host-status`);
  }

  // Get project status overview
  getProjectStatusOverview(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/project-status`);
  }

  // Get performance metrics
  getPerformanceMetrics(timeRange: string = '24h'): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/performance?range=${timeRange}`);
  }

  // Get alerts and notifications
  getAlerts(severity?: string): Observable<ApiResponse<any[]>> {
    const params = severity ? `?severity=${severity}` : '';
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/alerts${params}`);
  }

  // Get resource usage trends
  getResourceUsageTrends(timeRange: string = '7d'): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/resource-trends?range=${timeRange}`);
  }

  // Get top consuming processes across all hosts
  getTopProcesses(limit: number = 10): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/top-processes?limit=${limit}`);
  }

  // Get network statistics
  getNetworkStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/network-stats`);
  }

  // Get storage statistics
  getStorageStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/storage-stats`);
  }

  // Get uptime statistics
  getUptimeStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/uptime-stats`);
  }

  // Get service status overview
  getServiceStatusOverview(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/service-status`);
  }

  // Get backup status
  getBackupStatus(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/backup-status`);
  }

  // Get security alerts
  getSecurityAlerts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/security-alerts`);
  }

  // Get scheduled tasks overview
  getScheduledTasksOverview(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/scheduled-tasks`);
  }

  // Refresh all dashboard data
  refreshDashboard(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/refresh`);
  }

  // Export dashboard data
  exportDashboardData(format: 'json' | 'csv' | 'pdf' = 'json'): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/export?format=${format}`);
  }

  // Get custom metrics
  getCustomMetrics(metricIds: string[]): Observable<ApiResponse<any[]>> {
    return this.http.post<ApiResponse<any[]>>(`${this.endpoint}/custom-metrics`, { metricIds });
  }

  // Get dashboard configuration
  getDashboardConfig(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/config`);
  }

  // Update dashboard configuration
  updateDashboardConfig(config: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.endpoint}/config`, config);
  }

  // Get real-time metrics (for WebSocket fallback)
  getRealTimeMetrics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/realtime-metrics`);
  }
}

