import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { DashboardStats } from '../models';

interface Activity {
  id: string;
  type: 'host_status' | 'project_sync' | 'service_action' | 'system_alert';
  title: string;
  description: string;
  timestamp: Date;
  severity: 'info' | 'success' | 'warning' | 'error';
  hostId?: string;
  projectId?: string;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  uptime: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  activities: Activity[];
  systemHealth: SystemHealth | null;
  alerts: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshInterval: number;
  autoRefresh: boolean;
}

const initialState: DashboardState = {
  stats: null,
  activities: [],
  systemHealth: null,
  alerts: [],
  loading: false,
  error: null,
  lastUpdated: null,
  refreshInterval: 30000, // 30 seconds
  autoRefresh: true
};

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  private stateSubject = new BehaviorSubject<DashboardState>(initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {}

  private updateState(partialState: Partial<DashboardState>): void {
    const currentState = this.stateSubject.value;
    const newState = { 
      ...currentState, 
      ...partialState,
      lastUpdated: new Date()
    };
    this.stateSubject.next(newState);
  }

  // Selectors
  getStats(): Observable<DashboardStats | null> {
    return this.state$.pipe(
      map(state => state.stats),
      distinctUntilChanged()
    );
  }

  getActivities(): Observable<Activity[]> {
    return this.state$.pipe(
      map(state => state.activities),
      distinctUntilChanged()
    );
  }

  getRecentActivities(limit: number = 5): Observable<Activity[]> {
    return this.getActivities().pipe(
      map(activities => activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit)
      )
    );
  }

  getActivitiesByType(type: Activity['type']): Observable<Activity[]> {
    return this.getActivities().pipe(
      map(activities => activities.filter(activity => activity.type === type))
    );
  }

  getActivitiesBySeverity(severity: Activity['severity']): Observable<Activity[]> {
    return this.getActivities().pipe(
      map(activities => activities.filter(activity => activity.severity === severity))
    );
  }

  getSystemHealth(): Observable<SystemHealth | null> {
    return this.state$.pipe(
      map(state => state.systemHealth),
      distinctUntilChanged()
    );
  }

  getAlerts(): Observable<any[]> {
    return this.state$.pipe(
      map(state => state.alerts),
      distinctUntilChanged()
    );
  }

  getCriticalAlerts(): Observable<any[]> {
    return this.getAlerts().pipe(
      map(alerts => alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'error'))
    );
  }

  getLoading(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.loading),
      distinctUntilChanged()
    );
  }

  getError(): Observable<string | null> {
    return this.state$.pipe(
      map(state => state.error),
      distinctUntilChanged()
    );
  }

  getLastUpdated(): Observable<Date | null> {
    return this.state$.pipe(
      map(state => state.lastUpdated),
      distinctUntilChanged()
    );
  }

  getAutoRefresh(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.autoRefresh),
      distinctUntilChanged()
    );
  }

  getRefreshInterval(): Observable<number> {
    return this.state$.pipe(
      map(state => state.refreshInterval),
      distinctUntilChanged()
    );
  }

  // Computed selectors
  getHostsOverview(): Observable<{ total: number; online: number; offline: number } | null> {
    return this.getStats().pipe(
      map(stats => stats ? {
        total: stats.totalHosts,
        online: stats.onlineHosts,
        offline: stats.offlineHosts
      } : null)
    );
  }

  getProjectsOverview(): Observable<{ total: number; active: number } | null> {
    return this.getStats().pipe(
      map(stats => stats ? {
        total: stats.totalProjects,
        active: stats.activeProjects
      } : null)
    );
  }

  getSystemHealthPercentage(): Observable<number | null> {
    return this.getSystemHealth().pipe(
      map(health => {
        if (!health) return null;
        return Math.round((health.cpu + health.memory + health.disk) / 3);
      })
    );
  }

  // Actions
  setStats(stats: DashboardStats): void {
    this.updateState({ stats, error: null });
  }

  setActivities(activities: Activity[]): void {
    this.updateState({ activities, error: null });
  }

  addActivity(activity: Activity): void {
    const currentActivities = this.stateSubject.value.activities;
    const activities = [activity, ...currentActivities].slice(0, 100); // Keep only last 100
    this.updateState({ activities });
  }

  removeActivity(activityId: string): void {
    const currentActivities = this.stateSubject.value.activities;
    const activities = currentActivities.filter(activity => activity.id !== activityId);
    this.updateState({ activities });
  }

  clearActivities(): void {
    this.updateState({ activities: [] });
  }

  setSystemHealth(systemHealth: SystemHealth): void {
    this.updateState({ systemHealth, error: null });
  }

  setAlerts(alerts: any[]): void {
    this.updateState({ alerts, error: null });
  }

  addAlert(alert: any): void {
    const currentAlerts = this.stateSubject.value.alerts;
    this.updateState({ alerts: [alert, ...currentAlerts] });
  }

  removeAlert(alertId: string): void {
    const currentAlerts = this.stateSubject.value.alerts;
    const alerts = currentAlerts.filter(alert => alert.id !== alertId);
    this.updateState({ alerts });
  }

  clearAlerts(): void {
    this.updateState({ alerts: [] });
  }

  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  setAutoRefresh(autoRefresh: boolean): void {
    this.updateState({ autoRefresh });
  }

  setRefreshInterval(refreshInterval: number): void {
    this.updateState({ refreshInterval });
  }

  // Bulk updates
  updateDashboardData(data: {
    stats?: DashboardStats;
    activities?: Activity[];
    systemHealth?: SystemHealth;
    alerts?: any[];
  }): void {
    this.updateState({ 
      ...data,
      error: null
    });
  }

  // Utility methods
  getActivityIcon(type: Activity['type']): string {
    switch (type) {
      case 'host_status':
        return 'server';
      case 'project_sync':
        return 'git-branch';
      case 'service_action':
        return 'settings';
      case 'system_alert':
        return 'alert-triangle';
      default:
        return 'info';
    }
  }

  getActivityColor(severity: Activity['severity']): string {
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

  // Get current state snapshot
  getCurrentState(): DashboardState {
    return this.stateSubject.value;
  }

  // Reset store
  reset(): void {
    this.stateSubject.next(initialState);
  }
}

