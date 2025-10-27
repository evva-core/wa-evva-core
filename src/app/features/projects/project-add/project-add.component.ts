import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectFormComponent } from '../../../shared/project-form/project-form.component';
import { Project, Host, ApiResponse } from '../../../core/models';
import { ProjectService, HostService } from '../../../core/services';

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [CommonModule, ProjectFormComponent],
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  hosts: Host[] = [];
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
      next: (response: Host[]) => {
        this.hosts = response.filter((host: Host) => host.isActive);
      },
      error: (error: any) => {
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
      error: (error: any) => {
        console.error('Error creating project:', error);
        this.isLoading = false;
      }
    });
  }

  onFormCancel(): void {
    this.router.navigate(['/projects']);
  }
}