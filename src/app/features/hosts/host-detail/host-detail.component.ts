import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { Host, DetailedHost, Process, Service, Program, DiskUsage, MemoryUsage, NetworkInfo, ApiResponse } from '../../../core/models';
import { HostService } from '../../../core/services/host.service';
import { SignalrService } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-host-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './host-detail.component.html',
  styleUrls: ['./host-detail.component.css']
})
export class HostDetailComponent implements OnInit, OnDestroy {
  uniqueId: string = '';
  host: DetailedHost | null = null;
  isLoading = true;
  private dataSubscription: Subscription = new Subscription();
  private connectionStatusSubscription: Subscription = new Subscription();
  public SignalStatus: signalR.HubConnectionState | undefined;

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

  constructor(
    private route: ActivatedRoute,
    private hostService: HostService,
    private signalrService: SignalrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uniqueId = params['uniqueId'];
      this.loadInitialHostData();
      this.setupSignalR();
    });

    this.connectionStatusSubscription = this.signalrService.connectionStatus$.subscribe(status => {
      this.SignalStatus = status;
      console.log('SignalR Connection Status:', this.SignalStatus);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.connectionStatusSubscription) {
      this.connectionStatusSubscription.unsubscribe();
    }
    if (this.uniqueId) {
      this.signalrService.leaveHostGroup(this.uniqueId);
    }
    this.signalrService.stopConnection();
  }

  private loadInitialHostData(): void {
    this.isLoading = true;
    this.hostService.getHostByUniqueId(this.uniqueId).subscribe({
      next: (response: Host) => {
        
        const initialHost = response; 
        this.host = {
          ...initialHost,
          status: initialHost.isActive ? 'online' : 'offline', 
          cpuUsage: 0, 
          disks: [],
          memoryUsage: { used: 0, total: 0, percentage: 0 }, 
          networkInfo: { bytesIn: '0 KB', bytesOut: '0 KB' }, 
          topProcesses: [], 
          services: [], // Default
          programs: [], // Default
          uptime: 'N/A', // Default
          lastSeen: new Date(), // Default
        };
       
      },
      error: (error: any) => {
        console.error('Error loading host details:', error);
       
      }
    });
    console.log(this.host)
  }

  private setupSignalR(): void {
    this.signalrService.startConnection()
    .then(() => {
      console.log('SignalR Connected!');
      
        this.signalrService.joinHostGroup(this.uniqueId);
        this.signalrService.addDataListener();
        this.dataSubscription = this.signalrService.data$.subscribe((data: any) => {
          console.log('Received SignalR data:', data);
          if (this.host) {
            this.host = {
              ...this.host,
              cpuUsage: data.cpuUsage || this.host.cpuUsage,
              memoryUsage: {
                used: data.memoryUsage.used || this.host.memoryUsage.used,
                total: data.memoryUsage.total || this.host.memoryUsage.total,
                percentage: data.memoryUsage.percentage || this.host.memoryUsage.percentage
              },
              disks: data.disks || this.host.disks,
              topProcesses: data.topProcesses ? data.topProcesses.map((p: any) => ({
                id: p.id,
                name: p.name,
                memoryUsageMB:Math.floor(p.memoryUsageMB),
                memoryUsagePercentage: p.memoryUsagePercentage,
                cpuUsage: p.cpuUsage
              })) : this.host.topProcesses,
              services: data.services ? data.services.map((s: any) => ({
                id: s.name,
                name: s.name,
                description: s.displayName,
                status: s.status.toLowerCase(),
                autoManagement: false,
                executablePath: ''
              })) : this.host.services,
              uptime: data.uptime || this.host.uptime,
              lastSeen: data.lastSeen ? new Date(data.lastSeen) : this.host.lastSeen,
              networkInfo: data.networkInfo || this.host.networkInfo,
            };
            this.host.status = this.host.isActive ? 'online' : 'offline';
            this.isLoading = false; 
            
          }
        });
      })
      .catch(err => console.error('Error while starting SignalR connection: ' + err));
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

  getSingnalStyleClass(): string {
    switch(this.SignalStatus)
    {
      case 'Connected':
        return 'status-online';
      case 'Connecting':
        return 'status-connecting';
      case 'Reconnecting':
        return 'status-reconnecting';
      case 'Disconnected':
        return 'status-disconnected';
      default:
        return 'bg-gray-500 rounded flex jusitfy-center items-center pl-2 pr-2 pt-1 pb-1 text-gray-200';
    }
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
        return 'text-gray-600';
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
        return 'bg-gray-100 text-gray-800';
    }
  }

  refreshHostData(): void {
    this.loadInitialHostData();
  }
}