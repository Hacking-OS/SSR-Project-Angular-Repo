import { Injectable } from "@angular/core";
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn, Validators } from "@angular/forms";
// @Injectable()
// @Injectable({ providedIn: 'root' })
// Define the type for form controls
type FormControlType<T> = { [K in keyof T]: FormControl<T[K] | null> };
// Define the type for the form group
type FormGroupType<T> = FormGroup<FormControlType<T>>;

// type FormGroupAndFormControlType<T> = { [K in keyof T]: FormControl<T[K] | null> } & FormGroup<Record<keyof T, FormControl<T[keyof T] | null>>>;

export class FormValidatorCheckService {
  constructor(private fb: FormBuilder) { }
  isFormValueHasValidation<T = any>(controlProperty: AbstractControl, validators: ValidatorFn[]): boolean {
    const hasValidators = (control: AbstractControl, validators: any[]): boolean => !!control?.validator && validators.some(validator => control.validator?.({} as AbstractControl)?.[validator.name]);
    return hasValidators(controlProperty, validators);
  }

  isFormValueHasError<T = any>(controlProperty: AbstractControl, validators: ValidatorFn[]): boolean {
    const hasError = (control: AbstractControl, validators: any[]): boolean => !!control?.errors && validators.some(validator => control?.errors?.[validator.name]);
    return hasError(controlProperty, validators);
  }

  isFormValueHasErrorOn(controlProperty: AbstractControl, validator: ValidatorFn | ValidatorFn[]): boolean {
    const hasValidator = (validator: any) => !!controlProperty?.validator?.({} as AbstractControl)?.[validator.name];
    return hasValidator(validator);
  }

  // NEW After Changes
  private async addItemsToFormArray<Params extends Record<string, any>>(gridListControl: FormArray<FormGroup<any>>, itemList: Params[], customValidators?: { [key in keyof Params]?: ValidatorFn | ValidatorFn[] }): Promise<void> {
    if (!itemList || itemList.length === 0) return;
    try {
      // : FormGroup<FormControlType<Params>>
      const promises = itemList.map(async item => await this.createFormGroup<Params>(item, customValidators).then(group => gridListControl.push(group)).catch((error: Error) => {
        console.error('Error adding form group:', error);
        throw error; // Rethrow the error to be caught by Promise.all
      })
      );
      await Promise.all(promises);
    } catch (err) {
      console.error('Error processing item list:', err);
      throw err;
    }
  }

  private async createFormGroup<ModelInterface extends Record<string, any>>(
    model: ModelInterface,
    customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }
  ): Promise<FormGroup<FormControlType<ModelInterface>>> {
    return new Promise<FormGroup<FormControlType<ModelInterface>>>(async (resolve, reject) => {
      try {
        // Create the form group
        const group: FormControlType<ModelInterface> = {} as FormControlType<ModelInterface>;

        Object.keys(model).forEach(key => {
          const value = model[key as keyof ModelInterface];
          const baseValidators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || [];
          group[key as keyof ModelInterface] = this.createControl<ModelInterface[keyof ModelInterface]>(value, key as string, baseValidators) as FormControl<ModelInterface[keyof ModelInterface] | null>;
        });

        // Return the FormGroup with the correct type
        resolve(this.fb.group<FormControlType<ModelInterface>>(group) as FormGroup | FormGroupType<ModelInterface>);
      } catch (err) {
        reject(err);
      }
    });
  }

  private createControl<T>(value: T | null, key: string, customValidators?: ValidatorFn | ValidatorFn[]): FormControl<T | any> {
    // Check if the key indicates a date field
    if (typeof key === 'string' && key.toLowerCase().includes('date') || key === 'date') {
      return new FormControl<Date | null>(value ? new Date(value as string) : null, customValidators) as FormControl<Date | null>;
    }
    // Determine the type of value and create the appropriate FormControl
    switch (typeof value) {
      case 'string':
        return new FormControl<T | null>(value as T | null, customValidators);
      case 'number':
        return new FormControl<T | null>(value as T | null, customValidators);
      case 'boolean':
        return new FormControl<T | null>(value as T | null, customValidators);
      default:
        return new FormControl<T | null>(value as T | null, customValidators);
    }
  }

  protected async convertModelToFormControls<T>(model: T): Promise<{ [K in keyof T]: FormControl<T[K] | null> }> {
    const formControls = {} as { [K in keyof T]: FormControl<T[K] | null> };
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        formControls[key as keyof T] = new FormControl<T[keyof T] | null>(model[key as keyof T]);
      }
    }
    return formControls;
  }


  protected async convertModelToFormControlsWithValidators<T>(model: T, validators?: { [K in keyof T]?: Validators[] }): Promise<{ [K in keyof T]: FormControl<T[K] | null> }> {
    const formControls = {} as { [K in keyof T]: FormControl<T[K] | null> };

    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        formControls[key as keyof T] = new FormControl<T[keyof T] | null>(
          model[key as keyof T],
          {
            validators: validators ? validators[key as keyof T] : []
          } as AbstractControlOptions
        );
      }
    }
    return formControls;
  }

  // async function convertModelToFormControls<T>(model: T): Promise<{ [K in keyof T]: FormControl<T[K]> }> {
  //   const formControls = {} as { [K in keyof T]: FormControl<T[K]> };

  //   for (const key in model) {
  //     if (model.hasOwnProperty(key)) {
  //       formControls[key] = new FormControl<T[typeof key]>(model[key as keyof T]);
  //     }
  //   }

  //   return formControls;
  // }


  // OLD
  // protected closeFormModalPopup(form: NgForm, resetFormGroupParams: FormGroup, isPopupDefault?: boolean, defaultValue?: FormGroup<any>): void {
  //   //** It is used to get (ALL*) Controls values and filter to get formArray Control instance only** */
  //   //** And clear them by making them to default [] value ** */
  //   const formControlArray = Object.values(resetFormGroupParams.controls).filter(control => control instanceof FormArray) as FormArray<FormGroup<any>>[];
  //   formControlArray.forEach(formArray => formArray.clear({ emitEvent: false }));//**  Clear all controls within each FormArray found.** */
  //   //**  Resetting to default value else clear form group controls to default state.** */
  //   if (isPopupDefault && defaultValue) {
  //     //** Reset the form group and form control without emitting events or setting default values** */
  //     form.resetForm(defaultValue);
  //   } else {
  //     form.resetForm();
  //   }
  //   resetFormGroupParams.reset({ onlySelf: true, emitEvent: false });
  //   this.markAllAsUntouched(resetFormGroupParams);     //**  Mark all form controls as untouched to clear validation states** */
  // }



  // NEW After Changes
  protected closeFormModalPopup(form: NgForm, resetFormGroupParams: FormGroup, isPopupDefault?: boolean, defaultValue?: FormGroup<any>): void {
    //** It is used to get (ALL*) Controls values and filter to get formArray Control instance only** */
    //** And clear them by making them to default [] value ** */
    const formControlArray = Object.values(resetFormGroupParams.controls).filter(control => control instanceof FormArray) as FormArray<FormGroup<any>>[];
    formControlArray.forEach(formArray => formArray.clear({ emitEvent: false }));//**  Clear all controls within each FormArray found.** */
    //**  Resetting to default value else clear form group controls to default state.** */
    if (isPopupDefault && defaultValue) {
      //** Reset the form group and form control without emitting events or setting default values** */
      form.resetForm(defaultValue);
    } else {
      form.resetForm();
    }
    resetFormGroupParams.reset({ onlySelf: true, emitEvent: false });
    this.markAllAsUntouched(resetFormGroupParams);     //**  Mark all form controls as untouched to clear validation states** */
  }

  private markAllAsUntouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key)
      if (control instanceof FormControl) {
        control.markAsUntouched()
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsUntouched(control);
      }
    })
  }

  test() {
    let params: user = {
      name: "",
      age: 0,
      email: "",
      auth: false
    };
    this.convertModelToFormControls<user>(params).then((haveForm) => {
      // this.createFormGroup<user>(haveForm)
      this.createFormGroup<user>(params)
    })
    this.convertModelToFormControls<user>(params).then((haveForm) => {
      // this.addItemsToFormArray<user>()
    });
  }
}

interface user {
  name: string;
  age: number;
  email: string;
  auth: boolean;
}

class user1 {
  name!: string;
  age!: number;
  email!: string;
  auth!: boolean;
}











// private async addItemsToFormArray<Form, Params extends Record<string, any>>(gridListControl: FormArray<FormGroup<Form | any>>, itemList: Params[], customValidators?: { [key in keyof Params]?: ValidatorFn | ValidatorFn[] }): Promise<void> {
//   if (!itemList || itemList.length === 0) return;
//   try {
//     const promises = itemList.map(async item => await this.createFormGroup<Params>(item, customValidators).then(group => gridListControl.push(group)).catch(error => {
//           console.error('Error adding form group:', error);
//           throw error; // Rethrow the error to be caught by Promise.all
//         })
//     );
//     await Promise.all(promises);
//   } catch (err) {
//     console.error('Error processing item list:', err);
//     throw err;
//   }
// }
// gridListControl.push(formGroup);
// try {
//   return await Promise.all(promises)
// } finally {
//   return resolve();
// }
// itemList.map(async item => {
//   try {
//     await this.createFormGroup<Params>(item,customValidators).then(group => gridListControl.push(group));
//     resolve();
//   } catch (error) {
//     console.error('Error adding form group:', error);
//     reject();
//   }
// });
// private createFormGroup<ModelInterface extends Record<string, any>>(model: ModelInterface, customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }
// ): Promise<FormGroup<any>> {
//   return new Promise<FormGroup<any>>((resolve, reject) => {
//     const group: Partial<{ [key in keyof ModelInterface]: AbstractControl<any> }> = {};
//     try {
//       Object.keys(model).forEach(key => {
//         const value = model[key] as any;
//         // const value = (model)[key] as any;
//         let control: AbstractControl<any>;
//         // Determine base validators based on type
//         const baseValidators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || Validators.required;
//         if (key.toLowerCase().includes('date') || key === 'date') {
//           control = new FormControl<Date | null>(value ? new Date(value) : null, baseValidators);
//         } else {
//           switch (typeof value) {
//             case 'string':
//               control = new FormControl<string>(value, baseValidators);
//               break;
//             case 'number':
//               control = new FormControl<number>(value, baseValidators);
//               break;
//             case 'boolean':
//               control = new FormControl<boolean>(value, baseValidators);
//               break;
//             default:
//               control = new FormControl<any>(value, baseValidators);
//               break;
//           }
//         }
//         group[key as keyof ModelInterface] = control;
//       });
//       // return this.fb.group<any>(group as any) as FormGroup<any>;
//       resolve(this.fb.group<any>(group as any));
//     } catch (e) {
//       reject();
//     };
//   });
// }
// const value = (model)[key] as any;
// const value = (model as any)[key];
// Determine base validators based on type
// let baseValidators: ValidatorFn | ValidatorFn[] = Validators.required;
// if (customValidators && customValidators[key as keyof ModelInterface]) {
//   baseValidators = customValidators[key as keyof ModelInterface];
// }
// const baseValidators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || Validators.required;

