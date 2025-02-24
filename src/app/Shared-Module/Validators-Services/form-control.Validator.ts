import { Injectable } from "@angular/core";
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export class formController {
  constructor(private fb: FormBuilder) { }
  private async convertModelToFormControls<ModelInterface extends Record<string, any>>(
    model: ModelInterface,
    customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }
  ): Promise<{ [key in keyof ModelInterface]: AbstractControl }> {
    return new Promise<{ [key in keyof ModelInterface]: AbstractControl }>((resolve, reject) => {
      const controls: Partial<{ [key in keyof ModelInterface]: AbstractControl }> = {};

      try {
        for (const key in model) {
          if (Object.prototype.hasOwnProperty.call(model, key)) {
            const value = model[key];
            const validators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || [];
            let control: AbstractControl;

            if (typeof value === 'string' && key.toLowerCase().includes('date')) {
              control = new FormControl<Date | null>(value ? new Date(value) : null, validators);
            } else if (Array.isArray(value)) {
              control = new FormArray(
                value.map((item: any) => this.createControl(item, validators)),
                validators
              );
            } else {
              control = this.createControl(value, validators);
            }

            controls[key as keyof ModelInterface] = control;
          }
        }

        resolve(controls as { [key in keyof ModelInterface]: AbstractControl });
      } catch (e) {
        console.error('Error converting model to form controls:', e);
        reject(e);
      }
    });
  }

  private createControl<T>(value: T, validators: ValidatorFn | ValidatorFn[]): FormControl<T | null> {
    if (typeof value === 'string' && value.toLowerCase().includes('date')) {
      // Convert string to Date if the string contains 'date'
      return new FormControl<T | null>(value ? new Date(value) as T : null, validators);
    }

    // Handle different value types
    switch (typeof value) {
      case 'string':
        return new FormControl<T | null>(value as T, validators);
      case 'number':
        return new FormControl<T | null>(value as T, validators);
      case 'boolean':
        return new FormControl<T | null>(value as T, validators);
      default:
        // Handle other types with 'any' fallback
        return new FormControl<any>(value, validators);
    }
  }



  async createFormGroup<ModelInterface extends Record<string, any>>(
    model: ModelInterface,
    customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }
  ): Promise<FormGroup> {
    const controls = await this.convertModelToFormControls<ModelInterface>(model, customValidators);
    return this.fb.group(controls);
  }

  private atLeastOneSelectedValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const hasAtLeastOneSelected = (formArray as FormArray).controls.some(group => group.get('isSelectedForPayment')?.value);
      return hasAtLeastOneSelected ? null : { atLeastOneSelected: true };
    };
  }



  private twoLinesEightDigitsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control) return null;
      const value: string = control.value || '';
      const lines = value.split(/\n/).map(line => line.trim());
      const formattedString = Array.from(new Set(lines));
      if (formattedString.length > 30) {
        return { invalidStrLenForITSID: true };
      }
      if (lines.length < 2) {
        return { requiredMoreThanOne: true };
      }
      const hasInvalidLine = lines.some(line => line === '' || !/^[0-9]{8}$/.test(line));
      if (hasInvalidLine) {
        return { invalidFormat: true };
      }

      return null;
    };
  }

  protected onInputChange(control: AbstractControl<string>): void {
    if (!control) return;
    let value: string = control.value || '';
    let lines = value.split(/\n/).map(line => line.trim());
    lines = lines.map(line => line.match(/.{1,8}/g)?.join('\n') || line.trim());
    const formattedLines = lines.join('\n');
    if (formattedLines !== value) {
      control.setValue(formattedLines, { emitEvent: false });
      control.updateValueAndValidity();
    }
  }


  private twoLinesEightDigitsFixedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control) return null;
      const value: string = control.value || '';
      // const lines: Array<string> = value.split('\n').map((line) => (line ? line.trim() : ''));   //OLD
      const lines = value.split(/\s+/).map(line => line.trim()).filter(line => line);
      const formattedString = Array.from(new Set(lines));
      if (formattedString.length > 30) {
        // control.setValue('');
        return { invalidStrLenForITSID: true };
      }
      // line.trim() === '' ||
      const allLinesEmptyOrWhitespace = lines.some((line) => line === undefined || line === null || line.trim() === '');
      const isInvalid = lines.every((line) =>  /^[0-9]{8}$/.test(line.trim()));
      const hasInvalidLine = lines.some(line => (line === undefined || line === null || line.trim() === '') &&  !/^[0-9]{8}$/.test(line));
      if ( lines.length < 2 ||  (lines.length === 2 && lines[1].trim().length !== 8)) {
        if (!isInvalid) {
        return { invalidFormat: true }; // Invalid format in any line
        }
        return { requiredMoreThanOne: true }; // Not enough lines
      } else if (allLinesEmptyOrWhitespace) {
        return { requiredMoreThanOne: true }; // No valid lines present
      } else if (hasInvalidLine) {
        return { invalidFormat: true }; // Invalid format in any line
      }
      // No errors
      return null;
    };
  }

protected onInputChangeFixed(control: AbstractControl<string>): void {
    if (!control) return;
    const value: string = control.value || '';
    // Split, format, and set the value as required
    const lines = value.split(/\s+/).map(line => line.trim()).filter(line => line);
    const formattedString = Array.from(new Set(lines));
    const formattedLines = formattedString.map(line => line.match(/.{1,8}/g)?.join('\n')).join('\n');
    // Set the formatted value back to the control without emitting an event
    if (formattedLines !== value) {
      control.setValue(formattedLines, { emitEvent: false });
      control.updateValueAndValidity(); // Manually trigger validation after setting the value
    }
  }

}
