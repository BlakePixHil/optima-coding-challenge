import { Component, EventEmitter, Output } from '@angular/core';

import { EPriorityType } from '../typings/priority.enum';

@Component({
    selector: 'app-task-filter',
    standalone: true,
    templateUrl: './task-filter.component.html',
    styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent
{
    @Output() priorityChange = new EventEmitter<string>();

    protected selectedPriority: string = 'ALL';
    protected dropdownOpen = false;
    protected priorities = Object.values(EPriorityType);

    protected toggleDropdown(): void
    {
        this.dropdownOpen = !this.dropdownOpen;
    }

    protected selectPriority(priority: string): void
    {
        this.selectedPriority = priority;
        this.priorityChange.emit(priority);
        this.dropdownOpen = false;
    }
}
