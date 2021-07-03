import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment-timezone';

@Pipe({
  name: "momentJalaali"
})
export class MomentJalaaliPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    console.log(value,args)
    let today = new Date(value).toLocaleDateString('fa-IR');
    return today
   
  }
}