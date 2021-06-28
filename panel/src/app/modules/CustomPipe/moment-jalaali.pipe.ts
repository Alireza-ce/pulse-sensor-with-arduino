import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment-timezone';

@Pipe({
  name: "momentJalaali"
})
export class MomentJalaaliPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    console.log(value,args)
    return moment.tz(value, 'Asia/Tehran').format(args)
   
  }
}