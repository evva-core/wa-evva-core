import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Host } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private apiUrl = `${environment.apiUrl}/api/v1/Host`;

  constructor(private http: HttpClient) { }

  getHosts(): Observable<Host[]> {
    return this.http.get<Host[]>(this.apiUrl);
  }

  getHost(id: number): Observable<Host> {
    return this.http.get<Host>(`${this.apiUrl}/${id}`);
  }

  getHostByUniqueId(uniqueId: string): Observable<Host> {
    return this.http.get<Host>(`${this.apiUrl}/uniqueId/${uniqueId}`);
  }

  createHost(host: Partial<Host>): Observable<Host> {
    return this.http.post<Host>(this.apiUrl, host);
  }

  updateHost(id: number, host: Partial<Host>): Observable<Host> {
    return this.http.put<Host>(`${this.apiUrl}/${id}`, host);
  }

  deleteHost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
