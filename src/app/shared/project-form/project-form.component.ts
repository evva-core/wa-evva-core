import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Project, Host, Repository } from '../../core/models';

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
    if (!this.isEditMode) {
      this.addRepository(); // Start with one repository form
    }
    // In edit mode, you would populate the repositories array based on the project input
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: [this.project?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [this.project?.description || ''],
      status: [this.project?.status || 'active', [Validators.required]],
      ownerId: [this.project?.ownerId || 1, [Validators.required]], // Assuming ownerId 1 for now
      repositories: this.fb.array([])
    });
  }

  get repositories(): FormArray {
    return this.projectForm.get('repositories') as FormArray;
  }

  newRepository(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      repositoryUrl: ['', Validators.required],
      branch: ['main', Validators.required],
      targetPath: ['', Validators.required],
      hostId: [null, Validators.required],
      isDockerEnabled: [false],
      autoSync: [false],
      // dockerConfig: this.fb.group({ ... }) // Add if needed
    });
  }

  addRepository(): void {
    this.repositories.push(this.newRepository());
  }

  removeRepository(index: number): void {
    this.repositories.removeAt(index);
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.projectForm.value;
      
      const repositoriesData: Repository[] = formValue.repositories;
      
      const projectData: Partial<Project> = {
        name: formValue.name,
        description: formValue.description,
        status: formValue.status,
        ownerId: formValue.ownerId,
        repositories : repositoriesData
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

  // TODO: Adapt field error functions for FormArray
  getFieldError(fieldName: string, index: number): string {
    const field = this.repositories.at(index).get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `This field is required`;
      if (field.errors['minlength']) return `Must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string, index: number): boolean {
    const field = this.repositories.at(index).get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
