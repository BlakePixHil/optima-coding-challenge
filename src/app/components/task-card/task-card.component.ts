import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

import { EPriorityType } from '../typings/priority.enum';
import { ITask } from './typings/task.interface';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class TaskCardComponent
{
    @Input() task!: ITask;
    @Output() complete = new EventEmitter<ITask>();

    protected get priorityColor(): string
    {
        switch (this.task.priority)
        {
            case EPriorityType.HIGH:
                return 'text-red-600';
            case EPriorityType.MEDIUM:
                return 'text-yellow-600';
            case EPriorityType.LOW:
            default:
                return 'text-blue-600';
        }
    }

    protected toggleComplete(task: ITask): void
    {
        task.isCompleted = !task.isCompleted;
        this.complete.emit(task);
    }
}
