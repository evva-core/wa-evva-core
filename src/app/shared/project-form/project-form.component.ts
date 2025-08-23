import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { Project, Host } from '../../core/models';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() isEditMode = false;
  @Input() showActions = true;
  @Input() hosts: Host[] = [];
  @Input() isModal = false;

  @Output() formSubmit = new EventEmitter<Partial<Project>>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  projectForm!: FormGroup;
  isSubmitting = false;

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
      hostName: [this.project?.hostName || ''],
      responsible: [this.project?.responsible || '', [Validators.required]],
      status: [this.project?.status || 'ready'],
      lastSync: [this.project?.lastSync || new Date()],
      lastClone: [this.project?.lastClone || new Date()],
      lastPull: [this.project?.lastPull || new Date()],
      lastPush: [this.project?.lastPush || new Date()],
      autoSync: [this.project?.autoSync || false],
      createdAt: [this.project?.createdAt || new Date()],
      updatedAt: [this.project?.updatedAt || new Date()],
      isDockerEnabled: [this.project?.isDockerEnabled || false],
      dockerConfig: this.fb.group({
        useDockerCompose: [this.project?.dockerConfig?.useDockerCompose || false],
        containerPort: [this.project?.dockerConfig?.containerPort || 8080],
        hostPort: [this.project?.dockerConfig?.hostPort || 8080]
      })
    });
  }

  private urlValidator(control: FormControl) {
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
        autoSync: formValue.autoSync,
        isDockerEnabled: formValue.isDockerEnabled,
        dockerConfig: formValue.dockerConfig
      };

      this.formSubmit.emit(projectData);

      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  closeProjectModal(): void {
    this.closeModal.emit();
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
}
