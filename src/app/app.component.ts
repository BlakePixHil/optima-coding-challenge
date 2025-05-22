import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, signal, computed } from '@angular/core';

import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { ITask } from './components/task-card/typings/task.interface';
import { EPriorityType } from './components/typings/priority.enum';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        TaskCardComponent,
        TaskFilterComponent,
        TaskDialogComponent,
        DragDropModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent
{
    protected readonly EPriorityType = EPriorityType;

    protected selectedPriority = signal<string>('ALL');
    protected showTaskDialog = signal<boolean>(false);

    protected incompleteTasks = signal<ITask[]>([
        {
            id: crypto.randomUUID(),
            title: 'Sample Task 1',
            description: 'This is a short description for task 1.',
            priority: EPriorityType.HIGH,
            isCompleted: false
        },
        {
            id: crypto.randomUUID(),
            title: 'Sample Task 2',
            description: 'This is a short description for task 2.',
            priority: EPriorityType.MEDIUM,
            isCompleted: false
        },
        {
            id: crypto.randomUUID(),
            title: 'Sample Task 3',
            description: 'This is a short description for task 3.',
            priority: EPriorityType.LOW,
            isCompleted: false
        }
    ]);

    protected completedTasks = signal<ITask[]>([]);

    protected filteredIncompleteTasks = computed(() =>
    {
        const priority = this.selectedPriority();
        const tasks = this.incompleteTasks();

        if (priority === 'ALL') return tasks;

        return tasks.filter(task => task.priority === priority);
    });

    protected drop(event: CdkDragDrop<ITask[]>)
    {
        const tasks = [...this.incompleteTasks()];
        moveItemInArray(tasks, event.previousIndex, event.currentIndex);
        this.incompleteTasks.set(tasks);
    }

    protected toggleTaskComplete(event: ITask)
    {
        if (event.isCompleted)
        {
            const taskToMove = this.incompleteTasks().find(x => x.id === event.id);
            if (!taskToMove) return;

            this.incompleteTasks.update(tasks => tasks.filter(x => x.id !== event.id));
            this.completedTasks.update(tasks => [...tasks, { ...taskToMove, isCompleted: true }]);
        }
        else
        {
            const taskToMove = this.completedTasks().find(x => x.id === event.id);
            if (!taskToMove) return;

            this.completedTasks.update(tasks => tasks.filter(x => x.id !== event.id));
            this.incompleteTasks.update(tasks => [...tasks, { ...taskToMove, isCompleted: false }]);
        }
    }

    protected addTask(task: ITask)
    {
        this.incompleteTasks.update(tasks => [...tasks, task]);
    }

    protected onPriorityChange(priority: string)
    {
        this.selectedPriority.set(priority);
    }

    protected openTaskDialog()
    {
        this.showTaskDialog.set(true);
    }

    protected closeTaskDialog()
    {
        this.showTaskDialog.set(false);
    }
}
