import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection; 
  private dataSubject = new Subject<any>();
  private connectionStatusSubject = new Subject<signalR.HubConnectionState>();

  public data$: Observable<any> = this.dataSubject.asObservable();
  public connectionStatus$: Observable<signalR.HubConnectionState> = this.connectionStatusSubject.asObservable();


  public startConnection(): Promise<void> {
    this.connectionStatusSubject.next(signalR.HubConnectionState.Connecting);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hostHub`)
      .withAutomaticReconnect()
      .build();
      
    this.hubConnection.onreconnecting(err => {
      console.warn('SignalR Reconnecting:', err);
      this.connectionStatusSubject.next(signalR.HubConnectionState.Reconnecting);
    });

    this.hubConnection.onreconnected(connectionId => {
      console.log('SignalR Reconnected. Connection ID:', connectionId);
      this.connectionStatusSubject.next(signalR.HubConnectionState.Connected);
    });

    return this.hubConnection.start().then(() => {
      this.connectionStatusSubject.next(signalR.HubConnectionState.Connected);
    }).catch(err => {
      this.connectionStatusSubject.next(signalR.HubConnectionState.Disconnected);
      throw err;
    });
  }

  public getHubConnectionStatus(): signalR.HubConnectionState  {
    return this.hubConnection.state;
  }

  public joinHostGroup(uniqueId: string): Promise<void> {
    return this.hubConnection.invoke('JoinHostGroup', uniqueId);
  }

  public leaveHostGroup(uniqueId: string): Promise<void> {
    return this.hubConnection.invoke('LeaveHostGroup', uniqueId);
  }

  public addDataListener(): void {
    this.hubConnection.on('ReceiveHostData', (data) => {
      this.dataSubject.next(data);
    });
  }

  public stopConnection(): Promise<void> {
    if (this.hubConnection) {
      return this.hubConnection.stop().then(() => {
        this.connectionStatusSubject.next(signalR.HubConnectionState.Disconnected);
      });
    }
    this.connectionStatusSubject.next(signalR.HubConnectionState.Disconnected);
    return Promise.resolve();
  }
}