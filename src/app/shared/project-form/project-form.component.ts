import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Project, Host } from '../../core/models';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() isEditMode: boolean = false;
  @Input() showActions: boolean = true;
  @Input() hosts: Host[] = [];
  @Output() formSubmit = new EventEmitter<Partial<Project>>();
  @Output() formCancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  isSubmitting = false;

  scheduleTypes = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'hourly', label: 'Every X hours' },
    { value: 'daily', label: 'Daily at specific time' },
    { value: 'weekly', label: 'Weekly on specific day' }
  ];

  daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: [this.project?.name || '', [Validators.required, Validators.minLength(2)]],
      repositoryUrl: [this.project?.repositoryUrl || '', [Validators.required, this.urlValidator]],
      branch: [this.project?.branch || 'main', [Validators.required]],
      targetPath: [this.project?.targetPath || '', [Validators.required]],
      hostId: [this.project?.hostId || '', [Validators.required]],
      responsible: [this.project?.responsible || '', [Validators.required]],
      autoSyncEnabled: [this.project?.autoSync?.enabled || false],
      autoSyncType: [this.project?.autoSync?.type || 'disabled'],
      autoSyncInterval: [this.project?.autoSync?.intervalHours || 24, [Validators.min(1), Validators.max(168)]],
      autoSyncDay: [this.project?.autoSync?.schedule?.dayOfWeek || 1],
      autoSyncTime: [this.project?.autoSync?.schedule?.time || '02:00']
    });

    // Watch for auto-sync changes
    this.projectForm.get('autoSyncEnabled')?.valueChanges.subscribe(enabled => {
      if (!enabled) {
        this.projectForm.patchValue({ autoSyncType: 'disabled' });
      }
    });
  }

  private urlValidator(control: any) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const gitPattern = /^(https?:\/\/)?(git@)?[\w\.-]+[:\\/][\w\.-]+\/[\w\.-]+\.git$/;
    
    if (!control.value) return null;
    
    const isValidUrl = urlPattern.test(control.value);
    const isValidGit = gitPattern.test(control.value);
    
    return (isValidUrl || isValidGit) ? null : { invalidUrl: true };
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.projectForm.value;
      const projectData: Partial<Project> = {
        name: formValue.name,
        repositoryUrl: formValue.repositoryUrl,
        branch: formValue.branch,
        targetPath: formValue.targetPath,
        hostId: formValue.hostId,
        responsible: formValue.responsible,
        autoSync: formValue.autoSyncEnabled ? {
          id: this.project?.autoSync?.id || '',
          enabled: true,
          type: formValue.autoSyncType,
          intervalHours: formValue.autoSyncType === 'hourly' ? formValue.autoSyncInterval : undefined,
          schedule: formValue.autoSyncType === 'weekly' ? {
            dayOfWeek: formValue.autoSyncDay,
            time: formValue.autoSyncTime
          } : undefined
        } : undefined
      };

      this.formSubmit.emit(projectData);
      
      // Reset submitting state after a delay
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['invalidUrl']) return 'Please enter a valid repository URL';
      if (field.errors['min']) return `Value must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `Value must be at most ${field.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  get showAutoSyncOptions(): boolean {
    return this.projectForm.get('autoSyncEnabled')?.value && 
           this.projectForm.get('autoSyncType')?.value !== 'disabled';
  }

  get showIntervalOptions(): boolean {
    return this.showAutoSyncOptions && this.projectForm.get('autoSyncType')?.value === 'hourly';
  }

  get showScheduleOptions(): boolean {
    return this.showAutoSyncOptions && this.projectForm.get('autoSyncType')?.value === 'weekly';
  }
}

