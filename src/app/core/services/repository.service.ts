import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Repository, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private readonly endpoint = '/api/v1/repository';

  constructor(private http: HttpService) {}

  createRepository(repository: Repository): Observable<ApiResponse<Repository>> {
    return this.http.post<ApiResponse<Repository>>(this.endpoint, repository);
  }

  updateRepository(id: number, repository: Repository): Observable<ApiResponse<Repository>> {
    return this.http.put<ApiResponse<Repository>>(`${this.endpoint}`, repository);
  }

  deleteRepository(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  cloneRepository(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.endpoint}/${id}/clone`, {});
  }
}