import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { WorkflowBuilderModalComponent } from './workflow-builder-modal.component';
import { WorkflowService } from '../../../../core/services/workflow.service';

describe('WorkflowBuilderModalComponent', () => {
  let component: WorkflowBuilderModalComponent;
  let fixture: ComponentFixture<WorkflowBuilderModalComponent>;
  let mockWorkflowService: jasmine.SpyObj<WorkflowService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WorkflowService', ['getWorkflows']);

    await TestBed.configureTestingModule({
      imports: [WorkflowBuilderModalComponent, FormsModule],
      providers: [
        { provide: WorkflowService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowBuilderModalComponent);
    component = fixture.componentInstance;
    mockWorkflowService = TestBed.inject(WorkflowService) as jasmine.SpyObj<WorkflowService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workflows when modal opens', () => {
    const mockWorkflows = [
      {
        id: 1,
        name: 'Test Workflow',
        command: 'test.command',
        supportedOs: 'any',
        isJsonRequired: false
      }
    ];

    mockWorkflowService.getWorkflows.and.returnValue(of({
      success: true,
      data: mockWorkflows
    }));

    component.isOpen = true;
    component.ngOnChanges();

    expect(mockWorkflowService.getWorkflows).toHaveBeenCalled();
    expect(component.availableWorkflows).toEqual(mockWorkflows);
  });

  it('should add workflow step', () => {
    const mockWorkflow = {
      id: 1,
      name: 'Test Workflow',
      command: 'test.command',
      supportedOs: 'any',
      isJsonRequired: false
    };

    component.addWorkflowStep(mockWorkflow);

    expect(component.workflowSteps.length).toBe(1);
    expect(component.workflowSteps[0].workflow).toEqual(mockWorkflow);
  });

  it('should remove workflow step', () => {
    const mockStep = {
      id: 1,
      workflowId: 1,
      executionOrder: 1,
      workflow: {
        id: 1,
        name: 'Test',
        command: 'test',
        supportedOs: 'any',
        isJsonRequired: false
      },
      x: 100,
      y: 100
    };

    component.workflowSteps = [mockStep];
    component.removeStep(mockStep);

    expect(component.workflowSteps.length).toBe(0);
  });

  it('should emit save event', () => {
    spyOn(component.saveWorkflows, 'emit');
    
    component.save();

    expect(component.saveWorkflows.emit).toHaveBeenCalledWith(component.workflowSteps);
  });

  it('should emit cancel event', () => {
    spyOn(component.cancel, 'emit');
    
    component.close();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should initialize form data when step is selected', () => {
    const mockStep = {
      id: 1,
      workflowId: 1,
      executionOrder: 1,
      workflow: {
        id: 1,
        name: 'Test',
        command: 'test',
        supportedOs: 'any',
        isJsonRequired: true,
        jsonData: '{"key": "value"}'
      },
      x: 100,
      y: 100
    };

    component.selectedStep = mockStep;
    component.initializeStepForm();

    expect(component.stepFormData).toEqual({ key: 'value' });
  });

  it('should get correct field type', () => {
    expect(component.getFieldType('string')).toBe('string');
    expect(component.getFieldType(123)).toBe('number');
    expect(component.getFieldType(true)).toBe('boolean');
    expect(component.getFieldType([])).toBe('array');
    expect(component.getFieldType({})).toBe('object');
  });
});