import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Repository, RepositoryStatus, Host } from '../../../core/models';

@Component({
  selector: 'app-repository-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" *ngIf="isOpen">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-secondary-900">
            {{ isEditMode ? 'Edit Repository' : 'Add Repository' }}
          </h3>
          <button (click)="onCancel()" class="text-secondary-400 hover:text-secondary-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="repositoryForm" (ngSubmit)="onSubmit()" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Repository Name *
              </label>
              <input
                type="text"
                formControlName="name"
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter repository name"
                maxlength="40">
              <div *ngIf="repositoryForm.get('name')?.invalid && repositoryForm.get('name')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="repositoryForm.get('name')?.errors?.['required']">Repository name is required</span>
                <span *ngIf="repositoryForm.get('name')?.errors?.['maxlength']">Name must be 40 characters or less</span>
              </div>
            </div>

            <!-- Repository URL -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Repository URL *
              </label>
              <input
                type="url"
                formControlName="repositoryUrl"
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://github.com/user/repo.git"
                maxlength="120">
              <div *ngIf="repositoryForm.get('repositoryUrl')?.invalid && repositoryForm.get('repositoryUrl')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="repositoryForm.get('repositoryUrl')?.errors?.['required']">Repository URL is required</span>
                <span *ngIf="repositoryForm.get('repositoryUrl')?.errors?.['maxlength']">URL must be 120 characters or less</span>
              </div>
            </div>

            <!-- Branch -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Branch *
              </label>
              <input
                type="text"
                formControlName="branch"
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="main"
                maxlength="20">
              <div *ngIf="repositoryForm.get('branch')?.invalid && repositoryForm.get('branch')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="repositoryForm.get('branch')?.errors?.['required']">Branch is required</span>
                <span *ngIf="repositoryForm.get('branch')?.errors?.['maxlength']">Branch must be 20 characters or less</span>
              </div>
            </div>

            <!-- Host -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Host *
              </label>
              <select
                formControlName="hostId"
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select a host</option>
                <option *ngFor="let host of hosts" [value]="host.id">{{ host.name }}</option>
              </select>
              <div *ngIf="repositoryForm.get('hostId')?.invalid && repositoryForm.get('hostId')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="repositoryForm.get('hostId')?.errors?.['required']">Host is required</span>
              </div>
            </div>

            <!-- Target Path -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Target Path *
              </label>
              <input
                type="text"
                formControlName="targetPath"
                class="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="/var/www/project"
                maxlength="100">
              <div *ngIf="repositoryForm.get('targetPath')?.invalid && repositoryForm.get('targetPath')?.touched" 
                   class="mt-1 text-sm text-red-600">
                <span *ngIf="repositoryForm.get('targetPath')?.errors?.['required']">Target path is required</span>
                <span *ngIf="repositoryForm.get('targetPath')?.errors?.['maxlength']">Path must be 100 characters or less</span>
              </div>
            </div>

            <!-- Options -->
            <div class="md:col-span-2 space-y-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  formControlName="autoSync"
                  id="autoSync"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded">
                <label for="autoSync" class="ml-2 block text-sm text-secondary-700">
                  Enable Auto Sync
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  formControlName="isDockerEnabled"
                  id="isDockerEnabled"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded">
                <label for="isDockerEnabled" class="ml-2 block text-sm text-secondary-700">
                  Enable Docker
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              type="button"
              (click)="onCancel()"
              class="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="repositoryForm.invalid || isSubmitting"
              class="btn-primary">
              <span *ngIf="isSubmitting">Saving...</span>
              <span *ngIf="!isSubmitting">{{ isEditMode ? 'Update' : 'Create' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RepositoryFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() repository: Repository | null = null;
  @Input() projectId!: number;
  @Input() hosts: Host[] = [];
  @Output() save = new EventEmitter<Repository>();
  @Output() cancel = new EventEmitter<void>();

  repositoryForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.repositoryForm) {
      this.updateFormValues();
    }
  }

  private initForm(): void {
    this.repositoryForm = this.fb.group({
      name: [this.repository?.name || '', [Validators.required, Validators.maxLength(40)]],
      repositoryUrl: [this.repository?.repositoryUrl || '', [Validators.required, Validators.maxLength(120)]],
      branch: [this.repository?.branch || 'main', [Validators.required, Validators.maxLength(20)]],
      targetPath: [this.repository?.targetPath || '', [Validators.required, Validators.maxLength(100)]],
      hostId: [this.repository?.hostId || '', [Validators.required]],
      autoSync: [this.repository?.autoSync || false],
      isDockerEnabled: [this.repository?.isDockerEnabled || false]
    });
  }

  private updateFormValues(): void {
    this.repositoryForm.patchValue({
      name: this.repository?.name || '',
      repositoryUrl: this.repository?.repositoryUrl || '',
      branch: this.repository?.branch || 'main',
      targetPath: this.repository?.targetPath || '',
      hostId: this.repository?.hostId || '',
      autoSync: this.repository?.autoSync || false,
      isDockerEnabled: this.repository?.isDockerEnabled || false
    });
  }

  onSubmit(): void {
    if (this.repositoryForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.repositoryForm.value;
      const repositoryData: Repository = {
        id: this.repository?.id || 0,
        projectId: this.projectId,
        status: this.repository?.status || 'active',
        lastSync: this.repository?.lastSync,
        lastClone: this.repository?.lastClone,
        lastPush: this.repository?.lastPush,
        lastCommitHash: this.repository?.lastCommitHash,
        dockerConfigId: this.repository?.dockerConfigId,
        ...formValue
      };

      this.save.emit(repositoryData);
    }
  }

  onCancel(): void {
    this.repositoryForm.reset();
    this.isSubmitting = false;
    this.cancel.emit();
  }

  onSaveComplete(): void {
    this.isSubmitting = false;
  }

  get isEditMode(): boolean {
    return !!this.repository?.id;
  }
}