import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { asyncScheduler, observeOn } from 'rxjs';

@Component({
    selector: 'app-break-up-form',
    templateUrl: './break-up-form.component.html',
    standalone: false
})
export class BreakUpAmountFormComponent {
  reScheduleForm: FormGroup<InstallmentDetailsFormControl>;
  form:FormGroup;
  repaymentMonthsOptions: number[] = Array.from({ length: 99 }, (_, index) => index + 1);
  QHTotalAmount: number = 10000;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Initialize the main form group
    this.reScheduleForm = this.fb.group<InstallmentDetailsFormControl>({
      installmentDetailsArray:new FormArray<FormGroup<InstallmentDetailsForm>>([])
    }) as FormGroup<InstallmentDetailsFormControl>;

    this.form = this.fb.group({
      outerFormArray: this.fb.array([     // First (outer) FormArray
        this.fb.group({
          innerFormArray: this.fb.array([ // Nested (inner) FormArray
            this.fb.group({
              name: [''],                 // Example control
              age: ['']                   // Example control
            }),
          ])
        })
      ])
    });

  }

  ngOnInit() {
    this.addInstallmentDetails();
  }

  getVariableInstallments(index: number): FormArray<FormGroup<InstallmentFormGroup>> {
    return (this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>).at(index).get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;
  }

  get variable_Installments(): Array<FormGroup<InstallmentFormGroup>> {
    const installmentDetailsArray = this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>;
    if (installmentDetailsArray.length === 0) {
      return [];
    }
    // Gather all FormGroup instances from each variable_Installments FormArray in installmentDetails
    const allVariableInstallments = installmentDetailsArray.controls.flatMap((installmentDetails) => {
      const variableInstallments = installmentDetails.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;
      return variableInstallments ? variableInstallments.controls : [];
    });

    return allVariableInstallments;
  }


  get totalInputAmount(): number {
    const installmentDetailsArray = this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>;

    if (installmentDetailsArray.length === 0) {
      return 0;
    }

    const total = installmentDetailsArray.controls.reduce((sum, installmentDetails) => {
      const amountControl = installmentDetails.get('amount') as FormControl<number | null>;
      const amount = amountControl ? amountControl.value : 0;
      return sum + (amount || 0);
    }, 0);
    return total;
  }

  get installmentDetailsArray(): FormArray<FormGroup<InstallmentDetailsForm>> {
    return this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>;
  }

  addInstallmentDetails() {
    const installmentDetailsArray = this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>;
    installmentDetailsArray.push(this.createInstallmentDetails());
    const variableInstallments = installmentDetailsArray.at(0).get('variable_Installments') as FormArray;

    if (variableInstallments instanceof FormArray) {
      console.log(variableInstallments.controls);  // This will now return the array of controls
    }
    this.initializeInstallmentSubscriptions();
  }

  createInstallmentDetails(): FormGroup<InstallmentDetailsForm> {
    return new FormGroup<InstallmentDetailsForm>({
      installmentType: new FormControl<ChooseInstallmentType | null>('equal', Validators.required),
      amount: new FormControl<number | null>(null, [Validators.required, Validators.max(this.QHTotalAmount)]),
      repaymentMonths: new FormControl<number | null>(null, Validators.required),
      reminderDate: new FormControl<Date | null>(null, Validators.required),
      // variable_Installments: this.fb.array<FormGroup<InstallmentFormGroup>>([this.createEqualInstallment()]),
      variable_Installments: new FormArray<FormGroup<InstallmentFormGroup>>([this.createEqualInstallment()]) as FormArray<FormGroup<InstallmentFormGroup>>,
    }) as FormGroup<InstallmentDetailsForm>;
  }


  createEqualInstallment(values?: { amount: number, months: number, totalAmount?:number, isDisabledAllow?:boolean}): FormGroup<InstallmentFormGroup> {
    return new FormGroup<InstallmentFormGroup>({
      installmentAmount: new FormControl<number | null>({value: values?.amount ?? null , disabled: values?.isDisabledAllow ?? false}, [Validators.required, Validators.max(this.QHTotalAmount)]),
      MonthsForRepayment: new FormControl<number | null>({value: values?.months ?? null , disabled: values?.isDisabledAllow ?? false},[Validators.required]),
      totalAmount: new FormControl<number | null>({value: values?.totalAmount ?? null , disabled: true},[Validators.required]),
    }) as FormGroup<InstallmentFormGroup>;
  }

  removeAt(index :number) {
    const installmentDetailsArray = this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>;
    installmentDetailsArray.removeAt(index);
  }


 totalAmountBreakup:number = 0;
 totalAmountBreakupForTotalRemaining:number = 0;
 totalAmountWithMonthsBreakup:number = 0;
 IsTotalScheduleAmountEqualTo:boolean=false;
 IsTotalAmontEqualTo:boolean=false;

 totalAmount:number[]=[];

 condition1ValuesBackup: number[] = [];
 condition2ValuesBackup: number[] = [];

 condition1ValuesBackupMonths: number[] = [];

invalidAmount:string|null='';
validateTotalQHAmount = () => {
  console.log("Clicked Here And Validaiton is Working");
  if( this.variable_Installments.length > 0 ){
    console.log((this.QHTotalAmount - this.totalInputAmount));
  return  (this.QHTotalAmount - this.totalInputAmount);
  }
 return 0;
};

maxInstallmentAmountValidator(totalAmount: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // .get('variable_Installments')
    const installments = control as FormArray<FormGroup<InstallmentFormGroup>>;
    const totalInstallmentAmount = installments?.controls?.reduce((sum, installment) => {
      return sum + (installment.get('totalAmount')?.value || 0);
    }, 0);
   console.log("value Check in validation : ",totalInstallmentAmount);
   console.log("value Total in validation : ",totalAmount);
    return totalInstallmentAmount === totalAmount ? null : { maxInstallmentExceeded: true };
  };
}

 async observeOnAmount_InstallmentType(index : number): Promise<void> {
  try {

    const installmentDetailsArray = this.installmentDetailsArray.at(index) as FormGroup<InstallmentDetailsForm>;

    if (installmentDetailsArray) {
      installmentDetailsArray.get('amount')!.valueChanges.subscribe((amount) => {
        const installments = installmentDetailsArray.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;

        installments.setValidators(this.maxInstallmentAmountValidator(amount ?? 0));
        installments.updateValueAndValidity();
      });
      // Observe changes on 'installmentType' and 'amount'
        installmentDetailsArray.get('installmentType')!.valueChanges.pipe(observeOn(asyncScheduler)).subscribe(() => {
        const amount = installmentDetailsArray.get('amount')?.value;
        const installments = installmentDetailsArray.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;

        installments.setValidators(this.maxInstallmentAmountValidator(amount ?? 0));
        installments.updateValueAndValidity();
        if(this.validateTotalQHAmount() !== 0){
          this.invalidAmount = 'QH amount is Invalid';
        } else {
          this.invalidAmount = null;
        }
        });

        installmentDetailsArray.get('amount')!.valueChanges.pipe(observeOn(asyncScheduler)).subscribe((amount) => {
          const installments = installmentDetailsArray.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;
          installments.setValidators(this.maxInstallmentAmountValidator(amount ?? 0));
          installments.updateValueAndValidity();
          if(this.validateTotalQHAmount() !== 0){
            this.invalidAmount = 'QH amount is Invalid';
          } else {
            this.invalidAmount = null;
          }
          if(this.validateTotalQHAmount() !== 0){
            this.invalidAmount = 'QH amount is Invalid';
          } else {
            this.invalidAmount = null;
          }
        });
    }

  } catch(e) {
    console.error("Some Value has issue :   ",e);
  }
}


initializeInstallmentSubscriptions() {
const installmentDetailsArray = this.reScheduleForm.get('installmentDetailsArray') as FormArray<FormGroup<InstallmentDetailsForm>>;
installmentDetailsArray.controls.forEach((control, index) => {
    const installmentTypeControl = control.get('installmentType');
    const  amountControl = control.get('amount');

      if(amountControl){
        this.observeOnAmount_InstallmentType(index);
      }

      if (installmentTypeControl) {
      installmentTypeControl.valueChanges.subscribe(async () => {
      await this.getEqualInstallmentIndexUpdate(index);
      await this.observeOnAmount_InstallmentType(index);
      });
      }
   });
}

//abdul haq
calculateInstallments(amount:number, months:number): Record<string,number> {
  const baseInstallment = Math.floor(amount / months / 100) * 100;
  const lastInstallment = amount - (baseInstallment * (months - 1));
  const installments = Array(months - 1).fill(baseInstallment) as string[];
  installments.push(lastInstallment.toString());
  const count:Record<string,number> = {};
  installments.forEach(item => {
      count[item] = (count[item] || 0) + 1;
  });
  return count;
  // return installments;
}

//abdul haq
async getEqualInstallmentIndexUpdate(equalInstallmentIndex: number):Promise<void> {
 try {

  const installmentDetailsArray = this.installmentDetailsArray.at(equalInstallmentIndex) as FormGroup<InstallmentDetailsForm>;
  if(!installmentDetailsArray.controls) return;
  const variable_InstallmentsArray = installmentDetailsArray.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;
  const getAmount = installmentDetailsArray.get('amount')?.value || 0;
  const getTotalMonth = installmentDetailsArray.get('repaymentMonths')?.value || 1;

  let perMonth = parseFloat(String(this.QHTotalAmount / getTotalMonth));
  // let perMonth = parseInt(String(this.QHTotalAmount / getTotalMonth));
  const totalAmountWithMonthsBreakup = parseFloat(String(getAmount / getTotalMonth));
  this.totalAmount = [];

  let AmountBreakUP1 = 0;
  let AmountBreakUP2 = 0;
 console.log('this is the current installment type :   ',installmentDetailsArray.get('installmentType')!.value);

  if (installmentDetailsArray.get('installmentType')!.value === 'equal') {
    variable_InstallmentsArray.clear();
    // ((PerMonth - Math.floor(PerMonth)) != 0) == true
     if (((perMonth - Math.floor(perMonth)) != 0) == true) {
        // if (perMonth % 1 !== 0) {

        AmountBreakUP1 = (Math.round(Math.floor(totalAmountWithMonthsBreakup / 100) * 100));
        AmountBreakUP2 = (((getAmount) -  (AmountBreakUP1) * (getTotalMonth - 1)));
        this.condition1ValuesBackup[equalInstallmentIndex] = AmountBreakUP1;
        this.condition2ValuesBackup[equalInstallmentIndex] = AmountBreakUP2;
        this.condition1ValuesBackupMonths[equalInstallmentIndex] = Number(getTotalMonth - 1);
        //abdulhaq
        var temp = this.calculateInstallments(getAmount,getTotalMonth);
        console.log("calculateInstallments");
        console.log(temp);
        for (const key in temp) {
        if (temp.hasOwnProperty(key)) {
        variable_InstallmentsArray.push(this.createEqualInstallment({
        amount:Number(key),
        months:Number(temp[key]),
        totalAmount:Number(key) * Number(temp[key]),
        isDisabledAllow:true
      }));
        }
        }
//abdulhaq
          // variable_InstallmentsArray.push(this.createEqualInstallment({amount:AmountBreakUP1,months:(getTotalMonth - 1),totalAmount:Number(AmountBreakUP1 * (getTotalMonth - 1)) , isDisabledAllow:true}));
          // variable_InstallmentsArray.push(this.createEqualInstallment({amount:AmountBreakUP2,months:1,totalAmount:Number(AmountBreakUP2 * (1)), isDisabledAllow:true}));

        } else {

        AmountBreakUP1 = totalAmountWithMonthsBreakup;
        AmountBreakUP2 = 0;
        this.condition1ValuesBackup[equalInstallmentIndex] = AmountBreakUP1;
        this.condition2ValuesBackup[equalInstallmentIndex] = AmountBreakUP2;
        this.condition1ValuesBackupMonths[equalInstallmentIndex] = Number(getTotalMonth);
        variable_InstallmentsArray.push(this.createEqualInstallment({amount:AmountBreakUP1,months:getTotalMonth,totalAmount:Number(AmountBreakUP1 * Number(getTotalMonth)),isDisabledAllow:true}));

        }

  } else {

           variable_InstallmentsArray.clear();
            if (this.condition2ValuesBackup[equalInstallmentIndex] === 0) {

              if (this.condition1ValuesBackup[equalInstallmentIndex] !== 0){
                for (let i = 0; i < 3; i++) {
                  if(i == 0){
                    variable_InstallmentsArray.push(this.createEqualInstallment({amount:this.condition1ValuesBackup[equalInstallmentIndex],months:this.condition1ValuesBackupMonths[equalInstallmentIndex],totalAmount:Number(this.condition1ValuesBackup[equalInstallmentIndex]*this.condition1ValuesBackupMonths[equalInstallmentIndex])}));
                  } else {
                    variable_InstallmentsArray.push(this.createEqualInstallment());
                  }
                }
              } else {
                for (let i = 0; i < 3; i++) {
                  variable_InstallmentsArray.push(this.createEqualInstallment());
                }
              }

            } else if (this.condition2ValuesBackup[equalInstallmentIndex] !== 0) {
              variable_InstallmentsArray.push(this.createEqualInstallment({amount:this.condition1ValuesBackup[equalInstallmentIndex],months:Number(this.condition1ValuesBackupMonths[equalInstallmentIndex]),totalAmount:Number(this.condition1ValuesBackup[equalInstallmentIndex] * this.condition1ValuesBackupMonths[equalInstallmentIndex])}));
              variable_InstallmentsArray.push(this.createEqualInstallment({amount:this.condition2ValuesBackup[equalInstallmentIndex],months:1,totalAmount:Number(this.condition2ValuesBackup[equalInstallmentIndex] * 1)}));
              variable_InstallmentsArray.push(this.createEqualInstallment());
            }
  }

  if(this.validateTotalQHAmount() !== 0){
    this.invalidAmount = 'QH amount is Invalid';
  } else {
    this.invalidAmount = null;
  }

 } catch(e) {
  console.error("Some Value has issue :   ",e);
 }
}

updateTotalAmount(index: number): void {
  const installmentDetailsArray = this.installmentDetailsArray.at(index) as FormGroup<InstallmentDetailsForm>;
  const variable_InstallmentsArray = installmentDetailsArray.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;
  variable_InstallmentsArray.controls.forEach((installmentFormGroup) => {
    const installmentAmount = installmentFormGroup.get('installmentAmount')?.value || 0;
    const monthsForRepayment = installmentFormGroup.get('MonthsForRepayment')?.value || 1;
    installmentFormGroup.get('totalAmount')?.patchValue(installmentAmount * monthsForRepayment);
  });
}


getInstallmentTotals(index: number): { totalAmount: number, totalMonths: number } {
  const installmentDetailsArray = this.installmentDetailsArray.at(index) as FormGroup<InstallmentDetailsForm>;
  const variable_InstallmentsArray = installmentDetailsArray.get('variable_Installments') as FormArray<FormGroup<InstallmentFormGroup>>;

  let totalAmount = 0;
  let totalMonths = 0;

  variable_InstallmentsArray.controls.forEach((installmentFormGroup) => {
    const installmentAmount = installmentFormGroup.get('installmentAmount')?.value || 0;
    const monthsForRepayment = installmentFormGroup.get('MonthsForRepayment')?.value || 0;

    totalAmount += (Number(installmentAmount) * Number(monthsForRepayment));
    totalMonths += Number(monthsForRepayment);
  });

  return { totalAmount, totalMonths };
}

totalAmountsArray: number[] = [];
totalMonthsArray: number[] = [];
// Method to update totals for all indexes
updateInstallmentTotals(): void {
  this.totalAmountsArray = this.installmentDetailsArray.controls.map((_, index) => this.getInstallmentTotals(index).totalAmount);
  this.totalMonthsArray = this.installmentDetailsArray.controls.map((_, index) => this.getInstallmentTotals(index).totalMonths);
}

  onSubmit(): void {
    const installmentDetailsArray = this.installmentDetailsArray as FormArray<FormGroup<InstallmentDetailsForm>>;
    console.log(installmentDetailsArray);
    console.log(installmentDetailsArray.getRawValue());
    // console.log(this.variable_Installments);
    if (this.reScheduleForm.valid) {
      console.log(this.reScheduleForm);
      // Handle form submission, e.g., send to API
    } else {
      this.reScheduleForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
    }
  }
}

type ChooseInstallmentType = "equal" | "variable";
interface InstallmentFormGroup {
  MonthsForRepayment: FormControl<number | null>;
  installmentAmount: FormControl<number | null>;
  totalAmount: FormControl<number | null>;
}
interface InstallmentDetailsForm {
  installmentType: FormControl<ChooseInstallmentType | null>;
  amount: FormControl<number | null>;
  repaymentMonths: FormControl<number | null>;
  reminderDate: FormControl<Date | null>;
  variable_Installments: FormArray<FormGroup<InstallmentFormGroup>>;
}
interface InstallmentDetailsFormControl {
  installmentDetailsArray: FormArray<FormGroup<InstallmentDetailsForm>>;
}
