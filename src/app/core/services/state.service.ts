import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Host, Project, DashboardStats } from '../models';

interface AppState {
  hosts: Host[];
  projects: Project[];
  dashboardStats: DashboardStats | null;
  selectedHost: Host | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  hosts: [],
  projects: [],
  dashboardStats: null,
  selectedHost: null,
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private stateSubject = new BehaviorSubject<AppState>(initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {}

  private updateState(partialState: Partial<AppState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }

  // Hosts management
  setHosts(hosts: Host[]): void {
    this.updateState({ hosts });
  }

  addHost(host: Host): void {
    const currentHosts = this.stateSubject.value.hosts;
    this.updateState({ hosts: [...currentHosts, host] });
  }

  updateHost(updatedHost: Host): void {
    const currentHosts = this.stateSubject.value.hosts;
    const hosts = currentHosts.map(host => 
      host.id === updatedHost.id ? updatedHost : host
    );
    this.updateState({ hosts });
  }

  removeHost(hostId: string): void {
    const currentHosts = this.stateSubject.value.hosts;
    const hosts = currentHosts.filter(host => host.id !== hostId);
    this.updateState({ hosts });
  }

  getHosts(): Observable<Host[]> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.hosts));
    });
  }

  // Projects management
  setProjects(projects: Project[]): void {
    this.updateState({ projects });
  }

  addProject(project: Project): void {
    const currentProjects = this.stateSubject.value.projects;
    this.updateState({ projects: [...currentProjects, project] });
  }

  updateProject(updatedProject: Project): void {
    const currentProjects = this.stateSubject.value.projects;
    const projects = currentProjects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    this.updateState({ projects });
  }

  removeProject(projectId: string): void {
    const currentProjects = this.stateSubject.value.projects;
    const projects = currentProjects.filter(project => project.id !== projectId);
    this.updateState({ projects });
  }

  getProjects(): Observable<Project[]> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.projects));
    });
  }

  // Dashboard stats
  setDashboardStats(stats: DashboardStats): void {
    this.updateState({ dashboardStats: stats });
  }

  getDashboardStats(): Observable<DashboardStats | null> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.dashboardStats));
    });
  }

  // Selected host
  setSelectedHost(host: Host | null): void {
    this.updateState({ selectedHost: host });
  }

  getSelectedHost(): Observable<Host | null> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.selectedHost));
    });
  }

  // Loading state
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  getLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.loading));
    });
  }

  // Error state
  setError(error: string | null): void {
    this.updateState({ error });
  }

  getError(): Observable<string | null> {
    return new Observable(observer => {
      this.state$.subscribe(state => observer.next(state.error));
    });
  }

  // Clear error
  clearError(): void {
    this.updateState({ error: null });
  }

  // Get current state snapshot
  getCurrentState(): AppState {
    return this.stateSubject.value;
  }

  // Reset state
  resetState(): void {
    this.stateSubject.next(initialState);
  }
}

