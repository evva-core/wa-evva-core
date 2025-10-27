import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Host } from '../../core/models';
import { HostService } from '../../core/services/host.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-host-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './host-form.component.html',
  styleUrl: './host-form.component.css'
})
export class HostFormComponent implements OnInit {
  @Input() host: Host | null = null;
  @Input() isEditMode: boolean = false;
  @Input() showActions: boolean = true;
  @Output() formSubmit = new EventEmitter<Host>();
  @Output() formCancel = new EventEmitter<void>();

  hostForm: FormGroup;
  isSubmitting = false;

  operatingSystems = [
    { value: 'Windows', label: 'Windows' },
    { value: 'Linux', label: 'Linux' },
    { value: 'MacOS', label: 'MacOS' }
  ];

  architectures = [
    { value: 'x64', label: 'x64' },
    { value: 'x86', label: 'x86' },
    { value: 'arm64', label: 'ARM64' },
    { value: 'arm', label: 'ARM' }
  ];

  constructor(
    private fb: FormBuilder,
    private hostService: HostService
  ) {
    this.hostForm = this.createForm();
  }

  ngOnInit() {
    if (this.host && this.isEditMode) {
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ipAddress: ['', [Validators.required, Validators.pattern(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)]],
      operatingSystem: ['', Validators.required],
      architecture: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
      location: ['', Validators.maxLength(100)],
      port: [5643, [Validators.required, Validators.min(1), Validators.max(65535)]],
      isActive: [true]
    });
  }

  private populateForm() {
    if (this.host) {
      this.hostForm.patchValue({
        name: this.host.name,
        ipAddress: this.host.ipAddress,
        operatingSystem: this.host.operatingSystem,
        architecture: this.host.architecture,
        description: this.host.description || '',
        location: this.host.location || '',
        port: this.host.port || 5643,
        isActive: this.host.isActive
      });
    }
  }

  onSubmit() {
    if (this.hostForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const hostData: Partial<Host> = this.hostForm.value;

      let submissionObservable: Observable<any>;

      if (this.isEditMode && this.host) {
        submissionObservable = this.hostService.updateHost(this.host.id, hostData);
      } else {
        submissionObservable = this.hostService.createHost(hostData);
      }

      submissionObservable.subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.formSubmit.emit(response);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('API Error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  onReset() {
    this.hostForm.reset();
    if (this.host && this.isEditMode) {
      this.populateForm();
    } else {
        this.hostForm.patchValue({
            port: 5643,
            isActive: true
        });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.hostForm.controls).forEach(key => {
      const control = this.hostForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.hostForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return `Please enter a valid ${this.getFieldLabel(fieldName).toLowerCase()}`;
      }
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Host Name',
      ipAddress: 'IP Address',
      operatingSystem: 'Operating System',
      architecture: 'Architecture',
      description: 'Description',
      location: 'Location',
      port: 'Port',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.hostForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}