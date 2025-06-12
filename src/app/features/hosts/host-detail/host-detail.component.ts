import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface HostDetail {
  id: string;
  name: string;
  ip: string;
  operatingSystem: string;
  architecture: string;
  status: 'online' | 'offline';
  diskUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  topProcesses: Process[];
  services: Service[];
  programs: Program[];
  lastSeen: Date;
  uptime: string;
  location: string;
  cpuUsage: number;
  networkInfo: {
    bytesIn: string;
    bytesOut: string;
  };
}

interface Process {
  id: string;
  name: string;
  memoryUsage: number;
  cpuUsage: number;
  pid: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'error';
  autoManagement: boolean;
  executablePath: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  executablePath: string;
  status: 'running' | 'stopped' | 'error';
}

@Component({
  selector: 'app-host-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './host-detail.component.html',
  styleUrls: ['./host-detail.component.css']
})
export class HostDetailComponent implements OnInit {
  hostId: string = '';
  host: HostDetail | null = null;
  isLoading = true;
  
  // Modal states
  showServiceModal = false;
  showProgramModal = false;
  editingService: Service | null = null;
  editingProgram: Program | null = null;

  // Form data
  serviceForm = {
    name: '',
    description: '',
    executablePath: '',
    autoManagement: false
  };

  programForm = {
    name: '',
    description: '',
    executablePath: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hostId = params['id'];
      this.loadHostDetails();
    });
  }

  private loadHostDetails(): void {
    // Mock data - in real app, this would be an API call
    setTimeout(() => {
      this.host = {
        id: this.hostId,
        name: 'web-server-01',
        ip: '192.168.1.10',
        operatingSystem: 'Ubuntu 22.04 LTS',
        architecture: 'x64',
        status: 'online',
        diskUsage: {
          used: 45.2,
          total: 100,
          percentage: 45
        },
        memoryUsage: {
          used: 12.8,
          total: 16,
          percentage: 80
        },
        topProcesses: [
          { id: '1', name: 'nginx', memoryUsage: 15.2, cpuUsage: 5.1, pid: 1234 },
          { id: '2', name: 'mysql', memoryUsage: 12.8, cpuUsage: 8.3, pid: 1235 },
          { id: '3', name: 'node', memoryUsage: 8.5, cpuUsage: 3.2, pid: 1236 },
          { id: '4', name: 'redis', memoryUsage: 6.1, cpuUsage: 1.8, pid: 1237 },
          { id: '5', name: 'docker', memoryUsage: 4.3, cpuUsage: 2.1, pid: 1238 }
        ],
        services: [
          { id: '1', name: 'nginx', description: 'Web server', status: 'running', autoManagement: true, executablePath: '/usr/sbin/nginx' },
          { id: '2', name: 'mysql', description: 'Database server', status: 'running', autoManagement: true, executablePath: '/usr/bin/mysqld' },
          { id: '3', name: 'redis', description: 'Cache server', status: 'stopped', autoManagement: false, executablePath: '/usr/bin/redis-server' }
        ],
        programs: [
          { id: '1', name: 'backup-script', description: 'Daily backup routine', executablePath: '/opt/scripts/backup.sh', status: 'stopped' },
          { id: '2', name: 'log-cleaner', description: 'Log cleanup utility', executablePath: '/opt/scripts/clean-logs.sh', status: 'running' }
        ],
        lastSeen: new Date(),
        uptime: '15d 8h 32m',
        location: 'Data Center A',
        cpuUsage: 25,
        networkInfo: {
          bytesIn: '1.2 TB',
          bytesOut: '856 GB'
        }
      };
      this.isLoading = false;
    }, 1000);
  }

  // Service management
  openServiceModal(service?: Service): void {
    this.editingService = service || null;
    if (service) {
      this.serviceForm = {
        name: service.name,
        description: service.description,
        executablePath: service.executablePath,
        autoManagement: service.autoManagement
      };
    } else {
      this.serviceForm = {
        name: '',
        description: '',
        executablePath: '',
        autoManagement: false
      };
    }
    this.showServiceModal = true;
  }

  closeServiceModal(): void {
    this.showServiceModal = false;
    this.editingService = null;
  }

  saveService(): void {
    console.log('Saving service:', this.serviceForm);
    // TODO: Implement service save logic
    this.closeServiceModal();
  }

  deleteService(serviceId: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      console.log('Deleting service:', serviceId);
      // TODO: Implement service delete logic
    }
  }

  toggleService(service: Service): void {
    const action = service.status === 'running' ? 'stop' : 'start';
    console.log(`${action} service:`, service.name);
    // TODO: Implement service toggle logic
  }

  // Program management
  openProgramModal(program?: Program): void {
    this.editingProgram = program || null;
    if (program) {
      this.programForm = {
        name: program.name,
        description: program.description,
        executablePath: program.executablePath
      };
    } else {
      this.programForm = {
        name: '',
        description: '',
        executablePath: ''
      };
    }
    this.showProgramModal = true;
  }

  closeProgramModal(): void {
    this.showProgramModal = false;
    this.editingProgram = null;
  }

  saveProgram(): void {
    console.log('Saving program:', this.programForm);
    // TODO: Implement program save logic
    this.closeProgramModal();
  }

  deleteProgram(programId: string): void {
    if (confirm('Are you sure you want to delete this program?')) {
      console.log('Deleting program:', programId);
      // TODO: Implement program delete logic
    }
  }

  executeProgram(program: Program): void {
    console.log('Executing program:', program.name);
    // TODO: Implement program execution logic
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'running':
      case 'online':
        return 'text-green-600';
      case 'stopped':
      case 'offline':
        return 'text-red-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-secondary-600';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'running':
      case 'online':
        return 'status-online';
      case 'stopped':
      case 'offline':
        return 'status-offline';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  }

  refreshHostData(): void {
    this.isLoading = true;
    this.loadHostDetails();
  }
}

