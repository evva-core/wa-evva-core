import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, RecentActivity } from '../../core/services/dashboard.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalHosts: 0,
    onlineHosts: 0,
    offlineHosts: 0,
    totalProjects: 0,
    activeProjects: 0,
    systemHealth: {
      cpu: 0,
      memory: 0,
      disk: 0
    }
  };

  recentActivities: RecentActivity[] = [];
  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  get hostsOnlinePercentage(): number {
    return Math.round((this.stats.onlineHosts / this.stats.totalHosts) * 100);
  }

  get projectsActivePercentage(): number {
    return Math.round((this.stats.activeProjects / this.stats.totalProjects) * 100);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'host_online':
        return 'server';
      case 'host_offline':
        return 'server';
      case 'project_updated':
        return 'folder';
      case 'service_started':
        return 'play';
      case 'service_stopped':
        return 'stop';
      default:
        return 'info';
    }
  }

  getActivityColor(severity: string): string {
    switch (severity) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  }

  formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  refreshData(): void {
    this.isLoading = true;
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data.stats;
          this.recentActivities = response.data.recentActivities.map(activity => ({
            ...activity,
            timestamp: new Date(activity.timestamp)
          }));
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }
}

