import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Project, ProjectFilter } from '../models';

interface ProjectState {
  projects: Project[];
  selectedProjects: string[];
  currentProject: Project | null;
  filter: ProjectFilter;
  loading: boolean;
  error: string | null;
  syncingProjects: string[];
  lastUpdated: Date | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProjects: [],
  currentProject: null,
  filter: {},
  loading: false,
  error: null,
  syncingProjects: [],
  lastUpdated: null
};

@Injectable({
  providedIn: 'root'
})
export class ProjectStore {
  private stateSubject = new BehaviorSubject<ProjectState>(initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {}

  private updateState(partialState: Partial<ProjectState>): void {
    const currentState = this.stateSubject.value;
    const newState = { 
      ...currentState, 
      ...partialState,
      lastUpdated: new Date()
    };
    this.stateSubject.next(newState);
  }

  // Selectors
  getProjects(): Observable<Project[]> {
    return this.state$.pipe(
      map(state => state.projects),
      distinctUntilChanged()
    );
  }

  getFilteredProjects(): Observable<Project[]> {
    return combineLatest([
      this.getProjects(),
      this.getFilter()
    ]).pipe(
      map(([projects, filter]) => this.applyFilter(projects, filter))
    );
  }

  getSelectedProjects(): Observable<string[]> {
    return this.state$.pipe(
      map(state => state.selectedProjects),
      distinctUntilChanged()
    );
  }

  getCurrentProject(): Observable<Project | null> {
    return this.state$.pipe(
      map(state => state.currentProject),
      distinctUntilChanged()
    );
  }

  getFilter(): Observable<ProjectFilter> {
    return this.state$.pipe(
      map(state => state.filter),
      distinctUntilChanged()
    );
  }

  getLoading(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.loading),
      distinctUntilChanged()
    );
  }

  getError(): Observable<string | null> {
    return this.state$.pipe(
      map(state => state.error),
      distinctUntilChanged()
    );
  }

  getSyncingProjects(): Observable<string[]> {
    return this.state$.pipe(
      map(state => state.syncingProjects),
      distinctUntilChanged()
    );
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this.getProjects().pipe(
      map(projects => projects.find(project => project.id === id))
    );
  }

  getProjectsByHost(hostId: string): Observable<Project[]> {
    return this.getProjects().pipe(
      map(projects => projects.filter(project => project.hostId === hostId))
    );
  }

  getProjectsByStatus(status: string): Observable<Project[]> {
    return this.getProjects().pipe(
      map(projects => projects.filter(project => project.status === status))
    );
  }

  getActiveProjects(): Observable<Project[]> {
    return this.getProjects().pipe(
      map(projects => projects.filter(project => 
        project.status === 'ready' || project.status === 'updating'
      ))
    );
  }

  getProjectStats(): Observable<{ total: number; active: number; error: number; syncing: number }> {
    return this.getProjects().pipe(
      map(projects => ({
        total: projects.length,
        active: projects.filter(p => p.status === 'ready').length,
        error: projects.filter(p => p.status === 'error').length,
        syncing: projects.filter(p => p.status === 'updating' || p.status === 'cloning').length
      }))
    );
  }

  isProjectSyncing(projectId: string): Observable<boolean> {
    return this.getSyncingProjects().pipe(
      map(syncingIds => syncingIds.includes(projectId))
    );
  }

  // Actions
  setProjects(projects: Project[]): void {
    this.updateState({ projects, error: null });
  }

  addProject(project: Project): void {
    const currentProjects = this.stateSubject.value.projects;
    this.updateState({ 
      projects: [...currentProjects, project],
      error: null
    });
  }

  updateProject(updatedProject: Project): void {
    const currentProjects = this.stateSubject.value.projects;
    const projects = currentProjects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    this.updateState({ projects, error: null });
  }

  removeProject(projectId: string): void {
    const currentState = this.stateSubject.value;
    const projects = currentState.projects.filter(project => project.id !== projectId);
    const selectedProjects = currentState.selectedProjects.filter(id => id !== projectId);
    const currentProject = currentState.currentProject?.id === projectId ? null : currentState.currentProject;
    const syncingProjects = currentState.syncingProjects.filter(id => id !== projectId);
    
    this.updateState({ 
      projects, 
      selectedProjects, 
      currentProject,
      syncingProjects,
      error: null 
    });
  }

  setCurrentProject(project: Project | null): void {
    this.updateState({ currentProject: project });
  }

  setSelectedProjects(projectIds: string[]): void {
    this.updateState({ selectedProjects: projectIds });
  }

  toggleProjectSelection(projectId: string): void {
    const currentSelected = this.stateSubject.value.selectedProjects;
    const selectedProjects = currentSelected.includes(projectId)
      ? currentSelected.filter(id => id !== projectId)
      : [...currentSelected, projectId];
    
    this.updateState({ selectedProjects });
  }

  selectAllProjects(): void {
    const allProjectIds = this.stateSubject.value.projects.map(project => project.id);
    this.updateState({ selectedProjects: allProjectIds });
  }

  clearSelection(): void {
    this.updateState({ selectedProjects: [] });
  }

  setFilter(filter: ProjectFilter): void {
    this.updateState({ filter });
  }

  updateFilter(partialFilter: Partial<ProjectFilter>): void {
    const currentFilter = this.stateSubject.value.filter;
    const filter = { ...currentFilter, ...partialFilter };
    this.updateState({ filter });
  }

  clearFilter(): void {
    this.updateState({ filter: {} });
  }

  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  // Sync operations
  startSync(projectId: string): void {
    const currentSyncing = this.stateSubject.value.syncingProjects;
    if (!currentSyncing.includes(projectId)) {
      this.updateState({ 
        syncingProjects: [...currentSyncing, projectId]
      });
    }
  }

  endSync(projectId: string): void {
    const currentSyncing = this.stateSubject.value.syncingProjects;
    this.updateState({ 
      syncingProjects: currentSyncing.filter(id => id !== projectId)
    });
  }

  // Utility methods
  private applyFilter(projects: Project[], filter: ProjectFilter): Project[] {
    return projects.filter(project => {
      if (filter.hostId && project.hostId !== filter.hostId) {
        return false;
      }
      if (filter.status && project.status !== filter.status) {
        return false;
      }
      if (filter.responsible && project.responsible !== filter.responsible) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return project.name.toLowerCase().includes(searchLower) ||
               project.repositoryUrl.toLowerCase().includes(searchLower) ||
               project.responsible.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  // Bulk operations
  bulkUpdateStatus(projectIds: string[], status: Project['status']): void {
    const currentProjects = this.stateSubject.value.projects;
    const projects = currentProjects.map(project => 
      projectIds.includes(project.id) ? { ...project, status } : project
    );
    this.updateState({ projects });
  }

  bulkRemove(projectIds: string[]): void {
    const currentState = this.stateSubject.value;
    const projects = currentState.projects.filter(project => !projectIds.includes(project.id));
    const selectedProjects = currentState.selectedProjects.filter(id => !projectIds.includes(id));
    const currentProject = projectIds.includes(currentState.currentProject?.id || '') 
      ? null 
      : currentState.currentProject;
    const syncingProjects = currentState.syncingProjects.filter(id => !projectIds.includes(id));
    
    this.updateState({ projects, selectedProjects, currentProject, syncingProjects });
  }

  bulkStartSync(projectIds: string[]): void {
    const currentSyncing = this.stateSubject.value.syncingProjects;
    const newSyncing = [...new Set([...currentSyncing, ...projectIds])];
    this.updateState({ syncingProjects: newSyncing });
  }

  bulkEndSync(projectIds: string[]): void {
    const currentSyncing = this.stateSubject.value.syncingProjects;
    const syncingProjects = currentSyncing.filter(id => !projectIds.includes(id));
    this.updateState({ syncingProjects });
  }

  // Get current state snapshot
  getCurrentState(): ProjectState {
    return this.stateSubject.value;
  }

  // Reset store
  reset(): void {
    this.stateSubject.next(initialState);
  }
}

