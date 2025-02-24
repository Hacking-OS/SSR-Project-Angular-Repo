import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-demo-ng-prime',
    templateUrl: './demo-ng-prime.component.html',
    styleUrl: './demo-ng-prime.component.css',
    standalone: false
})
export class DemoNgPrimeComponent {
  formArray!: FormArray;
  demo!: FormGroup;
  totalRecords: number = 50;
  pageSize: number = 10; // Number of records per page
  constructor(private fb: FormBuilder) { }

  get item(): FormArray {
    return this.demo.get('item') as FormArray;
  }

  ngOnInit() {
    this.formArray = this.fb.array([]);
    this.demo = this.fb.group({
      item: this.fb.array([])
    });
    this.loadRecords({ first: 0, rows: 10 }); // Initial load
  }

  loadRecords(event: any) {
    this.formArray.clear(); // Clear the existing FormArray data
    this.item.clear(); // Clear the existing FormArray data
    // Mock data generation (replace with actual data fetch)
    for (let i = event.first; i < event.first + event.rows; i++) {

      this.formArray.push(this.fb.group({
        name: `Name ${i + 1}`,
        age: Math.floor(Math.random() * 60) + 18
      }));

      this.item.push(this.fb.group({
        name: `Name ${i + 1}`,
        age: Math.floor(Math.random() * 60) + 18
      }));
    }
  }
}
