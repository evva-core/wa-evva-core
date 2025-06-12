import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Host, HostFilter } from '../models';

interface HostState {
  hosts: Host[];
  selectedHosts: string[];
  currentHost: Host | null;
  filter: HostFilter;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: HostState = {
  hosts: [],
  selectedHosts: [],
  currentHost: null,
  filter: {},
  loading: false,
  error: null,
  lastUpdated: null
};

@Injectable({
  providedIn: 'root'
})
export class HostStore {
  private readonly stateSubject = new BehaviorSubject<HostState>(initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {}

  private updateState(partialState: Partial<HostState>): void {
    const currentState = this.stateSubject.value;
    const newState = { 
      ...currentState, 
      ...partialState,
      lastUpdated: new Date()
    };
    this.stateSubject.next(newState);
  }

  // Selectors
  getHosts(): Observable<Host[]> {
    return this.state$.pipe(
      map(state => state.hosts),
      distinctUntilChanged()
    );
  }

  getFilteredHosts(): Observable<Host[]> {
    return combineLatest([
      this.getHosts(),
      this.getFilter()
    ]).pipe(
      map(([hosts, filter]) => this.applyFilter(hosts, filter))
    );
  }

  getSelectedHosts(): Observable<string[]> {
    return this.state$.pipe(
      map(state => state.selectedHosts),
      distinctUntilChanged()
    );
  }

  getCurrentHost(): Observable<Host | null> {
    return this.state$.pipe(
      map(state => state.currentHost),
      distinctUntilChanged()
    );
  }

  getFilter(): Observable<HostFilter> {
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

  getHostById(id: string): Observable<Host | undefined> {
    return this.getHosts().pipe(
      map(hosts => hosts.find(host => host.id === id))
    );
  }

  getOnlineHosts(): Observable<Host[]> {
    return this.getHosts().pipe(
      map(hosts => hosts.filter(host => host.status === 'online'))
    );
  }

  getOfflineHosts(): Observable<Host[]> {
    return this.getHosts().pipe(
      map(hosts => hosts.filter(host => host.status === 'offline'))
    );
  }

  getHostStats(): Observable<{ total: number; online: number; offline: number }> {
    return this.getHosts().pipe(
      map(hosts => ({
        total: hosts.length,
        online: hosts.filter(h => h.status === 'online').length,
        offline: hosts.filter(h => h.status === 'offline').length
      }))
    );
  }

  // Actions
  setHosts(hosts: Host[]): void {
    this.updateState({ hosts, error: null });
  }

  addHost(host: Host): void {
    const currentHosts = this.stateSubject.value.hosts;
    this.updateState({ 
      hosts: [...currentHosts, host],
      error: null
    });
  }

  updateHost(updatedHost: Host): void {
    const currentHosts = this.stateSubject.value.hosts;
    const hosts = currentHosts.map(host => 
      host.id === updatedHost.id ? updatedHost : host
    );
    this.updateState({ hosts, error: null });
  }

  removeHost(hostId: string): void {
    const currentState = this.stateSubject.value;
    const hosts = currentState.hosts.filter(host => host.id !== hostId);
    const selectedHosts = currentState.selectedHosts.filter(id => id !== hostId);
    const currentHost = currentState.currentHost?.id === hostId ? null : currentState.currentHost;
    
    this.updateState({ 
      hosts, 
      selectedHosts, 
      currentHost,
      error: null 
    });
  }

  setCurrentHost(host: Host | null): void {
    this.updateState({ currentHost: host });
  }

  setSelectedHosts(hostIds: string[]): void {
    this.updateState({ selectedHosts: hostIds });
  }

  toggleHostSelection(hostId: string): void {
    const currentSelected = this.stateSubject.value.selectedHosts;
    const selectedHosts = currentSelected.includes(hostId)
      ? currentSelected.filter(id => id !== hostId)
      : [...currentSelected, hostId];
    
    this.updateState({ selectedHosts });
  }

  selectAllHosts(): void {
    const allHostIds = this.stateSubject.value.hosts.map(host => host.id);
    this.updateState({ selectedHosts: allHostIds });
  }

  clearSelection(): void {
    this.updateState({ selectedHosts: [] });
  }

  setFilter(filter: HostFilter): void {
    this.updateState({ filter });
  }

  updateFilter(partialFilter: Partial<HostFilter>): void {
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

  // Utility methods
  private applyFilter(hosts: Host[], filter: HostFilter): Host[] {
    return hosts.filter(host => {
      if (filter.operatingSystem && host.operatingSystem !== filter.operatingSystem) {
        return false;
      }
      if (filter.architecture && host.architecture !== filter.architecture) {
        return false;
      }
      if (filter.status && host.status !== filter.status) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return host.name.toLowerCase().includes(searchLower) ||
               host.ipAddress.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  // Bulk operations
  bulkUpdateStatus(hostIds: string[], status: 'online' | 'offline'): void {
    const currentHosts = this.stateSubject.value.hosts;
    const hosts = currentHosts.map(host => 
      hostIds.includes(host.id) ? { ...host, status } : host
    );
    this.updateState({ hosts });
  }

  bulkRemove(hostIds: string[]): void {
    const currentState = this.stateSubject.value;
    const hosts = currentState.hosts.filter(host => !hostIds.includes(host.id));
    const selectedHosts = currentState.selectedHosts.filter(id => !hostIds.includes(id));
    const currentHost = hostIds.includes(currentState.currentHost?.id || '') 
      ? null 
      : currentState.currentHost;
    
    this.updateState({ hosts, selectedHosts, currentHost });
  }

  // Get current state snapshot
  getCurrentState(): HostState {
    return this.stateSubject.value;
  }

  // Reset store
  reset(): void {
    this.stateSubject.next(initialState);
  }
}

