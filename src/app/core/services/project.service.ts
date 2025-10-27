import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Project, ProjectFilter, ProjectDto, ProjectWorkflow } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly endpoint = '/api/v1/project';

  constructor(private http: HttpService) {}

  getProjectsWithDetails(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.endpoint}/details`);
  }

  // Get all projects with optional filtering
  getProjects(filter?: ProjectFilter): Observable<Project[]> {
    let url = this.endpoint;
    const params = new URLSearchParams();

    if (filter) {
      if (filter.hostId) params.append('hostId', filter.hostId);
      if (filter.status) params.append('status', filter.status);
      if (filter.responsible) params.append('responsible', filter.responsible);
      if (filter.search) params.append('search', filter.search);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get<Project[]>(url);
  }

  // Get project by ID
  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.endpoint}/details/${id}`);
  }

  // Get project workflows
  getProjectWorkflows(projectId: string): Observable<ProjectWorkflow[]> {
    return this.http.get<ProjectWorkflow[]>(`/api/v1/projectworkflow/project/${projectId}`);
  }

  // Save project workflows
  saveProjectWorkflows(projectId: string, request: any): Observable<void> {
    return this.http.post<void>(`/api/v1/projectworkflow/project/${projectId}/bulk`, request);
  }

  // Create new project
  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.endpoint, project);
  }

  // Update project
  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.endpoint}/${id}`, project);
  }

  // Delete project
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  // Git operations
  cloneProject(id: string): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/${id}/clone`);
  }

  pullProject(id: string): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/${id}/pull`);
  }

  pushProject(id: string, commitMessage?: string): Observable<any> {
    const data = commitMessage ? { commitMessage } : {};
    return this.http.post<any>(`${this.endpoint}/${id}/push`, data);
  }

  // Get project status
  getProjectStatus(id: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${id}/status`);
  }

  // Get project logs
  getProjectLogs(id: string, limit?: number): Observable<any[]> {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get<any[]>(`${this.endpoint}/${id}/logs${params}`);
  }

  // // Auto-sync management
  // getAutoSync(projectId: string): Observable<ApiResponse<AutoSync>> {
  //   return this.http.get<ApiResponse<AutoSync>>(`${this.endpoint}/${projectId}/auto-sync`);
  // }

  // updateAutoSync(projectId: string, autoSync: Partial<AutoSync>): Observable<ApiResponse<AutoSync>> {
  //   return this.http.put<ApiResponse<AutoSync>>(`${this.endpoint}/${projectId}/auto-sync`, autoSync);
  // }

  enableAutoSync(projectId: string): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/${projectId}/auto-sync/enable`);
  }

  disableAutoSync(projectId: string): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/${projectId}/auto-sync/disable`);
  }

  // Bulk operations
  bulkClone(projectIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/bulk/clone`, { projectIds });
  }

  bulkPull(projectIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/bulk/pull`, { projectIds });
  }

  bulkDelete(projectIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/bulk/delete`, { projectIds });
  }

  // Sync all projects
  syncAllProjects(): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/sync-all`);
  }

  // Get project statistics
  getProjectStats(): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/stats`);
  }

  // Repository validation
  validateRepository(repositoryUrl: string): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/validate-repository`, { repositoryUrl });
  }

  // Get available branches
  getRepositoryBranches(repositoryUrl: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.endpoint}/repository-branches`, { repositoryUrl });
  }

  // Test connection to repository
  testRepositoryConnection(repositoryUrl: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.endpoint}/test-repository`, { repositoryUrl });
  }

  // Get project file structure
  getProjectFiles(id: string, path?: string): Observable<any[]> {
    const params = path ? `?path=${encodeURIComponent(path)}` : '';
    return this.http.get<any[]>(`${this.endpoint}/${id}/files${params}`);
  }

  // Get file content
  getFileContent(id: string, filePath: string): Observable<string> {
    return this.http.get<string>(`${this.endpoint}/${id}/file-content?path=${encodeURIComponent(filePath)}`);
  }

  // Update file content
  updateFileContent(id: string, filePath: string, content: string, commitMessage?: string): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}/file-content`, {
      path: filePath,
      content,
      commitMessage
    });
  }
}