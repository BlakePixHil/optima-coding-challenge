import { FormControl } from '@angular/forms';

import { EPriorityType } from '../../typings/priority.enum';

export interface ITaskFormGroup
{
    title: FormControl<string>;
    description: FormControl<string>;
    priority: FormControl<EPriorityType>;
}