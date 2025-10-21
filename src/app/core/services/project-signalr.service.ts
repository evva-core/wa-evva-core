import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectSignalrService {
  private hubConnection!: signalR.HubConnection;
  private repositoryStatusSubject = new Subject<any>();
  private deploymentStatusSubject = new Subject<any>();

  public repositoryStatus$ = this.repositoryStatusSubject.asObservable();
  public deploymentStatus$ = this.deploymentStatusSubject.asObservable();

  async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/projectHub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('RepositoryCloneStarted', (data) => {
      this.repositoryStatusSubject.next({ type: 'clone_started', ...data });
    });

    this.hubConnection.on('RepositoryCloneCompleted', (data) => {
      this.repositoryStatusSubject.next({ type: 'clone_completed', ...data });
    });

    this.hubConnection.on('RepositoryCloneFailed', (data) => {
      this.repositoryStatusSubject.next({ type: 'clone_failed', ...data });
    });

    // Deployment events
    this.hubConnection.on('DeploymentStarted', (data) => {
      this.deploymentStatusSubject.next({ type: 'deployment_started', ...data });
    });

    this.hubConnection.on('DeploymentProgress', (data) => {
      this.deploymentStatusSubject.next({ type: 'deployment_progress', ...data });
    });

    this.hubConnection.on('DeploymentCompleted', (data) => {
      this.deploymentStatusSubject.next({ type: 'deployment_completed', ...data });
    });

    this.hubConnection.on('DeploymentError', (data) => {
      this.deploymentStatusSubject.next({ type: 'deployment_error', ...data });
    });

    await this.hubConnection.start();
  }

  async joinProjectGroup(projectId: number): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('JoinProjectGroup', projectId);
    }
  }

  async leaveProjectGroup(projectId: number): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveProjectGroup', projectId);
    }
  }

  async startDeploy(projectId: number): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('StartDeploy', projectId);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }
}