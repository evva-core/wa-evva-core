import { CommonModule } from "@angular/common";
import { Project, ProjectDto } from "../../../../core/models";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class ProjectCardComponent implements OnInit {
   @Input() project!: ProjectDto;

    constructor(private router: Router) {}

    ngOnInit(): void {
        console.log(this.project);
    }

    navigateToProject(): void {
        this.router.navigate(['/projects', this.project.id]);
    }

  // Utility methods
  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'text-green-600';
      case 2:
        return 'text-red-600';
      default:
        return 'text-secondary-600';
    }
  }
}