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

  public data$: Observable<any> = this.dataSubject.asObservable();

  public startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hostHub`)
      .withAutomaticReconnect()
      .build();

    return this.hubConnection.start();
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
      return this.hubConnection.stop();
    }
    return Promise.resolve();
  }
}