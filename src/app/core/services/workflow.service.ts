import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(this.apiUrl);
  }

  getWorkflow(id: number): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/${id}`);
  }

  createWorkflow(workflow: Partial<Workflow>): Observable<Workflow> {
    return this.http.post<Workflow>(this.apiUrl, workflow);
  }

  updateWorkflow(id: number, workflow: Partial<Workflow>): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.apiUrl}/${id}`, workflow);
  }

  deleteWorkflow(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAvailableWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.apiUrl}/available`);
  }
}