import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DashboardStats {
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

interface RecentActivity {
  id: string;
  type: 'host_online' | 'host_offline' | 'project_updated' | 'service_started' | 'service_stopped';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalHosts: 24,
    onlineHosts: 18,
    offlineHosts: 6,
    totalProjects: 12,
    activeProjects: 8,
    systemHealth: {
      cpu: 65,
      memory: 78,
      disk: 45
    }
  };

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'host_online',
      message: 'Server-01 came online',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: 'success'
    },
    {
      id: '2',
      type: 'project_updated',
      message: 'Project "Web API" updated successfully',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'info'
    },
    {
      id: '3',
      type: 'host_offline',
      message: 'Server-05 went offline',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: 'error'
    },
    {
      id: '4',
      type: 'service_started',
      message: 'Database service started on Server-03',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      severity: 'success'
    },
    {
      id: '5',
      type: 'service_stopped',
      message: 'Backup service stopped on Server-02',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      severity: 'warning'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // TODO: Load real data from API
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
    // TODO: Implement data refresh
    console.log('Refreshing dashboard data...');
  }
}

