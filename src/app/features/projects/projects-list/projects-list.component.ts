import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Project {
  id: string;
  name: string;
  repository: string;
  branch: string;
  responsible: string;
  targetHost: string;
  targetPath: string;
  status: 'active' | 'inactive' | 'syncing' | 'error';
  lastSync: Date;
  autoSync: boolean;
  syncSchedule?: {
    type: 'hourly' | 'daily' | 'weekly';
    interval: number;
    dayOfWeek?: number;
  };
}

interface Host {
  id: string;
  name: string;
  ip: string;
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [
    {
      id: '1',
      name: 'Web API',
      repository: 'https://github.com/company/web-api.git',
      branch: 'main',
      responsible: 'John Doe',
      targetHost: 'web-server-01',
      targetPath: '/var/www/api',
      status: 'active',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      autoSync: true,
      syncSchedule: {
        type: 'hourly',
        interval: 6
      }
    },
    {
      id: '2',
      name: 'Frontend App',
      repository: 'https://github.com/company/frontend-app.git',
      branch: 'develop',
      responsible: 'Jane Smith',
      targetHost: 'web-server-01',
      targetPath: '/var/www/app',
      status: 'syncing',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      autoSync: true,
      syncSchedule: {
        type: 'daily',
        interval: 1
      }
    },
    {
      id: '3',
      name: 'Database Scripts',
      repository: 'https://github.com/company/db-scripts.git',
      branch: 'master',
      responsible: 'Bob Wilson',
      targetHost: 'db-server-01',
      targetPath: '/opt/scripts',
      status: 'error',
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      autoSync: false
    },
    {
      id: '4',
      name: 'Monitoring Tools',
      repository: 'https://github.com/company/monitoring.git',
      branch: 'main',
      responsible: 'Alice Brown',
      targetHost: 'monitoring-server',
      targetPath: '/opt/monitoring',
      status: 'inactive',
      lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      autoSync: false
    }
  ];

  hosts: Host[] = [
    { id: '1', name: 'web-server-01', ip: '192.168.1.10' },
    { id: '2', name: 'db-server-01', ip: '192.168.1.11' },
    { id: '3', name: 'api-server-01', ip: '192.168.1.12' },
    { id: '4', name: 'monitoring-server', ip: '192.168.1.14' }
  ];

  // Modal states
  showProjectModal = false;
  editingProject: Project | null = null;

  // Form data
  projectForm = {
    name: '',
    repository: '',
    branch: 'main',
    responsible: '',
    targetHost: '',
    targetPath: '',
    autoSync: false,
    syncType: 'hourly' as 'hourly' | 'daily' | 'weekly',
    syncInterval: 1,
    syncDayOfWeek: 1
  };

  isLoading = false;

  constructor() {}

  ngOnInit(): void {
    // TODO: Load real data from API
  }

  // Project actions
  cloneProject(project: Project): void {
    console.log('Cloning project:', project.name);
    project.status = 'syncing';
    // TODO: Implement clone logic
    setTimeout(() => {
      project.status = 'active';
      project.lastSync = new Date();
    }, 3000);
  }

  pullProject(project: Project): void {
    console.log('Pulling project:', project.name);
    project.status = 'syncing';
    // TODO: Implement pull logic
    setTimeout(() => {
      project.status = 'active';
      project.lastSync = new Date();
    }, 2000);
  }

  pushProject(project: Project): void {
    console.log('Pushing project:', project.name);
    project.status = 'syncing';
    // TODO: Implement push logic
    setTimeout(() => {
      project.status = 'active';
      project.lastSync = new Date();
    }, 2000);
  }

  // Modal management
  openProjectModal(project?: Project): void {
    this.editingProject = project || null;
    if (project) {
      this.projectForm = {
        name: project.name,
        repository: project.repository,
        branch: project.branch,
        responsible: project.responsible,
        targetHost: project.targetHost,
        targetPath: project.targetPath,
        autoSync: project.autoSync,
        syncType: project.syncSchedule?.type || 'hourly',
        syncInterval: project.syncSchedule?.interval || 1,
        syncDayOfWeek: project.syncSchedule?.dayOfWeek || 1
      };
    } else {
      this.projectForm = {
        name: '',
        repository: '',
        branch: 'main',
        responsible: '',
        targetHost: '',
        targetPath: '',
        autoSync: false,
        syncType: 'hourly',
        syncInterval: 1,
        syncDayOfWeek: 1
      };
    }
    this.showProjectModal = true;
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
    this.editingProject = null;
  }

  saveProject(): void {
    console.log('Saving project:', this.projectForm);
    // TODO: Implement project save logic
    this.closeProjectModal();
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      console.log('Deleting project:', projectId);
      this.projects = this.projects.filter(p => p.id !== projectId);
    }
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'syncing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'inactive':
      default:
        return 'text-secondary-600';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-online';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'inactive':
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  }

  formatLastSync(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  getSyncScheduleText(project: Project): string {
    if (!project.autoSync || !project.syncSchedule) {
      return 'Manual sync only';
    }

    const schedule = project.syncSchedule;
    switch (schedule.type) {
      case 'hourly':
        return `Every ${schedule.interval} hour(s)`;
      case 'daily':
        return `Every ${schedule.interval} day(s)`;
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[schedule.dayOfWeek || 1]}`;
      default:
        return 'Manual sync only';
    }
  }

  refreshProjects(): void {
    this.isLoading = true;
    // TODO: Implement refresh logic
    setTimeout(() => {
      this.isLoading = false;
      console.log('Projects refreshed');
    }, 1000);
  }
}

