import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

interface Workflow {
  id: number;
  name: string;
  description?: string;
  command: string;
  supportedOs: string;
  parameters?: string;
  isJsonRequired: boolean;
  jsonData?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = `${environment.apiUrl}/api/v1/workflow`;

  constructor(private http: HttpClient) {}

  getWorkflows(): Observable<ApiResponse<Workflow[]>> {
    return this.http.get<ApiResponse<Workflow[]>>(this.apiUrl);
  }

  getWorkflow(id: number): Observable<ApiResponse<Workflow>> {
    return this.http.get<ApiResponse<Workflow>>(`${this.apiUrl}/${id}`);
  }

  createWorkflow(workflow: Partial<Workflow>): Observable<ApiResponse<Workflow>> {
    return this.http.post<ApiResponse<Workflow>>(this.apiUrl, workflow);
  }

  updateWorkflow(id: number, workflow: Partial<Workflow>): Observable<ApiResponse<Workflow>> {
    return this.http.put<ApiResponse<Workflow>>(`${this.apiUrl}/${id}`, workflow);
  }

  deleteWorkflow(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getAvailableWorkflows(): Observable<ApiResponse<Workflow[]>> {
    return this.http.get<ApiResponse<Workflow[]>>(`${this.apiUrl}/available`);
  }
}