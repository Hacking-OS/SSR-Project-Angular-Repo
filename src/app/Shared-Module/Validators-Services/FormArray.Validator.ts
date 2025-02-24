import { FormArray, FormGroup, ValidatorFn, AbstractControl, FormControl, FormBuilder } from "@angular/forms";

export class FormArrayPopulateService {
  constructor(private fb: FormBuilder) { }
  private async addItemsToFormArray<Params extends Record<string, any>>(gridListControl: FormArray<FormGroup<any>>, itemList: Params[], customValidators?: { [key in keyof Params]?: ValidatorFn | ValidatorFn[] }): Promise<void> {
    if (!itemList || itemList.length === 0) return;
    try {
      if (!(gridListControl instanceof FormArray))  throw new Error('gridListControl must be a FormArray');
      const promises = itemList.map(async item => await this.createFormGroup<Params>(item, customValidators).then(group => gridListControl.push(group)).catch(error => {
        console.error(`Error adding form group for item ${JSON.stringify(error)}:`, error);
        throw error; // Rethrow the error to be caught by Promise.all
      })
      );
      await Promise.all(promises);
    } catch (err) {
      console.error(`Error adding form group for item ${JSON.stringify(err)}:`, err);
      throw err;
    }
  }

  private createFormGroup<ModelInterface extends Record<string, any>>(
    model: ModelInterface,
    customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }
  ): Promise<FormGroup<any>> {
    return new Promise<FormGroup<any>>((resolve, reject) => {
      const group: Partial<{ [key in keyof ModelInterface]: AbstractControl<any> }> = {};
      try {
        Object.keys(model).forEach(key => {
          const value = model[key] as any;
          let control: AbstractControl<any>;
          const baseValidators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || [];

          if (key.toLowerCase().includes('date') || key === 'date') {
            control = new FormControl<Date | null>(value ? new Date(value) : null, baseValidators);
          } else {
            switch (typeof value) {
              case 'string':
                control = new FormControl<string | null>(value ?? null, baseValidators);
                break;
              case 'number':
                control = new FormControl<number | null>(value ?? null, baseValidators);
                break;
              case 'boolean':
                control = new FormControl<boolean | null>(value ?? null, baseValidators);
                break;
              default:
                control = new FormControl<any>(value, baseValidators);
                break;
            }
          }
          group[key as keyof ModelInterface] = control;
        });

        resolve(this.fb.group<any>(group as any));
      } catch (e) {
        console.error('Error creating FormGroup:', e);
        reject(e);
      }
    });
  }
}










// OLD Code
// --------------------------------------------------------------------------------------------------
  // private createFormGroup<ModelInterface extends Record<string, any>>(
  //   model: ModelInterface,
  //   customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }
  // ): Promise<FormGroup<any>> {
  //   return new Promise<FormGroup<any>>((resolve, reject) => {
  //     const group: Partial<{ [key in keyof ModelInterface]: AbstractControl<any> }> = {};
  //     try {
  //       Object.keys(model).forEach(key => {
  //         const value = model[key] as any;
  //         let control: AbstractControl<any>;
  //         const baseValidators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || [];

  //         if (key.toLowerCase().includes('date') || key === 'date') {
  //           control = new FormControl<Date | null>(value ? new Date(value) : null, baseValidators);
  //         } else {
  //           switch (typeof value) {
  //             case 'string':
  //               control = new FormControl<string | null>(value ?? null, baseValidators);
  //               break;
  //             case 'number':
  //               control = new FormControl<number | null>(value ?? null, baseValidators);
  //               break;
  //             case 'boolean':
  //               control = new FormControl<boolean | null>(value ?? null, baseValidators);
  //               break;
  //             default:
  //               control = new FormControl<any>(value, baseValidators);
  //               break;
  //           }
  //         }
  //         group[key as keyof ModelInterface] = control;
  //       });

  //       resolve(this.fb.group<any>(group as any));
  //     } catch (e) {
  //       console.error('Error creating FormGroup:', e);
  //       reject(e);
  //     }
  //   });
  // }


    // OLD
  // private async addItemsToFormArray<Params extends Record<string, any>>(gridListControl: FormArray<FormGroup<any>>, itemList: Params[], customValidators?: { [key in keyof Params]?: ValidatorFn | ValidatorFn[] }): Promise<void> {
  //   if (!itemList || itemList.length === 0) return;
  //   try {
  //     const promises = itemList.map(async item => await this.createFormGroup<Params>(item, customValidators).then(group => gridListControl.push(group)).catch(error => {
  //       console.error('Error adding form group:', error);
  //       throw error; // Rethrow the error to be caught by Promise.all
  //     })
  //     );
  //     await Promise.all(promises);
  //   } catch (err) {
  //     console.error('Error processing item list:', err);
  //     throw err;
  //   }
  // }

  // private createFormGroup<ModelInterface extends Record<string, any>>(model: ModelInterface, customValidators?: { [key in keyof ModelInterface]?: ValidatorFn | ValidatorFn[] }): Promise<FormGroup<any>> {
  //   return new Promise<FormGroup<any>>((resolve, reject) => {
  //     const group: Partial<{ [key in keyof ModelInterface]: AbstractControl<any> }> = {};
  //     try {
  //       Object.keys(model).forEach(key => {
  //         const value = model[key] as any;
  //         let control: AbstractControl<any>;
  //         const baseValidators: ValidatorFn | ValidatorFn[] = customValidators?.[key] || [];
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
