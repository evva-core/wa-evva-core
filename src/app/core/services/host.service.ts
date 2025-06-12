import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Host, HostFilter, ApiResponse, Service, Program } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private readonly endpoint = '/hosts';

  constructor(private http: HttpService) {}

  // Get all hosts with optional filtering
  getHosts(filter?: HostFilter): Observable<ApiResponse<Host[]>> {
    let url = this.endpoint;
    const params = new URLSearchParams();

    if (filter) {
      if (filter.operatingSystem) params.append('os', filter.operatingSystem);
      if (filter.architecture) params.append('arch', filter.architecture);
      if (filter.status) params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get<ApiResponse<Host[]>>(url);
  }

  // Get host by ID
  getHost(id: string): Observable<ApiResponse<Host>> {
    return this.http.get<ApiResponse<Host>>(`${this.endpoint}/${id}`);
  }

  // Create new host
  createHost(host: Partial<Host>): Observable<ApiResponse<Host>> {
    return this.http.post<ApiResponse<Host>>(this.endpoint, host);
  }

  // Update host
  updateHost(id: string, host: Partial<Host>): Observable<ApiResponse<Host>> {
    return this.http.put<ApiResponse<Host>>(`${this.endpoint}/${id}`, host);
  }

  // Delete host
  deleteHost(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Get host services
  getHostServices(hostId: string): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.endpoint}/${hostId}/services`);
  }

  // Create service on host
  createService(hostId: string, service: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(`${this.endpoint}/${hostId}/services`, service);
  }

  // Update service
  updateService(hostId: string, serviceId: string, service: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.endpoint}/${hostId}/services/${serviceId}`, service);
  }

  // Delete service
  deleteService(hostId: string, serviceId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${hostId}/services/${serviceId}`);
  }

  // Start service
  startService(hostId: string, serviceId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${hostId}/services/${serviceId}/start`);
  }

  // Stop service
  stopService(hostId: string, serviceId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${hostId}/services/${serviceId}/stop`);
  }

  // Restart service
  restartService(hostId: string, serviceId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${hostId}/services/${serviceId}/restart`);
  }

  // Get host programs
  getHostPrograms(hostId: string): Observable<ApiResponse<Program[]>> {
    return this.http.get<ApiResponse<Program[]>>(`${this.endpoint}/${hostId}/programs`);
  }

  // Create program on host
  createProgram(hostId: string, program: Partial<Program>): Observable<ApiResponse<Program>> {
    return this.http.post<ApiResponse<Program>>(`${this.endpoint}/${hostId}/programs`, program);
  }

  // Update program
  updateProgram(hostId: string, programId: string, program: Partial<Program>): Observable<ApiResponse<Program>> {
    return this.http.put<ApiResponse<Program>>(`${this.endpoint}/${hostId}/programs/${programId}`, program);
  }

  // Delete program
  deleteProgram(hostId: string, programId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${hostId}/programs/${programId}`);
  }

  // Execute program
  executeProgram(hostId: string, programId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${hostId}/programs/${programId}/execute`);
  }

  // Get host system info
  getHostSystemInfo(hostId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/${hostId}/system-info`);
  }

  // Get host processes
  getHostProcesses(hostId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.endpoint}/${hostId}/processes`);
  }

  // Execute command on host
  executeCommand(hostId: string, command: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.endpoint}/${hostId}/execute`, { command });
  }

  // Refresh host data
  refreshHost(hostId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/${hostId}/refresh`);
  }

  // Bulk operations
  bulkRefresh(hostIds: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/bulk/refresh`, { hostIds });
  }

  bulkDelete(hostIds: string[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.endpoint}/bulk/delete`, { hostIds });
  }

  // Get host statistics
  getHostStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.endpoint}/stats`);
  }
}

