import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HostFormComponent } from '../../../shared/host-form/host-form.component';
import { Host } from '../../../core/models';

@Component({
  selector: 'app-host-add',
  standalone: true,
  imports: [CommonModule, HostFormComponent],
  templateUrl: './host-add.component.html',
  styleUrl: './host-add.component.css'
})
export class HostAddComponent {
  isSubmitting = false;

  constructor(private router: Router) {}

  onHostCreate(hostData: Partial<Host>): void {
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Host created:', hostData);
      this.isSubmitting = false;
      
      // Navigate back to hosts list
      this.router.navigate(['/hosts']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/hosts']);
  }
}

