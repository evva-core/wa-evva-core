import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '../../core/services/websocket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() openHostModal = new EventEmitter<void>();
  @Output() openProjectModal = new EventEmitter<void>();

  isQuickActionsOpen = false;
  isMoreActionsOpen = false;
  isConnected = false;

  quickActions = [
    { label: 'Add New Host', icon: 'server', action: 'addHost' },
    { label: 'Create Project', icon: 'folder-plus', action: 'createProject' },
    { label: 'System Health', icon: 'activity', action: 'systemHealth' },
    { label: 'Refresh Data', icon: 'refresh-cw', action: 'refreshData' }
  ];

  moreActions = [
    { label: 'Settings', icon: 'settings', action: 'settings' },
    { label: 'User Management', icon: 'users', action: 'userManagement' },
    { label: 'Logs', icon: 'file-text', action: 'logs' },
    { label: 'API Documentation', icon: 'book', action: 'apiDocs' },
    { label: 'Support', icon: 'help-circle', action: 'support' },
    { label: 'About', icon: 'info', action: 'about' }
  ];

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.getConnectionStatus().subscribe(status => {
      this.isConnected = status;
    });
  }

  toggleQuickActions(): void {
    this.isQuickActionsOpen = !this.isQuickActionsOpen;
    if (this.isQuickActionsOpen) {
      this.isMoreActionsOpen = false;
    }
  }

  toggleMoreActions(): void {
    this.isMoreActionsOpen = !this.isMoreActionsOpen;
    if (this.isMoreActionsOpen) {
      this.isQuickActionsOpen = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  executeAction(action: string): void {
    console.log('Executing action:', action);
    
    switch (action) {
      case 'addHost':
        this.openHostModal.emit();
        break;
      case 'createProject':
        this.openProjectModal.emit();
        break;
      case 'systemHealth':
        // Navigate to dashboard or show system health modal
        break;
      case 'refreshData':
        // Refresh current page data
        window.location.reload();
        break;
      default:
        console.log('Action not implemented:', action);
    }
    
    this.closeAllDropdowns();
  }

  closeAllDropdowns(): void {
    this.isQuickActionsOpen = false;
    this.isMoreActionsOpen = false;
  }

  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.closeAllDropdowns();
    }
  }
}

