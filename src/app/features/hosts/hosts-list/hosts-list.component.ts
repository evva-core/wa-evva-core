import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HostFormComponent } from '../../../shared/host-form/host-form.component';
import { Host } from '../../../core/models';

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
  hosts: Host[] = [
    {
      id: '1',
      name: 'web-server-01',
      ipAddress: '192.168.1.10',
      operatingSystem: 'ubuntu',
      architecture: 'x64',
      status: 'online',
      lastSeen: new Date(),
      uptime: '15d 8h 32m',
      location: 'Data Center A',
      description: 'Main web server for production environment',
      tags: ['production', 'web', 'nginx'],
      port: 22,
      username: 'admin'
    },
    {
      id: '2',
      name: 'db-server-01',
      ipAddress: '192.168.1.11',
      operatingSystem: 'centos',
      architecture: 'x64',
      status: 'online',
      lastSeen: new Date(),
      uptime: '23d 14h 12m',
      location: 'Data Center A',
      description: 'Primary database server',
      tags: ['production', 'database', 'mysql'],
      port: 22,
      username: 'root'
    },
    {
      id: '3',
      name: 'api-server-01',
      ipAddress: '192.168.1.12',
      operatingSystem: 'windows',
      architecture: 'x64',
      status: 'offline',
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      uptime: '0d 0h 0m',
      location: 'Data Center B',
      description: 'API server for microservices',
      tags: ['production', 'api', 'dotnet'],
      port: 3389,
      username: 'administrator'
    },
    {
      id: '4',
      name: 'backup-server-01',
      ipAddress: '192.168.1.13',
      operatingSystem: 'ubuntu',
      architecture: 'x64',
      status: 'online',
      lastSeen: new Date(),
      uptime: '45d 2h 18m',
      location: 'Data Center A',
      description: 'Backup and disaster recovery server',
      tags: ['backup', 'storage'],
      port: 22,
      username: 'backup'
    },
    {
      id: '5',
      name: 'monitoring-server',
      ipAddress: '192.168.1.14',
      operatingSystem: 'debian',
      architecture: 'x64',
      status: 'online',
      lastSeen: new Date(),
      uptime: '12d 6h 45m',
      location: 'Data Center B',
      description: 'System monitoring and alerting',
      tags: ['monitoring', 'prometheus', 'grafana'],
      port: 22,
      username: 'monitor'
    },
    {
      id: '6',
      name: 'file-server-01',
      ipAddress: '192.168.1.15',
      operatingSystem: 'windows',
      architecture: 'x64',
      status: 'offline',
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      uptime: '0d 0h 0m',
      location: 'Data Center A',
      description: 'File storage and sharing server',
      tags: ['storage', 'files', 'smb'],
      port: 3389,
      username: 'fileadmin'
    }
  ];

  filteredHosts: Host[] = [];
  
  filter: HostFilter = {
    operatingSystem: '',
    architecture: '',
    status: '',
    search: ''
  };

  operatingSystems: string[] = [];
  architectures: string[] = [];
  
  selectedHosts: Set<string> = new Set();
  isLoading = false;

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  editingHost: Host | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.extractFilterOptions();
    this.applyFilters();
  }

  private extractFilterOptions(): void {
    this.operatingSystems = [...new Set(this.hosts.map(host => host.operatingSystem))];
    this.architectures = [...new Set(this.hosts.map(host => host.architecture))];
  }

  applyFilters(): void {
    this.filteredHosts = this.hosts.filter(host => {
      const matchesOS = !this.filter.operatingSystem || host.operatingSystem === this.filter.operatingSystem;
      const matchesArch = !this.filter.architecture || host.architecture === this.filter.architecture;
      const matchesStatus = !this.filter.status || host.status === this.filter.status;
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

  toggleHostSelection(hostId: string): void {
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
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      console.log('Hosts refreshed');
    }, 1000);
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
    // Simulate API call
    const newHost: Host = {
      id: (this.hosts.length + 1).toString(),
      name: hostData.name!,
      ipAddress: hostData.ipAddress!,
      operatingSystem: hostData.operatingSystem!,
      architecture: hostData.architecture!,
      status: hostData.status || 'offline',
      lastSeen: new Date(),
      uptime: '0d 0h 0m',
      location: hostData.location || '',
      description: hostData.description || '',
      tags: hostData.tags || [],
      port: hostData.port || 22,
      username: hostData.username || ''
    };

    this.hosts.push(newHost);
    this.extractFilterOptions();
    this.applyFilters();
    this.closeCreateModal();
    
    console.log('Host created:', newHost);
  }

  onHostUpdate(hostData: Partial<Host>): void {
    if (this.editingHost) {
      // Simulate API call
      const index = this.hosts.findIndex(h => h.id === this.editingHost!.id);
      if (index !== -1) {
        this.hosts[index] = {
          ...this.hosts[index],
          ...hostData
        };
        this.extractFilterOptions();
        this.applyFilters();
      }
      this.closeEditModal();
      
      console.log('Host updated:', hostData);
    }
  }

  // Navigation methods
  viewHostDetails(hostId: string): void {
    this.router.navigate(['/hosts', hostId]);
  }

  editHost(host: Host): void {
    this.openEditModal(host);
  }

  deleteHost(host: Host): void {
    if (confirm(`Are you sure you want to delete host "${host.name}"?`)) {
      this.hosts = this.hosts.filter(h => h.id !== host.id);
      this.selectedHosts.delete(host.id);
      this.extractFilterOptions();
      this.applyFilters();
      console.log('Host deleted:', host.name);
    }
  }

  bulkAction(action: string): void {
    const selectedHostsList = Array.from(this.selectedHosts);
    
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedHostsList.length} host(s)?`)) {
          this.hosts = this.hosts.filter(h => !this.selectedHosts.has(h.id));
          this.selectedHosts.clear();
          this.extractFilterOptions();
          this.applyFilters();
        }
        break;
      case 'start':
        selectedHostsList.forEach(hostId => {
          const host = this.hosts.find(h => h.id === hostId);
          if (host) {
            host.status = 'online';
          }
        });
        this.applyFilters();
        break;
      case 'stop':
        selectedHostsList.forEach(hostId => {
          const host = this.hosts.find(h => h.id === hostId);
          if (host) {
            host.status = 'offline';
          }
        });
        this.applyFilters();
        break;
    }
    
    console.log(`Bulk action: ${action} on hosts:`, selectedHostsList);
  }

  getStatusColor(status: string): string {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  }

  getStatusBadgeClass(status: string): string {
    return status === 'online' ? 'status-online' : 'status-offline';
  }

  getOSDisplayName(os: string): string {
    const osMap: { [key: string]: string } = {
      'ubuntu': 'Ubuntu',
      'centos': 'CentOS',
      'debian': 'Debian',
      'windows': 'Windows',
      'macos': 'macOS',
      'linux': 'Linux'
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

