

import { Pipe, PipeTransform } from '@angular/core';
/*istanbul ignore next*/
@Pipe({name: 'translate'})
export class MockTranslatePipe implements PipeTransform {
    transform(value: number): number {
        return value;
    }
}
