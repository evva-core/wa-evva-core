import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Project, ProjectFilter, ApiResponse, AutoSync } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly endpoint = '/projects';

  constructor(private http: HttpService) {}

  // Get all projects with optional filtering
  getProjects(filter?: ProjectFilter): Observable<ApiResponse<Project[]>> {
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

    return this.http.get<ApiResponse<Project[]>>(url);
  }

  // Get project by ID
  getProject(id: string): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.endpoint}/${id}`);
  }

  // Create new project
  createProject(project: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(this.endpoint, project);
  }

  // Update project
  updateProject(id: string, project: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.http.put<ApiResponse<Project>>(`${this.endpoint}/${id}`, project);
  }

  // Delete project
  deleteProject(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Git operations
  cloneProject(id: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.endpoint}/${id}/clone`);
  }

  pullProject(id: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.endpoint}/${id}/pull`);
  }

  pushProject(id: string, commitMessage?: string): Observable<ApiResponse<any>> {
    const data = commitMessage ? { commitMessage } : {};
    return this.http.post<ApiResponse<any>>(`${this.endpoint}/${id}/push`, data);
  }

  // Get project status
  getProjectStatus(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/${id}/status`);
  }

  // Get project logs
  getProjectLogs(id: string, limit?: number): Observable<ApiResponse<any[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/${id}/logs${params}`);
  }

  // Auto-sync management
  getAutoSync(projectId: string): Observable<ApiResponse<AutoSync>> {
    return this.http.get<ApiResponse<AutoSync>>(`${this.endpoint}/${projectId}/auto-sync`);
  }

  updateAutoSync(projectId: string, autoSync: Partial<AutoSync>): Observable<ApiResponse<AutoSync>> {
    return this.http.put<ApiResponse<AutoSync>>(`${this.endpoint}/${projectId}/auto-sync`, autoSync);
  }

  enableAutoSync(projectId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${projectId}/auto-sync/enable`);
  }

  disableAutoSync(projectId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${projectId}/auto-sync/disable`);
  }

  // Bulk operations
  bulkClone(projectIds: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/bulk/clone`, { projectIds });
  }

  bulkPull(projectIds: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/bulk/pull`, { projectIds });
  }

  bulkDelete(projectIds: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/bulk/delete`, { projectIds });
  }

  // Sync all projects
  syncAllProjects(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/sync-all`);
  }

  // Get project statistics
  getProjectStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/stats`);
  }

  // Repository validation
  validateRepository(repositoryUrl: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.endpoint}/validate-repository`, { repositoryUrl });
  }

  // Get available branches
  getRepositoryBranches(repositoryUrl: string): Observable<ApiResponse<string[]>> {
    return this.http.post<ApiResponse<string[]>>(`${this.endpoint}/repository-branches`, { repositoryUrl });
  }

  // Test connection to repository
  testRepositoryConnection(repositoryUrl: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.endpoint}/test-repository`, { repositoryUrl });
  }

  // Get project file structure
  getProjectFiles(id: string, path?: string): Observable<ApiResponse<any[]>> {
    const params = path ? `?path=${encodeURIComponent(path)}` : '';
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/${id}/files${params}`);
  }

  // Get file content
  getFileContent(id: string, filePath: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.endpoint}/${id}/file-content?path=${encodeURIComponent(filePath)}`);
  }

  // Update file content
  updateFileContent(id: string, filePath: string, content: string, commitMessage?: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.endpoint}/${id}/file-content`, {
      path: filePath,
      content,
      commitMessage
    });
  }
}

