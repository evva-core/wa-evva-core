import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Host } from '../../core/models';

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
  @Output() formSubmit = new EventEmitter<Partial<Host>>();
  @Output() formCancel = new EventEmitter<void>();

  hostForm: FormGroup;
  isSubmitting = false;

  operatingSystems = [
    { value: 'windows', label: 'Windows' },
    { value: 'linux', label: 'Linux' },
    { value: 'macos', label: 'macOS' },
    { value: 'ubuntu', label: 'Ubuntu' },
    { value: 'centos', label: 'CentOS' },
    { value: 'debian', label: 'Debian' }
  ];

  architectures = [
    { value: 'x64', label: 'x64' },
    { value: 'x86', label: 'x86' },
    { value: 'arm64', label: 'ARM64' },
    { value: 'arm', label: 'ARM' }
  ];

  constructor(private fb: FormBuilder) {
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
      tags: [''],
      port: [22, [Validators.required, Validators.min(1), Validators.max(65535)]],
      username: ['', Validators.required],
      password: [''],
      sshKey: [''],
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
        tags: this.host.tags?.join(', ') || '',
        port: this.host.port || 22,
        username: this.host.username || '',
        password: '',
        sshKey: '',
        isActive: this.host.status === 'online'
      });
    }
  }

  onSubmit() {
    if (this.hostForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.hostForm.value;
      const hostData: Partial<Host> = {
        name: formValue.name,
        ipAddress: formValue.ipAddress,
        operatingSystem: formValue.operatingSystem,
        architecture: formValue.architecture,
        description: formValue.description,
        location: formValue.location,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
        port: formValue.port,
        username: formValue.username,
        status: formValue.isActive ? 'online' : 'offline'
      };

      // Add password or SSH key if provided
      if (formValue.password) {
        (hostData as any).password = formValue.password;
      }
      if (formValue.sshKey) {
        (hostData as any).sshKey = formValue.sshKey;
      }

      this.formSubmit.emit(hostData);
      
      // Reset submitting state after a delay
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
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
      tags: 'Tags',
      port: 'Port',
      username: 'Username',
      password: 'Password',
      sshKey: 'SSH Key'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.hostForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}

