import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectFormComponent } from '../../../shared/project-form/project-form.component';
import { Project } from '../../../core/models';
import { ProjectService, HostService } from '../../../core/services';

interface Host {
  id: string;
  name: string;
  ip: string;
}

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.css'
})
export class ProjectAddComponent implements OnInit {
  hosts: any = [
    { id: '1', name: 'web-server-01', ip: '192.168.1.10' },
    { id: '2', name: 'db-server-01', ip: '192.168.1.11' },
    { id: '3', name: 'api-server-01', ip: '192.168.1.12' },
    { id: '4', name: 'monitoring-server', ip: '192.168.1.14' }
  ];
  isLoading = false;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private hostService: HostService
  ) {}

  ngOnInit(): void {
    this.loadHosts();
  }

  private loadHosts(): void {
    this.hostService.getHosts().subscribe({
      next: (hosts) => {
        this.hosts = hosts.data.filter((host) => host.status === 'online');
      },
      error: (error) => {
        console.error('Error loading hosts:', error);
      }
    });
  }

  onFormSubmit(projectData: Partial<Project>): void {
    this.isLoading = true;
    
    this.projectService.createProject(projectData).subscribe({
      next: (project) => {
        console.log('Project created successfully:', project);
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.isLoading = false;
      }
    });
  }

  onFormCancel(): void {
    this.router.navigate(['/projects']);
  }
}

