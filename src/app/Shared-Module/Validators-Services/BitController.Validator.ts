import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
interface MyFormValues {
  name: FormControl<string | null>;  // Can be null
  age: FormControl<number | null>;   // Can be null
}

export class bitController {
  // private getEvalFormCommentParams(): Record<string, Partial<EvaluationBit> | null> {
  // //  Changed Obj for API to Accept (Sheraz Changes)
  //   let OriginalValue =  this.EvalFormParams as ReviewApplicationParams;
  //   let ChangedValue = {} as  Record<string, Partial<EvaluationBit> | null>;
  //   for (const [EvalFormKey, { comment, ...checkBoxProperties }] of (Object.entries(OriginalValue) as [string, EvaluationBit][])) {
  //     ChangedValue[EvalFormKey] = comment ? { comment, ...checkBoxProperties } : null;
  //   }
  //   return ChangedValue;
  // }
// Create a FormGroup with FormControls allowing null

  constructor(){

    const myFormGroup = new FormGroup<MyFormValues>({
      name: new FormControl<string | null>(null), // Initial value can be null
      age: new FormControl<number | null>(null)    // Initial value can be null
  });
  let params:Record<user,Partial<userParams>|undefined> = {
    admin: {
      name: "Mufaddal",
      age: 20,
      token: "rwheijfwo 32u23j032jr032r09 j32j"
    },
    lead: undefined,
    user: undefined
  }
    this.getFilteredParamsByKey(params,'name');
    this.UpdateValueDynamic(new FormGroup({name:new FormControl<string>(''),age:new FormControl<number>(0)}),'name');

    this.UpdateSingle_MultipleFormValueAndValidity<MyFormValues>(new FormGroup({name:new FormControl<string>(''),age:new FormControl<number>(0)}),'age');

    this.UpdateSingle_MultipleFormValueAndValidityDynamic(new FormGroup({name:new FormControl<string>(''),age:new FormControl<number>(0)}),'name');

    this.UpdateSingle_MultipleFormValueAndValidityDynamic<MyFormValues>(myFormGroup,'name');
  }

  private getFilteredParamsByKey<key extends Partial<string>, Bit extends Required<Record<string, any>>>(originalValue: Record<key, Bit | null | undefined>,bitToCheck: keyof Bit): Record<key, Bit | null | undefined> {
    // const changedValue: Record<string, Bit | null> = {};
    const changedValue = {} as Record<key, Bit | null | undefined>;
    for (const FormKey in originalValue) {
      if (originalValue.hasOwnProperty(FormKey)) {
        const Bit = originalValue[FormKey] as Bit | null;
        if (Bit && Bit[bitToCheck] !== null && Bit && Bit[bitToCheck] !== '' && Bit && Bit[bitToCheck] !== undefined) {
          changedValue[FormKey] = { ...Bit };
        } else {
          changedValue[FormKey] = null;
        }
      }
    }
    return changedValue;
  }



  UpdateValue<T extends Record<keyof T,FormControl<any>>>(form:FormGroup<T>,controlName:keyof T):void{
    const controlNameString: string = String(controlName);
    this.UpdateSingle_MultipleFormValueAndValidity<T>(form,controlNameString);
  }

  UpdateSingle_MultipleFormValueAndValidity<T extends Record<keyof T, FormControl<any>>>(form: FormGroup<T>,updateValue:string|string[]): void {
    if (Array.isArray(updateValue)) {
      for (const key of updateValue) {
        const control = form.get(key);
        if (control instanceof FormControl) {
          console.log("Updated From updateFormValueAndValidity : ",key)
          control.updateValueAndValidity({ onlySelf: true });
        }
      }
    } else {
      const control = form.get(updateValue);
      if (control instanceof FormControl) {
        console.log("Updated From updateFormValueAndValidity : ",updateValue)
        control.updateValueAndValidity({ onlySelf: true });
      }
    }
  }



  UpdateValueDynamic<T extends Record<keyof T,FormControl<any>>>(form:FormGroup<T>,controlName:keyof T):void{
    // const controlNameString: string = String(controlName);
    this.UpdateSingle_MultipleFormValueAndValidityDynamic<T>(form,controlName);
  }

  UpdateSingle_MultipleFormValueAndValidityDynamic<T extends Record<keyof T,T[keyof T]>>(form: FormGroup<T>,updateValue: (keyof T | (keyof T)[])): void {
    if (Array.isArray(updateValue)) {
      for (const key of updateValue) {
        const control = form.get(String(key));
        if (control instanceof FormControl) {
          console.log("Updated From updateFormValueAndValidity : ",key)
          control.updateValueAndValidity({ onlySelf: true });
        }
      }
    } else {
      const control = form.get(String(updateValue));
      if (control instanceof FormControl) {
        console.log("Updated From updateFormValueAndValidity : ",updateValue)
        control.updateValueAndValidity({ onlySelf: true });
      }
    }
  }
}

type user = 'admin'| 'lead'|'user';
interface userParams {
  name:string;
  age:number;
  token:string;
}

// for (const evalFormKey in originalValue) {
//   if (originalValue.hasOwnProperty(evalFormKey)) {
//     const evaluation = originalValue[evalFormKey];
//     if (evaluation) {
//       changedValue[evalFormKey] = {
//            ...evaluation
//       };
//     } else {
//       changedValue[evalFormKey] = null;
//     }
//   }
// }
