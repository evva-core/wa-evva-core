import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectDetails, Repository, RepositoryStatus, Host, ProjectStatus } from '../../../core/models';
import { ProjectService } from '../../../core/services/project.service';
import { RepositoryService } from '../../../core/services/repository.service';
import { HostService } from '../../../core/services/host.service';
import { RepositoryFormModalComponent } from './repository-form-modal.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RepositoryFormModalComponent],
  templateUrl: './project-details.component.html',
  
})
export class ProjectDetailsComponent implements OnInit {
  isLoading = false;
  project: ProjectDetails | null = null;
  error: string | null = null;
  hosts: Host[] = [];
  
  // Modal state
  isRepositoryModalOpen = false;
  editingRepository: Repository | null = null;
  @ViewChild(RepositoryFormModalComponent) repositoryModal!: RepositoryFormModalComponent;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private repositoryService: RepositoryService,
    private hostService: HostService
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectDetails(projectId);
      this.loadHosts();
    }
  }

  loadProjectDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.projectService.getProject(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.project = response.data as ProjectDetails;
        } else {
          this.error = response.message || 'Failed to load project details';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading project:', err);
        this.error = 'Failed to load project details';
        this.isLoading = false;
      }
    });
  }

  refreshProjectData(): void {
    if (this.project) {
      this.loadProjectDetails(this.project.id.toString());
    }
  }

  getStatusText(status: ProjectStatus): string {
    switch (status) {
      case 'Active': return 'Active';
      case 'Archived': return 'Archived';
      case 'Online': return 'Online';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: ProjectStatus): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      case 'Online': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRepositoryStatusText(status: RepositoryStatus): string {
    switch (status) {
      case RepositoryStatus.Pending: return 'Pending';
      case RepositoryStatus.Cloning: return 'Cloning';
      case RepositoryStatus.Cloned: return 'Cloned';
      case RepositoryStatus.Failed: return 'Failed';
      case RepositoryStatus.Syncing: return 'Syncing';
      case RepositoryStatus.Synced: return 'Synced';
      default: return 'Unknown';
    }
  }

  getRepositoryStatusColor(status: RepositoryStatus): string {
    switch (status) {
      case RepositoryStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      case RepositoryStatus.Cloning: return 'bg-blue-100 text-blue-800';
      case RepositoryStatus.Cloned: return 'bg-green-100 text-green-800';
      case RepositoryStatus.Failed: return 'bg-red-100 text-red-800';
      case RepositoryStatus.Syncing: return 'bg-blue-100 text-blue-800';
      case RepositoryStatus.Synced: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  cloneRepository(repoId: number): void {
    console.log('Clone repository:', repoId);
  }

  syncRepository(repoId: number): void {
    console.log('Sync repository:', repoId);
  }

  deployProject(): void {
    console.log('Deploy project:', this.project?.id);
  }

  editProject(): void {
    console.log('Edit project:', this.project?.id);
  }

  getDockerEnabledCount(): number {
    return this.project?.repositories.filter(repo => repo.isDockerEnabled).length || 0;
  }

  getAutoSyncCount(): number {
    return this.project?.repositories.filter(repo => repo.autoSync).length || 0;
  }

  loadHosts(): void {
    this.hostService.getHosts().subscribe({
      next: (hosts) => {
        this.hosts = hosts;
      },
      error: (err) => {
        console.error('Error loading hosts:', err);
      }
    });
  }

  openAddRepositoryModal(): void {
    this.editingRepository = null;
    this.isRepositoryModalOpen = true;
  }

  openEditRepositoryModal(repository: Repository): void {
    this.editingRepository = repository;
    this.isRepositoryModalOpen = true;
  }

  closeRepositoryModal(): void {
    this.isRepositoryModalOpen = false;
    this.editingRepository = null;
  }

  onRepositorySave(repository: Repository): void {
    if (this.editingRepository) {
      this.updateRepository(repository);
    } else {
      this.createRepository(repository);
    }
  }

  private createRepository(repository: Repository): void {
    this.repositoryService.createRepository(repository).subscribe({
      next: (response) => {
        if (response.success) {
          repository.id = response.data?.id || Date.now();
          this.project!.repositories.push(repository);
          this.closeRepositoryModal();
        }
      },
      error: (err) => {
        console.error('Error creating repository:', err);
      },
      complete: () => {
        this.resetModalSubmittingState();
      }
    });
  }

  private updateRepository(repository: Repository): void {
    this.repositoryService.updateRepository(repository.id, repository).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.project!.repositories.findIndex(r => r.id === repository.id);
          if (index !== -1) {
            this.project!.repositories[index] = repository;
          }
          this.closeRepositoryModal();
        }
      },
      error: (err) => {
        console.error('Error updating repository:', err);
      },
      complete: () => {
        this.resetModalSubmittingState();
      }
    });
  }

  deleteRepository(repository: Repository): void {
    if (confirm(`Are you sure you want to delete repository "${repository.name}"?`)) {
      this.repositoryService.deleteRepository(repository.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.project!.repositories = this.project!.repositories.filter(r => r.id !== repository.id);
          }
        },
        error: (err) => {
          console.error('Error deleting repository:', err);
        }
      });
    }
  }

  private resetModalSubmittingState(): void {
    if (this.repositoryModal) {
      this.repositoryModal.onSaveComplete();
    }
  }
}
