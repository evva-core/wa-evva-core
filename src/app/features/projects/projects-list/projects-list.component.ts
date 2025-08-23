import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectCardComponent } from './project-card/project-card.component';
import { Project } from '../../../core/models';
import { ProjectFormComponent } from '../../../shared/project-form/project-form.component';



interface Host {
  id: string;
  name: string;
  ip: string;
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, FormsModule,ProjectCardComponent,ProjectFormComponent],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  isLoading = false;

  projects: Project[] = [
    {
      id: '1',
      name: 'Web API',
      repositoryUrl: 'https://github.com/company/web-api.git',
      branch: 'main',
      hostId: '1',
      targetPath: '/var/www/api',
      responsible: 'John Doe',
      status: 'ready',
      hostName: 'web-server-01',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastClone: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastPull: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastPush: new Date(Date.now() - 3 * 60 * 60 * 1000),
      autoSync: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isDockerEnabled: true
    },
    {
      id: '2',
      name: 'Frontend App',
      repositoryUrl: 'https://github.com/company/frontend-app.git',
      branch: 'develop',
      hostId: '1',
      hostName: 'db-server-01',
      targetPath: '/var/www/app',
      responsible: 'Jane Smith',
      status: 'updating',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      lastClone: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastPull: new Date(Date.now() - 30 * 60 * 1000),
      lastPush: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      autoSync: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      isDockerEnabled: false
    },
    {
      id: '3',
      name: 'Database Scripts',
      repositoryUrl: 'https://github.com/company/db-scripts.git',
      branch: 'master',
      hostId: '2',
      hostName: 'api-server-01',
      targetPath: '/opt/scripts',
      responsible: 'Bob Wilson',
      status: 'error',
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastClone: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastPull: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastPush: new Date(Date.now() - 48 * 60 * 60 * 1000),
      autoSync: false,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isDockerEnabled: false
    },
    {
      id: '4',
      name: 'Monitoring Tools',
      repositoryUrl: 'https://github.com/company/monitoring.git',
      branch: 'main',
      hostId: '4',
      hostName: 'monitoring-server',
      targetPath: '/opt/monitoring',
      responsible: 'Alice Brown',
      status: 'ready',
      lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastClone: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastPull: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastPush: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      autoSync: false,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isDockerEnabled: false
    }
  ];

  hosts: Host[] = [
    { id: '1', name: 'web-server-01', ip: '192.168.1.10' },
    { id: '2', name: 'db-server-01', ip: '192.168.1.11' },
    { id: '3', name: 'api-server-01', ip: '192.168.1.12' },
    { id: '4', name: 'monitoring-server', ip: '192.168.1.14' }
  ];

  closeProjectModal(): void {
    this.showProjectModal = false;
    this.editingProject = null;
  }
  saveProject(): void {
    console.log('Saving project:', this.projectForm);
    // TODO: Implement project save logic
    this.closeProjectModal();
  }

  refreshProjects(): void {
    this.isLoading = true;
    // TODO: Implement refresh logic
    setTimeout(() => {
      this.isLoading = false;
      console.log('Projects refreshed');
    }, 1000);
  }

  // Form data
  projectForm: Project = {
    id: '',
    name: '',
    repositoryUrl: '',
    branch: '',
    targetPath: '',
    hostId: '',
    hostName: '',
    responsible: '',
    status: 'ready',
    lastSync: new Date(),
    lastClone: new Date(),
    lastPull: new Date(),
    lastPush: new Date(),
    autoSync: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDockerEnabled: false,
    dockerConfig: {
      useDockerCompose: false,
      containerPort: 8080,
      hostPort: 8080
    }
  };

  editingProject: Project | null = null;
  showProjectModal = false;

  constructor() {}

  ngOnInit(): void {
    // TODO: Load real data from API
  }

  openProjectModal(project?: Project): void {
    console.log('Opening project modal:', project);
    this.editingProject = project || null;
    if (project) {
      this.projectForm = {
        id: project.id,
        name: project.name,
        repositoryUrl: project.repositoryUrl,
        branch: project.branch,
        responsible: project.responsible,
        hostId: project.hostId,
        targetPath: project.targetPath,
        hostName: project.hostName,
        status: project.status,
        lastSync: project.lastSync,
        lastClone: project.lastClone,
        lastPull: project.lastPull,
        lastPush: project.lastPush,
        autoSync: project.autoSync || false,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        isDockerEnabled: project.isDockerEnabled,
        dockerConfig: project.dockerConfig || {
          useDockerCompose: false,
          containerPort: 8080,
          hostPort: 8080
        }
      };
    } else {
      this.projectForm = {
        id: '',
        name: '',
        repositoryUrl: '',
        branch: '',
        targetPath: '',
        hostId: '',
        hostName: '',
        responsible: '',
        status: 'ready',
        lastSync: new Date(),
        lastClone: new Date(),
        lastPull: new Date(),
        lastPush: new Date(),
        autoSync: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDockerEnabled: false,
        dockerConfig: {
          useDockerCompose: false,
          containerPort: 0,
          hostPort: 0
        }
      };
    }
    this.showProjectModal = true;
  }
}

