import { Pipe, PipeTransform } from '@angular/core';
import { Time } from 'src/app/core/services/time.service';


@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: Time | null): string {
    if (value === null) {
      return '--:--:--';
    }
    const hours = value.hours.toString().padStart(2, '0');
    const minutes = value.minutes.toString().padStart(2, '0');
    const seconds = value.seconds.toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
