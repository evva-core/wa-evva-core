import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ApiResponse, Project, ProjectDto } from '../../../core/models';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, FormsModule,ProjectCardComponent],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  isLoading = false;
  projects: ProjectDto[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getProjectsWithDetails().subscribe({
      next: (data: ProjectDto[]) => {
        this.projects = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  refreshProjects(): void {
    this.loadProjects();
  }
}