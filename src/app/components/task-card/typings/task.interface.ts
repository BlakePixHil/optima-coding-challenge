import { EPriorityType } from '../../typings/priority.enum';

export interface ITask
{
    id: string;
    title: string;
    description: string;
    priority: EPriorityType;
    isCompleted: boolean;
}