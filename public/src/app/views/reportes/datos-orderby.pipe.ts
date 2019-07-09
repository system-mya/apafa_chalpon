import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'SortBy' })
export class SortByPipe implements PipeTransform {

    transform(values: Array<string>, args?: string): any {

        if(args==='ASC')
          values = values.sort();
          else
          values = values.sort().reverse();
          
          return values;
        }
}