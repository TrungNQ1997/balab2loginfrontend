import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {

  transform(value: string): string {
    const phoneNumberPattern = /(\d{0,3})(\d{0,3})(\d{0,4})/;

    if (!value) {
      return '';
    }

    const formattedNumber = value.replace(phoneNumberPattern, '$1 $2 $3');
    return formattedNumber;
  }

}
