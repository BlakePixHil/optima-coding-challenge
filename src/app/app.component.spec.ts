import { TestBed } from '@angular/core/testing';

import { ITask } from './components/task-card/typings/task.interface';
import { EPriorityType } from './components/typings/priority.enum';
import { AppComponent } from './app.component';

// This is just some bs to emulate a generic signal type otherwise use any ;P
type Signal<T> = { (): T; set?: (v: T) => void; update?: (fn: (v: T) => T) => void; };

describe('AppComponent', () =>
{
    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
        }).compileComponents();
    });

    // Helper functions to access private/protected properties and methods
    function getSignal<T>(instance: object, key: string): Signal<T>
    {
        return (instance as any)[key] as Signal<T>;
    }

    function getMethod<T extends Function>(instance: object, key: string): T
    {
        // Bind the method to the instance to ensure 'this' is correct
        return ((instance as any)[key] as T).bind(instance);
    }

    it('should create the app', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        expect(app).toBeTruthy();
    });

    it('should add a new task to incompleteTasks', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const incompleteTasks = getSignal<ITask[]>(app, 'incompleteTasks');
        const initialLength = incompleteTasks().length;
        const newTask: ITask = {
            id: 'test-id',
            title: 'Test Task',
            description: 'Test Description',
            priority: EPriorityType.HIGH,
            isCompleted: false
        };

        getMethod<(task: ITask) => void>(app, 'addTask')(newTask);

        const updatedTasks = incompleteTasks();

        expect(updatedTasks.length).toBe(initialLength + 1);
        expect(updatedTasks.some(t => t.id === 'test-id')).toBeTrue();
    });

    it('should move a task to completedTasks when marked complete', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const incompleteTasks = getSignal<ITask[]>(app, 'incompleteTasks');
        const completedTasks = getSignal<ITask[]>(app, 'completedTasks');
        const toggleTaskComplete = getMethod<(task: ITask) => void>(app, 'toggleTaskComplete');
        const task = incompleteTasks()[0];

        toggleTaskComplete({ ...task, isCompleted: true });

        const incomplete = incompleteTasks();
        const completed = completedTasks();

        expect(incomplete.some(t => t.id === task.id)).toBeFalse();
        expect(completed.some(t => t.id === task.id)).toBeTrue();
    });

    it('should move a task back to incompleteTasks when marked incomplete', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const incompleteTasks = getSignal<ITask[]>(app, 'incompleteTasks');
        const completedTasks = getSignal<ITask[]>(app, 'completedTasks');
        const toggleTaskComplete = getMethod<(task: ITask) => void>(app, 'toggleTaskComplete');
        const task = incompleteTasks()[0];

        toggleTaskComplete({ ...task, isCompleted: true });
        toggleTaskComplete({ ...task, isCompleted: false });

        const incomplete = incompleteTasks();
        const completed = completedTasks();

        expect(completed.some(t => t.id === task.id)).toBeFalse();
        expect(incomplete.some(t => t.id === task.id)).toBeTrue();
    });

    it('should filter incomplete tasks by priority', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const selectedPriority = getSignal<string>(app, 'selectedPriority');
        const filteredIncompleteTasks = getSignal<ITask[]>(app, 'filteredIncompleteTasks');

        selectedPriority.set?.(EPriorityType.HIGH);

        const filtered = filteredIncompleteTasks();

        expect(filtered.every(t => t.priority === EPriorityType.HIGH)).toBeTrue();
    });

    it('should show all incomplete tasks when priority is ALL', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const selectedPriority = getSignal<string>(app, 'selectedPriority');
        const filteredIncompleteTasks = getSignal<ITask[]>(app, 'filteredIncompleteTasks');
        const incompleteTasks = getSignal<ITask[]>(app, 'incompleteTasks');

        selectedPriority.set?.('ALL');

        const filtered = filteredIncompleteTasks();
        const incomplete = incompleteTasks();

        expect(filtered.length).toBe(incomplete.length);
    });

    it('should open and close the task dialog', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const showTaskDialog = getSignal<boolean>(app, 'showTaskDialog');

        getMethod<() => void>(app, 'openTaskDialog')();
        expect(showTaskDialog()).toBeTrue();
        getMethod<() => void>(app, 'closeTaskDialog')();
        expect(showTaskDialog()).toBeFalse();
    });

    /*
    ? This is specific to the test scenario given:
    * When a user adds a task with High priority and then filters by High priority Then
    * only High priority tasks will be visible in the list And the user will see a visual
    * indication that a filter is currently applied: When a user adds a "High" priority task called "Submit report"
    * Then the task appears in the task list And when the user filters by "High" priority, only high priority tasks are visible
    */
    it('should show only High priority tasks when filtered, and show the new High priority task', () =>
    {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const incompleteTasks = getSignal<ITask[]>(app, 'incompleteTasks');
        const filteredIncompleteTasks = getSignal<ITask[]>(app, 'filteredIncompleteTasks');
        const selectedPriority = getSignal<string>(app, 'selectedPriority');
        const newTask: ITask = {
            id: 'submit-report-id',
            title: 'Submit report',
            description: 'Submit the quarterly report',
            priority: EPriorityType.HIGH,
            isCompleted: false
        };

        getMethod<(task: ITask) => void>(app, 'addTask')(newTask);
        expect(incompleteTasks().some(t => t.id === 'submit-report-id')).toBeTrue();

        if (selectedPriority.set) selectedPriority.set(EPriorityType.HIGH);

        const filtered = filteredIncompleteTasks();

        expect(filtered.length).toBeGreaterThan(0);
        expect(filtered.every(t => t.priority === EPriorityType.HIGH)).toBeTrue();
        expect(filtered.some(t => t.id === 'submit-report-id')).toBeTrue();
    });
});
