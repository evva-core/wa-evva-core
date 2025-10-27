import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HostFormComponent } from '../../../shared/host-form/host-form.component';
import { Host, ApiResponse } from '../../../core/models';
import { HostService } from '../../../core/services';

interface HostFilter {
  operatingSystem: string;
  architecture: string;
  status: string;
  search: string;
}

@Component({
  selector: 'app-hosts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HostFormComponent],
  templateUrl: './hosts-list.component.html',
  styleUrls: ['./hosts-list.component.css']
})
export class HostsListComponent implements OnInit {
  hosts: Host[] = [];
  filteredHosts: Host[] = [];
  
  filter: HostFilter = {
    operatingSystem: '',
    architecture: '',
    status: '',
    search: ''
  };

  operatingSystems: string[] = [];
  architectures: string[] = [];
  
  selectedHosts: Set<number> = new Set();
  isLoading = false;

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  editingHost: Host | null = null;

  constructor(private router: Router, private hostService: HostService) {}

  ngOnInit(): void {
    this.loadHosts();
  }

  loadHosts(): void {
    this.isLoading = true;
    this.hostService.getHosts().subscribe({
      next: (response: Host[]) => {
        this.hosts = response;
        this.extractFilterOptions();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading hosts:', error);
        this.isLoading = false;
      }
    });
  }

  private extractFilterOptions(): void {
    if (!this.hosts) this.hosts = [];
    this.operatingSystems = [...new Set(this.hosts.map(host => host.operatingSystem))];
    this.architectures = [...new Set(this.hosts.map(host => host.architecture))];
  }

  applyFilters(): void {
    if (!this.hosts) this.hosts = [];
    this.filteredHosts = this.hosts.filter(host => {
      const matchesOS = !this.filter.operatingSystem || host.operatingSystem === this.filter.operatingSystem;
      const matchesArch = !this.filter.architecture || host.architecture === this.filter.architecture;
      const matchesStatus = !this.filter.status || (host.isActive ? 'online' : 'offline') === this.filter.status;
      const matchesSearch = !this.filter.search || 
        host.name.toLowerCase().includes(this.filter.search.toLowerCase()) ||
        host.ipAddress.includes(this.filter.search);
      
      return matchesOS && matchesArch && matchesStatus && matchesSearch;
    });
  }

  clearFilters(): void {
    this.filter = {
      operatingSystem: '',
      architecture: '',
      status: '',
      search: ''
    };
    this.applyFilters();
  }

  toggleHostSelection(hostId: number): void {
    if (this.selectedHosts.has(hostId)) {
      this.selectedHosts.delete(hostId);
    } else {
      this.selectedHosts.add(hostId);
    }
  }

  toggleAllHosts(): void {
    if (this.selectedHosts.size === this.filteredHosts.length) {
      this.selectedHosts.clear();
    } else {
      this.selectedHosts.clear();
      this.filteredHosts.forEach(host => this.selectedHosts.add(host.id));
    }
  }

  get allHostsSelected(): boolean {
    return this.filteredHosts.length > 0 && this.selectedHosts.size === this.filteredHosts.length;
  }

  get someHostsSelected(): boolean {
    return this.selectedHosts.size > 0 && this.selectedHosts.size < this.filteredHosts.length;
  }

  refreshHosts(): void {
    this.loadHosts();
  }

  // Modal methods
  openCreateModal(): void {
    this.showCreateModal = true;
  }

  openEditModal(host: Host): void {
    this.editingHost = { ...host };
    this.showEditModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingHost = null;
  }

  onHostCreate(hostData: Partial<Host>): void {
    this.hostService.createHost(hostData).subscribe({
        next: () => {
          this.closeCreateModal();
            this.loadHosts();
        },
        error: (error: any) => console.error('Error creating host:', error)
    });
  }

  onHostUpdate(hostData: Partial<Host>): void {
    if (this.editingHost) {
        this.hostService.updateHost(this.editingHost.id, hostData).subscribe({
            next: () => {
                this.loadHosts();
                this.closeEditModal();
            },
            error: (error: any) => console.error('Error updating host:', error)
        });
    }
  }

  // Navigation methods
  viewHostDetails(uniqueId: string): void {
    this.router.navigate(['/hosts', uniqueId]);
  }

  editHost(host: Host): void {
    this.openEditModal(host);
  }

  deleteHost(host: Host): void {
    if (confirm(`Are you sure you want to delete host "${host.name}"?`)) {
        this.hostService.deleteHost(host.id).subscribe({
            next: () => {
                this.loadHosts();
            },
            error: (error: any) => console.error('Error deleting host:', error)
        });
    }
  }

  bulkAction(action: string): void {
    const selectedHostsList = Array.from(this.selectedHosts);
    
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedHostsList.length} host(s)?`)) {
            selectedHostsList.forEach(hostId => {
                this.hostService.deleteHost(hostId).subscribe({
                    next: () => this.loadHosts(),
                    error: (error: any) => console.error(`Error deleting host ${hostId}:`, error)
                });
            });
            this.selectedHosts.clear();
        }
        break;
      case 'start':
        // Implement bulk start logic with service call
        break;
      case 'stop':
        // Implement bulk stop logic with service call
        break;
    }
    
    console.log(`Bulk action: ${action} on hosts:`, selectedHostsList);
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'text-green-600' : 'text-red-600';
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'status-online' : 'status-offline';
  }

  getOSDisplayName(os: string): string {
    const osMap: { [key: string]: string } = {
      'Ubuntu': 'Ubuntu',
      'CentOS': 'CentOS',
      'Debian': 'Debian',
      'Windows': 'Windows',
      'MacOS': 'macOS',
      'Linux': 'Linux'
    };
    return osMap[os] || os;
  }

  formatLastSeen(date: Date | undefined): string {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}