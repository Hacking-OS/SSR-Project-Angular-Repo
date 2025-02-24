import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
    selector: '[AppZeroNotAllowedFormat]',
    standalone: false
})
export class AppZeroNotAllowedDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('blur') onBlur() {
    let ElementValue = (<string>this.el.nativeElement.value);
    let FormatValue = ElementValue.replace(/,/g, '').trim();
  console.log("Format @############: ",FormatValue);

    if (FormatValue === '0' || FormatValue === '0.00') {
      this.control.control?.setValue(null);
    } else if (FormatValue && FormatValue.split('').every((char) => char === '0')) {
      this.control.control?.setValue(null);
    } else {
      this.control.control?.setValue(FormatValue);
    }
  }
}
