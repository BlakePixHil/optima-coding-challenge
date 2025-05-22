import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';

import { ITask } from '../task-card/typings/task.interface';
import { EPriorityType } from '../typings/priority.enum';
import { ITaskFormGroup } from './typings/task.form';

@Component({
    selector: 'app-task-dialog',
    standalone: true,
    templateUrl: './task-dialog.component.html',
    styleUrls: ['./task-dialog.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgIf
    ]
})
export class TaskDialogComponent
{
    @Output() close = new EventEmitter<void>();
    @Output() submitTask = new EventEmitter<ITask>();

    protected formGroup: FormGroup<ITaskFormGroup>;
    protected priorities = Object.values(EPriorityType);

    constructor()
    {
        this.formGroup = new FormGroup<ITaskFormGroup>({
            title: new FormControl('', { validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)], nonNullable: true }),
            description: new FormControl('', { validators: [Validators.maxLength(100)], nonNullable: true }),
            priority: new FormControl(EPriorityType.LOW, { validators: [Validators.required], nonNullable: true })
        });
    }

    protected get title(): FormControl<string>
    {
        return this.formGroup.get('title') as FormControl<string>;
    }

    protected get description(): FormControl<string>
    {
        return this.formGroup.get('description') as FormControl<string>;
    }

    protected get priority(): FormControl<EPriorityType>
    {
        return this.formGroup.get('priority') as FormControl<EPriorityType>;
    }

    protected onClose(): void
    {
        this.formGroup.reset();
        this.close.emit();
    }

    protected onSubmit(): void
    {
        if (this.formGroup.valid)
        {
            const task: ITask = {
                id: crypto.randomUUID(),
                title: this.title.value,
                description: this.description.value,
                priority: this.priority.value,
                isCompleted: false
            };
            this.submitTask.emit(task);
            this.close.emit();
        }
        else this.formGroup.markAllAsTouched();
    }
}
