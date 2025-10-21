import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectWorkflow } from '../../../../core/models';
import { WorkflowService } from '../../../../core/services/workflow.service';

interface Workflow {
  id: number;
  name: string;
  description?: string;
  command: string;
  supportedOs: string;
  parameters?: string;
  isJsonRequired: boolean;
  jsonData?: string;
}

interface WorkflowStep {
  id: number;
  workflowId: number;
  executionOrder: number;
  stageName?: string;
  workflow: Workflow;
  x: number;
  y: number;
}

@Component({
  selector: 'app-workflow-builder-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-builder-modal.component.html',
  styleUrl: './workflow-builder-modal.component.css'
})
export class WorkflowBuilderModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() projectId = 0;
  @Input() existingWorkflows: ProjectWorkflow[] = [];
  @Output() saveWorkflows = new EventEmitter<WorkflowStep[]>();
  @Output() cancel = new EventEmitter<void>();

  workflowSteps: WorkflowStep[] = [];
  availableWorkflows: Workflow[] = [];
  selectedStep: WorkflowStep | null = null;
  isLoadingWorkflows = false;
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  stepFormData: any = {};

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    // Initial load
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen) {
      this.loadAvailableWorkflows();
      this.initializeWorkflowSteps();
    }
  }

  loadAvailableWorkflows(): void {
    console.log('Loading available workflows...');
    this.isLoadingWorkflows = true;
    this.workflowService.getWorkflows().subscribe({
      next: (response) => {
        console.log('Workflows response:', response);
        if (response.success && response.data) {
          this.availableWorkflows = response.data;
          console.log('Available workflows loaded:', this.availableWorkflows.length);
        } else {
          console.log('No workflows data in response');
        }
        this.isLoadingWorkflows = false;
      },
      error: (err) => {
        console.error('Error loading workflows:', err);
        this.isLoadingWorkflows = false;
      }
    });
  }

  initializeWorkflowSteps(): void {
    console.log('Initializing workflow steps with existing workflows:', this.existingWorkflows);
    this.workflowSteps = this.existingWorkflows.map((pw, index) => ({
      id: pw.id,
      workflowId: pw.workflowId,
      executionOrder: pw.executionOrder || (index + 1), // Ensure executionOrder is never 0
      stageName: pw.stageName,
      workflow: pw.workflow as Workflow,
      x: 150 + (index % 4) * 280,
      y: 120 + Math.floor(index / 4) * 180
    }));
    console.log('Workflow steps initialized:', this.workflowSteps.length);
  }

  addWorkflowStep(workflow: Workflow): void {
    const newStep: WorkflowStep = {
      id: Date.now(),
      workflowId: workflow.id,
      executionOrder: this.workflowSteps.length + 1,
      workflow: workflow,
      x: 150 + (this.workflowSteps.length % 4) * 280,
      y: 120 + Math.floor(this.workflowSteps.length / 4) * 180
    };
    
    this.workflowSteps.push(newStep);
  }

  selectStep(step: WorkflowStep, event: Event): void {
    event.stopPropagation();
    this.selectedStep = step;
    this.initializeStepForm();
  }

  initializeStepForm(): void {
    if (!this.selectedStep?.workflow.jsonData) {
      this.stepFormData = {};
      this.updateFormFields();
      return;
    }
    
    try {
      this.stepFormData = JSON.parse(this.selectedStep.workflow.jsonData);
      this.updateFormFields();
    } catch {
      this.stepFormData = {};
      this.updateFormFields();
    }
  }

  formFields: { key: string, value: any, type: string }[] = [];

  getFormFields(): { key: string, value: any, type: string }[] {
    return this.formFields;
  }

  private updateFormFields(): void {
    if (!this.stepFormData || typeof this.stepFormData !== 'object') {
      this.formFields = [];
      return;
    }
    
    this.formFields = Object.keys(this.stepFormData).map(key => ({
      key,
      value: this.stepFormData[key],
      type: this.getFieldType(this.stepFormData[key])
    }));
  }

  getFieldType(value: any): string {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return 'string';
  }

  updateFormField(key: string, value: any): void {
    this.stepFormData[key] = value;
    if (this.selectedStep) {
      this.selectedStep.workflow.jsonData = JSON.stringify(this.stepFormData);
    }
  }

  updateJsonField(key: string, jsonString: string): void {
    try {
      const parsedValue = JSON.parse(jsonString);
      this.updateFormField(key, parsedValue);
    } catch {
      // Invalid JSON, don't update
    }
  }

  removeStep(step: WorkflowStep): void {
    this.workflowSteps = this.workflowSteps.filter(s => s.id !== step.id);
    this.selectedStep = null;
    this.reorderSteps();
  }

  updateStepOrder(): void {
    this.reorderSteps();
  }

  private reorderSteps(): void {
    this.workflowSteps.sort((a, b) => a.executionOrder - b.executionOrder);
    this.workflowSteps.forEach((step, index) => {
      step.executionOrder = index + 1;
    });
  }

  startDrag(step: WorkflowStep, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragging = true;
    this.selectedStep = step;
    
    const rect = (event.target as HTMLElement).closest('.absolute')?.getBoundingClientRect();
    if (rect) {
      this.dragOffset = {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2
      };
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.selectedStep) return;
    
    const canvas = event.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    
    const newX = event.clientX - rect.left - this.dragOffset.x;
    const newY = event.clientY - rect.top - this.dragOffset.y;
    
    // Keep within canvas bounds
    const minX = 128; // Half of step width (256/2)
    const maxX = rect.width - 128;
    const minY = 60;
    const maxY = rect.height - 60;
    
    this.selectedStep.x = Math.max(minX, Math.min(maxX, newX));
    this.selectedStep.y = Math.max(minY, Math.min(maxY, newY));
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  onCanvasClick(event: Event): void {
    this.selectedStep = null;
  }

  close(): void {
    this.cancel.emit();
  }

  save(): void {
    this.saveWorkflows.emit(this.workflowSteps);
  }

  trackByStepId(index: number, step: WorkflowStep): number {
    return step.id;
  }

  onInputChange(event: Event, key: string): void {
    const target = event.target as HTMLInputElement;
    this.updateFormField(key, target.value);
  }

  onNumberChange(event: Event, key: string): void {
    const target = event.target as HTMLInputElement;
    this.updateFormField(key, +target.value);
  }

  onCheckboxChange(event: Event, key: string): void {
    const target = event.target as HTMLInputElement;
    this.updateFormField(key, target.checked);
  }

  onTextareaChange(event: Event, key: string): void {
    const target = event.target as HTMLTextAreaElement;
    this.updateJsonField(key, target.value);
  }
}