import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectDetails, Repository, RepositoryStatus, Host, ProjectStatus, ProjectWorkflow } from '../../../core/models';
import { ProjectService } from '../../../core/services/project.service';
import { RepositoryService } from '../../../core/services/repository.service';
import { HostService } from '../../../core/services/host.service';
import { ProjectSignalrService } from '../../../core/services/project-signalr.service';
import { RepositoryFormModalComponent } from './repository-form-modal.component';
import { WorkflowBuilderModalComponent } from './workflow-builder-modal/workflow-builder-modal.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RepositoryFormModalComponent, WorkflowBuilderModalComponent],
  templateUrl: './project-details.component.html',
  
})
export class ProjectDetailsComponent implements OnInit {
  isLoading = false;
  project: ProjectDetails | null = null;
  error: string | null = null;
  hosts: Host[] = [];
  workflows: ProjectWorkflow[] = [];
  isDeploying = false;
  deploymentLogs: string[] = [];
  
  // Modal state
  isRepositoryModalOpen = false;
  editingRepository: Repository | null = null;
  @ViewChild(RepositoryFormModalComponent) repositoryModal!: RepositoryFormModalComponent;
  
  // Workflow builder modal state
  isWorkflowBuilderOpen = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private repositoryService: RepositoryService,
    private hostService: HostService,
    private projectSignalR: ProjectSignalrService
  ) { }

  async ngOnInit(): Promise<void> {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      await this.setupSignalR(parseInt(projectId));
      this.loadProjectDetails(projectId);
      this.loadHosts();
      this.loadProjectWorkflows(projectId);
    }
  }

  loadProjectDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.projectService.getProject(id).subscribe({
      next: (response) => {
        if (response) {
          this.project = response as ProjectDetails;
        } else {
          this.error =  'Failed to load project details';
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
      this.loadProjectWorkflows(this.project.id.toString());
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
    this.repositoryService.cloneRepository(repoId).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Clone started for repository:', repoId);
        }
      },
      error: (err) => {
        console.error('Error starting clone:', err);
      }
    });
  }

  syncRepository(repoId: number): void {
    console.log('Sync repository:', repoId);
  }

  deployProject(): void {
    if (!this.project) return;
    
    this.projectSignalR.startDeploy(this.project.id).then(() => {
      console.log('Deploy started for project:', this.project?.id);
    }).catch(error => {
      console.error('Error starting deploy:', error);
    });
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
        console.log(hosts)
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
  
          repository.id = response?.id || Date.now();
          this.project!.repositories.push(repository);
          this.closeRepositoryModal();
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

          const index = this.project!.repositories.findIndex(r => r.id === repository.id);
          if (index !== -1) {
            this.project!.repositories[index] = repository;
          }
          this.closeRepositoryModal();
        
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
 
            this.project!.repositories = this.project!.repositories.filter(r => r.id !== repository.id);

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

  loadProjectWorkflows(projectId: string): void {
    this.projectService.getProjectWorkflows(projectId).subscribe({
      next: (response) => {
          this.workflows = response;
      },
      error: (err) => {
        console.error('Error loading project workflows:', err);
      }
    });
  }

  async setupSignalR(projectId: number): Promise<void> {
    try {
      await this.projectSignalR.startConnection();
      await this.projectSignalR.joinProjectGroup(projectId);
      
      this.projectSignalR.repositoryStatus$.subscribe(status => {
        this.handleRepositoryStatusUpdate(status);
      });

      this.projectSignalR.deploymentStatus$.subscribe(status => {
        this.handleDeploymentStatusUpdate(status);
      });
    } catch (error) {
      console.error('Error setting up SignalR:', error);
    }
  }

  handleRepositoryStatusUpdate(status: any): void {
    const repo = this.project?.repositories.find(r => r.id === status.repositoryId);
    if (repo) {
      switch (status.type) {
        case 'clone_started':
          repo.status = RepositoryStatus.Cloning;
          break;
        case 'clone_completed':
          repo.status = RepositoryStatus.Cloned;
          break;
        case 'clone_failed':
          repo.status = RepositoryStatus.Failed;
          break;
      }
    }
  }

  handleDeploymentStatusUpdate(status: any): void {
    console.log('Deployment status update:', status);
    
    switch (status.type) {
      case 'deployment_started':
        this.isDeploying = true;
        this.deploymentLogs = [`Deployment started for project ${status.projectId}`];
        console.log(`Deployment started for project ${status.projectId}`);
        break;
      case 'deployment_progress':
        const logMessage = `[${status.stage}] ${status.message}`;
        this.deploymentLogs.push(logMessage);
        console.log(`Deployment progress: ${status.stage} - ${status.message}`);
        break;
      case 'deployment_completed':
        this.isDeploying = false;
        const completionMessage = `Deployment ${status.success ? 'completed successfully' : 'failed'}: ${status.message || ''}`;
        this.deploymentLogs.push(completionMessage);
        console.log(`Deployment completed for project ${status.projectId}. Success: ${status.success}`);
        break;
      case 'deployment_error':
        this.isDeploying = false;
        this.deploymentLogs.push(`Error: ${status.error}`);
        console.error(`Deployment error for project ${status.projectId}: ${status.error}`);
        break;
    }
  }

  trackByWorkflowId(index: number, workflow: ProjectWorkflow): number {
    return workflow.id;
  }

  openWorkflowBuilder(): void {
    this.isWorkflowBuilderOpen = true;
  }

  closeWorkflowBuilder(): void {
    this.isWorkflowBuilderOpen = false;
  }

  onWorkflowSave(workflowSteps: any[]): void {
    if (!this.project) return;
    
    const projectWorkflows = workflowSteps.map(step => ({
      id: step.id || 0,
      projectId: this.project!.id,
      workflowId: step.workflowId,
      executionOrder: step.executionOrder,
      stageName: step.stageName || null,
      workflow: step.workflow
    }));

    const request = { workflows: projectWorkflows };

    this.projectService.saveProjectWorkflows(this.project.id.toString(), request).subscribe({
      next: (response) => {
    
          this.loadProjectWorkflows(this.project!.id.toString());
          this.closeWorkflowBuilder();
      
      },
      error: (err) => {
        console.error('Error saving workflows:', err);
      }
    });
  }
}
