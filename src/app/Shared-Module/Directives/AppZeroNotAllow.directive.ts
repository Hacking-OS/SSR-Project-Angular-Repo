import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[AppZeroNotAllowed]',
    providers: [{ provide: NG_VALIDATORS, useExisting: AppZeroNotAllowedDirective, multi: true }],
    standalone: false
})
export class AppZeroNotAllowedDirective implements Validator  {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if (control.value.includes(',')) {
        const replacedValue = (<string>control.value).replace(/,/g, '');
        const isAllZeros = replacedValue.split('').every((char) => char === '0');
        if (isAllZeros) {
          return { isAllZeros: true };
        }
      } else {
        const replacedValue: string = (<string>control.value);
        const isAllZeros = replacedValue.split('').every((char) => char === '0');
        if (isAllZeros) {
          return { isAllZeros: true };
        }
      }
      return null;
    }
  }
}
