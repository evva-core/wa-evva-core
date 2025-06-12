import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NotificationToastComponent } from './shared/notification-toast/notification-toast.component';
import { ProjectFormComponent } from './shared/project-form/project-form.component';
import { HostFormComponent } from './shared/host-form/host-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    NotificationToastComponent,
    ProjectFormComponent,
    HostFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'evvacore-frontend';
  isSidebarOpen = true;
  isSidebarCollapsed = false;

  // Modal states
  isHostModalOpen = false;
  isProjectModalOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  openHostModal(): void {
    this.isHostModalOpen = true;
    console.log('Opening host modal');
    // TODO: Implement host modal
  }

  openProjectModal(): void {
    this.isProjectModalOpen = true;
    console.log('Opening project modal');
    // TODO: Implement project modal
  }

  closeHostModal(): void {
    this.isHostModalOpen = false;
  }

  closeProjectModal(): void {
    this.isProjectModalOpen = false;
  }
}
