import { CommonModule } from "@angular/common";
import { Project } from "../../../../core/models";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";




@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class ProjectCardComponent implements OnInit {
   @Input() project!: Project;

   @Output() editPressed = new EventEmitter<any>();
   isLoading = false;
   showProjectModal = false;
   editingProject: Project | null = null;
    constructor() {}

    ngOnInit(): void {
        console.log(this.project);
    }

    // Form data
  projectForm = {
    name: '',
    repository: '',
    branch: 'main',
    responsible: '',
    targetHost: '',
    targetPath: '',
    autoSync: false
  };

    // Project actions
  cloneProject(project: Project): void {
    console.log('Cloning project:', project.name);
    project.status = 'cloning';
    // TODO: Implement clone logic
    setTimeout(() => {
      project.status = 'ready';
      project.lastSync = new Date();
    }, 3000);
  }


  pullProject(project: Project): void {
    console.log('Pulling project:', project.name);
    project.status = 'updating';
    // TODO: Implement pull logic
    setTimeout(() => {
      project.status = 'ready';
      project.lastSync = new Date();
    }, 2000);
  }

  pushProject(project: Project): void {
    console.log('Pushing project:', project.name);
    project.status = 'updating';
    // TODO: Implement push logic
    setTimeout(() => {
      project.status = 'ready';
      project.lastSync = new Date();
    }, 2000);
  }

  // Modal management
  openProjectModal(project?: Project): void {
    console.log('Opening project modal:', project);
    this.editPressed.emit(project);
  }


  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      console.log('Deleting project:', projectId);
      // TODO: Implement project delete logic
    }
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'ready':
        return 'text-green-600';
      case 'updating':
      case 'cloning':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-secondary-600';
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


 
    getStatusBadgeClass(status: string): string {
        switch (status) {
          case 'cloning':
            return 'Cloning...';
          case 'updating':
            return 'Updating...';
          case 'error':
            return 'Error';
          default:
            return 'Ready';
        }
      }
}