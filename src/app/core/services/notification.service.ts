import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketService } from './websocket.service';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  autoHide?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private notificationId = 0;

  constructor(private webSocketService: WebSocketService) {
    this.initializeWebSocketListeners();
  }

  private initializeWebSocketListeners(): void {
    // Listen for real-time notifications
    this.webSocketService.getMessagesByType('notification').subscribe(message => {
      this.addNotification({
        type: message.data.type || 'info',
        title: message.data.title || 'System Notification',
        message: message.data.message,
        autoHide: message.data.autoHide !== false,
        duration: message.data.duration || 5000
      });
    });

    // Listen for host status updates
    this.webSocketService.getMessagesByType('host_status_update').subscribe(message => {
      const host = message.data;
      const statusText = host.status === 'online' ? 'came online' : 'went offline';
      this.addNotification({
        type: host.status === 'online' ? 'success' : 'warning',
        title: 'Host Status Update',
        message: `${host.name} (${host.ip}) ${statusText}`,
        autoHide: true,
        duration: 4000
      });
    });

    // Listen for project sync updates
    this.webSocketService.getMessagesByType('project_sync_update').subscribe(message => {
      const project = message.data;
      let type: 'success' | 'error' = 'success';
      let title = 'Project Sync Complete';
      let messageText = `${project.name} synchronized successfully`;

      if (project.status === 'error') {
        type = 'error';
        title = 'Project Sync Failed';
        messageText = `Failed to synchronize ${project.name}: ${project.error || 'Unknown error'}`;
      }

      this.addNotification({
        type,
        title,
        message: messageText,
        autoHide: type === 'success',
        duration: type === 'success' ? 3000 : 0
      });
    });

    // Listen for system alerts
    this.webSocketService.getMessagesByType('system_alert').subscribe(message => {
      const alert = message.data;
      this.addNotification({
        type: alert.severity || 'warning',
        title: alert.title || 'System Alert',
        message: alert.message,
        autoHide: false
      });
    });
  }

  addNotification(notification: Partial<Notification>): void {
    const newNotification: Notification = {
      id: (++this.notificationId).toString(),
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: new Date(),
      read: false,
      autoHide: notification.autoHide !== false,
      duration: notification.duration || 5000
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([newNotification, ...currentNotifications]);

    // Auto-hide notification if specified
    if (newNotification.autoHide && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(updatedNotifications);
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notifications.next(updatedNotifications);
  }

  clearAll(): void {
    this.notifications.next([]);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }

  // Predefined notification methods for common scenarios
  showSuccess(title: string, message: string, autoHide = true): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      autoHide,
      duration: 3000
    });
  }

  showError(title: string, message: string, autoHide = false): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      autoHide
    });
  }

  showWarning(title: string, message: string, autoHide = true): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      autoHide,
      duration: 4000
    });
  }

  showInfo(title: string, message: string, autoHide = true): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      autoHide,
      duration: 4000
    });
  }
}

