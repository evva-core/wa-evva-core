import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Repository } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private readonly endpoint = '/api/v1/repository';

  constructor(private http: HttpService) {}

  createRepository(repository: Repository): Observable<Repository> {
    return this.http.post<Repository>(this.endpoint, repository);
  }

  updateRepository(id: number, repository: Repository): Observable<Repository> {
    return this.http.put<Repository>(`${this.endpoint}`, repository);
  }

  deleteRepository(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  cloneRepository(id: number): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/${id}/clone`, {});
  }
}